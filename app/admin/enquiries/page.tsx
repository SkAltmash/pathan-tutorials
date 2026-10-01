"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import { getEnquiries, updateEnquiry } from "@/lib/firebase/firestore";
import { Enquiry, EnquiryStatus } from "@/lib/types";
import { Phone, Mail, Search, X, ChevronRight, User } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
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
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="relative flex-1 min-w-0">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            className="form-input pl-9 text-sm py-2 w-full"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select text-sm py-2 w-full sm:w-auto" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as EnquiryStatus | "All")}>
          <option value="All">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex items-center text-sm text-[var(--text-secondary)] px-1">
          {filtered.length} enquiries
        </div>
      </div>

      {/* Layout: desktop = 2+1 grid; mobile = card list */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* ── Left: Table (desktop) + Card list (mobile) ── */}
        <div className="lg:col-span-2 admin-card">
          {fetching ? (
            <div className="space-y-3 p-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-muted)]">No enquiries found</div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block table-scroll">
                <table className="admin-table">
                  <thead><tr><th>Student</th><th>Phone</th><th>Class</th><th>Status</th><th>Date</th><th></th></tr></thead>
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
                        <td><ChevronRight size={14} className="text-[var(--text-muted)]" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="sm:hidden flex flex-col divide-y divide-[var(--border)]">
                {filtered.map((enq) => (
                  <button
                    key={enq.id}
                    className="flex items-center justify-between gap-3 py-3 px-1 text-left w-full hover:bg-white/3 transition-colors"
                    onClick={() => setSelected(enq)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <User size={15} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-600 text-white text-sm truncate">{enq.studentName}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{enq.phone} · Class {enq.class}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`badge ${STATUS_COLORS[enq.status]} text-[10px]`}>{enq.status}</span>
                      <ChevronRight size={14} className="text-[var(--text-muted)]" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Right: Detail panel (desktop sidebar / mobile modal) ── */}
        {/* Desktop sidebar */}
        <div className="hidden lg:block admin-card">
          {selected ? (
            <EnquiryDetail
              enq={selected}
              statuses={STATUSES}
              statusColors={STATUS_COLORS}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <div className="text-center text-[var(--text-muted)] py-10">
              <Mail size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Click an enquiry to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/80 flex items-end justify-center p-0">
          <div className="bg-[var(--bg-card)] border-t border-[var(--border)] rounded-t-2xl w-full max-h-[85dvh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--bg-card)]">
              <h3 className="font-700 text-white text-base">{selected.studentName}</h3>
              <button onClick={() => setSelected(null)} className="text-[var(--text-muted)] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <EnquiryDetail
                enq={selected}
                statuses={STATUSES}
                statusColors={STATUS_COLORS}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function EnquiryDetail({
  enq, statuses, statusColors, onStatusChange,
}: {
  enq: Enquiry;
  statuses: EnquiryStatus[];
  statusColors: Record<EnquiryStatus, string>;
  onStatusChange: (id: string, s: EnquiryStatus) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-700 text-white text-base">{enq.studentName}</h3>
        <span className={`badge ${statusColors[enq.status]}`}>{enq.status}</span>
      </div>
      <div className="space-y-2 text-sm">
        {enq.parentName && <div><span className="text-[var(--text-muted)]">Parent:</span> <span className="text-white ml-2">{enq.parentName}</span></div>}
        <div><span className="text-[var(--text-muted)]">Class:</span> <span className="text-white ml-2">{enq.class}</span></div>
        <div><span className="text-[var(--text-muted)]">Board:</span> <span className="text-white ml-2">{enq.board}</span></div>
        <div><span className="text-[var(--text-muted)]">Course:</span> <span className="text-white ml-2">{enq.course || "—"}</span></div>
        <div><span className="text-[var(--text-muted)]">Date:</span> <span className="text-white ml-2">{new Date(enq.createdAt).toLocaleDateString("en-IN")}</span></div>
        {enq.message && <div><span className="text-[var(--text-muted)]">Message:</span><p className="text-[var(--text-secondary)] mt-1">{enq.message}</p></div>}
      </div>
      <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border)]">
        <a href={`tel:${enq.phone}`} className="btn-primary btn-sm justify-center"><Phone size={14} /> Call {enq.phone}</a>
        {enq.whatsapp && (
          <a href={`https://wa.me/${enq.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
            className="btn-outline btn-sm justify-center" style={{ borderColor: "#25d366", color: "#25d366" }}>
            <FaWhatsapp size={14} /> WhatsApp
          </a>
        )}
        {enq.email && (
          <a href={`mailto:${enq.email}`} className="btn-outline btn-sm justify-center">
            <Mail size={14} /> Email
          </a>
        )}
      </div>
      <div>
        <label className="form-label">Update Status</label>
        <select className="form-select" value={enq.status} onChange={(e) => onStatusChange(enq.id, e.target.value as EnquiryStatus)}>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}
