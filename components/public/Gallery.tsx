"use client";
import { useState } from "react";
import Image from "next/image";
import { Images, X, ChevronLeft, ChevronRight, Play, AtSign } from "lucide-react";
import { GalleryImage, GalleryCategory } from "@/lib/types";

const CATEGORIES: (GalleryCategory | "All")[] = ["All", "Classes", "Events", "Results", "Achievements", "Activities"];

export default function Gallery({ gallery }: { gallery: GalleryImage[] }) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "All">("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? gallery
    : gallery.filter((g) => g.category === activeCategory);

  const prev = () => setLightbox((l) => (l !== null ? (l - 1 + filtered.length) % filtered.length : null));
  const next = () => setLightbox((l) => (l !== null ? (l + 1) % filtered.length : null));

  if (gallery.length === 0) return null;

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
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-muted)]">No media in this category yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((item, idx) => {
              const type = item.mediaType ?? "image";
              const thumb = item.thumbnailUrl || (type === "image" ? item.url : "");

              return (
                <button
                  key={item.id}
                  onClick={() => setLightbox(idx)}
                  className="relative aspect-square rounded-xl overflow-hidden group bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-all"
                >
                  {/* Thumbnail */}
                  {thumb ? (
                    <Image src={thumb} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : type === "instagram" ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]">
                      <AtSign size={32} className="text-white mb-1" />
                      <span className="text-white text-xs font-600">Reel</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-surface)]">
                      <Images size={28} className="text-[var(--text-muted)]" />
                    </div>
                  )}

                  {/* Play overlay for video types */}
                  {(type === "youtube" || type === "instagram") && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                        type === "youtube" ? "bg-red-600" : "bg-gradient-to-br from-[#e6683c] to-[#dc2743]"
                      }`}>
                        <Play size={18} className="text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-600 truncate">{item.title}</p>
                    <span className="badge badge-yellow text-[9px]">{item.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (() => {
        const item = filtered[lightbox];
        const type = item.mediaType ?? "image";

        return (
          <div
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            {/* Controls */}
            <button className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20" onClick={() => setLightbox(null)}>
              <X size={22} />
            </button>
            <button className="absolute left-3 sm:left-6 text-white/70 hover:text-white transition-colors z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20" onClick={(e) => { e.stopPropagation(); prev(); }}>
              <ChevronLeft size={22} />
            </button>
            <button className="absolute right-3 sm:right-6 text-white/70 hover:text-white transition-colors z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20" onClick={(e) => { e.stopPropagation(); next(); }}>
              <ChevronRight size={22} />
            </button>

            {/* Media */}
            <div
              className="relative w-full max-w-3xl px-14 sm:px-20"
              onClick={(e) => e.stopPropagation()}
            >
              {type === "image" && (
                <div className="relative aspect-video w-full">
                  <Image src={item.url} alt={item.title} fill className="object-contain rounded-xl" />
                </div>
              )}

              {type === "youtube" && item.embedUrl && (
                <div className="aspect-video w-full rounded-xl overflow-hidden">
                  <iframe
                    src={`${item.embedUrl}?autoplay=1&rel=0`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {type === "instagram" && item.embedUrl && (
                <div className="w-full max-w-sm mx-auto rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "9/16", maxHeight: "70dvh" }}>
                  <iframe
                    src={item.embedUrl}
                    className="w-full h-full"
                    scrolling="no"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Caption */}
              <div className="text-center mt-4">
                <p className="text-white font-600">{item.title}</p>
                <p className="text-white/50 text-sm mt-0.5">{lightbox + 1} / {filtered.length}</p>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
