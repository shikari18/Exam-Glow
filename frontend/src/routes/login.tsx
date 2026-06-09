import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Mail, Lock, ArrowLeft, User, Loader2, CheckCircle } from "lucide-react";
import { logIn, signUp, requestPasswordReset } from "@/api/auth";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — ExamGlow" }] }),
  component: Login,
});

function Login() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "reset">("login");
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const handleEmailContinue = () => {
    if (email) setStep("password");
  };

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await logIn(email, password);
      await refresh();
      if (result.needsOnboarding) {
        navigate({ to: "/onboarding" as any });
      } else {
        navigate({ to: "/home" as any });
      }
    } catch (e: any) {
      setError(e.message ?? "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      await signUp(email, password, name);
      await refresh();
      navigate({ to: "/onboarding" as any });
    } catch (e: any) {
      setError(e.message ?? "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setResetEmailSent(true);
    } catch (e: any) {
      setError(e.message ?? "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setLoading(true);
    try {
      // Password reset handled server-side — stub for now
      setResetSuccess(true);
      setTimeout(() => {
        setMode("login");
        setStep("email");
        setResetToken("");
        setResetSuccess(false);
      }, 2000);
    } catch (e: any) {
      setError(e.message ?? "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div
        className="relative hidden md:flex flex-col p-12 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10">
          <Logo />
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white font-semibold w-fit">
            New: IGCSE 2024 Revision Packs
          </span>
          <h1 className="font-display text-5xl mt-6 leading-[1.05] text-white">
            Every petal of
            <br />
            knowledge
            <br />
            brings you closer
            <br />
            to <span className="accent-italic text-primary">your bloom</span>.
          </h1>
          <p className="text-white/80 mt-6 max-w-md">
            Join 10,000+ students worldwide who are mastering their exams with ExamGlow's calm and
            structured approach.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {[10, 11, 12].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/40?img=${i}`}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  alt=""
                />
              ))}
            </div>
            <span className="text-sm text-white/80">Trusted by top students and educators</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-pink-soft/30">
        <Link to="/" className="text-sm text-foreground/60 flex items-center gap-1 self-start p-6">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <h2 className="font-display text-3xl">
              {mode === "login" ? "Welcome Back!" : mode === "signup" ? "Create Account" : mode === "forgot" ? "Reset Password" : "New Password"}
            </h2>
            <p className="text-foreground/70 text-sm mt-1">
              {mode === "login"
                ? "Continue your journey to academic excellence."
                : mode === "signup"
                ? "Start your IGCSE revision journey today."
                : mode === "forgot"
                ? "Enter your email to receive a reset link."
                : "Create a new secure password."}
            </p>

            {error && (
              <div className="mt-4 px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {resetEmailSent && mode === "forgot" && (
              <div className="mt-4 px-4 py-3 rounded-xl bg-green-50 text-green-700 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                If that email exists, a reset link has been sent. Check your inbox.
              </div>
            )}

            {/* Mode toggle */}
            {mode !== "forgot" && mode !== "reset" && (
              <div className="mt-6 flex gap-2 bg-muted/50 rounded-xl p-1">
                <button
                  onClick={() => { setMode("login"); setStep("email"); setError(""); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "login" ? "bg-white shadow text-foreground" : "text-foreground/50"}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMode("signup"); setStep("email"); setError(""); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "signup" ? "bg-white shadow text-foreground" : "text-foreground/50"}`}
                >
                  Sign Up
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 my-5">
              <hr className="flex-1" />
              <span className="text-[10px] tracking-widest text-foreground/60">
                {step === "email" ? "ENTER YOUR EMAIL" : "ENTER YOUR PASSWORD"}
              </span>
              <hr className="flex-1" />
            </div>

            {mode === "signup" && step === "email" && (
              <div className="mb-4">
                <label className="text-sm font-semibold">Full Name</label>
                <div className="relative mt-1">
                  <User className="w-4 h-4 absolute left-3 top-3 text-foreground/40" />
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm"
                  />
                </div>
              </div>
            )}

            {resetSuccess && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 text-green-700 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Password reset successful! Redirecting to login...
              </div>
            )}

            {step === "email" ? (
              <>
                <label className="text-sm font-semibold">Email Address</label>
                <div className="relative mt-1">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-foreground/40" />
                  <input
                    type="email"
                    placeholder="name@examglow.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailContinue()}
                    className="w-full border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm"
                  />
                </div>
                <button
                  onClick={mode === "forgot" ? handleForgotPassword : handleEmailContinue}
                  disabled={!email || (mode === "signup" && !name)}
                  className="mt-5 w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === "forgot" ? "Send Reset Link" : "Continue"}
                </button>
              </>
            ) : (
              <>
                {mode !== "reset" && (
                  <button
                    onClick={() => { setStep("email"); setMode("login"); setError(""); }}
                    className="text-sm text-foreground/60 flex items-center gap-1 mb-4"
                  >
                    <ArrowLeft className="w-3 h-3" /> {email}
                  </button>
                )}
                <div className="flex justify-between text-sm font-semibold">
                  <label>{mode === "reset" ? "New Password" : "Password"}</label>
                  {mode === "login" && (
                    <button onClick={() => { setMode("forgot"); setStep("email"); setError(""); }} className="text-primary">Forgot password?</button>
                  )}
                </div>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-foreground/40" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (
                        mode === "login" ? handleSignIn() : 
                        mode === "signup" ? handleSignUp() : 
                        handleResetPassword()
                      )
                    }
                    className="w-full border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm"
                  />
                </div>
                {(mode === "signup" || mode === "reset") && (
                  <p className="text-xs text-foreground/50 mt-1">Minimum 8 characters with uppercase, lowercase, and number</p>
                )}
                <button
                  onClick={mode === "login" ? handleSignIn : mode === "signup" ? handleSignUp : handleResetPassword}
                  disabled={!password || loading}
                  className="mt-5 w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Reset Password"}
                </button>
                {mode === "reset" && (
                  <button
                    onClick={() => { setMode("login"); setStep("email"); setError(""); setResetToken(""); }}
                    className="mt-3 w-full py-3 rounded-full border border-border text-foreground font-semibold"
                  >
                    Back to Login
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-foreground/50 self-end p-6">
          ✿ Design with love by ExamGlow Team
        </p>
      </div>
    </div>
  );
}
