import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Sparkles, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute — renders children only if the user is logged in.
 * Otherwise shows a beautiful "login required" wall with a redirect button.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // While restoring auth state from localStorage, show nothing (or a spinner)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-border shadow-xl p-10 max-w-md w-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Login Required
          </h1>
          <p className="text-muted-foreground font-body mb-2 leading-relaxed">
            This page requires you to be signed in. Create a free account or log in to save and manage your AI-generated travel plans.
          </p>

          {/* What they get */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-foreground font-body mb-2 uppercase tracking-wide">With a free account you can:</p>
            <ul className="space-y-1.5">
              {[
                "💾  Save unlimited AI-generated itineraries",
                "📂  Access your trips from any device",
                "🗑️  Delete trips you no longer need",
                "✨  Pick up right where you left off",
              ].map((item) => (
                <li key={item} className="text-sm text-muted-foreground font-body">{item}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              id="protected-login-btn"
              onClick={() => navigate("/login", { state: { from: location.pathname } })}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold font-body text-sm hover:bg-primary/90 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <LogIn className="w-4 h-4" /> Sign In / Create Account
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl border border-border text-muted-foreground font-body text-sm hover:bg-muted transition"
            >
              Go back to Home
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <p className="text-xs text-muted-foreground font-body">
              Create trips &amp; chat with AI — no login needed
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
