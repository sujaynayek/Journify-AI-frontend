import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

/* ─── Tab type ────────────────────────────────────────────────── */
type Tab = "login" | "signup";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();

  // Redirect to the page the user was trying to access, or home
  const from = (location.state as any)?.from || "/";

  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup fields
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signup(signupName, signupEmail, signupPassword);
      toast.success("Account created! Welcome to Journify 🎉");
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 right-20 w-96 h-96 rounded-full border-2 border-white" />
        <div className="absolute top-32 right-40 w-64 h-64 rounded-full border border-white" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full border border-white" />
        <div className="absolute bottom-32 left-32 w-48 h-48 rounded-full border border-white" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
              J
            </div>
            <span className="text-3xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Journi<span className="text-secondary">fy</span>
            </span>
          </a>
          <p className="text-white/70 text-sm font-body mt-1">AI-Powered Travel Planning</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Tab header */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-4 text-sm font-semibold font-body transition-all ${
                tab === "login"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              id="tab-login"
            >
              Sign In
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`flex-1 py-4 text-sm font-semibold font-body transition-all ${
                tab === "signup"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              id="tab-signup"
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            {/* ── Login Form ── */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Welcome back!
                  </h2>
                  <p className="text-sm text-muted-foreground font-body">
                    Sign in to access your saved trips and plan new adventures.
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5 font-body">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      id="login-email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-body text-sm transition"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5 font-body">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="login-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-body text-sm transition"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="login-submit"
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold font-body text-sm hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  {loading ? "Signing in…" : "Sign In"}
                </button>

                <p className="text-center text-sm text-muted-foreground font-body">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setTab("signup")} className="text-primary font-semibold hover:underline">
                    Create one free
                  </button>
                </p>
              </form>
            )}

            {/* ── Signup Form ── */}
            {tab === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Start your journey
                  </h2>
                  <p className="text-sm text-muted-foreground font-body">
                    Create a free account to save and revisit your AI-planned trips.
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5 font-body">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      id="signup-name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-body text-sm transition"
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5 font-body">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      id="signup-email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-body text-sm transition"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5 font-body">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="signup-password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-body text-sm transition"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5 font-body">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="signup-confirm"
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-body text-sm transition"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="signup-submit"
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold font-body text-sm hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loading ? "Creating account…" : "Create Account"}
                </button>

                <p className="text-center text-sm text-muted-foreground font-body">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setTab("login")} className="text-primary font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>

          {/* Footer note */}
          <div className="px-8 pb-6">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground font-body">
                🔒 Your data is private. Each account only sees its own saved trips.
              </p>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <a href="/" className="text-white/70 hover:text-white text-sm font-body transition">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
