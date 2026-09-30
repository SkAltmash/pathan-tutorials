"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { getAllGallery, addGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/lib/firebase/firestore";
import { GalleryImage, GalleryCategory, GalleryMediaType } from "@/lib/types";
import { Plus, Trash2, X, Save, Loader2, ToggleLeft, ToggleRight, Image as ImageIcon, PlayCircle, AtSign, Pencil } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const CATEGORIES: GalleryCategory[] = ["Classes", "Events", "Results", "Achievements", "Activities"];

const EMPTY: Omit<GalleryImage, "id"> = {
  url: "", title: "", category: "Classes", description: "", order: 0,
  isActive: true, storagePath: "", mediaType: "image", embedUrl: "", thumbnailUrl: "",
};

// Extract YouTube video ID from various URL formats
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function getYouTubeEmbed(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : "";
}
function getYouTubeThumbnail(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

// Get Instagram embed src from reel/post URL
function getInstaEmbed(url: string) {
  // normalise to just embed URL shown in iframe src
  const clean = url.replace(/\/$/, "");
  return clean + "/embed";
}

type ModalData = GalleryImage | Omit<GalleryImage, "id">;
type ModalState = { mode: "add" | "edit"; data: ModalData } | null;

export default function GalleryAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState<GalleryCategory | "All">("All");
  const [videoUrl, setVideoUrl] = useState(""); // raw URL user types for YT/Insta

  useEffect(() => { if (!loading && !user) router.push("/admin"); }, [user, loading, router]);

  const load = async () => {
    try { const data = await getAllGallery(); setImages(data); }
    catch { toast.error("Load failed"); } finally { setFetching(false); }
  };
  useEffect(() => { if (user) load(); }, [user]);

  const set = (field: keyof GalleryImage, val: unknown) =>
    setModal((m) => m ? { ...m, data: { ...m.data, [field]: val } } : null);

  const openAdd = () => {
    setModal({ mode: "add", data: { ...EMPTY, order: images.length + 1 } });
    setVideoUrl("");
  };

  const openEdit = (img: GalleryImage) => {
    setModal({ mode: "edit", data: { ...img } });
    setVideoUrl(img.url || "");
  };

  // When media type changes, reset URL fields
  const handleMediaTypeChange = (type: GalleryMediaType) => {
    set("mediaType", type);
    set("url", "");
    set("embedUrl", "");
    set("thumbnailUrl", "");
    setVideoUrl("");
  };

  // When video URL changes, auto-compute embed + thumbnail
  const handleVideoUrlChange = (raw: string) => {
    setVideoUrl(raw);
    const type = (modal?.data as GalleryImage)?.mediaType ?? "youtube";
    set("url", raw);
    if (type === "youtube") {
      set("embedUrl", getYouTubeEmbed(raw));
      set("thumbnailUrl", getYouTubeThumbnail(raw));
    } else {
      set("embedUrl", getInstaEmbed(raw));
    }
  };

  const handleSave = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.mode === "add") {
        await addGalleryImage(modal.data as Omit<GalleryImage, "id">);
        toast.success("Added!");
      } else {
        const { id, ...rest } = modal.data as GalleryImage;
        await updateGalleryImage(id, rest);
        toast.success("Updated!");
      }
      setModal(null); load();
    } catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try { await deleteGalleryImage(id); toast.success("Deleted"); load(); } catch { toast.error("Delete failed"); }
  };

  const handleToggle = async (img: GalleryImage) => {
    try { await updateGalleryImage(img.id, { isActive: !img.isActive }); load(); } catch { toast.error("Failed"); }
  };

  const filtered = filterCat === "All" ? images : images.filter((i) => i.category === filterCat);

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  const d = modal?.data as GalleryImage;
  const mediaType: GalleryMediaType = d?.mediaType ?? "image";

  // Thumbnail to show in grid for each item
  const getThumb = (img: GalleryImage) => {
    if (img.thumbnailUrl) return img.thumbnailUrl;
    if (img.mediaType === "youtube") return getYouTubeThumbnail(img.url);
    if (img.mediaType !== "instagram") return img.url;
    return "";
  };

  return (
    <AdminShell title="Gallery">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2 flex-wrap">
          {(["All", ...CATEGORIES] as (GalleryCategory | "All")[]).map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-600 border transition-all ${filterCat === cat ? "bg-primary text-black border-primary" : "border-[var(--border)] text-[var(--text-secondary)] hover:border-primary/30"}`}>
              {cat}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm">
          <Plus size={16} /> Add Media
        </button>
      </div>

      {/* Grid */}
      {fetching ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">
          <ImageIcon size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No media yet. Add photos, videos or reels!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((img) => {
            const thumb = getThumb(img);
            const type = img.mediaType ?? "image";
            return (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-[var(--border)] aspect-square bg-[var(--bg-surface)]">
                {/* Thumbnail */}
                {thumb ? (
                  <Image src={thumb} alt={img.title} fill className="object-cover" />
                ) : type === "instagram" ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]">
                    <AtSign size={28} className="text-white" />
                    <span className="text-white text-[10px] font-600">Reel</span>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]"><ImageIcon size={24} /></div>
                )}

                {/* Media type badge */}
                <div className="absolute top-2 left-2">
                  {type === "youtube" && <span className="badge bg-red-600 text-white text-[9px]">YT</span>}
                  {type === "instagram" && <span className="badge bg-gradient-to-r from-[#e6683c] to-[#dc2743] text-white text-[9px]">Reel</span>}
                </div>

                {!img.isActive && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="badge badge-red text-[10px]">Hidden</span></div>}

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => openEdit(img)} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-black hover:bg-primary-light transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleToggle(img)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    {img.isActive ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                  </button>
                  <button onClick={() => handleDelete(img.id)} className="w-9 h-9 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-xs font-600 truncate">{img.title}</p>
                  <span className="badge badge-yellow text-[9px]">{img.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92dvh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] flex-shrink-0">
              <h3 className="font-700 text-white text-base">{modal.mode === "add" ? "Add Media" : "Edit Media"}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/8 transition-colors"><X size={18} /></button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-5 space-y-5">

              {/* Media Type Selector */}
              <div>
                <label className="form-label mb-2">Media Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { type: "image" as GalleryMediaType, label: "Photo", Icon: ImageIcon, color: "text-primary" },
                    { type: "youtube" as GalleryMediaType, label: "YouTube", Icon: Youtube, color: "text-red-500" },
                    { type: "instagram" as GalleryMediaType, label: "Reel", Icon: Instagram, color: "text-pink-500" },
                  ]).map(({ type, label, Icon, color }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleMediaTypeChange(type)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                        mediaType === type
                          ? "border-primary bg-primary/10"
                          : "border-[var(--border)] hover:border-primary/30 bg-[var(--bg-surface)]"
                      }`}
                    >
                      <Icon size={22} className={mediaType === type ? "text-primary" : color} />
                      <span className={`text-xs font-600 ${mediaType === type ? "text-primary" : "text-[var(--text-secondary)]"}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Media input based on type */}
              {mediaType === "image" && (
                <ImageUpload
                  label="Upload Photo"
                  folder="gallery"
                  value={d?.url || ""}
                  onChange={(url) => set("url", url)}
                  aspectRatio="square"
                />
              )}

              {mediaType === "youtube" && (
                <div className="space-y-3">
                  <div>
                    <label className="form-label">YouTube URL</label>
                    <input
                      className="form-input"
                      value={videoUrl}
                      onChange={(e) => handleVideoUrlChange(e.target.value)}
                      placeholder="https://youtu.be/... or https://youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-1">Paste any YouTube link — embed URL is auto-generated.</p>
                  </div>
                  {d?.thumbnailUrl && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--border)]">
                      <Image src={d.thumbnailUrl} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                          <PlayCircle size={22} className="text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {mediaType === "instagram" && (
                <div className="space-y-3">
                  <div>
                    <label className="form-label">Instagram Reel URL</label>
                    <input
                      className="form-input"
                      value={videoUrl}
                      onChange={(e) => handleVideoUrlChange(e.target.value)}
                      placeholder="https://www.instagram.com/reel/..."
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-1">Paste the full Instagram reel or post URL.</p>
                  </div>
                  {/* Custom thumbnail upload for Instagram */}
                  <ImageUpload
                    label="Cover Thumbnail (optional)"
                    folder="gallery"
                    value={d?.thumbnailUrl || ""}
                    onChange={(url) => set("thumbnailUrl", url)}
                    aspectRatio="square"
                  />
                </div>
              )}

              {/* Common fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="form-label">Title</label>
                  <input className="form-input" value={d?.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="Caption for this media" />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-select" value={d?.category ?? "Classes"} onChange={(e) => set("category", e.target.value as GalleryCategory)}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Display Order</label>
                  <input className="form-input" type="number" value={d?.order ?? 0} onChange={(e) => set("order", parseInt(e.target.value))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Description (optional)</label>
                  <textarea className="form-textarea" rows={2} value={d?.description || ""} onChange={(e) => set("description", e.target.value)} />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input type="checkbox" checked={d?.isActive ?? true} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-sm text-[var(--text-secondary)]">Visible on website</span>
              </label>
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--border)] px-5 py-4 flex gap-3 justify-end flex-shrink-0">
              <button onClick={() => setModal(null)} className="btn-outline btn-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm">
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
