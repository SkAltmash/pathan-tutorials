"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { getAllFaculty, addFaculty, updateFaculty, deleteFaculty } from "@/lib/firebase/firestore";
import { Faculty } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Save, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY: Omit<Faculty, "id"> = {
  name: "", profileImage: "", subject: "Mathematics", qualification: "", experience: "",
  bio: "", instagramUrl: "", linkedinUrl: "", youtubeUrl: "", order: 0, isActive: true,
};

export default function FacultyAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Faculty[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; data: Faculty | Omit<Faculty, "id"> } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/admin"); }, [user, loading, router]);
  const load = async () => { try { setItems(await getAllFaculty()); } catch { toast.error("Load failed"); } finally { setFetching(false); } };
  useEffect(() => { if (user) load(); }, [user]);

  const set = (field: keyof Faculty, val: unknown) =>
    setModal((m) => m ? { ...m, data: { ...m.data, [field]: val } } : null);

  const handleSave = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.mode === "add") { await addFaculty(modal.data as Omit<Faculty, "id">); toast.success("Faculty added!"); }
      else { const { id, ...rest } = modal.data as Faculty; await updateFaculty(id, rest); toast.success("Updated!"); }
      setModal(null); load();
    } catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await deleteFaculty(id); toast.success("Deleted"); load(); } catch { toast.error("Delete failed"); }
  };

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  return (
    <AdminShell title="Faculty">
      <div className="flex justify-end mb-5">
        <button onClick={() => setModal({ mode: "add", data: { ...EMPTY, order: items.length + 1 } })} className="btn-primary btn-sm">
          <Plus size={16} /> Add Faculty
        </button>
      </div>

      <div className="admin-card overflow-x-auto">
        {fetching ? <div className="space-y-3 p-4">{[...Array(2)].map((_, i) => <div key={i} className="skeleton h-12 rounded" />)}</div>
          : items.length === 0 ? <div className="text-center py-12 text-[var(--text-muted)]">No faculty yet</div>
          : (
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Subject</th><th>Experience</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="font-600 text-white">{item.name}</td>
                    <td>{item.subject}</td>
                    <td>{item.experience}</td>
                    <td>{item.order}</td>
                    <td>
                      <button onClick={() => { updateFaculty(item.id, { isActive: !item.isActive }).then(load); }}>
                        {item.isActive ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} className="text-[var(--text-muted)]" />}
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
          )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h3 className="font-700 text-white">{modal.mode === "add" ? "Add Faculty" : "Edit Faculty"}</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-[var(--text-muted)]" /></button>
            </div>
            <div className="p-5 space-y-4">
              <ImageUpload label="Profile Photo" folder="faculty" value={(modal.data as Faculty).profileImage || ""} onChange={(url) => set("profileImage", url)} aspectRatio="square" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="form-label">Name</label><input className="form-input" value={(modal.data as Faculty).name || ""} onChange={(e) => set("name", e.target.value)} /></div>
                <div><label className="form-label">Subject</label><input className="form-input" value={(modal.data as Faculty).subject || ""} onChange={(e) => set("subject", e.target.value)} /></div>
                <div><label className="form-label">Qualification</label><input className="form-input" value={(modal.data as Faculty).qualification || ""} onChange={(e) => set("qualification", e.target.value)} placeholder="M.Sc. Mathematics, B.Ed." /></div>
                <div><label className="form-label">Experience</label><input className="form-input" value={(modal.data as Faculty).experience || ""} onChange={(e) => set("experience", e.target.value)} placeholder="10+ Years" /></div>
                <div><label className="form-label">Order</label><input className="form-input" type="number" value={(modal.data as Faculty).order || 0} onChange={(e) => set("order", parseInt(e.target.value))} /></div>
                <div className="flex items-center gap-2 self-end pb-3">
                  <input type="checkbox" checked={(modal.data as Faculty).isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 accent-primary" />
                  <span className="text-sm text-[var(--text-secondary)]">Active</span>
                </div>
              </div>
              <div><label className="form-label">Bio</label><textarea className="form-textarea" rows={3} value={(modal.data as Faculty).bio || ""} onChange={(e) => set("bio", e.target.value)} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="form-label">Instagram URL</label><input className="form-input" type="url" value={(modal.data as Faculty).instagramUrl || ""} onChange={(e) => set("instagramUrl", e.target.value)} /></div>
                <div><label className="form-label">LinkedIn URL</label><input className="form-input" type="url" value={(modal.data as Faculty).linkedinUrl || ""} onChange={(e) => set("linkedinUrl", e.target.value)} /></div>
                <div><label className="form-label">YouTube URL</label><input className="form-input" type="url" value={(modal.data as Faculty).youtubeUrl || ""} onChange={(e) => set("youtubeUrl", e.target.value)} /></div>
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
