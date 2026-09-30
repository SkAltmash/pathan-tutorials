"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { getAllAchievements, addAchievement, updateAchievement, deleteAchievement } from "@/lib/firebase/firestore";
import { Achievement } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Save, Loader2, Trophy, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY: Omit<Achievement, "id"> = {
  title: "", description: "", image: "", date: "", category: "", link: "",
  isActive: true, order: 0,
};

type ModalState = { mode: "add" | "edit"; data: Achievement | Omit<Achievement, "id"> } | null;

export default function AchievementsAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Achievement[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
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

  const d = modal?.data as Achievement;

  return (
    <AdminShell title="Achievements">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[var(--text-secondary)]">{items.length} achievement(s)</p>
        <button onClick={() => setModal({ mode: "add", data: { ...EMPTY, order: items.length + 1 } })} className="btn-primary btn-sm">
          <Plus size={16} /> Add Achievement
        </button>
      </div>

      <div className="admin-card">
        {fetching ? (
          <div className="space-y-3 p-2">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-[var(--text-muted)]">
            <Trophy size={36} className="opacity-30" />
            <p className="text-sm">No achievements yet. Add your first!</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block table-scroll">
              <table className="admin-table">
                <thead>
                  <tr><th>Title</th><th>Category</th><th>Date</th><th>Active</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="font-600 text-white">{item.title}</td>
                      <td>
                        {item.category && <span className="badge badge-blue">{item.category}</span>}
                      </td>
                      <td className="text-[var(--text-secondary)]">{item.date}</td>
                      <td>
                        <button onClick={() => updateAchievement(item.id, { isActive: !item.isActive }).then(load)}>
                          {item.isActive ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-[var(--text-muted)]" />}
                        </button>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => setModal({ mode: "edit", data: { ...item } })} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col divide-y divide-[var(--border)]">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 px-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Trophy size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-600 text-white text-sm truncate">{item.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.category}{item.category && item.date ? " · " : ""}{item.date}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => updateAchievement(item.id, { isActive: !item.isActive }).then(load)}>
                      {item.isActive ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} className="text-[var(--text-muted)]" />}
                    </button>
                    <button onClick={() => setModal({ mode: "edit", data: { ...item } })} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"><Pencil size={13} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl max-h-[92dvh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] flex-shrink-0">
              <h3 className="font-700 text-white text-base">{modal.mode === "add" ? "Add Achievement" : "Edit Achievement"}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/8 transition-colors"><X size={18} /></button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <div><label className="form-label">Title</label><input className="form-input" value={d?.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="Best Performer 2024" /></div>
              <div><label className="form-label">Description</label><textarea className="form-textarea" rows={3} value={d?.description || ""} onChange={(e) => set("description", e.target.value)} /></div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="form-label">Category</label><input className="form-input" value={d?.category || ""} onChange={(e) => set("category", e.target.value)} placeholder="Academic, Sports..." /></div>
                <div><label className="form-label">Date</label><input className="form-input" type="date" value={d?.date || ""} onChange={(e) => set("date", e.target.value)} /></div>
                <div><label className="form-label">Link (optional)</label><input className="form-input" type="url" value={d?.link || ""} onChange={(e) => set("link", e.target.value)} placeholder="https://..." /></div>
                <div><label className="form-label">Display Order</label><input className="form-input" type="number" value={d?.order ?? 0} onChange={(e) => set("order", parseInt(e.target.value))} /></div>
              </div>

              <ImageUpload label="Achievement Image" folder="achievements" value={d?.image || ""} onChange={(url) => set("image", url)} aspectRatio="wide" />

              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input type="checkbox" checked={d?.isActive ?? true} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-sm text-[var(--text-secondary)]">Active (show on website)</span>
              </label>
            </div>

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
