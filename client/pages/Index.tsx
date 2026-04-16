import { Menu, X, Mail, MapPin, Phone, Clock } from "lucide-react";
import { useState } from "react";

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-custom section-padding py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                J
              </div>
              <span className="text-xl font-bold text-foreground">Journify</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-foreground hover:text-primary transition">
                Home
              </a>
              <a href="#destinations" className="text-foreground hover:text-primary transition">
                Trips
              </a>
              <a href="#destinations" className="text-foreground hover:text-primary transition">
                Destinations
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition">
                About
              </a>
              <button className="btn-primary">Login</button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <a href="#home" className="block text-foreground hover:text-primary">
                Home
              </a>
              <a href="#destinations" className="block text-foreground hover:text-primary">
                Trips
              </a>
              <a href="#destinations" className="block text-foreground hover:text-primary">
                Destinations
              </a>
              <a href="#about" className="block text-foreground hover:text-primary">
                About
              </a>
              <button className="btn-primary w-full">Login</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="section-padding bg-gradient-to-r from-blue-50 to-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Next Adventure Customized to Your Perfect Budget.
              </h1>
              <p className="text-lg text-gray-600">
                Explore breathtaking destinations, create personalized itineraries, and find
                the perfect trip that matches your budget and travel style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary">Start Planning</button>
                <button className="btn-outline">Explore Trips</button>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary rounded-full opacity-20 blur-3xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=600&fit=crop"
                  alt="Adventure traveler"
                  className="rounded-2xl shadow-xl w-full h-auto object-cover"
                />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary rounded-full opacity-10 blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Destinations Section */}
      <section id="destinations" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Top Destinations
            </h2>
            <p className="text-gray-600 text-lg">
              Discover the most popular and breathtaking destinations chosen by travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Bali, Indonesia",
                desc: "Tropical paradise with beaches",
                image:
                  "https://images.unsplash.com/photo-1537225228614-b4b713f7cab2?w=400&h=500&fit=crop",
              },
              {
                title: "Swiss Alps",
                desc: "Stunning mountain landscapes",
                image:
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop",
              },
              {
                title: "Vietnam Countryside",
                desc: "Rice paddies and culture",
                image:
                  "https://images.unsplash.com/photo-1488951515173-56d7c3b76b0b?w=400&h=500&fit=crop",
              },
            ].map((destination, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group"
              >
                <div className="relative overflow-hidden h-64 md:h-72 bg-gray-200">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-lg text-foreground">{destination.title}</h3>
                  <p className="text-gray-600 text-sm">{destination.desc}</p>
                  <div className="flex items-center gap-2 mt-3 text-primary font-semibold cursor-pointer hover:gap-3 transition-all">
                    <span>Explore</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Your Trip Section */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Book Your Next Trip In 3 Easy Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choose Your Destination",
                desc: "Browse through hundreds of handpicked destinations and find the perfect match for your travel dreams.",
              },
              {
                step: "2",
                title: "Customize Your Itinerary",
                desc: "Create a personalized trip plan with activities, accommodations, and dining options that fit your style.",
              },
              {
                step: "3",
                title: "Book & Travel",
                desc: "Finalize your bookings, get real-time support, and embark on your unforgettable adventure.",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1569144611169-2398ebb4a7ff?w=600&h=400&fit=crop"
              alt="Trip planning"
              className="rounded-2xl shadow-xl max-w-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Those Who Connected With Us Section */}
      <section id="about" className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Those Who Connected With Us
              </h2>
              <p className="text-gray-600 text-lg">
                Join thousands of travelers who have already discovered their perfect journey with
                Journify. Read what they have to say about their unforgettable experiences.
              </p>

              <div className="space-y-6">
                {[
                  {
                    name: "Sarah Johnson",
                    role: "Adventure Seeker",
                    quote: "Journify made planning my trip so easy and affordable!",
                    image:
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
                  },
                  {
                    name: "Michael Chen",
                    role: "Budget Traveler",
                    quote: "The best app for customizing trips to match your budget.",
                    image:
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
                  },
                ].map((testimonial, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                      <p className="font-semibold text-foreground mt-2">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                {[
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=300&fit=crop",
                ].map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="rounded-lg shadow-md w-full h-48 object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="section-padding bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container-custom max-w-2xl">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Subscribe to get information, latest news and other interesting offers about Journify
            </h2>
            <p className="text-gray-600">
              Get exclusive travel tips, destination guides, and special offers delivered to your inbox
            </p>

            <form className="flex flex-col sm:flex-row gap-3 mt-8">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-primary transition"
                required
              />
              <button type="submit" className="btn-secondary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center font-bold">
                  J
                </div>
                <span className="text-xl font-bold">Journify</span>
              </div>
              <p className="text-gray-300 text-sm">
                Your trusted companion for discovering and planning perfect trips.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Support</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>info@journify.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 Journify. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                Facebook
              </a>
              <a href="#" className="hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition">
                Instagram
              </a>
              <a href="#" className="hover:text-white transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
