import { useEffect, useState, useRef } from "react";
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
  Sparkles,
  Loader2,
  Send,
  BookmarkPlus,
  RefreshCw,
  ExternalLink,
  Cloud,
  Umbrella,
  X,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { enhanceWithAI, saveTrip, getWeatherAdaptive, replanItinerary, generateItinerary } from "../lib/api";
import { useAuth } from "../context/AuthContext";

/* ─── Types ───────────────────────────────────────────────────── */
interface Place {
  name: string;
  category: string;
  lat: number;
  lng: number;
  rating: number;
  address: string;
  timeSlot: "morning" | "afternoon" | "evening";
  aiTip?: string;
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
  weather?: {
    condition: string;
    description: string;
    tempC: number;
    icon: string;
    simulated?: boolean;
  };
  weatherNote?: string;
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
    case "morning": return <Sun className="w-4 h-4 text-amber-500" />;
    case "afternoon": return <Sunset className="w-4 h-4 text-orange-500" />;
    case "evening": return <Moon className="w-4 h-4 text-indigo-500" />;
    default: return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
}

function WeatherIcon({ condition }: { condition: string }) {
  if (condition === "rainy") return <Umbrella className="w-4 h-4 text-blue-500" />;
  if (condition === "sunny") return <Sun className="w-4 h-4 text-amber-500" />;
  return <Cloud className="w-4 h-4 text-slate-400" />;
}

/* ─── Format Currency ─────────────────────────────────────────── */
function formatINR(amount: number): string {
  if (!amount && amount !== 0) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount);
}

/* ─── Day color palette ───────────────────────────────────────── */
const DAY_COLORS = [
  "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#14b8a6",
  "#f97316", "#8b5cf6", "#ef4444", "#06b6d4", "#84cc16",
];

/* ═══════════════════════════════════════════════════════════════ */
export default function ItineraryView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [copied, setCopied] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryData | undefined>(
    (location.state as any)?.itinerary as ItineraryData | undefined
  );

  // AI Chat
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);

  // Save trip
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Replan
  const [replanOpen, setReplanOpen] = useState(false);
  const [replanLoading, setReplanLoading] = useState(false);
  const [replanCity, setReplanCity] = useState("");
  const [replanDays, setReplanDays] = useState(3);
  const [replanBudget, setReplanBudget] = useState("medium");

  // Weather
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherAdapted, setWeatherAdapted] = useState(false);

  // Map ref
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [mapLoaded, setMapLoaded] = useState(false);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  /* ── Leaflet Map ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!itinerary || mapInstance.current) return;

    // Dynamically load Leaflet
    const loadLeaflet = async () => {
      if ((window as any).L) {
        initMap();
        return;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      const L = (window as any).L;
      if (!mapRef.current || mapInstance.current) return;

      // Find a center from first day's first place
      const firstPlace = itinerary.itineraryData[0]?.places?.[0];
      const center: [number, number] = firstPlace
        ? [firstPlace.lat, firstPlace.lng]
        : [20.5937, 78.9629];

      const map = L.map(mapRef.current, { zoomControl: true }).setView(center, 13);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      setMapLoaded(true);
      renderDayOnMap(map, itinerary.itineraryData, 1);
    };

    loadLeaflet();
    return () => { /* cleanup handled by mapInstance ref */ };
  }, [itinerary]);

  const renderDayOnMap = (map: any, days: DayPlan[], targetDay: number) => {
    const L = (window as any).L;
    if (!L || !map) return;

    // Clear existing layers except tile layer
    map.eachLayer((layer: any) => {
      if (!layer._url) map.removeLayer(layer);
    });

    const dayPlan = days.find(d => d.day === targetDay);
    if (!dayPlan || !dayPlan.places.length) return;

    const color = DAY_COLORS[(targetDay - 1) % DAY_COLORS.length];
    const coords: [number, number][] = [];

    dayPlan.places.forEach((place, idx) => {
      if (!place.lat || !place.lng) return;
      coords.push([place.lat, place.lng]);

      // Custom numbered circle icon
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          background:${color};color:white;width:30px;height:30px;
          border-radius:50%;display:flex;align-items:center;justify-content:center;
          font-weight:700;font-size:12px;border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);font-family:'Poppins',sans-serif;">
          ${idx + 1}
        </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      L.marker([place.lat, place.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:'Poppins',sans-serif;min-width:160px;">
            <strong style="color:#1e3a5f;">${place.name}</strong><br/>
            <span style="font-size:11px;color:#888;">${place.timeSlot} • ⭐ ${(place.rating || 0).toFixed(1)}</span><br/>
            <span style="font-size:10px;color:#aaa;">${place.address || ""}</span>
          </div>
        `);
    });

    // Draw polyline for the route
    if (coords.length >= 2) {
      L.polyline(coords, { color, weight: 3, opacity: 0.8, dashArray: "8,4" }).addTo(map);
    }

    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [30, 30] });
    }
  };

  const handleDayMapSwitch = (day: number) => {
    setActiveDay(day);
    if (mapInstance.current && itinerary) {
      renderDayOnMap(mapInstance.current, itinerary.itineraryData, day);
    }
  };

  /* ── AI Customizer ───────────────────────────────────────────── */
  const handleAiSubmit = async () => {
    if (!aiPrompt.trim() || !itinerary) return;
    setAiLoading(true);
    const currentPrompt = aiPrompt;
    setAiMessages(prev => [...prev, { role: "user", text: currentPrompt }]);
    setAiPrompt("");

    try {
      // Send only what Gemini needs — trim large fields to avoid payload issues
      const itineraryPayload = {
        city: itinerary.city,
        days: itinerary.days,
        budget: itinerary.budget,
        interests: itinerary.interests,
        itineraryData: itinerary.itineraryData,
      };
      const result = await enhanceWithAI(itineraryPayload, currentPrompt);

      if (result && result.modifiedItinerary && Array.isArray(result.modifiedItinerary)) {
        setItinerary(prev => prev ? {
          ...prev,
          itineraryData: result.modifiedItinerary,
        } : prev);
        if (mapInstance.current) {
          setTimeout(() => renderDayOnMap(mapInstance.current, result.modifiedItinerary, activeDay), 200);
        }
        const aiMsg = result.summary || "✅ Itinerary updated based on your request!";
        setAiMessages(prev => [...prev, { role: "ai", text: aiMsg }]);
        if (result.suggestions?.length) {
          setAiMessages(prev => [...prev, {
            role: "ai",
            text: "💡 " + result.suggestions.slice(0, 3).join(" • "),
          }]);
        }
        toast.success("AI customization applied!");
      } else {
        // AI responded but didn't modify the itinerary structure
        const aiMsg = result?.summary || "I understood your request! The itinerary has been noted. Try a more specific request like \"add a restaurant on Day 2\"";
        setAiMessages(prev => [...prev, { role: "ai", text: aiMsg }]);
      }
    } catch (err: any) {
      console.error("AI customize error:", err);
      const errMsg = err?.message || "AI customization failed. Make sure the backend is running on port 5000.";
      toast.error(errMsg);
      setAiMessages(prev => [...prev, { role: "ai", text: `❌ Error: ${errMsg}` }]);
    } finally {
      setAiLoading(false);
    }
  };

  /* ── Save Trip ───────────────────────────────────────────────── */
  const handleSave = async () => {
    if (!itinerary) return;

    // Require login to save
    if (!isAuthenticated) {
      toast.error("Please sign in to save your trip.", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/login", { state: { from: "/itinerary/view" } }),
        },
      });
      return;
    }

    setSaving(true);
    try {
      await saveTrip({
        title: `${itinerary.city} — ${itinerary.days}-Day ${itinerary.budget.charAt(0).toUpperCase() + itinerary.budget.slice(1)} Trip`,
        city: itinerary.city,
        days: itinerary.days,
        budget: itinerary.budget,
        interests: itinerary.interests,
        itineraryData: itinerary.itineraryData,
        costEstimate: itinerary.costEstimate,
        metadata: itinerary.metadata,
      });
      setSaved(true);
      toast.success("Trip saved to My Trips!");
    } catch (err: any) {
      toast.error(err?.message || "Could not save trip. Make sure the backend is running.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Weather Adaptive ────────────────────────────────────────── */
  const handleWeatherAdapt = async () => {
    if (!itinerary) return;
    if (weatherAdapted) {
      toast.info("Weather adaptation is already applied to this itinerary.");
      return;
    }
    setWeatherLoading(true);
    toast.loading("Fetching weather forecast…", { id: "weather-toast" });
    try {
      const result = await getWeatherAdaptive({
        city: itinerary.city,
        itineraryData: itinerary.itineraryData,
      });
      if (result && result.itineraryData && Array.isArray(result.itineraryData)) {
        setItinerary(prev => prev ? { ...prev, itineraryData: result.itineraryData } : prev);
        setWeatherAdapted(true);
        if (mapInstance.current) {
          setTimeout(() => renderDayOnMap(mapInstance.current, result.itineraryData, activeDay), 200);
        }
        toast.success(
          result.simulated
            ? "🌤 Weather-smart schedule applied! (simulated forecast)"
            : "🌦 Real weather forecast applied! Itinerary reshuffled.",
          { id: "weather-toast" }
        );
      } else {
        toast.error("Weather service returned unexpected data.", { id: "weather-toast" });
      }
    } catch (err: any) {
      console.error("Weather adapt error:", err);
      toast.error(
        err?.message || "Weather adaptation failed. Make sure the backend is running on port 5000.",
        { id: "weather-toast" }
      );
    } finally {
      setWeatherLoading(false);
    }
  };

  /* ── Share ───────────────────────────────────────────────────── */
  const handleShare = () => {
    let text = `🗺️ My ${itinerary?.days}-day trip to ${itinerary?.city} planned by Journify!\n`;
    text += `Budget: ${itinerary?.budget} | Interests: ${itinerary?.interests?.join(", ")}\n\n`;

    itinerary?.itineraryData?.forEach((day) => {
      text += `Day ${day.day}:\n`;
      day.places?.forEach((place) => {
        text += `- ${place.name} (${place.timeSlot})\n`;
      });
      text += `\n`;
    });

    text += `Planned at: ${window.location.origin}`;

    // Primary: Clipboard API (requires HTTPS or localhost)
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        toast.success("Detailed itinerary copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      // Fallback: execCommand for HTTP contexts
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.focus();
    el.select();
    try {
      const ok = document.execCommand("copy");
      if (ok) {
        setCopied(true);
        toast.success("Trip details copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      } else {
        toast.error("Could not copy. Please copy the URL manually.");
      }
    } catch {
      toast.error("Copy not supported in this browser.");
    } finally {
      document.body.removeChild(el);
    }
  };

  /* ── No Data State ────────────────────────────────────────────── */
  if (!itinerary) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-md">
            <AlertTriangle className="w-16 h-16 text-secondary mx-auto" />
            <h2 className="text-2xl text-foreground">No Itinerary Found</h2>
            <p className="text-muted-foreground font-body">
              You haven't generated an itinerary yet. Create a new trip to get started!
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
            src={`https://source.unsplash.com/1600x600/?${encodeURIComponent(city)},travel`}
            alt={city}
            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&h=600&fit=crop"; }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container-custom">
              <Link to="/" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm font-body mb-3 transition">
                <ChevronLeft className="w-4 h-4" /> Back
              </Link>
              <h1 className="text-3xl md:text-5xl text-white mb-2">{city} Trip Itinerary</h1>
              <div className="flex flex-wrap gap-4 text-white/80 text-sm font-body">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{days} Days</span>
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4" />
                  {budget.charAt(0).toUpperCase() + budget.slice(1)} Budget
                </span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{interests?.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Action Bar ───────────────────────────────────────── */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="container-custom px-4 md:px-8 py-3 flex flex-wrap items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-medium font-body transition disabled:opacity-60"
            id="save-trip-btn"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Bookmark className="w-4 h-4 fill-emerald-600" /> : <BookmarkPlus className="w-4 h-4" />}
            {saved ? "Saved!" : "Save Trip"}
          </button>

          <button
            onClick={() => setAiOpen(!aiOpen)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium font-body transition ${
              aiOpen ? "bg-purple-600 text-white shadow-md" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
            }`}
            id="ai-customize-btn"
          >
            <Sparkles className="w-4 h-4" /> AI Customize
          </button>

          <button
            onClick={handleWeatherAdapt}
            disabled={weatherLoading || weatherAdapted}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 text-sm font-medium font-body transition disabled:opacity-60"
            id="weather-adapt-btn"
          >
            {weatherLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
            {weatherAdapted ? "Weather Applied ✓" : "Weather Adapt"}
          </button>

          <button
            onClick={() => setReplanOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 text-sm font-medium font-body transition"
            id="replan-btn"
          >
            <RefreshCw className="w-4 h-4" /> Replan
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 text-sm font-medium font-body transition ml-auto"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>

      {/* ─── Content ──────────────────────────────────────────── */}
      <div className="container-custom px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Timeline + Map ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Interactive Map */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground font-body flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-secondary" />
                  Optimized Route Map
                </h3>
                <div className="flex gap-1.5 flex-wrap">
                  {itineraryData.map((d) => (
                    <button
                      key={d.day}
                      onClick={() => handleDayMapSwitch(d.day)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold font-body transition-all ${
                        activeDay === d.day
                          ? "text-white shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
                      }`}
                      style={activeDay === d.day ? { backgroundColor: DAY_COLORS[(d.day - 1) % DAY_COLORS.length] } : {}}
                    >
                      Day {d.day}
                    </button>
                  ))}
                </div>
              </div>
              <div ref={mapRef} className="w-full h-72 md:h-96 bg-slate-100 relative">
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground font-body">Loading map…</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Day-by-Day Itinerary */}
            <div>
              <h2 className="text-xl text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                Day-by-Day Itinerary
              </h2>

              {itineraryData && itineraryData.length > 0 ? (
                itineraryData.map((dayPlan) => (
                  <div
                    key={dayPlan.day}
                    className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-4"
                  >
                    {/* Day Header */}
                    <button
                      onClick={() => toggleDay(dayPlan.day)}
                      className="w-full flex items-center justify-between p-5 text-left"
                      id={`day-${dayPlan.day}-toggle`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm font-body shadow-md"
                            style={{ backgroundColor: DAY_COLORS[(dayPlan.day - 1) % DAY_COLORS.length] }}
                          >
                            {dayPlan.day}
                          </div>
                          {dayPlan.day < itineraryData.length && (
                            <div className="absolute left-1/2 top-full w-0.5 h-4 bg-slate-200 -translate-x-1/2" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-base text-foreground" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                            Day {dayPlan.day}
                            {dayPlan.weather && (
                              <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
                                <WeatherIcon condition={dayPlan.weather.condition} />
                                {dayPlan.weather.tempC}°C · {dayPlan.weather.description}
                                {dayPlan.weather.simulated && <span className="text-[10px] text-amber-500">(est.)</span>}
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-muted-foreground font-body">
                            {dayPlan.places?.length || 0} places •{" "}
                            {dayPlan.route?.totalDistanceKm?.toFixed(1) || "0"} km
                            {dayPlan.route?.optimized && <span className="ml-1 text-emerald-500">✓ optimized</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-secondary font-body">
                          {formatINR(dayPlan.dailyCost?.subtotal || 0)}
                        </span>
                        {expandedDays.has(dayPlan.day)
                          ? <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                      </div>
                    </button>

                    {/* Weather Note */}
                    {expandedDays.has(dayPlan.day) && dayPlan.weatherNote && (
                      <div className="mx-5 mb-3 p-3 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-2 text-xs text-sky-700 font-body">
                        <Cloud className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        {dayPlan.weatherNote}
                      </div>
                    )}

                    {/* Day Content */}
                    {expandedDays.has(dayPlan.day) && (
                      <div className="px-5 pb-5 animate-fade-in">
                        <div className="border-t border-border pt-4 space-y-3">
                          {dayPlan.places?.map((place, pIdx) => (
                            <div
                              key={pIdx}
                              className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                            >
                              {/* Step number */}
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1"
                                style={{ backgroundColor: DAY_COLORS[(dayPlan.day - 1) % DAY_COLORS.length] }}
                              >
                                {pIdx + 1}
                              </div>
                              <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0">
                                <TimeSlotIcon slot={place.timeSlot} />
                                <span className="text-[10px] text-muted-foreground capitalize font-body">{place.timeSlot}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-sm text-foreground" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
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
                                    <MapPin className="w-3 h-3 inline mr-1" />{place.address}
                                  </p>
                                )}
                                {place.aiTip && (
                                  <p className="text-xs text-purple-600 font-body mt-1 italic">
                                    <Sparkles className="w-3 h-3 inline mr-1" />{place.aiTip}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] rounded-full font-medium font-body">
                                    {place.category}
                                  </span>
                                  {place.lat && place.lng && (
                                    <a
                                      href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-blue-500 hover:text-blue-700 font-body flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <ExternalLink className="w-3 h-3" /> Maps
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          {dayPlan.route?.optimized && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-body pt-2">
                              <Route className="w-4 h-4 text-emerald-500" />
                              <span>
                                Optimized route: {dayPlan.route.totalDistanceKm?.toFixed(1)} km •{" "}
                                {Math.round(dayPlan.route.totalDurationMin || 0)} min driving
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
          </div>

          {/* ── Right: Cost Summary ───────────────────────────── */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sticky top-32">
              <h3 className="text-lg text-foreground mb-5" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                Cost Summary
              </h3>

              <div className="space-y-3">
                <CostRow icon={<Car className="w-4 h-4" />} label="Travel" amount={costEstimate?.totalTravel || 0} />
                <CostRow icon={<Utensils className="w-4 h-4" />} label="Food" amount={costEstimate?.totalFood || 0} />
                <CostRow icon={<Hotel className="w-4 h-4" />} label="Hotel" amount={costEstimate?.totalHotel || 0} />
                <CostRow icon={<Ticket className="w-4 h-4" />} label="Activities" amount={costEstimate?.totalActivities || 0} />

                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground font-body">Total (per person)</span>
                    <span className="text-xl font-bold text-secondary font-body">
                      {formatINR(costEstimate?.grandTotal || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Algorithm Info */}
              <div className="mt-5 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-700 mb-1 font-body">🧮 Route Optimized</p>
                <p className="text-xs text-emerald-600 font-body">
                  Using Nearest Neighbor + 2-opt TSP heuristic across {itinerary.metadata?.totalPlaces || "?"} places
                  ({itinerary.metadata?.totalDistanceKm?.toFixed(1) || "?"} km total).
                </p>
              </div>

              {/* Inclusions */}
              <div className="mt-5 pt-4 border-t border-border">
                <h4 className="text-sm text-foreground mb-3" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Inclusions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[{ icon: "🏨", label: "Hotel" }, { icon: "🍳", label: "Breakfast" }, { icon: "🚗", label: "Transport" }, { icon: "🎫", label: "Sightseeing" }].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground font-body bg-emerald-50 rounded-lg px-3 py-2">
                      <span>{item.icon}</span><span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2">
                <Link to="/my-trips" className="btn-primary block text-center !text-sm w-full">
                  View My Trips
                </Link>
                <Link to="/create-trip" className="btn-outline block text-center !text-sm w-full">
                  Create Another Trip
                </Link>
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="block text-center text-sm text-secondary hover:text-secondary/80 font-body font-medium transition"
                  >
                    🔐 Sign in to save trips →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── AI Chat Panel ────────────────────────────────────── */}
      {aiOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-border animate-slide-up">
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground font-body">Journify AI Assistant</p>
                <p className="text-xs text-muted-foreground font-body">Powered by OpenAI</p>
              </div>
            </div>
            <button onClick={() => setAiOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 h-56 overflow-y-auto">
            {aiMessages.length === 0 && (
              <div className="text-center py-4">
                <Sparkles className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-body">Ask me to customize your itinerary!</p>
                <div className="flex flex-wrap gap-1 mt-3 justify-center">
                  {["Add more food places", "Make Day 1 relaxed", "Suggest hidden gems", "Reduce budget"].map(s => (
                    <button
                      key={s}
                      onClick={() => setAiPrompt(s)}
                      className="text-[11px] px-2 py-1 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition font-body"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {aiMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs font-body ${
                  msg.role === "user"
                    ? "bg-purple-500 text-white rounded-br-none"
                    : "bg-slate-100 text-foreground rounded-bl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-3 py-2 rounded-xl rounded-bl-none">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !aiLoading && handleAiSubmit()}
              placeholder="e.g. Make Day 2 budget-friendly..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-purple-300 font-body"
              id="ai-prompt-input"
            />
            <button
              onClick={handleAiSubmit}
              disabled={aiLoading || !aiPrompt.trim()}
              className="w-9 h-9 rounded-xl bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Replan Modal ─────────────────────────────────────── */}
      {replanOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Replan Trip
              </h3>
              <button onClick={() => setReplanOpen(false)} className="p-1 rounded-lg hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1 font-body">City</label>
                <input
                  type="text"
                  value={replanCity || city}
                  onChange={(e) => setReplanCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-secondary/40 font-body text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1 font-body">Days</label>
                  <input
                    type="number" min={1} max={14}
                    value={replanDays}
                    onChange={(e) => setReplanDays(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-secondary/40 font-body text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1 font-body">Budget</label>
                  <select
                    value={replanBudget}
                    onChange={(e) => setReplanBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-secondary/40 font-body text-sm"
                  >
                    <option value="budget">Budget</option>
                    <option value="medium">Medium</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setReplanOpen(false)} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium font-body hover:bg-muted transition">
                Cancel
              </button>
              <button
                onClick={async () => {
                  setReplanLoading(true);
                  try {
                    const result = await generateItinerary({
                      city: replanCity || city,
                      days: replanDays,
                      budget: replanBudget,
                      interests,
                    });
                    setItinerary(result as any);
                    setReplanOpen(false);
                    setActiveDay(1);
                    toast.success("Trip replanned successfully!");
                  } catch (err: any) {
                    toast.error(err?.message || "Replan failed.");
                  } finally {
                    setReplanLoading(false);
                  }
                }}
                disabled={replanLoading}
                className="flex-1 py-3 rounded-xl bg-secondary text-white text-sm font-semibold font-body hover:bg-secondary/90 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {replanLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

/* ─── Cost Row Component ──────────────────────────────────────── */
function CostRow({ icon, label, amount }: { icon: React.ReactNode; label: string; amount: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">{icon}<span>{label}</span></div>
      <span className="text-sm font-medium text-foreground font-body">{formatINR(amount)}</span>
    </div>
  );
}
