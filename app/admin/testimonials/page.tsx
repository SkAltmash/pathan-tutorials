"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { getAllTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/firebase/firestore";
import { Testimonial } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Save, Loader2, Star, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY: Omit<Testimonial, "id"> = {
  name: "", photo: "", testimonial: "", class: "", rating: 5,
  date: new Date().getFullYear().toString(), isActive: true,
};

export default function TestimonialsAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; data: Testimonial | Omit<Testimonial, "id"> } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/admin"); }, [user, loading, router]);
  const load = async () => { try { setItems(await getAllTestimonials()); } catch { toast.error("Load failed"); } finally { setFetching(false); } };
  useEffect(() => { if (user) load(); }, [user]);

  const set = (field: keyof Testimonial, val: unknown) =>
    setModal((m) => m ? { ...m, data: { ...m.data, [field]: val } } : null);

  const handleSave = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.mode === "add") { await addTestimonial(modal.data as Omit<Testimonial, "id">); toast.success("Added!"); }
      else { const { id, ...rest } = modal.data as Testimonial; await updateTestimonial(id, rest); toast.success("Updated!"); }
      setModal(null); load();
    } catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await deleteTestimonial(id); toast.success("Deleted"); load(); } catch { toast.error("Delete failed"); }
  };

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  return (
    <AdminShell title="Testimonials">
      <div className="flex justify-end mb-5">
        <button onClick={() => setModal({ mode: "add", data: { ...EMPTY } })} className="btn-primary btn-sm">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <div className="admin-card">
        {fetching ? <div className="space-y-3 p-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 rounded" />)}</div>
          : items.length === 0 ? <div className="text-center py-12 text-[var(--text-muted)]">No testimonials yet</div>
          : (
            <div className="table-scroll"><table className="admin-table">
              <thead><tr><th>Name</th><th>Class</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="font-600 text-white">{item.name}</td>
                    <td>{item.class}</td>
                    <td><div className="flex gap-0.5">{[...Array(item.rating)].map((_, i) => <Star key={i} size={12} className="star-filled" />)}</div></td>
                    <td>
                      <button onClick={() => { updateTestimonial(item.id, { isActive: !item.isActive }).then(load); }}>
                        {item.isActive ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} className="text-[var(--text-muted)]" />}
                      </button>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => setModal({ mode: "edit", data: { ...item } })} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h3 className="font-700 text-white">{modal.mode === "add" ? "Add Testimonial" : "Edit Testimonial"}</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-[var(--text-muted)]" /></button>
            </div>
            <div className="p-5 space-y-4">
              <ImageUpload label="Photo (optional)" folder="testimonials" value={(modal.data as Testimonial).photo || ""} onChange={(url) => set("photo", url)} aspectRatio="square" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="form-label">Name</label><input className="form-input" value={(modal.data as Testimonial).name || ""} onChange={(e) => set("name", e.target.value)} /></div>
                <div><label className="form-label">Class / Role</label><input className="form-input" value={(modal.data as Testimonial).class || ""} onChange={(e) => set("class", e.target.value)} placeholder="10th CBSE / Parent" /></div>
                <div>
                  <label className="form-label">Rating</label>
                  <select className="form-select" value={(modal.data as Testimonial).rating} onChange={(e) => set("rating", parseInt(e.target.value))}>
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div><label className="form-label">Year</label><input className="form-input" value={(modal.data as Testimonial).date || ""} onChange={(e) => set("date", e.target.value)} /></div>
              </div>
              <div><label className="form-label">Testimonial</label><textarea className="form-textarea" rows={4} value={(modal.data as Testimonial).testimonial || ""} onChange={(e) => set("testimonial", e.target.value)} /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={(modal.data as Testimonial).isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-sm text-[var(--text-secondary)]">Active</span>
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
