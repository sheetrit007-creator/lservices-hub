import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer/index.js";

export interface QuizAnswer {
  questionNumber: number;
  question: string;
  selectedAnswer: string;
  correctAnswer?: string;
  isCorrect?: boolean;
  openAnswer?: string;
}

export interface QuizSubmission {
  quizType: "tech" | "career";
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  city?: string;
  zip?: string;
  quizAnswers: QuizAnswer[];
  scores?: {
    raw?: string;
    sections?: Record<string, string | number>;
    verdict?: string;
  };
  resumeBase64?: string;
  resumeFileName?: string;
  videoBase64?: string;
  videoFileName?: string;
  submittedAt: string;
}

const BLUE = "#046BD2";
const NAVY = "#1e293b";

function buildEmailHtml(d: QuizSubmission): string {
  const quizLabel = d.quizType === "tech" ? "Technical Knowledge Quiz" : "Career Fit Quiz";

  const scoreSectionHtml = d.scores
    ? `
    <tr><td style="padding:0 32px 20px;">
      <div style="background:${NAVY};border-radius:10px;padding:20px 24px;">
        <p style="color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:0 0 8px;">Score Summary</p>
        ${d.scores.raw ? `<p style="color:#e7711b;font-size:28px;font-weight:800;margin:0 0 4px;font-family:Arial,sans-serif;">${d.scores.raw}</p>` : ""}
        ${d.scores.verdict ? `<p style="color:#94a3b8;font-size:14px;margin:0 0 8px;">${d.scores.verdict}</p>` : ""}
        ${d.scores.sections
          ? Object.entries(d.scores.sections)
              .map(([k, v]) => `<p style="color:#cbd5e1;font-size:13px;margin:3px 0;">${k}: <strong>${v}</strong></p>`)
              .join("")
          : ""}
      </div>
    </td></tr>`
    : "";

  const attachmentNote = [
    d.resumeFileName ? `📄 Resume: <strong>${d.resumeFileName}</strong>` : "",
    d.videoFileName ? `🎥 Intro Video: <strong>${d.videoFileName}</strong>` : "",
  ]
    .filter(Boolean)
    .join("<br>");

  const answersHtml = d.quizAnswers
    .map((a) => {
      const isOpen = a.openAnswer !== undefined;
      const bg = a.isCorrect === true ? "#f0fdf4" : a.isCorrect === false ? "#fef2f2" : "#f8fafc";
      const indicator = a.isCorrect === true ? "✅" : a.isCorrect === false ? "❌" : "📝";
      return `
      <tr><td style="padding:14px 16px;background:${bg};border-radius:8px;border:1px solid #e2e8f0;">
        <p style="color:#475569;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin:0 0 6px;">${indicator} Question ${a.questionNumber}</p>
        <p style="color:${NAVY};font-size:15px;font-weight:600;margin:0 0 10px;line-height:1.5;">${a.question}</p>
        ${
          isOpen
            ? `<div style="background:white;border:1px solid #cbd5e1;border-radius:6px;padding:12px 14px;">
                <p style="color:#334155;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${a.openAnswer || "(no answer provided)"}</p>
               </div>`
            : `<p style="background:white;border:1px solid #cbd5e1;border-radius:6px;padding:10px 14px;color:#334155;font-size:14px;margin:0;display:block;">
                 <span style="color:#94a3b8;font-size:12px;">Selected: </span>${a.selectedAnswer}
               </p>
               ${
                 a.correctAnswer && !a.isCorrect
                   ? `<p style="color:#15803d;font-size:13px;background:#dcfce7;border-radius:4px;padding:8px 12px;margin:6px 0 0;">
                        <span style="font-weight:700;">Correct answer: </span>${a.correctAnswer}
                      </p>`
                   : ""
               }`
        }
      </td></tr>
      <tr><td style="height:8px;"></td></tr>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F0F5FA;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F5FA;padding:32px 16px;">
  <tr><td>
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <tr><td style="background:${NAVY};padding:28px 32px;">
        <p style="color:white;font-size:22px;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:.04em;">LServices Recruitment Hub</p>
        <p style="color:rgba(255,255,255,.6);font-size:14px;margin:6px 0 0;">New Application — ${quizLabel}</p>
      </td></tr>

      <tr><td style="padding:24px 32px 0;">
        <p style="color:${BLUE};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin:0 0 12px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">Candidate Information</p>
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:7px 0;font-size:13px;color:#475569;font-weight:600;min-width:130px;">Full Name</td><td style="padding:7px 0;font-size:14px;color:${NAVY};font-weight:700;">${d.candidateName}</td></tr>
          <tr><td style="padding:7px 0;font-size:13px;color:#475569;font-weight:600;">Email</td><td style="padding:7px 0;font-size:14px;"><a href="mailto:${d.candidateEmail}" style="color:${BLUE};">${d.candidateEmail}</a></td></tr>
          <tr><td style="padding:7px 0;font-size:13px;color:#475569;font-weight:600;">Phone</td><td style="padding:7px 0;font-size:14px;color:${NAVY};"><a href="tel:${d.candidatePhone.replace(/\D/g, "")}" style="color:${NAVY};text-decoration:none;">${d.candidatePhone}</a></td></tr>
          ${d.city ? `<tr><td style="padding:7px 0;font-size:13px;color:#475569;font-weight:600;">Location</td><td style="padding:7px 0;font-size:14px;color:${NAVY};">${d.city}${d.zip ? `, ${d.zip}` : ""}</td></tr>` : ""}
          <tr><td style="padding:7px 0;font-size:13px;color:#475569;font-weight:600;">Submitted</td><td style="padding:7px 0;font-size:14px;color:${NAVY};">${new Date(d.submittedAt).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "full", timeStyle: "short" })}</td></tr>
        </table>
      </td></tr>

      ${scoreSectionHtml}

      ${
        attachmentNote
          ? `<tr><td style="padding:0 32px 0;">
               <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 18px;">
                 <p style="color:${BLUE};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin:0 0 8px;">Attached Files</p>
                 <p style="color:#1e3a5f;font-size:14px;margin:0;line-height:1.8;">${attachmentNote}</p>
               </div>
             </td></tr>`
          : ""
      }

      <tr><td style="padding:24px 32px 0;">
        <p style="color:${BLUE};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin:0 0 16px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">Quiz Answers — Full Review</p>
        <table width="100%" cellpadding="0" cellspacing="0">${answersHtml}</table>
      </td></tr>

      <tr><td style="padding:24px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;margin-top:24px;">
        <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
          Sent by LServices Recruitment Hub &nbsp;·&nbsp;
          <a href="https://lservicesthecompany.com" style="color:${BLUE};text-decoration:none;">lservicesthecompany.com</a><br>
          Reply-To is set to the candidate's email address.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

export async function sendQuizEmail(submission: QuizSubmission): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Email not configured — set GMAIL_USER and GMAIL_APP_PASSWORD in .env");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const attachments: Attachment[] = [];

  if (submission.resumeBase64 && submission.resumeFileName) {
    const content = submission.resumeBase64.includes(",")
      ? submission.resumeBase64.split(",")[1]
      : submission.resumeBase64;
    attachments.push({ filename: submission.resumeFileName, content, encoding: "base64" });
  }

  if (submission.videoBase64 && submission.videoFileName) {
    const content = submission.videoBase64.includes(",")
      ? submission.videoBase64.split(",")[1]
      : submission.videoBase64;
    attachments.push({ filename: submission.videoFileName, content, encoding: "base64" });
  }

  const quizLabel = submission.quizType === "tech" ? "Tech Quiz" : "Career Fit Quiz";

  await transporter.sendMail({
    from: `"LServices Recruitment Hub" <${user}>`,
    to: "Service@LServicesTheCompany.com",
    replyTo: submission.candidateEmail,
    subject: `[${quizLabel}] New Application — ${submission.candidateName}`,
    html: buildEmailHtml(submission),
    attachments,
  });
}
