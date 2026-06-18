import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Search, Bell, Bot, LogOut, Menu, X, BookOpen, FileText, Zap, Trophy, Settings, Library, GraduationCap } from "lucide-react";
import { Logo } from "./Logo";
import { AiPanel } from "./AiPanel";
import { useAuth } from "@/lib/auth-context";
import { logOut } from "@/api/auth";

const navItems = [
  { to: "/library", label: "Library", Icon: Library },
  { to: "/subjects", label: "Subjects", Icon: BookOpen },
  { to: "/past-papers", label: "Past Papers", Icon: FileText },
  { to: "/flashcards", label: "Flashcards", Icon: Zap },
  { to: "/quizzes", label: "Quizzes", Icon: Trophy },
  { to: "/exam-prep", label: "Exam Prep", Icon: GraduationCap },
] as const;

export function Header({ authed = false }: { authed?: boolean }) {
  const loc = useLocation();
  const navigate = useNavigate();
  const [aiOpen, setAiOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    await logOut();
    setUser(null);
    navigate({ to: "/" as any });
  };

  const isAuthed = authed || !!user;

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {isAuthed && navItems.map((n) => {
              const active = loc.pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`text-sm font-medium transition-colors ${
                    active ? "text-primary" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
            {isAuthed && (
              <button
                onClick={() => setAiOpen(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
              <Bot className="w-3.5 h-3.5" />
                AI Tutor
              </button>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isAuthed && (
              <Link to="/search" className="p-2 rounded-full hover:bg-muted" aria-label="Search">
                <Search className="w-4 h-4" />
              </Link>
            )}
            {isAuthed && (
              <button
                onClick={() => setAiOpen(true)}
                className="p-2 rounded-full hover:bg-muted"
                aria-label="Open AI tutor"
              >
                <Bot className="w-4 h-4 text-primary" />
              </button>
            )}
            {isAuthed ? (
              <>
                <button className="p-2 rounded-full hover:bg-muted hidden lg:flex" aria-label="Notifications">
                  <Bell className="w-4 h-4" />
                </button>
                <Link to="/dashboard" aria-label="Dashboard">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                </Link>
                <Link
                  to="/settings"
                  className="p-2 rounded-full hover:bg-muted text-foreground/60 hover:text-foreground hidden lg:flex"
                  title="Settings"
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-muted text-foreground/60 hover:text-foreground hidden lg:flex"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium hidden lg:block">Log in</Link>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 hidden lg:block"
                >
                  Sign up
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-full hover:bg-muted lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur px-6 py-4 space-y-1">
            {isAuthed && navItems.map((n) => {
              const active = loc.pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <n.Icon className="w-4 h-4" />
                  {n.label}
                </Link>
              );
            })}
            {isAuthed && (
              <button
                onClick={() => { setAiOpen(true); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted"
              >
                <Bot className="w-4 h-4 text-primary" />
                AI Tutor
              </button>
            )}
            {!isAuthed && (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-border text-sm font-semibold text-center"
                >
                  Log in
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold text-center"
                >
                  Sign up
                </Link>
              </div>
            )}
            {isAuthed && (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            )}
          </div>
        )}
      </header>

      <AiPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
