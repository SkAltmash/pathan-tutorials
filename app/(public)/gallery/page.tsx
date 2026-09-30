"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getGallery } from "@/lib/firebase/firestore";
import { GalleryImage, GalleryCategory } from "@/lib/types";

const CATEGORIES: (GalleryCategory | "All")[] = [
  "All", "Classes", "Events", "Results", "Achievements", "Activities",
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "All">("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    getGallery()
      .then(setImages)
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === "All" ? images : images.filter((g) => g.category === activeCategory);

  const prev = () => setLightbox((l) => (l !== null ? (l - 1 + filtered.length) % filtered.length : null));
  const next = () => setLightbox((l) => (l !== null ? (l + 1) % filtered.length : null));

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, filtered.length]);

  return (
    <div className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="py-12 sm:py-16 bg-[var(--bg-dark)] border-b border-[var(--border)]">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <span className="section-badge mb-4 inline-flex">
            <Images size={14} /> Gallery
          </span>
          <h1 className="section-title">
            Life at <span className="gradient-text">Pathan Tutorials</span>
          </h1>
          <p className="section-subtitle mt-4">
            A glimpse into our classes, events, achievements and student moments.
          </p>
          <div className="gold-divider mx-auto mt-6" />
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-5 bg-[var(--bg-card)] border-b border-[var(--border)]">
        <div className="container-custom flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === cat
                  ? "bg-primary text-black border-primary"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-primary/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding bg-[var(--bg-dark)]">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="skeleton aspect-square rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Images size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-30" />
              <h3 className="font-display font-bold text-white text-xl mb-2">
                {images.length === 0 ? "Gallery Coming Soon" : "No Images in This Category"}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">Photos will be added soon. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setLightbox(idx)}
                  className="relative aspect-square rounded-xl overflow-hidden group bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <Image
                    src={img.url}
                    alt={img.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-2">
                    <p className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-left">
                      {img.title}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="badge badge-yellow text-[10px]">{img.category}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 p-2 rounded-full hover:bg-white/10"
            onClick={() => setLightbox(null)}
          >
            <X size={24} />
          </button>
          <button
            className="absolute left-3 sm:left-6 text-white/70 hover:text-white transition-colors z-10 p-2 rounded-full hover:bg-white/10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft size={32} />
          </button>
          <div
            className="relative w-full max-w-4xl max-h-[85vh] aspect-square sm:aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightbox].url}
              alt={filtered[lightbox].title}
              fill
              className="object-contain"
            />
          </div>
          <button
            className="absolute right-3 sm:right-6 text-white/70 hover:text-white transition-colors z-10 p-2 rounded-full hover:bg-white/10"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight size={32} />
          </button>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-white font-semibold text-sm">{filtered[lightbox].title}</p>
            <p className="text-white/50 text-xs mt-1">{lightbox + 1} / {filtered.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
