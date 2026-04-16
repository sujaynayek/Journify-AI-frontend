import { Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Smile,
  ChevronRight,
  Star,
  Navigation,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─── Destination Data ───────────────────────────────────────── */
const destinations = [
  {
    name: "Puri",
    price: "₹17,000",
    duration: "4 Days Trip",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=750&fit=crop",
    tag: "Popular",
  },
  {
    name: "Darjeeling",
    price: "₹15,000",
    duration: "5 Days Trip",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=750&fit=crop",
    tag: "Trending",
  },
  {
    name: "Sundarban",
    price: "₹6,000",
    duration: "4 Days Trip",
    image:
      "https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=600&h=750&fit=crop",
    tag: "Adventure",
  },
];

/* ─── Steps Data ──────────────────────────────────────────────── */
const steps = [
  {
    icon: <MapPin className="w-7 h-7" />,
    title: "Choose Your Destination",
    desc: "Select your dream destination, travel dates, budget and group size.",
    color: "bg-orange-50 text-orange-500",
  },
  {
    icon: <Calendar className="w-7 h-7" />,
    title: "Get Itinerary",
    desc: "Instantly generate a complete, budget-friendly roadmap for your stay and sightseeing totally free of cost.",
    color: "bg-rose-50 text-rose-500",
  },
  {
    icon: <Smile className="w-7 h-7" />,
    title: "Enjoy Your Journey",
    desc: "Receive your budget-friendly roadmap instantly and start packing, your complete travel guide is ready for the journey.",
    color: "bg-emerald-50 text-emerald-500",
  },
];

/* ─── Testimonials Data ───────────────────────────────────────── */
const testimonials = [
  {
    name: "Amit Sharma",
    location: "Kolkata, West Bengal",
    quote:
      "Working with them wasn't just a great experience; it's a bond of trust. Every problem found a solution, and the team was always a call away. Thank you from the heart!",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Priya Roy",
    location: "Mumbai, Maharashtra",
    quote:
      "Journify made my Darjeeling trip absolutely magical. The AI itinerary was so well planned that we didn't miss a single spot!",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Rahul Verma",
    location: "Delhi, NCR",
    quote:
      "The budget estimation was spot on! We spent exactly what was predicted. Highly recommended for budget-conscious travelers.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
];

/* ─── Intersection Observer Hook ──────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const destSection = useInView();
  const stepsSection = useInView();
  const testimonialSection = useInView();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-white overflow-x-hidden">
      <Navbar />

      {/* ─── Hero Section ─────────────────────────────────────── */}
      <section
        id="home"
        className="min-h-screen flex items-center relative overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 opacity-10">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle
                key={i}
                cx={100 + i * 15}
                cy={100 + i * 10}
                r={60 - i * 8}
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary"
              />
            ))}
          </svg>
        </div>

        <div className="container-custom px-4 md:px-8 pt-24 pb-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-fade-in">
              <p className="text-secondary font-semibold tracking-wide uppercase text-sm font-body">
                Best Destinations Around India
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-foreground">
                Your Next Adventure{" "}
                <span className="text-secondary">Customized</span> to Your
                Perfect Budget.
              </h1>
              <p className="text-muted-foreground text-base lg:text-lg max-w-xl font-body leading-relaxed">
                Explore breathtaking destinations, create personalized
                AI-powered itineraries, and find the perfect trip that matches
                your budget and travel style — completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/create-trip" className="btn-primary inline-flex items-center justify-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Create Trip
                </Link>
                <a href="#destinations" className="btn-outline inline-flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Browse Itineraries
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end animate-slide-in-right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-3xl blur-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=550&h=650&fit=crop"
                  alt="Traveler exploring adventure"
                  className="relative rounded-3xl shadow-2xl w-full max-w-md lg:max-w-lg h-auto object-cover"
                />
                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground font-body">
                        Top Destination
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        Darjeeling, India
                      </p>
                    </div>
                  </div>
                </div>
                {/* Stats Card */}
                <div className="absolute -top-4 -right-4 glass rounded-2xl p-4 animate-float" style={{ animationDelay: "1s" }}>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-secondary font-body">
                      200+
                    </p>
                    <p className="text-xs text-muted-foreground font-body">
                      Trips Generated
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Top Destinations ─────────────────────────────────── */}
      <section
        id="destinations"
        ref={destSection.ref}
        className="section-padding bg-white"
      >
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-secondary font-semibold text-sm uppercase tracking-wide font-body mb-2">
              Top Selling
            </p>
            <h2 className="text-foreground mb-3">Top Destinations</h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-body">
              Discover the most popular and breathtaking destinations chosen by
              travelers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((dest, idx) => (
              <div
                key={dest.name}
                className={`group rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                  destSection.inView
                    ? "animate-slide-up"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="relative overflow-hidden h-80">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-foreground font-body">
                      {dest.tag}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className="text-lg text-foreground"
                      style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
                    >
                      {dest.name}
                    </h3>
                    <span className="text-secondary font-bold font-body">
                      {dest.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-body">
                      {dest.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3 Easy Steps ─────────────────────────────────────── */}
      <section
        ref={stepsSection.ref}
        className="section-padding bg-gradient-to-br from-slate-50 via-white to-orange-50/30"
      >
        <div className="container-custom px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div>
              <p className="text-secondary font-semibold text-sm uppercase tracking-wide font-body mb-2">
                Easy and Fast
              </p>
              <h2 className="text-foreground mb-10">
                Book Your Next Trip In 3 Easy Steps
              </h2>

              <div className="space-y-8">
                {steps.map((step, idx) => (
                  <div
                    key={step.title}
                    className={`flex gap-5 ${
                      stepsSection.inView
                        ? "animate-slide-up"
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{ animationDelay: `${idx * 200}ms` }}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center flex-shrink-0`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <h3
                        className="text-lg text-foreground mb-1"
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed font-body">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image Card */}
            <div
              className={`flex justify-center ${
                stepsSection.inView ? "animate-scale-in" : "opacity-0 scale-90"
              }`}
              style={{ animationDelay: "300ms" }}
            >
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-xl p-6 max-w-sm">
                  <img
                    src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop"
                    alt="Trip to Goa"
                    className="w-full h-52 object-cover rounded-2xl mb-4"
                  />
                  <div className="space-y-1">
                    <h4
                      className="text-base text-foreground"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Trip To Goa
                    </h4>
                    <p className="text-xs text-muted-foreground font-body">
                      14-29 June &nbsp;|&nbsp; by Journify AI
                    </p>
                    <div className="flex gap-3 pt-2">
                      {["✏️", "📍", "✈️"].map((emoji, i) => (
                        <span
                          key={i}
                          className="w-9 h-9 bg-muted rounded-full flex items-center justify-center text-sm"
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary border-2 border-white"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-body">
                      24 people going
                    </span>
                  </div>
                </div>

                {/* Ongoing Trip Badge */}
                <div className="absolute -right-6 top-8 glass rounded-2xl p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground font-body">
                        Ongoing
                      </p>
                      <p
                        className="text-xs text-foreground"
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Trip to Darjeeling
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-emerald-500 font-semibold font-body">
                          40%
                        </span>
                        <span className="text-[10px] text-muted-foreground font-body">
                          completed
                        </span>
                      </div>
                      <div className="w-24 h-1.5 bg-muted rounded-full mt-1">
                        <div className="w-[40%] h-full bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────── */}
      <section
        id="about"
        ref={testimonialSection.ref}
        className="section-padding bg-white"
      >
        <div className="container-custom px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left */}
            <div
              className={
                testimonialSection.inView
                  ? "animate-fade-in"
                  : "opacity-0"
              }
            >
              <p className="text-secondary font-semibold text-sm uppercase tracking-wide font-body mb-2">
                Safar Ki Kahaniyan
              </p>
              <h2 className="text-foreground mb-8">
                Those Who Connected With Us
              </h2>

              {/* Testimonial Card */}
              <div className="relative min-h-[200px]">
                {testimonials.map((t, idx) => (
                  <div
                    key={t.name}
                    className={`absolute inset-0 transition-all duration-500 ${
                      idx === activeTestimonial
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-8 pointer-events-none"
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-secondary/20"
                      />
                      <div>
                        <p className="text-muted-foreground italic text-sm leading-relaxed font-body mb-3">
                          "{t.quote}"
                        </p>
                        <p
                          className="text-foreground text-sm"
                          style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 600,
                          }}
                        >
                          {t.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-body">
                          {t.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots */}
              <div className="flex gap-2 mt-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === activeTestimonial
                        ? "bg-foreground w-8"
                        : "bg-muted-foreground/30"
                    }`}
                    aria-label={`Testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Image Grid */}
            <div
              className={`grid grid-cols-2 gap-4 ${
                testimonialSection.inView
                  ? "animate-slide-in-right"
                  : "opacity-0 translate-x-8"
              }`}
            >
              {[
                "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=350&h=400&fit=crop",
                "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=350&h=250&fit=crop",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=350&h=250&fit=crop",
                "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=350&h=400&fit=crop",
              ].map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Travel gallery ${idx + 1}`}
                  className={`rounded-2xl shadow-lg w-full object-cover hover:scale-105 transition-transform duration-500 ${
                    idx % 2 === 0 ? "h-56" : "h-44"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-primary to-[#1a2540]">
        <div className="container-custom text-center space-y-6">
          <h2 className="text-white text-3xl md:text-4xl">
            Ready to Plan Your Dream Trip?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto font-body">
            Let our AI create the perfect itinerary customized to your budget,
            interests, and travel style. It's free and takes just seconds.
          </p>
          <Link
            to="/create-trip"
            className="btn-primary inline-flex items-center gap-2 !text-base"
          >
            Start Planning Now
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
