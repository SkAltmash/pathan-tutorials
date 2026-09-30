import { CheckCircle2, Zap, BookOpen, Users, Target, Clock, Award, MessageCircle } from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Expert Faculty",
    description: "Experienced and dedicated mathematics teachers with years of coaching excellence.",
  },
  {
    icon: Users,
    title: "Small Batch Sizes",
    description: "Limited students per batch ensuring every student gets personal attention.",
  },
  {
    icon: Target,
    title: "Result-Oriented",
    description: "Proven track record with 95%+ success rate across all boards and exams.",
  },
  {
    icon: Clock,
    title: "Flexible Timings",
    description: "Multiple batch timings to suit school schedules and exam timetables.",
  },
  {
    icon: Award,
    title: "Comprehensive Material",
    description: "Well-structured study notes, practice sheets, and previous year papers.",
  },
  {
    icon: MessageCircle,
    title: "Regular Updates",
    description: "Consistent parent-teacher communication on student performance and progress.",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="section-padding bg-[var(--bg-card)] border-y border-[var(--border)]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <span className="section-badge">
            <Zap size={14} />
            Why Choose Us
          </span>
          <h2 className="section-title">
            Why <span className="gradient-text">Pathan Tutorials?</span>
          </h2>
          <p className="section-subtitle">
            We go beyond teaching — we build strong concepts, discipline, and confidence that last a lifetime.
          </p>
          <div className="gold-divider" />
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="card-glass p-6 flex gap-4 animate-fadeInUp"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-700 text-base text-white mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 text-center">
          <h3 className="font-display font-800 text-2xl text-white mb-3">
            Ready to Excel in Mathematics?
          </h3>
          <p className="text-[var(--text-secondary)] mb-6 max-w-lg mx-auto">
            Join hundreds of students who have transformed their math journey with Pathan Tutorials.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a href="#contact" className="btn-primary">Enroll Now</a>
            <a href="#courses" className="btn-outline">View Courses</a>
          </div>
        </div>
      </div>
    </section>
  );
}
