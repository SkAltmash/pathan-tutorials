"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import { getSEOSettings, saveSEOSettings } from "@/lib/firebase/firestore";
import { SEOSettings } from "@/lib/types";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY: SEOSettings = {
  metaTitle: "Pathan Tutorials — Expert Mathematics Coaching in Hinganghat",
  metaDescription: "Premier mathematics coaching for 8th–12th CBSE & Maharashtra State Board, and MHT-CET preparation in Hinganghat.",
  keywords: "Pathan Tutorials, mathematics coaching, Hinganghat, CBSE, Maharashtra Board, MHT-CET",
  ogTitle: "", ogDescription: "", ogImage: "", canonicalUrl: "", robots: "index, follow",
};

export default function SEOAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<SEOSettings>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { if (!loading && !user) router.push("/admin"); }, [user, loading, router]);
  useEffect(() => {
    if (!user) return;
    getSEOSettings().then((data) => { if (data) setForm({ ...EMPTY, ...data }); setFetching(false); });
  }, [user]);

  const set = (field: keyof SEOSettings, val: string) => setForm((f) => ({ ...f, [field]: val }));

  const handleSave = async () => {
    setSaving(true);
    try { await saveSEOSettings(form); toast.success("SEO settings saved!"); }
    catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  return (
    <AdminShell title="SEO Settings">
      <div className="max-w-2xl space-y-6">
        <div className="admin-card space-y-4">
          <h3 className="font-700 text-base text-white border-b border-[var(--border)] pb-3">Basic SEO</h3>
          <div>
            <label className="form-label">Meta Title <span className="text-[var(--text-muted)] font-normal">(max 60 chars)</span></label>
            <input className="form-input" value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} maxLength={70} />
            <p className="text-xs text-[var(--text-muted)] mt-1">{form.metaTitle.length}/60 chars</p>
          </div>
          <div>
            <label className="form-label">Meta Description <span className="text-[var(--text-muted)] font-normal">(max 160 chars)</span></label>
            <textarea className="form-textarea" rows={3} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} maxLength={180} />
            <p className="text-xs text-[var(--text-muted)] mt-1">{form.metaDescription.length}/160 chars</p>
          </div>
          <div>
            <label className="form-label">Keywords</label>
            <input className="form-input" value={form.keywords} onChange={(e) => set("keywords", e.target.value)} placeholder="comma, separated, keywords" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Canonical URL</label>
              <input className="form-input" type="url" value={form.canonicalUrl} onChange={(e) => set("canonicalUrl", e.target.value)} />
            </div>
            <div>
              <label className="form-label">Robots</label>
              <select className="form-select" value={form.robots} onChange={(e) => set("robots", e.target.value)}>
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>
          </div>
        </div>

        <div className="admin-card space-y-4">
          <h3 className="font-700 text-base text-white border-b border-[var(--border)] pb-3">Open Graph (Social Sharing)</h3>
          <div>
            <label className="form-label">OG Title</label>
            <input className="form-input" value={form.ogTitle} onChange={(e) => set("ogTitle", e.target.value)} />
          </div>
          <div>
            <label className="form-label">OG Description</label>
            <textarea className="form-textarea" rows={2} value={form.ogDescription} onChange={(e) => set("ogDescription", e.target.value)} />
          </div>
          <div>
            <label className="form-label">OG Image URL</label>
            <input className="form-input" type="url" value={form.ogImage} onChange={(e) => set("ogImage", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save SEO Settings</>}
        </button>
      </div>
    </AdminShell>
  );
}
