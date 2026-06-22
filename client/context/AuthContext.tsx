import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

/* ─── Types ───────────────────────────────────────────────────── */
interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

/* ─── Context ─────────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue | null>(null);

const API_BASE = "http://localhost:5000/api";

/* ─── Provider ────────────────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true until we've checked localStorage

  /* On mount: restore session from localStorage */
  useEffect(() => {
    const storedToken = localStorage.getItem("journify_token");
    const storedUser = localStorage.getItem("journify_user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("journify_token");
        localStorage.removeItem("journify_user");
      }
    }
    setIsLoading(false);
  }, []);

  /* Persist to localStorage whenever token/user changes */
  function persist(tok: string, usr: User) {
    localStorage.setItem("journify_token", tok);
    localStorage.setItem("journify_user", JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
  }

  async function login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Login failed");
    persist(json.data.token, json.data.user);
  }

  async function signup(name: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Sign up failed");
    persist(json.data.token, json.data.user);
  }

  function logout() {
    localStorage.removeItem("journify_token");
    localStorage.removeItem("journify_user");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully.");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ─── Hook ────────────────────────────────────────────────────── */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
