import Image from "next/image";
import { CheckCircle2, MapPin, Phone, Mail, Clock } from "lucide-react";
import { SiteSettings } from "@/lib/types";

export default function About({ settings }: { settings: SiteSettings | null }) {
  const sir = settings?.sir || "/sir.png";
  const name = settings?.siteName || "Pathan Tutorials";
  const description =
    settings?.description ||
    "Pathan Tutorials of Mathematics is a premier coaching institute in Hinganghat dedicated to building strong mathematical foundations. With over a decade of experience, we have helped hundreds of students achieve top scores in CBSE, Maharashtra State Board, and MHT-CET examinations.";

  const features = [
    "Expert Mathematics teaching with conceptual clarity",
    "Dedicated batches for CBSE & Maharashtra State Board",
    "Specialized MHT-CET preparation with mock tests",
    "Small batch sizes for personalized attention",
    "Regular tests, assessments & doubt sessions",
    "Parent-teacher communication for student progress",
  ];

  return (
    <section id="about" className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ── Left: Image ─────────────────────────────────── */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Decorative rings */}
              <div className="absolute -inset-6 rounded-3xl border border-primary/10" />
              <div className="absolute -inset-3 rounded-3xl border border-primary/20" />

              {/* Main image */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl">
                <Image
                  src={sir}
                  alt={name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-display font-800 text-xl">{name}</p>
                  <p className="text-primary text-sm font-600">
                    {settings?.tagline || "Excellence in Mathematics"}
                  </p>
                </div>
              </div>

              {/* Experience badge */}
              <div className="absolute -bottom-4 -right-4 bg-primary text-black rounded-2xl p-4 shadow-xl">
                <p className="font-display font-900 text-3xl leading-none">10+</p>
                <p className="text-xs font-700 leading-tight">Years of<br />Excellence</p>
              </div>
            </div>
          </div>

          {/* ── Right: Content ───────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="section-badge mb-4 inline-flex">About Us</span>
              <h2 className="section-title mb-4">
                Shaping Mathematics{" "}
                <span className="gradient-text">Champions</span> Since 2014
              </h2>
              <p className="section-subtitle">{description}</p>
            </div>

            {/* Features list */}
            <ul className="grid sm:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-primary mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-[var(--text-secondary)]">{f}</span>
                </li>
              ))}
            </ul>

            {/* Quick info */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {settings?.address && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
                  <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">{settings.address}</span>
                </div>
              )}
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors"
                >
                  <Phone size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">{settings.phone}</span>
                </a>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors"
                >
                  <Mail size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">{settings.email}</span>
                </a>
              )}
              {settings?.openingHours && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
                  <Clock size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">{settings.openingHours}</span>
                </div>
              )}
            </div>

            <div>
              <a href="#contact" className="btn-primary">
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
