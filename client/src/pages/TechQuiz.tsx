/*
 * TechQuiz — Interactive 5-question technician screening quiz
 * Brand: lservicesthecompany.com — #046BD2 blue, #e7711b orange, #1e293b navy
 */
import { useState, useRef } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, RotateCcw,
  Award, Wrench, Video, Upload, X, FileText,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const questions = [
  {
    id: 1,
    question: "What is the primary purpose of establishing 'negative pressure' during the air duct cleaning process?",
    options: [
      "To increase airflow through the HVAC system for better cleaning",
      "To ensure contaminants are pulled into the vacuum and do not escape into the living space",
      "To reduce the noise level of the vacuum equipment",
      "To test the integrity of the ductwork for leaks",
    ],
    correct: 1,
    explanation: "Negative pressure creates a controlled vacuum environment that pulls dust, debris, and contaminants directly into the HEPA vacuum system, preventing them from escaping into the customer's home during the cleaning process.",
  },
  {
    id: 2,
    question: "According to industry standards, what is the key difference between cleaning ductwork only vs. cleaning the full HVAC system?",
    options: [
      "There is no difference — duct cleaning and HVAC system cleaning are the same thing",
      "Duct cleaning only covers supply and return channels; full system cleaning also includes coils, blower motor, and drain pan",
      "Full system cleaning only refers to replacing the air filter",
      "Duct cleaning is more comprehensive than full system cleaning",
    ],
    correct: 1,
    explanation: "Duct cleaning addresses only the supply and return air channels. A full HVAC system cleaning must also include the air handler, evaporator coils, blower motor, and drain pan to truly improve indoor air quality and system efficiency.",
  },
  {
    id: 3,
    question: "You arrive at a job and notice visible mold growth on the fiberglass insulation inside the air handler. What is the correct course of action?",
    options: [
      "Vacuum out the mold with the HEPA vacuum and continue the job as normal",
      "Spray an antimicrobial agent on the insulation and proceed",
      "Stop work, inform the customer that porous fiberglass cannot be cleaned of mold and must be replaced",
      "Clean around the mold and document it in the job notes",
    ],
    correct: 2,
    explanation: "Porous materials like fiberglass insulation cannot be effectively cleaned of mold growth. The correct protocol is to stop work, clearly communicate the issue to the customer, and explain that the contaminated material must be replaced — not simply cleaned.",
  },
  {
    id: 4,
    question: "What is the function of an air whip or rotary brush in the duct cleaning process?",
    options: [
      "To seal any gaps or leaks found in the ductwork",
      "To measure the airflow velocity inside the ducts",
      "To agitate and dislodge dust and debris stuck to the interior walls of the ductwork",
      "To apply antimicrobial coating to the duct surfaces",
    ],
    correct: 2,
    explanation: "Air whips and rotary brushes are agitation tools. They physically dislodge dust, debris, and buildup that has adhered to the interior walls of the ductwork, allowing the negative pressure vacuum system to then capture and remove the loosened contaminants.",
  },
  {
    id: 5,
    question: "What does HEPA stand for, and why is it critical in the vacuum equipment used for duct cleaning?",
    options: [
      "High-Energy Pressure Apparatus — it generates the suction needed for cleaning",
      "Heated Exhaust Purification Array — it sanitizes the air before releasing it",
      "High-Efficiency Particulate Air — it traps 99.97% of particles ≥0.3 microns, preventing re-contamination",
      "Hydraulic Extraction and Purge Assembly — it removes moisture from the ducts",
    ],
    correct: 2,
    explanation: "HEPA stands for High-Efficiency Particulate Air. HEPA filters are critical because they capture 99.97% of airborne particles as small as 0.3 microns — including fine dust, allergens, mold spores, and bacteria — ensuring that the exhaust from the vacuum does not re-contaminate the customer's home.",
  },
];

type View = "quiz" | "result" | "capture" | "submitted";

const VIDEO_MAX_MB = 15;
const RESUME_MAX_MB = 5;

export default function TechQuiz() {
  const [view, setView] = useState<View>("quiz");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [answered, setAnswered] = useState(false);
  const [goodFit, setGoodFit] = useState(true);

  // Capture step
  const [info, setInfo] = useState({ fname: "", lname: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoBase64, setVideoBase64] = useState("");
  const [videoError, setVideoError] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [sendState, setSendState] = useState<"idle" | "sending" | "done">("idle");

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const q = questions[current];
  const score = answers.filter((a, i) => a === questions[i].correct).length;

  const getScoreLabel = () => {
    if (score === 5) return { label: "Outstanding", color: "text-green-600", bg: "bg-green-50 border-green-200" };
    if (score >= 4) return { label: "Strong Pass", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" };
    if (score >= 3) return { label: "Conditional Pass", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" };
    return { label: "Needs Development", color: "text-red-600", bg: "bg-red-50 border-red-200" };
  };

  function handleResumeFile(file: File) {
    if (file.size > RESUME_MAX_MB * 1024 * 1024) { setResumeError(`File too large — max ${RESUME_MAX_MB}MB.`); return; }
    setResumeError("");
    setResumeFile(file);
    const r = new FileReader(); r.onload = (e) => setResumeBase64(e.target?.result as string); r.readAsDataURL(file);
  }

  function handleVideoFile(file: File) {
    if (file.size > VIDEO_MAX_MB * 1024 * 1024) { setVideoError(`Video too large — max ${VIDEO_MAX_MB}MB.`); return; }
    setVideoError("");
    setVideoFile(file);
    const r = new FileReader(); r.onload = (e) => setVideoBase64(e.target?.result as string); r.readAsDataURL(file);
  }

  function validateCapture() {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const e: Record<string, boolean> = {
      fname: !info.fname.trim(),
      lname: !info.lname.trim(),
      email: !emailRe.test(info.email.trim()),
      phone: !info.phone.trim(),
      resume: !resumeFile,
      video: !videoFile,
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  }

  async function handleFinalSubmit() {
    if (!validateCapture()) return;
    setSendState("sending");

    const isGoodFit = score >= 3;
    setGoodFit(isGoodFit);

    const quizAnswers = questions.map((q, i) => ({
      questionNumber: i + 1,
      question: q.question,
      selectedAnswer: answers[i] !== null ? q.options[answers[i] as number] : "(not answered)",
      correctAnswer: q.options[q.correct],
      isCorrect: answers[i] === q.correct,
    }));

    const submission = {
      quizType: "tech" as const,
      candidateName: `${info.fname} ${info.lname}`,
      candidateEmail: info.email,
      candidatePhone: info.phone,
      quizAnswers,
      scores: { raw: `${score}/5`, verdict: getScoreLabel().label },
      resumeBase64: resumeBase64 || undefined,
      resumeFileName: resumeFile?.name || undefined,
      videoBase64: videoBase64 || undefined,
      videoFileName: videoFile?.name || undefined,
      submittedAt: new Date().toISOString(),
    };

    try {
      const saved = JSON.parse(localStorage.getItem("techQuizSubmissions") || "[]");
      saved.push(submission);
      localStorage.setItem("techQuizSubmissions", JSON.stringify(saved));
    } catch {}

    if (isGoodFit) {
      try {
        await fetch("/api/submit-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });
      } catch {}
    }

    setSendState("done");
    setView("submitted");
  }

  const handleReset = () => {
    setCurrent(0); setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setAnswered(false); setView("quiz");
    setInfo({ fname: "", lname: "", email: "", phone: "" });
    setResumeFile(null); setResumeBase64(""); setVideoFile(null); setVideoBase64("");
    setSendState("idle"); setErrors({});
  };

  // ── SUBMITTED ──────────────────────────────────────────────
  if (view === "submitted") {
    return (
      <div className="min-h-screen" style={{ background: "#F0F5FA" }}>
        <Navbar />
        <div className="pt-16">
          <div className="container py-16 max-w-xl">
            <div className="bg-white rounded-2xl border border-[#D1D5DB] p-10 text-center">
              {goodFit ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1e293b] mb-3 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                    Application Submitted!
                  </h2>
                  <p className="text-[#475569] mb-6 leading-relaxed">
                    Thanks, <strong>{info.fname}</strong>! Your quiz results, resume, and intro video have been sent to our hiring team. We'll be in touch within 2–3 business days to schedule a Zoom call.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5">
                    <Award className="w-8 h-8 text-[#046BD2]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1e293b] mb-3 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                    We've Received Your Information
                  </h2>
                  <p className="text-[#475569] mb-3 leading-relaxed">
                    Thank you, <strong>{info.fname}</strong>! Our team will review your application.
                  </p>
                  <div className="bg-[#F0F5FA] rounded-xl p-5 text-left mb-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-[#046BD2] font-bold text-sm mt-0.5">⏱</span>
                      <p className="text-sm text-[#334155]">It will take us <strong>1–5 business days</strong> to make a decision.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[#046BD2] font-bold text-sm mt-0.5">📹</span>
                      <p className="text-sm text-[#334155]">Our next step, if selected, is a <strong>Zoom call</strong> with our hiring team.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[#94a3b8] font-bold text-sm mt-0.5">ℹ</span>
                      <p className="text-sm text-[#475569]">If you haven't heard from us within that timeframe, the position has been filled with another candidate. We appreciate your interest!</p>
                    </div>
                  </div>
                </>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:4704397970"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-white font-bold rounded text-sm uppercase tracking-wide"
                  style={{ background: "#e7711b", fontFamily: "Barlow Condensed, sans-serif" }}>
                  Call Us: (470) 439-7970
                </a>
                <Link href="/" className="inline-flex items-center justify-center px-5 py-2.5 border font-medium rounded text-sm" style={{ borderColor: "#D1D5DB", color: "#475569" }}>
                  Back to Hub
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── CAPTURE FORM ───────────────────────────────────────────
  if (view === "capture") {
    const inputCls = "w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:border-[#046BD2] transition-colors bg-white";
    const labelCls = "block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5";
    const errCls = "text-red-500 text-xs mt-1";

    return (
      <div className="min-h-screen" style={{ background: "#F0F5FA" }}>
        <Navbar />
        <div className="pt-16">
          <div className="py-10 bg-[#1e293b]">
            <div className="container max-w-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-[#e7711b]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#e7711b]" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                  Submit Your Application
                </span>
              </div>
              <h1 className="text-white text-3xl font-bold uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                Almost There
              </h1>
              <p className="text-white/60 text-sm mt-1">
                Your score: <strong className="text-[#e7711b]">{score}/{questions.length}</strong> · {getScoreLabel().label}
              </p>
            </div>
          </div>

          <div className="container max-w-2xl py-8 space-y-4">

            {/* Contact info */}
            <div className="bg-white rounded-xl border border-[#D1D5DB] p-6">
              <h3 className="font-bold text-[#1e293b] mb-5 uppercase tracking-wide text-sm" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                Your Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {(["fname", "lname"] as const).map((f) => (
                  <div key={f}>
                    <label className={labelCls}>{f === "fname" ? "First Name *" : "Last Name *"}</label>
                    <input className={inputCls} style={{ borderColor: errors[f] ? "#ef4444" : "#D1D5DB" }}
                      placeholder={f === "fname" ? "John" : "Smith"} value={info[f]}
                      onChange={(e) => setInfo((p) => ({ ...p, [f]: e.target.value }))} />
                    {errors[f] && <p className={errCls}>Required</p>}
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className={labelCls}>Email Address *</label>
                <input type="email" className={inputCls} style={{ borderColor: errors.email ? "#ef4444" : "#D1D5DB" }}
                  placeholder="john@email.com" value={info.email}
                  onChange={(e) => setInfo((p) => ({ ...p, email: e.target.value }))} />
                {errors.email && <p className={errCls}>Valid email required</p>}
              </div>
              <div>
                <label className={labelCls}>Phone Number *</label>
                <input type="tel" className={inputCls} style={{ borderColor: errors.phone ? "#ef4444" : "#D1D5DB" }}
                  placeholder="(404) 555-0100" value={info.phone}
                  onChange={(e) => setInfo((p) => ({ ...p, phone: e.target.value }))} />
                {errors.phone && <p className={errCls}>Required</p>}
              </div>
            </div>

            {/* Resume upload — REQUIRED */}
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: errors.resume ? "#ef4444" : "#D1D5DB" }}>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-[#046BD2]" />
                <h3 className="font-bold text-[#1e293b] uppercase tracking-wide text-sm" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                  Resume / CV
                </h3>
                <span className="text-xs font-bold text-[#e7711b] ml-auto uppercase tracking-wide">Required</span>
              </div>
              <p className="text-sm text-[#475569] mb-4">PDF or Word document · max {RESUME_MAX_MB}MB</p>
              {resumeFile ? (
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileText className="w-5 h-5 text-[#046BD2] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1e293b] truncate">{resumeFile.name}</p>
                    <p className="text-xs text-[#94a3b8]">{(resumeFile.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <button onClick={() => { setResumeFile(null); setResumeBase64(""); if (resumeInputRef.current) resumeInputRef.current.value = ""; }}
                    className="text-[#94a3b8] hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => resumeInputRef.current?.click()}
                  className="w-full flex flex-col items-center gap-2 py-7 border-2 border-dashed rounded-xl transition-all hover:border-[#046BD2] hover:bg-blue-50"
                  style={{ borderColor: errors.resume ? "#ef4444" : "#D1D5DB" }}>
                  <Upload className="w-6 h-6 text-[#94a3b8]" />
                  <span className="text-sm font-medium text-[#475569]">Click to upload your resume</span>
                  <span className="text-xs text-[#94a3b8]">PDF, DOC, DOCX</span>
                </button>
              )}
              <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleResumeFile(f); }} />
              {errors.resume && !resumeFile && <p className={errCls}>Resume is required to submit</p>}
              {resumeError && <p className={errCls}>{resumeError}</p>}
            </div>

            {/* Video upload — REQUIRED */}
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: errors.video ? "#ef4444" : "#D1D5DB" }}>
              <div className="flex items-center gap-3 mb-2">
                <Video className="w-5 h-5 text-[#046BD2]" />
                <h3 className="font-bold text-[#1e293b] uppercase tracking-wide text-sm" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                  60-Second Intro Video
                </h3>
                <span className="text-xs font-bold text-[#e7711b] ml-auto uppercase tracking-wide">Required</span>
              </div>
              <p className="text-sm text-[#475569] mb-4 leading-relaxed">
                Record 30–60 seconds on your phone or webcam. Tell us: <strong>(1)</strong> your name, <strong>(2)</strong> why you want to join LServices, and <strong>(3)</strong> one skill that makes you a great technician. Max {VIDEO_MAX_MB}MB.
              </p>
              {videoFile ? (
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Video className="w-5 h-5 text-[#046BD2] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1e293b] truncate">{videoFile.name}</p>
                    <p className="text-xs text-[#94a3b8]">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <button onClick={() => { setVideoFile(null); setVideoBase64(""); if (videoInputRef.current) videoInputRef.current.value = ""; }}
                    className="text-[#94a3b8] hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => videoInputRef.current?.click()}
                  className="w-full flex flex-col items-center gap-2 py-7 border-2 border-dashed rounded-xl transition-all hover:border-[#046BD2] hover:bg-blue-50"
                  style={{ borderColor: errors.video ? "#ef4444" : "#D1D5DB" }}>
                  <Upload className="w-6 h-6 text-[#94a3b8]" />
                  <span className="text-sm font-medium text-[#475569]">Click to upload your intro video</span>
                  <span className="text-xs text-[#94a3b8]">MP4, MOV, WebM · max {VIDEO_MAX_MB}MB</span>
                </button>
              )}
              <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVideoFile(f); }} />
              {errors.video && !videoFile && <p className={errCls}>Intro video is required to submit</p>}
              {videoError && <p className={errCls}>{videoError}</p>}
            </div>

            <button onClick={handleFinalSubmit} disabled={sendState === "sending"}
              className="w-full py-4 text-white font-bold rounded-xl text-sm uppercase tracking-wide transition-all disabled:opacity-60"
              style={{ background: "#e7711b", fontFamily: "Barlow Condensed, sans-serif", fontSize: "1rem" }}>
              {sendState === "sending" ? "Submitting…" : "Submit My Application →"}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── RESULT SCREEN ──────────────────────────────────────────
  if (view === "result") {
    const { label, color, bg } = getScoreLabel();
    return (
      <div className="min-h-screen" style={{ background: "#F0F5FA" }}>
        <Navbar />
        <div className="pt-16">
          <div className="container py-12 max-w-2xl">
            <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#D1D5DB" }}>
              <div className="px-8 py-10 text-center" style={{ background: "#1e293b" }}>
                <Award className="w-12 h-12 mx-auto mb-4" style={{ color: "#e7711b" }} />
                <h2 className="text-white text-2xl font-bold mb-2 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Quiz Complete</h2>
                <div className="text-6xl font-bold my-4" style={{ fontFamily: "Barlow Condensed, sans-serif", color: "#e7711b" }}>
                  {score}/{questions.length}
                </div>
                <div className={`inline-block px-4 py-1.5 rounded-full border text-sm font-semibold ${bg} ${color}`}>
                  {label}
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-bold mb-4 uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif", color: "#1e293b", fontSize: "1.1rem" }}>Answer Review</h3>
                <div className="space-y-3 mb-8">
                  {questions.map((q, i) => {
                    const isCorrect = answers[i] === q.correct;
                    return (
                      <div key={q.id} className={`flex items-start gap-3 p-3 rounded-lg border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                        {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                        <div>
                          <p className="text-sm font-medium text-[#1e293b]">Q{i + 1}: {q.question}</p>
                          {!isCorrect && <p className="text-xs mt-1 text-[#475569]"><span className="font-semibold text-green-700">Correct: </span>{q.options[q.correct]}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3">
                  <button onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-4 border text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#D1D5DB", color: "#475569" }}>
                    <RotateCcw className="w-4 h-4" /> Retake
                  </button>
                  <button onClick={() => setView("capture")}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-white font-bold rounded text-sm uppercase tracking-wide"
                    style={{ background: "#e7711b", fontFamily: "Barlow Condensed, sans-serif" }}>
                    Continue to Application <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── QUIZ ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#F0F5FA" }}>
      <Navbar />
      <div className="pt-16">
        <div className="py-10" style={{ background: "#1e293b" }}>
          <div className="container max-w-2xl">
            <Link href="/jobs/technician" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Job Description
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "#e7711b" }}>
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#e7711b]" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Technician Screening</span>
            </div>
            <h1 className="text-white text-3xl font-bold uppercase" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Technical Knowledge Quiz</h1>
            <p className="text-white/60 text-sm mt-1">5 questions · HVAC & Air Duct Cleaning Fundamentals</p>
          </div>
        </div>

        <div className="container max-w-2xl py-8">
          <div className="flex items-center gap-3 mb-6">
            {questions.map((_, i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
                style={{ background: i < current ? "#046BD2" : i === current ? "#e7711b" : "#D1D5DB" }} />
            ))}
          </div>
          <div className="text-xs font-semibold mb-6 text-[#475569]">Question {current + 1} of {questions.length}</div>

          <div className="bg-white rounded-xl border border-[#D1D5DB] p-6 mb-4">
            <div className="step-badge mb-4">Q{current + 1}</div>
            <h2 className="text-lg font-semibold mb-6 leading-snug text-[#1e293b]">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let borderColor = "#D1D5DB", bgColor = "#F9FAFB", textColor = "#334155";
                if (answered) {
                  if (i === q.correct) { borderColor = "#4ade80"; bgColor = "#f0fdf4"; textColor = "#166534"; }
                  else if (i === selected && i !== q.correct) { borderColor = "#f87171"; bgColor = "#fef2f2"; textColor = "#991b1b"; }
                } else if (selected === i) { borderColor = "#046BD2"; bgColor = "#EFF6FF"; textColor = "#1e293b"; }
                return (
                  <button key={i} onClick={() => { if (!answered) setSelected(i); }} disabled={answered}
                    className="w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150"
                    style={{ borderColor, background: bgColor, color: textColor }}>
                    <span className="text-xs mr-2 font-bold opacity-50">{String.fromCharCode(65 + i)}.</span>{opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div className="mt-4 p-4 rounded-lg border"
                style={{ background: selected === q.correct ? "#f0fdf4" : "#fffbeb", borderColor: selected === q.correct ? "#bbf7d0" : "#fde68a" }}>
                <div className="flex items-center gap-2 mb-1">
                  {selected === q.correct ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-amber-600" />}
                  <span className="text-sm font-semibold" style={{ color: selected === q.correct ? "#15803d" : "#b45309" }}>
                    {selected === q.correct ? "Correct!" : "Not quite."}
                  </span>
                </div>
                <p className="text-sm text-[#334155]">{q.explanation}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {!answered ? (
              <button onClick={() => { if (selected === null) return; const a = [...answers]; a[current] = selected; setAnswers(a); setAnswered(true); }}
                disabled={selected === null}
                className="flex-1 py-3 text-white font-bold rounded text-sm uppercase tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#046BD2", fontFamily: "Barlow Condensed, sans-serif" }}>
                Submit Answer
              </button>
            ) : (
              <button onClick={() => {
                if (current < questions.length - 1) {
                  setCurrent(current + 1); setSelected(answers[current + 1]); setAnswered(answers[current + 1] !== null);
                } else { setView("result"); }
              }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 text-white font-bold rounded text-sm uppercase tracking-wide"
                style={{ background: "#e7711b", fontFamily: "Barlow Condensed, sans-serif" }}>
                {current < questions.length - 1 ? "Next Question" : "See Results"}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
