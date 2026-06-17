import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Mic, MicOff, Image as ImageIcon, ChevronDown, Volume2 } from "lucide-react";
import { generateDiagramImage } from "@/lib/imageGen";
import { speakGemini, type GeminiSpeechHandle } from "@/lib/gemini-speech";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_VOICE_API_KEY || "";
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

interface NoteAiMessage {
  role: "user" | "assistant";
  text: string;
  isStreaming?: boolean;
}

interface NoteAiChatProps {
  noteTitle: string;
  noteSubject?: string;
  noteContext?: string; // summary or key topics from the note
}

// ── Inline markdown parser ─────────────────────────────────────────────────────
function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|==\S[^=]*\S==|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    if (part.startsWith("==") && part.endsWith("=="))
      return <mark key={i} className="bg-primary/20 text-primary px-0.5 rounded text-[0.9em] font-semibold not-italic">{part.slice(2, -2)}</mark>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    return <span key={i}>{part}</span>;
  });
}

function renderNote(text: string): React.ReactNode {
  const normalized = text.replace(/\/n/g, "\n").replace(/\\n/g, "\n");
  const lines = normalized.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { i++; continue; }

    if (trimmed.startsWith("## ")) {
      elements.push(<h3 key={i} className="font-bold text-sm mt-3 mb-1 text-foreground">{parseInline(trimmed.slice(3))}</h3>);
      i++; continue;
    }
    if (trimmed.startsWith("### ")) {
      elements.push(<h4 key={i} className="font-semibold text-xs mt-2 mb-0.5 text-foreground">{parseInline(trimmed.slice(4))}</h4>);
      i++; continue;
    }

    // Markdown Table parsing
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      
      const parsedRows = tableLines
        .map(line => line.split("|").map(cell => cell.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1))
        .filter(row => !row.every(cell => cell.startsWith("---") || cell.startsWith(":-") || cell.startsWith("-:")));
      
      if (parsedRows.length > 0) {
        const headers = parsedRows[0];
        const bodyRows = parsedRows.slice(1);
        elements.push(
          <div key={`table${i}`} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm my-3 max-w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/85">
                <thead className="bg-muted/40 border-b border-border text-foreground font-bold">
                  <tr>
                    {headers.map((h, j) => (
                      <th key={j} className="px-4 py-2 text-xs font-semibold">
                        {parseInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white text-foreground/80">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-muted/10 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-2 text-xs leading-relaxed">
                          {parseInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        continue;
      }
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol${i}`} className="space-y-1 my-1.5">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2">
              <span className="shrink-0 w-4 h-4 rounded-full bg-primary/15 text-primary text-[9px] font-bold flex items-center justify-center mt-0.5">{j + 1}</span>
              <span className="flex-1 text-xs leading-relaxed">{parseInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullets
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("• ") || lines[i].trim().startsWith("* "))) {
        items.push(lines[i].trim().replace(/^[-•*]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul${i}`} className="space-y-1 my-1.5">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
              <span className="flex-1 text-xs leading-relaxed">{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // [IMAGE: ...]
    const imgMatch = trimmed.match(/^\[IMAGE:\s*(.+)\]$/i);
    if (imgMatch) {
      elements.push(<NoteImage key={i} prompt={imgMatch[1]} />);
      i++; continue;
    }

    // Catch AI outputting "Diagram: description" or "**Diagram:** description" as plain text
    const diagramTextMatch = trimmed.match(/^(?:\*\*)?Diagram:(?:\*\*)?\s+(.+)$/i);
    if (diagramTextMatch) {
      elements.push(<NoteImage key={i} prompt={diagramTextMatch[1]} />);
      i++; continue;
    }

    elements.push(<p key={i} className="text-xs leading-relaxed my-0.5">{parseInline(trimmed)}</p>);
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function NoteImage({ prompt }: { prompt: string }) {
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
        if (url.startsWith("data:")) setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [prompt]);

  return (
    <figure className="mt-2 rounded-xl overflow-hidden border border-border shadow-sm">
      {loading && (
        <div className="h-28 bg-gradient-to-br from-primary/5 to-violet-500/5 animate-pulse flex flex-col items-center justify-center gap-1.5">
          <ImageIcon className="w-5 h-5 text-primary/40 animate-pulse" />
          <span className="text-[10px] text-foreground/40">Generating with Gemini AI...</span>
        </div>
      )}
      {src && !src.startsWith("data:") && (
        <img
          src={src}
          alt={prompt}
          className={`w-full object-contain max-h-52 ${loading ? "hidden" : "block"}`}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setImgError(true); }}
        />
      )}
      {src && src.startsWith("data:") && !imgError && (
        <img
          src={src}
          alt={prompt}
          className="w-full object-contain max-h-52 block"
          onError={() => setImgError(true)}
        />
      )}
      {imgError && (
        <div className="h-16 flex items-center justify-center text-[10px] text-foreground/40 gap-1">
          <ImageIcon className="w-3 h-3" /> Unable to generate diagram
        </div>
      )}
      <figcaption className="text-[9px] text-foreground/40 text-center px-2 py-1.5 italic border-t border-border bg-muted/10">
        📐 {prompt}
      </figcaption>
    </figure>
  );
}

// ── Typewriter ─────────────────────────────────────────────────────────────────
function TypewriterText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [shown, setShown] = useState("");
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    idxRef.current = 0;
    setShown("");
    const tick = () => {
      if (idxRef.current < text.length) {
        idxRef.current = Math.min(idxRef.current + 2, text.length);
        setShown(text.slice(0, idxRef.current));
        timerRef.current = setTimeout(tick, 12);
      } else {
        onDone?.();
      }
    };
    timerRef.current = setTimeout(tick, 10);
    return () => clearTimeout(timerRef.current);
  }, [text]);

  return <>{renderNote(shown)}</>;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function NoteAiChat({ noteTitle, noteSubject, noteContext }: NoteAiChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<NoteAiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const speechHandleRef = useRef<GeminiSpeechHandle | null>(null);

  // Stop TTS speech on unmount/close
  useEffect(() => {
    return () => {
      speechHandleRef.current?.stop();
      speechHandleRef.current = null;
    };
  }, []);

  function sanitizeForSpeech(text: string): string {
    let clean = text.replace(/\/n/g, " ").replace(/\\n/g, " ");
    // Strip image blocks
    clean = clean.replace(/\[IMAGE:\s*[^\]]+\]/gi, "");
    // Strip markdown characters
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

  // Initial greeting
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        text: `Hi! I'm Yumna 🌸 Ask me anything about **${noteTitle}** — I'll explain, clarify, or go deeper on any part of this note.`,
        isStreaming: true,
      }]);
    }
  }, [open]);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [messages, loading]);

  const systemPrompt = `You are Yumna, an expert IGCSE tutor. The student is currently reading notes about "${noteTitle}"${noteSubject ? ` in ${noteSubject}` : ""}.
${noteContext ? `\nNote context: ${noteContext}` : ""}

Answer questions SPECIFICALLY about this topic. Use rich formatting:
- **bold** for key terms
- ## for headings, ### for sub-headings  
- Numbered lists (1. 2. 3.) for steps
- Bullet points (- item) for lists
- ==highlight== for critical facts
- /n for new paragraphs

If explaining any scientific processes, structures, cycles, comparisons, or concepts, you MUST include a [IMAGE: detailed description of the educational diagram] block on its own line so the system can render a real diagram for the student. Do not forget to generate a diagram; diagrams are required.

Be thorough but concise. Reference IGCSE exam context.`;

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const history = messages
        .filter(m => !m.isStreaming)
        .map(m => ({ role: m.role, content: m.text }));

      // Try Gemini first, fallback to Groq
      let reply = "";

      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                ...history.map(h => ({
                  role: h.role === "assistant" ? "model" : "user",
                  parts: [{ text: h.content }],
                })),
                { role: "user", parts: [{ text: msg }] },
              ],
              systemInstruction: { parts: [{ text: systemPrompt }] },
              generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
            }),
          }
        );
        if (geminiRes.ok) {
          const d = await geminiRes.json();
          reply = d.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch { /* fallback */ }

      if (!reply && GROQ_KEY) {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "system", content: systemPrompt }, ...history.map(h => ({ role: h.role, content: h.text })), { role: "user", content: msg }],
            temperature: 0.7, max_tokens: 1200,
          }),
        });
        if (groqRes.ok) {
          const d = await groqRes.json();
          reply = d.choices?.[0]?.message?.content || "";
        }
      }

      if (!reply) reply = "Sorry, I couldn't connect right now. Please try again.";

      setLoading(false);
      setMessages(prev => [...prev, { role: "assistant", text: reply, isStreaming: true }]);
    } catch (err: any) {
      setLoading(false);
      setMessages(prev => [...prev, { role: "assistant", text: `Error: ${err?.message || "Please try again."}` }]);
    }
  }

  function toggleVoice() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Use Chrome for voice input."); return; }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e: any) => { sendMessage(e.results[0][0].transcript); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }

  const QUICK_QUESTIONS = [
    "Explain this in simple terms",
    "What are the key exam points?",
    "Give me an example",
    "What's commonly tested?",
  ];

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[160] w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 transition-all duration-300 group"
          aria-label="Ask Yumna AI about this note"
          title="Ask Yumna about this topic"
        >
          <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-6 right-6 z-[160] w-[360px] max-h-[580px] flex flex-col bg-white rounded-3xl shadow-2xl border border-border overflow-hidden"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(138,43,226,0.12)" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-purple-600 px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Ask Yumna</p>
                <p className="text-white/60 text-[10px] truncate max-w-[200px]">{noteTitle}</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {messages.length === 0 && (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mx-auto">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs text-foreground/50">Ask Yumna anything about this note</p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-[9px] font-bold">Y</span>
                  </div>
                )}
                <div className="flex flex-col gap-1 max-w-[85%]">
                  <div className={`rounded-2xl px-3 py-2.5 ${
                    m.role === "assistant"
                      ? "bg-pink-softer text-foreground rounded-tl-none text-xs"
                      : "bg-primary text-white rounded-tr-none text-xs"
                  }`}>
                    {m.isStreaming ? (
                      <TypewriterText
                        text={m.text}
                        onDone={() => {
                          setMessages(prev => prev.map((msg, idx) =>
                            idx === i ? { ...msg, isStreaming: false } : msg
                          ));
                        }}
                      />
                    ) : (
                      m.role === "assistant" ? renderNote(m.text) : <p className="text-xs leading-relaxed">{m.text}</p>
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

            {loading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-[9px] font-bold">Y</span>
                </div>
                <div className="bg-pink-softer rounded-2xl rounded-tl-none px-3 py-2.5 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex gap-1.5 flex-wrap shrink-0">
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-2.5 py-1 rounded-full bg-primary/8 text-primary text-[10px] font-medium hover:bg-primary hover:text-white transition-colors border border-primary/15"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-border shrink-0">
            <div className="flex items-center gap-2 bg-muted/40 rounded-2xl px-3 py-2 border border-border/50">
              <button
                onClick={toggleVoice}
                className={`p-1 rounded-full shrink-0 transition-colors ${listening ? "text-primary animate-pulse" : "text-foreground/30 hover:text-primary"}`}
              >
                {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
              <input
                className="flex-1 bg-transparent outline-none text-xs py-0.5 placeholder:text-foreground/30"
                placeholder="Ask about this topic..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="p-1 rounded-full bg-primary text-white disabled:opacity-30 transition-opacity shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
