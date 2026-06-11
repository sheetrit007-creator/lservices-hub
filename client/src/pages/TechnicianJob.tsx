/*
 * TechnicianJob — Lead Air Duct Technician Job Description
 * Brand: lservicesthecompany.com
 * Colors: #046BD2 (blue), #e7711b (orange), #1e293b (navy)
 */
import { Link } from "wouter";
import { ArrowLeft, MapPin, Clock, DollarSign, CheckCircle2, Award, Shield, Wrench, ChevronRight, Phone, ClipboardList } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TECH_PHOTO = "/img/work/work-09.jpeg";
const BLUE = "#046BD2";
const ORANGE = "#e7711b";
const NAVY = "#1e293b";
const BG = "#F0F5FA";

export default function TechnicianJob() {
  return (
    <div className="min-h-screen" style={{ background: BG }}>
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="relative py-16 overflow-hidden" style={{ background: NAVY }}>
          <img src={TECH_PHOTO} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" style={{ objectPosition: "center top" }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${NAVY} 60%, transparent)` }} />
          <div className="container relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Recruitment Hub
            </Link>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border mb-4" style={{ background: `${BLUE}25`, borderColor: `${BLUE}40` }}>
              <Wrench className="w-3.5 h-3.5" style={{ color: BLUE }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: BLUE, fontFamily: "Barlow Condensed, sans-serif" }}>Field Track</span>
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
              Lead Air Duct Technician
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-white/70" style={{ fontFamily: "Inter, sans-serif" }}>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" style={{ color: ORANGE }} /> $22–$28/hr + Performance Bonuses</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" style={{ color: ORANGE }} /> Full-Time</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" style={{ color: ORANGE }} /> Atlanta, GA Metro Area</span>
            </div>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-xl p-6 border" style={{ borderColor: "#D1D5DB" }}>
                <h2 className="text-2xl font-bold mb-4 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>About LServices</h2>
                <p className="leading-relaxed" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>
                  LServices Air Duct Cleaning is a premier NADCA-certified HVAC and indoor air quality service provider in the Atlanta metro area. With over 900 five-star reviews, we pride ourselves on delivering professional, high-standard technical services to residential and commercial clients. We treat every client as family — and we build our team the same way.
                </p>
              </div>

              {/* Responsibilities */}
              <div className="bg-white rounded-xl p-6 border" style={{ borderColor: "#D1D5DB" }}>
                <h2 className="text-2xl font-bold mb-5 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>Key Responsibilities</h2>
                <ul className="space-y-3">
                  {[
                    "Perform comprehensive air duct cleaning per NADCA ACR (Assessment, Cleaning, and Restoration) standards",
                    "Operate negative air pressure machines, HEPA vacuum systems, rotary brushes, and air whips",
                    "Conduct pre-job inspections and post-job quality checks; document with before/after photos",
                    "Communicate clearly with homeowners about findings, process, and recommendations",
                    "Identify and report mold, pest intrusion, or ductwork damage requiring remediation",
                    "Maintain, clean, and perform basic maintenance on all assigned equipment",
                    "Complete job documentation accurately in Housecall Pro (time, materials, notes, photos)",
                    "Upsell additional services (dryer vent cleaning, chimney sweep) when appropriate",
                    "Adhere to all safety protocols, PPE requirements, and OSHA guidelines",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: "#334155", fontFamily: "Inter, sans-serif" }}>
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: BLUE }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-xl p-6 border" style={{ borderColor: "#D1D5DB" }}>
                <h2 className="text-2xl font-bold mb-5 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase mb-3" style={{ color: BLUE, fontFamily: "Barlow Condensed, sans-serif" }}>Required</h3>
                    <ul className="space-y-2">
                      {[
                        "Physical Stamina & Teamwork: Capable of safely maneuvering heavy, wheeled equipment (up to 100 lbs) and performing two-person team lifts when loading or navigating stairs.",
                        "Confined Spaces: Fully comfortable working in tight and enclosed environments, specifically residential attics and crawl spaces.",
                        "Tool Proficiency: Capable of safely operating various power tools alongside HEPA vacuums and rotary brushes.",
                        "Reliability: Must possess a valid driver's license and reliable personal transportation.",
                        "1–2 years HVAC, duct cleaning, or related trade experience",
                        "Excellent customer communication skills",
                        "Smartphone proficiency (Housecall Pro app)",
                        "Ability to pass background check and drug screening",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#334155", fontFamily: "Inter, sans-serif" }}>
                          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: BLUE }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase mb-3" style={{ color: ORANGE, fontFamily: "Barlow Condensed, sans-serif" }}>Preferred</h3>
                    <ul className="space-y-2">
                      {[
                        "NADCA ASCS certification (or willingness to obtain)",
                        "IICRC certification in any category",
                        "Experience with negative air pressure equipment",
                        "Knowledge of HVAC systems and ductwork materials",
                        "Bilingual (English/Spanish) a plus",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#334155", fontFamily: "Inter, sans-serif" }}>
                          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: ORANGE }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Take the Quiz CTA Banner */}
              <div
                className="rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                style={{ background: `linear-gradient(135deg, #0a2540 0%, #1a3a5c 100%)`, border: "2px solid #00cfff33" }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(0,207,255,0.15)", border: "1px solid rgba(0,207,255,0.3)" }}>
                    <ClipboardList className="w-6 h-6" style={{ color: "#00cfff" }} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#00cfff", fontFamily: "Barlow Condensed, sans-serif" }}>Next Step</div>
                    <h3 className="text-2xl font-bold text-white uppercase mb-1" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Take the Career Fit Quiz</h3>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}>
                      10–15 minutes. Tell us about your mindset, work ethic, and how you handle real-world field situations. Our hiring team reviews every submission personally.
                    </p>
                  </div>
                </div>
                <Link
                  href="/career-fit-quiz"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded uppercase tracking-wide text-base transition-all hover:opacity-90 active:scale-97 whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, #1a6bdb, #00cfff)", color: "#0a2540", fontFamily: "Barlow Condensed, sans-serif", fontSize: 16 }}
                >
                  <ClipboardList className="w-5 h-5" />
                  Start Quiz →
                </Link>
              </div>

              {/* Certification Path */}
              <div className="rounded-xl p-6 text-white" style={{ background: NAVY }}>
                <div className="flex items-center gap-3 mb-5">
                  <Award className="w-5 h-5" style={{ color: ORANGE }} />
                  <h2 className="text-2xl font-bold uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Certification Path</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      cert: "NADCA ASCS",
                      full: "Air Systems Cleaning Specialist",
                      timeline: "Target: 90 days",
                      details: "The industry's premier certification. Covers ACR standards, equipment operation, and contamination protocols. Exam fee: $385.",
                      color: BLUE,
                    },
                    {
                      cert: "IICRC",
                      full: "Institute of Inspection, Cleaning & Restoration",
                      timeline: "Target: 6 months",
                      details: "Covers mold remediation, water damage, and indoor air quality. Highly valued for commercial contracts.",
                      color: ORANGE,
                    },
                  ].map((cert) => (
                    <div key={cert.cert} className="rounded-lg p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 text-white text-xs font-bold rounded uppercase" style={{ background: cert.color, fontFamily: "Barlow Condensed, sans-serif" }}>{cert.cert}</span>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Inter, sans-serif" }}>{cert.timeline}</span>
                      </div>
                      <div className="text-sm font-semibold mb-1" style={{ fontFamily: "Inter, sans-serif" }}>{cert.full}</div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}>{cert.details}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm mt-4" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}>
                  LServices provides study materials, exam prep support, and partial exam fee reimbursement for employees who pass within the target timeline.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply CTA */}
              <div className="bg-white rounded-xl p-6 border sticky top-24" style={{ borderColor: "#D1D5DB" }}>
                <h3 className="text-xl font-bold mb-4 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>Apply Now</h3>
                <div className="space-y-3 mb-5 text-sm" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>
                  <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" style={{ color: BLUE }} /> $22–$28/hr + Bonuses</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" style={{ color: BLUE }} /> Full-Time, Mon–Sat</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: BLUE }} /> Atlanta Metro Area</div>
                </div>
                <Link
                  href="/career-fit-quiz"
                  className="block w-full text-center py-3 font-bold rounded uppercase tracking-wide text-sm transition-all hover:opacity-90 active:scale-97 mb-3"
                  style={{ background: "linear-gradient(135deg, #1a6bdb, #00cfff)", color: "#0a2540", fontFamily: "Barlow Condensed, sans-serif" }}
                >
                  Take Career Fit Quiz
                </Link>
                <Link
                  href="/screening/tech-quiz"
                  className="block w-full text-center py-3 text-white font-bold rounded uppercase tracking-wide text-sm transition-all hover:opacity-90 active:scale-97 mb-3"
                  style={{ background: BLUE, fontFamily: "Barlow Condensed, sans-serif" }}
                >
                  Technical Screening Quiz
                </Link>
                <a
                  href="tel:4704397970"
                  className="flex items-center justify-center gap-2 w-full py-2.5 border rounded text-sm font-semibold transition-all hover:bg-gray-50"
                  style={{ borderColor: "#D1D5DB", color: NAVY, fontFamily: "Inter, sans-serif" }}
                >
                  <Phone className="w-4 h-4" /> (470) 439-7970
                </a>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-xl p-6 border" style={{ borderColor: "#D1D5DB" }}>
                <h3 className="text-xl font-bold mb-4 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>Benefits</h3>
                <ul className="space-y-2">
                  {[
                    "Performance-based pay increases",
                    "Company vehicle provided",
                    "All equipment and uniforms supplied",
                    "Paid certification prep and exam support",
                    "Flexible scheduling",
                    "Paid time off",
                    "Team culture — small company, big family",
                  ].map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm" style={{ color: "#334155", fontFamily: "Inter, sans-serif" }}>
                      <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ORANGE }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
