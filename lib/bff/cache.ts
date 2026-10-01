/**
 * BFF data layer — server-only. Never import this in client components.
 * Client components must fetch from /api/* routes instead.
 */
import "server-only";

export {
  getSiteSettings as getCachedSiteSettings,
  getHeroSettings as getCachedHeroSettings,
  getNavigationSettings as getCachedNavigationSettings,
  getSectionVisibility as getCachedSectionVisibility,
  getFloatingButtons as getCachedFloatingButtons,
  getStatistics as getCachedStatistics,
  getCourses as getCachedCourses,
  getResults as getCachedResults,
  getAchievements as getCachedAchievements,
  getGallery as getCachedGallery,
  getTestimonials as getCachedTestimonials,
  getFaculty as getCachedFaculty,
  getAnnouncements as getCachedAnnouncements,
} from "@/lib/firebase/firestore";
