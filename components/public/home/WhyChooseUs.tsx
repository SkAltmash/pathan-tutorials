import Link from "next/link";
import Image from "next/image";
import { Award, Users, CheckCircle2, BookOpen, Trophy, GraduationCap, Phone, ArrowRight, MapPin, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { SiteSettings } from "@/lib/types";

const WHY_US = [
  { icon: Award,          text: "10+ Years of Excellence" },
  { icon: Users,          text: "500+ Students Taught" },
  { icon: CheckCircle2,   text: "CBSE & State Board Expert" },
  { icon: BookOpen,       text: "MHT-CET Specialist" },
  { icon: Trophy,         text: "95%+ Success Rate" },
  { icon: GraduationCap,  text: "Individual Attention" },
];

export default function WhyChooseUs({ settings }: { settings: SiteSettings | null }) {
  const sirPhoto = settings?.sir?.trim() || "";
  const phone    = settings?.phone    || "";
  const whatsapp = settings?.whatsapp || settings?.phone || "";
  const waNumber = whatsapp.replace(/\D/g, "").replace(/^(?!91)/, "91");

  return (
    <section className="section-padding bg-[var(--bg-card)] border-b border-[var(--border)]">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">

          {/* ── Left: text + points ──────────────────────── */}
          <div>
            <span className="section-badge mb-4 inline-flex"><Award size={13} /> Why Choose Us</span>
            <h2 className="section-title mb-4">
              Trusted by <span className="gradient-text">Hundreds</span> of Students
            </h2>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-8">
              Pathan Tutorials has been the go-to Mathematics coaching in Hinganghat for over a decade.
              Our personalised approach ensures every student reaches their potential.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WHY_US.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-white">{text}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn-primary">Learn More <ArrowRight size={16} /></Link>
              <Link href="/contact" className="btn-outline">Enquire Now</Link>
            </div>
          </div>

          {/* ── Right: Teacher photo or logo ─────────────── */}
          <div className="flex flex-col gap-4">

            {/* Teacher / Sir photo card */}
            {sirPhoto ? (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl group">
                <Image
                  src={sirPhoto}
                  alt="Teacher at Pathan Tutorials"
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* subtle gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-display font-bold text-sm drop-shadow">
                    {settings?.siteName || "Pathan Tutorials"}
                  </p>
                  {settings?.tagline && (
                    <p className="text-white/70 text-xs mt-0.5 drop-shadow">{settings.tagline}</p>
                  )}
                </div>
              </div>
            ) : (
              /* Fallback logo */
              <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] aspect-[4/3]">
                <Image
                  src={settings?.logo || "/logo.jpeg"}
                  alt="Pathan Tutorials"
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-contain bg-[var(--bg-surface)] p-6"
                />
              </div>
            )}

            {/* Contact quick links */}
            <div className="grid grid-cols-2 gap-3">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <Phone size={18} className="text-primary" />
                  <div>
                    <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">Call</p>
                    <p className="text-sm font-bold text-white">{phone}</p>
                  </div>
                </a>
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                >
                  <FaWhatsapp size={20} className="text-green-400" />
                  <div>
                    <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">WhatsApp</p>
                    <p className="text-sm font-bold text-white">Message Us</p>
                  </div>
                </a>
              )}
              {settings?.address && (
                <div className="col-span-2 flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
                  <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[var(--text-secondary)]">{settings.address}</p>
                </div>
              )}
              {settings?.openingHours && (
                <div className="col-span-2 flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15">
                  <Clock size={15} className="text-primary flex-shrink-0" />
                  <p className="text-sm text-white font-semibold">{settings.openingHours}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
