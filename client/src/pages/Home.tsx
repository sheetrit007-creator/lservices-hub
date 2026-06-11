/*
 * Home — LServices Recruitment Hub
 * Brand: lservicesthecompany.com
 * Primary: #046BD2 (blue), Accent: #e7711b (orange), Dark: #1e293b (navy)
 * Font: Barlow Condensed (headings), Inter (body)
 * Images: Real LServices photos from their website
 */
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Wrench,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Award,
  Users,
  ClipboardList,
  BookOpen,
  Shield,
  Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Real LServices images
const TECH_PHOTO = "/img/work/work-09.jpeg";
const MASCOT_IMG = "/img/mascot.png";

// Brand colors
const BLUE = "#046BD2";
const ORANGE = "#e7711b";
const NAVY = "#1e293b";
const NAVY_DEEP = "#0f172a";
const BG = "#F0F5FA";

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`animate-on-scroll ${className}`}>
      {children}
    </div>
  );
}

const funnelSteps = [
  { step: "01", title: "Application Review", desc: "Filter resumes for valid driver's license, Atlanta location, and minimum 1–2 years of relevant experience." },
  { step: "02", title: "Technical Quiz", desc: "Automated 5-question technical quiz covering HVAC fundamentals, negative pressure, HEPA standards, and field protocols." },
  { step: "03", title: "Phone Screen (15 min)", desc: "Assess communication skills, verify salary expectations, and confirm availability." },
  { step: "04", title: "In-Person Evaluation", desc: "Behavioral interview plus a practical equipment or live software test." },
  { step: "05", title: "Reference & Background Check", desc: "Verify employment history, driving record, and conduct a drug screening." },
];

const interviewStages = [
  {
    icon: <Phone className="w-5 h-5" />,
    stage: "Stage 1",
    title: "Phone Screen",
    duration: "15–20 min",
    desc: "Verify basics and assess phone demeanor. Cover current role, reason for leaving, salary expectations, and comfort with physical or software demands.",
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    stage: "Stage 2",
    title: "In-Person Evaluation",
    duration: "60 min",
    desc: "Review quiz answers together and run a practical test: equipment setup, negative pressure walk-through, and a simulated customer interaction.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    stage: "Stage 3",
    title: "Culture Fit / Ride-Along",
    duration: "Half-day (paid)",
    desc: "Technicians join a Lead Tech for a paid half-day ride-along. Observe work ethic, punctuality, and real customer interactions in the field.",
  },
];

const rubricItems = [
  { criteria: "Punctuality & Presentation", red: "Late; unprofessional; unprepared", top: "Early; polished; prepared with questions" },
  { criteria: "Communication Clarity", red: "Mumbles; struggles to explain past roles", top: "Articulate; explains complex concepts simply" },
  { criteria: "Customer Empathy", red: "Blames customers; dismissive of complaints", top: "Solution-focused; skilled at de-escalation" },
  { criteria: "Reliability & Accountability", red: "Blames employers; job-hopping history", top: "Owns mistakes; goes above and beyond" },
  { criteria: "Safety & Compliance (Techs)", red: "Dismissive of safety gear; cuts corners", top: "Prioritizes safety; cites specific protocols" },
];

const onboardingWeeks = [
  { week: "Week 1", items: ["HR paperwork, core values, uniform distribution, safety orientation", "Equipment familiarization: negative air machine, HEPA vacuums, air whips", "Field shadowing — observation only, ride along with Lead Tech"] },
  { week: "Week 2", items: ["Assisted field work: prep home, run hoses, clean registers under supervision", "Software training: Housecall Pro — clock-in, job notes, before/after photos"] },
  { week: "Week 3", items: ["Lead execution on standard residential jobs with Lead Tech observing", "Certification prep: NADCA ASCS Candidate Guide, ACR Standard chapters 1–2"] },
  { week: "Week 4", items: ["Solo evaluation: full day of jobs as lead or crew lead", "30-day performance review: customer satisfaction, job completion time", "Set NADCA ASCS / IICRC certification target date and study schedule"] },
];


export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: BG }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ background: NAVY_DEEP }}>
        {/* Background photo */}
        <div className="absolute inset-0">
          <img
            src={TECH_PHOTO}
            alt="LServices technician at work"
            className="w-full h-full object-cover opacity-20"
            style={{ objectPosition: "center top" }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${NAVY_DEEP} 55%, transparent)` }} />
        </div>

        {/* Diagonal clip */}
        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: BG, clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />

        <div className="container relative z-10 pt-24 pb-24">
          <div className="max-w-2xl">
            {/* Location badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6" style={{ background: `${BLUE}20`, borderColor: `${BLUE}40` }}>
              <MapPin className="w-3.5 h-3.5" style={{ color: BLUE }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: BLUE, fontFamily: "Barlow Condensed, sans-serif" }}>Atlanta, Georgia</span>
            </div>

            <h1
              className="text-white leading-none mb-5 uppercase"
              style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 800, fontSize: "clamp(2.8rem, 6vw, 4.5rem)", letterSpacing: "-0.01em" }}
            >
              Build a Career.<br />
              <span style={{ color: ORANGE }}>Not Just a Job.</span>
            </h1>

            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl" style={{ fontFamily: "Inter, sans-serif" }}>
              LServices Air Duct Cleaning is hiring elite Field Technicians in Atlanta. NADCA certification paths, performance pay, and a team that treats every client as family.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/jobs/technician"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded transition-all duration-150 hover:opacity-90 active:scale-97 uppercase tracking-wide"
                style={{ background: BLUE, fontFamily: "Barlow Condensed, sans-serif", fontSize: "1rem" }}
              >
                <Wrench className="w-4 h-4" />
                View Open Position
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
              {[
                { icon: <Star className="w-4 h-4" />, label: "900+ Five-Star Reviews" },
                { icon: <Award className="w-4 h-4" />, label: "NADCA Certified" },
                { icon: <Shield className="w-4 h-4" />, label: "Fully Insured" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 text-white/60 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                  <span style={{ color: ORANGE }}>{stat.icon}</span>
                  {stat.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mascot floating */}
        <div className="absolute right-0 bottom-0 hidden lg:block" style={{ width: "380px", zIndex: 5 }}>
          <img src={MASCOT_IMG} alt="LServices mascot" className="w-full h-auto object-contain" style={{ filter: "drop-shadow(0 0 40px rgba(4,107,210,0.3))" }} />
        </div>
      </section>

      {/* ── OPEN ROLES ── */}
      <section id="open-roles" className="py-20" style={{ background: BG }}>
        <div className="container">
          <AnimatedSection>
            <div className="mb-12">
              <span className="section-label">Phase 1 — Job Postings</span>
              <h2 className="mt-2 text-4xl font-bold uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>
                Open Roles in Atlanta
              </h2>
              <p className="mt-3 max-w-xl" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>
                One role. Built on craft, accountability, and growth.
              </p>
            </div>
          </AnimatedSection>

          <div className="max-w-2xl">
            <AnimatedSection delay={0}>
              <div className="group bg-white rounded-xl border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col" style={{ borderColor: "#D1D5DB" }}>
                <div className="relative h-64 overflow-hidden">
                  <img src={TECH_PHOTO} alt="Field Technician" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ objectPosition: "center top" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)" }} />
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-white text-xs font-bold rounded uppercase tracking-wide" style={{ background: BLUE, fontFamily: "Barlow Condensed, sans-serif" }}>
                      <Wrench className="w-3 h-3" /> Now Hiring
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col">
                  <div className="border-l-4 pl-4 mb-4" style={{ borderColor: BLUE }}>
                    <h3 className="text-2xl font-bold uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>
                      Lead Air Duct Technician
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4 text-sm" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> $22–$28/hr + Bonuses</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Full-Time</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Atlanta Metro</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {[
                      "Perform air duct cleaning per NADCA ACR standards",
                      "Operate HEPA vacuum systems and rotary brush equipment",
                      "Clear path to NADCA ASCS certification (company-sponsored)",
                      "Strong customer communication skills required",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#334155", fontFamily: "Inter, sans-serif" }}>
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: BLUE }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/jobs/technician"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-white font-bold rounded transition-all duration-150 hover:opacity-90 active:scale-97 text-sm uppercase tracking-wide"
                    style={{ background: NAVY, fontFamily: "Barlow Condensed, sans-serif" }}
                  >
                    View Full Job Description <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Sourcing platforms */}
          <AnimatedSection delay={150} className="mt-10">
            <div className="rounded-xl p-6 text-white" style={{ background: NAVY }}>
              <h4 className="font-bold mb-4 uppercase tracking-wide" style={{ fontFamily: "Barlow Condensed, sans-serif", color: ORANGE }}>
                Recommended Sourcing Platforms — Atlanta Market
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "Indeed", type: "General" },
                  { name: "ZipRecruiter", type: "General" },
                  { name: "HVACJobsCenter.com", type: "Trade-Specific" },
                  { name: "SkilledTrades.com", type: "Trade-Specific" },
                  { name: "Atlanta Technical College", type: "Pipeline" },
                  { name: "Georgia Piedmont Tech", type: "Pipeline" },
                  { name: "Facebook Trade Groups", type: "Local" },
                  { name: "Glassdoor", type: "General" },
                ].map((p) => (
                  <div key={p.name} className="rounded-lg p-3 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: BLUE, fontFamily: "Barlow Condensed, sans-serif" }}>{p.type}</div>
                    <div className="text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── SCREENING FUNNEL ── */}
      <section id="screening" className="py-20 bg-white">
        <div className="container">
          <AnimatedSection>
            <div className="mb-12">
              <span className="section-label">Phase 2 — Screening</span>
              <h2 className="mt-2 text-4xl font-bold uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>
                The Screening Funnel
              </h2>
              <p className="mt-3 max-w-xl" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>
                A structured 5-step process ensures you only invest interview time in highly qualified candidates.
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-4 mb-14">
            {funnelSteps.map((s, i) => (
              <AnimatedSection key={s.step} delay={i * 60}>
                <div className="flex items-start gap-4 p-5 rounded-xl border transition-colors hover:border-blue-300" style={{ background: BG, borderColor: "#D1D5DB" }}>
                  <div className="step-badge flex-shrink-0">{s.step}</div>
                  <div>
                    <h4 className="font-bold text-lg uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>{s.title}</h4>
                    <p className="text-sm mt-0.5" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>{s.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

        </div>
      </section>

      {/* ── INTERVIEW STAGES ── */}
      <section id="interview" className="py-20" style={{ background: BG }}>
        <div className="container">
          <AnimatedSection>
            <div className="mb-12">
              <span className="section-label">Phase 3 — Interviews</span>
              <h2 className="mt-2 text-4xl font-bold uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>
                Structured Interview Process
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {interviewStages.map((stage, i) => (
              <AnimatedSection key={stage.stage} delay={i * 80}>
                <div className="bg-white rounded-xl p-6 border hover:shadow-lg transition-all duration-300 h-full" style={{ borderColor: "#D1D5DB" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ background: NAVY }}>
                      {stage.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9CA3AF", fontFamily: "Barlow Condensed, sans-serif" }}>{stage.stage}</div>
                      <h4 className="font-bold text-lg uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>{stage.title}</h4>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs mb-3" style={{ background: "#F0F5FA", color: "#475569", fontFamily: "Inter, sans-serif" }}>
                    <Clock className="w-3 h-3" /> {stage.duration}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>{stage.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Scoring Rubric */}
          <AnimatedSection>
            <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#D1D5DB" }}>
              <div className="px-6 py-4 flex items-center gap-3" style={{ background: NAVY }}>
                <Star className="w-5 h-5" style={{ color: ORANGE }} />
                <h3 className="font-bold text-white text-lg uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                  Scoring Rubric — Communication & Reliability (1–5 Scale)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ background: BG, borderColor: "#E5E7EB" }}>
                      <th className="text-left px-5 py-3 font-bold uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>Criteria</th>
                      <th className="text-left px-5 py-3 font-bold uppercase text-red-600" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>1–2 Red Flags</th>
                      <th className="text-left px-5 py-3 font-bold uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: BLUE }}>4–5 Top Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rubricItems.map((row, i) => (
                      <tr key={row.criteria} className="border-b" style={{ background: i % 2 === 0 ? "white" : BG, borderColor: "#E5E7EB" }}>
                        <td className="px-5 py-3.5 font-semibold" style={{ color: NAVY, fontFamily: "Inter, sans-serif" }}>{row.criteria}</td>
                        <td className="px-5 py-3.5" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>{row.red}</td>
                        <td className="px-5 py-3.5" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>{row.top}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 border-t" style={{ background: BG, borderColor: "#E5E7EB" }}>
                <Link href="/interview-guide" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: BLUE, fontFamily: "Inter, sans-serif" }}>
                  View Full Interview Guide <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── ONBOARDING ── */}
      <section id="onboarding" className="py-20 bg-white">
        <div className="container">
          <AnimatedSection>
            <div className="mb-12">
              <span className="section-label">Phase 4 — Onboarding</span>
              <h2 className="mt-2 text-4xl font-bold uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>
                30-Day Onboarding Plan
              </h2>
              <p className="mt-3 max-w-xl" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>
                Structured onboarding reduces turnover and accelerates the time for a new hire to become productive in the field.
              </p>
            </div>
          </AnimatedSection>

          {/* Quote banner */}
          <AnimatedSection className="mb-12">
            <div className="relative rounded-2xl overflow-hidden" style={{ background: NAVY, padding: "2.5rem" }}>
              <div className="absolute top-0 right-0 opacity-10">
                <img src={MASCOT_IMG} alt="" className="h-48 w-auto" />
              </div>
              <p className="text-white text-xl font-bold max-w-lg relative z-10" style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "1.6rem" }}>
                "Where fresh air begins — small company, so we treat each client as family."
              </p>
              <p className="mt-2 text-sm font-semibold relative z-10" style={{ color: ORANGE, fontFamily: "Barlow Condensed, sans-serif" }}>— LServices Company Motto</p>
              <div className="flex items-center gap-3 mt-4 relative z-10">
                <a href="tel:4704397970" className="inline-flex items-center gap-2 px-4 py-2 text-white font-bold rounded text-sm uppercase tracking-wide" style={{ background: BLUE, fontFamily: "Barlow Condensed, sans-serif" }}>
                  <Phone className="w-3.5 h-3.5" /> (470) 439-7970
                </a>
                <a href="https://lservicesthecompany.com" target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}>
                  lservicesthecompany.com →
                </a>
              </div>
            </div>
          </AnimatedSection>

          <div className="max-w-2xl">
            <div className="space-y-4">
              {onboardingWeeks.map((w, i) => (
                <AnimatedSection key={w.week} delay={i * 70}>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: BLUE }}>
                        {i + 1}
                      </div>
                      {i < onboardingWeeks.length - 1 && <div className="w-px flex-1 mt-2" style={{ background: `${BLUE}30` }} />}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="font-bold text-sm uppercase mb-2" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>{w.week}</div>
                      <ul className="space-y-1.5">
                        {w.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>
                            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: BLUE }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          <AnimatedSection delay={100} className="mt-10">
            <div className="text-center">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded transition-all hover:opacity-90 active:scale-97 uppercase tracking-wide"
                style={{ background: NAVY, fontFamily: "Barlow Condensed, sans-serif" }}
              >
                <BookOpen className="w-4 h-4" />
                View Full Onboarding Plan
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── SEE OUR AMAZING WORK ── */}
      <section id="our-work" className="py-20 bg-white">
        <div className="container">
          <AnimatedSection>
            <div className="mb-10">
              <span className="section-label">Real Jobs. Real Results.</span>
              <h2 className="mt-2 text-4xl font-bold uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: NAVY }}>
                See Our Amazing Work
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>
                From residential homes to large commercial facilities — our NADCA-certified technicians bring the same standard of excellence to every job.
              </p>
            </div>
          </AnimatedSection>

          {/* Masonry-style photo grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
            {[
              { src: "/img/work/work-01.jpeg", alt: "Commercial duct prep with plastic containment" },
              { src: "/img/work/work-02.jpeg", alt: "Technician applying antimicrobial treatment in full PPE" },
              { src: "/img/work/work-03.jpeg", alt: "Commercial HVAC duct work at industrial facility" },
              { src: "/img/work/work-04.jpg",  alt: "LServices technician cleaning ceiling duct in church hall" },
              { src: "/img/work/work-05.jpeg", alt: "NADCA-certified tech cleaning vent cover on scaffolding" },
              { src: "/img/work/work-06.jpg",  alt: "Technician inspecting ceiling duct access panel" },
              { src: "/img/work/work-07.jpg",  alt: "Two-man crew on scissor lift at large commercial job site" },
              { src: "/img/work/work-08.jpeg", alt: "Technician operating air compressor at construction site" },
              { src: "/img/work/work-09.jpeg", alt: "LServices branded service van at commercial job site" },
              { src: "/img/work/work-10.jpeg", alt: "LServices crew at large-scale commercial project" },
            ].map((photo, i) => (
              <AnimatedSection key={photo.src} delay={i * 40} className="break-inside-avoid">
                <div className="group relative overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ display: "block" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement!.style.display = "none";
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                    style={{ background: "linear-gradient(to top, rgba(15,23,42,0.75) 0%, transparent 60%)" }}
                  >
                    <p className="text-white text-xs font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{photo.alt}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* CTA under gallery */}
          <AnimatedSection delay={200} className="mt-10 text-center">
            <p className="text-sm mb-4" style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}>
              Think you have what it takes to be part of this team?
            </p>
            <Link
              href="/career-fit-quiz"
              className="inline-flex items-center gap-2 px-7 py-3 text-white font-bold rounded transition-all hover:opacity-90 active:scale-97 uppercase tracking-wide"
              style={{ background: BLUE, fontFamily: "Barlow Condensed, sans-serif" }}
            >
              Take the Career Fit Quiz <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
