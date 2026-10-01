import Image from "next/image";
import { ArrowRight, Clock, IndianRupee, GraduationCap, BookOpen, CheckCircle2 } from "lucide-react";
import { Course } from "@/lib/types";

const DEFAULT_COURSES: Course[] = [
  {
    id: "1", name: "8th Mathematics", class: "8th", board: "CBSE & State Board",
    subject: "Mathematics", description: "Strong foundation building with NCERT concepts, board pattern practice.",
    duration: "Academic Year", fees: "Contact Us", image: "", ctaText: "Enquire", ctaLink: "#contact",
    features: ["Complete NCERT coverage", "Weekly tests", "Doubt sessions", "Study material"],
    isActive: true, showOnHome: false, order: 1,
  },
  {
    id: "2", name: "9th & 10th Mathematics", class: "9th & 10th", board: "CBSE & State Board",
    subject: "Mathematics", description: "Board exam focused preparation with previous year papers and mock tests.",
    duration: "Academic Year", fees: "Contact Us", image: "", ctaText: "Enquire", ctaLink: "#contact",
    features: ["Board pattern practice", "Mock exams", "Error analysis", "Parent updates"],
    isActive: true, showOnHome: false, order: 2,
  },
  {
    id: "3", name: "11th & 12th Science Math", class: "11th & 12th", board: "State Board & CBSE",
    subject: "Mathematics", description: "Advanced mathematics for Science stream with calculus, algebra & more.",
    duration: "Academic Year", fees: "Contact Us", image: "", ctaText: "Enquire", ctaLink: "#contact",
    features: ["Calculus & Algebra", "Physics Math correlation", "Board + JEE basics", "Regular tests"],
    isActive: true, showOnHome: false, order: 3,
  },
  {
    id: "4", name: "MHT-CET Mathematics", class: "12th / Dropper", board: "MHT-CET",
    subject: "Mathematics", description: "Intensive MHT-CET mathematics preparation with topic-wise strategy.",
    duration: "6-12 Months", fees: "Contact Us", image: "", ctaText: "Enquire", ctaLink: "#contact",
    features: ["Topic-wise strategy", "1000+ MCQ practice", "Mock CET tests", "Score analysis"],
    isActive: true, showOnHome: false, order: 4,
  },
];

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="card-glass flex flex-col h-full overflow-hidden group">
      {/* Image or gradient placeholder */}
      <div className="relative h-44 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-muted)] overflow-hidden">
        {course.image ? (
          <Image src={course.image} alt={course.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BookOpen size={36} className="text-primary" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge badge-yellow text-[11px]">{course.class}</span>
          <span className="badge badge-gray text-[11px]">{course.board}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="font-display font-700 text-lg text-white group-hover:text-primary transition-colors">
          {course.name}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{course.description}</p>

        {/* Features */}
        {course.features && course.features.length > 0 && (
          <ul className="grid grid-cols-2 gap-1 mt-1">
            {course.features.slice(0, 4).map((f, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-primary flex-shrink-0" />
                <span className="text-xs text-[var(--text-secondary)]">{f}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-[var(--border)]">
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
            <Clock size={14} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-600 text-primary">
            <IndianRupee size={14} />
            <span>{course.fees}</span>
          </div>
        </div>

        <a href={course.ctaLink || "#contact"} className="btn-primary w-full justify-center mt-2">
          {course.ctaText || "Enquire Now"}
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}

export default function Courses({ courses }: { courses: Course[] }) {
  const items = courses.length > 0 ? courses : DEFAULT_COURSES;

  return (
    <section id="courses" className="section-padding bg-[var(--bg-dark)]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <span className="section-badge">
            <GraduationCap size={14} />
            Our Courses
          </span>
          <h2 className="section-title">
            Courses We <span className="gradient-text">Offer</span>
          </h2>
          <p className="section-subtitle">
            Expert mathematics coaching for every class and board — designed for real results.
          </p>
          <div className="gold-divider" />
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <a href="#contact" className="btn-outline">
            Not sure which course? Contact us <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
