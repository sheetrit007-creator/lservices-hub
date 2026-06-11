import { useState, useEffect } from "react";
import { Users, CheckCircle2, XCircle, Clock, Download, Trash2, Lock, Eye, EyeOff, BarChart3, Mail, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ADMIN_PASSWORD = "lservices2026";

interface Submission {
  quizType: "tech" | "career";
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  scores: {
    raw: string;
    verdict: string;
    breakdown?: Record<string, string>;
  };
  submittedAt: string;
  resumeFileName?: string;
}

function isGoodFit(sub: Submission): boolean {
  if (sub.quizType === "tech") {
    return ["Outstanding", "Strong Pass", "Conditional Pass"].includes(sub.scores.verdict);
  }
  return ["Excellent Fit", "Strong Potential"].includes(sub.scores.verdict);
}

function fitBadge(sub: Submission) {
  const fit = isGoodFit(sub);
  return fit
    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200"><CheckCircle2 className="w-3 h-3" /> Good Fit</span>
    : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200"><XCircle className="w-3 h-3" /> Not a Fit</span>;
}

function verdictColor(verdict: string) {
  if (["Outstanding", "Excellent Fit"].includes(verdict)) return "text-green-700 bg-green-50 border-green-200";
  if (["Strong Pass", "Strong Potential"].includes(verdict)) return "text-blue-700 bg-blue-50 border-blue-200";
  if (["Conditional Pass", "Partial Fit"].includes(verdict)) return "text-orange-600 bg-orange-50 border-orange-200";
  return "text-red-600 bg-red-50 border-red-200";
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState<"all" | "tech" | "career">("all");
  const [techSubs, setTechSubs] = useState<Submission[]>([]);
  const [careerSubs, setCareerSubs] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);

  useEffect(() => {
    if (!authed) return;
    setTechSubs(JSON.parse(localStorage.getItem("techQuizSubmissions") || "[]"));
    setCareerSubs(JSON.parse(localStorage.getItem("careerQuizSubmissions") || "[]"));
  }, [authed]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else { setPwError(true); }
  }

  function clearAll() {
    if (!confirm("Delete ALL submission records from this browser? This cannot be undone.")) return;
    localStorage.removeItem("techQuizSubmissions");
    localStorage.removeItem("careerQuizSubmissions");
    setTechSubs([]);
    setCareerSubs([]);
  }

  const all = [...techSubs, ...careerSubs].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  const displayed = tab === "all" ? all : tab === "tech" ? techSubs.slice().reverse() : careerSubs.slice().reverse();
  const goodFitCount = all.filter(isGoodFit).length;
  const totalCount = all.length;

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F0F5FA]">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="bg-white rounded-2xl border border-[#D1D5DB] shadow-lg p-8 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#1e293b] flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-[#1e293b] text-lg" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Admin Access</h1>
                <p className="text-xs text-[#475569]">LServices Recruitment Hub</p>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1e293b] mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={pw}
                    onChange={(e) => { setPw(e.target.value); setPwError(false); }}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm pr-10 outline-none focus:ring-2 focus:ring-[#046BD2]"
                    style={{ borderColor: pwError ? "#ef4444" : "#D1D5DB" }}
                    placeholder="Enter admin password"
                    autoFocus
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {pwError && <p className="text-red-500 text-xs mt-1">Incorrect password</p>}
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#046BD2] text-white font-bold rounded-lg text-sm hover:opacity-90 transition-opacity" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                Sign In
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F5FA]">
      <Navbar />
      <div className="pt-16">
        <div className="bg-[#1e293b] py-10">
          <div className="container flex items-center justify-between gap-4 flex-wrap">
            <div>
              <span className="text-[#e7711b] text-xs font-mono uppercase tracking-widest block mb-1">Internal</span>
              <h1 className="text-white text-3xl font-bold" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Applicant Dashboard</h1>
              <p className="text-white/50 text-sm mt-1">All quiz submissions stored in this browser</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-semibold rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Applicants", value: totalCount, icon: <Users className="w-5 h-5" />, color: "#046BD2" },
              { label: "Good Fits", value: goodFitCount, icon: <CheckCircle2 className="w-5 h-5" />, color: "#16a34a" },
              { label: "Not a Fit", value: totalCount - goodFitCount, icon: <XCircle className="w-5 h-5" />, color: "#dc2626" },
              { label: "Fit Rate", value: totalCount ? `${Math.round((goodFitCount / totalCount) * 100)}%` : "—", icon: <BarChart3 className="w-5 h-5" />, color: "#e7711b" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-[#D1D5DB] p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#475569] uppercase tracking-wide">{stat.label}</span>
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                </div>
                <div className="text-3xl font-bold" style={{ fontFamily: "Barlow Condensed, sans-serif", color: "#1e293b" }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(["all", "tech", "career"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all"
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  background: tab === t ? "#1e293b" : "white",
                  color: tab === t ? "white" : "#475569",
                  border: `1px solid ${tab === t ? "#1e293b" : "#D1D5DB"}`,
                }}
              >
                {t === "all" ? `All (${totalCount})` : t === "tech" ? `Tech Quiz (${techSubs.length})` : `Career Fit (${careerSubs.length})`}
              </button>
            ))}
          </div>

          {displayed.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#D1D5DB] p-16 text-center">
              <Clock className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
              <p className="text-[#475569] font-semibold">No submissions yet</p>
              <p className="text-[#9CA3AF] text-sm mt-1">Submissions appear here after candidates complete a quiz on this device or browser.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayed.map((sub, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[#D1D5DB] p-5 hover:border-[#046BD2] transition-colors cursor-pointer"
                  onClick={() => setSelected(selected === sub ? null : sub)}
                >
                  <div className="flex flex-wrap items-start gap-3 justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#F0F5FA] flex items-center justify-center flex-shrink-0 font-bold text-[#1e293b] text-sm" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                        {sub.candidateName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#1e293b]" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>{sub.candidateName}</div>
                        <div className="flex flex-wrap gap-3 text-xs text-[#475569] mt-0.5">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{sub.candidateEmail}</span>
                          {sub.candidatePhone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{sub.candidatePhone}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-bold rounded uppercase border" style={{ fontFamily: "Barlow Condensed, sans-serif", background: sub.quizType === "tech" ? "#eff6ff" : "#fff7ed", color: sub.quizType === "tech" ? "#1d4ed8" : "#c2410c", borderColor: sub.quizType === "tech" ? "#bfdbfe" : "#fed7aa" }}>
                        {sub.quizType === "tech" ? "Tech Quiz" : "Career Fit"}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded border ${verdictColor(sub.scores.verdict)}`}>
                        {sub.scores.raw} · {sub.scores.verdict}
                      </span>
                      {fitBadge(sub)}
                      <span className="text-xs text-[#9CA3AF]">{formatDate(sub.submittedAt)}</span>
                    </div>
                  </div>

                  {selected === sub && (
                    <div className="mt-4 pt-4 border-t border-[#E5E7EB] grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs font-bold uppercase text-[#475569] mb-2" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Score Breakdown</div>
                        {sub.scores.breakdown ? (
                          <div className="space-y-1.5">
                            {Object.entries(sub.scores.breakdown).map(([k, v]) => (
                              <div key={k} className="flex justify-between">
                                <span className="text-[#475569]">{k}</span>
                                <span className="font-semibold text-[#1e293b]">{v}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[#475569]">Score: <strong>{sub.scores.raw}</strong></div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase text-[#475569] mb-2" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>Files</div>
                        {sub.resumeFileName
                          ? <div className="flex items-center gap-2 text-[#475569]"><CheckCircle2 className="w-4 h-4 text-green-600" /> Resume: {sub.resumeFileName}</div>
                          : <div className="text-[#9CA3AF]">No resume attached</div>}
                        <div className="mt-1.5 text-xs text-[#9CA3AF]">Video and full answers sent via email to Service@LServicesTheCompany.com</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
