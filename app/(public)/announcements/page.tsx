import { getCachedAnnouncements } from "@/lib/bff/cache";
import { Bell, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Announcements — Pathan Tutorials" };

export default async function AnnouncementsPage() {
  const announcements = await getCachedAnnouncements().catch(() => []);

  return (
    <div className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="py-12 sm:py-16 bg-[var(--bg-dark)] border-b border-[var(--border)]">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <span className="section-badge mb-4 inline-flex">
            <Bell size={14} /> Announcements
          </span>
          <h1 className="section-title">
            Latest <span className="gradient-text">Updates</span>
          </h1>
          <p className="section-subtitle mt-4">
            Stay informed about new batches, results, events and important notices.
          </p>
          <div className="gold-divider mx-auto mt-6" />
        </div>
      </section>

      {/* List */}
      <section className="section-padding bg-[var(--bg-card)]">
        <div className="container-custom max-w-3xl mx-auto">
          {announcements.length === 0 ? (
            <div className="text-center py-24">
              <Bell size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-30" />
              <h3 className="font-display font-bold text-white text-xl mb-2">No Announcements Yet</h3>
              <p className="text-[var(--text-secondary)] text-sm">Check back soon for the latest updates!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="card-glass p-5 sm:p-6 flex gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Bell size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                      <h2 className="font-display font-bold text-base text-white">{ann.title}</h2>
                      <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] flex-shrink-0">
                        <Calendar size={11} />
                        <span>{ann.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{ann.description}</p>
                    {ann.ctaText && ann.ctaLink && (
                      <Link
                        href={ann.ctaLink}
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-light font-semibold mt-3 transition-colors"
                      >
                        {ann.ctaText}
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
