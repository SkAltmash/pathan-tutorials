"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import { getNavigationSettings, saveNavigationSettings } from "@/lib/firebase/firestore";
import { NavigationSettings, NavItem } from "@/lib/types";
import { Plus, Trash2, Save, Loader2, GripVertical } from "lucide-react";
import toast from "react-hot-toast";

const DEFAULT_NAV: NavigationSettings = {
  logo: "/logo.jpg",
  items: [
    { id: "1", label: "Home", href: "#home", order: 1, isActive: true },
    { id: "2", label: "Courses", href: "#courses", order: 2, isActive: true },
    { id: "3", label: "Results", href: "#results", order: 3, isActive: true },
    { id: "4", label: "Faculty", href: "#faculty", order: 4, isActive: true },
    { id: "5", label: "Gallery", href: "#gallery", order: 5, isActive: true },
    { id: "6", label: "Contact", href: "#contact", order: 6, isActive: true },
  ],
  ctaText: "Enquire Now",
  ctaLink: "#contact",
};

export default function NavigationAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<NavigationSettings>(DEFAULT_NAV);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { if (!loading && !user) router.push("/admin"); }, [user, loading, router]);
  useEffect(() => {
    if (!user) return;
    getNavigationSettings().then((data) => { if (data) setForm({ ...DEFAULT_NAV, ...data }); setFetching(false); });
  }, [user]);

  const addItem = () => {
    const newItem: NavItem = { id: Date.now().toString(), label: "New Link", href: "#", order: form.items.length + 1, isActive: true };
    setForm((f) => ({ ...f, items: [...f.items, newItem] }));
  };

  const updateItem = (id: string, field: keyof NavItem, val: string | number | boolean) =>
    setForm((f) => ({ ...f, items: f.items.map((item) => item.id === id ? { ...item, [field]: val } : item) }));

  const removeItem = (id: string) =>
    setForm((f) => ({ ...f, items: f.items.filter((item) => item.id !== id) }));

  const handleSave = async () => {
    setSaving(true);
    try { await saveNavigationSettings(form); toast.success("Navigation saved!"); }
    catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  return (
    <AdminShell title="Navigation">
      <div className="max-w-2xl space-y-6">
        <div className="admin-card space-y-4">
          <h3 className="font-700 text-base text-white border-b border-[var(--border)] pb-3">Navbar Settings</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">CTA Button Text</label>
              <input className="form-input" value={form.ctaText} onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">CTA Button Link</label>
              <input className="form-input" value={form.ctaLink} onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="admin-card space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className="font-700 text-base text-white">Menu Items</h3>
            <button onClick={addItem} className="btn-primary btn-sm"><Plus size={14} /> Add Item</button>
          </div>

          <div className="space-y-3">
            {form.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
                <GripVertical size={16} className="text-[var(--text-muted)] cursor-grab flex-shrink-0" />
                <input
                  className="form-input flex-1 py-2 text-sm"
                  value={item.label}
                  onChange={(e) => updateItem(item.id, "label", e.target.value)}
                  placeholder="Label"
                />
                <input
                  className="form-input flex-1 py-2 text-sm"
                  value={item.href}
                  onChange={(e) => updateItem(item.id, "href", e.target.value)}
                  placeholder="#link or /page"
                />
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) => updateItem(item.id, "isActive", e.target.checked)}
                  className="w-4 h-4 accent-primary flex-shrink-0"
                  title="Active"
                />
                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 flex-shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Navigation</>}
        </button>
      </div>
    </AdminShell>
  );
}
