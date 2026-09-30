import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { Testimonial } from "@/lib/types";

export default function TestimonialsTeaser({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="section-padding bg-[var(--bg-dark)]">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-badge mb-3 inline-flex"><Star size={13} /> Reviews</span>
            <h2 className="section-title">What Students <span className="gradient-text">Say</span></h2>
          </div>
          <Link href="/testimonials" className="flex items-center gap-1 text-primary font-semibold text-sm hover:text-primary-light transition-colors flex-shrink-0">
            All Reviews <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.slice(0, 3).map((t) => {
            const name = t.name || "Student";
            const review = t.testimonial || "";
            const rating = t.rating ?? 5;
            const cls = t.class;

            return (
              <div key={t.id} className="card-glass p-5 flex flex-col gap-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < rating ? "star-filled" : "text-[var(--border)]"} fill={i < rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 flex-1">
                  &ldquo;{review}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{name}</p>
                    {cls && (
                      <p className="text-xs text-[var(--text-muted)]">Class {cls}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
