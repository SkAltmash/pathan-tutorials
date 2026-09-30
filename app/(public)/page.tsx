import { getSiteSettings, getCourses, getTestimonials, getAchievements } from "@/lib/firebase/firestore";
import Hero from "@/components/public/Hero";
import Stats from "@/components/public/Stats";
import WhyChooseUs from "@/components/public/home/WhyChooseUs";
import CoursesPreview from "@/components/public/home/CoursesPreview";
import AchievementsTeaser from "@/components/public/home/AchievementsTeaser";
import TestimonialsTeaser from "@/components/public/home/TestimonialsTeaser";
import PagesGrid from "@/components/public/home/PagesGrid";
import HomeCTA from "@/components/public/home/HomeCTA";

export default async function HomePage() {
  const [settingsRes, coursesRes, testimonialsRes, achievementsRes] = await Promise.allSettled([
    getSiteSettings(),
    getCourses(),
    getTestimonials(),
    getAchievements(),
  ]);

  const settings     = settingsRes.status     === "fulfilled" ? settingsRes.value     : null;
  const courses      = coursesRes.status      === "fulfilled" ? coursesRes.value      : [];
  const testimonials = testimonialsRes.status === "fulfilled" ? testimonialsRes.value : [];
  const achievements = achievementsRes.status === "fulfilled" ? achievementsRes.value : [];

  return (
    <>
      <Hero />
      <Stats />
      <WhyChooseUs settings={settings} />
      <CoursesPreview courses={courses} />
      <AchievementsTeaser achievements={achievements} />
      <TestimonialsTeaser testimonials={testimonials} />
      <PagesGrid />
      <HomeCTA />
    </>
  );
}
