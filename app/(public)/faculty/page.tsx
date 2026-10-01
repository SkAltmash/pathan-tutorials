import { getCachedFaculty } from "@/lib/bff/cache";
import Image from "next/image";
import { GraduationCap, AtSign, Link2, PlayCircle } from "lucide-react";

export const metadata = { title: "Faculty — Pathan Tutorials" };

export default async function FacultyPage() {
  const faculty = await getCachedFaculty().catch(() => []);

  return (
    <div className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="py-12 sm:py-16 bg-[var(--bg-dark)] border-b border-[var(--border)]">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <span className="section-badge mb-4 inline-flex">
            <GraduationCap size={14} /> Our Faculty
          </span>
          <h1 className="section-title">
            Meet Our <span className="gradient-text">Educators</span>
          </h1>
          <p className="section-subtitle mt-4">
            Experienced and passionate mathematics educators committed to your academic success.
          </p>
          <div className="gold-divider mx-auto mt-6" />
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="section-padding bg-[var(--bg-card)]">
        <div className="container-custom">
          {faculty.length === 0 ? (
            <div className="text-center py-24">
              <GraduationCap size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-30" />
              <h3 className="font-display font-bold text-white text-xl mb-2">Faculty Details Coming Soon</h3>
              <p className="text-[var(--text-secondary)] text-sm">Faculty profiles will be published shortly.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {faculty.map((f) => (
                <div key={f.id} className="card-glass p-6 flex flex-col items-center text-center gap-4 group">
                  {/* Photo */}
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary/30 ring-4 ring-primary/10 flex-shrink-0">
                    {f.profileImage ? (
                      <Image
                        src={f.profileImage}
                        alt={f.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap size={36} className="text-primary/50" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <h2 className="font-display font-bold text-lg text-white">{f.name}</h2>
                    <p className="text-sm text-primary font-semibold mt-0.5">{f.subject}</p>
                    {f.qualification && (
                      <p className="text-xs text-[var(--text-muted)] mt-1">{f.qualification}</p>
                    )}
                  </div>

                  {/* Experience */}
                  {f.experience && (
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <span className="text-xs font-semibold text-primary">{f.experience} Experience</span>
                    </div>
                  )}

                  {/* Bio */}
                  {f.bio && (
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed text-center">{f.bio}</p>
                  )}

                  {/* Social Links */}
                  {(f.instagramUrl || f.linkedinUrl || f.youtubeUrl) && (
                    <div className="flex gap-2 mt-auto pt-3 border-t border-[var(--border)] w-full justify-center">
                      {f.instagramUrl && (
                        <a href={f.instagramUrl} target="_blank" rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-primary hover:border-primary/30 transition-colors"
                          title="Instagram">
                          <AtSign size={16} />
                        </a>
                      )}
                      {f.linkedinUrl && (
                        <a href={f.linkedinUrl} target="_blank" rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-primary hover:border-primary/30 transition-colors"
                          title="LinkedIn">
                          <Link2 size={16} />
                        </a>
                      )}
                      {f.youtubeUrl && (
                        <a href={f.youtubeUrl} target="_blank" rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-primary hover:border-primary/30 transition-colors"
                          title="YouTube">
                          <PlayCircle size={16} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
