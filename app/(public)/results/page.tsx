// Server Component — data fetched server-side, only grid is client-side
import Link from "next/link";
import { Trophy, Star, ArrowRight } from "lucide-react";
import { getCachedResults } from "@/lib/bff/cache";
import ResultsGrid from "@/components/public/ResultsGrid";

export const metadata = {
  title: "Student Results — Pathan Tutorials",
  description: "See the outstanding results and achievements of Pathan Tutorials students across SSC, HSC, and MHT-CET.",
};

export default async function ResultsPage() {
  const results = await getCachedResults().catch(() => []);

  return (
    <div className="pt-20 lg:pt-24">

      {/* ── Hero Header ─────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-[var(--bg-dark)] border-b border-[var(--border)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/4 rounded-full blur-3xl" />
        </div>
        <div className="container-custom text-center max-w-3xl mx-auto relative">
          <span className="section-badge mb-5 inline-flex">
            <Trophy size={14} /> Our Achievers
          </span>
          <h1 className="section-title">
            Student <span className="gradient-text">Results</span>
          </h1>
          <p className="section-subtitle mt-4 mx-auto">
            Proud of every student who achieved excellence through hard work and dedicated guidance.
          </p>
          <div className="gold-divider mx-auto mt-6" />
        </div>
      </section>

      {/* ── Interactive Grid (Client Component) ─────────────── */}
      <ResultsGrid results={results} />

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-16 bg-[var(--bg-card)] border-t border-[var(--border)]">
        <div className="container-custom text-center max-w-2xl mx-auto flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Star size={24} className="text-primary" />
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Want to be Our Next <span className="gradient-text">Achiever?</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md">
            Enroll today and begin your journey to excellence with expert coaching for Classes 8–12 and MHT-CET.
          </p>
          <Link href="/contact" className="btn-primary">
            Enquire Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
