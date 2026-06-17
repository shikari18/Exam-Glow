import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, X, Loader2, Check } from "lucide-react";
import { Logo } from "@/components/Logo";
import { saveOnboarding } from "@/api/auth";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Complete Your Profile — ExamGlow" }] }),
  component: Onboarding,
});

type Step = "school" | "class" | "subjects" | "goal" | "course" | "updates" | "welcome";

const ALL_SUBJECTS = [
  { name: "Biology", emoji: "🧬", code: "0610" },
  { name: "Chemistry", emoji: "⚗️", code: "0620" },
  { name: "Physics", emoji: "⚡", code: "0625" },
  { name: "Mathematics", emoji: "📐", code: "0580" },
  { name: "Additional Mathematics", emoji: "➕", code: "0606" },
  { name: "Geography", emoji: "🌍", code: "0460" },
  { name: "English Language", emoji: "📖", code: "0500" },
  { name: "English Literature", emoji: "📚", code: "0475" },
  { name: "ICT/Computer Science", emoji: "💻", code: "0417" },
  { name: "History", emoji: "📜", code: "0470" },
  { name: "Economics", emoji: "📊", code: "0455" },
  { name: "Business Studies", emoji: "💼", code: "0450" },
  { name: "Accounting", emoji: "🧾", code: "0452" },
  { name: "Sociology", emoji: "🤝", code: "0495" },
  { name: "Psychology", emoji: "🧠", code: "0478" },
  { name: "Art & Design", emoji: "🎨", code: "0400" },
  { name: "Music", emoji: "🎵", code: "0410" },
  { name: "French", emoji: "🇫🇷", code: "0520" },
  { name: "Spanish", emoji: "🇪🇸", code: "0530" },
  { name: "Arabic", emoji: "🇸🇦", code: "0508" },
  { name: "German", emoji: "🇩🇪", code: "0525" },
  { name: "Global Perspectives", emoji: "🌐", code: "0457" },
  { name: "Environmental Management", emoji: "🌱", code: "0680" },
  { name: "Physical Education", emoji: "⚽", code: "0413" },
  { name: "Drama", emoji: "🎭", code: "0411" },
  { name: "Design & Technology", emoji: "🛠️", code: "0445" },
  { name: "Enterprise", emoji: "🚀", code: "0454" },
  { name: "Marine Science", emoji: "🌊", code: "0697" },
  { name: "Food & Nutrition", emoji: "🍳", code: "0648" },
  { name: "Travel & Tourism", emoji: "✈️", code: "0471" }
];

function Onboarding() {
  const [step, setStep] = useState<Step>("school");
  const [data, setData] = useState({
    school: "",
    class: "",
    subjects: ["Biology", "Chemistry", "Physics", "Mathematics"] as string[],
    goal: "",
    course: "",
    updates: false,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const navigate = useNavigate();

  const steps: Step[] = ["school", "class", "subjects", "goal", "course", "updates", "welcome"];

  const toggleSubject = (name: string) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(name)
        ? prev.subjects.filter((s) => s !== name)
        : [...prev.subjects, name],
    }));
  };

  const handleContinue = async () => {
    const currentIndex = steps.indexOf(step);
    if (step === "updates") {
      setSaving(true);
      setSaveError("");
      try {
        await saveOnboarding(data);
        setStep("welcome");
      } catch (e: any) {
        setSaveError(e.message ?? "Failed to save. Please try again.");
      } finally {
        setSaving(false);
      }
    } else if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    } else {
      navigate({ to: "/home" as any });
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) setStep(steps[currentIndex - 1]);
  };

  const getProgress = () => {
    const currentIndex = steps.indexOf(step);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div
        className="relative hidden md:flex flex-col p-12 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80")' }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10"><Logo /></div>
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white font-semibold w-fit">
            New: IGCSE 2024 Revision Packs
          </span>
          <h1 className="font-display text-5xl mt-6 leading-[1.05] text-white">
            Every petal of<br />knowledge<br />brings you closer<br />
            to <span className="accent-italic text-primary">your bloom</span>.
          </h1>
          <p className="text-white/80 mt-6 max-w-md">
            Join 10,000+ students worldwide who are mastering their exams with ExamGlow.
          </p>
        </div>
      </div>

      <div className="flex flex-col bg-pink-soft/30">
        {step !== "welcome" && (
          <div className="border-b border-border bg-background/80 backdrop-blur">
            <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
              <button onClick={handleBack} className="p-2 rounded-full hover:bg-muted">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 mx-4">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${getProgress()}%` }} />
                </div>
              </div>
              <button onClick={() => navigate({ to: "/home" as any })} className="text-sm text-foreground/60">
                Skip
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {saveError && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm">{saveError}</div>
            )}

            {step === "school" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-3xl">What school do you attend?</h1>
                  <p className="text-foreground/70 mt-2">This helps us personalise your learning experience.</p>
                </div>
                <input
                  type="text"
                  placeholder="Enter your school name"
                  value={data.school}
                  onChange={(e) => setData({ ...data, school: e.target.value })}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm"
                />
              </div>
            )}

            {step === "class" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-3xl">What year are you in?</h1>
                  <p className="text-foreground/70 mt-2">We'll tailor content to your level.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { value: "year9", label: "Year 9", sub: "Starting IGCSE preparation" },
                    { value: "year10", label: "Year 10", sub: "First year of IGCSE" },
                    { value: "year11", label: "Year 11", sub: "Final year of IGCSE — exam year!" },
                    { value: "year12", label: "Year 12", sub: "First year of A-Level / Sixth Form" },
                    { value: "year13", label: "Year 13", sub: "Final year of A-Level" },
                  ].map(({ value, label, sub }) => (
                    <button
                      key={value}
                      onClick={() => setData({ ...data, class: value })}
                      className={`w-full border rounded-xl px-4 py-3 text-sm text-left transition-colors ${
                        data.class === value ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <p className="font-semibold">{label}</p>
                      <p className="text-xs text-foreground/60 mt-0.5">{sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "subjects" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-3xl">Which subjects are you studying?</h1>
                  <p className="text-foreground/70 mt-2">Select all that apply — we'll personalise your content.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {ALL_SUBJECTS.map(({ name, emoji, code }) => {
                    const selected = data.subjects.includes(name);
                    return (
                      <button
                        key={name}
                        onClick={() => toggleSubject(name)}
                        className={`border rounded-xl px-4 py-3 text-sm text-left transition-all relative ${
                          selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                        }`}
                      >
                        {selected && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </span>
                        )}
                        <span className="text-xl">{emoji}</span>
                        <p className="font-semibold mt-1">{name}</p>
                        <p className="text-[10px] text-foreground/50">{code}</p>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-foreground/50 text-center">
                  {data.subjects.length} subject{data.subjects.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            )}

            {step === "goal" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-3xl">What's your main goal?</h1>
                  <p className="text-foreground/70 mt-2">We'll focus your dashboard around this.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { value: "Improve my grades", emoji: "📈", sub: "Boost my current performance" },
                    { value: "Prepare for exams", emoji: "🎯", sub: "Focused exam preparation" },
                    { value: "Learn new topics", emoji: "🧠", sub: "Explore and understand new content" },
                    { value: "Stay organised", emoji: "📋", sub: "Keep track of my revision" },
                  ].map(({ value, emoji, sub }) => (
                    <button
                      key={value}
                      onClick={() => setData({ ...data, goal: value })}
                      className={`w-full border rounded-xl px-4 py-3 text-sm text-left transition-colors flex items-center gap-3 ${
                        data.goal === value ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <div>
                        <p className="font-semibold">{value}</p>
                        <p className="text-xs text-foreground/60">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "course" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-3xl">What course are you studying?</h1>
                  <p className="text-foreground/70 mt-2">Select your main exam board.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { value: "Cambridge IGCSE", sub: "CIE — most content available" },
                    { value: "Edexcel IGCSE", sub: "Pearson Edexcel" },
                    { value: "AQA GCSE", sub: "Assessment and Qualifications Alliance" },
                    { value: "OCR GCSE", sub: "Oxford, Cambridge and RSA" },
                    { value: "Other", sub: "Other exam board or curriculum" },
                  ].map(({ value, sub }) => (
                    <button
                      key={value}
                      onClick={() => setData({ ...data, course: value })}
                      className={`w-full border rounded-xl px-4 py-3 text-sm text-left transition-colors ${
                        data.course === value ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <p className="font-semibold">{value}</p>
                      <p className="text-xs text-foreground/60">{sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "updates" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-3xl">Stay updated with new content?</h1>
                  <p className="text-foreground/70 mt-2">We'll send you study tips and new resource alerts.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setData({ ...data, updates: false })}
                    className={`flex-1 border rounded-xl px-4 py-6 text-sm flex items-center justify-center gap-2 transition-colors ${
                      !data.updates ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    <X className="w-5 h-5 text-primary" /> No, thanks
                  </button>
                  <button
                    onClick={() => setData({ ...data, updates: true })}
                    className={`flex-1 border rounded-xl px-4 py-6 text-sm flex items-center justify-center gap-2 transition-colors ${
                      data.updates ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Yes, please
                  </button>
                </div>
              </div>
            )}

            {step === "welcome" && (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h1 className="font-display text-3xl">You're all set! 🎉</h1>
                  <p className="text-foreground/70 mt-2">Your personalised study space is ready.</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2">
                  <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Your Profile</p>
                  <div className="space-y-1 text-sm">
                    {data.school && <p><span className="text-foreground/60">School:</span> {data.school}</p>}
                    {data.class && <p><span className="text-foreground/60">Year:</span> {data.class.replace("year", "Year ")}</p>}
                    {data.course && <p><span className="text-foreground/60">Course:</span> {data.course}</p>}
                    {data.subjects.length > 0 && (
                      <p><span className="text-foreground/60">Subjects:</span> {data.subjects.join(", ")}</p>
                    )}
                    {data.goal && <p><span className="text-foreground/60">Goal:</span> {data.goal}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border p-6 bg-background/80 backdrop-blur">
          <button
            onClick={handleContinue}
            disabled={
              saving ||
              (step === "school" && !data.school) ||
              (step === "class" && !data.class) ||
              (step === "subjects" && data.subjects.length === 0) ||
              (step === "goal" && !data.goal) ||
              (step === "course" && !data.course)
            }
            className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {step === "welcome" ? "Start Learning →" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
