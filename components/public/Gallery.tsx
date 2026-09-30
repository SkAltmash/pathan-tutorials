"use client";
import { useState } from "react";
import Image from "next/image";
import { Images, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { GalleryImage, GalleryCategory } from "@/lib/types";

const CATEGORIES: (GalleryCategory | "All")[] = ["All", "Classes", "Events", "Results", "Achievements", "Activities"];

// Extract YouTube video ID from any YouTube URL format
function ytId(url: string): string | null {
  const m = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?\n#]+)/);
  return m ? m[1] : null;
}

function getThumb(item: GalleryImage): string {
  if (item.thumbnailUrl) return item.thumbnailUrl;
  const type = item.mediaType ?? "image";
  if (type === "youtube") {
    const id = ytId(item.embedUrl || item.url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
  }
  if (type === "image") return item.url;
  return ""; // instagram — no thumbnail stored, show branded card
}

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
              const thumb = getThumb(item);

              return (
                <button
                  key={item.id}
                  onClick={() => setLightbox(idx)}
                  className="relative aspect-square rounded-xl overflow-hidden group bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-all"
                >
                  {/* Thumbnail */}
                  {thumb ? (
                    <Image src={thumb} alt={item.title} fill sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : type === "instagram" ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]">
                      <FaInstagram size={32} className="text-white mb-1" />
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
                        {type === "youtube"
                          ? <FaYoutube size={22} className="text-white" />
                          : <FaInstagram size={20} className="text-white" />
                        }
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
                  <Image src={item.url} alt={item.title} fill sizes="90vw" className="object-contain rounded-xl" />
                </div>
              )}

              {type === "youtube" && (() => {
                // Compute embed URL from stored embedUrl or raw url
                const id = ytId(item.embedUrl || item.url);
                const embedSrc = id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
                return embedSrc ? (
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
                    <iframe
                      src={embedSrc}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : null;
              })()}

              {type === "instagram" && (
                <div className="w-full max-w-xs mx-auto" onClick={(e) => e.stopPropagation()}>
                  {/* Instagram blocks cross-origin iframes — show preview card instead */}
                  <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] to-[#cc2366]">
                    {/* Thumbnail if available */}
                    {item.thumbnailUrl ? (
                      <div className="relative aspect-[9/16] w-full" style={{ maxHeight: "55dvh" }}>
                        <Image src={item.thumbnailUrl!} alt={item.title} fill sizes="320px" className="object-cover" />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4 py-20 px-8">
                        <FaInstagram size={56} className="text-white drop-shadow-lg" />
                        <p className="text-white font-700 text-lg text-center">{item.title}</p>
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center">
                        <FaInstagram size={28} className="text-white" />
                      </div>
                    </div>
                    {/* Bottom label */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-600 text-sm truncate">{item.title}</p>
                      <p className="text-white/60 text-xs mt-0.5">Instagram Reel</p>
                    </div>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-600 text-white text-sm transition-all"
                    style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366)" }}
                  >
                    <FaInstagram size={16} />
                    Watch Reel on Instagram
                  </a>
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
