import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// =============================================================================
// Manus Debug Collector - Vite Plugin
// Writes browser logs directly to files, trimmed when exceeding size limit
// =============================================================================

const PROJECT_ROOT = import.meta.dirname;
const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024; // 1MB per log file
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6); // Trim to 60% to avoid constant re-trimming

type LogSource = "browserConsole" | "networkRequests" | "sessionReplay";

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function trimLogFile(logPath: string, maxSize: number) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }

    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines: string[] = [];
    let keptBytes = 0;

    // Keep newest lines (from end) that fit within 60% of maxSize
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}\n`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }

    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
    /* ignore trim errors */
  }
}

function writeToLogFile(source: LogSource, entries: unknown[]) {
  if (entries.length === 0) return;

  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);

  // Format entries with timestamps
  const lines = entries.map((entry) => {
    const ts = new Date().toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });

  // Append to log file
  fs.appendFileSync(logPath, `${lines.join("\n")}\n`, "utf-8");

  // Trim if exceeds max size
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}

/**
 * Vite plugin to collect browser debug logs
 * - POST /__manus__/logs: Browser sends logs, written directly to files
 * - Files: browserConsole.log, networkRequests.log, sessionReplay.log
 * - Auto-trimmed when exceeding 1MB (keeps newest entries)
 */
function vitePluginManusDebugCollector(): Plugin {
  return {
    name: "manus-debug-collector",

    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true,
            },
            injectTo: "head",
          },
        ],
      };
    },

    configureServer(server: ViteDevServer) {
      // POST /__manus__/logs: Browser sends logs (written directly to files)
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }

        const handlePayload = (payload: any) => {
          // Write logs directly to files
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };

        const reqBody = (req as { body?: unknown }).body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    },
  };
}

function vitePluginStorageProxy(): Plugin {
  return {
    name: "manus-storage-proxy",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/manus-storage", async (req, res) => {
        const key = req.url?.replace(/^\//, "");
        if (!key) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Missing storage key");
          return;
        }

        const forgeBaseUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
        const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;

        if (!forgeBaseUrl || !forgeKey) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Storage proxy not configured");
          return;
        }

        try {
          const forgeUrl = new URL("v1/storage/presign/get", forgeBaseUrl + "/");
          forgeUrl.searchParams.set("path", key);

          const forgeResp = await fetch(forgeUrl, {
            headers: { Authorization: `Bearer ${forgeKey}` },
          });

          if (!forgeResp.ok) {
            res.writeHead(502, { "Content-Type": "text/plain" });
            res.end("Storage backend error");
            return;
          }

          const { url } = (await forgeResp.json()) as { url: string };
          if (!url) {
            res.writeHead(502, { "Content-Type": "text/plain" });
            res.end("Empty signed URL");
            return;
          }

          res.writeHead(307, { Location: url, "Cache-Control": "no-store" });
          res.end();
        } catch {
          res.writeHead(502, { "Content-Type": "text/plain" });
          res.end("Storage proxy error");
        }
      });
    },
  };
}

function vitePluginQuizEmailApi(): Plugin {
  let gmailUser = "";
  let gmailPass = "";

  return {
    name: "quiz-email-api",
    // loadEnv runs before configureServer — captures .env credentials into closure vars
    config(_, { mode }) {
      const env = loadEnv(mode, process.cwd(), "");
      gmailUser = env.GMAIL_USER || "";
      gmailPass = env.GMAIL_APP_PASSWORD || "";
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/api/submit-quiz", async (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false }));
          return;
        }
        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", async () => {
          try {
            const data = JSON.parse(body);
            if (!gmailUser || !gmailPass) {
              throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD not set in .env — see .env.example for setup instructions");
            }

            // Import nodemailer as a real Node.js package (no .ts path issues)
            const nodemailer = (await import("nodemailer")).default;
            const transport = nodemailer.createTransport({
              service: "gmail",
              auth: { user: gmailUser, pass: gmailPass },
            });

            const quizLabel = data.quizType === "tech" ? "Tech Quiz" : "Career Fit Quiz";

            const attachments: { filename: string; content: string; encoding: string }[] = [];
            if (data.resumeBase64 && data.resumeFileName) {
              attachments.push({ filename: data.resumeFileName, content: data.resumeBase64.includes(",") ? data.resumeBase64.split(",")[1] : data.resumeBase64, encoding: "base64" });
            }
            if (data.videoBase64 && data.videoFileName) {
              attachments.push({ filename: data.videoFileName, content: data.videoBase64.includes(",") ? data.videoBase64.split(",")[1] : data.videoBase64, encoding: "base64" });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const answersHtml = (data.quizAnswers || []).map((a: any) => {
              const isOpen = !!a.openAnswer;
              const bg = a.isCorrect === true ? "#f0fdf4" : a.isCorrect === false ? "#fef2f2" : "#f8fafc";
              const icon = a.isCorrect === true ? "✅" : a.isCorrect === false ? "❌" : "📝";
              return `<div style="margin-bottom:8px;padding:12px 14px;background:${bg};border-radius:6px;border:1px solid #e2e8f0;">
                <p style="color:#475569;font-size:11px;font-weight:700;text-transform:uppercase;margin:0 0 4px;">${icon} Q${a.questionNumber}</p>
                <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0 0 8px;">${a.question}</p>
                ${isOpen
                  ? `<div style="background:white;border:1px solid #cbd5e1;border-radius:4px;padding:10px;"><p style="color:#334155;font-size:13px;white-space:pre-wrap;margin:0;">${a.openAnswer || "(no answer)"}</p></div>`
                  : `<p style="color:#334155;font-size:13px;margin:0;"><strong>Selected:</strong> ${a.selectedAnswer}</p>${a.correctAnswer && !a.isCorrect ? `<p style="color:#15803d;font-size:12px;margin:4px 0 0;"><strong>Correct:</strong> ${a.correctAnswer}</p>` : ""}`
                }
              </div>`;
            }).join("");

            const scoresHtml = data.scores ? `<div style="margin-top:16px;background:#1e293b;border-radius:8px;padding:14px 18px;">
              <p style="color:#94a3b8;font-size:11px;font-weight:700;text-transform:uppercase;margin:0 0 6px;">Score</p>
              ${data.scores.raw ? `<p style="color:#e7711b;font-size:22px;font-weight:800;margin:0 0 2px;">${data.scores.raw}</p>` : ""}
              ${data.scores.verdict ? `<p style="color:#94a3b8;font-size:13px;margin:0;">${data.scores.verdict}</p>` : ""}
              ${data.scores.sections ? Object.entries(data.scores.sections).map(([k, v]) => `<p style="color:#cbd5e1;font-size:12px;margin:3px 0;">${k}: <strong>${v}</strong></p>`).join("") : ""}
            </div>` : "";

            const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#F0F5FA;padding:24px;">
              <div style="max-width:640px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                <div style="background:#1e293b;padding:24px 28px;">
                  <h1 style="color:white;margin:0;font-size:20px;font-weight:800;text-transform:uppercase;">LServices Recruitment Hub</h1>
                  <p style="color:rgba(255,255,255,.6);margin:4px 0 0;font-size:13px;">New Application — ${quizLabel}</p>
                </div>
                <div style="padding:24px 28px;">
                  <h2 style="color:#046BD2;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 10px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">Candidate</h2>
                  <p style="margin:4px 0;font-size:14px;"><strong>Name:</strong> ${data.candidateName}</p>
                  <p style="margin:4px 0;font-size:14px;"><strong>Email:</strong> <a href="mailto:${data.candidateEmail}" style="color:#046BD2;">${data.candidateEmail}</a></p>
                  <p style="margin:4px 0;font-size:14px;"><strong>Phone:</strong> ${data.candidatePhone}</p>
                  ${data.city ? `<p style="margin:4px 0;font-size:14px;"><strong>Location:</strong> ${data.city}${data.zip ? ", " + data.zip : ""}</p>` : ""}
                  ${scoresHtml}
                  ${attachments.length ? `<div style="margin-top:14px;padding:10px 14px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;">
                    <p style="color:#046BD2;font-size:11px;font-weight:700;text-transform:uppercase;margin:0 0 6px;">Attached Files</p>
                    ${data.resumeFileName ? `<p style="margin:2px 0;font-size:13px;">📄 ${data.resumeFileName}</p>` : ""}
                    ${data.videoFileName ? `<p style="margin:2px 0;font-size:13px;">🎥 ${data.videoFileName}</p>` : ""}
                  </div>` : ""}
                  <h2 style="color:#046BD2;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:20px 0 10px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">All Answers</h2>
                  ${answersHtml}
                </div>
                <div style="padding:14px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
                  <p style="color:#94a3b8;font-size:12px;margin:0;">LServices Recruitment Hub · <a href="https://lservicesthecompany.com" style="color:#046BD2;text-decoration:none;">lservicesthecompany.com</a> · Reply-To set to candidate email</p>
                </div>
              </div>
            </body></html>`;

            await transport.sendMail({
              from: `"LServices Hiring" <${gmailUser}>`,
              to: "Service@LServicesTheCompany.com",
              replyTo: data.candidateEmail,
              subject: `[${quizLabel}] ${data.candidateName} — ${data.scores?.verdict || "New Application"}`,
              html,
              attachments,
            });

            console.log(`[quiz-api] ✅ Email sent — ${data.candidateName} (${quizLabel})`);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true }));
          } catch (err) {
            console.error("[quiz-api] ❌ Error:", String(err));
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: String(err) }));
          }
        });
      });
    },
  };
}

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector(), vitePluginStorageProxy(), vitePluginQuizEmailApi()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
