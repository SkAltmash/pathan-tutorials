import Link from "next/link";
import { BookOpen, Trophy, GraduationCap, Star, Images, Bell } from "lucide-react";

const PAGES = [
  { icon: BookOpen,     title: "Courses",       desc: "Classes 8–12, CBSE, State Board & MHT-CET", href: "/courses",       color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
  { icon: Trophy,       title: "Results",        desc: "Our students' outstanding achievements",     href: "/results",       color: "text-primary",    bg: "bg-primary/10 border-primary/20" },
  { icon: GraduationCap,title: "Faculty",        desc: "Meet our experienced educators",            href: "/faculty",       color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  { icon: Star,         title: "Testimonials",   desc: "What students & parents say",               href: "/testimonials",  color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { icon: Images,       title: "Gallery",        desc: "Photos from classes & events",              href: "/gallery",       color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
  { icon: Bell,         title: "Announcements",  desc: "Latest news & new batches",                 href: "/announcements", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
];

export default function PagesGrid() {
  return (
    <section className="section-padding bg-[var(--bg-card)] border-t border-[var(--border)]">
      <div className="container-custom">
        <div className="text-center mb-10">
          <span className="section-badge mb-3 inline-flex">Explore</span>
          <h2 className="section-title">
            Everything at <span className="gradient-text">Pathan Tutorials</span>
          </h2>
          <div className="gold-divider mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PAGES.map(({ icon: Icon, title, desc, href, color, bg }) => (
            <Link key={href} href={href}
              className="group flex flex-col items-center text-center gap-3 p-5 card-glass hover:border-primary/30 transition-all rounded-2xl">
              <div className={`w-12 h-12 rounded-2xl ${bg} border flex items-center justify-center`}>
                <Icon size={22} className={color} />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-white group-hover:text-primary transition-colors">{title}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1 leading-snug hidden sm:block">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
