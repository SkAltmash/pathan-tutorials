// ============================================================
// PATHAN TUTORIALS — Complete TypeScript Types
// ============================================================

// ── Settings ─────────────────────────────────────────────────
export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  logo: string; // URL
  sir: string;
  favicon: string; // URL
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  telegramUrl: string;
  linkedinUrl: string;
  openingHours: string;
  footerDescription: string;
  footerCopyright: string;
  updatedAt?: string;
}

// ── SEO ────────────────────────────────────────────────────────
export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;

  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robots: string;
  updatedAt?: string;
}

// ── Hero Section ───────────────────────────────────────────────
export interface HeroSettings {
  heading: string;
  subheading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondCtaText: string;
  secondCtaLink: string;
  heroImage: string;
  backgroundImage: string;
  badgeText: string;
  isActive: boolean;
  updatedAt?: string;
}

// ── Statistic ──────────────────────────────────────────────────
export interface Statistic {
  id: string;
  number: string;
  title: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ── Course ─────────────────────────────────────────────────────
export interface Course {
  id: string;
  name: string;
  class: string;
  board: string;
  subject: string;
  description: string;
  duration: string;
  fees: string;
  image: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

// ── Result ─────────────────────────────────────────────────────
export interface StudentResult {
  id: string;
  studentName: string;
  class: string;
  exam: string;
  year: string;
  percentage: string;
  marks: string;
  rank: string;
  studentPhoto: string;
  resultImage: string;
  achievementDescription: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ── Achievement ────────────────────────────────────────────────
export interface Achievement {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  link: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

// ── Gallery ────────────────────────────────────────────────────
export type GalleryCategory =
  | "Classes"
  | "Events"
  | "Results"
  | "Achievements"
  | "Activities";

export type GalleryMediaType = "image" | "youtube" | "instagram";

export interface GalleryImage {
  id: string;
  url: string;           // image URL (image) or original reel/video URL
  title: string;
  category: GalleryCategory;
  description: string;
  order: number;
  isActive: boolean;
  storagePath: string;
  mediaType?: GalleryMediaType;  // defaults to "image"
  embedUrl?: string;             // YouTube embed URL
  thumbnailUrl?: string;         // custom thumbnail for video/reel
  createdAt?: string;
  updatedAt?: string;
}

// ── Testimonial ────────────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  testimonial: string;
  class: string;
  rating: number;
  date: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ── Faculty ────────────────────────────────────────────────────
export interface Faculty {
  id: string;
  name: string;
  profileImage: string;
  subject: string;
  qualification: string;
  experience: string;
  bio: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ── Announcement ───────────────────────────────────────────────
export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ── Enquiry ────────────────────────────────────────────────────
export type EnquiryStatus =
  | "New"
  | "Contacted"
  | "Follow-up"
  | "Converted"
  | "Closed";

export interface Enquiry {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  whatsapp: string;
  email: string;
  class: string;
  board: string;
  course: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt?: string;
}

// ── Navigation ─────────────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
}

export interface NavigationSettings {
  logo: string;
  items: NavItem[];
  ctaText: string;
  ctaLink: string;
  updatedAt?: string;
}

// ── Section Visibility ─────────────────────────────────────────
export interface SectionVisibility {
  hero: boolean;
  stats: boolean;
  about: boolean;
  courses: boolean;
  whyUs: boolean;
  results: boolean;
  achievements: boolean;
  faculty: boolean;
  testimonials: boolean;
  gallery: boolean;
  announcements: boolean;
  contact: boolean;
  updatedAt?: string;
}

// ── Floating Button ────────────────────────────────────────────
export interface FloatingButton {
  type: "whatsapp" | "call" | "instagram";
  label: string;
  link: string;
  isActive: boolean;
}

export interface FloatingButtonsSettings {
  whatsapp: FloatingButton;
  call: FloatingButton;
  instagram: FloatingButton;
  updatedAt?: string;
}

// ── Why Us (About) Feature ─────────────────────────────────────
export interface WhyUsFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

// ── Firestore Collection Names ─────────────────────────────────
export const COLLECTIONS = {
  SETTINGS: "settings",
  COURSES: "courses",
  STATISTICS: "statistics",
  RESULTS: "results",
  ACHIEVEMENTS: "achievements",
  GALLERY: "gallery",
  TESTIMONIALS: "testimonials",
  FACULTY: "faculty",
  ANNOUNCEMENTS: "announcements",
  ENQUIRIES: "enquiries",
  NAVIGATION: "navigation",
  SEO: "seo",
  WHY_US: "whyUs",
} as const;

// ── Firestore Document IDs for singleton docs ──────────────────
export const DOC_IDS = {
  SITE: "site",
  HERO: "hero",
  SEO: "seo",
  NAVIGATION: "navigation",
  SECTIONS: "sections",
  FLOATING_BUTTONS: "floatingButtons",
  WHY_US: "whyUs",
} as const;
