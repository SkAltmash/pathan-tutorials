import Link from "next/link";
import { Trophy, ChevronRight } from "lucide-react";
import { Achievement } from "@/lib/types";

export default function AchievementsTeaser({ achievements }: { achievements: Achievement[] }) {
  if (achievements.length === 0) return null;

  return (
    <section className="section-padding bg-[var(--bg-card)] border-y border-[var(--border)]">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-badge mb-3 inline-flex"><Trophy size={13} /> Achievements</span>
            <h2 className="section-title">Our <span className="gradient-text">Top Scorers</span></h2>
          </div>
          <Link href="/results" className="flex items-center gap-1 text-primary font-semibold text-sm hover:text-primary-light transition-colors flex-shrink-0">
            View All Results <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {achievements.slice(0, 3).map((a) => (
            <div key={a.id} className="card-glass p-5 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Trophy size={22} className="text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-base">{a.title}</h3>
                {a.description && <p className="text-xs text-[var(--text-secondary)] mt-1">{a.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
