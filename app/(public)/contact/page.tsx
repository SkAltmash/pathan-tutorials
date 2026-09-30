"use client";
import { useState, useEffect } from "react";
import { getSiteSettings, addEnquiry } from "@/lib/firebase/firestore";
import { SiteSettings, Enquiry } from "@/lib/types";
import { Phone, MessageCircle, Mail, MapPin, ExternalLink, Send, CheckCircle2, Clock } from "lucide-react";
import toast from "react-hot-toast";

const CLASSES = ["8th", "9th", "10th", "11th", "12th", "Dropper"];
const BOARDS = ["CBSE", "Maharashtra State Board", "ICSE", "Other"];
const COURSES_LIST = [
  "8th Mathematics", "9th Mathematics", "10th Mathematics",
  "11th Mathematics", "12th Mathematics", "MHT-CET Mathematics", "Other",
];

const EMPTY_FORM = {
  studentName: "", parentName: "", phone: "", whatsapp: "",
  email: "", class: "", board: "", course: "", message: "",
};

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .catch(() => null);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName || !form.phone) {
      toast.error("Please fill in name and phone number.");
      return;
    }
    setLoading(true);
    try {
      await addEnquiry({
        ...form,
        status: "New",
        createdAt: new Date().toISOString(),
      } as Omit<Enquiry, "id">);
      toast.success("Enquiry submitted! We'll contact you shortly.");
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch {
      toast.error("Failed to submit. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const phone = settings?.phone || "";
  const whatsapp = settings?.whatsapp || phone;
  const email = settings?.email || "";
  const address = settings?.address || "";
  const mapsUrl = settings?.googleMapsUrl || "";
  const hours = settings?.openingHours || "";

  return (
    <div className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="py-12 sm:py-16 bg-[var(--bg-dark)] border-b border-[var(--border)]">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <span className="section-badge mb-4 inline-flex">
            <Phone size={14} /> Contact Us
          </span>
          <h1 className="section-title">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="section-subtitle mt-4">
            Have questions? Ready to enroll? Reach out and we'll respond quickly.
          </p>
          <div className="gold-divider mx-auto mt-6" />
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-[var(--bg-card)]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">

            {/* ── Contact Info ──────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <h2 className="font-display font-bold text-xl text-white">Contact Information</h2>

              <div className="grid gap-3">
                {phone && (
                  <a href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors group">
                    <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Phone size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Call Us</p>
                      <p className="text-base font-bold text-white">{phone}</p>
                    </div>
                  </a>
                )}

                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-green-500/30 transition-colors group">
                    <div className="w-11 h-11 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                      <MessageCircle size={18} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">WhatsApp</p>
                      <p className="text-base font-bold text-white">{whatsapp}</p>
                    </div>
                  </a>
                )}

                {email && (
                  <a href={`mailto:${email}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors group">
                    <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Email</p>
                      <p className="text-base font-bold text-white break-all">{email}</p>
                    </div>
                  </a>
                )}

                {address && (
                  <a href={mapsUrl || "#"} target={mapsUrl ? "_blank" : "_self"} rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors group">
                    <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Address</p>
                      <p className="text-sm font-semibold text-white">{address}</p>
                    </div>
                    {mapsUrl && <ExternalLink size={14} className="text-[var(--text-muted)] flex-shrink-0" />}
                  </a>
                )}

                {hours && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Clock size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Timings</p>
                      <p className="text-sm font-semibold text-white">{hours}</p>
                    </div>
                  </div>
                )}

                {/* If no contact info yet */}
                {!phone && !email && !address && (
                  <div className="text-center py-8 text-[var(--text-muted)]">
                    <p className="text-sm">Contact details not configured yet.</p>
                    <p className="text-xs mt-1">Please update from the Admin Panel → Site Settings.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Enquiry Form ──────────────────────────────── */}
            <div className="admin-card">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">Enquiry Submitted!</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Thank you for your interest. We'll contact you within 24 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline btn-sm">
                    Submit Another
                  </button>
                </div>
              ) : (
                <form id="enquiry-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h2 className="font-display font-bold text-lg text-white">Admission Enquiry</h2>
                  <p className="text-xs text-[var(--text-secondary)] -mt-2">Fields marked * are required</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Student Name *</label>
                      <input id="studentName" name="studentName" type="text" className="form-input"
                        placeholder="Student's full name" value={form.studentName} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="form-label">Parent Name</label>
                      <input id="parentName" name="parentName" type="text" className="form-input"
                        placeholder="Parent's name" value={form.parentName} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Phone *</label>
                      <input id="phone" name="phone" type="tel" className="form-input"
                        placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="form-label">WhatsApp</label>
                      <input id="whatsapp" name="whatsapp" type="tel" className="form-input"
                        placeholder="+91 XXXXXXXXXX" value={form.whatsapp} onChange={handleChange} />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Email</label>
                    <input id="email" name="email" type="email" className="form-input"
                      placeholder="Email address" value={form.email} onChange={handleChange} />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="form-label">Class</label>
                      <select id="class" name="class" className="form-select" value={form.class} onChange={handleChange}>
                        <option value="">Select</option>
                        {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Board</label>
                      <select id="board" name="board" className="form-select" value={form.board} onChange={handleChange}>
                        <option value="">Select</option>
                        {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Course</label>
                      <select id="course" name="course" className="form-select" value={form.course} onChange={handleChange}>
                        <option value="">Select</option>
                        {COURSES_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Message</label>
                    <textarea id="message" name="message" className="form-textarea" rows={3}
                      placeholder="Any specific query..." value={form.message} onChange={handleChange} />
                  </div>

                  <button id="submit-enquiry" type="submit" disabled={loading} className="btn-primary justify-center">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <><Send size={16} /> Submit Enquiry</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
