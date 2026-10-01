import { getCachedSiteSettings, getCachedCourses, getCachedTestimonials, getCachedAchievements, getCachedResults } from "@/lib/bff/cache";
import Hero from "@/components/public/Hero";
import Stats from "@/components/public/Stats";
import WhyChooseUs from "@/components/public/home/WhyChooseUs";
import CoursesPreview from "@/components/public/home/CoursesPreview";
import ResultsTeaser from "@/components/public/home/ResultsTeaser";
import AchievementsTeaser from "@/components/public/home/AchievementsTeaser";
import TestimonialsTeaser from "@/components/public/home/TestimonialsTeaser";
import PagesGrid from "@/components/public/home/PagesGrid";
import HomeCTA from "@/components/public/home/HomeCTA";

export default async function HomePage() {
  const [settingsRes, coursesRes, testimonialsRes, achievementsRes, resultsRes] = await Promise.allSettled([
    getCachedSiteSettings(),
    getCachedCourses(),
    getCachedTestimonials(),
    getCachedAchievements(),
    getCachedResults(),
  ]);

  const settings     = settingsRes.status     === "fulfilled" ? settingsRes.value     : null;
  const courses      = coursesRes.status      === "fulfilled" ? coursesRes.value      : [];
  const testimonials = testimonialsRes.status === "fulfilled" ? testimonialsRes.value : [];
  const achievements = achievementsRes.status === "fulfilled" ? achievementsRes.value : [];
  const results      = resultsRes.status      === "fulfilled" ? resultsRes.value      : [];

  return (
    <>
      <Hero />
      <Stats />
      <WhyChooseUs settings={settings} />
      <CoursesPreview courses={courses} />
      <ResultsTeaser results={results} />
      <AchievementsTeaser achievements={achievements} />
      <TestimonialsTeaser testimonials={testimonials} />
      <PagesGrid />
      <HomeCTA />
    </>
  );
}
