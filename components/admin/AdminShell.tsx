"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import {
  LayoutDashboard, Settings, BookOpen, Trophy,
  Star, Images, Bell, MessageSquare, GraduationCap, Phone,
  Globe, LogOut, Menu, X,
} from "lucide-react";
import toast from "react-hot-toast";

interface NavGroup {
  label: string;
  items: { icon: React.ComponentType<{ size?: number }>; label: string; href: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    ],
  },
  {
    label: "Website Content",
    items: [
      { icon: Settings, label: "Site Settings", href: "/admin/settings" },
      { icon: BookOpen, label: "Courses", href: "/admin/courses" },
      { icon: Trophy, label: "Results", href: "/admin/results" },
      { icon: Star, label: "Achievements", href: "/admin/achievements" },
      { icon: GraduationCap, label: "Faculty", href: "/admin/faculty" },
      { icon: MessageSquare, label: "Testimonials", href: "/admin/testimonials" },
      { icon: Images, label: "Gallery", href: "/admin/gallery" },
      { icon: Bell, label: "Announcements", href: "/admin/announcements" },
      { icon: Phone, label: "Enquiries", href: "/admin/enquiries" },
    ],
  },
];


interface AdminShellProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminShell({ children, title }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/admin");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-primary/30">
            <Image src="/logo.jpeg" alt="PT" fill sizes="36px" className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-700 text-white leading-tight">Pathan Tutorials</p>
            <p className="text-[10px] text-primary">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="sidebar-section-label">{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`sidebar-link ${active ? "active" : ""}`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="px-2 py-1 mb-2">
            <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="sidebar-link text-red-400 hover:text-red-300 w-full">
            <LogOut size={16} />
            Sign Out
          </button>
          <Link href="/" className="sidebar-link mt-1">
            <Globe size={16} />
            View Website
          </Link>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <div className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {title && (
              <h1 className="text-base font-700 text-white">{title}</h1>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-[var(--text-muted)]">{user?.email}</span>
            <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
