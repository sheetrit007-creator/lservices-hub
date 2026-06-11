/*
 * InterviewGuide — Full interview stages and scoring rubric
 * Design: Industrial Precision meets Modern Craft
 */
import { Link } from "wouter";
import { ArrowLeft, Phone, Users, ClipboardList, Star, CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stages = [
  {
    icon: <Phone className="w-5 h-5" />,
    stage: "Stage 1",
    title: "Phone Screen",
    duration: "15–20 minutes",
    color: "#046BD2",
    goal: "Verify basics and assess phone demeanor. This is the first live interaction — evaluate communication quality, not just answers.",
    questions: [
      "Tell me about your current or most recent role.",
      "Why are you looking to leave / what's prompting your search?",
      "What are your salary expectations?",
      "Are you comfortable working in confined spaces like residential attics, and participating in safe, two-person team lifts for heavy wheeled equipment (80–100 lbs)?",
      "What is your availability for an in-person interview this week?",
    ],
    lookFor: "Clear phone voice, no excessive filler words, honest and direct answers, realistic salary expectations, genuine interest in the role.",
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    stage: "Stage 2",
    title: "In-Person Evaluation",
    duration: "60 minutes",
    color: "#e7711b",
    goal: "Assess cultural fit, behavioral tendencies, and practical skills. This is the most critical stage.",
    questions: [
      "Tell me about a time you had to deal with a difficult customer. How did you handle it?",
      "Describe a situation where you made a mistake on the job. What happened and what did you learn?",
      "How do you prioritize when you have multiple urgent tasks competing for your attention?",
      "What does 'quality work' mean to you?",
      "Describe how you push through a physically or mentally demanding day.",
      "Walk me through how you would set up for a standard residential duct cleaning job.",
    ],
    lookFor: "Specific examples (not vague generalities), ownership of mistakes, customer-first mindset, methodical thinking, and genuine enthusiasm for the craft.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    stage: "Stage 3",
    title: "Culture Fit / Ride-Along",
    duration: "Half-day (paid)",
    color: "#1e293b",
    goal: "Validate real-world behavior. Observe how the candidate interacts with customers, handles unexpected situations, and works alongside existing team members.",
    questions: [
      "Observe: Does the candidate arrive on time and dressed appropriately?",
      "Observe: How do they interact with the Lead Tech — do they ask good questions?",
      "Observe: How do they interact with the customer — are they professional and warm?",
      "Observe: Do they show initiative or wait to be told every step?",
      "Debrief question: What was your biggest takeaway from today?",
    ],
    lookFor: "Punctuality, professionalism, curiosity, initiative, and genuine enthusiasm for the work. Red flags: phone use during customer interactions, dismissiveness toward safety protocols.",
  },
];

const rubric = [
  {
    criteria: "Punctuality & Presentation",
    weight: "10%",
    scores: [
      { range: "1–2", desc: "Arrived late; unprofessional attire; brought no resume or materials." },
      { range: "3", desc: "On time; standard attire; brought a resume." },
      { range: "4–5", desc: "Arrived early; highly professional appearance; prepared with thoughtful questions." },
    ],
  },
  {
    criteria: "Communication Clarity",
    weight: "25%",
    scores: [
      { range: "1–2", desc: "Mumbles; uses excessive slang; struggles to explain past roles or experiences." },
      { range: "3", desc: "Clear speech; answers questions directly without elaboration." },
      { range: "4–5", desc: "Articulate; explains complex technical or software concepts in plain language; listens actively." },
    ],
  },
  {
    criteria: "Customer Empathy",
    weight: "25%",
    scores: [
      { range: "1–2", desc: "Blames customers for past issues; dismissive of complaints; no examples of going above and beyond." },
      { range: "3", desc: "Understands customer frustration; offers standard apologies and solutions." },
      { range: "4–5", desc: "Highly empathetic; focuses on solutions and de-escalation; provides specific examples of exceptional service." },
    ],
  },
  {
    criteria: "Reliability & Accountability",
    weight: "25%",
    scores: [
      { range: "1–2", desc: "Blames previous employers for failures; job-hopping history without clear reasons; vague about past responsibilities." },
      { range: "3", desc: "Takes responsibility for basic tasks; steady work history." },
      { range: "4–5", desc: "Owns mistakes clearly; provides examples of going above and beyond; demonstrated long-term commitment in past roles." },
    ],
  },
  {
    criteria: "Safety & Compliance (Technicians)",
    weight: "15%",
    scores: [
      { range: "1–2", desc: "Dismissive of safety gear; mentions cutting corners; no knowledge of safety protocols." },
      { range: "3", desc: "Understands basic safety rules; wears PPE when required." },
      { range: "4–5", desc: "Prioritizes safety proactively; cites specific protocols (ladder safety, PPE, confined space); asks about company safety standards." },
    ],
  },
];

export default function InterviewGuide() {
  return (
    <div className="min-h-screen bg-[#F0F5FA]">
      <Navbar />
      <div className="pt-16">
        <div className="bg-[#1e293b] py-12">
          <div className="container">
            <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Recruitment Hub
            </Link>
            <span className="text-[#e7711b] text-xs font-mono uppercase tracking-widest block mb-2">Phase 3</span>
            <h1 className="text-white text-3xl font-bold" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Interview Guide & Scoring Rubric</h1>
            <p className="text-white/60 mt-2 max-w-xl">A structured, three-stage interview process with question banks and a weighted scoring rubric for consistent, fair evaluation.</p>
          </div>
        </div>

        <div className="container py-12 space-y-10">
          {/* Interview Stages */}
          <div>
            <h2 className="text-2xl font-bold text-[#1e293b] mb-6" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
              The Three Interview Stages
            </h2>
            <div className="space-y-6">
              {stages.map((s, i) => (
                <div key={s.stage} className="bg-white rounded-xl border border-[#D1D5DB] overflow-hidden">
                  <div className="flex items-center gap-4 p-5 border-b border-[#D1D5DB]" style={{ borderLeftWidth: "4px", borderLeftColor: s.color }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: s.color }}>
                      {s.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#475569]">{s.stage}</span>
                        <span className="text-xs px-2 py-0.5 bg-[#F0F5FA] rounded-full text-[#475569]">{s.duration}</span>
                      </div>
                      <h3 className="font-bold text-[#1e293b]" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>{s.title}</h3>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-[#1e293b] mb-2">Stage Goal</h4>
                      <p className="text-sm text-[#475569] mb-4">{s.goal}</p>
                      <h4 className="text-sm font-semibold text-[#1e293b] mb-2">What to Look For</h4>
                      <div className="flex items-start gap-2 p-3 bg-[#F0F5FA] rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-[#475569]">{s.lookFor}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1e293b] mb-2">Question Bank</h4>
                      <ul className="space-y-2">
                        {s.questions.map((q) => (
                          <li key={q} className="flex items-start gap-2 text-sm text-[#475569]">
                            <span className="font-mono text-[#e7711b] flex-shrink-0">›</span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring Rubric */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-5 h-5 text-[#e7711b]" />
              <h2 className="text-2xl font-bold text-[#1e293b]" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                Scoring Rubric (1–5 Scale)
              </h2>
            </div>
            <div className="space-y-4">
              {rubric.map((r) => (
                <div key={r.criteria} className="bg-white rounded-xl border border-[#D1D5DB] overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 bg-[#F0F5FA] border-b border-[#D1D5DB]">
                    <h4 className="font-semibold text-[#1e293b] text-sm" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>{r.criteria}</h4>
                    <span className="text-xs font-mono text-[#046BD2] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">Weight: {r.weight}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D1D5DB]">
                    {r.scores.map((sc) => (
                      <div key={sc.range} className="p-4">
                        <div className={`inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full mb-2 ${
                          sc.range === "1–2" ? "bg-red-50 text-red-600 border border-red-200" :
                          sc.range === "3" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                          "bg-green-50 text-green-600 border border-green-200"
                        }`}>
                          {sc.range === "1–2" ? <AlertCircle className="w-3 h-3" /> : sc.range === "4–5" ? <CheckCircle2 className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                          Score {sc.range}
                        </div>
                        <p className="text-sm text-[#475569]">{sc.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Scoring note */}
            <div className="mt-6 p-5 bg-[#1e293b] rounded-xl text-white">
              <h4 className="font-semibold mb-2" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Scoring Guidance</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Calculate a weighted total score out of 5. Candidates scoring 4.0+ are strong hires. Candidates scoring 3.0–3.9 may be considered with additional reference checks. Candidates scoring below 3.0 should not be advanced. Any score of 1–2 in Safety & Compliance (for Technician roles) is an automatic disqualifier regardless of other scores.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
