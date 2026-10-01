import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { SiteSettings } from "@/lib/types";
import EnquiryForm from "./EnquiryForm";

interface ContactProps {
  settings: SiteSettings | null;
}

export default function Contact({ settings }: ContactProps) {
  const phone = settings?.phone || "+91 XXXXXXXXXX";
  const whatsapp = settings?.whatsapp || settings?.phone || "+91 XXXXXXXXXX";
  const email = settings?.email || "pathantutorials@gmail.com";
  const address = settings?.address || "Hinganghat, Maharashtra";
  const mapsUrl = settings?.googleMapsUrl || "https://maps.google.com";

  return (
    <section id="contact" className="section-padding bg-[var(--bg-dark)]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <span className="section-badge">
            <Phone size={14} />
            Contact Us
          </span>
          <h2 className="section-title">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="section-subtitle">
            Have questions? Ready to enroll? Reach out and we'll get back to you quickly.
          </p>
          <div className="gold-divider" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* ── Left: Contact Info — Server rendered ───────── */}
          <div className="flex flex-col gap-6">
            <h3 className="font-display font-700 text-xl text-white">Contact Information</h3>

            <div className="grid gap-3">
              <a href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors group">
                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-600 text-[var(--text-muted)] uppercase tracking-wide">Call Us</p>
                  <p className="text-base font-700 text-white">{phone}</p>
                </div>
              </a>

              <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-green-500/30 transition-colors group">
                <div className="w-11 h-11 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <FaWhatsapp size={20} className="text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-600 text-[var(--text-muted)] uppercase tracking-wide">WhatsApp</p>
                  <p className="text-base font-700 text-white">{whatsapp}</p>
                </div>
              </a>

              <a href={`mailto:${email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors group">
                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Mail size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-600 text-[var(--text-muted)] uppercase tracking-wide">Email</p>
                  <p className="text-base font-700 text-white">{email}</p>
                </div>
              </a>

              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors group">
                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-600 text-[var(--text-muted)] uppercase tracking-wide">Address</p>
                  <p className="text-sm font-600 text-white">{address}</p>
                </div>
                <ExternalLink size={14} className="text-[var(--text-muted)] group-hover:text-primary transition-colors flex-shrink-0" />
              </a>
            </div>

            {settings?.openingHours && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs font-700 uppercase tracking-wide text-primary mb-1">Opening Hours</p>
                <p className="text-sm text-[var(--text-secondary)]">{settings.openingHours}</p>
              </div>
            )}
          </div>

          {/* ── Right: Enquiry Form — Client Component ──────── */}
          <div className="admin-card">
            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
