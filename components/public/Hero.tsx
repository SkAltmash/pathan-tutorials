"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Star, ChevronDown, BookOpen, Users } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* ── Background ─────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[var(--bg-dark)]">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[var(--bg-dark)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-dark)] via-transparent to-transparent" />
      </div>

      {/* ── Animated grid pattern ──────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Gold glow orbs ─────────────────────────────────── */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "var(--primary)" }}
      />
      <div
        className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full opacity-5 blur-3xl"
        style={{ background: "var(--primary-light)" }}
      />

      <div className="container-custom relative z-10 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Left Content ────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Badge */}
            <div className="animate-fadeInUp" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
              <span className="section-badge">🏆 Hinganghat&apos;s #1 Maths Institute</span>
            </div>

            {/* Heading */}
            <h1
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-900 leading-[1.08] tracking-tight text-white animate-fadeInUp"
              style={{ animationDelay: "0.2s", animationFillMode: "both" }}
            >
              Master Mathematics
              <br />
              <span className="gradient-text">With Confidence</span>
            </h1>

            {/* Subheading */}
            <p
              className="text-lg font-600 text-primary animate-fadeInUp"
              style={{ animationDelay: "0.3s", animationFillMode: "both" }}
            >
              Expert Coaching for Classes 8–12
            </p>

            {/* Description */}
            <p
              className="text-base text-[var(--text-secondary)] leading-relaxed max-w-xl animate-fadeInUp"
              style={{ animationDelay: "0.4s", animationFillMode: "both" }}
            >
              Pathan Tutorials — Your trusted partner for Mathematics excellence in Hinganghat.
              CBSE, Maharashtra Board &amp; MHT-CET preparation with proven results.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex md:flex-wrap gap-3 animate-fadeInUp"
              style={{ animationDelay: "0.5s", animationFillMode: "both" }}
            >
              <Link href="/contact" className="btn-primary">
                Enroll Now
                <ArrowRight size={18} />
              </Link>
              <Link href="/results" className="btn-outline">
                <Play size={16} className="fill-current" />
                View Results
              </Link>
            </div>

            {/* Trust indicators */}
            <div
              className="flex flex-wrap items-center gap-6 pt-2 animate-fadeInUp"
              style={{ animationDelay: "0.6s", animationFillMode: "both" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="star-filled" />
                  ))}
                </div>
                <span className="text-sm text-[var(--text-secondary)]">500+ Happy Students</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <BookOpen size={15} className="text-primary" />
                <span>10+ Years Experience</span>
              </div>
            </div>
          </div>

          {/* ── Right — Logo ─────────────────────────────── */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Outer rings */}
              <div
                className="absolute -inset-8 rounded-full border border-primary/10 animate-spin-slow"
                style={{ animationDuration: "20s" }}
              />
              <div className="absolute -inset-4 rounded-full border border-primary/20" />

              {/* Logo */}
              <div className="relative w-72 h-72 rounded-full overflow-hidden border-4 border-primary/30 ring-4 ring-primary/10 shadow-2xl animate-float">
                <Image
                  src="/logo.jpg"
                  alt="Pathan Tutorials"
                  fill
                  sizes="288px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating badge — CBSE */}
              <div
                className="absolute -top-4 -right-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 shadow-xl animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <div>
                    <p className="text-xs font-700 text-white">CBSE &amp; State Board</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">8th to 12th</p>
                  </div>
                </div>
              </div>

              {/* Floating badge — MHT-CET */}
              <div
                className="absolute -bottom-4 -left-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 shadow-xl animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-primary" />
                  <div>
                    <p className="text-xs font-700 text-white">MHT-CET</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">Expert Prep</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Scroll indicator ──────────────────────────────── */}
        <div className="flex justify-center mt-16 lg:mt-24">
          <a
            href="#stats"
            className="flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-primary transition-colors"
          >
            <span className="text-xs font-500 tracking-wider uppercase">Scroll</span>
            <ChevronDown size={18} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
