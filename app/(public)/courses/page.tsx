import { getCachedCourses } from "@/lib/bff/cache";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = { title: "Courses — Pathan Tutorials" };

export default async function CoursesPage() {
  const courses = await getCachedCourses().catch(() => []);

  return (
    <div className="pt-20 lg:pt-24">
      {/* Page Header */}
      <section className="py-12 sm:py-16 bg-[var(--bg-dark)] border-b border-[var(--border)]">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <span className="section-badge mb-4 inline-flex">
            <BookOpen size={14} /> Courses We Offer
          </span>
          <h1 className="section-title">
            Expert <span className="gradient-text">Mathematics</span> Coaching
          </h1>
          <p className="section-subtitle mt-4">
            Comprehensive mathematics coaching for Classes 8–12 (CBSE & State Board) and MHT-CET preparation.
          </p>
          <div className="gold-divider mx-auto mt-6" />
        </div>
      </section>

      {/* Courses Grid */}
      <section className="section-padding bg-[var(--bg-card)]">
        <div className="container-custom">
          {courses.length === 0 ? (
            <div className="text-center py-24">
              <BookOpen size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-30" />
              <h3 className="font-display font-bold text-white text-xl mb-2">Courses Coming Soon</h3>
              <p className="text-[var(--text-secondary)] text-sm">Course details are being updated. Please contact us for information.</p>
              <Link href="/contact" className="btn-primary mt-6 inline-flex">Enquire Now</Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="card-glass flex flex-col overflow-hidden group">
                  {/* Image */}
                  {course.image ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={course.image} alt={course.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className="badge badge-yellow">{course.class}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-primary/5 border-b border-[var(--border)] flex items-center justify-center relative">
                      <BookOpen size={36} className="text-primary/30" />
                      <div className="absolute bottom-3 left-3">
                        <span className="badge badge-yellow">{course.class}</span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <div>
                      <h2 className="font-display font-bold text-white text-lg">{course.name}</h2>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {course.board && <span className="badge badge-gray">{course.board}</span>}
                        {course.subject && <span className="badge badge-gray">{course.subject}</span>}
                      </div>
                    </div>

                    {course.description && (
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{course.description}</p>
                    )}

                    {/* Features */}
                    {course.features && course.features.length > 0 && (
                      <ul className="flex flex-col gap-1.5">
                        {course.features.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                            <CheckCircle2 size={14} className="text-primary flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap gap-3 pt-2 border-t border-[var(--border)] mt-auto">
                      {course.duration && (
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                          <Clock size={12} /> {course.duration}
                        </div>
                      )}
                      {course.fees && (
                        <div className="text-xs font-bold text-primary">{course.fees}</div>
                      )}
                    </div>

                    <Link
                      href={course.ctaLink || "/contact"}
                      className="btn-primary btn-sm justify-center mt-2"
                    >
                      {course.ctaText || "Enquire Now"} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[var(--bg-dark)] border-t border-[var(--border)]">
        <div className="container-custom text-center max-w-xl mx-auto flex flex-col items-center gap-4">
          <h2 className="font-display font-extrabold text-2xl text-white">Have Questions About Admission?</h2>
          <p className="text-[var(--text-secondary)]">We're happy to guide you. Reach out anytime.</p>
          <Link href="/contact" className="btn-primary">Contact Us <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  );
}
