import Link from "next/link";
import Image from "next/image";
import { Trophy, ChevronRight, Star } from "lucide-react";
import { StudentResult } from "@/lib/types";

function ResultCard({ result }: { result: StudentResult }) {
  return (
    <div className="card-glass flex flex-col overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      {/* Student Photo — 1:1 */}
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--bg-surface)]">
        {result.studentPhoto ? (
          <>
            <Image
              src={result.studentPhoto}
              alt={result.studentName}
              fill
              sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <Trophy size={32} className="text-primary/40" />
          </div>
        )}

        {/* Percentage badge — top right */}
        {result.percentage && (
          <span className="absolute top-2 right-2 text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-black shadow">
            {result.percentage}
          </span>
        )}

        {/* Name on photo */}
        {result.studentPhoto && (
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
            <p className="font-display font-bold text-white text-sm leading-tight drop-shadow">
              {result.studentName}
            </p>
            {result.class && (
              <p className="text-[10px] text-white/70">{result.class}</p>
            )}
          </div>
        )}
      </div>

      {/* Info — only when no photo (fallback) */}
      {!result.studentPhoto && (
        <div className="p-4 flex flex-col gap-1.5">
          <p className="font-display font-bold text-white text-sm">{result.studentName}</p>
          {result.class && <p className="text-[10px] text-[var(--text-muted)]">{result.class}</p>}
        </div>
      )}

      {/* Stats strip */}
      <div className="flex flex-wrap gap-2 px-3 py-2.5 border-t border-[var(--border)] bg-[var(--bg-surface)]">
        {result.exam && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{result.exam}</span>
        )}
        {result.year && (
          <span className="text-[10px] text-[var(--text-muted)]">· {result.year}</span>
        )}
        {result.rank && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-amber-400">
            <Star size={9} className="fill-amber-400" /> {result.rank}
          </span>
        )}
      </div>

      {/* Achievement description */}
      {result.achievementDescription && (
        <p className="px-3 pb-3 pt-1.5 text-xs text-[var(--text-secondary)] line-clamp-2">
          {result.achievementDescription}
        </p>
      )}
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function ResultsTeaser({ results }: { results: StudentResult[] }) {
  const featured = results.filter((r) => r.showOnHome);
  const display = featured.length > 0 ? featured : results.slice(0, 4);

  if (display.length === 0) return null;

  return (
    <section className="section-padding bg-[var(--bg-dark)] border-t border-[var(--border)]">
      <div className="container-custom">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-badge mb-3 inline-flex"><Trophy size={13} /> Results</span>
            <h2 className="section-title">Our <span className="gradient-text">Top Results</span></h2>
          </div>
          <Link
            href="/results"
            className="flex items-center gap-1 text-primary font-semibold text-sm hover:text-primary-light transition-colors flex-shrink-0"
          >
            View All Results <ChevronRight size={16} />
          </Link>
        </div>

        {/* Grid — 2 cols on sm, 4 cols on lg */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {display.slice(0, 4).map((r) => (
            <ResultCard key={r.id} result={r} />
          ))}
        </div>

        {/* Bottom CTA */}
        {results.length > 4 && (
          <div className="text-center mt-8">
            <Link href="/results" className="btn-outline btn-sm inline-flex">
              See All {results.length} Results <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
