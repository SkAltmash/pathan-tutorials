"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, Phone, MessageCircle,
  Home, Info, BookOpen, Award, Users, Image as ImageIcon,
  Megaphone, Mail,
} from "lucide-react";
import { NavigationSettings, SiteSettings } from "@/lib/types";

interface NavbarProps {
  nav: NavigationSettings | null;
  settings: SiteSettings | null;
}

const DEFAULT_MENU = [
  { id: "home",          label: "Home",          href: "/",             icon: Home },
  { id: "about",         label: "About",         href: "/about",        icon: Info },
  { id: "courses",       label: "Courses",       href: "/courses",      icon: BookOpen },
  { id: "results",       label: "Results",       href: "/results",      icon: Award },
  { id: "faculty",       label: "Faculty",       href: "/faculty",      icon: Users },
  { id: "gallery",       label: "Gallery",       href: "/gallery",      icon: ImageIcon },
  { id: "announcements", label: "Announcements", href: "/announcements",icon: Megaphone },
  { id: "contact",       label: "Contact",       href: "/contact",      icon: Mail },
];

const ICON_MAP: Record<string, React.ElementType> = {
  home: Home, about: Info, courses: BookOpen, results: Award,
  faculty: Users, gallery: ImageIcon, announcements: Megaphone, contact: Mail,
};

export default function Navbar({ nav, settings }: NavbarProps) {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const pathname                  = usePathname();

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const logo     = nav?.logo    || settings?.logo    || "/logo.jpg";
  const siteName = settings?.siteName || "Pathan Tutorials";
  const tagline  = settings?.tagline  || "Excellence in Mathematics";
  const ctaText  = nav?.ctaText || "Enquire Now";
  const ctaLink  = nav?.ctaLink || "/contact";
  const phone    = settings?.phone    || "";
  const whatsapp = settings?.whatsapp || "";

  const sanitizeHref = (href: string) =>
    href === "/home" || href === "#home" || href === "#" ? "/" : href;

  const menuItems =
    nav?.items && nav.items.length > 0
      ? nav.items
          .filter((i) => i.isActive)
          .sort((a, b) => a.order - b.order)
          .map((i) => ({
            ...i,
            href: sanitizeHref(i.href),
            icon: ICON_MAP[i.id] || Home,
          }))
      : DEFAULT_MENU.map((m, i) => ({ ...m, href: sanitizeHref(m.href), order: i + 1, isActive: true }));

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Fixed Header ──────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen ? "nav-blur shadow-lg shadow-black/20" : "bg-transparent"
        }`}
      >
        <div className="container-custom flex items-center justify-between h-16 lg:h-20">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group" aria-label="Home">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/40 ring-2 ring-primary/10 transition-all duration-300 group-hover:border-primary/80 group-hover:ring-primary/20">
              <Image src={logo} alt={siteName} fill className="object-cover" priority />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-extrabold text-white text-sm tracking-tight leading-none">
                {siteName}
              </span>
              <span className="text-[10px] text-primary font-medium leading-tight mt-0.5 hidden sm:block">
                {tagline}
              </span>
            </div>
          </Link>

          {/* ── Desktop Menu ─────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-primary/15 text-primary border border-primary/25"
                    : "text-[var(--text-secondary)] hover:text-white hover:bg-white/6"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTA ──────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-primary transition-colors"
              >
                <Phone size={14} />
                <span className="font-medium">{phone}</span>
              </a>
            )}
            <Link href={ctaLink} className="btn-primary btn-sm">
              {ctaText}
            </Link>
          </div>

          {/* ── Mobile Toggle ─────────────────────────────────────── */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/8 rounded-xl transition-all duration-200"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`absolute transition-all duration-200 ${menuOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}
            >
              <X size={22} />
            </span>
            <span
              className={`absolute transition-all duration-200 ${menuOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`}
            >
              <Menu size={22} />
            </span>
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer Overlay ────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          menuOpen ? "visible" : "invisible"
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[300px] max-w-[85vw] nav-blur border-l border-[var(--border)] flex flex-col transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--border)] flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/40">
                <Image src={logo} alt={siteName} fill className="object-cover" />
              </div>
              <span className="font-display font-bold text-white text-sm">{siteName}</span>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-white/8 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Mobile navigation">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ${
                    isActive(item.href)
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-[var(--text-secondary)] hover:text-white hover:bg-white/6"
                  }`}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <Icon size={17} className={isActive(item.href) ? "text-primary" : "text-[var(--text-muted)]"} />
                  {item.label}
                  {isActive(item.href) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Drawer footer — contact + CTA */}
          <div className="border-t border-[var(--border)] px-4 py-5 flex flex-col gap-3 flex-shrink-0">
            {/* Quick contact row */}
            <div className="flex gap-2">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-primary hover:border-primary/30 transition-all"
                >
                  <Phone size={15} />
                  <span className="font-medium">Call</span>
                </a>
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/91${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#25d366]/30 text-sm text-[#25d366] hover:bg-[#25d366]/10 transition-all"
                >
                  <MessageCircle size={15} />
                  <span className="font-medium">WhatsApp</span>
                </a>
              )}
            </div>
            {/* Enquire CTA */}
            <Link
              href={ctaLink}
              onClick={() => setMenuOpen(false)}
              className="btn-primary w-full justify-center text-sm"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
