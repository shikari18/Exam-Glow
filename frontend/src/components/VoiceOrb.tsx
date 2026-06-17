import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, X, Volume2, VolumeX, Phone, PhoneOff } from "lucide-react";

const GEMINI_VOICE_API_KEY = import.meta.env.VITE_GEMINI_VOICE_API_KEY || "";

const YUMNA_SYSTEM_PROMPT = `You are Yumna, a warm, expert IGCSE tutor for ExamGlow. You speak naturally and conversationally — like a real tutor, not a robot. Keep your answers SHORT (2-4 sentences) since this is a live voice conversation. Be encouraging, clear, and friendly. Do NOT use any markdown, bullet points, asterisks, or special formatting. Speak as if you were talking face-to-face with a student aged 14-16.`;

interface VoiceOrbProps {
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "connecting" | "connected" | "listening" | "speaking" | "error";

function cleanThoughtText(text: string): string {
  if (!text) return "";
  let cleaned = text;
  cleaned = cleaned.replace(/\*\*(Initiating )?Thought Process\*\*[\s\S]*?(?=\*\*|$)/gi, "");
  cleaned = cleaned.replace(/\*\*Assessing Interruption[^*]*\*\*[\s\S]*?(?=\*\*|$)/gi, "");
  cleaned = cleaned.replace(/\*\*Clarifying Problem[^*]*\*\*[\s\S]*?(?=\*\*|$)/gi, "");
  cleaned = cleaned.replace(/<thought>[\s\S]*?<\/thought>/gi, "");
  return cleaned.trim();
}

export function VoiceOrb({ open, onClose }: VoiceOrbProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [lastReply, setLastReply] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const isPlayingRef = useRef(false);
  const nextPlaybackTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const hasReceivedTurnCompleteRef = useRef<boolean>(false);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (open) {
      connect();
    } else {
      cleanup();
    }
    return () => cleanup();
  }, [open]);

  // Volume meter animation
  useEffect(() => {
    if (!analyserRef.current) return;
    const buf = new Uint8Array(analyserRef.current.frequencyBinCount);
    const tick = () => {
      analyserRef.current?.getByteFrequencyData(buf);
      const avg = buf.reduce((s, v) => s + v, 0) / buf.length;
      setVolumeLevel(Math.min(avg / 128, 1));
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [status]);

  async function connect() {
    try {
      setStatus("connecting");
      setErrorMsg(null);

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
      }});
      micStreamRef.current = stream;

      // Setup AudioContext for mic capture
      const ctx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      // Connect WebSocket to Gemini Live API
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${GEMINI_VOICE_API_KEY}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        // Send setup message
        ws.send(JSON.stringify({
          setup: {
            model: "models/gemini-2.5-flash-native-audio-latest",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: (typeof localStorage !== "undefined" ? localStorage.getItem("examglow_voice") : null) || "Aoede" }
                }
              }
            },
            systemInstruction: {
              parts: [{ text: YUMNA_SYSTEM_PROMPT }]
            },
            // Snappy turn-taking configuration: make it reply immediately when user stops speaking
            realtimeInputConfig: {
              automaticActivityDetection: {
                disabled: false,
                startOfSpeechSensitivity: "START_SENSITIVITY_HIGH",
                endOfSpeechSensitivity: "END_SENSITIVITY_HIGH"
              }
            }
          }
        }));
      };

      ws.onmessage = async (event) => {
        try {
          let data;
          if (event.data instanceof Blob) {
            const text = await event.data.text();
            data = JSON.parse(text);
          } else {
            data = JSON.parse(event.data);
          }
          handleServerMessage(data);
        } catch (e) {
          console.error("WS parse error", e);
        }
      };

      ws.onerror = (e) => {
        console.error("WS error", e);
      };

      ws.onclose = (e) => {
        console.log(`WS closed: code=${e.code}, reason=${e.reason}`);
        if (status !== "idle") {
          if (e.code !== 1000) {
            setStatus("error");
            setErrorMsg(`Connection closed (Code ${e.code}): ${e.reason || "Check API Key and model configuration"}`);
          } else {
            setStatus("idle");
          }
        }
      };

      // Setup ScriptProcessor for mic → websocket
      const processor = ctx.createScriptProcessor(1024, 1, 1);
      processorRef.current = processor;
      source.connect(processor);
      processor.connect(ctx.destination);

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || isMuted) return;
        const float32 = e.inputBuffer.getChannelData(0);
        const int16 = float32ToInt16(float32);
        const b64 = arrayBufferToBase64(int16.buffer);
        wsRef.current.send(JSON.stringify({
          realtimeInput: {
            mediaChunks: [{ mimeType: "audio/pcm;rate=16000", data: b64 }]
          }
        }));
      };

      setStatus("connected");
    } catch (err: any) {
      console.error("Connect error:", err);
      setStatus("error");
      setErrorMsg(err.message || "Failed to access microphone.");
    }
  }

  function stopPlayback() {
    activeSourcesRef.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    activeSourcesRef.current = [];
    nextPlaybackTimeRef.current = 0;
    isPlayingRef.current = false;
  }

  function schedulePlaybackChunk(chunk: Int16Array) {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    isPlayingRef.current = true;
    const sampleRate = 24000; // Gemini outputs at 24kHz
    const buffer = ctx.createBuffer(1, chunk.length, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < chunk.length; i++) {
      channelData[i] = chunk[i] / 32768;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    if (analyserRef.current) {
      source.connect(analyserRef.current);
    }

    activeSourcesRef.current.push(source);

    const now = ctx.currentTime;
    let startTime = nextPlaybackTimeRef.current;

    // If we're behind or starting fresh, schedule slightly in the future to avoid stutter
    if (startTime < now) {
      startTime = now + 0.03;
    }

    source.start(startTime);
    nextPlaybackTimeRef.current = startTime + buffer.duration;

    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
      checkIfPlaybackFinished();
    };
  }

  function checkIfPlaybackFinished() {
    if (activeSourcesRef.current.length === 0 && hasReceivedTurnCompleteRef.current) {
      isPlayingRef.current = false;
      setStatus("listening");
      setTranscript("");
    }
  }

  function handleServerMessage(data: any) {
    // Setup complete
    if (data.setupComplete) {
      setStatus("listening");
      return;
    }

    // Interrupted by user speech or another turn interruption
    if (data.serverContent?.interrupted) {
      stopPlayback();
      setStatus("listening");
      setTranscript("");
      hasReceivedTurnCompleteRef.current = true;
      return;
    }

    // Transcript from user
    if (data.serverContent?.inputTranscription?.text) {
      setTranscript(data.serverContent.inputTranscription.text);
      hasReceivedTurnCompleteRef.current = false;
      setLastReply("");
      stopPlayback();
    }

    // Model reply text
    if (data.serverContent?.outputTranscription?.text) {
      setLastReply(prev => prev + data.serverContent.outputTranscription.text);
    }

    // Audio chunks from model
    const parts = data.serverContent?.modelTurn?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.mimeType?.startsWith("audio/pcm") && part.inlineData?.data) {
          setStatus("speaking");
          const pcmData = base64ToInt16Array(part.inlineData.data);
          schedulePlaybackChunk(pcmData);
        }
        if (part.text) {
          setLastReply(prev => prev + part.text);
        }
      }
    }

    // Turn complete
    if (data.serverContent?.turnComplete) {
      hasReceivedTurnCompleteRef.current = true;
      checkIfPlaybackFinished();
    }
  }

  function cleanup() {
    stopPlayback();
    processorRef.current?.disconnect();
    processorRef.current = null;
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    micStreamRef.current = null;
    wsRef.current?.close();
    wsRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    cancelAnimationFrame(animFrameRef.current);
    setStatus("idle");
    setTranscript("");
    setLastReply("");
    setVolumeLevel(0);
  }

  function float32ToInt16(float32: Float32Array): Int16Array {
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16;
  }

  function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function base64ToInt16Array(b64: string): Int16Array {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Int16Array(bytes.buffer);
  }

  if (!open) return null;

  const orbScale = status === "speaking" ? 1 + volumeLevel * 0.3 :
                   status === "listening" ? 1 + volumeLevel * 0.15 : 1;

  const orbGlow = status === "speaking"
    ? `0 0 ${60 + volumeLevel * 80}px rgba(139, 92, 246, ${0.5 + volumeLevel * 0.4}), 0 0 ${120 + volumeLevel * 120}px rgba(139, 92, 246, 0.25)`
    : status === "listening"
    ? `0 0 ${40 + volumeLevel * 60}px rgba(236, 72, 153, ${0.4 + volumeLevel * 0.4}), 0 0 80px rgba(236, 72, 153, 0.2)`
    : status === "connecting"
    ? "0 0 40px rgba(59, 130, 246, 0.5)"
    : "0 0 20px rgba(0,0,0,0.4)";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ pointerEvents: "auto" }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 select-none">
        {/* Close */}
        <button onClick={onClose} className="absolute -top-4 right-0 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
          <X className="w-6 h-6" />
        </button>

        {/* Label */}
        <div className="text-center">
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">AI Voice Tutor</p>
          <h2 className="text-white text-3xl font-bold">Yumna</h2>
          <p className="text-white/30 text-xs mt-1">Powered by Gemini 2.5 Flash • Live Audio</p>
        </div>

        {/* Orb */}
        <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
          {/* Pulse rings */}
          {(status === "listening" || status === "speaking") && (
            <>
              <div className={`absolute rounded-full opacity-20 animate-ping ${
                status === "speaking" ? "bg-violet-500" : "bg-pink-500"
              }`} style={{ width: 200 + volumeLevel * 60, height: 200 + volumeLevel * 60, maxWidth: 300, maxHeight: 300 }} />
              <div className={`absolute rounded-full opacity-30 animate-pulse ${
                status === "speaking" ? "bg-violet-400" : "bg-pink-400"
              }`} style={{ width: 170 + volumeLevel * 40, height: 170 + volumeLevel * 40 }} />
            </>
          )}
          {status === "connecting" && (
            <div className="absolute w-52 h-52 rounded-full border-4 border-blue-400/30 border-t-blue-400 animate-spin" />
          )}

          {/* Main orb */}
          <div
            className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer ${
              status === "speaking" ? "bg-gradient-to-br from-violet-400 via-purple-500 to-violet-700"
              : status === "listening" ? "bg-gradient-to-br from-pink-400 via-rose-500 to-pink-700"
              : status === "connecting" ? "bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600"
              : status === "error" ? "bg-gradient-to-br from-red-500 to-rose-700"
              : "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900"
            }`}
            style={{ transform: `scale(${orbScale})`, boxShadow: orbGlow }}
            onClick={() => status === "connected" || status === "listening" || status === "speaking" ? setIsMuted(m => !m) : undefined}
          >
            {status === "speaking" && (
              <div className="flex items-end gap-1 h-10">
                {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6].map((h, i) => (
                  <div key={i} className="w-1.5 bg-white/90 rounded-full animate-bounce"
                    style={{ height: `${h * 32 + volumeLevel * 10}px`, animationDelay: `${i * 80}ms`, animationDuration: "0.5s" }} />
                ))}
              </div>
            )}
            {status === "listening" && !isMuted && (
              <Mic className="w-14 h-14 text-white" />
            )}
            {status === "listening" && isMuted && (
              <MicOff className="w-14 h-14 text-white/60" />
            )}
            {status === "connecting" && (
              <div className="flex gap-2">
                {[0, 150, 300].map((d, i) => (
                  <div key={i} className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            )}
            {status === "idle" && <Mic className="w-14 h-14 text-white/50" />}
            {status === "error" && <span className="text-white text-3xl">!</span>}
          </div>
        </div>

        {/* Status text */}
        <div className="text-center min-h-[44px] flex flex-col items-center justify-center gap-1">
          {status === "connecting" && <p className="text-blue-300 text-sm animate-pulse">Connecting to Yumna...</p>}
          {status === "listening" && !isMuted && <p className="text-pink-300 text-sm font-medium animate-pulse">🎙️ Speak now — Yumna is listening</p>}
          {status === "listening" && isMuted && <p className="text-white/40 text-sm">Microphone muted</p>}
          {status === "speaking" && <p className="text-violet-300 text-sm font-medium animate-pulse">🔊 Yumna is speaking...</p>}
          {status === "idle" && <p className="text-white/40 text-sm">Session ended</p>}
          {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}
        </div>

        {/* Transcript bubble */}
        {transcript && status !== "speaking" && (
          <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 max-w-sm text-center">
            <p className="text-white/70 text-sm italic">"{transcript}"</p>
          </div>
        )}

        {/* Last reply bubble */}
        {cleanThoughtText(lastReply) && status !== "listening" && status !== "speaking" && (
          <div className="bg-violet-500/20 border border-violet-400/30 backdrop-blur-sm rounded-2xl px-5 py-4 max-w-sm text-center">
            <p className="text-xs font-semibold text-violet-300/70 uppercase tracking-wide mb-1.5">✨ Yumna</p>
            <p className="text-white text-sm leading-relaxed">{cleanThoughtText(lastReply)}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMuted(m => !m)}
            className={`p-3 rounded-full transition-colors ${
              isMuted ? "bg-red-500/30 text-red-400 border border-red-500/40" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title={isMuted ? "Unmute" : "Mute microphone"}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => { cleanup(); onClose(); }}
            className="p-3 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 transition-colors"
            title="End call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        {status === "error" && (
          <button
            onClick={connect}
            className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
