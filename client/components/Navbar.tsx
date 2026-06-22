import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bookmark, LogIn, LogOut, User, ChevronDown, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Destinations", to: "/#destinations" },
    { label: "My Trips", to: "/my-trips", icon: <Bookmark className="w-3.5 h-3.5" /> },
  ];

  function handleLogout() {
    logout();
    navigate("/");
  }

  // User avatar initials
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
              J
            </div>
            <span
              className="text-2xl font-bold transition-colors text-foreground"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Journi<span className="text-secondary">fy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium transition-colors relative group inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                {link.icon}
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary rounded-full group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            <Link to="/create-trip" className="btn-primary text-sm !py-2.5 !px-6 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Create Trip
            </Link>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition group"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-border shadow-xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-border mb-1">
                      <p className="text-xs text-muted-foreground font-body">Signed in as</p>
                      <p className="text-sm font-semibold text-foreground font-body truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/my-trips"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-foreground hover:bg-muted transition"
                    >
                      <Bookmark className="w-4 h-4 text-secondary" /> My Trips
                    </Link>
                    <button
                      id="logout-btn"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-red-500 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                id="navbar-login-btn"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="flex items-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className="pt-3 px-4 flex flex-col gap-2">
              <Link to="/create-trip" className="btn-primary block text-center text-sm">
                Create Trip
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl border border-red-200 text-red-500 text-sm font-semibold font-body hover:bg-red-50 transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out ({user?.name?.split(" ")[0]})
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block text-center py-3 rounded-xl border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
