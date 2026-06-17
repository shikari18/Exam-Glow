import { useState, useRef, useEffect, useCallback } from "react";
import {
  X, Send, Mic, MicOff, User, Volume2, VolumeX,
  Plus, History, Radio, Image as ImageIcon, Bot,
} from "lucide-react";
import { VoiceOrb } from "./VoiceOrb";
import { generateDiagramImage } from "@/lib/imageGen";
import { speakGemini, type GeminiSpeechHandle } from "@/lib/gemini-speech";

interface Message {
  role: "user" | "assistant";
  text: string;
  imageUrl?: string;
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

const SUGGESTIONS = [
  "Explain photosynthesis",
  "Help me with quadratic equations",
  "What is Newton's 3rd law?",
  "Summarise the carbon cycle",
];

const STORAGE_KEY = "examglow_ai_history_v2";
const INITIAL_MESSAGE: Message = {
  role: "assistant",
  text: "Hi! I'm **Yumna**, your personal ExamGlow AI tutor 🌸\n\nI'm here to help you truly understand your IGCSE subjects. Ask me anything — I'll explain concepts step-by-step, give you examples, and make sure you really *get it*!\n\nYou can also tap the 🎙️ button below to **switch to voice mode** and talk with me directly!",
};

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

const SYSTEM_PROMPT = `You are Yumna, an expert IGCSE tutor and AI assistant for ExamGlow. You are warm, encouraging, and extremely knowledgeable.

When answering questions, format your responses using this markdown syntax:
- Use **bold text** for key terms and important concepts
- Use *italic* for emphasis  
- Use ## for section headings
- Use ### for sub-headings
- Use numbered lists (1. 2. 3.) for steps or ordered content
- Use bullet points (- or •) for lists
- Use /n for new lines where needed
- Use ==highlight== to highlight critical facts
- Keep responses well-structured and easy to read

Include diagrams/images when helpful — if you want to show an educational diagram, include [IMAGE: detailed description of what the diagram should show] on its own line and I will generate it.

Be conversational, encouraging, and thorough. Break complex topics into digestible parts. Reference IGCSE mark-scheme language where relevant.`;

// ── Markdown renderer ──────────────────────────────────────────────────────────
function parseInline(text: string): React.ReactNode[] {
  if (!text) return [];
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|==\S[^=]*\S==|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    if (part.startsWith("==") && part.endsWith("=="))
      return <mark key={i} className="bg-primary/20 text-primary px-0.5 rounded text-[0.9em] not-italic font-semibold">{part.slice(2, -2)}</mark>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-foreground/80">{part.slice(1, -1)}</code>;
    return <span key={i}>{part}</span>;
  });
}

function renderMarkdown(text: string, isUser: boolean): React.ReactNode {
  // Normalize newlines and /n
  const normalized = text.replace(/\/n/g, "\n").replace(/\\n/g, "\n");
  const lines = normalized.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // ## Heading
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={i} className="font-bold text-base mt-3 mb-1 text-foreground">
          {parseInline(trimmed.slice(3))}
        </h3>
      );
      i++;
      continue;
    }

    // ### Sub-heading
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={i} className="font-semibold text-sm mt-2 mb-1 text-foreground">
          {parseInline(trimmed.slice(4))}
        </h4>
      );
      i++;
      continue;
    }

    // Numbered list — collect consecutive items
    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-1 my-2 ml-1">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2.5">
              <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${isUser ? "bg-white/20 text-white" : "bg-primary/15 text-primary"}`}>
                {j + 1}
              </span>
              <span className="flex-1 leading-relaxed">{parseInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list — collect consecutive items
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("• ") || lines[i].trim().startsWith("* "))) {
        items.push(lines[i].trim().replace(/^[-•*]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1 my-2 ml-1">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2.5">
              <span className={`shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${isUser ? "bg-white/60" : "bg-primary"}`} />
              <span className="flex-1 leading-relaxed">{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // [IMAGE: description] — image generation placeholder
    const imgMatch = trimmed.match(/^\[IMAGE:\s*(.+)\]$/i);
    if (imgMatch) {
      elements.push(<MessageImage key={i} prompt={imgMatch[1]} />);
      i++;
      continue;
    }

    // Catch AI outputting "Diagram: description" or "**Diagram:** description" as plain text
    const diagramTextMatch = trimmed.match(/^(?:\*\*)?Diagram:(?:\*\*)?\s+(.+)$/i);
    if (diagramTextMatch) {
      elements.push(<MessageImage key={i} prompt={diagramTextMatch[1]} />);
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="leading-relaxed my-1">
        {parseInline(trimmed)}
      </p>
    );
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

// ── Auto-generated image component (Gemini Imagen 3 → Pollinations fallback) ──
function MessageImage({ prompt }: { prompt: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSrc(null);
    setImgError(false);

    generateDiagramImage(prompt).then((url) => {
      if (!cancelled) {
        setSrc(url);
        // If it's a data URI it's already loaded; if URL we wait for <img> onLoad
        if (url.startsWith("data:")) setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [prompt]);

  return (
    <figure className="mt-3 rounded-2xl overflow-hidden border border-border bg-muted/20 shadow-sm">
      {loading && (
        <div className="h-40 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-violet-500/5 animate-pulse gap-2">
          <ImageIcon className="w-6 h-6 text-primary/40 animate-pulse" />
          <span className="text-[11px] text-foreground/40 font-medium">Generating diagram with Gemini AI...</span>
        </div>
      )}
      {src && !src.startsWith("data:") && (
        <img
          src={src}
          alt={prompt}
          className={`w-full object-contain max-h-72 ${loading ? "hidden" : "block"}`}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setImgError(true); }}
        />
      )}
      {src && src.startsWith("data:") && !imgError && (
        <img
          src={src}
          alt={prompt}
          className="w-full object-contain max-h-72 block"
          onError={() => setImgError(true)}
        />
      )}
      {imgError && (
        <div className="h-24 flex items-center justify-center text-xs text-foreground/40 gap-2">
          <ImageIcon className="w-4 h-4" /> Unable to generate diagram
        </div>
      )}
      <figcaption className="text-[10px] text-foreground/40 text-center px-3 py-2 italic border-t border-border bg-muted/10">
        📐 {prompt}
      </figcaption>
    </figure>
  );
}

// ── Typewriter text component ─────────────────────────────────────────────────
function TypewriterMessage({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    
    const speed = 12; // ms per char — "speed 2" feel
    const tick = () => {
      if (indexRef.current < text.length) {
        // Advance by 2-3 chars at once for speed
        const step = text[indexRef.current] === "\n" ? 1 : 2;
        indexRef.current = Math.min(indexRef.current + step, text.length);
        setDisplayed(text.slice(0, indexRef.current));
        timerRef.current = setTimeout(tick, speed);
      } else {
        onDone?.();
      }
    };
    timerRef.current = setTimeout(tick, speed);
    return () => clearTimeout(timerRef.current);
  }, [text]);

  return <>{renderMarkdown(displayed, false)}</>;
}

export function AiPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>(() => crypto.randomUUID());
  const [voiceOrbOpen, setVoiceOrbOpen] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const speechHandleRef = useRef<GeminiSpeechHandle | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Stop TTS speech on unmount/close
  useEffect(() => {
    return () => {
      speechHandleRef.current?.stop();
      speechHandleRef.current = null;
    };
  }, []);

  function sanitizeForSpeech(text: string): string {
    let clean = text.replace(/\/n/g, " ").replace(/\\n/g, " ");
    clean = clean.replace(/\[IMAGE:\s*[^\]]+\]/gi, "");
    clean = clean.replace(/\*\*([^*]+)\*\*/g, "$1");
    clean = clean.replace(/\*([^*]+)\*/g, "$1");
    clean = clean.replace(/==([^=]+)==/g, "$1");
    clean = clean.replace(/`([^`]+)`/g, "$1");
    clean = clean.replace(/#+\s+/g, "");
    return clean.trim();
  }

  function speakMessage(index: number, text: string) {
    if (speakingIndex === index) {
      speechHandleRef.current?.stop();
      speechHandleRef.current = null;
      setSpeakingIndex(null);
      return;
    }

    speechHandleRef.current?.stop();
    speechHandleRef.current = null;
    const sanitized = sanitizeForSpeech(text);
    setSpeakingIndex(index);
    speechHandleRef.current = speakGemini(sanitized, {
      onDone: () => setSpeakingIndex(null),
      onError: () => setSpeakingIndex(null),
    });
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatSession[];
      if (Array.isArray(parsed)) setChatHistory(parsed);
    } catch { /* ignore */ }
  }, []);

  function persistHistory(next: ChatSession[]) {
    setChatHistory(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [messages, isTyping]);

  useEffect(() => {
    if (!open) {
      recognitionRef.current?.stop();
      setListening(false);
      setHistoryOpen(false);
    }
  }, [open]);

  function titleFromMessages(msgs: Message[]) {
    const firstUser = msgs.find((m) => m.role === "user")?.text?.trim();
    if (!firstUser) return "New chat";
    return firstUser.length > 28 ? `${firstUser.slice(0, 28)}…` : firstUser;
  }

  function startNewChat() {
    const hasUser = messages.some((m) => m.role === "user");
    if (hasUser) {
      const session: ChatSession = {
        id: activeChatId,
        createdAt: Date.now(),
        title: titleFromMessages(messages),
        messages,
      };
      persistHistory([session, ...chatHistory]);
    }
    setActiveChatId(crypto.randomUUID());
    setMessages([INITIAL_MESSAGE]);
    setInput("");
    setIsTyping(false);
    setHistoryOpen(false);
  }

  function loadChat(session: ChatSession) {
    setActiveChatId(session.id);
    setMessages(session.messages);
    setHistoryOpen(false);
    setInput("");
  }

  async function simulateReply(userMsg: string) {
    setIsTyping(true);

    if (!GROQ_API_KEY || GROQ_API_KEY === "your_groq_api_key_here") {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "AI Tutor not configured. Add `VITE_GROQ_API_KEY` to `.env`." },
      ]);
      setIsTyping(false);
      return;
    }

    try {
      const history = messages
        .filter((m) => !m.isStreaming)
        .map((m) => ({ role: m.role, content: m.text }));

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history,
            { role: "user", content: userMsg },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? `API error ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

      // Add as streaming message
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", text: reply, isStreaming: true }]);
    } catch (error: any) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Sorry, something went wrong: ${error?.message ?? "Please try again."}` },
      ]);
    }
  }

  function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || isTyping) return;
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    simulateReply(msg);
  }

  function toggleVoice() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice input not supported. Try Chrome."); return; }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e: any) => { send(e.results[0][0].transcript); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Slide-up panel */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-50 flex flex-col bg-white rounded-t-3xl shadow-2xl border-t border-border transition-transform duration-400 ease-in-out`}
        style={{
          top: "64px",
          transform: open ? "translateY(0)" : "translateY(100%)",
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center border border-primary/30 shadow-sm">
              <span className="text-white text-sm font-bold">Y</span>
            </div>
            <div>
              <p className="font-bold text-sm">Yumna — AI Tutor</p>
              <p className="text-xs text-foreground/50">Your personal IGCSE study assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setVoiceOrbOpen(true)}
              className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20 text-primary border border-primary/20 transition-all"
              title="Live voice mode"
            >
              <Radio className="w-4 h-4" />
            </button>
            <button onClick={startNewChat} className="p-2 rounded-full hover:bg-muted transition-colors" title="New chat">
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={() => setHistoryOpen(true)} className="p-2 rounded-full hover:bg-muted transition-colors" title="Chat history">
              <History className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="relative flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {historyOpen && (
            <div className="absolute inset-0 bg-white z-10 flex flex-col p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-sm">Chat History</p>
                <button onClick={() => setHistoryOpen(false)} className="p-1.5 rounded-full hover:bg-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 overflow-y-auto flex-1">
                {chatHistory.length === 0 ? (
                  <p className="text-sm text-foreground/50 text-center py-8">No previous chats yet.</p>
                ) : (
                  chatHistory.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => loadChat(c)}
                      className="w-full text-left rounded-xl border border-border px-4 py-3 hover:bg-muted/40 transition-colors"
                    >
                      <p className="font-semibold text-sm">{c.title}</p>
                      <p className="text-xs text-foreground/40 mt-0.5">{new Date(c.createdAt).toLocaleString()}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                m.role === "assistant" ? "bg-gradient-to-br from-primary to-purple-500 text-white" : "bg-lavender-soft"
              }`}>
                {m.role === "assistant" ? "Y" : <User className="w-4 h-4 text-lavender" />}
              </div>
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div className={`rounded-2xl px-4 py-3 text-sm ${
                  m.role === "assistant"
                    ? "bg-pink-softer text-foreground rounded-tl-none"
                    : "bg-primary text-white rounded-tr-none"
                }`}>
                  {m.isStreaming ? (
                    <TypewriterMessage
                      text={m.text}
                      onDone={() => {
                        setMessages(prev => prev.map((msg, idx) =>
                          idx === i ? { ...msg, isStreaming: false } : msg
                        ));
                      }}
                    />
                  ) : (
                    renderMarkdown(m.text, m.role === "user")
                  )}
                  {m.imageUrl && (
                    <img src={m.imageUrl} alt="AI generated" className="mt-3 rounded-xl w-full max-h-48 object-contain border border-border" />
                  )}
                </div>
                
                {/* TTS Speaker pill */}
                {m.role === "assistant" && !m.isStreaming && (
                  <button
                    onClick={() => speakMessage(i, m.text)}
                    className={`flex items-center gap-1 self-start text-[10px] font-medium transition-colors px-2 py-0.5 rounded-full mt-0.5 border ${
                      speakingIndex === i
                        ? "bg-primary/15 text-primary border-primary/20 animate-pulse"
                        : "bg-muted/30 text-foreground/45 hover:text-primary hover:bg-primary/5 border-transparent"
                    }`}
                    title={speakingIndex === i ? "Stop speaking" : "Speak reply"}
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{speakingIndex === i ? "Stop" : "Listen"}</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">Y</span>
              </div>
              <div className="bg-pink-softer rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-5 pb-2 flex gap-2 flex-wrap shrink-0">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="px-3 py-1.5 rounded-full bg-pink-soft text-primary text-xs font-medium hover:bg-primary hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-5 py-4 border-t border-border shrink-0">
          <div className="flex items-center gap-3 bg-muted/40 rounded-2xl px-4 py-2.5 border border-border/50">
            <button
              onClick={toggleVoice}
              className={`p-1.5 rounded-full transition-colors shrink-0 ${listening ? "bg-primary text-white animate-pulse" : "text-foreground/40 hover:text-primary"}`}
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <input
              className="flex-1 bg-transparent outline-none text-sm py-0.5 placeholder:text-foreground/40"
              placeholder={listening ? "Listening…" : "Ask Yumna anything…"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || isTyping}
              className="p-1.5 rounded-full bg-primary text-white disabled:opacity-30 transition-opacity shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-[10px] text-foreground/30 mt-2">
            Yumna · ExamGlow AI ·{" "}
            <button onClick={() => setVoiceOrbOpen(true)} className="text-primary hover:underline">
              Switch to live voice ✨
            </button>
          </p>
        </div>
      </div>

      <VoiceOrb open={voiceOrbOpen} onClose={() => setVoiceOrbOpen(false)} />
    </>
  );
}
