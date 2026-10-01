import { Phone, Mail, MapPin, ExternalLink, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { getCachedSiteSettings } from "@/lib/bff/cache";
import EnquiryForm from "@/components/public/EnquiryForm";

export const metadata = { title: "Contact Us — Pathan Tutorials" };

export default async function ContactPage() {
  const settings = await getCachedSiteSettings().catch(() => null);

  const phone   = settings?.phone || "";
  const whatsapp = settings?.whatsapp || phone;
  const email   = settings?.email || "";
  const address = settings?.address || "";
  const mapsUrl = settings?.googleMapsUrl || "";
  const hours   = settings?.openingHours || "";

  return (
    <div className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="py-12 sm:py-16 bg-[var(--bg-dark)] border-b border-[var(--border)]">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <span className="section-badge mb-4 inline-flex">
            <Phone size={14} /> Contact Us
          </span>
          <h1 className="section-title">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="section-subtitle mt-4">
            Have questions? Ready to enroll? Reach out and we'll respond quickly.
          </p>
          <div className="gold-divider mx-auto mt-6" />
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-[var(--bg-card)]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">

            {/* ── Contact Info — Server rendered ─────────────── */}
            <div className="flex flex-col gap-6">
              <h2 className="font-display font-bold text-xl text-white">Contact Information</h2>

              <div className="grid gap-3">
                {phone && (
                  <a href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors group">
                    <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Phone size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Call Us</p>
                      <p className="text-base font-bold text-white">{phone}</p>
                    </div>
                  </a>
                )}

                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-green-500/30 transition-colors group">
                    <div className="w-11 h-11 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                      <FaWhatsapp size={20} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">WhatsApp</p>
                      <p className="text-base font-bold text-white">{whatsapp}</p>
                    </div>
                  </a>
                )}

                {email && (
                  <a href={`mailto:${email}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors group">
                    <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Email</p>
                      <p className="text-base font-bold text-white break-all">{email}</p>
                    </div>
                  </a>
                )}

                {address && (
                  <a href={mapsUrl || "#"} target={mapsUrl ? "_blank" : "_self"} rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors group">
                    <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Address</p>
                      <p className="text-sm font-semibold text-white">{address}</p>
                    </div>
                    {mapsUrl && <ExternalLink size={14} className="text-[var(--text-muted)] flex-shrink-0" />}
                  </a>
                )}

                {hours && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Clock size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Timings</p>
                      <p className="text-sm font-semibold text-white">{hours}</p>
                    </div>
                  </div>
                )}

                {!phone && !email && !address && (
                  <div className="text-center py-8 text-[var(--text-muted)]">
                    <p className="text-sm">Contact details not configured yet.</p>
                    <p className="text-xs mt-1">Please update from Admin Panel → Site Settings.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Enquiry Form — Client Component ────────────── */}
            <div className="admin-card">
              <EnquiryForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
