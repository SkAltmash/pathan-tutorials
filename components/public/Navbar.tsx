"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { NavigationSettings, SiteSettings } from "@/lib/types";

interface NavbarProps {
  nav: NavigationSettings | null;
  settings: SiteSettings | null;
}

const DEFAULT_MENU = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/about" },
  { id: "courses", label: "Courses", href: "/courses" },
  { id: "results", label: "Results", href: "/results" },
  { id: "faculty", label: "Faculty", href: "/faculty" },
  { id: "gallery", label: "Gallery", href: "/gallery" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function Navbar({ nav, settings }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const logo = nav?.logo || settings?.logo || "/logo.jpg";
  const siteName = settings?.siteName || "Pathan Tutorials";
  const tagline = settings?.tagline || "Excellence in Mathematics";
  const ctaText = nav?.ctaText || "Enquire Now";
  const ctaLink = nav?.ctaLink || "/contact";

  // Use Firestore nav items if available, else defaults
  // Sanitize href: /home → / (old Firestore data fix)
  const sanitizeHref = (href: string) =>
    href === "/home" || href === "#home" || href === "#" ? "/" : href;

  const menuItems =
    nav?.items && nav.items.length > 0
      ? nav.items
          .filter((i) => i.isActive)
          .sort((a, b) => a.order - b.order)
          .map((i) => ({ ...i, href: sanitizeHref(i.href) }))
      : DEFAULT_MENU.map((m, i) => ({
          id: m.id,
          label: m.label,
          href: sanitizeHref(m.href),
          order: i + 1,
          isActive: true,
        }));


  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? "nav-blur" : "bg-transparent"
      }`}
    >
      <div className="container-custom flex items-center justify-between h-16 lg:h-20">
        {/* ── Logo ────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-primary/40 ring-2 ring-primary/10 transition-all group-hover:border-primary/70">
            <Image src={logo} alt={siteName} fill className="object-cover" priority />
          </div>
          <div className="hidden sm:block">
            <p className="font-display font-extrabold text-white text-sm leading-tight tracking-tight">
              {siteName}
            </p>
            <p className="text-[10px] text-primary font-medium leading-tight">{tagline}</p>
          </div>
        </Link>

        {/* ── Desktop Menu ─────────────────────────────────────── */}
        <nav className="hidden lg:flex items-center gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-[var(--text-secondary)] hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop CTA ──────────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-4">
          {settings?.phone && (
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-primary transition-colors"
            >
              <Phone size={14} />
              <span className="font-medium">{settings.phone}</span>
            </a>
          )}
          <Link href={ctaLink} className="btn-primary btn-sm">
            {ctaText}
          </Link>
        </div>

        {/* ── Mobile Toggle ─────────────────────────────────────── */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[600px] border-t border-[var(--border)]" : "max-h-0"
        }`}
      >
        <div className="container-custom py-4 flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-[var(--text-secondary)] hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile contact info */}
          {settings?.phone && (
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--text-secondary)] hover:text-primary transition-colors"
            >
              <Phone size={15} />
              {settings.phone}
            </a>
          )}

          <div className="pt-3 border-t border-[var(--border)] mt-2">
            <Link href={ctaLink} className="btn-primary w-full justify-center">
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
