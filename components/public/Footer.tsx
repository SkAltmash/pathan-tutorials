import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin, AtSign, Share2, PlayCircle, Send, Link2 } from "lucide-react";
import { SiteSettings } from "@/lib/types";

interface FooterProps {
  settings: SiteSettings | null;
}

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Results", href: "/results" },
  { label: "Faculty", href: "/faculty" },
  { label: "Gallery", href: "/gallery" },
  { label: "Announcements", href: "/announcements" },
  { label: "Contact", href: "/contact" },
];

const COURSE_LINKS = [
  { label: "8th Mathematics", href: "/courses" },
  { label: "9th Mathematics", href: "/courses" },
  { label: "10th Mathematics", href: "/courses" },
  { label: "11th Mathematics", href: "/courses" },
  { label: "12th Mathematics", href: "/courses" },
  { label: "MHT-CET Prep", href: "/courses" },
];

export default function Footer({ settings }: FooterProps) {
  const logo = settings?.logo || "/logo.jpg";
  const name = settings?.siteName || "Pathan Tutorials";
  const description = settings?.footerDescription || settings?.description || "Premier Mathematics coaching institute in Hinganghat. CBSE, State Board & MHT-CET preparation with proven results.";
  const copyright = settings?.footerCopyright || `© ${new Date().getFullYear()} ${name}. All rights reserved.`;

  return (
    <footer className="bg-[var(--bg-card)] border-t border-[var(--border)]">
      <div className="container-custom py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30">
                <Image src={logo} alt={name} fill className="object-cover" />
              </div>
              <span className="font-display font-800 text-white">{name}</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>

            {/* Social Links */}
            <div className="flex gap-2 flex-wrap">
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-primary hover:border-primary/30 transition-colors">
                  <AtSign size={15} />
                </a>
              )}
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-primary hover:border-primary/30 transition-colors">
                  <Share2 size={15} />
                </a>
              )}
              {settings?.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-primary hover:border-primary/30 transition-colors">
                  <PlayCircle size={15} />
                </a>
              )}
              {settings?.telegramUrl && (
                <a href={settings.telegramUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-primary hover:border-primary/30 transition-colors">
                  <Send size={15} />
                </a>
              )}
              {settings?.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-primary hover:border-primary/30 transition-colors">
                  <Link2 size={15} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-700 text-sm uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-display font-700 text-sm uppercase tracking-wider text-white mb-4">Our Courses</h4>
            <ul className="flex flex-col gap-2">
              {COURSE_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-700 text-sm uppercase tracking-wider text-white mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              {settings?.address && (
                <div className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                  <MapPin size={15} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">
                  <Phone size={15} className="text-primary flex-shrink-0" />
                  {settings.phone}
                </a>
              )}
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] hover:text-green-500 transition-colors">
                  <MessageCircle size={15} className="text-green-500 flex-shrink-0" />
                  {settings.whatsapp}
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">
                  <Mail size={15} className="text-primary flex-shrink-0" />
                  {settings.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)]">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">{copyright}</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs text-[var(--text-muted)] hover:text-primary transition-colors">
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
