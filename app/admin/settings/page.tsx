"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import { getSiteSettings, saveSiteSettings } from "@/lib/firebase/firestore";
import { SiteSettings } from "@/lib/types";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY: SiteSettings = {
  siteName: "Pathan Tutorials", tagline: "Excellence in Mathematics",
  description: "", logo: "/logo.jpg", favicon: "", phone: "", whatsapp: "",
  email: "", address: "", googleMapsUrl: "", instagramUrl: "", facebookUrl: "",
  youtubeUrl: "", telegramUrl: "", linkedinUrl: "", openingHours: "",
  footerDescription: "", footerCopyright: "",
};

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<SiteSettings>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/admin");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getSiteSettings().then((data) => {
      if (data) setForm({ ...EMPTY, ...data });
      setFetching(false);
    }).catch(() => setFetching(false));
  }, [user]);

  const set = (field: keyof SiteSettings, val: string) =>
    setForm((f) => ({ ...f, [field]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSiteSettings(form);
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  if (fetching) return <AdminShell title="Site Settings"><div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}</div></AdminShell>;

  return (
    <AdminShell title="Site Settings">
      <div className="max-w-3xl space-y-6">


        <div className="admin-card space-y-4">
          <h3 className="font-display font-700 text-base text-white border-b border-[var(--border)] pb-3">Contact Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Phone</label>
              <input className="form-input" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXXXXXXX" />
            </div>
            <div>
              <label className="form-label">WhatsApp</label>
              <input className="form-input" type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+91 XXXXXXXXXX" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <label className="form-label">Opening Hours</label>
              <input className="form-input" value={form.openingHours} onChange={(e) => set("openingHours", e.target.value)} placeholder="Mon–Sat: 9am–8pm" />
            </div>
          </div>
          <div>
            <label className="form-label">Address</label>
            <input className="form-input" value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Google Maps URL</label>
            <input className="form-input" type="url" value={form.googleMapsUrl} onChange={(e) => set("googleMapsUrl", e.target.value)} placeholder="https://maps.google.com/..." />
          </div>
        </div>

        {/* Social Media */}
        <div className="admin-card space-y-4">
          <h3 className="font-display font-700 text-base text-white border-b border-[var(--border)] pb-3">Social Media Links</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Instagram", key: "instagramUrl" as keyof SiteSettings },
              { label: "Facebook", key: "facebookUrl" as keyof SiteSettings },
              { label: "YouTube", key: "youtubeUrl" as keyof SiteSettings },
              { label: "Telegram", key: "telegramUrl" as keyof SiteSettings },
              { label: "LinkedIn", key: "linkedinUrl" as keyof SiteSettings },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="form-label">{label}</label>
                <input className="form-input" type="url" value={(form[key] as string) || ""} onChange={(e) => set(key, e.target.value)} placeholder="https://..." />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="admin-card space-y-4">
          <h3 className="font-display font-700 text-base text-white border-b border-[var(--border)] pb-3">Footer Content</h3>
          <div>
            <label className="form-label">Footer Description</label>
            <textarea className="form-textarea" rows={2} value={form.footerDescription} onChange={(e) => set("footerDescription", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Copyright Text</label>
            <input className="form-input" value={form.footerCopyright} onChange={(e) => set("footerCopyright", e.target.value)} placeholder={`© ${new Date().getFullYear()} Pathan Tutorials`} />
          </div>
        </div>

        {/* Save */}
        <button id="save-settings" onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Settings</>}
        </button>
      </div>
    </AdminShell>
  );
}
