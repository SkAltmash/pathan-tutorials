import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, ChevronRight } from "lucide-react";
import { Course } from "@/lib/types";

// ── Image card shown when showOnHome=true ─────────────────────────────────────
function HomeCourseCard({ course }: { course: Course }) {
  const href = course.ctaLink || "/courses";
  return (
    <Link
      href={href}
      className="group card-glass flex flex-col overflow-hidden hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image — 4:3 */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-surface)]">
        {course.image ? (
          <>
            <Image
              src={course.image}
              alt={course.name}
              fill
              sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <BookOpen size={32} className="text-primary/40" />
          </div>
        )}

        {/* Class badge on image */}
        {course.class && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
            Class {course.class}
          </span>
        )}

        {/* Fees on image (bottom-left) */}
        {course.fees && course.image && (
          <span className="absolute bottom-3 left-3 text-sm font-bold text-white drop-shadow">
            {course.fees}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="font-display font-bold text-white text-sm group-hover:text-primary transition-colors leading-snug">
          {course.name}
        </h3>
        {course.board && (
          <p className="text-[11px] text-[var(--text-muted)]">{course.board}</p>
        )}
        {course.description && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 flex-1">
            {course.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border)]">
          {!course.image && course.fees ? (
            <span className="text-xs font-bold text-primary">{course.fees}</span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1 text-primary text-xs font-semibold">
            {course.ctaText || "Details"}{" "}
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function CoursesPreview({ courses }: { courses: Course[] }) {
  // Only courses explicitly marked to show on home AND with an image
  const featured = courses.filter((c) => c.showOnHome);

  // If none marked yet, fall back to showing first 3 active courses (graceful degradation)
  const display = featured.length > 0 ? featured : courses.slice(0, 3);

  if (display.length === 0) return null;

  return (
    <section className="section-padding bg-[var(--bg-dark)]">
      <div className="container-custom">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-badge mb-3 inline-flex"><BookOpen size={13} /> Courses</span>
            <h2 className="section-title">Courses <span className="gradient-text">We Offer</span></h2>
          </div>
          <Link href="/courses" className="flex items-center gap-1 text-primary font-semibold text-sm hover:text-primary-light transition-colors flex-shrink-0">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {/* Grid — image cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {display.map((c) => (
            <HomeCourseCard key={c.id} course={c} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link href="/courses" className="btn-primary">
            View All Courses <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
