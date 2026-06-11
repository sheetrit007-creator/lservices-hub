/*
 * Footer — LServices Recruitment Hub
 * Brand: lservicesthecompany.com
 * Colors: #046BD2 (blue), #e7711b (orange), #1e293b (navy)
 */
import { MapPin, Mail, Phone } from "lucide-react";
import { Link } from "wouter";

const LOGO_URL = "/img/logo.png";

export default function Footer() {
  return (
    <footer style={{ background: "#1e293b", color: "rgba(255,255,255,0.7)" }} className="app-footer border-t border-white/10">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="inline-block bg-white rounded-lg px-3 py-2 mb-3">
              <img
                src={LOGO_URL}
                alt="LServices Air Duct Cleaning"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              Atlanta's premier NADCA-certified air duct cleaning company. Building an elite team of certified professionals.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wide" style={{ background: "#046BD2", color: "white", fontFamily: "Barlow Condensed, sans-serif" }}>NADCA</span>
              <span className="text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wide" style={{ background: "#e7711b", color: "white", fontFamily: "Barlow Condensed, sans-serif" }}>IICRC</span>
              <span className="text-xs text-white/50">Certified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
              Recruitment Hub
            </h4>
            <ul className="space-y-2 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              <li><Link href="/jobs/technician" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.7)" }}>Lead Air Duct Technician</Link></li>
              <li><Link href="/screening/tech-quiz" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.7)" }}>Technician Screening Quiz</Link></li>
              <li><Link href="/interview-guide" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.7)" }}>Interview Guide & Rubric</Link></li>
              <li><Link href="/onboarding" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.7)" }}>30-Day Onboarding Plan</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
              Contact
            </h4>
            <ul className="space-y-2 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#046BD2" }} />
                Atlanta, Georgia Metro Area
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#046BD2" }} />
                <a href="tel:4704397970" className="hover:text-white transition-colors">(470) 439-7970</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#046BD2" }} />
                <a href="mailto:careers@lservicesthecompany.com" className="hover:text-white transition-colors">careers@lservicesthecompany.com</a>
              </li>
            </ul>
            <a
              href="https://lservicesthecompany.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-xs hover:text-white transition-colors"
              style={{ color: "#046BD2" }}
            >
              Visit lservicesthecompany.com →
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif" }}>
          <span>© 2026 LServices Air Duct Cleaning. All rights reserved.</span>
          <span>Over 900 Five-Star Reviews · Atlanta Metro Area</span>
        </div>
      </div>
    </footer>
  );
}
