"use client";
import { MessageCircle, Phone, Camera } from "lucide-react";

const PHONE = "9403553309";
const WHATSAPP = "919403553309"; // international format for wa.me
const INSTAGRAM = "https://www.instagram.com/pathantutorials/";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-20 right-5 z-[100] flex flex-col gap-3 items-end">
      {/* Instagram */}
      <a
        href={INSTAGRAM}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn"
        style={{
          background:
            "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
        }}
        title="Follow on Instagram"
        aria-label="Instagram"
      >
        <Camera size={22} color="white" />
      </a>

      {/* Call */}
      <a
        href={`tel:${PHONE}`}
        className="floating-btn bg-primary animate-pulse-glow"
        title="Call Us"
        aria-label="Call"
      >
        <Phone size={22} color="black" />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn"
        style={{ background: "#25d366" }}
        title="Chat on WhatsApp"
        aria-label="WhatsApp"
      >
        <MessageCircle size={22} color="white" />
      </a>
    </div>
  );
}
