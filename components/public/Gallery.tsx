"use client";
import { useState } from "react";
import Image from "next/image";
import { Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryImage, GalleryCategory } from "@/lib/types";

const DEFAULT_GALLERY: GalleryImage[] = [
  { id: "1", url: "/logo.jpg", title: "Teaching in Progress", category: "Classes", description: "", order: 1, isActive: true, storagePath: "" },
  { id: "2", url: "/logo.jpg", title: "Result Celebration", category: "Results", description: "", order: 2, isActive: true, storagePath: "" },
  { id: "3", url: "/logo.jpg", title: "Annual Function", category: "Events", description: "", order: 3, isActive: true, storagePath: "" },
  { id: "4", url: "/logo.jpg", title: "Student Achievement", category: "Achievements", description: "", order: 4, isActive: true, storagePath: "" },
  { id: "5", url: "/logo.jpg", title: "Science Activity", category: "Activities", description: "", order: 5, isActive: true, storagePath: "" },
  { id: "6", url: "/logo.jpg", title: "Batch Photo", category: "Classes", description: "", order: 6, isActive: true, storagePath: "" },
];

const CATEGORIES: (GalleryCategory | "All")[] = ["All", "Classes", "Events", "Results", "Achievements", "Activities"];

export default function Gallery({ gallery }: { gallery: GalleryImage[] }) {
  const items = gallery.length > 0 ? gallery : DEFAULT_GALLERY;
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "All">("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeCategory === "All" ? items : items.filter((g) => g.category === activeCategory);

  const prev = () => setLightbox((l) => (l !== null ? (l - 1 + filtered.length) % filtered.length : null));
  const next = () => setLightbox((l) => (l !== null ? (l + 1) % filtered.length : null));

  return (
    <section id="gallery" className="section-padding bg-[var(--bg-dark)]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <span className="section-badge">
            <Images size={14} />
            Gallery
          </span>
          <h2 className="section-title">
            Life at <span className="gradient-text">Pathan Tutorials</span>
          </h2>
          <p className="section-subtitle">A glimpse into our classes, events, achievements and activities.</p>
          <div className="gold-divider" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-600 border transition-all ${
                activeCategory === cat
                  ? "bg-primary text-black border-primary"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-primary/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setLightbox(idx)}
              className="relative aspect-square rounded-xl overflow-hidden group bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-all"
            >
              <Image src={img.url} alt={img.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-3">
                <p className="text-white text-xs font-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.title}
                </p>
              </div>
              <div className="absolute top-2 right-2">
                <span className="badge badge-yellow text-[10px]">{img.category}</span>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--text-muted)]">No images in this category yet.</div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10" onClick={() => setLightbox(null)}>
            <X size={28} />
          </button>
          <button className="absolute left-4 text-white/70 hover:text-white transition-colors z-10" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft size={36} />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image src={filtered[lightbox].url} alt={filtered[lightbox].title} fill className="object-contain" />
          </div>
          <button className="absolute right-4 text-white/70 hover:text-white transition-colors z-10" onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight size={36} />
          </button>
          <div className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-sm">
            {filtered[lightbox].title} — {lightbox + 1}/{filtered.length}
          </div>
        </div>
      )}
    </section>
  );
}
