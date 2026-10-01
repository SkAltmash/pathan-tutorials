import { getCachedSiteSettings } from "@/lib/bff/cache";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export const metadata = { title: "About Us — Pathan Tutorials" };

export default async function AboutPage() {
  const settings = await getCachedSiteSettings().catch(() => null);

  return (
    <div className="pt-20 lg:pt-24">
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-[var(--bg-dark)] border-b border-[var(--border)]">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <span className="section-badge mb-4 inline-flex">About Us</span>
          <h1 className="section-title">
            Welcome to <span className="gradient-text">{settings?.siteName || "Pathan Tutorials"}</span>
          </h1>
          <p className="section-subtitle mt-4">
            {settings?.description || "Premier mathematics coaching institute in Hinganghat."}
          </p>
          <div className="gold-divider mx-auto mt-6" />
        </div>
      </section>

      {/* ── About Content ─────────────────────────────────────── */}
      <section className="section-padding bg-[var(--bg-card)]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative w-full aspect-square max-w-sm mx-auto lg:max-w-none rounded-2xl overflow-hidden border border-[var(--border)]">
              {settings?.logo ? (
                <Image
                  src={settings.logo}
                  alt={settings.siteName || "Pathan Tutorials"}
                  fill
                  className="object-contain p-8 bg-[var(--bg-surface)]"
                />
              ) : (
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                  <p className="text-[var(--text-muted)]">No image set</p>
                </div>
              )}
              {/* Gold border accent */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/20 pointer-events-none" />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-6">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                {settings?.siteName || "Pathan Tutorials"}
              </h2>
              {settings?.tagline && (
                <p className="text-primary font-semibold text-lg">{settings.tagline}</p>
              )}
              <p className="text-[var(--text-secondary)] leading-relaxed text-base">
                {settings?.description || "We provide expert mathematics coaching for students in Classes 8 to 12, covering CBSE and Maharashtra State Board syllabi, as well as MHT-CET preparation."}
              </p>

              {/* Contact Details */}
              <div className="flex flex-col gap-3">
                {settings?.phone && (
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Phone size={16} className="text-primary" />
                    </div>
                    <span>{settings.phone}</span>
                  </a>
                )}
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-green-400 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                      <FaWhatsapp size={18} className="text-green-500" />
                    </div>
                    <span>{settings.whatsapp}</span>
                  </a>
                )}
                {settings?.email && (
                  <a href={`mailto:${settings.email}`}
                    className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Mail size={16} className="text-primary" />
                    </div>
                    <span>{settings.email}</span>
                  </a>
                )}
                {settings?.address && (
                  <div className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin size={16} className="text-primary" />
                    </div>
                    <span>{settings.address}</span>
                  </div>
                )}
                {settings?.openingHours && (
                  <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Clock size={16} className="text-primary" />
                    </div>
                    <span>{settings.openingHours}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/courses" className="btn-primary">
                  View Courses <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="btn-outline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map ───────────────────────────────────────────────── */}
      {settings?.googleMapsUrl && (
        <section className="py-10 bg-[var(--bg-dark)] border-t border-[var(--border)]">
          <div className="container-custom text-center">
            <h2 className="font-display font-bold text-lg text-white mb-4">Find Us</h2>
            <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer"
              className="btn-outline inline-flex">
              <MapPin size={16} /> Open in Google Maps
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
