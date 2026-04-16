import { Link } from "react-router-dom";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1B1E28] text-white">
      {/* Newsletter Section */}
      <div className="container-custom px-4 md:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-5 mb-16">
          <h2 className="text-2xl md:text-3xl text-white leading-tight">
            Subscribe to get information, latest news and other interesting
            offers about Journify
          </h2>
          <p className="text-gray-400 font-body text-sm">
            Get exclusive travel tips, destination guides, and special offers
            delivered to your inbox
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 mt-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Your email"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/30 transition font-body text-sm"
              />
            </div>
            <button className="btn-primary whitespace-nowrap !text-sm">
              Subscribe
            </button>
          </form>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center font-bold text-white text-lg">
                J
              </div>
              <span
                className="text-2xl font-bold"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Journi<span className="text-secondary">fy</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-body">
              Your trusted companion for discovering and planning perfect trips,
              customized to your budget and style.
            </p>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3
              className="font-semibold text-base text-white"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Company
            </h3>
            <ul className="space-y-3 text-sm text-gray-400 font-body">
              {["About Us", "Blog", "Careers", "Press"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3
              className="font-semibold text-base text-white"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Support
            </h3>
            <ul className="space-y-3 text-sm text-gray-400 font-body">
              {[
                "Help Center",
                "Contact Us",
                "Privacy Policy",
                "Terms of Service",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3
              className="font-semibold text-base text-white"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Contact
            </h3>
            <div className="space-y-3 text-sm text-gray-400 font-body">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 text-secondary" />
                <span>info@journify.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 flex-shrink-0 mt-0.5 text-secondary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-secondary" />
                <span>Kolkata, West Bengal, India</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-secondary" />
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-body">
            © {new Date().getFullYear()} Journify. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-body">
            {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-gray-500 hover:text-white transition-colors duration-200"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
