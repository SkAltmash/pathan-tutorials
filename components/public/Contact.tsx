"use client";
import { useState } from "react";
import { addEnquiry } from "@/lib/firebase/firestore";
import { Enquiry } from "@/lib/types";
import { Phone, MessageCircle, Mail, MapPin, ExternalLink, Send, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { SiteSettings } from "@/lib/types";

interface ContactProps {
  settings: SiteSettings | null;
}

const CLASSES = ["8th", "9th", "10th", "11th", "12th", "Dropper"];
const BOARDS = ["CBSE", "Maharashtra State Board", "ICSE", "Other"];
const COURSES_LIST = ["8th Mathematics", "9th Mathematics", "10th Mathematics", "11th Mathematics", "12th Mathematics", "MHT-CET Mathematics", "Other"];

export default function Contact({ settings }: ContactProps) {
  const [form, setForm] = useState({
    studentName: "", parentName: "", phone: "", whatsapp: "", email: "",
    class: "", board: "", course: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const phone = settings?.phone || "+91 XXXXXXXXXX";
  const whatsapp = settings?.whatsapp || settings?.phone || "+91 XXXXXXXXXX";
  const email = settings?.email || "pathantutorials@gmail.com";
  const address = settings?.address || "Hinganghat, Maharashtra";
  const mapsUrl = settings?.googleMapsUrl || "https://maps.google.com";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName || !form.phone) {
      toast.error("Please fill in required fields.");
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
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-[var(--bg-dark)]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <span className="section-badge">
            <Phone size={14} />
            Contact Us
          </span>
          <h2 className="section-title">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="section-subtitle">
            Have questions? Ready to enroll? Reach out and we'll get back to you quickly.
          </p>
          <div className="gold-divider" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* ── Left: Contact Info ─────────────────────────── */}
          <div className="flex flex-col gap-6">
            <h3 className="font-display font-700 text-xl text-white">Contact Information</h3>

            {/* Quick Contact Cards */}
            <div className="grid gap-3">
              <a href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors group">
                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-600 text-[var(--text-muted)] uppercase tracking-wide">Call Us</p>
                  <p className="text-base font-700 text-white">{phone}</p>
                </div>
              </a>

              <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-green-500/30 transition-colors group">
                <div className="w-11 h-11 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <MessageCircle size={18} className="text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-600 text-[var(--text-muted)] uppercase tracking-wide">WhatsApp</p>
                  <p className="text-base font-700 text-white">{whatsapp}</p>
                </div>
              </a>

              <a href={`mailto:${email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors group">
                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Mail size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-600 text-[var(--text-muted)] uppercase tracking-wide">Email</p>
                  <p className="text-base font-700 text-white">{email}</p>
                </div>
              </a>

              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary/30 transition-colors group">
                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-600 text-[var(--text-muted)] uppercase tracking-wide">Address</p>
                  <p className="text-sm font-600 text-white">{address}</p>
                </div>
                <ExternalLink size={14} className="text-[var(--text-muted)] group-hover:text-primary transition-colors flex-shrink-0" />
              </a>
            </div>

            {/* Opening Hours */}
            {settings?.openingHours && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs font-700 uppercase tracking-wide text-primary mb-1">Opening Hours</p>
                <p className="text-sm text-[var(--text-secondary)]">{settings.openingHours}</p>
              </div>
            )}
          </div>

          {/* ── Right: Enquiry Form ────────────────────────── */}
          <div className="admin-card">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h3 className="font-display font-700 text-xl text-white">Enquiry Submitted!</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Thank you for your interest. We'll contact you within 24 hours.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-outline btn-sm">Submit Another</button>
              </div>
            ) : (
              <form id="enquiry-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="font-display font-700 text-lg text-white">Admission Enquiry</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Student Name <span className="text-red-500">*</span></label>
                    <input id="field-studentName" name="studentName" type="text" className="form-input" placeholder="Student name" value={form.studentName} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="form-label">Parent Name</label>
                    <input id="field-parentName" name="parentName" type="text" className="form-input" placeholder="Parent name" value={form.parentName} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Phone <span className="text-red-500">*</span></label>
                    <input id="field-phone" name="phone" type="tel" className="form-input" placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="form-label">WhatsApp</label>
                    <input id="field-whatsapp" name="whatsapp" type="tel" className="form-input" placeholder="+91 XXXXXXXXXX" value={form.whatsapp} onChange={handleChange} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Email</label>
                  <input id="field-email" name="email" type="email" className="form-input" placeholder="Email address" value={form.email} onChange={handleChange} />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Class</label>
                    <select id="field-class" name="class" className="form-select" value={form.class} onChange={handleChange}>
                      <option value="">Select</option>
                      {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Board</label>
                    <select id="field-board" name="board" className="form-select" value={form.board} onChange={handleChange}>
                      <option value="">Select</option>
                      {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Course</label>
                    <select id="field-course" name="course" className="form-select" value={form.course} onChange={handleChange}>
                      <option value="">Select</option>
                      {COURSES_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Message</label>
                  <textarea id="field-message" name="message" className="form-textarea" placeholder="Any specific query or message..." value={form.message} onChange={handleChange} rows={3} />
                </div>

                <button id="submit-enquiry" type="submit" disabled={loading} className="btn-primary justify-center">
                  {loading ? "Submitting..." : (
                    <>
                      <Send size={16} />
                      Submit Enquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
