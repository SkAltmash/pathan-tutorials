"use client";
import { revalidateCache } from "@/lib/bff/revalidate";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import { getAllCourses, addCourse, updateCourse, deleteCourse } from "@/lib/firebase/firestore";
import ImageUpload from "@/components/admin/ImageUpload";
import { Course } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Save, Loader2, BookOpen, ToggleLeft, ToggleRight, Pin } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY: Omit<Course, "id"> = {
  name: "", class: "", board: "", subject: "Mathematics", description: "",
  duration: "", fees: "", image: "", features: [], ctaText: "Enquire Now",
  ctaLink: "/contact", isActive: true, showOnHome: false, order: 0,
};

type ModalState = { mode: "add" | "edit"; data: Course | Omit<Course, "id"> } | null;

export default function CoursesAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [saving, setSaving] = useState(false);
  const [featuresText, setFeaturesText] = useState("");

  useEffect(() => { if (!loading && !user) router.push("/admin"); }, [user, loading, router]);

  const load = async () => {
    try { const data = await getAllCourses(); setCourses(data); }
    catch { toast.error("Failed to load courses"); } finally { setFetching(false); }
  };
  useEffect(() => { if (user) load(); }, [user]);

  const openAdd = () => {
    setModal({ mode: "add", data: { ...EMPTY, order: courses.length + 1 } });
    setFeaturesText("");
  };
  const openEdit = (course: Course) => {
    setModal({ mode: "edit", data: { ...course } });
    setFeaturesText(course.features?.join("\n") || "");
  };

  const set = (field: keyof Course, val: unknown) =>
    setModal((m) => m ? { ...m, data: { ...m.data, [field]: val } } : null);

  const handleSave = async () => {
    if (!modal) return;
    const data = { ...modal.data, features: featuresText.split("\n").filter(Boolean) };
    setSaving(true);
    try {
      if (modal.mode === "add") { await addCourse(data as Omit<Course, "id">); toast.success("Course added!"); }
      else { const { id, ...rest } = data as Course; await updateCourse(id, rest); toast.success("Course updated!"); }
      revalidateCache("courses");
      setModal(null); load();
    } catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    try { await deleteCourse(id); revalidateCache("courses"); toast.success("Deleted"); load(); } catch { toast.error("Delete failed"); }
  };

  const handleToggle = async (course: Course) => {
    try { await updateCourse(course.id, { isActive: !course.isActive }); revalidateCache("courses"); load(); } catch { toast.error("Update failed"); }
  };

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  const d = modal?.data as Course;

  return (
    <AdminShell title="Courses">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[var(--text-secondary)]">{courses.length} course(s)</p>
        <button onClick={openAdd} className="btn-primary btn-sm">
          <Plus size={16} /> Add Course
        </button>
      </div>

      {/* List */}
      <div className="admin-card">
        {fetching ? (
          <div className="space-y-3 p-2">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-[var(--text-muted)]">
            <BookOpen size={36} className="opacity-30" />
            <p className="text-sm">No courses yet. Add your first!</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block table-scroll">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Class</th><th>Board</th><th>Fees</th><th>Order</th><th>Active</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id}>
                      <td className="font-600 text-white">{c.name}</td>
                      <td>{c.class}</td>
                      <td>{c.board}</td>
                      <td className="text-primary font-600">{c.fees}</td>
                      <td>{c.order}</td>
                      <td>
                        <button onClick={() => handleToggle(c)}>
                          {c.isActive ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-[var(--text-muted)]" />}
                        </button>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col divide-y divide-[var(--border)]">
              {courses.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 py-3 px-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={16} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-600 text-white text-sm truncate">{c.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">Class {c.class} · {c.board} · <span className="text-primary">{c.fees}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleToggle(c)}>
                      {c.isActive ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} className="text-[var(--text-muted)]" />}
                    </button>
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"><Pencil size={13} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 size={13} /></button>
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
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] flex-shrink-0">
              <h3 className="font-700 text-white text-base">{modal.mode === "add" ? "Add Course" : "Edit Course"}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/8 transition-colors"><X size={18} /></button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className="form-label">Course Name</label><input className="form-input" value={d?.name || ""} onChange={(e) => set("name", e.target.value)} placeholder="8th Mathematics" /></div>
                <div><label className="form-label">Class</label><input className="form-input" value={d?.class || ""} onChange={(e) => set("class", e.target.value)} placeholder="8th, 9th, 10th..." /></div>
                <div><label className="form-label">Board</label><input className="form-input" value={d?.board || ""} onChange={(e) => set("board", e.target.value)} placeholder="CBSE, State Board..." /></div>
                <div><label className="form-label">Subject</label><input className="form-input" value={d?.subject || ""} onChange={(e) => set("subject", e.target.value)} /></div>
                <div><label className="form-label">Duration</label><input className="form-input" value={d?.duration || ""} onChange={(e) => set("duration", e.target.value)} placeholder="Academic Year" /></div>
                <div><label className="form-label">Fees</label><input className="form-input" value={d?.fees || ""} onChange={(e) => set("fees", e.target.value)} placeholder="₹5000/month" /></div>
                <div><label className="form-label">Display Order</label><input className="form-input" type="number" value={d?.order ?? 0} onChange={(e) => set("order", parseInt(e.target.value))} /></div>
                <div><label className="form-label">CTA Text</label><input className="form-input" value={d?.ctaText || ""} onChange={(e) => set("ctaText", e.target.value)} /></div>
                <div><label className="form-label">CTA Link</label><input className="form-input" value={d?.ctaLink || ""} onChange={(e) => set("ctaLink", e.target.value)} /></div>
              </div>

              <div><label className="form-label">Description</label><textarea className="form-textarea" rows={3} value={d?.description || ""} onChange={(e) => set("description", e.target.value)} /></div>
              <div><label className="form-label">Features (one per line)</label><textarea className="form-textarea" rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder={"Weekly tests\nStudy material\nDoubt sessions"} /></div>

              <ImageUpload
                label="Course Image (4:3)"
                folder="courses"
                value={d?.image || ""}
                onChange={(url) => set("image", url)}
                aspectRatio="four-three"
                crop
                cropAspect={4 / 3}
              />

              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input type="checkbox" checked={d?.isActive ?? true} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-sm text-[var(--text-secondary)]">Active (show on website)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input type="checkbox" checked={d?.showOnHome ?? false} onChange={(e) => set("showOnHome", e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5"><Pin size={13} className="text-primary" /> Show on Home Page <span className="text-[10px] text-[var(--text-muted)]">(requires image)</span></span>
              </label>
            </div>

            <div className="border-t border-[var(--border)] px-5 py-4 flex gap-3 justify-end flex-shrink-0">
              <button onClick={() => setModal(null)} className="btn-outline btn-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm">
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Course</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
