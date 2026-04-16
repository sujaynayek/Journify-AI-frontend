import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Star,
  IndianRupee,
  Route,
  Sun,
  Sunset,
  Moon,
  Copy,
  Check,
  AlertTriangle,
  Navigation,
  Hotel,
  Utensils,
  Car,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─── Types ───────────────────────────────────────────────────── */
interface Place {
  name: string;
  category: string;
  lat: number;
  lng: number;
  rating: number;
  address: string;
  timeSlot: "morning" | "afternoon" | "evening";
}

interface DayPlan {
  day: number;
  places: Place[];
  route: {
    optimized: boolean;
    totalDistanceKm: number;
    totalDurationMin: number;
  };
  dailyCost: {
    travel: number;
    food: number;
    activities: number;
    subtotal: number;
  };
}

interface ItineraryData {
  city: string;
  days: number;
  budget: string;
  interests: string[];
  itineraryData: DayPlan[];
  costEstimate: {
    totalTravel: number;
    totalFood: number;
    totalHotel: number;
    totalActivities: number;
    grandTotal: number;
    currency: string;
  };
  metadata?: {
    totalPlaces: number;
    totalDistanceKm: number;
    generatedAt: string;
  };
}

/* ─── Time Slot Icon Helper ───────────────────────────────────── */
function TimeSlotIcon({ slot }: { slot: string }) {
  switch (slot) {
    case "morning":
      return <Sun className="w-4 h-4 text-amber-500" />;
    case "afternoon":
      return <Sunset className="w-4 h-4 text-orange-500" />;
    case "evening":
      return <Moon className="w-4 h-4 text-indigo-500" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
}

/* ─── Format Currency ─────────────────────────────────────────── */
function formatINR(amount: number): string {
  if (!amount && amount !== 0) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ═══════════════════════════════════════════════════════════════ */
export default function ItineraryView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [copied, setCopied] = useState(false);

  // Get itinerary data from router state (passed from CreateTrip page)
  const itinerary = (location.state as any)?.itinerary as ItineraryData | undefined;

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const handleShare = () => {
    // For now, copy a message since there's no permalink without DB
    const text = `Check out my ${itinerary?.days}-day trip to ${itinerary?.city} planned by Journify AI!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Trip details copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── No Data State ──────────────────────────────────────────── */
  if (!itinerary) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-md">
            <AlertTriangle className="w-16 h-16 text-secondary mx-auto" />
            <h2 className="text-2xl text-foreground">No Itinerary Found</h2>
            <p className="text-muted-foreground font-body">
              You haven't generated an itinerary yet. Create a new trip to get
              started!
            </p>
            <Link to="/create-trip" className="btn-primary inline-block">
              Create a New Trip
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { city, days, budget, interests, itineraryData, costEstimate } = itinerary;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* ─── Hero Banner ──────────────────────────────────────── */}
      <section className="relative pt-20">
        <div className="h-64 md:h-80 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&h=600&fit=crop"
            alt={city}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container-custom">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm font-body mb-3 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Link>
              <h1 className="text-3xl md:text-5xl text-white mb-2">
                {city} Trip Itinerary
              </h1>
              <div className="flex flex-wrap gap-4 text-white/80 text-sm font-body">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {days} Days
                </span>
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4" />
                  {budget.charAt(0).toUpperCase() + budget.slice(1)} Budget
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {interests?.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Content ──────────────────────────────────────────── */}
      <div className="container-custom px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Timeline ────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl text-foreground"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
              >
                Day-by-Day Itinerary
              </h2>
              <button
                onClick={handleShare}
                className="btn-success !py-2 !px-4 !text-sm inline-flex items-center gap-2"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Share"}
              </button>
            </div>

            {itineraryData && itineraryData.length > 0 ? (
              itineraryData.map((dayPlan) => (
                <div
                  key={dayPlan.day}
                  className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Day Header */}
                  <button
                    onClick={() => toggleDay(dayPlan.day)}
                    className="w-full flex items-center justify-between p-5 text-left"
                    id={`day-${dayPlan.day}-toggle`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm font-body shadow-md shadow-emerald-500/30">
                          {dayPlan.day}
                        </div>
                        {dayPlan.day < itineraryData.length && (
                          <div className="absolute left-1/2 top-full w-0.5 h-4 bg-emerald-300 -translate-x-1/2" />
                        )}
                      </div>
                      <div>
                        <h3
                          className="text-base text-foreground"
                          style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 600,
                          }}
                        >
                          Day {dayPlan.day}
                        </h3>
                        <p className="text-xs text-muted-foreground font-body">
                          {dayPlan.places?.length || 0} places •{" "}
                          {dayPlan.route?.totalDistanceKm?.toFixed(1) || "0"} km
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-secondary font-body">
                        {formatINR(dayPlan.dailyCost?.subtotal || 0)}
                      </span>
                      {expandedDays.has(dayPlan.day) ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Day Content */}
                  {expandedDays.has(dayPlan.day) && (
                    <div className="px-5 pb-5 animate-fade-in">
                      <div className="border-t border-border pt-4 space-y-3">
                        {dayPlan.places?.map((place, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex flex-col items-center gap-1 pt-1 flex-shrink-0">
                              <TimeSlotIcon slot={place.timeSlot} />
                              <span className="text-[10px] text-muted-foreground capitalize font-body">
                                {place.timeSlot}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  className="text-sm text-foreground truncate"
                                  style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 600,
                                  }}
                                >
                                  {place.name}
                                </h4>
                                {place.rating > 0 && (
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                    <span className="text-xs font-medium text-foreground font-body">
                                      {place.rating?.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {place.address && (
                                <p className="text-xs text-muted-foreground font-body mt-0.5 truncate">
                                  <MapPin className="w-3 h-3 inline mr-1" />
                                  {place.address}
                                </p>
                              )}
                              <span className="inline-block mt-1.5 px-2 py-0.5 bg-primary/5 text-primary text-[10px] rounded-full font-medium font-body">
                                {place.category}
                              </span>
                            </div>
                          </div>
                        ))}

                        {dayPlan.route?.optimized && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-body pt-2">
                            <Route className="w-4 h-4 text-emerald-500" />
                            <span>
                              Optimized route:{" "}
                              {dayPlan.route.totalDistanceKm?.toFixed(1)} km •{" "}
                              {Math.round(dayPlan.route.totalDurationMin || 0)}{" "}
                              min
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground font-body">
                No itinerary data available.
              </div>
            )}
          </div>

          {/* ── Right: Cost Summary ───────────────────────────── */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sticky top-24">
              <h3
                className="text-lg text-foreground mb-5"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
              >
                Cost Summary
              </h3>

              <div className="space-y-3">
                <CostRow
                  icon={<Car className="w-4 h-4" />}
                  label="Travel"
                  amount={costEstimate?.totalTravel || 0}
                />
                <CostRow
                  icon={<Utensils className="w-4 h-4" />}
                  label="Food"
                  amount={costEstimate?.totalFood || 0}
                />
                <CostRow
                  icon={<Hotel className="w-4 h-4" />}
                  label="Hotel"
                  amount={costEstimate?.totalHotel || 0}
                />
                <CostRow
                  icon={<Ticket className="w-4 h-4" />}
                  label="Activities"
                  amount={costEstimate?.totalActivities || 0}
                />

                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground font-body">
                      Total (per person)
                    </span>
                    <span className="text-xl font-bold text-secondary font-body">
                      {formatINR(costEstimate?.grandTotal || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inclusions */}
              <div className="mt-6 pt-5 border-t border-border">
                <h4
                  className="text-sm text-foreground mb-3"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Inclusions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: "🏨", label: "Hotel" },
                    { icon: "🍳", label: "Breakfast" },
                    { icon: "🚗", label: "Transport" },
                    { icon: "🎫", label: "Sightseeing" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 text-xs text-muted-foreground font-body bg-emerald-50 rounded-lg px-3 py-2"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions */}
              <div className="mt-4">
                <h4
                  className="text-sm text-foreground mb-3"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Exclusions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: "🚂", label: "Train" },
                    { icon: "🎟️", label: "Entry Fees" },
                    { icon: "🍽️", label: "Lunch/Dinner" },
                    { icon: "🏥", label: "Insurance" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 text-xs text-muted-foreground font-body bg-red-50 rounded-lg px-3 py-2"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Link
                  to="/create-trip"
                  className="btn-primary block text-center !text-sm w-full"
                >
                  Create Another Trip
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ─── Cost Row Component ──────────────────────────────────────── */
function CostRow({
  icon,
  label,
  amount,
}: {
  icon: React.ReactNode;
  label: string;
  amount: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground font-body">
        {formatINR(amount)}
      </span>
    </div>
  );
}
