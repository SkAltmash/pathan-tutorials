"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import { getAllCourses, addCourse, updateCourse, deleteCourse } from "@/lib/firebase/firestore";
import ImageUpload from "@/components/admin/ImageUpload";
import { Course } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Save, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY_COURSE: Omit<Course, "id"> = {
  name: "", class: "", board: "", subject: "Mathematics", description: "",
  duration: "", fees: "", image: "", features: [], ctaText: "Enquire Now",
  ctaLink: "#contact", isActive: true, order: 0,
};

export default function CoursesAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; data: Course | Omit<Course, "id"> } | null>(null);
  const [saving, setSaving] = useState(false);
  const [featuresText, setFeaturesText] = useState("");

  useEffect(() => { if (!loading && !user) router.push("/admin"); }, [user, loading, router]);

  const load = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch { toast.error("Failed to load courses"); } finally { setFetching(false); }
  };

  useEffect(() => { if (user) load(); }, [user]);

  const openAdd = () => {
    setModal({ mode: "add", data: { ...EMPTY_COURSE, order: courses.length + 1 } });
    setFeaturesText("");
  };

  const openEdit = (course: Course) => {
    setModal({ mode: "edit", data: { ...course } });
    setFeaturesText(course.features?.join("\n") || "");
  };

  const set = (field: keyof Course, val: unknown) => {
    setModal((m) => m ? { ...m, data: { ...m.data, [field]: val } } : null);
  };

  const handleSave = async () => {
    if (!modal) return;
    const data = { ...modal.data, features: featuresText.split("\n").filter(Boolean) };
    setSaving(true);
    try {
      if (modal.mode === "add") {
        await addCourse(data as Omit<Course, "id">);
        toast.success("Course added!");
      } else {
        const { id, ...rest } = data as Course;
        await updateCourse(id, rest);
        toast.success("Course updated!");
      }
      setModal(null);
      load();
    } catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      toast.success("Deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  const handleToggle = async (course: Course) => {
    try {
      await updateCourse(course.id, { isActive: !course.isActive });
      load();
    } catch { toast.error("Update failed"); }
  };

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  return (
    <AdminShell title="Courses">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">{courses.length} course(s)</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm">
          <Plus size={16} /> Add Course
        </button>
      </div>

      <div className="admin-card overflow-x-auto">
        {fetching ? (
          <div className="space-y-3 p-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <p>No courses yet. Add your first course!</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Class</th><th>Board</th><th>Fees</th><th>Order</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td className="font-600 text-white">{c.name}</td>
                  <td>{c.class}</td>
                  <td>{c.board}</td>
                  <td>{c.fees}</td>
                  <td>{c.order}</td>
                  <td>
                    <button onClick={() => handleToggle(c)}>
                      {c.isActive ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} className="text-[var(--text-muted)]" />}
                    </button>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h3 className="font-700 text-white">{modal.mode === "add" ? "Add Course" : "Edit Course"}</h3>
              <button onClick={() => setModal(null)} className="text-[var(--text-muted)] hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Course Name</label>
                  <input className="form-input" value={(modal.data as Course).name || ""} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Class</label>
                  <input className="form-input" value={(modal.data as Course).class || ""} onChange={(e) => set("class", e.target.value)} placeholder="8th, 9th, 10th..." />
                </div>
                <div>
                  <label className="form-label">Board</label>
                  <input className="form-input" value={(modal.data as Course).board || ""} onChange={(e) => set("board", e.target.value)} placeholder="CBSE, State Board..." />
                </div>
                <div>
                  <label className="form-label">Subject</label>
                  <input className="form-input" value={(modal.data as Course).subject || ""} onChange={(e) => set("subject", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Duration</label>
                  <input className="form-input" value={(modal.data as Course).duration || ""} onChange={(e) => set("duration", e.target.value)} placeholder="Academic Year" />
                </div>
                <div>
                  <label className="form-label">Fees</label>
                  <input className="form-input" value={(modal.data as Course).fees || ""} onChange={(e) => set("fees", e.target.value)} placeholder="₹5000/month" />
                </div>
                <div>
                  <label className="form-label">CTA Text</label>
                  <input className="form-input" value={(modal.data as Course).ctaText || ""} onChange={(e) => set("ctaText", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">CTA Link</label>
                  <input className="form-input" value={(modal.data as Course).ctaLink || ""} onChange={(e) => set("ctaLink", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Display Order</label>
                  <input className="form-input" type="number" value={(modal.data as Course).order || 0} onChange={(e) => set("order", parseInt(e.target.value))} />
                </div>
                <div className="flex items-center gap-2 self-end pb-3">
                  <input type="checkbox" id="course-active" checked={(modal.data as Course).isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 accent-primary" />
                  <label htmlFor="course-active" className="text-sm text-[var(--text-secondary)] cursor-pointer">Active</label>
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={3} value={(modal.data as Course).description || ""} onChange={(e) => set("description", e.target.value)} />
              </div>

              <div>
                <label className="form-label">Features (one per line)</label>
                <textarea className="form-textarea" rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder={"Weekly tests\nStudy material\nDoubt sessions"} />
              </div>

              <ImageUpload label="Course Image" folder="courses" value={(modal.data as Course).image || ""} onChange={(url) => set("image", url)} aspectRatio="wide" />
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
