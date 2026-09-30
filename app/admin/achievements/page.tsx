"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { getAllAchievements, addAchievement, updateAchievement, deleteAchievement } from "@/lib/firebase/firestore";
import { Achievement } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Save, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY: Omit<Achievement, "id"> = {
  title: "", description: "", image: "", date: "", category: "", link: "",
  isActive: true, order: 0,
};

export default function AchievementsAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Achievement[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; data: Achievement | Omit<Achievement, "id"> } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/admin"); }, [user, loading, router]);
  const load = async () => { try { setItems(await getAllAchievements()); } catch { toast.error("Load failed"); } finally { setFetching(false); } };
  useEffect(() => { if (user) load(); }, [user]);

  const set = (field: keyof Achievement, val: unknown) =>
    setModal((m) => m ? { ...m, data: { ...m.data, [field]: val } } : null);

  const handleSave = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.mode === "add") { await addAchievement(modal.data as Omit<Achievement, "id">); toast.success("Added!"); }
      else { const { id, ...rest } = modal.data as Achievement; await updateAchievement(id, rest); toast.success("Updated!"); }
      setModal(null); load();
    } catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await deleteAchievement(id); toast.success("Deleted"); load(); } catch { toast.error("Delete failed"); }
  };

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  return (
    <AdminShell title="Achievements">
      <div className="flex justify-end mb-5">
        <button onClick={() => setModal({ mode: "add", data: { ...EMPTY, order: items.length + 1 } })} className="btn-primary btn-sm">
          <Plus size={16} /> Add Achievement
        </button>
      </div>

      <div className="admin-card overflow-x-auto">
        {fetching ? <div className="space-y-3 p-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 rounded" />)}</div>
          : items.length === 0 ? <div className="text-center py-12 text-[var(--text-muted)]">No achievements yet</div>
          : (
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="font-600 text-white">{item.title}</td>
                    <td>{item.category}</td>
                    <td className="text-[var(--text-secondary)]">{item.date}</td>
                    <td>
                      <button onClick={() => { updateAchievement(item.id, { isActive: !item.isActive }).then(load); }}>
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
            </table>
          )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h3 className="font-700 text-white">{modal.mode === "add" ? "Add Achievement" : "Edit Achievement"}</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-[var(--text-muted)]" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="form-label">Title</label><input className="form-input" value={(modal.data as Achievement).title || ""} onChange={(e) => set("title", e.target.value)} /></div>
              <div><label className="form-label">Description</label><textarea className="form-textarea" rows={3} value={(modal.data as Achievement).description || ""} onChange={(e) => set("description", e.target.value)} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="form-label">Category</label><input className="form-input" value={(modal.data as Achievement).category || ""} onChange={(e) => set("category", e.target.value)} /></div>
                <div><label className="form-label">Date</label><input className="form-input" value={(modal.data as Achievement).date || ""} onChange={(e) => set("date", e.target.value)} /></div>
                <div><label className="form-label">Link (optional)</label><input className="form-input" value={(modal.data as Achievement).link || ""} onChange={(e) => set("link", e.target.value)} /></div>
                <div><label className="form-label">Order</label><input className="form-input" type="number" value={(modal.data as Achievement).order || 0} onChange={(e) => set("order", parseInt(e.target.value))} /></div>
              </div>
              <ImageUpload label="Achievement Image" folder="achievements" value={(modal.data as Achievement).image || ""} onChange={(url) => set("image", url)} aspectRatio="wide" />
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={(modal.data as Achievement).isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 accent-primary" />
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
