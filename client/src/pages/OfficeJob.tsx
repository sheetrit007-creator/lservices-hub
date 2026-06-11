/*
 * OfficeJob — Office Administrator / Dispatcher Job Description
 * Brand: lservicesthecompany.com
 * Colors: #046BD2 (blue), #e7711b (orange), #1e293b (navy)
 */
import { Link } from "wouter";
import { ArrowLeft, MapPin, Clock, DollarSign, CheckCircle2, Monitor, Shield, ChevronRight, Phone, Zap, ClipboardList } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BLUE = "#046BD2";
const ORANGE = "#e7711b";
const NAVY = "#1e293b";
const BG = "#F0F5FA";

export default function OfficeJob() {
  return (
    <div className="min-h-screen" style={{ background: BG }}>
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="relative py-16 overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3a5c 100%)` }}>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, #046BD2 0, #046BD2 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
          </div>
          <div className="container relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Recruitment Hub
            </Link>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border mb-4" style={{ background: `${ORANGE}25`, borderColor: `${ORANGE}40` }}>
              <Monitor className="w-3.5 h-3.5" style={{ color: ORANGE }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ORANGE, fontFamily: "Barlow Condensed, sans-serif" }}>Office Track</span>
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
              Office Administrator<br />/ Dispatcher
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-white/70" style={{ fontFamily: "Inter, sans-serif" }}>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" style={{ color: ORANGE }} /> $18–$24/hr + Performance Incentives</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" style={{ color: ORANGE }} /> Full-Time</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" style={{ color: ORANGE }} /> In-Office, Atlanta, GA</span>
            </div>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-xl p-6 border" style={{ borderColor: "#D1D5DB" }}>
                <h2 className="text-2xl font-bold mb-4 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>About the Role</h2>
                <p className="leading-relaxed" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>
                  As an Office Administrator and Dispatcher at LServices, you are the operational backbone of our field service operation. You will manage scheduling, customer communications, and CRM workflows that keep our technicians productive and our clients delighted. This role requires a fast-thinking, tech-savvy individual who thrives in a dynamic service environment.
                </p>
              </div>

              {/* Responsibilities */}
              <div className="bg-white rounded-xl p-6 border" style={{ borderColor: "#D1D5DB" }}>
                <h2 className="text-2xl font-bold mb-5 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>Key Responsibilities</h2>
                <ul className="space-y-3">
                  {[
                    "Manage daily dispatch board in Housecall Pro — assign, schedule, and optimize technician routes across Atlanta metro",
                    "Handle all inbound customer calls, texts, and emails with professionalism and urgency",
                    "Operate GoHighLevel CRM for lead nurturing, pipeline management, and marketing automation oversight",
                    "Resolve scheduling conflicts, last-minute cancellations, and emergency re-routing in real time",
                    "Process invoices, track technician commissions, and prepare payroll inputs",
                    "Manage automated customer communication sequences (appointment reminders, review requests)",
                    "Maintain accurate customer records, job histories, and follow-up notes in CRM",
                    "Coordinate with technicians in the field to relay updates and support job completion",
                    "Assist with social media scheduling, Google review responses, and basic marketing tasks",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: "#334155", fontFamily: "Inter, sans-serif" }}>
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: ORANGE }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Software Stack */}
              <div className="rounded-xl p-6 text-white" style={{ background: NAVY }}>
                <div className="flex items-center gap-3 mb-5">
                  <Zap className="w-5 h-5" style={{ color: ORANGE }} />
                  <h2 className="text-2xl font-bold uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Software Stack</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Housecall Pro",
                      category: "Field Service Management",
                      uses: ["Job scheduling and dispatch", "Technician time tracking", "Invoice generation and payment", "Before/after photo documentation"],
                      color: BLUE,
                    },
                    {
                      name: "GoHighLevel",
                      category: "CRM & Marketing Automation",
                      uses: ["Lead pipeline management", "Automated follow-up sequences", "Review request campaigns", "Customer communication hub"],
                      color: ORANGE,
                    },
                  ].map((sw) => (
                    <div key={sw.name} className="rounded-lg p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 text-white text-xs font-bold rounded uppercase" style={{ background: sw.color, fontFamily: "Barlow Condensed, sans-serif" }}>{sw.name}</span>
                      </div>
                      <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Barlow Condensed, sans-serif" }}>{sw.category}</div>
                      <ul className="space-y-1">
                        {sw.uses.map((u) => (
                          <li key={u} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Inter, sans-serif" }}>
                            <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: sw.color }} />
                            {u}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Inter, sans-serif" }}>
                  Prior experience with Housecall Pro or GoHighLevel is a strong plus. Candidates with experience in similar platforms (ServiceTitan, Jobber, HubSpot) will be considered.
                </p>
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
                      10–15 minutes. Show us how you think, communicate, and handle real scheduling and CRM scenarios. Our hiring team reviews every submission personally.
                    </p>
                  </div>
                </div>
                <Link
                  href="/career-fit-quiz"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 font-bold rounded uppercase tracking-wide text-base transition-all hover:opacity-90 active:scale-97 whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, #1a6bdb, #00cfff)", color: "#0a2540", fontFamily: "Barlow Condensed, sans-serif", fontSize: 16 }}
                >
                  <ClipboardList className="w-5 h-5" />
                  Start Quiz →
                </Link>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-xl p-6 border" style={{ borderColor: "#D1D5DB" }}>
                <h2 className="text-2xl font-bold mb-5 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase mb-3" style={{ color: BLUE, fontFamily: "Barlow Condensed, sans-serif" }}>Required</h3>
                    <ul className="space-y-2">
                      {[
                        "2+ years in customer service, dispatch, or office admin",
                        "Strong written and verbal communication skills",
                        "High proficiency with CRM or scheduling software",
                        "Ability to multi-task in a fast-paced environment",
                        "Comfortable handling escalated customer situations",
                        "Basic math skills for commission tracking",
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
                        "Experience with Housecall Pro or GoHighLevel",
                        "Background in home services industry",
                        "Experience managing marketing automations",
                        "Bilingual (English/Spanish) a strong plus",
                        "Knowledge of Atlanta metro geography",
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply CTA */}
              <div className="bg-white rounded-xl p-6 border sticky top-24" style={{ borderColor: "#D1D5DB" }}>
                <h3 className="text-xl font-bold mb-4 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>Apply Now</h3>
                <div className="space-y-3 mb-5 text-sm" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>
                  <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" style={{ color: ORANGE }} /> $18–$24/hr + Incentives</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" style={{ color: ORANGE }} /> Full-Time, Mon–Sat</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: ORANGE }} /> In-Office, Atlanta</div>
                </div>
                <Link
                  href="/career-fit-quiz"
                  className="block w-full text-center py-3 text-white font-bold rounded uppercase tracking-wide text-sm transition-all hover:opacity-90 active:scale-97 mb-3"
                  style={{ background: "linear-gradient(135deg, #1a6bdb, #00cfff)", color: "#0a2540", fontFamily: "Barlow Condensed, sans-serif" }}
                >
                  Take the Career Fit Quiz
                </Link>
                <a
                  href="mailto:careers@lservicesthecompany.com?subject=Application: Office Administrator"
                  className="block w-full text-center py-3 font-bold rounded uppercase tracking-wide text-sm transition-all hover:opacity-90 active:scale-97 mb-3 border"
                  style={{ borderColor: ORANGE, color: ORANGE, fontFamily: "Barlow Condensed, sans-serif", background: "transparent" }}
                >
                  Email Your Resume
                </a>
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
                    "Performance incentive bonuses",
                    "Booking rate commissions",
                    "Paid training on all software",
                    "Paid time off",
                    "Growth path to Operations Manager",
                    "Collaborative team environment",
                    "Small company — your voice matters",
                  ].map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm" style={{ color: "#334155", fontFamily: "Inter, sans-serif" }}>
                      <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: BLUE }} />
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
