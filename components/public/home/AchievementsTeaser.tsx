import Link from "next/link";
import Image from "next/image";
import { Trophy, ChevronRight, Calendar } from "lucide-react";
import { Achievement } from "@/lib/types";

export default function AchievementsTeaser({ achievements }: { achievements: Achievement[] }) {
  if (achievements.length === 0) return null;

  const preview = achievements.slice(0, 3);

  return (
    <section className="section-padding bg-[var(--bg-card)] border-y border-[var(--border)]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-badge mb-3 inline-flex"><Trophy size={13} /> Achievements</span>
            <h2 className="section-title">Our <span className="gradient-text">Top Performers</span></h2>
          </div>
          <Link
            href="/achievements"
            className="flex items-center gap-1 text-primary font-semibold text-sm hover:text-primary-light transition-colors flex-shrink-0"
          >
            View All Achievements <ChevronRight size={16} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-5">
          {preview.map((a) => (
            <div
              key={a.id}
              className="card-glass flex flex-col overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Image or icon */}
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
                  {a.category && (
                    <span className="absolute top-2 left-2 text-[10px] font-700 uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                      {a.category}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary/10 border-b border-[var(--border)]">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Trophy size={22} className="text-primary" />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="font-display font-bold text-white text-sm leading-snug">{a.title}</h3>
                {a.description && (
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 flex-1">{a.description}</p>
                )}
                {a.date && (
                  <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] mt-auto pt-2 border-t border-[var(--border)]">
                    <Calendar size={10} />
                    {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA if more exist */}
        {achievements.length > 3 && (
          <div className="text-center mt-8">
            <Link href="/achievements" className="btn-outline btn-sm inline-flex">
              See All {achievements.length} Achievements <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
