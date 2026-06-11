/*
 * Navbar — LServices Recruitment Hub
 * Brand: lservicesthecompany.com
 * Colors: #046BD2 (blue), #e7711b (orange), #1e293b (navy)
 * Font: Barlow Condensed (headings), Inter (body)
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/#open-roles", label: "Open Roles" },
  { href: "/#screening", label: "Screening" },
  { href: "/#interview", label: "Interview Guide" },
  { href: "/#onboarding", label: "Onboarding" },
  { href: "/career-fit-quiz", label: "Career Fit Quiz", highlight: true },
];

// Real LServices logo from their website
const LOGO_URL = "/img/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      if (location === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-md" : "border-b border-gray-100"
      }`}
      style={{ background: "white" }}
    >
      {/* Top bar */}
      <div style={{ background: "#046BD2" }} className="hidden md:block">
        <div className="container">
          <div className="flex items-center justify-between h-8 text-xs text-white/90">
            <span style={{ fontFamily: "Inter, sans-serif" }}>
              Atlanta's #1 NADCA-Certified Air Duct Cleaning — Over 900 Five-Star Reviews
            </span>
            <a
              href="tel:4704397970"
              className="flex items-center gap-1.5 hover:text-white transition-colors font-semibold"
            >
              <Phone className="w-3 h-3" />
              (470) 439-7970
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo — white background on white nav = clean, no visible bg box */}
          <Link href="/" className="flex items-center group">
            <img
              src={LOGO_URL}
              alt="LServices Air Duct Cleaning"
              className="h-11 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.highlight ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm font-semibold transition-colors duration-150 rounded"
                  style={{ fontFamily: "Inter, sans-serif", color: "#046BD2" }}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-3 py-1.5 text-sm font-medium transition-colors duration-150 rounded hover:bg-gray-50"
                  style={{ fontFamily: "Inter, sans-serif", color: "#475569" }}
                >
                  {link.label}
                </button>
              )
            )}
            <Link
              href="/#open-roles"
              onClick={() => handleNavClick("/#open-roles")}
              className="ml-3 px-5 py-2 text-white font-bold rounded transition-all duration-150 hover:opacity-90 active:scale-97 text-sm tracking-wide uppercase"
              style={{
                background: "#e7711b",
                fontFamily: "Barlow Condensed, sans-serif",
                letterSpacing: "0.08em",
              }}
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            style={{ color: "#1e293b" }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) =>
              link.highlight ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded transition-colors block"
                  style={{ color: "#046BD2" }}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium hover:bg-gray-50 rounded transition-colors"
                  style={{ color: "#475569" }}
                >
                  {link.label}
                </button>
              )
            )}
            <Link
              href="/#open-roles"
              onClick={() => handleNavClick("/#open-roles")}
              className="mt-2 px-4 py-2.5 text-white font-bold rounded text-center text-sm uppercase tracking-wide"
              style={{ background: "#e7711b", fontFamily: "Barlow Condensed, sans-serif" }}
            >
              Apply Now
            </Link>
            <a
              href="tel:4704397970"
              className="mt-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded"
              style={{ color: "#475569" }}
            >
              <Phone className="w-4 h-4" /> (470) 439-7970
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
