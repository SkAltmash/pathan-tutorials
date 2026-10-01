"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

// ── Validation Schema ──────────────────────────────────────────────────────
const enquirySchema = z.object({
  studentName: z.string().min(2, "Student name must be at least 2 characters"),
  parentName: z.string().optional(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number (starts with 6-9)"),
  whatsapp: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit number")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  class: z.string().min(1, "Please select a class"),
  board: z.string().min(1, "Please select a board"),
  course: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

const CLASSES = ["8th", "9th", "10th", "11th", "12th", "Dropper"];
const BOARDS = ["CBSE", "Maharashtra State Board", "ICSE", "Other"];
const COURSES_LIST = [
  "8th Mathematics", "9th Mathematics", "10th Mathematics",
  "11th Mathematics", "12th Mathematics", "MHT-CET Mathematics", "Other",
];

// ── Field Error Component ──────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-400 mt-1 animate-[fadeIn_0.2s_ease]">
      <AlertCircle size={11} className="flex-shrink-0" />
      {message}
    </p>
  );
}

// ── Main Form ──────────────────────────────────────────────────────────────
export default function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    mode: "onBlur",
    defaultValues: {
      studentName: "", parentName: "", phone: "", whatsapp: "",
      email: "", class: "", board: "", course: "", message: "",
    },
  });

  // Strip non-digit characters from phone fields as user types
  const handlePhoneInput = (field: "phone" | "whatsapp") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
      e.target.value = digits;
      setValue(field, digits, { shouldValidate: true });
    };

  const onSubmit = async (data: EnquiryFormData) => {
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Submission failed");
      }

      toast.success("Enquiry submitted! We'll contact you shortly.");
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit. Please try again.";
      toast.error(message);
      // Form data is preserved on error — user doesn't lose their input
    }
  };

  const handleReset = () => {
    reset();
    setSubmitted(false);
  };

  // ── Success State ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h3 className="font-display font-700 text-xl text-white">Enquiry Submitted!</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Thank you for your interest. We&apos;ll contact you within 24 hours.
        </p>
        <button onClick={handleReset} className="btn-outline btn-sm">
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <form id="enquiry-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <h3 className="font-display font-700 text-lg text-white">Admission Enquiry</h3>

      {/* Row 1: Student + Parent */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="field-studentName" className="form-label">
            Student Name <span className="text-red-500">*</span>
          </label>
          <input
            id="field-studentName"
            type="text"
            placeholder="Student name"
            className={`form-input ${errors.studentName ? "border-red-500/60 focus:border-red-500" : ""}`}
            {...register("studentName")}
          />
          <FieldError message={errors.studentName?.message} />
        </div>
        <div>
          <label htmlFor="field-parentName" className="form-label">Parent Name</label>
          <input
            id="field-parentName"
            type="text"
            placeholder="Parent name"
            className="form-input"
            {...register("parentName")}
          />
        </div>
      </div>

      {/* Row 2: Phone + WhatsApp */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="field-phone" className="form-label">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="field-phone"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="10-digit mobile"
            maxLength={10}
            className={`form-input ${errors.phone ? "border-red-500/60 focus:border-red-500" : ""}`}
            {...register("phone")}
            onChange={handlePhoneInput("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>
        <div>
          <label htmlFor="field-whatsapp" className="form-label">
            WhatsApp <span className="text-[var(--text-muted)] text-xs font-400">(if different)</span>
          </label>
          <input
            id="field-whatsapp"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="10-digit mobile"
            maxLength={10}
            className={`form-input ${errors.whatsapp ? "border-red-500/60 focus:border-red-500" : ""}`}
            {...register("whatsapp")}
            onChange={handlePhoneInput("whatsapp")}
          />
          <FieldError message={errors.whatsapp?.message} />
        </div>
      </div>

      {/* Row 3: Email */}
      <div>
        <label htmlFor="field-email" className="form-label">
          Email <span className="text-[var(--text-muted)] text-xs font-400">(optional)</span>
        </label>
        <input
          id="field-email"
          type="email"
          placeholder="your@email.com"
          className={`form-input ${errors.email ? "border-red-500/60 focus:border-red-500" : ""}`}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      {/* Row 4: Class + Board + Course */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="field-class" className="form-label">Class <span className="text-red-500">*</span></label>
          <select
            id="field-class"
            className={`form-select ${errors.class ? "border-red-500/60 focus:border-red-500" : ""}`}
            {...register("class")}>
            <option value="">Select</option>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <FieldError message={errors.class?.message} />
        </div>
        <div>
          <label htmlFor="field-board" className="form-label">Board <span className="text-red-500">*</span></label>
          <select
            id="field-board"
            className={`form-select ${errors.board ? "border-red-500/60 focus:border-red-500" : ""}`}
            {...register("board")}>
            <option value="">Select</option>
            {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <FieldError message={errors.board?.message} />
        </div>
        <div>
          <label htmlFor="field-course" className="form-label">Course</label>
          <select id="field-course" className="form-select" {...register("course")}>
            <option value="">Select</option>
            {COURSES_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Row 5: Message */}
      <div>
        <label htmlFor="field-message" className="form-label">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="field-message"
          placeholder="Any specific query or message... (min 10 characters)"
          rows={3}
          className={`form-textarea ${errors.message ? "border-red-500/60 focus:border-red-500" : ""}`}
          {...register("message")}
        />
        <FieldError message={errors.message?.message} />
      </div>

      {/* Submit */}
      <button
        id="submit-enquiry"
        type="submit"
        disabled={isSubmitting}
        className="btn-primary justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send size={16} />
            Submit Enquiry
          </>
        )}
      </button>

      <p className="text-xs text-[var(--text-muted)] text-center">
        Fields marked <span className="text-red-400">*</span> are required
      </p>
    </form>
  );
}
