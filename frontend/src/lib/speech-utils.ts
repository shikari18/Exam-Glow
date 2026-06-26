import { speakGemini, prepareGeminiSpeech, playPreparedSpeech, type GeminiSpeechHandle, type PreparedSpeech } from "./gemini-speech";

export type SpeechTurn = {
  text: string;
  speaker: string;
  gender: "male" | "female";
};

type SpeechController = {
  stop: () => void;
};

// Global reference for active synthesis
let activeGeminiSpeech: GeminiSpeechHandle | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function stopAllSpeech() {
  if (activeGeminiSpeech) {
    try { activeGeminiSpeech.stop(); } catch { /* ignore */ }
    activeGeminiSpeech = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
  }
  activeUtterance = null;
}

/** Strip markdown and cleanup text for TTS */
export function sanitizeTextForTTS(text: string): string {
  let clean = text.replace(/\/n/g, " ").replace(/\\n/g, " ");
  clean = clean.replace(/\[IMAGE:\s*[^\]]+\]/gi, "");
  clean = clean.replace(/\*\*([^*]+)\*\*/g, "$1");
  clean = clean.replace(/\*([^*]+)\*/g, "$1");
  clean = clean.replace(/==([^=]+)==/g, "$1");
  clean = clean.replace(/`([^`]+)`/g, "$1");
  clean = clean.replace(/#+\s+/g, "");
  return clean.trim();
}

/** Pick a browser voice by gender */
function getBrowserSpeechVoice(gender: "male" | "female"): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const nameQuery =
    gender === "male"
      ? ["david", "daniel", "google uk english male", "male", "mark", "ravi"]
      : ["zira", "google uk english female", "female", "hazel", "susan", "heera"];

  for (const q of nameQuery) {
    const found = voices.find((v) => v.name.toLowerCase().includes(q));
    if (found) return found;
  }
  const langMatch = voices.find((v) => v.lang.startsWith("en"));
  return langMatch || voices[0];
}

/**
 * Browser speech fallback — splits text into ≤200-char sentence chunks to work
 * around the Chrome/Windows bug where SpeechSynthesisUtterance.onend doesn't
 * fire for long texts.
 */
function speakBrowserFallback(
  text: string,
  gender: "male" | "female",
  onDone: () => void
) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    setTimeout(onDone, 100);
    return;
  }

  window.speechSynthesis.cancel();

  // Split into sentence-sized chunks (≤220 chars). Chrome reliably fires
  // onend for short utterances; long ones can silently drop the event.
  const raw = text.match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) || [text];
  const chunks: string[] = [];
  let buf = "";
  for (const s of raw) {
    const next = buf ? `${buf} ${s}` : s;
    if (next.length > 220 && buf.length > 0) {
      chunks.push(buf);
      buf = s;
    } else {
      buf = next;
    }
  }
  if (buf) chunks.push(buf);
  if (chunks.length === 0) chunks.push(text);

  let idx = 0;
  let hasEnded = false;

  const end = () => {
    if (hasEnded) return;
    hasEnded = true;
    activeUtterance = null;
    onDone();
  };

  const speakChunk = () => {
    if (hasEnded) return;
    if (idx >= chunks.length) { end(); return; }

    const utt = new SpeechSynthesisUtterance(chunks[idx]);
    const voice = getBrowserSpeechVoice(gender);
    if (voice) utt.voice = voice;
    utt.rate = 0.93;
    utt.pitch = gender === "female" ? 1.08 : 0.72;

    utt.onend = () => {
      if (activeUtterance === utt) activeUtterance = null;
      idx++;
      setTimeout(speakChunk, 60); // tiny gap between sentences for naturalness
    };

    utt.onerror = (ev) => {
      const errType = (ev as SpeechSynthesisErrorEvent).error;
      if (errType === "interrupted" || errType === "canceled") return; // ignore cancel signals
      if (activeUtterance === utt) activeUtterance = null;
      end();
    };

    activeUtterance = utt;
    window.speechSynthesis.speak(utt);
  };

  // Small delay after cancel() before speaking — fixes Chrome stall on Windows
  setTimeout(speakChunk, 60);
}

/**
 * Speaks one turn of text. Tries Gemini Live first, falls back to browser TTS.
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
  const geminiVoice =
    gender === "male"
      ? "Fenrir"
      : (typeof localStorage !== "undefined"
          ? localStorage.getItem("examglow_voice")
          : null) || "Aoede";
  const apiKey = import.meta.env.VITE_GEMINI_VOICE_API_KEY || "";

  let hasEnded = false;
  const finish = () => {
    if (hasEnded) return;
    hasEnded = true;
    onDone();
  };

  if (apiKey) {
    try {
      onStart();
      if (prepared) {
        activeGeminiSpeech = playPreparedSpeech(
          prepared,
          {
            onStart: () => {},
            onDone: () => {
              activeGeminiSpeech = null;
              finish();
            },
            onError: () => {
              activeGeminiSpeech = null;
              speakBrowserFallback(sanitized, gender, finish);
            },
          }
        );
      } else {
        activeGeminiSpeech = speakGemini(
          sanitized,
          {
            voiceName: geminiVoice,
            onStart: () => {},
            onDone: () => {
              activeGeminiSpeech = null;
              finish();
            },
            onError: () => {
              activeGeminiSpeech = null;
              speakBrowserFallback(sanitized, gender, finish);
            },
          }
        );
      }
      return {
        stop: () => {
          stopAllSpeech();
          finish();
        },
      };
    } catch {
      // fall through to browser
    }
  }

  onStart();
  speakBrowserFallback(sanitized, gender, finish);
  return {
    stop: () => {
      stopAllSpeech();
      finish();
    },
  };
}

/**
 * Internal implementation of speech conversation player.
 * @param stopFirst - if true, calls stopAllSpeech() before starting
 */
function _playSpeechConversationImpl(
  turns: SpeechTurn[],
  onTurnStart: (turnIndex: number) => void,
  onComplete: () => void,
  stopFirst: boolean
): SpeechController {
  if (stopFirst) stopAllSpeech();

  let currentTurnIndex = 0;
  let stopped = false;
  let activeController: SpeechController | null = null;
  let watchdogTimer: ReturnType<typeof setTimeout> | null = null;
  const apiKey = import.meta.env.VITE_GEMINI_VOICE_API_KEY || "";

  const preConnectedList: (PreparedSpeech | null)[] = new Array(turns.length).fill(null);

  const preConnectTurn = (idx: number) => {
    if (!apiKey || idx >= turns.length || preConnectedList[idx]) return;
    const turn = turns[idx];
    const voice =
      turn.gender === "male"
        ? "Fenrir"
        : (typeof localStorage !== "undefined"
            ? localStorage.getItem("examglow_voice")
            : null) || "Aoede";
    try {
      preConnectedList[idx] = prepareGeminiSpeech(turn.text, voice);
    } catch (e) {
      console.error("Failed to preconnect turn", idx, e);
    }
  };

  // Preconnect all turns immediately in parallel for zero latency
  for (let i = 0; i < turns.length; i++) {
    preConnectTurn(i);
  }

  const cleanupSockets = () => {
    if (watchdogTimer) {
      clearTimeout(watchdogTimer);
      watchdogTimer = null;
    }
    preConnectedList.forEach((p) => {
      if (p) {
        try { p.ws.close(); } catch { /* ignore */ }
        try { p.audioCtx.close(); } catch { /* ignore */ }
      }
    });
  };

  const speakNext = () => {
    if (watchdogTimer) {
      clearTimeout(watchdogTimer);
      watchdogTimer = null;
    }

    if (stopped || currentTurnIndex >= turns.length) {
      cleanupSockets();
      if (!stopped) onComplete();
      return;
    }

    const turn = turns[currentTurnIndex];
    onTurnStart(currentTurnIndex);

    // Set safety watchdog timer (approx reading speed + 7 seconds buffer)
    const timeoutDuration = Math.max(12000, turn.text.length * 100 + 7000);
    watchdogTimer = setTimeout(() => {
      console.warn(`[Speech Watchdog] Turn ${currentTurnIndex} stalled after ${timeoutDuration}ms. Auto-advancing.`);
      if (activeController) {
        try { activeController.stop(); } catch { /* ignore */ }
      }
      currentTurnIndex++;
      speakNext();
    }, timeoutDuration);

    const prepared = preConnectedList[currentTurnIndex] || undefined;
    if (prepared) preConnectedList[currentTurnIndex] = null;

    activeController = speakSingleTurn(
      turn.text,
      turn.gender,
      () => {},
      () => {
        if (watchdogTimer) {
          clearTimeout(watchdogTimer);
          watchdogTimer = null;
        }
        if (stopped) return;
        currentTurnIndex++;
        // Very fast speaker turn transition gap (80ms instead of 200ms) for professional podcast flow
        setTimeout(speakNext, 80);
      },
      prepared
    );
  };

  speakNext();

  return {
    stop: () => {
      stopped = true;
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
        watchdogTimer = null;
      }
      if (activeController) activeController.stop();
      stopAllSpeech();
      cleanupSockets();
      onComplete();
    },
  };
}

/**
 * Plays a sequence of speech turns one after another.
 * Each turn fires onTurnStart, then when done the next starts.
 * Uses pre-connected Gemini sockets with pre-buffered audio stream chunks for minimum latency.
 */
export function playSpeechConversation(
  turns: SpeechTurn[],
  onTurnStart: (turnIndex: number) => void,
  onComplete: () => void
): SpeechController {
  return _playSpeechConversationImpl(turns, onTurnStart, onComplete, true);
}

/**
 * Like playSpeechConversation but does NOT call stopAllSpeech() first.
 * Use this when you are chaining pages sequentially and already managing
 * the previous audio controller yourself.
 */
export function playSpeechConversationChained(
  turns: SpeechTurn[],
  onTurnStart: (turnIndex: number) => void,
  onComplete: () => void
): SpeechController {
  return _playSpeechConversationImpl(turns, onTurnStart, onComplete, false);
}
