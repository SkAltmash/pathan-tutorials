import Image from "next/image";
import { GraduationCap, AtSign, Link2, PlayCircle } from "lucide-react";
import { Faculty } from "@/lib/types";

const DEFAULT_FACULTY: Faculty[] = [
  {
    id: "1", name: "Mr. Pathan Sir", subject: "Mathematics (All Classes)",
    qualification: "M.Sc. Mathematics, B.Ed.", experience: "10+ Years",
    bio: "Founder and lead mathematics faculty with expertise in CBSE, State Board and MHT-CET curriculum. Known for making complex concepts simple.",
    profileImage: "/logo.jpeg", instagramUrl: "https://www.instagram.com/pathantutorials/",
    linkedinUrl: "", youtubeUrl: "", order: 1, isActive: true,
  },
];

function FacultyCard({ faculty }: { faculty: Faculty }) {
  return (
    <div className="card-glass p-6 flex flex-col items-center text-center gap-4 group">
      {/* Photo */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 ring-4 ring-primary/10">
        {faculty.profileImage ? (
          <Image src={faculty.profileImage} alt={faculty.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <GraduationCap size={36} className="text-primary" />
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h3 className="font-display font-700 text-lg text-white">{faculty.name}</h3>
        <p className="text-sm text-primary font-600 mt-0.5">{faculty.subject}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">{faculty.qualification}</p>
      </div>

      {/* Experience */}
      <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
        <span className="text-xs font-600 text-primary">{faculty.experience} Experience</span>
      </div>

      {/* Bio */}
      {faculty.bio && (
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faculty.bio}</p>
      )}

      {/* Social Links */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-[var(--border)] w-full justify-center">
        {faculty.instagramUrl && (
          <a href={faculty.instagramUrl} target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-primary hover:border-primary/30 transition-colors">
            <AtSign size={16} />
          </a>
        )}
        {faculty.linkedinUrl && (
          <a href={faculty.linkedinUrl} target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-primary hover:border-primary/30 transition-colors">
            <Link2 size={16} />
          </a>
        )}
        {faculty.youtubeUrl && (
          <a href={faculty.youtubeUrl} target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-primary hover:border-primary/30 transition-colors">
            <PlayCircle size={16} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function FacultySection({ faculty }: { faculty: Faculty[] }) {
  const items = faculty.length > 0 ? faculty : DEFAULT_FACULTY;

  return (
    <section id="faculty" className="section-padding bg-[var(--bg-card)] border-y border-[var(--border)]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <span className="section-badge">
            <GraduationCap size={14} />
            Our Faculty
          </span>
          <h2 className="section-title">
            Meet Our <span className="gradient-text">Educators</span>
          </h2>
          <p className="section-subtitle">
            Experienced and passionate mathematics educators committed to your academic success.
          </p>
          <div className="gold-divider" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((f) => (
            <FacultyCard key={f.id} faculty={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
