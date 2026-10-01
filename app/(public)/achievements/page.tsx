import { getCachedAchievements } from "@/lib/bff/cache";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Calendar, ArrowRight, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Achievements — Pathan Tutorials",
  description: "Celebrate the milestones and outstanding accomplishments of Pathan Tutorials students.",
};

const CATEGORY_COLORS: Record<string, string> = {
  Academic:   "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Sports:     "bg-green-500/10 text-green-400 border-green-500/20",
  Award:      "bg-primary/10 text-primary border-primary/20",
  Rank:       "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Merit:      "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Other:      "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default async function AchievementsPage() {
  const achievements = await getCachedAchievements().catch(() => []);

  return (
    <div className="pt-20 lg:pt-24">
      {/* ── Page Header ─────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-[var(--bg-dark)] border-b border-[var(--border)] relative overflow-hidden">
        {/* background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="container-custom text-center max-w-3xl mx-auto relative">
          <span className="section-badge mb-5 inline-flex">
            <Trophy size={14} /> Achievements
          </span>
          <h1 className="section-title">
            Our <span className="gradient-text">Top Performers</span>
          </h1>
          <p className="section-subtitle mt-4 mx-auto">
            Celebrating the milestones and outstanding accomplishments of our dedicated students.
          </p>
          <div className="gold-divider mx-auto mt-6" />
        </div>
      </section>

      {/* ── Achievements Grid ────────────────────────────────── */}
      <section className="section-padding bg-[var(--bg-card)]">
        <div className="container-custom">
          {achievements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Trophy size={36} className="text-primary/50" />
              </div>
              <h2 className="font-display font-bold text-xl text-white">No Achievements Yet</h2>
              <p className="text-[var(--text-secondary)] text-sm max-w-sm">
                Check back soon — we're always celebrating new milestones!
              </p>
              <Link href="/" className="btn-outline btn-sm mt-2">Back to Home</Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((a) => {
                const categoryClass = CATEGORY_COLORS[a.category] ?? CATEGORY_COLORS.Other;
                return (
                  <div
                    key={a.id}
                    className="card-glass flex flex-col overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
                  >
                    {/* Image or Trophy Placeholder */}
                    {a.image ? (
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-surface)]">
                        <Image
                          src={a.image}
                          alt={a.title}
                          fill
                          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {/* Category badge on image */}
                        {a.category && (
                          <span className={`absolute top-3 left-3 text-[10px] font-700 uppercase tracking-wider px-2.5 py-1 rounded-full border ${categoryClass}`}>
                            {a.category}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary/10 border-b border-[var(--border)] relative">
                        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Trophy size={30} className="text-primary" />
                        </div>
                        {a.category && (
                          <span className={`absolute top-3 left-3 text-[10px] font-700 uppercase tracking-wider px-2.5 py-1 rounded-full border ${categoryClass}`}>
                            {a.category}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5 gap-3">
                      <h2 className="font-display font-bold text-white text-base leading-snug">
                        {a.title}
                      </h2>
                      {a.description && (
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                          {a.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border)]">
                        {a.date ? (
                          <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                            <Calendar size={12} />
                            {new Date(a.date).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </span>
                        ) : <span />}

                        {a.link && (
                          <a
                            href={a.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:text-primary-light transition-colors font-600"
                          >
                            View <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      {achievements.length > 0 && (
        <section className="section-padding bg-[var(--bg-dark)] border-t border-[var(--border)]">
          <div className="container-custom text-center max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-2xl text-white mb-3">
              Want to be our next <span className="gradient-text">achiever?</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-sm mb-6">
              Join Pathan Tutorials and get expert guidance to reach your academic goals.
            </p>
            <Link href="/contact" className="btn-primary inline-flex">
              Enroll Now <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
