/*
 * NotFound — 404 page
 * Brand: lservicesthecompany.com — #046BD2 blue, #e7711b orange, #1e293b navy
 */
import { Link } from "wouter";
import { Home, AlertCircle } from "lucide-react";

const LOGO_URL = "/img/logo.png";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#F0F5FA" }}
    >
      <img src={LOGO_URL} alt="LServices" className="h-16 w-auto object-contain mb-8" />
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-8 h-8" style={{ color: "#e7711b" }} />
        <span
          className="text-6xl font-bold"
          style={{ fontFamily: "Barlow Condensed, sans-serif", color: "#1e293b" }}
        >
          404
        </span>
      </div>
      <h1
        className="text-2xl font-bold mb-2 uppercase text-center"
        style={{ fontFamily: "Barlow Condensed, sans-serif", color: "#1e293b" }}
      >
        Page Not Found
      </h1>
      <p
        className="text-center mb-8 max-w-sm"
        style={{ color: "#475569", fontFamily: "Inter, sans-serif" }}
      >
        The page you're looking for doesn't exist. Head back to the recruitment hub to explore open positions.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded uppercase tracking-wide transition-all hover:opacity-90 active:scale-97"
        style={{ background: "#046BD2", fontFamily: "Barlow Condensed, sans-serif" }}
      >
        <Home className="w-4 h-4" />
        Back to Recruitment Hub
      </Link>
    </div>
  );
}
