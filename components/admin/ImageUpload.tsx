"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import ImageCropModal from "./ImageCropModal";

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  /** Preview box aspect ratio */
  aspectRatio?: "square" | "wide" | "portrait" | "four-three";
  /** If true, shows crop modal before uploading */
  crop?: boolean;
  /** Aspect ratio enforced in crop modal. Defaults to 4/3 when crop=true */
  cropAspect?: number;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const ASPECT_CLASSES: Record<string, string> = {
  square: "aspect-square",
  wide: "aspect-video",
  portrait: "aspect-[3/4]",
  "four-three": "aspect-[4/3]",
};

export default function ImageUpload({
  label,
  value,
  onChange,
  folder = "pathan-tutorials",
  aspectRatio = "wide",
  crop = false,
  cropAspect = 4 / 3,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClass = ASPECT_CLASSES[aspectRatio] ?? "aspect-video";

  // ── Upload to Cloudinary ───────────────────────────────────────────────
  const uploadToCloudinary = useCallback(
    async (file: File | Blob, filename = "image.jpg") => {
      setUploading(true);
      const toastId = toast.loading("Uploading image…");
      try {
        const form = new FormData();
        form.append("file", file, filename);
        form.append("upload_preset", UPLOAD_PRESET);
        form.append("folder", folder);

        const res = await fetch(UPLOAD_URL, { method: "POST", body: form });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err?.error?.message || "Upload failed");
        }
        const data = await res.json();
        onChange(data.secure_url as string);
        toast.success("Image uploaded!", { id: toastId });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        toast.error(msg, { id: toastId });
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  // ── File picked (with or without crop) ────────────────────────────────
  const handleFile = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10 MB."); return; }

    if (crop) {
      // Show crop modal
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setCropSrc(reader.result as string);
    } else {
      uploadToCloudinary(file);
    }
  };

  // ── After crop done ────────────────────────────────────────────────────
  const handleCropDone = (blob: Blob) => {
    setCropSrc(null);
    uploadToCloudinary(blob, "cropped.jpg");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <>
      {/* Crop Modal */}
      {cropSrc && (
        <ImageCropModal
          src={cropSrc}
          aspect={cropAspect}
          onDone={handleCropDone}
          onClose={() => setCropSrc(null)}
        />
      )}

      <div className="flex flex-col gap-2">
        {label && <label className="form-label">{label}</label>}

        {/* Preview */}
        {value ? (
          <div className={`relative ${aspectClass} rounded-xl overflow-hidden border border-[var(--border)] group`}>
            <Image src={value} alt={label || "Uploaded image"} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg bg-primary text-black text-xs font-bold hover:bg-primary-light transition-colors"
              >
                {crop ? "Replace & Crop" : "Change"}
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                title="Remove"
              >
                <X size={14} />
              </button>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            )}
          </div>
        ) : (
          <div
            className={`${aspectClass} relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-[var(--border)] hover:border-primary/40 hover:bg-primary/5"
            }`}
            onClick={() => !uploading && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {uploading ? (
              <>
                <Loader2 size={28} className="animate-spin text-primary" />
                <p className="text-xs text-[var(--text-muted)]">Uploading…</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  {dragOver ? <Upload size={22} className="text-primary" /> : <ImageIcon size={22} className="text-primary/50" />}
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-semibold text-white">
                    {dragOver ? "Drop to upload" : "Click or drag image"}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    PNG, JPG, WebP · Max 10 MB{crop ? ` · Crop to ${cropAspect === 4 / 3 ? "4:3" : cropAspect === 1 ? "1:1" : "16:9"}` : ""}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {/* Manual URL fallback */}
        <div className="flex gap-2">
          <input
            type="url"
            className="form-input text-xs flex-1"
            placeholder="Or paste image URL directly…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button type="button" onClick={() => onChange("")} className="text-red-400 hover:text-red-300 px-2">
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
