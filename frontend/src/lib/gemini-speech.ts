/**
 * gemini-speech.ts
 * Speak text using Gemini Live audio (same voice engine as VoiceOrb).
 *
 * This is used for "Listen" buttons on AI replies so they sound consistent with Voice Sphere.
 */
export type GeminiSpeechHandle = {
  stop: () => void;
};

type SpeakOptions = {
  voiceName?: string; // e.g. "Aoede"
  onStart?: () => void;
  onDone?: () => void;
  onError?: (err: unknown) => void;
};

const GEMINI_VOICE_API_KEY =
  import.meta.env.VITE_GEMINI_VOICE_API_KEY || "";

let current: {
  ws: WebSocket | null;
  audioCtx: AudioContext | null;
  activeSources: AudioBufferSourceNode[];
  nextPlaybackTime: number;
} | null = null;

function stopCurrent() {
  if (!current) return;
  try {
    current.activeSources.forEach((s) => {
      try {
        s.stop();
      } catch {
        // ignore
      }
    });
  } finally {
    current.activeSources = [];
    current.nextPlaybackTime = 0;
    try {
      current.ws?.close();
    } catch {
      // ignore
    }
    current.ws = null;
    try {
      current.audioCtx?.close();
    } catch {
      // ignore
    }
    current.audioCtx = null;
    current = null;
  }
}

function base64ToInt16Array(b64: string): Int16Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Int16Array(bytes.buffer);
}

function schedulePlaybackChunk(ctx: AudioContext, chunk: Int16Array) {
  // Gemini live audio typically streams 24kHz PCM
  const sampleRate = 24000;

  const buffer = ctx.createBuffer(1, chunk.length, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < chunk.length; i++) channelData[i] = chunk[i] / 32768;

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);

  if (!current) return;
  current.activeSources.push(source);

  const now = ctx.currentTime;
  let startTime = current.nextPlaybackTime;
  if (startTime < now) startTime = now + 0.03; // small buffer to reduce stutter

  source.start(startTime);
  current.nextPlaybackTime = startTime + buffer.duration;

  source.onended = () => {
    if (!current) return;
    current.activeSources = current.activeSources.filter((s) => s !== source);
  };
}

/**
 * Speaks a block of text using Gemini Live Audio.
 * Only one active speech is supported at a time; calling speakGemini cancels the previous one.
 */
export function speakGemini(text: string, opts: SpeakOptions = {}): GeminiSpeechHandle {
  stopCurrent();

  const voiceName = opts.voiceName || (typeof localStorage !== "undefined" ? localStorage.getItem("examglow_voice") : null) || "Aoede";
  const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${GEMINI_VOICE_API_KEY}`;

  const ws = new WebSocket(wsUrl);
  const audioCtx = new AudioContext();

  current = {
    ws,
    audioCtx,
    activeSources: [],
    nextPlaybackTime: 0,
  };

  let setupDone = false;
  let turnComplete = false;

  const sendPrompt = () => {
    if (!current?.ws || current.ws.readyState !== WebSocket.OPEN) return;

    // Ask the model to output only speech audio for the provided text.
    current.ws.send(
      JSON.stringify({
        clientContent: {
          turns: [
            {
              role: "user",
              parts: [
                {
                  text:
                    "Read the following text aloud naturally. Do not add extra words. " +
                    "If the text contains markdown, ignore the markdown symbols and read it as normal speech.\n\n" +
                    text,
                },
              ],
            },
          ],
          turnComplete: true,
        },
      }),
    );
    opts.onStart?.();
  };

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        setup: {
          model: "models/gemini-2.5-flash-native-audio-latest",
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName } },
            },
          },
          systemInstruction: {
            parts: [
              {
                text:
                  "You are a text-to-speech engine. Output audio only. " +
                  "Do not include any additional commentary or formatting.",
              },
            ],
          },
        },
      }),
    );
  };

  ws.onmessage = async (event) => {
    try {
      let data: any;
      if (event.data instanceof Blob) {
        data = JSON.parse(await event.data.text());
      } else {
        data = JSON.parse(event.data);
      }

      if (data.setupComplete && !setupDone) {
        setupDone = true;
        sendPrompt();
        return;
      }

      const parts = data.serverContent?.modelTurn?.parts;
      if (Array.isArray(parts) && current?.audioCtx) {
        for (const part of parts) {
          if (part.inlineData?.mimeType?.startsWith("audio/pcm") && part.inlineData?.data) {
            const pcmData = base64ToInt16Array(part.inlineData.data);
            schedulePlaybackChunk(current.audioCtx, pcmData);
          }
        }
      }

      if (data.serverContent?.turnComplete) {
        turnComplete = true;
      }

      // End condition: server finished AND all queued audio has played
      if (turnComplete && (current?.activeSources?.length ?? 0) === 0) {
        opts.onDone?.();
        stopCurrent();
      }
    } catch (err) {
      opts.onError?.(err);
      stopCurrent();
    }
  };

  ws.onerror = (err) => {
    opts.onError?.(err);
    stopCurrent();
  };

  ws.onclose = () => {
    // If it closes early, treat as done only if we were already playing/finished.
    if (current) {
      // Keep it simple: if closed, stop everything.
      opts.onDone?.();
      stopCurrent();
    }
  };

  return { stop: stopCurrent };
}

