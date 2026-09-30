import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function HomeCTA() {
  return (
    <section className="py-16 sm:py-20 bg-[var(--bg-dark)] border-t border-[var(--border)]">
      <div className="container-custom text-center max-w-2xl mx-auto flex flex-col items-center gap-6 px-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <BookOpen size={28} className="text-primary" />
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          Ready to Excel in Mathematics?
        </h2>
        <p className="text-[var(--text-secondary)] text-base max-w-md">
          Join Pathan Tutorials today. Expert coaching for Classes 8–12 and MHT-CET in Hinganghat.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/contact" className="btn-primary justify-center">
            Enquire Now <ArrowRight size={16} />
          </Link>
          <Link href="/about" className="btn-outline justify-center">About Us</Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a href="tel:9403553309"
            className="flex items-center gap-2 text-primary font-bold text-lg hover:text-primary-light transition-colors">
            📞 9403553309
          </a>
          <span className="hidden sm:block text-[var(--border)]">·</span>
          <a href="https://wa.me/919403553309" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-400 font-semibold hover:text-green-300 transition-colors">
            💬 WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
