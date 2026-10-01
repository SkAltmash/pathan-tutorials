"use client";
import { Phone } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa6";
import { SiteSettings } from "@/lib/types";

interface FloatingButtonsProps {
  settings?: SiteSettings | null;
}

export default function FloatingButtons({ settings }: FloatingButtonsProps) {
  const phone     = settings?.phone     || "";
  const whatsapp  = settings?.whatsapp  || settings?.phone || "";
  const instagram = settings?.instagramUrl || "";

  // Build wa.me number — strip non-digits; if doesn't start with 91 prefix, add it
  const waNumber = whatsapp.replace(/\D/g, "").replace(/^(?!91)/, "91");

  return (
    <div className="fixed bottom-20 right-5 z-[100] flex flex-col gap-3 items-end">
      {/* Instagram */}
      {instagram && (
        <a
          href={instagram}
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
          <FaInstagram size={22} color="white" />
        </a>
      )}

      {/* Call */}
      {phone && (
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="floating-btn bg-primary animate-pulse-glow"
          title="Call Us"
          aria-label="Call"
        >
          <Phone size={22} color="black" />
        </a>
      )}

      {/* WhatsApp */}
      {whatsapp && (
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn"
          style={{ background: "#25d366" }}
          title="Chat on WhatsApp"
          aria-label="WhatsApp"
        >
          <FaWhatsapp size={24} color="white" />
        </a>
      )}
    </div>
  );
}
