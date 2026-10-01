"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";
import { getEnquiries, getAllCourses, getAllResults, getAllGallery, getAllTestimonials } from "@/lib/firebase/firestore";
import { Enquiry, Course, StudentResult, GalleryImage, Testimonial } from "@/lib/types";
import { MessageSquare, BookOpen, Trophy, Images, Star, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function StatCard({ title, value, icon: Icon, href, color }: {
  title: string; value: number | string; icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string; color: string;
}) {
  return (
    <Link href={href} className="stat-card flex items-center gap-4 cursor-pointer group">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className="text-primary" />
      </div>
      <div>
        <p className="text-2xl font-display font-800 text-white">{value}</p>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{title}</p>
      </div>
    </Link>
  );
}

const STATUS_COLORS: Record<string, string> = {
  New: "badge-yellow",
  Contacted: "badge-blue",
  "Follow-up": "badge-gray",
  Converted: "badge-green",
  Closed: "badge-red",
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/admin");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.allSettled([
      getEnquiries(),
      getAllCourses(),
      getAllResults(),
      getAllGallery(),
      getAllTestimonials(),
    ]).then(([e, c, r, g, t]) => {
      if (e.status === "fulfilled") setEnquiries(e.value);
      if (c.status === "fulfilled") setCourses(c.value);
      if (r.status === "fulfilled") setResults(r.value);
      if (g.status === "fulfilled") setGallery(g.value);
      if (t.status === "fulfilled") setTestimonials(t.value);
      setFetching(false);
    });
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const newEnquiries = enquiries.filter((e) => e.status === "New");
  const recentEnquiries = [...enquiries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <AdminShell title="Dashboard">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="font-display font-800 text-xl text-white">
          Welcome back
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Here's what's happening at Pathan Tutorials today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total Enquiries" value={fetching ? "—" : enquiries.length} icon={MessageSquare} href="/admin/enquiries" color="bg-primary/10 border border-primary/20" />
        <StatCard title="New Enquiries" value={fetching ? "—" : newEnquiries.length} icon={TrendingUp} href="/admin/enquiries" color="bg-yellow-500/10 border border-yellow-500/20" />
        <StatCard title="Courses" value={fetching ? "—" : courses.length} icon={BookOpen} href="/admin/courses" color="bg-blue-500/10 border border-blue-500/20" />
        <StatCard title="Student Results" value={fetching ? "—" : results.length} icon={Trophy} href="/admin/results" color="bg-green-500/10 border border-green-500/20" />
        <StatCard title="Gallery Images" value={fetching ? "—" : gallery.length} icon={Images} href="/admin/gallery" color="bg-purple-500/10 border border-purple-500/20" />
        <StatCard title="Testimonials" value={fetching ? "—" : testimonials.length} icon={Star} href="/admin/testimonials" color="bg-orange-500/10 border border-orange-500/20" />
      </div>

      {/* Recent Enquiries */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-700 text-base text-white">Recent Enquiries</h3>
          <Link href="/admin/enquiries" className="text-xs text-primary hover:text-primary-light transition-colors">
            View all →
          </Link>
        </div>

        {fetching ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-lg" />
            ))}
          </div>
        ) : recentEnquiries.length === 0 ? (
          <div className="text-center py-10 text-[var(--text-muted)]">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No enquiries yet</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student</th><th>Phone</th><th>Class</th><th>Course</th><th>Status</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnquiries.map((enq) => (
                    <tr key={enq.id}>
                      <td className="font-600 text-white">{enq.studentName}</td>
                      <td>{enq.phone}</td>
                      <td>{enq.class}</td>
                      <td>{enq.course || "—"}</td>
                      <td><span className={`badge ${STATUS_COLORS[enq.status] || "badge-gray"}`}>{enq.status}</span></td>
                      <td className="text-[var(--text-muted)]">{new Date(enq.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile card list */}
            <div className="sm:hidden flex flex-col divide-y divide-[var(--border)]">
              {recentEnquiries.map((enq) => (
                <Link key={enq.id} href="/admin/enquiries" className="flex items-center justify-between gap-3 py-3 hover:bg-white/3 transition-colors">
                  <div className="min-w-0">
                    <p className="font-600 text-white text-sm truncate">{enq.studentName}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{enq.phone} · Class {enq.class}</p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[enq.status] || "badge-gray"} text-[10px] flex-shrink-0`}>{enq.status}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Add Course", href: "/admin/courses", icon: BookOpen },
          { label: "Upload Gallery", href: "/admin/gallery", icon: Images },
          { label: "Add Result", href: "/admin/results", icon: Trophy },
          { label: "Add Announcement", href: "/admin/announcements", icon: Clock },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}
              className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors group">
              <Icon size={18} className="text-primary" />
              <span className="text-sm font-600 text-[var(--text-secondary)] group-hover:text-white transition-colors">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </AdminShell>
  );
}
