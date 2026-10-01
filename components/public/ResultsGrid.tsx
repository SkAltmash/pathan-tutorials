"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { Trophy, User, Star, FileImage, X, ZoomIn, Filter } from "lucide-react";
import { StudentResult } from "@/lib/types";

interface ResultsGridProps {
  results: StudentResult[];
}

export default function ResultsGrid({ results }: ResultsGridProps) {
  const [examFilter, setExamFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Build dynamic filter lists from actual data
  const exams = useMemo(() => ["All", ...Array.from(new Set(results.map((r) => r.exam).filter(Boolean))).sort()], [results]);
  const years = useMemo(() => ["All", ...Array.from(new Set(results.map((r) => r.year).filter(Boolean))).sort((a, b) => Number(b) - Number(a))], [results]);

  const filtered = useMemo(() => {
    return results.filter((r) => {
      const matchExam = examFilter === "All" || r.exam === examFilter;
      const matchYear = yearFilter === "All" || r.year === yearFilter;
      return matchExam && matchYear;
    });
  }, [results, examFilter, yearFilter]);

  const hasFilters = examFilter !== "All" || yearFilter !== "All";

  return (
    <>
      {/* ── Stats Summary ───────────────────────────────────── */}
      {results.length > 0 && (
        <div className="bg-[var(--bg-surface)] border-b border-[var(--border)] py-5">
          <div className="container-custom grid grid-cols-3 divide-x divide-[var(--border)] text-center">
            <div className="px-4">
              <p className="text-2xl font-display font-extrabold text-primary">{results.length}+</p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mt-0.5">Students</p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-display font-extrabold text-primary">
                {years.filter((y) => y !== "All").length}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mt-0.5">Batches</p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-display font-extrabold text-primary">
                {results.filter((r) => r.rank).length}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mt-0.5">Toppers</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Filters ─────────────────────────────────────────── */}
      <div className="sticky top-16 lg:top-20 z-30 bg-[var(--bg-card)]/95 backdrop-blur-md border-b border-[var(--border)] py-4">
        <div className="container-custom flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex-shrink-0">
            <Filter size={13} /> Filter
          </span>

          {/* Exam chips */}
          <div className="flex flex-wrap gap-2">
            {exams.map((exam) => (
              <button
                key={exam}
                onClick={() => setExamFilter(exam)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  examFilter === exam
                    ? "bg-primary text-black border-primary"
                    : "bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-primary/40 hover:text-white"
                }`}
              >
                {exam}
              </button>
            ))}
          </div>

          {/* Divider */}
          {years.length > 2 && <span className="hidden sm:block w-px h-5 bg-[var(--border)]" />}

          {/* Year chips */}
          {years.length > 2 && (
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setYearFilter(year)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    yearFilter === year
                      ? "bg-[var(--bg-surface)] text-white border-white/20"
                      : "bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-white/20 hover:text-white"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {hasFilters && (
            <button
              onClick={() => { setExamFilter("All"); setYearFilter("All"); }}
              className="ml-auto text-xs text-[var(--text-muted)] hover:text-white transition-colors underline underline-offset-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────── */}
      <section className="section-padding bg-[var(--bg-dark)]">
        <div className="container-custom">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Trophy size={32} className="text-primary/40" />
              </div>
              <h3 className="font-display font-bold text-white text-xl">
                {results.length === 0 ? "Results Coming Soon" : "No Results for This Filter"}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm max-w-sm">
                {results.length === 0
                  ? "Check back after board results are announced."
                  : "Try a different exam or year combination."}
              </p>
              {hasFilters && (
                <button
                  onClick={() => { setExamFilter("All"); setYearFilter("All"); }}
                  className="btn-outline btn-sm"
                >
                  Show All Results
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((result) => (
                <div
                  key={result.id}
                  className="card-glass flex flex-col overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
                >
                  {/* Student Photo — 1:1 */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[var(--bg-surface)]">
                    {result.studentPhoto ? (
                      <>
                        <Image
                          src={result.studentPhoto}
                          alt={result.studentName}
                          fill
                          sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                        <User size={36} className="text-primary/30" />
                      </div>
                    )}

                    {/* Percentage badge */}
                    {result.percentage && (
                      <span className="absolute top-2 right-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary text-black shadow-lg">
                        {result.percentage}
                      </span>
                    )}

                    {/* Rank badge */}
                    {result.rank && (
                      <span className="absolute top-2 left-2 flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/90 text-black">
                        <Star size={8} className="fill-black" /> {result.rank}
                      </span>
                    )}

                    {/* Name on photo */}
                    {result.studentPhoto && (
                      <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5">
                        <p className="font-display font-bold text-white text-xs leading-tight drop-shadow">
                          {result.studentName}
                        </p>
                        {(result.class || result.exam) && (
                          <p className="text-[9px] text-white/60 mt-0.5">
                            {[result.class, result.exam, result.year].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info when no photo */}
                  {!result.studentPhoto && (
                    <div className="px-3 pt-3 pb-1">
                      <p className="font-display font-bold text-white text-xs leading-snug">{result.studentName}</p>
                      {(result.class || result.exam) && (
                        <p className="text-[9px] text-[var(--text-muted)] mt-0.5">
                          {[result.class, result.exam, result.year].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {result.percentage && (
                        <p className="text-lg font-extrabold font-display text-primary mt-1">{result.percentage}</p>
                      )}
                    </div>
                  )}

                  {/* Marks */}
                  {result.marks && (
                    <p className="px-3 py-1 text-[10px] text-[var(--text-secondary)]">Marks: {result.marks}</p>
                  )}

                  {/* Achievement */}
                  {result.achievementDescription && (
                    <p className="px-3 pb-2 text-[10px] text-[var(--text-muted)] line-clamp-2 flex-1">
                      {result.achievementDescription}
                    </p>
                  )}

                  {/* Certificate preview */}
                  {result.resultImage && (
                    <button
                      onClick={() => setLightbox(result.resultImage)}
                      className="flex items-center gap-1.5 px-3 py-2 border-t border-[var(--border)] bg-primary/5 hover:bg-primary/10 transition-colors text-primary group/cert mt-auto"
                    >
                      <FileImage size={12} className="flex-shrink-0" />
                      <span className="text-[10px] font-semibold">View Certificate</span>
                      <ZoomIn size={11} className="ml-auto opacity-0 group-hover/cert:opacity-100 transition-opacity" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Count */}
          {filtered.length > 0 && hasFilters && (
            <p className="text-center text-xs text-[var(--text-muted)] mt-8">
              Showing {filtered.length} of {results.length} results
            </p>
          )}
        </div>
      </section>

      {/* ── Lightbox ────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
          >
            <X size={20} className="text-white" />
          </button>
          <div
            className="relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox}
              alt="Result Certificate"
              width={1200}
              height={900}
              className="w-full h-auto object-contain max-h-[85vh]"
            />
          </div>
          <p className="absolute bottom-5 text-xs text-white/40">Click anywhere outside to close</p>
        </div>
      )}
    </>
  );
}
