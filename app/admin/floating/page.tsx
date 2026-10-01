"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import { getFloatingButtons, saveFloatingButtons } from "@/lib/firebase/firestore";
import { FloatingButtonsSettings, FloatingButton } from "@/lib/types";
import { Save, Loader2, Phone } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa6";
import toast from "react-hot-toast";

const EMPTY: FloatingButtonsSettings = {
  whatsapp: { type: "whatsapp", label: "WhatsApp", link: "", isActive: true },
  call: { type: "call", label: "Call", link: "", isActive: true },
  instagram: { type: "instagram", label: "Instagram", link: "", isActive: true },
};

export default function FloatingAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<FloatingButtonsSettings>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/admin"); }, [user, loading, router]);
  useEffect(() => {
    if (!user) return;
    getFloatingButtons().then((data) => { if (data) setForm({ ...EMPTY, ...data }); });
  }, [user]);

  const setBtn = (type: keyof FloatingButtonsSettings, field: string, val: string | boolean) =>
    setForm((f) => ({
      ...f,
      [type]: { ...(f[type] as FloatingButton), [field]: val },
    }));

  const handleSave = async () => {
    setSaving(true);
    try { await saveFloatingButtons(form); toast.success("Floating buttons saved!"); }
    catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  const buttons = [
    { key: "whatsapp" as keyof FloatingButtonsSettings, label: "WhatsApp", icon: FaWhatsapp, placeholder: "+919876543210 (no spaces)" },
    { key: "call" as keyof FloatingButtonsSettings, label: "Call Button", icon: Phone, placeholder: "+919876543210" },
    { key: "instagram" as keyof FloatingButtonsSettings, label: "Instagram", icon: FaInstagram, placeholder: "https://instagram.com/..." },
  ];

  return (
    <AdminShell title="Floating Buttons">
      <div className="max-w-xl space-y-4">
        {buttons.map(({ key, label, icon: Icon, placeholder }) => (
        <div key={key} className="admin-card space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <Icon size={18} className="text-primary" />
              <h3 className="font-700 text-base text-white">{label}</h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(form[key] as FloatingButton).isActive}
                onChange={(e) => setBtn(key, "isActive", e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-[var(--text-secondary)]">Active</span>
            </label>
          </div>
          <div>
            <label className="form-label">Link / Number</label>
            <input
              className="form-input"
              value={(form[key] as FloatingButton).link}
              onChange={(e) => setBtn(key, "link", e.target.value)}
              placeholder={placeholder}
            />
          </div>
          <div>
            <label className="form-label">Label (tooltip)</label>
            <input
              className="form-input"
              value={(form[key] as FloatingButton).label}
              onChange={(e) => setBtn(key, "label", e.target.value)}
            />
          </div>
        </div>
        ))}

        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Floating Buttons</>}
        </button>
      </div>
    </AdminShell>
  );
}
