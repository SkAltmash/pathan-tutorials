"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, BookOpen, Users, ChevronDown, Award, Clock, Trophy } from "lucide-react";

const STATS = [
  { value: "10+", label: "Years Experience" },
  { value: "500+", label: "Students Taught" },
  { value: "95%", label: "Top Scorers" },
];

const BADGES = [
  { icon: BookOpen, text: "CBSE & State Board" },
  { icon: Users, text: "MHT-CET Prep" },
  { icon: Award, text: "8th — 12th Maths" },
  { icon: Clock, text: "10+ Years" },
];

import { SiteSettings } from "@/lib/types";

interface HeroProps {
  settings?: SiteSettings | null;
}

export default function Hero({ settings }: HeroProps) {
  const logo = settings?.logo || "/logo.jpeg";
  const siteName = settings?.siteName || "Pathan Tutorials";
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16 lg:pt-20"
    >
      {/* ── Background ──────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[var(--bg-dark)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-dark)] via-[var(--bg-dark)] to-black/80" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[100px] pointer-events-none"
        style={{ background: "var(--primary)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-[0.05] blur-3xl pointer-events-none"
        style={{ background: "var(--primary-light)" }}
      />

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="container-custom relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-5 sm:gap-6 text-center lg:text-left items-center lg:items-start">

            {/* Badge */}
            <div
              className="animate-fadeInUp"
              style={{ animationDelay: "0.05s", animationFillMode: "both" }}
            >
              <span className="section-badge flex items-center gap-1.5">
                <Trophy size={14} className="text-primary flex-shrink-0" />
                Hinganghat&apos;s #1 Maths Institute
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-display text-[clamp(2.2rem,8vw,4rem)] font-900 leading-[1.07] tracking-tight text-white animate-fadeInUp"
              style={{ animationDelay: "0.15s", animationFillMode: "both" }}
            >
              Master Mathematics
              <br />
              <span className="gradient-text">With Confidence</span>
            </h1>

            {/* Sub */}
            <p
              className="text-base sm:text-lg font-semibold text-primary animate-fadeInUp"
              style={{ animationDelay: "0.25s", animationFillMode: "both" }}
            >
              Expert Coaching for Classes 8–12 &amp; MHT-CET
            </p>

            {/* Description */}
            <p
              className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-md animate-fadeInUp"
              style={{ animationDelay: "0.35s", animationFillMode: "both" }}
            >
              Pathan Tutorials — your trusted partner for Mathematics excellence
              in Hinganghat. CBSE, Maharashtra Board &amp; MHT-CET preparation
              with proven results.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto animate-fadeInUp"
              style={{ animationDelay: "0.45s", animationFillMode: "both" }}
            >
              <Link href="/contact" className="btn-primary justify-center">
                Enroll Now
                <ArrowRight size={18} />
              </Link>
              <Link href="/results" className="btn-outline justify-center">
                View Results
              </Link>
            </div>

            {/* Trust strip */}
            <div
              className="flex items-center justify-center lg:justify-start gap-4 animate-fadeInUp"
              style={{ animationDelay: "0.55s", animationFillMode: "both" }}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="star-filled" fill="currentColor" />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Trusted by 500+ students &amp; parents
              </span>
            </div>
          </div>

          {/* ── Right — Visual ───────────────────────────────── */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Outer decorative rings */}
              <div
                className="absolute -inset-10 rounded-full border border-primary/8 animate-spin-slow"
                style={{ animationDuration: "25s" }}
              />
              <div className="absolute -inset-5 rounded-full border border-primary/15" />

              {/* Logo circle */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-primary/30 ring-8 ring-primary/8 shadow-[0_0_60px_rgba(212,175,55,0.2)] animate-float">
                <Image
                  src={logo}
                  alt={siteName}
                  fill
                  sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating chip — top right */}
              <div
                className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-3 py-2 shadow-xl animate-float"
                style={{ animationDelay: "0.6s" }}
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={15} className="text-primary flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-white leading-tight">CBSE &amp; State</p>
                    <p className="text-[9px] text-[var(--text-secondary)]">8th to 12th</p>
                  </div>
                </div>
              </div>

              {/* Floating chip — bottom left */}
              <div
                className="absolute -bottom-3 -left-3 sm:-bottom-5 sm:-left-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-3 py-2 shadow-xl animate-float"
                style={{ animationDelay: "1.1s" }}
              >
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-primary flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-white leading-tight">MHT-CET</p>
                    <p className="text-[9px] text-[var(--text-secondary)]">Expert Prep</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mini Stats Bar ───────────────────────────────────── */}
        <div
          className="mt-14 lg:mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto lg:mx-0 animate-fadeInUp"
          style={{ animationDelay: "0.65s", animationFillMode: "both" }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center lg:text-left">
              <p className="font-display font-900 text-2xl sm:text-3xl gradient-text leading-none">{value}</p>
              <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Scroll cue ───────────────────────────────────────── */}
        <div className="flex justify-center mt-12 lg:mt-16">
          <a
            href="#why-us"
            className="flex flex-col items-center gap-1.5 text-[var(--text-muted)] hover:text-primary transition-colors group"
            aria-label="Scroll down"
          >
            <span className="text-[10px] font-medium tracking-widest uppercase">Explore</span>
            <ChevronDown size={18} className="animate-bounce group-hover:text-primary" />
          </a>
        </div>
      </div>
    </section>
  );
}
