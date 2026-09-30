import { getSiteSettings, getNavigationSettings } from "@/lib/firebase/firestore";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import FloatingButtons from "@/components/public/FloatingButtons";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, nav] = await Promise.allSettled([
    getSiteSettings(),
    getNavigationSettings(),
  ]);

  const s = settings.status === "fulfilled" ? settings.value : null;
  const n = nav.status === "fulfilled" ? nav.value : null;

  return (
    <>
      <Navbar nav={n} settings={s} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={s} />
      <FloatingButtons />
    </>
  );
}
