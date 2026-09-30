"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import { getAllResults, addResult, updateResult, deleteResult } from "@/lib/firebase/firestore";
import ImageUpload from "@/components/admin/ImageUpload";
import { StudentResult } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Save, Loader2, Trophy, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY: Omit<StudentResult, "id"> = {
  studentName: "", class: "", exam: "", year: new Date().getFullYear().toString(),
  percentage: "", marks: "", rank: "", studentPhoto: "", resultImage: "",
  achievementDescription: "", isActive: true,
};

type ModalState = { mode: "add" | "edit"; data: StudentResult | Omit<StudentResult, "id"> } | null;

export default function ResultsAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<StudentResult[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/admin"); }, [user, loading, router]);

  const load = async () => {
    try { const data = await getAllResults(); setItems(data); }
    catch { toast.error("Load failed"); } finally { setFetching(false); }
  };
  useEffect(() => { if (user) load(); }, [user]);

  const set = (field: keyof StudentResult, val: unknown) =>
    setModal((m) => m ? { ...m, data: { ...m.data, [field]: val } } : null);

  const handleSave = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.mode === "add") { await addResult(modal.data as Omit<StudentResult, "id">); toast.success("Result added!"); }
      else { const { id, ...rest } = modal.data as StudentResult; await updateResult(id, rest); toast.success("Updated!"); }
      setModal(null); load();
    } catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this result?")) return;
    try { await deleteResult(id); toast.success("Deleted"); load(); } catch { toast.error("Delete failed"); }
  };

  const handleToggle = async (item: StudentResult) => {
    try { await updateResult(item.id, { isActive: !item.isActive }); load(); } catch { toast.error("Update failed"); }
  };

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  const d = modal?.data as StudentResult;

  return (
    <AdminShell title="Student Results">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[var(--text-secondary)]">{items.length} result(s)</p>
        <button onClick={() => setModal({ mode: "add", data: { ...EMPTY } })} className="btn-primary btn-sm">
          <Plus size={16} /> Add Result
        </button>
      </div>

      {/* List */}
      <div className="admin-card">
        {fetching ? (
          <div className="space-y-3 p-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-[var(--text-muted)]">
            <Trophy size={36} className="opacity-30" />
            <p className="text-sm">No results yet. Add your first!</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block table-scroll">
              <table className="admin-table">
                <thead>
                  <tr><th>Student</th><th>Class</th><th>Exam</th><th>Year</th><th>%</th><th>Rank</th><th>Active</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="font-600 text-white">{item.studentName}</td>
                      <td>{item.class}</td>
                      <td>{item.exam}</td>
                      <td>{item.year}</td>
                      <td className="text-primary font-700">{item.percentage}</td>
                      <td>{item.rank}</td>
                      <td>
                        <button onClick={() => handleToggle(item)}>
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
                <div key={item.id} className="flex items-center justify-between gap-3 py-3 px-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Trophy size={16} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-600 text-white text-sm truncate">{item.studentName}</p>
                      <p className="text-xs text-[var(--text-muted)]">Class {item.class} · {item.exam} · <span className="text-primary font-700">{item.percentage}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleToggle(item)}>
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
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[92dvh] flex flex-col">
            {/* Modal header — sticky */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] flex-shrink-0">
              <h3 className="font-700 text-white text-base">{modal.mode === "add" ? "Add Result" : "Edit Result"}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/8 transition-colors"><X size={18} /></button>
            </div>

            {/* Modal body — scrollable */}
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="form-label">Student Name</label><input className="form-input" value={d?.studentName || ""} onChange={(e) => set("studentName", e.target.value)} placeholder="Full name" /></div>
                <div><label className="form-label">Class</label><input className="form-input" value={d?.class || ""} onChange={(e) => set("class", e.target.value)} placeholder="10th, 12th..." /></div>
                <div><label className="form-label">Exam</label><input className="form-input" value={d?.exam || ""} onChange={(e) => set("exam", e.target.value)} placeholder="SSC, HSC, MHT-CET..." /></div>
                <div><label className="form-label">Year</label><input className="form-input" value={d?.year || ""} onChange={(e) => set("year", e.target.value)} /></div>
                <div><label className="form-label">Percentage</label><input className="form-input" value={d?.percentage || ""} onChange={(e) => set("percentage", e.target.value)} placeholder="96%" /></div>
                <div><label className="form-label">Marks</label><input className="form-input" value={d?.marks || ""} onChange={(e) => set("marks", e.target.value)} placeholder="480/500" /></div>
                <div className="sm:col-span-2"><label className="form-label">Rank / Achievement</label><input className="form-input" value={d?.rank || ""} onChange={(e) => set("rank", e.target.value)} placeholder="School Topper, District Rank 1..." /></div>
              </div>

              <div><label className="form-label">Achievement Description</label><textarea className="form-textarea" rows={2} value={d?.achievementDescription || ""} onChange={(e) => set("achievementDescription", e.target.value)} /></div>

              <div className="grid sm:grid-cols-2 gap-4">
                <ImageUpload label="Student Photo" folder="students" value={d?.studentPhoto || ""} onChange={(url) => set("studentPhoto", url)} aspectRatio="square" />
                <ImageUpload label="Result Certificate" folder="results" value={d?.resultImage || ""} onChange={(url) => set("resultImage", url)} aspectRatio="wide" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input type="checkbox" checked={d?.isActive ?? true} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-sm text-[var(--text-secondary)]">Active (show on website)</span>
              </label>
            </div>

            {/* Modal footer — sticky */}
            <div className="border-t border-[var(--border)] px-5 py-4 flex gap-3 justify-end flex-shrink-0">
              <button onClick={() => setModal(null)} className="btn-outline btn-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm">
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Result</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
