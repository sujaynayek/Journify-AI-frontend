import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Wallet,
  Users,
  Calendar,
  Sparkles,
  Loader2,
  Minus,
  Plus,
  Mountain,
  Utensils,
  Landmark,
  TreePine,
  ShoppingBag,
  Music,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { generateItinerary } from "../lib/api";

/* ─── Interests Config ────────────────────────────────────────── */
const INTERESTS = [
  { id: "tourism", label: "Tourism", icon: <Mountain className="w-5 h-5" /> },
  { id: "food", label: "Food", icon: <Utensils className="w-5 h-5" /> },
  { id: "culture", label: "Culture", icon: <Landmark className="w-5 h-5" /> },
  { id: "nature", label: "Nature", icon: <TreePine className="w-5 h-5" /> },
  { id: "shopping", label: "Shopping", icon: <ShoppingBag className="w-5 h-5" />, },
  { id: "nightlife", label: "Nightlife", icon: <Music className="w-5 h-5" /> },
];

const BUDGETS = [
  { id: "low", label: "Low", emoji: "💰" },
  { id: "medium", label: "Medium", emoji: "💳" },
  { id: "luxury", label: "Luxury", emoji: "💎" },
];

/* ═══════════════════════════════════════════════════════════════ */
export default function CreateTrip() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("medium");
  const [travelers, setTravelers] = useState(1);
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState<string[]>(["tourism", "food"]);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!city.trim()) {
      toast.error("Please enter a destination city");
      return;
    }
    if (interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    setLoading(true);
    try {
      const result = await generateItinerary({
        city: city.trim(),
        days,
        budget,
        interests,
      });

      toast.success(`Itinerary generated for ${city}!`);
      // Pass full itinerary data via router state (no DB needed)
      navigate("/itinerary/view", { state: { itinerary: result } });
    } catch (err: any) {
      toast.error(
        err?.message || "Failed to generate itinerary. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&h=1080&fit=crop"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/80 backdrop-blur-sm" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Bar */}
        <div className="container-custom px-4 md:px-8 pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors font-body text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-white mb-3">
                Plan a New Trip
              </h1>
              <p className="text-white/70 font-body">
                Tell us your preferences and our AI will craft the perfect
                itinerary for you
              </p>
            </div>

            {/* Form Card */}
            <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-body">
                  Where do you want to go?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Darjeeling, Goa, Kerala..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition font-body"
                    id="destination-input"
                  />
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-body">
                  <Wallet className="w-4 h-4 inline mr-1.5" />
                  Budget
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {BUDGETS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBudget(b.id)}
                      className={`p-3 rounded-2xl border-2 text-center transition-all duration-200 font-body ${
                        budget === b.id
                          ? "border-secondary bg-secondary/10 shadow-md"
                          : "border-border hover:border-secondary/30 bg-white"
                      }`}
                      id={`budget-${b.id}`}
                    >
                      <span className="text-xl block mb-1">{b.emoji}</span>
                      <span
                        className={`text-sm font-semibold block ${
                          budget === b.id
                            ? "text-secondary"
                            : "text-foreground"
                        }`}
                      >
                        {b.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Travelers & Days */}
              <div className="grid grid-cols-2 gap-4">
                {/* Travelers */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 font-body">
                    <Users className="w-4 h-4 inline mr-1.5" />
                    Travelers
                  </label>
                  <div className="flex items-center justify-between bg-white rounded-2xl border border-border p-3">
                    <button
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="w-10 h-10 rounded-xl bg-muted hover:bg-muted-foreground/10 flex items-center justify-center transition"
                      id="travelers-minus"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-bold text-foreground font-body">
                      {travelers}
                    </span>
                    <button
                      onClick={() => setTravelers(Math.min(20, travelers + 1))}
                      className="w-10 h-10 rounded-xl bg-foreground text-white hover:bg-foreground/80 flex items-center justify-center transition"
                      id="travelers-plus"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Days */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 font-body">
                    <Calendar className="w-4 h-4 inline mr-1.5" />
                    Days
                  </label>
                  <div className="flex items-center justify-between bg-white rounded-2xl border border-border p-3">
                    <button
                      onClick={() => setDays(Math.max(1, days - 1))}
                      className="w-10 h-10 rounded-xl bg-muted hover:bg-muted-foreground/10 flex items-center justify-center transition"
                      id="days-minus"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-bold text-foreground font-body">
                      {days}
                    </span>
                    <button
                      onClick={() => setDays(Math.min(14, days + 1))}
                      className="w-10 h-10 rounded-xl bg-foreground text-white hover:bg-foreground/80 flex items-center justify-center transition"
                      id="days-plus"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-body">
                  <Sparkles className="w-4 h-4 inline mr-1.5" />
                  What interests you?
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 ${
                        interests.includes(interest.id)
                          ? "border-secondary bg-secondary/10 text-secondary"
                          : "border-border text-muted-foreground hover:border-secondary/30 bg-white"
                      }`}
                      id={`interest-${interest.id}`}
                    >
                      {interest.icon}
                      <span className="text-[11px] font-medium font-body">
                        {interest.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-lg text-white shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 font-body flex items-center justify-center gap-3"
                style={{ backgroundColor: "hsl(40, 94%, 48%)" }}
                id="generate-itinerary-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating Your Itinerary...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    GENERATE MY ITINERARY
                  </>
                )}
              </button>

              {loading && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground font-body animate-pulse">
                    Our AI is crafting the perfect trip for you. This may take
                    15-30 seconds...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
