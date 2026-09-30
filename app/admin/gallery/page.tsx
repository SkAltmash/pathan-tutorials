"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { getAllGallery, addGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/lib/firebase/firestore";
import { GalleryImage, GalleryCategory } from "@/lib/types";
import { Plus, Trash2, X, Save, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const CATEGORIES: GalleryCategory[] = ["Classes", "Events", "Results", "Achievements", "Activities"];

const EMPTY: Omit<GalleryImage, "id"> = {
  url: "", title: "", category: "Classes", description: "", order: 0, isActive: true, storagePath: "",
};

export default function GalleryAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; data: GalleryImage | Omit<GalleryImage, "id"> } | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState<GalleryCategory | "All">("All");

  useEffect(() => { if (!loading && !user) router.push("/admin"); }, [user, loading, router]);

  const load = async () => {
    try { const data = await getAllGallery(); setImages(data); } catch { toast.error("Load failed"); } finally { setFetching(false); }
  };

  useEffect(() => { if (user) load(); }, [user]);

  const set = (field: keyof GalleryImage, val: unknown) =>
    setModal((m) => m ? { ...m, data: { ...m.data, [field]: val } } : null);

  const handleSave = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.mode === "add") {
        await addGalleryImage(modal.data as Omit<GalleryImage, "id">);
        toast.success("Image added!");
      } else {
        const { id, ...rest } = modal.data as GalleryImage;
        await updateGalleryImage(id, rest);
        toast.success("Updated!");
      }
      setModal(null);
      load();
    } catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try { await deleteGalleryImage(id); toast.success("Deleted"); load(); } catch { toast.error("Delete failed"); }
  };

  const handleToggle = async (img: GalleryImage) => {
    try { await updateGalleryImage(img.id, { isActive: !img.isActive }); load(); } catch { toast.error("Update failed"); }
  };

  const filtered = filterCat === "All" ? images : images.filter((i) => i.category === filterCat);

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  return (
    <AdminShell title="Gallery">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2 flex-wrap">
          {(["All", ...CATEGORIES] as (GalleryCategory | "All")[]).map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-600 border transition-all ${filterCat === cat ? "bg-primary text-black border-primary" : "border-[var(--border)] text-[var(--text-secondary)] hover:border-primary/30"}`}>
              {cat}
            </button>
          ))}
        </div>
        <button onClick={() => setModal({ mode: "add", data: { ...EMPTY, order: images.length + 1 } })} className="btn-primary btn-sm">
          <Plus size={16} /> Add Image
        </button>
      </div>

      {fetching ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">No images. Add some!</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border border-[var(--border)] aspect-square bg-[var(--bg-surface)]">
              {img.url ? (
                <Image src={img.url} alt={img.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)] text-xs">No image</div>
              )}
              {!img.isActive && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="badge badge-red text-[10px]">Hidden</span></div>}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => { setModal({ mode: "edit", data: { ...img } }); }} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black">
                  <Save size={14} />
                </button>
                <button onClick={() => handleToggle(img)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                  {img.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                </button>
                <button onClick={() => handleDelete(img.id)} className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-xs font-600 truncate">{img.title}</p>
                <span className="badge badge-yellow text-[9px]">{img.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h3 className="font-700 text-white">{modal.mode === "add" ? "Add Image" : "Edit Image"}</h3>
              <button onClick={() => setModal(null)} className="text-[var(--text-muted)] hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <ImageUpload label="Image" folder="gallery" value={(modal.data as GalleryImage).url || ""} onChange={(url) => set("url", url)} aspectRatio="square" />
              <div>
                <label className="form-label">Title</label>
                <input className="form-input" value={(modal.data as GalleryImage).title || ""} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select className="form-select" value={(modal.data as GalleryImage).category} onChange={(e) => set("category", e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={2} value={(modal.data as GalleryImage).description || ""} onChange={(e) => set("description", e.target.value)} />
              </div>
              <div>
                <label className="form-label">Display Order</label>
                <input className="form-input" type="number" value={(modal.data as GalleryImage).order || 0} onChange={(e) => set("order", parseInt(e.target.value))} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="img-active" checked={(modal.data as GalleryImage).isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 accent-primary" />
                <label htmlFor="img-active" className="text-sm text-[var(--text-secondary)]">Visible on website</label>
              </div>
            </div>
            <div className="p-5 border-t border-[var(--border)] flex justify-end gap-3">
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
