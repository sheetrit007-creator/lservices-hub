/*
 * CareerFitQuiz — LServices Career Fit Quiz
 * Ported from the standalone HTML quiz provided by LServices.
 * Preserves: multi-section quiz, GHL webhook, resume upload,
 *            candidate result page, interviewer scoring panel.
 * Brand: lservicesthecompany.com — #046BD2 blue, #e7711b orange, #1e293b navy
 * Design: Dark mode quiz (deep navy/cyan) matching original HTML design
 */
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Video, Upload, X } from "lucide-react";

// ── CONSTANTS ─────────────────────────────────────────────
const GHL_WEBHOOK =
  "https://services.leadconnectorhq.com/hooks/RMaDiB6FbFkCZ5TFMxEA/webhook-trigger/5a8dafee-b534-4a5c-a673-8181f618ee72";

const LOGO_URL = "/img/logo.png";

// ── QUESTIONS ─────────────────────────────────────────────
type QuestionType = "choice" | "text" | "scenario";
interface Option { label: string; score: number; }
interface Question {
  section: string | null;
  sectionId: string;
  text: string;
  hint?: string;
  type: QuestionType;
  category?: string;
  options?: Option[];
}

const questions: Question[] = [
  // PART 1: MULTIPLE CHOICE
  {
    section: "Section A — Mindset & Ownership", sectionId: "a",
    text: "What typically makes you stay long-term at a company?", type: "choice", category: "a",
    options: [
      { label: "Growth opportunities, fair pay, and feeling genuinely valued.", score: 3 },
      { label: "A great team and consistent, steady work.", score: 3 },
      { label: "Job security and a reliable paycheck.", score: 2 },
      { label: "I tend to move around — I haven't stayed long anywhere.", score: 0 },
    ],
  },
  {
    section: null, sectionId: "a",
    text: "We're building a team of A-players. How do you approach learning on the job?", type: "choice", category: "a",
    options: [
      { label: "I'm hungry to learn — growth is my top priority.", score: 3 },
      { label: "I'm open to feedback and always want to improve.", score: 2 },
      { label: "I like to master what I know before expanding.", score: 1 },
      { label: "I'd rather stick to what I already know.", score: 0 },
    ],
  },
  {
    section: "Section B — Sales IQ", sectionId: "b",
    text: "After completing a job, a customer mentions their dryer vent has been smelling odd. You haven't been asked about it. What do you do?", type: "choice", category: "b",
    options: [
      { label: "Naturally mention we offer dryer vent cleaning and explain why it matters.", score: 3 },
      { label: "Let them know it's something we can fix before I leave.", score: 3 },
      { label: "Wait for them to ask directly before bringing it up.", score: 1 },
      { label: "Say nothing — I'm not comfortable recommending services.", score: 0 },
    ],
  },
  {
    section: null, sectionId: "b",
    text: "LServices offers a % commission on every additional service you upsell. Does performance-based pay motivate you?", type: "choice", category: "b",
    options: [
      { label: "Yes! I love earning more based on what I personally bring in.", score: 3 },
      { label: "Definitely — it pushes me to go above and beyond.", score: 3 },
      { label: "Somewhat — I prefer a stable base but commission is a nice bonus.", score: 1 },
      { label: "Not really — I'd rather have a flat salary.", score: 0 },
    ],
  },
  {
    section: null, sectionId: "b",
    text: "How comfortable are you asking a happy customer to leave a 5-star Google review?", type: "choice", category: "b",
    options: [
      { label: "Very — if the work was great, I'll ask with confidence.", score: 3 },
      { label: "I can do it, though it takes a little getting used to.", score: 2 },
      { label: "I'd prefer the office handles that follow-up.", score: 1 },
      { label: "I'm not comfortable asking at all.", score: 0 },
    ],
  },
  {
    section: "Section D — Logistics & Standards", sectionId: "d",
    text: "Are you comfortable working in confined spaces like residential attics, and participating in safe, two-person team lifts for heavy wheeled equipment (80–100 lbs)?", type: "choice", category: "d",
    options: [
      { label: "Yes — completely comfortable with both.", score: 3 },
      { label: "Yes, though I may need some getting used to confined spaces.", score: 2 },
      { label: "I'm okay with the lifting but have concerns about confined spaces.", score: 1 },
      { label: "No — this would be a problem for me.", score: 0 },
    ],
  },
  {
    section: null, sectionId: "d",
    text: "Our day starts at 8–9 AM from Sandy Springs. Do you have reliable transportation to get there on time?", type: "choice", category: "d",
    options: [
      { label: "Yes — I have my own vehicle and it's dependable.", score: 3 },
      { label: "Yes, but my transportation isn't always reliable.", score: 1 },
      { label: "I rely on public transit or rides.", score: 0 },
      { label: "No, I don't currently have transportation.", score: 0 },
    ],
  },
  {
    section: null, sectionId: "d",
    text: "Jobs can involve driving 1+ hour between homes across Atlanta. How do you feel about that?", type: "choice", category: "d",
    options: [
      { label: "No problem — I enjoy driving and it's part of the job.", score: 3 },
      { label: "Fine by me, I accept it as part of the role.", score: 2 },
      { label: "I can manage, but prefer shorter drives.", score: 1 },
      { label: "Long drives are a dealbreaker.", score: 0 },
    ],
  },
  {
    section: null, sectionId: "d",
    text: "Occasionally jobs fall on weekends. Are you okay with that?", type: "choice", category: "d",
    options: [
      { label: "Absolutely — I'm flexible and don't mind.", score: 3 },
      { label: "Yes, occasionally with advance notice.", score: 2 },
      { label: "Rarely and only if truly necessary.", score: 1 },
      { label: "Weekends are completely off-limits.", score: 0 },
    ],
  },
  {
    section: null, sectionId: "d",
    text: "All new hires must pass a drug test and background check. Are you comfortable with that?", type: "choice", category: "d",
    options: [
      { label: "Completely — I have nothing to worry about.", score: 3 },
      { label: "Yes, I understand it's standard.", score: 3 },
      { label: "I'd want to understand the process first.", score: 1 },
      { label: "That could be a problem.", score: 0 },
    ],
  },
  {
    section: null, sectionId: "d",
    text: "LServices provides uniforms that must be worn on every job. How do you feel about that?", type: "choice", category: "d",
    options: [
      { label: "Totally fine — it's professional and I respect the standard.", score: 3 },
      { label: "No issue, it's part of representing the company.", score: 3 },
      { label: "Neutral about it.", score: 1 },
      { label: "I strongly prefer to dress however I like.", score: 0 },
    ],
  },
  {
    section: null, sectionId: "d",
    text: "You arrive at a home and something doesn't look safe — a hazard or unsafe equipment. What do you do?", type: "choice", category: "d",
    options: [
      { label: "Stop work immediately, document it, and call my supervisor.", score: 3 },
      { label: "Assess carefully and get supervisor approval before proceeding.", score: 3 },
      { label: "Try to handle it myself and mention it later.", score: 1 },
      { label: "Continue and hope for the best.", score: 0 },
    ],
  },
  {
    section: null, sectionId: "d",
    text: "If your helper is being slow and not pulling their weight, what do you do?", type: "choice", category: "d",
    options: [
      { label: "Have a calm, direct conversation and try to motivate them.", score: 3 },
      { label: "Lead by example — pick up the pace.", score: 2 },
      { label: "Report it to my supervisor.", score: 1 },
      { label: "Do my part and ignore it.", score: 0 },
    ],
  },
  {
    section: null, sectionId: "d",
    text: "A customer is frustrated because the job took longer than expected. What do you do?", type: "choice", category: "d",
    options: [
      { label: "Calmly explain, sincerely apologize, and make it right.", score: 3 },
      { label: "Listen fully, acknowledge concern, and reassure them.", score: 3 },
      { label: "Let my supervisor handle it.", score: 1 },
      { label: "Avoid the conversation.", score: 0 },
    ],
  },
  // PART 2: OPEN-ENDED
  {
    section: "Section A — Written Answers", sectionId: "a",
    text: "What are your strongest skills?",
    hint: "Technical abilities, soft skills, work habits — whatever makes you stand out.",
    type: "text",
  },
  {
    section: null, sectionId: "a",
    text: "Tell me about a mistake you made on the job. What happened and what did you do about it?",
    hint: "There's no wrong answer — we value self-awareness and accountability.",
    type: "text",
  },
  {
    section: null, sectionId: "a",
    text: "A customer leaves a 3-star review because you forgot to wipe the vent cover after finishing the job. Whose fault is it, and what do you do next?",
    hint: "Be honest — we want to understand how you think and take responsibility.",
    type: "text",
  },
  {
    section: "Section C — Live Upsell Scenario", sectionId: "c",
    text: "Read the scenario below carefully, then write how you would present these findings to the customer.",
    hint: "Write as if you're speaking directly to the customer. Be natural, not scripted.",
    type: "scenario",
  },
];

// ── TYPES ─────────────────────────────────────────────────
type PageView = "welcome" | "quiz" | "capture" | "result" | "result-rejected" | "interviewer";

interface CandidateInfo {
  fname: string; lname: string; email: string; phone: string; city: string; zip: string;
}

interface InterviewerScores {
  a: { ownership: number; ethic: number; growth: number };
  b: { value: number; ethical: number };
  c: { confidence: number; education: number; ethical: number; closing: number; emotional: number; reinforce: number };
  d: { comfort: number; timing: number };
  e: { team: number; hunger: number };
}

// ── HELPERS ───────────────────────────────────────────────
function calcSectionTotal(scores: Record<string, number>) {
  return Object.values(scores).reduce((a, b) => a + b, 0);
}

// ── MAIN COMPONENT ────────────────────────────────────────
export default function CareerFitQuiz() {
  const [page, setPage] = useState<PageView>("welcome");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | string | null)[]>(
    questions.map((q) => (q.type === "text" || q.type === "scenario" ? "" : null))
  );
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>({
    fname: "", lname: "", email: "", phone: "", city: "", zip: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoBase64, setVideoBase64] = useState("");
  const [videoError, setVideoError] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [cachedScores, setCachedScores] = useState({ totalPct: 0, aPct: 0, bPct: 0, dPct: 0, verdict: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [interviewerScores, setInterviewerScores] = useState<InterviewerScores>({
    a: { ownership: 0, ethic: 0, growth: 0 },
    b: { value: 0, ethical: 0 },
    c: { confidence: 0, education: 0, ethical: 0, closing: 0, emotional: 0, reinforce: 0 },
    d: { comfort: 0, timing: 0 },
    e: { team: 0, hunger: 0 },
  });
  const [interviewerNotes, setInterviewerNotes] = useState({ a: "", b: "", c: "", d: "", e: "" });
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Scroll to top on page change
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  // Card animation on question change
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.animation = "none";
      void cardRef.current.offsetHeight;
      cardRef.current.style.animation = "cfFadeUp .35s ease both";
    }
  }, [currentQ]);

  // Drag & drop
  useEffect(() => {
    const zone = dropZoneRef.current;
    if (!zone) return;
    const over = (e: DragEvent) => { e.preventDefault(); zone.classList.add("dragover"); };
    const leave = () => zone.classList.remove("dragover");
    const drop = (e: DragEvent) => {
      e.preventDefault(); zone.classList.remove("dragover");
      const file = e.dataTransfer?.files[0];
      if (file) handleResumeFile(file);
    };
    zone.addEventListener("dragover", over);
    zone.addEventListener("dragleave", leave);
    zone.addEventListener("drop", drop);
    return () => { zone.removeEventListener("dragover", over); zone.removeEventListener("dragleave", leave); zone.removeEventListener("drop", drop); };
  }, [page]);

  function handleResumeFile(file: File) {
    if (file.size > 5 * 1024 * 1024) { setErrors((e) => ({ ...e, resume: true })); return; }
    setErrors((e) => ({ ...e, resume: false }));
    setResumeFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setResumeBase64(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleVideoFile(file: File) {
    if (file.size > 15 * 1024 * 1024) { setVideoError("Video too large — max 15MB. Please trim or use a shorter clip."); return; }
    setVideoError("");
    setVideoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setVideoBase64(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function calcScores() {
    let a = 0, aMax = 0, b = 0, bMax = 0, d = 0, dMax = 0;
    questions.forEach((q, i) => {
      if (q.type !== "choice" || answers[i] === null) return;
      const idx = answers[i] as number;
      const s = q.options![idx].score;
      const max = Math.max(...q.options!.map((o) => o.score));
      if (q.category === "a") { a += s; aMax += max; }
      else if (q.category === "b") { b += s; bMax += max; }
      else if (q.category === "d") { d += s; dMax += max; }
    });
    const aPct = aMax ? Math.round((a / aMax) * 100) : 0;
    const bPct = bMax ? Math.round((b / bMax) * 100) : 0;
    const dPct = dMax ? Math.round((d / dMax) * 100) : 0;
    const totalPct = Math.round((aPct + bPct + dPct) / 3);
    const verdict = totalPct >= 80 ? "Excellent Fit" : totalPct >= 60 ? "Strong Potential" : totalPct >= 40 ? "Partial Fit" : "Low Fit";
    return { totalPct, aPct, bPct, dPct, verdict };
  }

  function goToCapture() {
    const scores = calcScores();
    setCachedScores(scores);
    setPage("capture");
  }

  function validateCapture() {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errs: Record<string, boolean> = {
      fname: !candidateInfo.fname.trim(),
      lname: !candidateInfo.lname.trim(),
      email: !emailRe.test(candidateInfo.email.trim()),
      phone: !candidateInfo.phone.trim(),
      resume: !resumeFile,
      video: !videoFile,
    };
    setErrors(errs);
    return !Object.values(errs).some(Boolean);
  }

  async function handleSubmit() {
    if (!validateCapture()) return;
    setSubmitState("sending");

    const quizAnswers = questions.map((q, i) => {
      if (q.type === "choice") {
        const idx = answers[i] as number | null;
        const maxScore = Math.max(...(q.options ?? []).map((o) => o.score));
        const selectedScore = idx !== null ? q.options![idx].score : 0;
        return {
          questionNumber: i + 1,
          question: q.text,
          selectedAnswer: idx !== null ? q.options![idx].label : "(not answered)",
          isCorrect: selectedScore === maxScore,
        };
      }
      return {
        questionNumber: i + 1,
        question: q.text,
        openAnswer: (answers[i] as string) || "(no answer)",
      };
    });

    const submission = {
      quizType: "career" as const,
      candidateName: `${candidateInfo.fname} ${candidateInfo.lname}`,
      candidateEmail: candidateInfo.email,
      candidatePhone: candidateInfo.phone,
      city: candidateInfo.city,
      zip: candidateInfo.zip,
      quizAnswers,
      scores: {
        raw: `${cachedScores.totalPct}%`,
        sections: {
          "Mindset & Ownership": `${cachedScores.aPct}%`,
          "Sales IQ": `${cachedScores.bPct}%`,
          "Logistics & Standards": `${cachedScores.dPct}%`,
        },
        verdict: cachedScores.verdict,
      },
      resumeBase64: resumeBase64 || undefined,
      resumeFileName: resumeFile?.name || undefined,
      videoBase64: videoBase64 || undefined,
      videoFileName: videoFile?.name || undefined,
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage as backup
    try {
      const saved = JSON.parse(localStorage.getItem("careerQuizSubmissions") || "[]");
      saved.push(submission);
      localStorage.setItem("careerQuizSubmissions", JSON.stringify(saved));
    } catch {}

    // Send to GHL webhook (existing)
    const ghlPayload = {
      firstName: candidateInfo.fname, lastName: candidateInfo.lname,
      email: candidateInfo.email, phone: candidateInfo.phone,
      city: candidateInfo.city, zip: candidateInfo.zip,
      scores: cachedScores, resumeFileName: resumeFile?.name || "",
      submittedAt: submission.submittedAt, source: "LServices Career Fit Quiz",
    };
    fetch(GHL_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ghlPayload) }).catch(() => {});

    const isGoodFit = cachedScores.totalPct >= 60;

    // Only email company for good fits
    if (isGoodFit) {
      try {
        await fetch("/api/submit-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });
      } catch {}
    }

    setSubmitState("success");
    setTimeout(() => setPage(isGoodFit ? "result" : "result-rejected"), 1200);
  }

  function updateInterviewerScore(section: keyof InterviewerScores, key: string, value: number) {
    setInterviewerScores((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  }

  const q = questions[currentQ];
  const total = questions.length;
  const progressPct = Math.round((currentQ / total) * 100);

  // ── INTERVIEWER SECTION TOTALS ────────────────────────────
  const secATot = calcSectionTotal(interviewerScores.a);
  const secBTot = calcSectionTotal(interviewerScores.b);
  const secCTot = calcSectionTotal(interviewerScores.c);
  const secDTot = calcSectionTotal(interviewerScores.d);
  const secETot = calcSectionTotal(interviewerScores.e);
  const grandTotal = secATot + secBTot + secCTot + secDTot + secETot;
  const grandVerdict = grandTotal >= 80 ? "Strong Hire" : grandTotal >= 60 ? "Consider" : "Pass";

  // ── STYLES ────────────────────────────────────────────────
  const S = {
    page: { background: "#0a2540", minHeight: "100vh", color: "#f4f8ff", fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties,
    container: { maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px", position: "relative" as const, zIndex: 1 },
    card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "36px 36px 32px", backdropFilter: "blur(12px)", position: "relative" as const, overflow: "hidden", animation: "cfFadeUp .35s ease both" } as React.CSSProperties,
    cardAccent: { position: "absolute" as const, top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#1a6bdb,#00cfff)", borderRadius: "20px 20px 0 0" },
    btn: { fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, padding: "13px 28px", borderRadius: 10, border: "none", cursor: "pointer", transition: "all .2s ease", letterSpacing: ".02em" } as React.CSSProperties,
    btnPrimary: { background: "linear-gradient(135deg,#1a6bdb,#00cfff)", color: "#0a2540", minWidth: 130 } as React.CSSProperties,
    btnBack: { background: "transparent", border: "1.5px solid rgba(255,255,255,0.12)", color: "#8a9ab5" } as React.CSSProperties,
    input: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", color: "#f4f8ff", fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: "none" } as React.CSSProperties,
    textarea: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "18px 20px", color: "#f4f8ff", fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.6, resize: "vertical" as const, minHeight: 140, outline: "none" } as React.CSSProperties,
    label: { fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "#8a9ab5", marginBottom: 6, display: "block" },
    errText: { fontSize: 12, color: "#e84393", marginTop: 4 },
    sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "#00cfff" },
    scenarioBox: { background: "rgba(255,184,0,0.06)", border: "1px solid rgba(255,184,0,0.2)", borderRadius: 14, padding: "20px 22px", marginBottom: 20 },
  };

  // ── RENDER: WELCOME ───────────────────────────────────────
  if (page === "welcome") return (
    <div style={S.page}>
      <style>{`
        @keyframes cfFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cfFadeDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
        .cf-option { display:flex; align-items:flex-start; gap:14px; background:rgba(255,255,255,.04); border:1.5px solid rgba(255,255,255,.08); border-radius:12px; padding:16px 18px; cursor:pointer; transition:all .2s ease; text-align:left; width:100%; color:#f4f8ff; }
        .cf-option:hover { border-color:rgba(0,207,255,.4); background:rgba(0,207,255,.06); transform:translateX(4px); }
        .cf-option.selected { border-color:#00cfff; background:rgba(0,207,255,.1); }
        .cf-dot { width:22px; height:22px; border-radius:50%; border:2px solid rgba(255,255,255,.2); flex-shrink:0; margin-top:1px; transition:all .2s; display:flex; align-items:center; justify-content:center; }
        .cf-option.selected .cf-dot { border-color:#00cfff; background:#00cfff; }
        .cf-option.selected .cf-dot::after { content:'✓'; font-size:12px; color:#0a2540; font-weight:700; }
        .cf-slider { -webkit-appearance:none; appearance:none; width:140px; height:6px; border-radius:99px; background:rgba(255,255,255,.1); outline:none; cursor:pointer; }
        .cf-slider::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#00cfff; cursor:pointer; box-shadow:0 0 0 3px rgba(0,207,255,.2); }
        .cf-slider::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:#00cfff; cursor:pointer; border:none; }
        .cf-drop-zone { border:2px dashed rgba(255,255,255,.15); border-radius:14px; padding:32px; text-align:center; cursor:pointer; transition:all .2s; }
        .cf-drop-zone:hover, .cf-drop-zone.dragover { border-color:#00cfff; background:rgba(0,207,255,.05); }
        .cf-progress-fill { height:100%; background:linear-gradient(90deg,#1a6bdb,#00cfff); border-radius:99px; transition:width .5s cubic-bezier(.4,0,.2,1); }
        .cf-score-bar { height:100%; border-radius:99px; transition:width .8s cubic-bezier(.4,0,.2,1); }
        .cf-rubric-table { width:100%; border-collapse:collapse; margin-bottom:16px; }
        .cf-rubric-table th { font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#8a9ab5; text-align:left; padding:8px 12px; border-bottom:1px solid rgba(255,255,255,.06); }
        .cf-rubric-table td { padding:14px 12px; border-bottom:1px solid rgba(255,255,255,.04); font-size:14px; vertical-align:top; }
        .cf-rubric-table tr:last-child td { border-bottom:none; }
        .cf-notes { width:100%; background:rgba(255,255,255,.03); border:1.5px solid rgba(255,255,255,.08); border-radius:12px; padding:14px 16px; color:#f4f8ff; font-family:'DM Sans',sans-serif; font-size:14px; line-height:1.6; resize:vertical; min-height:80px; outline:none; transition:border-color .2s; margin-top:14px; }
        .cf-notes:focus { border-color:#00cfff; }
        .cf-notes::placeholder { color:rgba(138,154,181,.4); }
        .cf-input:focus { border-color:#00cfff !important; background:rgba(0,207,255,.05) !important; }
        .cf-textarea:focus { border-color:#00cfff !important; background:rgba(0,207,255,.05) !important; }
        @media print { .no-print { display:none !important; } }
      `}</style>
      <div style={{ ...S.container, animation: "cfFadeDown .7s ease both" }}>
        {/* Back link */}
        <Link href="/" className="no-print" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(244,248,255,0.5)", fontSize: 14, marginBottom: 32, textDecoration: "none" }}>
          <ArrowLeft size={16} /> Back to Recruitment Hub
        </Link>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(0,207,255,0.2)", borderRadius: 40, padding: "8px 20px", marginBottom: 24 }}>
            <div style={{ background: "white", borderRadius: 6, padding: "3px 8px" }}>
              <img src={LOGO_URL} alt="LServices" style={{ height: 24, width: "auto", objectFit: "contain" }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: ".08em", color: "rgba(244,248,255,0.75)", textTransform: "uppercase" }}>LServices Air Duct Cleaning</span>
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(38px,7vw,64px)", letterSpacing: ".04em", lineHeight: 1, marginBottom: 14 }}>
            CAREER FIT <span style={{ color: "#00cfff" }}>QUIZ</span>
          </h1>
          <p style={{ fontSize: 16, color: "#8a9ab5", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
            A quick assessment to see if LServices is the right fit for you — and if you're the right fit for us.
          </p>
        </div>
        {/* Feature pills */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, margin: "36px 0" }}>
          {[
            { icon: "⏱️", title: "10–15 Minutes", sub: "Short, focused questions" },
            { icon: "🔒", title: "Confidential", sub: "Your answers go directly to our hiring team" },
            { icon: "💰", title: "Performance Pay", sub: "Learn how we reward top performers" },
            { icon: "🏆", title: "A-Player Culture", sub: "We build teams that win together" },
          ].map((f) => (
            <div key={f.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 16px" }}>
              <span style={{ fontSize: 24, marginBottom: 8, display: "block" }}>{f.icon}</span>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#f4f8ff", marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "#8a9ab5", lineHeight: 1.4 }}>{f.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setPage("quiz")}
            style={{ ...S.btn, ...S.btnPrimary, fontSize: 17, padding: "16px 44px" }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = "translateY(-3px)"; (e.target as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,207,255,.35)"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = ""; (e.target as HTMLElement).style.boxShadow = ""; }}
          >
            Start Quiz →
          </button>
        </div>
        {/* Interviewer link */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={() => setPage("interviewer")} style={{ background: "none", border: "none", color: "rgba(244,248,255,0.25)", fontSize: 12, cursor: "pointer", letterSpacing: ".05em" }}>
            Interviewer Panel ↗
          </button>
        </div>
      </div>
    </div>
  );

  // ── RENDER: QUIZ ──────────────────────────────────────────
  if (page === "quiz") return (
    <div style={S.page}>
      <style>{`
        @keyframes cfFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .cf-option { display:flex; align-items:flex-start; gap:14px; background:rgba(255,255,255,.04); border:1.5px solid rgba(255,255,255,.08); border-radius:12px; padding:16px 18px; cursor:pointer; transition:all .2s ease; text-align:left; width:100%; color:#f4f8ff; font-family:'DM Sans',sans-serif; }
        .cf-option:hover { border-color:rgba(0,207,255,.4); background:rgba(0,207,255,.06); transform:translateX(4px); }
        .cf-option.selected { border-color:#00cfff; background:rgba(0,207,255,.1); }
        .cf-dot { width:22px; height:22px; border-radius:50%; border:2px solid rgba(255,255,255,.2); flex-shrink:0; margin-top:1px; transition:all .2s; display:flex; align-items:center; justify-content:center; }
        .cf-option.selected .cf-dot { border-color:#00cfff; background:#00cfff; }
        .cf-option.selected .cf-dot::after { content:'✓'; font-size:12px; color:#0a2540; font-weight:700; }
        .cf-textarea:focus { border-color:#00cfff !important; background:rgba(0,207,255,.05) !important; }
        .cf-progress-fill { height:100%; background:linear-gradient(90deg,#1a6bdb,#00cfff); border-radius:99px; transition:width .5s cubic-bezier(.4,0,.2,1); }
      `}</style>
      <div className="cf-container">
        {/* Progress */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, fontSize: 13, color: "#8a9ab5" }}>
            <span>Question {currentQ + 1} of {total}</span>
            <span>{progressPct}%</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div className="cf-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Section label */}
        {q.section && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={S.sectionLabel}>{q.section}</span>
            <div style={{ flex: 1, height: 1, background: "rgba(0,207,255,0.15)" }} />
          </div>
        )}

        {/* Question card */}
        <div ref={cardRef} className="cf-card-wrap" style={{ animation: "cfFadeUp .35s ease both" }}>
          <div style={S.cardAccent} />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#00cfff", marginBottom: 12 }}>
            {String(currentQ + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.45, marginBottom: q.hint ? 12 : 28, color: "#f4f8ff" }}>
            {q.text}
          </h2>
          {q.hint && <p style={{ fontSize: 13, color: "#8a9ab5", fontStyle: "italic", marginBottom: 20 }}>{q.hint}</p>}

          {/* Choice */}
          {q.type === "choice" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {q.options!.map((opt, i) => (
                <button
                  key={i}
                  className={`cf-option${answers[currentQ] === i ? " selected" : ""}`}
                  onClick={() => {
                    const newA = [...answers];
                    newA[currentQ] = i;
                    setAnswers(newA);
                  }}
                >
                  <div className="cf-dot" />
                  <span style={{ fontSize: 15, lineHeight: 1.45, color: "rgba(244,248,255,0.85)" }}>{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Text */}
          {q.type === "text" && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#ffb800", background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.2)", borderRadius: 6, padding: "2px 8px", display: "inline-block", marginBottom: 14 }}>Written Answer</div>
              <textarea
                className="cf-textarea"
                style={S.textarea}
                placeholder="Type your answer here…"
                value={(answers[currentQ] as string) || ""}
                onChange={(e) => { const a = [...answers]; a[currentQ] = e.target.value; setAnswers(a); }}
              />
              <div style={{ textAlign: "right", fontSize: 12, color: "#8a9ab5", marginTop: 6 }}>
                {((answers[currentQ] as string) || "").length} characters
              </div>
            </>
          )}

          {/* Scenario */}
          {q.type === "scenario" && (
            <>
              <div style={S.scenarioBox}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#ffb800", marginBottom: 10 }}>🎭 Live Scenario — Read carefully</div>
                <div style={{ fontSize: 14, color: "rgba(244,248,255,0.8)", lineHeight: 1.65 }}>
                  You just completed a <strong>$599 air duct cleaning</strong>. While working, you noticed:
                  <ul style={{ marginLeft: 18, marginTop: 8 }}>
                    <li>The dryer vent is heavily clogged</li>
                    <li>Early signs of microbial growth in the attic insulation</li>
                    <li>No UV light installed in the HVAC system</li>
                  </ul>
                  <br />The customer is happy and trusts you.
                </div>
                <div style={{ fontSize: 13, color: "#ffb800", marginTop: 12, fontWeight: 500 }}>
                  🎯 In 3–5 sentences below, write exactly how you would present these findings and recommend additional services.
                </div>
              </div>
              <textarea
                className="cf-textarea"
                style={{ ...S.textarea, minHeight: 160 }}
                placeholder="Write as if speaking directly to the customer…"
                value={(answers[currentQ] as string) || ""}
                onChange={(e) => { const a = [...answers]; a[currentQ] = e.target.value; setAnswers(a); }}
              />
              <div style={{ textAlign: "right", fontSize: 12, color: "#8a9ab5", marginTop: 6 }}>
                {((answers[currentQ] as string) || "").length} characters
              </div>
            </>
          )}
        </div>

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
          <button
            style={{ ...S.btn, ...S.btnBack, visibility: currentQ === 0 ? "hidden" : "visible" }}
            onClick={() => setCurrentQ((c) => c - 1)}
          >
            ← Back
          </button>
          <button
            style={{
              ...S.btn, ...S.btnPrimary,
              opacity: (q.type === "choice" && answers[currentQ] === null) ? 0.35 : 1,
              cursor: (q.type === "choice" && answers[currentQ] === null) ? "not-allowed" : "pointer",
            }}
            disabled={q.type === "choice" && answers[currentQ] === null}
            onClick={() => {
              if (currentQ < total - 1) setCurrentQ((c) => c + 1);
              else goToCapture();
            }}
          >
            {currentQ === total - 1 ? "Submit Answers →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── RENDER: CAPTURE ───────────────────────────────────────
  if (page === "capture") return (
    <div style={S.page}>
      <style>{`
        @keyframes cfFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .cf-input:focus { border-color:#00cfff !important; background:rgba(0,207,255,.05) !important; }
        .cf-drop-zone { border:2px dashed rgba(255,255,255,.15); border-radius:14px; padding:32px; text-align:center; cursor:pointer; transition:all .2s; }
        .cf-drop-zone:hover, .cf-drop-zone.dragover { border-color:#00cfff; background:rgba(0,207,255,.05); }
      `}</style>
      <div className="cf-container" style={{ animation: "cfFadeUp .5s ease both" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: ".04em", marginBottom: 8 }}>
            Quiz <span style={{ color: "#00cfff" }}>Complete!</span>
          </h2>
          <p style={{ color: "#8a9ab5", fontSize: 15 }}>Enter your details so our team can review your application.</p>
        </div>

        <div className="cf-card-wrap">
          <div style={S.cardAccent} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 16 }}>
            {(["fname", "lname"] as const).map((field) => (
              <div key={field}>
                <label style={S.label}>{field === "fname" ? "First Name *" : "Last Name *"}</label>
                <input
                  className="cf-input"
                  style={{ ...S.input, borderColor: errors[field] ? "#e84393" : "rgba(255,255,255,0.1)" }}
                  value={candidateInfo[field]}
                  onChange={(e) => setCandidateInfo((p) => ({ ...p, [field]: e.target.value }))}
                  placeholder={field === "fname" ? "John" : "Smith"}
                />
                {errors[field] && <div style={S.errText}>Required</div>}
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Email Address *</label>
            <input
              className="cf-input"
              style={{ ...S.input, borderColor: errors.email ? "#e84393" : "rgba(255,255,255,0.1)" }}
              type="email"
              value={candidateInfo.email}
              onChange={(e) => setCandidateInfo((p) => ({ ...p, email: e.target.value }))}
              placeholder="john@email.com"
            />
            {errors.email && <div style={S.errText}>Valid email required</div>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Phone Number *</label>
            <input
              className="cf-input"
              style={{ ...S.input, borderColor: errors.phone ? "#e84393" : "rgba(255,255,255,0.1)" }}
              type="tel"
              value={candidateInfo.phone}
              onChange={(e) => setCandidateInfo((p) => ({ ...p, phone: e.target.value }))}
              placeholder="(404) 555-0100"
            />
            {errors.phone && <div style={S.errText}>Required</div>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={S.label}>City</label>
              <input className="cf-input" style={S.input} value={candidateInfo.city} onChange={(e) => setCandidateInfo((p) => ({ ...p, city: e.target.value }))} placeholder="Atlanta" />
            </div>
            <div>
              <label style={S.label}>ZIP Code</label>
              <input className="cf-input" style={S.input} value={candidateInfo.zip} onChange={(e) => setCandidateInfo((p) => ({ ...p, zip: e.target.value }))} placeholder="30301" />
            </div>
          </div>

          {/* Resume upload */}
          <div style={{ marginBottom: 24 }}>
            <label style={S.label}>Resume / CV <span style={{ color: "#e84393", fontWeight: 700 }}>* Required</span> — PDF or Word, max 5MB</label>
            <div
              ref={dropZoneRef}
              className="cf-drop-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
              <div style={{ fontSize: 14, color: "#8a9ab5" }}>
                {resumeFile ? resumeFile.name : "Drag & drop or click to upload"}
              </div>
              {resumeFile && (
                <button
                  onClick={(e) => { e.stopPropagation(); setResumeFile(null); setResumeBase64(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  style={{ marginTop: 8, background: "none", border: "none", color: "#e84393", cursor: "pointer", fontSize: 13 }}
                >
                  Remove
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleResumeFile(f); }} />
            {errors.resume && !resumeFile && <div style={S.errText}>Resume is required to submit</div>}
            {errors.resume && resumeFile && <div style={S.errText}>File too large (max 5MB)</div>}
          </div>

          {/* Video upload */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ ...S.label, display: "flex", alignItems: "center", gap: 8 }}>
              <span>🎥</span> 60-Second Intro Video <span style={{ color: "#e84393", fontWeight: 700 }}>* Required</span>
            </label>
            <p style={{ fontSize: 13, color: "#8a9ab5", marginBottom: 12, lineHeight: 1.6 }}>
              Record a short video (30–60 sec) and tell us: your name, why you want to join LServices, and one skill that makes you great. Max 15MB.
            </p>
            {videoFile ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(0,207,255,0.08)", border: "1px solid rgba(0,207,255,0.25)", borderRadius: 12, padding: "12px 16px" }}>
                <Video size={18} style={{ color: "#00cfff", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: "#f4f8ff", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{videoFile.name}</div>
                  <div style={{ fontSize: 12, color: "#8a9ab5" }}>{(videoFile.size / 1024 / 1024).toFixed(1)} MB</div>
                </div>
                <button onClick={() => { setVideoFile(null); setVideoBase64(""); if (videoInputRef.current) videoInputRef.current.value = ""; }}
                  style={{ background: "none", border: "none", color: "#e84393", cursor: "pointer", padding: 4 }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="cf-drop-zone" onClick={() => videoInputRef.current?.click()} style={{ cursor: "pointer" }}>
                <Upload size={24} style={{ color: "#8a9ab5", marginBottom: 8 }} />
                <div style={{ fontSize: 14, color: "#8a9ab5" }}>Click to upload your intro video</div>
                <div style={{ fontSize: 12, color: "#5a6a82", marginTop: 4 }}>MP4, MOV, WebM · max 15MB</div>
              </div>
            )}
            <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVideoFile(f); }} />
            {errors.video && !videoFile && <div style={S.errText}>Intro video is required to submit</div>}
            {videoError && <div style={S.errText}>{videoError}</div>}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitState === "sending"}
            style={{ ...S.btn, ...S.btnPrimary, width: "100%", fontSize: 16, padding: "16px", opacity: submitState === "sending" ? 0.7 : 1 }}
          >
            {submitState === "sending" ? "Sending…" : submitState === "success" ? "✓ Submitted!" : "Submit Application →"}
          </button>
          {submitState === "error" && (
            <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(232,67,147,0.1)", border: "1px solid rgba(232,67,147,0.3)", borderRadius: 10, fontSize: 14, color: "#e84393", textAlign: "center" }}>
              Submission failed. Please email your answers to <a href="mailto:careers@lservicesthecompany.com" style={{ color: "#00cfff" }}>careers@lservicesthecompany.com</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── RENDER: RESULT — NOT A FIT ───────────────────────────
  if (page === "result-rejected") {
    return (
      <div style={S.page}>
        <style>{`@keyframes cfFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
        <div style={{ ...S.container, animation: "cfFadeUp .5s ease both", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50%", padding: 20, marginBottom: 24 }}>
            <span style={{ fontSize: 40 }}>📋</span>
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: ".04em", marginBottom: 16, lineHeight: 1.05 }}>
            We've Received Your<br /><span style={{ color: "#00cfff" }}>Information</span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(244,248,255,0.7)", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 32px" }}>
            Thank you, <strong style={{ color: "#f4f8ff" }}>{candidateInfo.fname}</strong>! Our team will review your application.
          </p>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "24px 28px", maxWidth: 500, margin: "0 auto 32px", textAlign: "left" }}>
            {[
              { icon: "⏱", text: "It will take us 1–5 business days to make a decision." },
              { icon: "📹", text: "Our next step, if selected, is a Zoom call with our team." },
              { icon: "ℹ️", text: "If you haven't heard from us within that window, the position has been filled with another candidate." },
            ].map((item) => (
              <div key={item.icon} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                <p style={{ fontSize: 14, color: "rgba(244,248,255,0.7)", lineHeight: 1.6, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:4704397970" style={{ ...S.btn, ...S.btnPrimary, textDecoration: "none", display: "inline-block" }}>
              Call Us: (470) 439-7970
            </a>
            <Link href="/" style={{ ...S.btn, ...S.btnBack, textDecoration: "none", display: "inline-block" }}>
              Back to Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: RESULT ────────────────────────────────────────
  if (page === "result") {
    const { totalPct, aPct, bPct, dPct, verdict } = cachedScores;
    const resultIcon = totalPct >= 80 ? "🏆" : totalPct >= 60 ? "💪" : totalPct >= 40 ? "🔍" : "🤝";
    const resultColor = totalPct >= 80 ? "#00c48c" : totalPct >= 60 ? "#00cfff" : totalPct >= 40 ? "#ffb800" : "#e84393";
    return (
      <div style={S.page}>
        <style>{`@keyframes cfFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } } .cf-score-bar { height:100%; border-radius:99px; transition:width .8s cubic-bezier(.4,0,.2,1); }`}</style>
        <div style={{ ...S.container, animation: "cfFadeUp .5s ease both", textAlign: "center" }}>
          <span style={{ fontSize: 64, marginBottom: 20, display: "block" }}>{resultIcon}</span>
          <div style={{ display: "inline-block", background: "linear-gradient(135deg,#1a6bdb,#00cfff)", color: "#0a2540", fontWeight: 700, fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", padding: "6px 18px", borderRadius: 99, marginBottom: 20 }}>
            {verdict}
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, letterSpacing: ".04em", marginBottom: 16, lineHeight: 1.05 }}>
            Thanks, {candidateInfo.fname}!
          </h2>
          <p style={{ fontSize: 16, color: "rgba(244,248,255,0.7)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 32px" }}>
            Your application has been submitted to the LServices hiring team. We review every submission personally and will be in touch within 2–3 business days.
          </p>
          {/* Score bars */}
          <div style={{ margin: "28px 0", textAlign: "left", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            {[
              { label: "Mindset & Ownership", pct: aPct, color: "#00c48c" },
              { label: "Sales IQ", pct: bPct, color: "#fdcb6e" },
              { label: "Logistics & Standards", pct: dPct, color: "#1a6bdb" },
            ].map((bar) => (
              <div key={bar.label} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6, color: "rgba(244,248,255,0.6)" }}>
                  <span>{bar.label}</span><span>{bar.pct}%</span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
                  <div className="cf-score-bar" style={{ width: `${bar.pct}%`, background: bar.color }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:4704397970" style={{ ...S.btn, ...S.btnPrimary, textDecoration: "none", display: "inline-block" }}>
              Call Us: (470) 439-7970
            </a>
            <Link href="/" style={{ ...S.btn, ...S.btnBack, textDecoration: "none", display: "inline-block" }}>
              Back to Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: INTERVIEWER PANEL ─────────────────────────────
  if (page === "interviewer") {
    const verdictStyle = grandVerdict === "Strong Hire"
      ? { background: "rgba(0,196,140,.15)", border: "1px solid rgba(0,196,140,.4)", color: "#00c48c" }
      : grandVerdict === "Consider"
        ? { background: "rgba(255,184,0,.1)", border: "1px solid rgba(255,184,0,.3)", color: "#ffb800" }
        : { background: "rgba(232,67,147,.1)", border: "1px solid rgba(232,67,147,.3)", color: "#e84393" };

    const sections = [
      {
        id: "a" as const, title: "Section A — Mindset & Ownership", max: 30,
        barColor: "linear-gradient(90deg,#00b894,#00cec9)",
        rows: [
          { key: "ownership", label: "Ownership Mentality (0–10)", max: 10, desc: "Takes responsibility for outcomes — good and bad. Doesn't blame others, doesn't make excuses. Written answers should reflect self-awareness." },
          { key: "ethic", label: "Work Ethic (0–10)", max: 10, desc: "Gives full effort without being watched. Talks about going above and beyond naturally, not because they were told to." },
          { key: "growth", label: "Growth Mindset (0–10)", max: 10, desc: "Hungry to improve, open to feedback, sees challenges as opportunities. Avoid candidates who say they 'already know everything.'" },
        ],
        notesPlaceholder: "Note any red flags or standout moments. Did they seem self-aware? Did their written answers match their energy in person?",
      },
      {
        id: "b" as const, title: "Section B — Sales IQ", max: 20,
        barColor: "linear-gradient(90deg,#fdcb6e,#e17055)",
        rows: [
          { key: "value", label: "Value Explanation (0–10)", max: 10, desc: "Can explain WHY a service matters to the customer, not just what it costs. Uses benefits language, not feature dumps." },
          { key: "ethical", label: "Ethical Framing (0–10)", max: 10, desc: "Natural and helpful, not pushy or fear-based. The upsell scenario answer should feel like a recommendation from a trusted advisor." },
        ],
        notesPlaceholder: "How naturally did they frame additional services? Did they lead with value or with price?",
      },
      {
        id: "d" as const, title: "Section D — Review Close", max: 10,
        barColor: "linear-gradient(90deg,#6c5ce7,#a29bfe)",
        rows: [
          { key: "comfort", label: "Comfort & Confidence (0–5)", max: 5, desc: "Asks naturally, not awkwardly. Doesn't bury it or make it feel like a favor. Says it like it's normal and expected." },
          { key: "timing", label: "Timing & Phrasing (0–5)", max: 5, desc: "Picks the right moment, phrases it as a simple ask. Ideally mentions Google specifically, or offers to send a link." },
        ],
        notesPlaceholder: "Did they seem comfortable asking? What exact phrasing did they use?",
      },
      {
        id: "e" as const, title: "Section E — Culture Fit & Hunger", max: 10,
        barColor: "linear-gradient(90deg,#1a6bdb,#00cfff)",
        rows: [
          { key: "team", label: "Team Fit (0–5)", max: 5, desc: "Would you want this person next to you every day? Do they respect others, communicate well, bring positive energy?" },
          { key: "hunger", label: "Long-Term Hunger (0–5)", max: 5, desc: "Do they see a future here? Are they excited about learning the trade, growing income, building something? Or just passing through?" },
        ],
        notesPlaceholder: "Overall gut feeling. Would you trust this person in a customer's home? What stood out?",
      },
    ];

    const sectionTotals: Record<string, number> = { a: secATot, b: secBTot, c: secCTot, d: secDTot, e: secETot };
    const sectionMaxes: Record<string, number> = { a: 30, b: 20, c: 30, d: 10, e: 10 };

    return (
      <div style={{ background: "#071c30", minHeight: "100vh", color: "#f4f8ff", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`
          @keyframes cfFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          .cf-slider { -webkit-appearance:none; appearance:none; width:140px; height:6px; border-radius:99px; background:rgba(255,255,255,.1); outline:none; cursor:pointer; }
          .cf-slider::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#00cfff; cursor:pointer; box-shadow:0 0 0 3px rgba(0,207,255,.2); }
          .cf-slider::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:#00cfff; cursor:pointer; border:none; }
          .cf-rubric-table { width:100%; border-collapse:collapse; margin-bottom:16px; }
          .cf-rubric-table th { font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#8a9ab5; text-align:left; padding:8px 12px; border-bottom:1px solid rgba(255,255,255,.06); }
          .cf-rubric-table td { padding:14px 12px; border-bottom:1px solid rgba(255,255,255,.04); font-size:14px; vertical-align:top; }
          .cf-rubric-table tr:last-child td { border-bottom:none; }
          .cf-notes { width:100%; background:rgba(255,255,255,.03); border:1.5px solid rgba(255,255,255,.08); border-radius:12px; padding:14px 16px; color:#f4f8ff; font-family:'DM Sans',sans-serif; font-size:14px; line-height:1.6; resize:vertical; min-height:80px; outline:none; transition:border-color .2s; margin-top:14px; }
          .cf-notes:focus { border-color:#00cfff; }
          .cf-notes::placeholder { color:rgba(138,154,181,.4); }
          .cf-sc-bar { height:100%; border-radius:99px; transition:width .8s cubic-bezier(.4,0,.2,1); }
          @media print { .no-print { display:none !important; } }
        `}</style>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "40px 24px 32px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ background: "white", borderRadius: 8, padding: "6px 14px", marginBottom: 16, display: "inline-block" }}>
            <img src={LOGO_URL} alt="LServices" style={{ height: 40, width: "auto", objectFit: "contain" }} />
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: ".04em" }}>
            INTERVIEWER <span style={{ color: "#00cfff" }}>SCORING PANEL</span>
          </h2>
          <p style={{ color: "#8a9ab5", fontSize: 14, marginTop: 8 }}>For internal use only — score the live interview using the rubric below.</p>
          <button className="no-print" onClick={() => setPage("welcome")} style={{ marginTop: 16, background: "none", border: "1.5px solid rgba(255,255,255,0.12)", color: "#8a9ab5", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
            ← Back to Quiz
          </button>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>
          {/* Candidate summary placeholder */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px", marginBottom: 36 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#00cfff", marginBottom: 16 }}>Candidate Being Evaluated</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
              {["Candidate Name", "Interview Date", "Role Applied For", "Interviewer"].map((label) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: "#8a9ab5", marginBottom: 4 }}>{label}</div>
                  <input style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", color: "#f4f8ff", fontSize: 14, width: "100%", outline: "none" }} placeholder={label === "Role Applied For" ? "Lead Air Duct Technician" : ""} />
                </div>
              ))}
            </div>
          </div>

          {/* Section C — Live Upsell (special) */}
          <div style={{ marginBottom: 44 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: ".04em" }}>Section C — Live Upsell Simulation</div>
                <div style={{ fontSize: 13, color: "#8a9ab5" }}>30 points (scored live by interviewer)</div>
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#00cfff" }}>{secCTot} / 30</div>
            </div>
            <div style={{ background: "rgba(255,184,0,0.06)", border: "1px solid rgba(255,184,0,0.2)", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#ffb800", marginBottom: 10 }}>🎭 Read this scenario aloud to the candidate</div>
              <div style={{ fontSize: 14, color: "rgba(244,248,255,0.8)", lineHeight: 1.65 }}>
                "You just completed a $599 air duct cleaning. While working, you noticed:
                <ul style={{ marginLeft: 18, marginTop: 5 }}>
                  <li>The dryer vent is heavily clogged</li>
                  <li>There are early signs of microbial growth in the attic insulation</li>
                  <li>No UV light installed in the HVAC system</li>
                </ul>"
                <br />The customer is happy and trusts you.
              </div>
              <div style={{ fontSize: 13, color: "#ffb800", marginTop: 12, fontWeight: 500 }}>🎯 Ask them: "In 3–5 minutes, walk me through how you'd present these findings and recommend additional services."</div>
            </div>
            <table className="cf-rubric-table">
              <thead><tr><th>Category</th><th>What to look for</th><th style={{ width: 200 }}>Score</th></tr></thead>
              <tbody>
                {[
                  { key: "confidence", label: "Confidence (0–5)", max: 5, desc: "Clear voice, steady delivery, no excessive hesitation. Speaks with conviction without being aggressive." },
                  { key: "education", label: "Education (0–5)", max: 5, desc: "Explains WHY each finding matters to the homeowner's health, safety, or wallet. Not just 'you need this.'" },
                  { key: "ethical", label: "Ethical Framing (0–5)", max: 5, desc: "Not pushy, no scare tactics. Frames as caring professional sharing findings, gives customer choice." },
                  { key: "closing", label: "Closing Ability (0–5)", max: 5, desc: "Naturally asks for a decision. Something like 'Want me to take care of that today?' — comfortable closing." },
                ].map((row) => (
                  <tr key={row.key}>
                    <td><div style={{ color: "#f4f8ff", fontWeight: 500 }}>{row.label}</div></td>
                    <td><div style={{ color: "#8a9ab5", fontSize: 13, lineHeight: 1.5 }}>{row.desc}</div></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input type="range" className="cf-slider" min={0} max={row.max} value={interviewerScores.c[row.key as keyof typeof interviewerScores.c]}
                          onChange={(e) => updateInterviewerScore("c", row.key, +e.target.value)} />
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#00cfff", minWidth: 28, textAlign: "center" }}>
                          {interviewerScores.c[row.key as keyof typeof interviewerScores.c]}
                        </span>
                        <span style={{ fontSize: 12, color: "#8a9ab5" }}>/ {row.max}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pressure follow-up */}
            <div style={{ background: "rgba(232,67,147,0.06)", border: "1px solid rgba(232,67,147,0.2)", borderRadius: 14, padding: "20px 22px", marginTop: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#e84393", marginBottom: 10 }}>🔥 Pressure Follow-Up — Say This After Their Pitch</div>
              <div style={{ fontSize: 14, color: "rgba(244,248,255,0.8)" }}>"That's more than I wanted to spend today."</div>
              <div style={{ fontSize: 13, color: "#e84393", marginTop: 12, fontWeight: 500 }}>Now watch how they respond. Score below.</div>
            </div>
            <table className="cf-rubric-table" style={{ marginTop: 12 }}>
              <thead><tr><th>Category</th><th>What to look for</th><th style={{ width: 200 }}>Score</th></tr></thead>
              <tbody>
                {[
                  { key: "emotional", label: "Emotional Control (0–5)", max: 5, desc: "Stays calm, doesn't cave immediately or get defensive. Acknowledges the concern without panic." },
                  { key: "reinforce", label: "Value Reinforcement (0–5)", max: 5, desc: "Reminds the customer WHY it's worth it. Ties it back to safety, health, or future cost. Doesn't just repeat the price." },
                ].map((row) => (
                  <tr key={row.key}>
                    <td><div style={{ color: "#f4f8ff", fontWeight: 500 }}>{row.label}</div></td>
                    <td><div style={{ color: "#8a9ab5", fontSize: 13, lineHeight: 1.5 }}>{row.desc}</div></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input type="range" className="cf-slider" min={0} max={row.max} value={interviewerScores.c[row.key as keyof typeof interviewerScores.c]}
                          onChange={(e) => updateInterviewerScore("c", row.key, +e.target.value)} />
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#00cfff", minWidth: 28, textAlign: "center" }}>
                          {interviewerScores.c[row.key as keyof typeof interviewerScores.c]}
                        </span>
                        <span style={{ fontSize: 12, color: "#8a9ab5" }}>/ {row.max}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#8a9ab5", marginBottom: 6 }}>Section C Notes</div>
            <textarea className="cf-notes" value={interviewerNotes.c} onChange={(e) => setInterviewerNotes((n) => ({ ...n, c: e.target.value }))} placeholder="Note their delivery, specific phrases used, how they handled the objection. Did they feel natural or scripted?" />
          </div>

          {/* Other sections */}
          {sections.map((sec) => (
            <div key={sec.id} style={{ marginBottom: 44 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: ".04em" }}>{sec.title}</div>
                  <div style={{ fontSize: 13, color: "#8a9ab5" }}>{sec.max} points</div>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#00cfff" }}>{sectionTotals[sec.id]} / {sec.max}</div>
              </div>
              <table className="cf-rubric-table">
                <thead><tr><th>Category</th><th>What to look for</th><th style={{ width: 200 }}>Score</th></tr></thead>
                <tbody>
                  {sec.rows.map((row) => (
                    <tr key={row.key}>
                      <td><div style={{ color: "#f4f8ff", fontWeight: 500 }}>{row.label}</div></td>
                      <td><div style={{ color: "#8a9ab5", fontSize: 13, lineHeight: 1.5 }}>{row.desc}</div></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <input type="range" className="cf-slider" min={0} max={row.max}
                            value={(interviewerScores[sec.id] as Record<string, number>)[row.key]}
                            onChange={(e) => updateInterviewerScore(sec.id, row.key, +e.target.value)} />
                          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#00cfff", minWidth: 28, textAlign: "center" }}>
                            {(interviewerScores[sec.id] as Record<string, number>)[row.key]}
                          </span>
                          <span style={{ fontSize: 12, color: "#8a9ab5" }}>/ {row.max}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#8a9ab5", marginBottom: 6 }}>Section Notes</div>
              <textarea className="cf-notes" value={interviewerNotes[sec.id as keyof typeof interviewerNotes]} onChange={(e) => setInterviewerNotes((n) => ({ ...n, [sec.id]: e.target.value }))} placeholder={sec.notesPlaceholder} />
            </div>
          ))}

          {/* Final Scorecard */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: 32, marginTop: 40 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: ".04em", marginBottom: 24 }}>Final Scorecard</h2>
            {[
              { label: "Section A — Mindset & Ownership", val: secATot, max: 30, color: "linear-gradient(90deg,#00b894,#00cec9)" },
              { label: "Section B — Sales IQ", val: secBTot, max: 20, color: "linear-gradient(90deg,#fdcb6e,#e17055)" },
              { label: "Section C — Live Upsell Simulation", val: secCTot, max: 30, color: "linear-gradient(90deg,#fd79a8,#e84393)" },
              { label: "Section D — Review Close", val: secDTot, max: 10, color: "linear-gradient(90deg,#6c5ce7,#a29bfe)" },
              { label: "Section E — Culture & Hunger", val: secETot, max: 10, color: "linear-gradient(90deg,#1a6bdb,#00cfff)" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: 14, color: "rgba(244,248,255,0.7)" }}>{row.label}</span>
                <div style={{ flex: 1, margin: "0 16px", height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
                  <div className="cf-sc-bar" style={{ width: `${(row.val / row.max) * 100}%`, background: row.color }} />
                </div>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#00cfff" }}>{row.val} / {row.max}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: "2px solid rgba(0,207,255,0.2)" }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24 }}>Total Score</div>
                <div style={{ fontSize: 14, color: "#8a9ab5", marginTop: 4 }}>
                  {grandVerdict === "Strong Hire" ? "Recommend for hire" : grandVerdict === "Consider" ? "Conditional — review further" : "Does not meet threshold"}
                </div>
                <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 99, fontSize: 13, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginTop: 12, ...verdictStyle }}>
                  {grandVerdict}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, color: "#00cfff", lineHeight: 1 }}>{grandTotal}</div>
                <div style={{ fontSize: 13, color: "#8a9ab5" }}>out of 100</div>
              </div>
            </div>
            <button className="no-print" onClick={() => window.print()} style={{ ...S.btn, ...S.btnPrimary, width: "100%", fontSize: 15, padding: "14px 36px", marginTop: 28 }}>
              🖨️ Print / Save as PDF
            </button>
            <button className="no-print" onClick={() => { setPage("welcome"); setInterviewerScores({ a: { ownership: 0, ethic: 0, growth: 0 }, b: { value: 0, ethical: 0 }, c: { confidence: 0, education: 0, ethical: 0, closing: 0, emotional: 0, reinforce: 0 }, d: { comfort: 0, timing: 0 }, e: { team: 0, hunger: 0 } }); setInterviewerNotes({ a: "", b: "", c: "", d: "", e: "" }); }} style={{ ...S.btn, background: "transparent", border: "1.5px solid rgba(255,255,255,0.15)", color: "#8a9ab5", width: "100%", marginTop: 12 }}>
              Start New Candidate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
