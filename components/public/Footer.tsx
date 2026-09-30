import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin, ArrowRight, Clock } from "lucide-react";
import { FaInstagram, FaFacebookF, FaYoutube, FaTelegramPlane, FaLinkedinIn } from "react-icons/fa";
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
  "8th Mathematics",
  "9th Mathematics",
  "10th Mathematics",
  "11th Mathematics",
  "12th Mathematics",
  "MHT-CET Prep",
];

export default function Footer({ settings }: FooterProps) {
  const logo = settings?.logo || "/logo.jpg";
  const name = settings?.siteName || "Pathan Tutorials";
  const tagline = settings?.tagline || "Excellence in Mathematics";
  const description = settings?.footerDescription || settings?.description ||
    "Premier Mathematics coaching institute in Hinganghat. CBSE, State Board & MHT-CET preparation with proven results.";
  const copyright = settings?.footerCopyright ||
    `© ${new Date().getFullYear()} ${name}. All rights reserved.`;
  const phone = settings?.phone || "";
  const whatsapp = settings?.whatsapp || "";
  const email = settings?.email || "";
  const address = settings?.address || "";
  const hours = settings?.openingHours || "";

  const socials = [
    { url: settings?.instagramUrl, Icon: FaInstagram,    label: "Instagram", color: "hover:text-[#e1306c] hover:border-[#e1306c]/30" },
    { url: settings?.facebookUrl,  Icon: FaFacebookF,    label: "Facebook",  color: "hover:text-[#1877f2] hover:border-[#1877f2]/30" },
    { url: settings?.youtubeUrl,   Icon: FaYoutube,      label: "YouTube",   color: "hover:text-[#ff0000] hover:border-[#ff0000]/30" },
    { url: settings?.telegramUrl,  Icon: FaTelegramPlane,label: "Telegram",  color: "hover:text-[#0088cc] hover:border-[#0088cc]/30" },
    { url: settings?.linkedinUrl,  Icon: FaLinkedinIn,   label: "LinkedIn",  color: "hover:text-[#0077b5] hover:border-[#0077b5]/30" },
  ].filter((s) => s.url);

  return (
    <footer className="bg-[var(--bg-card)] border-t pt-5 pb-5 border-[var(--border)]">

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand column ──────────────────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-primary/30 ring-2 ring-primary/10 transition-all duration-300 group-hover:border-primary/60">
                <Image src={logo} alt={name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-display font-extrabold text-white text-base leading-tight">{name}</p>
                <p className="text-[10px] text-primary leading-tight mt-0.5">{tagline}</p>
              </div>
            </Link>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>

            {/* Social icons */}
            {socials.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {socials.map(({ url, Icon, label, color }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] transition-all duration-200 ${color}`}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            )}

            {/* Enquire CTA */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-light transition-colors group w-fit"
            >
              Enquire Now
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* ── Quick Links ───────────────────────────────────── */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white mb-5">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Our Courses ───────────────────────────────────── */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white mb-5">
              Our Courses
            </h4>
            <ul className="flex flex-col gap-2.5">
              {COURSE_LINKS.map((label) => (
                <li key={label}>
                  <Link
                    href="/courses"
                    className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ──────────────────────────────────────── */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white mb-5">
              Get In Touch
            </h4>
            <div className="flex flex-col gap-3.5">
              {address && (
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)] leading-relaxed">{address}</span>
                </div>
              )}
              {hours && (
                <div className="flex items-start gap-2.5">
                  <Clock size={15} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">{hours}</span>
                </div>
              )}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] hover:text-primary transition-colors group"
                >
                  <Phone size={15} className="text-primary flex-shrink-0" />
                  <span className="group-hover:underline underline-offset-2">{phone}</span>
                </a>
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/91${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] hover:text-[#25d366] transition-colors group"
                >
                  <MessageCircle size={15} className="text-[#25d366] flex-shrink-0" />
                  <span className="group-hover:underline underline-offset-2">{whatsapp}</span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] hover:text-primary transition-colors group"
                >
                  <Mail size={15} className="text-primary flex-shrink-0" />
                  <span className="group-hover:underline underline-offset-2 break-all">{email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────── */}
      <div className="border-t border-[var(--border)] pt-5 mt-2">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-[var(--text-muted)]">{copyright}</p>
          <div className="flex items-center gap-4">
            <span className=" text-[var(--text-muted)]">Architected by <Link href="https://zaref.in" target="_blank" className="text-primary">Zaref Technology</Link></span>

          </div>
        </div>
      </div>
    </footer>
  );
}
