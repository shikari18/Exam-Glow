import { speakGemini, prepareGeminiSpeech, type GeminiSpeechHandle, type PreparedSpeech } from "./gemini-speech";

export type SpeechTurn = {
  text: string;
  speaker: string; // e.g. "Dr. AI Smith" or "Prof. AI Jones"
  gender: "male" | "female";
};

type SpeechController = {
  stop: () => void;
};

// Global reference for active synthesis to ensure cancellation
let activeGeminiSpeech: GeminiSpeechHandle | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function stopAllSpeech() {
  if (activeGeminiSpeech) {
    try {
      activeGeminiSpeech.stop();
    } catch (e) {
      // Ignore
    }
    activeGeminiSpeech = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore
    }
  }
  activeUtterance = null;
}

/**
 * Clean up text for TTS (removing markdown symbols, brackets, code blocks)
 */
export function sanitizeTextForTTS(text: string): string {
  let clean = text.replace(/\/n/g, " ").replace(/\\n/g, " ");
  // Strip image blocks
  clean = clean.replace(/\[IMAGE:\s*[^\]]+\]/gi, "");
  // Strip markdown styling
  clean = clean.replace(/\*\*([^*]+)\*\*/g, "$1");
  clean = clean.replace(/\*([^*]+)\*/g, "$1");
  clean = clean.replace(/==([^=]+)==/g, "$1");
  clean = clean.replace(/`([^`]+)`/g, "$1");
  clean = clean.replace(/#+\s+/g, "");
  return clean.trim();
}

/**
 * Gets a browser speech voice by gender
 */
function getBrowserSpeechVoice(gender: "male" | "female"): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const nameQuery = gender === "male" 
    ? ["david", "daniel", "google uk english male", "male", "mark", "ravi"]
    : ["zira", "google uk english female", "female", "hazel", "susan", "heera"];

  // Try finding by name patterns
  for (const q of nameQuery) {
    const found = voices.find(v => v.name.toLowerCase().includes(q));
    if (found) return found;
  }

  // Fallback: choose first matching lang if possible, or any
  const langMatch = voices.find(v => v.lang.startsWith("en"));
  return langMatch || voices[0];
}

/**
 * Speaks a single turn of text. Falls back to window.speechSynthesis if Gemini fails.
 */
export function speakSingleTurn(
  text: string,
  gender: "male" | "female",
  onStart: () => void,
  onDone: () => void,
  prepared?: PreparedSpeech
): SpeechController {
  stopAllSpeech();

  const sanitized = sanitizeTextForTTS(text);
  const geminiVoice = gender === "male" 
    ? "Fenrir" 
    : (typeof localStorage !== "undefined" ? localStorage.getItem("examglow_voice") : null) || "Aoede";
  const apiKey = import.meta.env.VITE_GEMINI_VOICE_API_KEY || "";

  let hasEnded = false;
  const finish = () => {
    if (hasEnded) return;
    hasEnded = true;
    onDone();
  };

  // 1. Try Gemini Speech first if API Key is configured
  if (apiKey) {
    try {
      onStart();
      activeGeminiSpeech = speakGemini(sanitized, {
        voiceName: geminiVoice,
        onStart: () => {},
        onDone: () => {
          activeGeminiSpeech = null;
          finish();
        },
        onError: () => {
          activeGeminiSpeech = null;
          // Trigger fallback on error
          speakBrowserFallback(sanitized, gender, finish);
        }
      }, prepared);

      return {
        stop: () => {
          stopAllSpeech();
          finish();
        }
      };
    } catch (e) {
      // Fallback
    }
  }

  // 2. Browser speech fallback
  onStart();
  speakBrowserFallback(sanitized, gender, finish);

  return {
    stop: () => {
      stopAllSpeech();
      finish();
    }
  };
}

function speakBrowserFallback(text: string, gender: "male" | "female", onDone: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onDone();
    return;
  }

  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getBrowserSpeechVoice(gender);
  if (voice) {
    utterance.voice = voice;
  }
  
  // Set speech rate slightly slower for clearer academic reading
  utterance.rate = 0.95; 

  utterance.onend = () => {
    if (activeUtterance === utterance) {
      activeUtterance = null;
    }
    onDone();
  };

  utterance.onerror = () => {
    if (activeUtterance === utterance) {
      activeUtterance = null;
    }
    onDone();
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

/**
 * Runs a sequence of speech turns (a conversation/debate)
 */
export function playSpeechConversation(
  turns: SpeechTurn[],
  onTurnStart: (turnIndex: number) => void,
  onComplete: () => void
): SpeechController {
  stopAllSpeech();
  
  let currentTurnIndex = 0;
  let activeController: SpeechController | null = null;
  const apiKey = import.meta.env.VITE_GEMINI_VOICE_API_KEY || "";

  // A list of pre-connected speech sockets matching indices
  const preConnectedList: (PreparedSpeech | null)[] = new Array(turns.length).fill(null);

  // Helper to preconnect a turn
  const preConnectTurn = (idx: number) => {
    if (!apiKey || idx >= turns.length || preConnectedList[idx]) return;
    const turn = turns[idx];
    const voice = turn.gender === "male" 
      ? "Fenrir" 
      : (typeof localStorage !== "undefined" ? localStorage.getItem("examglow_voice") : null) || "Aoede";
    try {
      preConnectedList[idx] = prepareGeminiSpeech(voice);
    } catch (e) {
      console.error("Failed to preconnect turn", idx, e);
    }
  };

  // Preconnect first two turns
  preConnectTurn(0);
  preConnectTurn(1);

  const speakNext = () => {
    if (currentTurnIndex >= turns.length) {
      // Clean up any unused sockets
      preConnectedList.forEach(p => {
        if (p) {
          try { p.ws.close(); } catch {}
          try { p.audioCtx.close(); } catch {}
        }
      });
      onComplete();
      return;
    }

    const turn = turns[currentTurnIndex];
    onTurnStart(currentTurnIndex);

    // Get the pre-connected speech structure for this turn (if any)
    const prepared = preConnectedList[currentTurnIndex] || undefined;
    if (prepared) {
      preConnectedList[currentTurnIndex] = null; // consume it
    }

    // Preconnect next turn (current + 2) in background
    preConnectTurn(currentTurnIndex + 2);

    activeController = speakSingleTurn(
      turn.text,
      turn.gender,
      () => {},
      () => {
        currentTurnIndex++;
        speakNext();
      },
      prepared
    );
  };

  // Trigger speech sequence
  speakNext();

  return {
    stop: () => {
      if (activeController) {
        activeController.stop();
      }
      stopAllSpeech();
      // Close all preconnected sockets
      preConnectedList.forEach(p => {
        if (p) {
          try { p.ws.close(); } catch {}
          try { p.audioCtx.close(); } catch {}
        }
      });
      onComplete();
    }
  };
}
