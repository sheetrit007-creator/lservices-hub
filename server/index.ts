import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { sendQuizEmail } from "./mailer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lservices2026";

// In-memory submission store — persists until server restarts
const submissions: unknown[] = [];

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "50mb" }));

  app.post("/api/submit-quiz", async (req, res) => {
    try {
      // Store submission server-side (strip large base64 blobs to save memory)
      const { resumeBase64, videoBase64, ...rest } = req.body;
      submissions.unshift({
        ...rest,
        hasResume: !!resumeBase64,
        hasVideo: !!videoBase64,
        resumeFileName: req.body.resumeFileName,
        videoFileName: req.body.videoFileName,
      });

      // Fire email (non-blocking — client already moved on)
      sendQuizEmail(req.body).catch((err: unknown) => {
        console.error("[submit-quiz] email error:", err);
      });

      res.json({ ok: true });
    } catch (err) {
      console.error("[submit-quiz]", err);
      res.status(500).json({ ok: false, error: String(err) });
    }
  });

  app.get("/api/admin/submissions", (req, res) => {
    const pw = req.headers["x-admin-password"];
    if (pw !== ADMIN_PASSWORD) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
    res.json({ ok: true, submissions });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
