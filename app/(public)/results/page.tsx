"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, User, Star, FileImage, X, ZoomIn } from "lucide-react";
import { getResults } from "@/lib/firebase/firestore";
import { StudentResult } from "@/lib/types";

const EXAMS = ["All", "SSC", "HSC", "MHT-CET"];

export default function ResultsPage() {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    getResults()
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? results : results.filter((r) => r.exam === filter);

  return (
    <div className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="py-12 sm:py-16 bg-[var(--bg-dark)] border-b border-[var(--border)]">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <span className="section-badge mb-4 inline-flex">
            <Trophy size={14} /> Our Achievers
          </span>
          <h1 className="section-title">
            Student <span className="gradient-text">Results</span>
          </h1>
          <p className="section-subtitle mt-4">
            Proud of every student who achieved excellence through hard work and guidance.
          </p>
          <div className="gold-divider mx-auto mt-6" />
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-[var(--bg-card)] border-b border-[var(--border)]">
        <div className="container-custom flex flex-wrap gap-2 justify-center">
          {EXAMS.map((exam) => (
            <button
              key={exam}
              onClick={() => setFilter(exam)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                filter === exam
                  ? "bg-primary text-black border-primary"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-primary/30 hover:text-white"
              }`}
            >
              {exam}
            </button>
          ))}
        </div>
      </section>

      {/* Results Grid */}
      <section className="section-padding bg-[var(--bg-dark)]">
        <div className="container-custom">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Trophy size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-30" />
              <h3 className="font-display font-bold text-white text-xl mb-2">
                {results.length === 0 ? "Results Coming Soon" : "No Results for This Filter"}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Check back after board results are announced.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((result) => (
                <div
                  key={result.id}
                  className="card-glass flex flex-col items-center text-center p-6 gap-4 group"
                >
                  {/* Student Photo */}
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 ring-4 ring-primary/10 flex-shrink-0">
                    {result.studentPhoto ? (
                      <Image
                        src={result.studentPhoto}
                        alt={result.studentName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <User size={28} className="text-primary/50" />
                      </div>
                    )}
                  </div>

                  {/* Name & Exam */}
                  <div>
                    <h3 className="font-display font-bold text-white">{result.studentName}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {result.class} — {result.exam} {result.year}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-center gap-1">
                    {result.percentage && (
                      <div className="text-3xl font-display font-extrabold text-primary">
                        {result.percentage}
                      </div>
                    )}
                    {result.marks && (
                      <p className="text-xs text-[var(--text-secondary)]">Marks: {result.marks}</p>
                    )}
                    {result.rank && (
                      <span className="badge badge-yellow text-xs mt-1">{result.rank}</span>
                    )}
                  </div>

                  {result.achievementDescription && (
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {result.achievementDescription}
                    </p>
                  )}

                  {/* ── Result Certificate ── */}
                  {result.resultImage && (
                    <div className="w-full mt-1">
                      <button
                        onClick={() => setLightbox(result.resultImage)}
                        className="w-full group/cert relative rounded-xl overflow-hidden border border-[var(--border)] hover:border-primary/40 transition-all"
                      >
                        <div className="relative aspect-video w-full">
                          <Image
                            src={result.resultImage}
                            alt="Result Certificate"
                            fill
                            sizes="(max-width:640px) 100vw, 50vw"
                            className="object-cover group-hover/cert:scale-105 transition-transform duration-300"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/cert:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <ZoomIn size={18} className="text-white" />
                            <span className="text-white text-xs font-semibold">View Certificate</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-primary/5 border-t border-[var(--border)]">
                          <FileImage size={13} className="text-primary" />
                          <span className="text-xs font-semibold text-primary">Result Certificate</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[var(--bg-card)] border-t border-[var(--border)]">
        <div className="container-custom text-center max-w-xl mx-auto flex flex-col items-center gap-4">
          <Star size={28} className="text-primary" />
          <h2 className="font-display font-extrabold text-2xl text-white">
            Want to be Our Next Achiever?
          </h2>
          <p className="text-[var(--text-secondary)]">
            Enroll today and begin your journey to excellence.
          </p>
          <Link href="/contact" className="btn-primary">Enquire Now</Link>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
          <div
            className="relative max-w-3xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox}
              alt="Result Certificate"
              width={1200}
              height={900}
              className="w-full h-auto object-contain"
            />
          </div>
          <p className="absolute bottom-6 text-xs text-white/50">Click anywhere to close</p>
        </div>
      )}
    </div>
  );
}
