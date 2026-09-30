"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { getAllResults, addResult, updateResult, deleteResult } from "@/lib/firebase/firestore";
import { StudentResult } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY: Omit<StudentResult, "id"> = {
  studentName: "", class: "", exam: "", year: new Date().getFullYear().toString(),
  percentage: "", marks: "", rank: "", studentPhoto: "", resultImage: "",
  achievementDescription: "", isActive: true,
};

export default function ResultsAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<StudentResult[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; data: StudentResult | Omit<StudentResult, "id"> } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/admin"); }, [user, loading, router]);

  const load = async () => {
    try { const data = await getAllResults(); setItems(data); } catch { toast.error("Load failed"); } finally { setFetching(false); }
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

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  return (
    <AdminShell title="Student Results">
      <div className="flex justify-end mb-5">
        <button onClick={() => setModal({ mode: "add", data: { ...EMPTY } })} className="btn-primary btn-sm">
          <Plus size={16} /> Add Result
        </button>
      </div>

      <div className="admin-card overflow-x-auto">
        {fetching ? <div className="space-y-3 p-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded" />)}</div>
          : items.length === 0 ? <div className="text-center py-12 text-[var(--text-muted)]">No results yet</div>
          : (
            <table className="admin-table">
              <thead><tr><th>Student</th><th>Class</th><th>Exam</th><th>Year</th><th>%</th><th>Rank</th><th>Actions</th></tr></thead>
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
              <h3 className="font-700 text-white">{modal.mode === "add" ? "Add Result" : "Edit Result"}</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-[var(--text-muted)]" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="form-label">Student Name</label><input className="form-input" value={(modal.data as StudentResult).studentName || ""} onChange={(e) => set("studentName", e.target.value)} /></div>
                <div><label className="form-label">Class</label><input className="form-input" value={(modal.data as StudentResult).class || ""} onChange={(e) => set("class", e.target.value)} placeholder="10th, 12th..." /></div>
                <div><label className="form-label">Exam</label><input className="form-input" value={(modal.data as StudentResult).exam || ""} onChange={(e) => set("exam", e.target.value)} placeholder="SSC, HSC, MHT-CET..." /></div>
                <div><label className="form-label">Year</label><input className="form-input" value={(modal.data as StudentResult).year || ""} onChange={(e) => set("year", e.target.value)} /></div>
                <div><label className="form-label">Percentage</label><input className="form-input" value={(modal.data as StudentResult).percentage || ""} onChange={(e) => set("percentage", e.target.value)} placeholder="96%" /></div>
                <div><label className="form-label">Marks</label><input className="form-input" value={(modal.data as StudentResult).marks || ""} onChange={(e) => set("marks", e.target.value)} placeholder="480/500" /></div>
                <div><label className="form-label">Rank / Achievement</label><input className="form-input" value={(modal.data as StudentResult).rank || ""} onChange={(e) => set("rank", e.target.value)} placeholder="School Topper" /></div>
              </div>
              <div><label className="form-label">Achievement Description</label><textarea className="form-textarea" rows={2} value={(modal.data as StudentResult).achievementDescription || ""} onChange={(e) => set("achievementDescription", e.target.value)} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <ImageUpload label="Student Photo" folder="students" value={(modal.data as StudentResult).studentPhoto || ""} onChange={(url) => set("studentPhoto", url)} aspectRatio="square" />
                <ImageUpload label="Result Certificate" folder="results" value={(modal.data as StudentResult).resultImage || ""} onChange={(url) => set("resultImage", url)} aspectRatio="wide" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="result-active" checked={(modal.data as StudentResult).isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 accent-primary" />
                <label htmlFor="result-active" className="text-sm text-[var(--text-secondary)]">Active</label>
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
