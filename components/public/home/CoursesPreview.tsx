import Link from "next/link";
import { BookOpen, ArrowRight, ChevronRight } from "lucide-react";
import { Course } from "@/lib/types";

const FALLBACK: { name: string; board: string; badge: string }[] = [
  { name: "8th Mathematics",  board: "CBSE & State Board",    badge: "Class 8"  },
  { name: "9th Mathematics",  board: "CBSE & State Board",    badge: "Class 9"  },
  { name: "10th Mathematics", board: "CBSE & State Board",    badge: "Class 10" },
  { name: "11th Mathematics", board: "Science Stream",        badge: "Class 11" },
  { name: "12th Mathematics", board: "Science Stream",        badge: "Class 12" },
  { name: "MHT-CET Maths",   board: "Engineering Entrance",  badge: "CET Prep" },
];

function CourseCard({ name, board, badge, fees, description }: {
  name: string; board?: string; badge?: string; fees?: string; description?: string;
}) {
  return (
    <Link href="/courses"
      className="group card-glass p-5 flex flex-col gap-3 hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <BookOpen size={18} className="text-primary" />
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
            {badge}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-display font-bold text-white text-sm group-hover:text-primary transition-colors">{name}</h3>
        {board && <p className="text-xs text-[var(--text-muted)] mt-0.5">{board}</p>}
        {description && <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2">{description}</p>}
      </div>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border)]">
        {fees ? <span className="text-xs font-bold text-primary">{fees}</span> : <span />}
        <span className="flex items-center gap-1 text-primary text-xs font-semibold">
          Details <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export default function CoursesPreview({ courses }: { courses: Course[] }) {
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.length > 0
            ? courses.slice(0, 6).map((c) => (
                <CourseCard
                  key={c.id}
                  name={c.name}
                  board={c.board}
                  badge={c.class ? `Class ${c.class}` : undefined}
                  fees={c.fees}
                  description={c.description}
                />
              ))
            : FALLBACK.map((c) => (
                <CourseCard key={c.name} name={c.name} board={c.board} badge={c.badge} />
              ))
          }
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
