"use client";
import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { X, Crop, Check, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface ImageCropModalProps {
  src: string;                          // blob / data-URL of chosen file
  aspect: number;                       // e.g. 4/3, 1, 16/9
  onDone: (blob: Blob) => void;
  onClose: () => void;
}

/** getCroppedImg — draws crop on a canvas and returns a Blob */
async function getCroppedImg(imageSrc: string, pixelCrop: Area, rotation = 0): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);
  ctx.drawImage(image, safeArea / 2 - image.width / 2, safeArea / 2 - image.height / 2);

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas is empty"));
    }, "image/jpeg", 0.92);
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

// ── Modal Component ───────────────────────────────────────────────────────────
export default function ImageCropModal({ src, aspect, onDone, onClose }: ImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImg(src, croppedAreaPixels, rotation);
      onDone(blob);
    } finally {
      setProcessing(false);
    }
  };

  const aspectLabel = aspect === 4 / 3 ? "4:3" : aspect === 1 ? "1:1" : aspect === 16 / 9 ? "16:9" : `${aspect}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Crop size={16} className="text-primary" />
            <span className="font-display font-700 text-white text-sm">Crop Image</span>
            <span className="text-[10px] font-600 uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {aspectLabel}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors">
            <X size={16} className="text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative w-full bg-black" style={{ height: 320 }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { background: "#000" },
              cropAreaStyle: { border: "2px solid hsl(45,90%,55%)" },
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 px-5 py-4 border-t border-[var(--border)]">
          {/* Zoom */}
          <div className="flex items-center gap-3">
            <ZoomOut size={14} className="text-[var(--text-muted)] flex-shrink-0" />
            <input
              type="range" min={1} max={3} step={0.05} value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-yellow-400 h-1"
            />
            <ZoomIn size={14} className="text-[var(--text-muted)] flex-shrink-0" />
            <span className="text-[10px] text-[var(--text-muted)] w-8 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Rotation */}
          <div className="flex items-center gap-3">
            <RotateCw size={14} className="text-[var(--text-muted)] flex-shrink-0" />
            <input
              type="range" min={0} max={360} step={1} value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1 accent-yellow-400 h-1"
            />
            <span className="text-[10px] text-[var(--text-muted)] w-8 text-right">{rotation}°</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="btn-outline btn-sm flex-1">Cancel</button>
            <button
              onClick={handleDone}
              disabled={processing}
              className="btn-primary btn-sm flex-1 justify-center"
            >
              {processing ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                <span className="flex items-center gap-1.5"><Check size={14} /> Apply Crop</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
