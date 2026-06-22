import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  IndianRupee,
  Trash2,
  Loader2,
  Bookmark,
  ChevronRight,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getTrips, deleteTrip } from "../lib/api";
import { useAuth } from "../context/AuthContext";

/* ─── Types ───────────────────────────────────────────────────── */
interface Trip {
  _id: string;
  title: string;
  city: string;
  days: number;
  budget: string;
  interests: string[];
  costEstimate?: {
    grandTotal?: number;
    currency?: string;
  };
  itineraryData?: any[];
  weatherAdapted?: boolean;
  aiEnhanced?: boolean;
  createdAt: string;
}

/* ─── City Image Map ──────────────────────────────────────────── */
const CITY_IMAGES: Record<string, string> = {
  darjeeling: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=300&fit=crop",
  goa: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop",
  jaipur: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=300&fit=crop",
  kerala: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop",
  manali: "https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?w=600&h=300&fit=crop",
  puri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=300&fit=crop",
  default: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=300&fit=crop",
};

function getCityImage(city: string): string {
  const key = city.toLowerCase().trim();
  for (const [k, v] of Object.entries(CITY_IMAGES)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return `https://source.unsplash.com/600x300/?${encodeURIComponent(city)},travel`;
}

function formatINR(amount: number): string {
  if (!amount) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount);
}

const BUDGET_BADGE: Record<string, { label: string; class: string }> = {
  budget: { label: "💰 Budget", class: "bg-emerald-50 text-emerald-700" },
  medium: { label: "💳 Medium", class: "bg-blue-50 text-blue-700" },
  luxury: { label: "💎 Luxury", class: "bg-amber-50 text-amber-700" },
};

/* ═══════════════════════════════════════════════════════════════ */
export default function MyTrips() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    setLoading(true);
    try {
      const result = await getTrips();
      setTrips(result.trips || result || []);
    } catch (err: any) {
      toast.error(err?.message || "Could not load trips. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteTrip(id);
      setTrips(prev => prev.filter(t => t._id !== id));
      toast.success("Trip deleted.");
    } catch (err: any) {
      toast.error(err?.message || "Could not delete trip.");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  function openTrip(trip: Trip) {
    if (!trip.itineraryData) {
      toast.error("This trip has no itinerary data.");
      return;
    }
    navigate("/itinerary/view", {
      state: {
        itinerary: {
          city: trip.city,
          days: trip.days,
          budget: trip.budget,
          interests: trip.interests,
          itineraryData: trip.itineraryData,
          costEstimate: trip.costEstimate,
        },
      },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* ─── Header ────────────────────────────────────────────── */}
      <section className="pt-28 pb-10 px-4">
        <div className="container-custom">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-secondary font-semibold text-sm uppercase tracking-wide font-body mb-1">
                Your Journey History
              </p>
              <h1 className="text-4xl text-foreground">My Saved Trips</h1>
              <p className="text-muted-foreground font-body mt-2">
                {user ? `Welcome back, ${user.name.split(" ")[0]}! Here are all your planned adventures.` : "All your planned adventures in one place."}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchTrips}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium font-body hover:bg-muted transition"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <Link to="/create-trip" className="btn-primary !py-2.5 !px-6 text-sm inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Plan New Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Content ───────────────────────────────────────────── */}
      <div className="container-custom px-4 md:px-8 pb-16">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-secondary mb-4" />
            <p className="text-muted-foreground font-body">Loading your trips…</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && trips.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
              <Bookmark className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="text-2xl text-foreground mb-3">No Saved Trips Yet</h2>
            <p className="text-muted-foreground font-body max-w-md mb-8">
              Generate an itinerary and click "Save Trip" to keep it here. Your adventures will all be listed on this page.
            </p>
            <Link to="/create-trip" className="btn-primary inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Plan Your First Trip
            </Link>
          </div>
        )}

        {/* Trips Grid */}
        {!loading && trips.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground font-body mb-6">
              {trips.length} trip{trips.length !== 1 ? "s" : ""} saved
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => {
                const budget = BUDGET_BADGE[trip.budget] || BUDGET_BADGE.medium;
                const isDeleting = deletingId === trip._id;
                const isConfirming = confirmDeleteId === trip._id;

                return (
                  <div
                    key={trip._id}
                    className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={getCityImage(trip.city)}
                        alt={trip.city}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = CITY_IMAGES.default;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold font-body ${budget.class}`}>
                          {budget.label}
                        </span>
                        {trip.aiEnhanced && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-body bg-purple-50 text-purple-700">
                            ✨ AI Enhanced
                          </span>
                        )}
                        {trip.weatherAdapted && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-body bg-sky-50 text-sky-700">
                            🌤 Weather Smart
                          </span>
                        )}
                      </div>

                      {/* City Name */}
                      <div className="absolute bottom-3 left-4">
                        <h3 className="text-white text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {trip.city}
                        </h3>
                      </div>

                      {/* Delete button */}
                      <div className="absolute top-3 right-3">
                        {isConfirming ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDelete(trip._id)}
                              disabled={isDeleting}
                              className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg font-body hover:bg-red-600 transition"
                            >
                              {isDeleting ? "..." : "Yes, Delete"}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 bg-white/80 text-foreground text-xs rounded-lg font-body hover:bg-white transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(trip._id); }}
                            className="w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                            title="Delete trip"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      <p className="text-sm font-semibold text-foreground font-body mb-1 line-clamp-1">
                        {trip.title}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-body mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {trip.days} days
                        </span>
                        {trip.costEstimate?.grandTotal ? (
                          <span className="flex items-center gap-1">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {formatINR(trip.costEstimate.grandTotal)}
                          </span>
                        ) : null}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(trip.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>

                      {trip.interests?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {trip.interests.slice(0, 3).map(i => (
                            <span key={i} className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] rounded-full font-body font-medium capitalize">
                              {i}
                            </span>
                          ))}
                          {trip.interests.length > 3 && (
                            <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-full font-body">
                              +{trip.interests.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => openTrip(trip)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold font-body hover:bg-primary/90 transition group/btn"
                      >
                        View Itinerary
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
