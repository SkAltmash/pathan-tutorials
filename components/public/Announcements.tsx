import { Bell, ArrowRight, Calendar } from "lucide-react";
import { Announcement } from "@/lib/types";

function AnnouncementCard({ ann }: { ann: Announcement }) {
  return (
    <div className="card-glass p-5 flex gap-4 items-start group">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Bell size={18} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="font-display font-700 text-base text-white group-hover:text-primary transition-colors">
            {ann.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] flex-shrink-0">
            <Calendar size={12} />
            {ann.date}
          </div>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">{ann.description}</p>
        {ann.ctaText && ann.ctaLink && (
          <a href={ann.ctaLink} className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-light font-600 mt-2 transition-colors">
            {ann.ctaText}
            <ArrowRight size={14} />
          </a>
        )}
      </div>
    </div>
  );
}

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1", title: "New Batch Starting — 9th & 10th Math",
    description: "New batches for 9th and 10th class mathematics are starting soon. Limited seats available. Register now to confirm your spot.",
    date: "September 2024", image: "", ctaText: "Register Now", ctaLink: "#contact", isActive: true,
  },
  {
    id: "2", title: "MHT-CET Special Crash Course",
    description: "Intensive MHT-CET Mathematics crash course for 2025 aspirants. 90-day focused program with daily practice.",
    date: "October 2024", image: "", ctaText: "Enquire", ctaLink: "#contact", isActive: true,
  },
  {
    id: "3", title: "Results 2024 — 95%+ Students Cleared Board!",
    description: "Congratulations to all our students for exceptional results in 2024 board examinations. We are proud of your achievements!",
    date: "June 2024", image: "", ctaText: "View Results", ctaLink: "#results", isActive: true,
  },
];

export default function Announcements({ announcements }: { announcements: Announcement[] }) {
  const items = announcements.length > 0 ? announcements : DEFAULT_ANNOUNCEMENTS;

  return (
    <section id="announcements" className="section-padding bg-[var(--bg-card)] border-y border-[var(--border)]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <span className="section-badge">
            <Bell size={14} />
            Announcements
          </span>
          <h2 className="section-title">
            Latest <span className="gradient-text">Updates</span>
          </h2>
          <p className="section-subtitle">
            Stay informed about new batches, results, events, and important notices.
          </p>
          <div className="gold-divider" />
        </div>

        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {items.map((ann) => (
            <AnnouncementCard key={ann.id} ann={ann} />
          ))}
        </div>
      </div>
    </section>
  );
}
