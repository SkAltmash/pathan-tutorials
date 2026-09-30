"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import { getEnquiries, updateEnquiry } from "@/lib/firebase/firestore";
import { Enquiry, EnquiryStatus } from "@/lib/types";
import { Phone, MessageCircle, Mail, Search } from "lucide-react";
import toast from "react-hot-toast";

const STATUSES: EnquiryStatus[] = ["New", "Contacted", "Follow-up", "Converted", "Closed"];

const STATUS_COLORS: Record<EnquiryStatus, string> = {
  New: "badge-yellow",
  Contacted: "badge-blue",
  "Follow-up": "badge-gray",
  Converted: "badge-green",
  Closed: "badge-red",
};

export default function EnquiriesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<EnquiryStatus | "All">("All");
  const [selected, setSelected] = useState<Enquiry | null>(null);

  useEffect(() => { if (!loading && !user) router.push("/admin"); }, [user, loading, router]);

  const load = async () => {
    try {
      const data = await getEnquiries();
      setEnquiries(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch { toast.error("Failed to load enquiries"); } finally { setFetching(false); }
  };

  useEffect(() => { if (user) load(); }, [user]);

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    try {
      await updateEnquiry(id, { status });
      setEnquiries((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
      if (selected?.id === id) setSelected((s) => s ? { ...s, status } : null);
      toast.success("Status updated");
    } catch { toast.error("Update failed"); }
  };

  const filtered = enquiries.filter((e) => {
    const q = search.toLowerCase();
    if (filterStatus !== "All" && e.status !== filterStatus) return false;
    if (q && !e.studentName.toLowerCase().includes(q) && !e.phone.includes(q)) return false;
    return true;
  });

  if (loading || !user) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  return (
    <AdminShell title="Enquiries">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            className="form-input pl-9 text-sm py-2"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select !w-auto text-sm py-2" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as EnquiryStatus | "All")}>
          <option value="All">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          {filtered.length} enquiries
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Table */}
        <div className="lg:col-span-2 admin-card overflow-x-auto">
          {fetching ? (
            <div className="space-y-3 p-4">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-muted)]">No enquiries found</div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Student</th><th>Phone</th><th>Class</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {filtered.map((enq) => (
                  <tr key={enq.id} className={`cursor-pointer ${selected?.id === enq.id ? "bg-primary/5" : ""}`} onClick={() => setSelected(enq)}>
                    <td className="font-600 text-white">{enq.studentName}</td>
                    <td>
                      <a href={`tel:${enq.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-primary transition-colors">
                        <Phone size={12} />{enq.phone}
                      </a>
                    </td>
                    <td>{enq.class}</td>
                    <td>
                      <select
                        className="text-xs bg-transparent border-none outline-none cursor-pointer"
                        value={enq.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="text-[var(--text-muted)] text-xs">{new Date(enq.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Panel */}
        <div className="admin-card">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-700 text-white">{selected.studentName}</h3>
                <span className={`badge ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
              </div>
              <div className="space-y-2 text-sm">
                {selected.parentName && <div><span className="text-[var(--text-muted)]">Parent:</span> <span className="text-white ml-2">{selected.parentName}</span></div>}
                <div><span className="text-[var(--text-muted)]">Class:</span> <span className="text-white ml-2">{selected.class}</span></div>
                <div><span className="text-[var(--text-muted)]">Board:</span> <span className="text-white ml-2">{selected.board}</span></div>
                <div><span className="text-[var(--text-muted)]">Course:</span> <span className="text-white ml-2">{selected.course || "—"}</span></div>
                {selected.message && <div><span className="text-[var(--text-muted)]">Message:</span><p className="text-[var(--text-secondary)] mt-1">{selected.message}</p></div>}
              </div>
              <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border)]">
                <a href={`tel:${selected.phone}`} className="btn-primary btn-sm justify-center"><Phone size={14} /> Call {selected.phone}</a>
                {selected.whatsapp && (
                  <a href={`https://wa.me/${selected.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                    className="btn-outline btn-sm justify-center" style={{ borderColor: "#25d366", color: "#25d366" }}>
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                )}
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className="btn-outline btn-sm justify-center">
                    <Mail size={14} /> Email
                  </a>
                )}
              </div>
              <div>
                <label className="form-label">Update Status</label>
                <select className="form-select" value={selected.status} onChange={(e) => handleStatusChange(selected.id, e.target.value as EnquiryStatus)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="text-center text-[var(--text-muted)] py-10">
              <Mail size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Click an enquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
