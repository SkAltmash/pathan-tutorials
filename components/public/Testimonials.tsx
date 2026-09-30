import Image from "next/image";
import { Star, Quote, MessageSquare } from "lucide-react";
import { Testimonial } from "@/lib/types";

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: "1", name: "Riya Sharma", class: "10th CBSE", photo: "", testimonial: "Sir explains every concept so clearly. I went from failing to scoring 95% in Mathematics. Pathan Tutorials changed my life!", rating: 5, date: "2024", isActive: true },
  { id: "2", name: "Amit Patel", class: "12th HSC", photo: "", testimonial: "The MHT-CET preparation here is exceptional. The practice sets and mock tests helped me crack CET with 98 percentile.", rating: 5, date: "2024", isActive: true },
  { id: "3", name: "Sunita (Parent)", class: "Parent of 9th Std student", photo: "", testimonial: "My son's confidence in Math has improved dramatically. Regular tests and parent updates keep us informed. Highly recommended!", rating: 5, date: "2024", isActive: true },
  { id: "4", name: "Rohan Kulkarni", class: "12th State Board", photo: "", testimonial: "Best decision to join Pathan Tutorials for 12th Math. Scored 98/100 in board exams!", rating: 5, date: "2024", isActive: true },
  { id: "5", name: "Priya Mehta", class: "10th State Board", photo: "", testimonial: "Very systematic teaching approach. Small batches mean sir gives individual attention. Excellent institute!", rating: 5, date: "2023", isActive: true },
  { id: "6", name: "Mrs. Deshmukh (Parent)", class: "Parent of 12th student", photo: "", testimonial: "The quality of teaching here is unmatched. My daughter cleared MHT-CET and credits it entirely to Pathan Tutorials.", rating: 5, date: "2023", isActive: true },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className={i < rating ? "star-filled" : "star-empty"} />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="card-glass p-6 flex flex-col gap-4 h-full">
      <div className="flex items-start justify-between">
        <Quote size={32} className="text-primary/30" />
        <StarRating rating={t.rating} />
      </div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 italic">
        "{t.testimonial}"
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          {t.photo ? (
            <Image src={t.photo} alt={t.name} width={40} height={40} className="object-cover w-full h-full" />
          ) : (
            <span className="text-base font-800 text-primary">{t.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <p className="text-sm font-700 text-white">{t.name}</p>
          <p className="text-xs text-[var(--text-muted)]">{t.class}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const items = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <section id="testimonials" className="section-padding bg-[var(--bg-dark)]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <span className="section-badge">
            <MessageSquare size={14} />
            Testimonials
          </span>
          <h2 className="section-title">
            What Our <span className="gradient-text">Students Say</span>
          </h2>
          <p className="section-subtitle">
            Real words from real achievers who transformed their math journey with us.
          </p>
          <div className="gold-divider" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
