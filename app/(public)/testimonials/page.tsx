"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Quote, User } from "lucide-react";
import { Testimonial } from "@/lib/types";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then(setTestimonials)
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
      : null;

  return (
    <div className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="py-12 sm:py-16 bg-[var(--bg-dark)] border-b border-[var(--border)]">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <span className="section-badge mb-4 inline-flex">
            <Star size={14} /> Student Reviews
          </span>
          <h1 className="section-title">
            What Our <span className="gradient-text">Students Say</span>
          </h1>
          <p className="section-subtitle mt-4">
            Honest feedback from students and parents who experienced learning at Pathan Tutorials.
          </p>

          {avgRating && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.round(Number(avgRating)) ? "star-filled" : "text-[var(--border)]"}
                    fill={i < Math.round(Number(avgRating)) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-white font-bold text-lg">{avgRating}</span>
              <span className="text-[var(--text-muted)] text-sm">({testimonials.length} reviews)</span>
            </div>
          )}

          <div className="gold-divider mx-auto mt-6" />
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="section-padding bg-[var(--bg-card)]">
        <div className="container-custom">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-24">
              <Quote size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-30" />
              <h3 className="font-display font-bold text-white text-xl mb-2">Reviews Coming Soon</h3>
              <p className="text-[var(--text-secondary)] text-sm">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t) => (
                <div key={t.id} className="card-glass p-6 flex flex-col gap-4">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < t.rating ? "star-filled" : "text-[var(--border)]"}
                        fill={i < t.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative">
                    <Quote size={24} className="text-primary/30 absolute -top-1 -left-1" />
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed pl-5 italic">
                      "{t.testimonial}"
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)] mt-auto">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/20 flex-shrink-0">
                      {t.photo ? (
                        <Image src={t.photo} alt={t.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <User size={16} className="text-primary/50" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{t.class} · {t.date}</p>
                    </div>
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
