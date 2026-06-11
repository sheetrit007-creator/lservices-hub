/*
 * Onboarding — Full 30-day onboarding plan with checklists
 * Brand: lservicesthecompany.com — #046BD2 blue, #e7711b orange, #1e293b navy
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Wrench, CheckSquare, Square, Award, BookOpen, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const TEAM_IMG = "/img/work/work-09.jpeg";

const techPlan = [
  {
    week: "Week 1",
    title: "Orientation & The LServices Way",
    color: "#046BD2",
    items: [
      "Complete HR paperwork, benefits enrollment, and I-9 verification",
      "Receive company uniform, PPE kit, and equipment bag",
      "Review LServices core values, safety handbook, and SOPs",
      "Equipment familiarization in the shop: negative air machine, HEPA vacuums, air whips",
      "Hands-on practice: connecting hoses, setting up negative pressure, safe equipment operation",
      "Field shadowing Day 1: ride along with Lead Tech — observation only",
      "Field shadowing Day 2: observe full customer interaction from arrival to payment",
    ],
  },
  {
    week: "Week 2",
    title: "Assisted Field Work & Software Training",
    color: "#046BD2",
    items: [
      "Begin performing basic tasks under supervision: prep home, lay floor protection, run hoses",
      "Clean registers and grilles independently while Lead Tech handles air handler",
      "Housecall Pro training: clock in/out, review job notes, capture before/after photos",
      "Practice generating invoices and collecting payment in the app",
      "Complete first solo equipment setup and teardown (supervised)",
      "End-of-week debrief with supervisor: questions, feedback, and goals for Week 3",
    ],
  },
  {
    week: "Week 3",
    title: "Lead Execution & Certification Prep",
    color: "#046BD2",
    items: [
      "Take the lead on standard residential jobs with Lead Tech observing and grading",
      "Handle full customer communication: arrival greeting, walkthrough, explanation, close",
      "Begin NADCA ASCS Candidate Guide: read and understand the ACR Standard overview",
      "Complete Chapters 1–2 of ASCS study material (HVAC system components, contamination types)",
      "Shadow Lead Tech on one commercial job to observe different scope and complexity",
      "Review and self-score using the company's field performance checklist",
    ],
  },
  {
    week: "Week 4",
    title: "Solo Evaluation & Goal Setting",
    color: "#046BD2",
    items: [
      "Run a full day of residential jobs solo or as lead of a two-person crew",
      "Complete all job documentation, photos, and invoicing independently",
      "30-day performance review with supervisor: customer satisfaction scores, job completion time",
      "Set NADCA ASCS certification target date and study schedule",
      "Register for NADCA ASCS Online Training Course or self-study materials",
      "Discuss IICRC certification pathway and career advancement goals",
    ],
  },
];


function ChecklistItem({ text }: { text: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <button
      onClick={() => setChecked(!checked)}
      className="flex items-start gap-3 w-full text-left group py-1.5"
    >
      {checked
        ? <CheckSquare className="w-4 h-4 text-[#046BD2] flex-shrink-0 mt-0.5 transition-colors" />
        : <Square className="w-4 h-4 text-[#D1D5DB] flex-shrink-0 mt-0.5 group-hover:text-[#475569] transition-colors" />}
      <span className={`text-sm transition-colors ${checked ? "line-through text-[#94a3b8]" : "text-[#334155]"}`}>
        {text}
      </span>
    </button>
  );
}

function WeekCard({ week, color }: { week: typeof techPlan[0]; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#D1D5DB] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#D1D5DB]" style={{ borderLeftWidth: "4px", borderLeftColor: color }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: color }}>
          {week.week.replace("Week ", "")}
        </div>
        <div>
          <div className="text-xs font-mono text-[#475569]">{week.week}</div>
          <h4 className="font-semibold text-[#1e293b] text-sm" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>{week.title}</h4>
        </div>
      </div>
      <div className="p-5 space-y-0.5">
        {week.items.map((item) => (
          <ChecklistItem key={item} text={item} />
        ))}
      </div>
    </div>
  );
}

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-[#F0F5FA]">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="relative bg-[#1e293b] py-12 overflow-hidden">
          <img src={TEAM_IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-[#1e293b]/80" />
          <div className="container relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Recruitment Hub
            </Link>
            <div className="inline-flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-[#e7711b]" />
              <span className="text-[#e7711b] text-xs font-mono uppercase tracking-widest">Field Technician · Phase 4</span>
            </div>
            <h1 className="text-white text-3xl font-bold mb-2" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>30-Day Onboarding Plan</h1>
            <p className="text-white/60 max-w-xl text-sm">Interactive checklist for new Field Technician hires. Check off items as they are completed to track progress week by week.</p>
          </div>
        </div>

        <div className="container py-10">
          {/* Checklist note */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-8 text-sm text-[#334155]">
            <BookOpen className="w-4 h-4 text-[#046BD2] flex-shrink-0 mt-0.5" />
            <p>Click any checklist item to mark it as complete. Progress resets on page refresh. Use this during weekly check-ins with your new hire.</p>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {techPlan.map((week) => (
              <WeekCard key={week.week} week={week} color={week.color} />
            ))}
          </div>

          {/* Download note */}
          <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-[#D1D5DB]">
            <div>
              <h4 className="font-semibold text-[#1e293b] text-sm" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Export This Checklist</h4>
              <p className="text-xs text-[#475569] mt-0.5">Print or save the full onboarding checklist for use in new hire folders or HR systems.</p>
            </div>
            <button
              onClick={() => {
                window.print();
                toast.success("Print dialog opened");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e293b] text-white text-sm font-semibold rounded transition-all hover:bg-[#2d3f55] active:scale-97"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              <Download className="w-4 h-4" /> Print / Save
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
