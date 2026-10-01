"use client";
import { revalidateCache } from "@/lib/bff/revalidate";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { getAllFaculty, addFaculty, updateFaculty, deleteFaculty } from "@/lib/firebase/firestore";
import { Faculty } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Save, Loader2, GraduationCap, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const EMPTY: Omit<Faculty, "id"> = {
  name: "", profileImage: "", subject: "Mathematics", qualification: "", experience: "",
  bio: "", instagramUrl: "", linkedinUrl: "", youtubeUrl: "", order: 0, isActive: true,
};

type ModalState = { mode: "add" | "edit"; data: Faculty | Omit<Faculty, "id"> } | null;

export default function FacultyAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Faculty[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
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
      if (modal.mode === "add") { await addFaculty(modal.data as Omit<Faculty, "id">); toast.success("Faculty added!"); revalidateCache("faculty");}
      else { const { id, ...rest } = modal.data as Faculty; await updateFaculty(id, rest); revalidateCache("faculty"); toast.success("Updated!"); }
      setModal(null); load();
    } catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await deleteFaculty(id); revalidateCache("faculty"); toast.success("Deleted"); load(); } catch { toast.error("Delete failed"); }
  };

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  const d = modal?.data as Faculty;

  return (
    <AdminShell title="Faculty">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[var(--text-secondary)]">{items.length} faculty member(s)</p>
        <button onClick={() => setModal({ mode: "add", data: { ...EMPTY, order: items.length + 1 } })} className="btn-primary btn-sm">
          <Plus size={16} /> Add Faculty
        </button>
      </div>

      <div className="admin-card">
        {fetching ? (
          <div className="space-y-3 p-2">{[...Array(2)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-[var(--text-muted)]">
            <GraduationCap size={36} className="opacity-30" />
            <p className="text-sm">No faculty yet. Add your first!</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--border)]">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3 px-1">
                {/* Avatar */}
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0 bg-primary/10">
                  {item.profileImage ? (
                    <Image src={item.profileImage} alt={item.name} fill sizes="44px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap size={18} className="text-primary" />
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-600 text-white text-sm truncate">{item.name}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{item.subject} · {item.experience}</p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { updateFaculty(item.id, { isActive: !item.isActive }).then(() => { revalidateCache("faculty"); load(); }); }}>
                    {item.isActive ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-[var(--text-muted)]" />}
                  </button>
                  <button onClick={() => setModal({ mode: "edit", data: { ...item } })} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[92dvh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] flex-shrink-0">
              <h3 className="font-700 text-white text-base">{modal.mode === "add" ? "Add Faculty" : "Edit Faculty"}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/8 transition-colors"><X size={18} /></button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <ImageUpload label="Profile Photo" folder="faculty" value={d?.profileImage || ""} onChange={(url) => set("profileImage", url)} aspectRatio="square" />

              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="form-label">Name</label><input className="form-input" value={d?.name || ""} onChange={(e) => set("name", e.target.value)} /></div>
                <div><label className="form-label">Subject</label><input className="form-input" value={d?.subject || ""} onChange={(e) => set("subject", e.target.value)} /></div>
                <div><label className="form-label">Qualification</label><input className="form-input" value={d?.qualification || ""} onChange={(e) => set("qualification", e.target.value)} placeholder="M.Sc. Mathematics, B.Ed." /></div>
                <div><label className="form-label">Experience</label><input className="form-input" value={d?.experience || ""} onChange={(e) => set("experience", e.target.value)} placeholder="10+ Years" /></div>
                <div><label className="form-label">Display Order</label><input className="form-input" type="number" value={d?.order ?? 0} onChange={(e) => set("order", parseInt(e.target.value))} /></div>
                <div className="flex items-center gap-2 self-end pb-2">
                  <input type="checkbox" id="fac-active" checked={d?.isActive ?? true} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 accent-primary" />
                  <label htmlFor="fac-active" className="text-sm text-[var(--text-secondary)] cursor-pointer">Active</label>
                </div>
              </div>

              <div><label className="form-label">Bio</label><textarea className="form-textarea" rows={3} value={d?.bio || ""} onChange={(e) => set("bio", e.target.value)} /></div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div><label className="form-label">Instagram URL</label><input className="form-input" type="url" value={d?.instagramUrl || ""} onChange={(e) => set("instagramUrl", e.target.value)} placeholder="https://..." /></div>
                <div><label className="form-label">LinkedIn URL</label><input className="form-input" type="url" value={d?.linkedinUrl || ""} onChange={(e) => set("linkedinUrl", e.target.value)} placeholder="https://..." /></div>
                <div><label className="form-label">YouTube URL</label><input className="form-input" type="url" value={d?.youtubeUrl || ""} onChange={(e) => set("youtubeUrl", e.target.value)} placeholder="https://..." /></div>
              </div>
            </div>

            <div className="border-t border-[var(--border)] px-5 py-4 flex gap-3 justify-end flex-shrink-0">
              <button onClick={() => setModal(null)} className="btn-outline btn-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm">
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Faculty</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
