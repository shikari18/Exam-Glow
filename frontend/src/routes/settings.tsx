import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Check, Loader2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";
import { updateSubjects } from "@/api/profile";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — ExamGlow" }] }),
  component: Settings,
});

const ALL_SUBJECTS = [
  { name: "Biology", emoji: "🧬", code: "0610" },
  { name: "Chemistry", emoji: "⚗️", code: "0620" },
  { name: "Physics", emoji: "⚡", code: "0625" },
  { name: "Mathematics", emoji: "📐", code: "0580" },
  { name: "Geography", emoji: "🌍", code: "0460" },
  { name: "English", emoji: "📖", code: "0500" },
  { name: "ICT/CS", emoji: "💻", code: "0417" },
  { name: "History", emoji: "📜", code: "0470" },
  { name: "Economics", emoji: "📊", code: "0455" },
  { name: "Business Studies", emoji: "💼", code: "0450" },
];

function Settings() {
  const { user, loading: authLoading } = useAuth();
  const { enrolledSubjects, course, yearGroup, refresh } = useProfile();
  const navigate = useNavigate();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" as any });
  }, [user, authLoading]);

  useEffect(() => {
    setSelectedSubjects(enrolledSubjects);
  }, [enrolledSubjects]);

  const toggle = (name: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleSave = async () => {
    if (selectedSubjects.length === 0) {
      toast.error("Select at least one subject");
      return;
    }
    setSaving(true);
    try {
      await updateSubjects(selectedSubjects);
      await refresh();
      toast.success("Subjects updated!");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header authed />
      <main className="max-w-2xl mx-auto w-full px-6 py-10">
        <h1 className="font-display text-3xl mb-2">Settings</h1>
        <p className="text-foreground/60 text-sm mb-8">Manage your profile and study preferences.</p>

        {/* Profile info */}
        <div className="bg-white border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-bold mb-4">Your Profile</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-foreground/60">Name</span>
              <span className="font-semibold">{user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-foreground/60">Email</span>
              <span className="font-semibold">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-foreground/60">Course</span>
              <span className="font-semibold">{course || "Not set"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-foreground/60">Year Group</span>
              <span className="font-semibold">{yearGroup || "Not set"}</span>
            </div>
          </div>
        </div>

        {/* Subject selection */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="font-bold mb-1">My Subjects</h2>
          <p className="text-sm text-foreground/60 mb-5">
            Select the subjects you're studying. Your flashcards, quizzes, and home page will be filtered to show these first.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {ALL_SUBJECTS.map(({ name, emoji, code }) => {
              const selected = selectedSubjects.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggle(name)}
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

          <button
            onClick={handleSave}
            disabled={saving || selectedSubjects.length === 0}
            className="mt-6 w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
