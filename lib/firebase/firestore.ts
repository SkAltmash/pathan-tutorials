import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  COLLECTIONS,
  DOC_IDS,
  SiteSettings,
  SEOSettings,
  HeroSettings,
  Statistic,
  Course,
  StudentResult,
  Achievement,
  GalleryImage,
  Testimonial,
  Faculty,
  Announcement,
  Enquiry,
  NavigationSettings,
  SectionVisibility,
  FloatingButtonsSettings,
} from "@/lib/types";

// ── Helpers ────────────────────────────────────────────────────
function withTimestamp<T extends object>(data: T): T & { updatedAt: string } {
  return { ...data, updatedAt: new Date().toISOString() };
}

// ── Site Settings ──────────────────────────────────────────────
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const ref = doc(db, COLLECTIONS.SETTINGS, DOC_IDS.SITE);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as SiteSettings) : null;
}

export async function saveSiteSettings(data: Partial<SiteSettings>) {
  const ref = doc(db, COLLECTIONS.SETTINGS, DOC_IDS.SITE);
  await setDoc(ref, withTimestamp(data), { merge: true });
}

// ── SEO Settings ───────────────────────────────────────────────
export async function getSEOSettings(): Promise<SEOSettings | null> {
  const ref = doc(db, COLLECTIONS.SEO, DOC_IDS.SEO);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as SEOSettings) : null;
}

export async function saveSEOSettings(data: Partial<SEOSettings>) {
  const ref = doc(db, COLLECTIONS.SEO, DOC_IDS.SEO);
  await setDoc(ref, withTimestamp(data), { merge: true });
}

// ── Hero Settings ──────────────────────────────────────────────
export async function getHeroSettings(): Promise<HeroSettings | null> {
  const ref = doc(db, COLLECTIONS.SETTINGS, DOC_IDS.HERO);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as HeroSettings) : null;
}

export async function saveHeroSettings(data: Partial<HeroSettings>) {
  const ref = doc(db, COLLECTIONS.SETTINGS, DOC_IDS.HERO);
  await setDoc(ref, withTimestamp(data), { merge: true });
}

// ── Navigation ─────────────────────────────────────────────────
export async function getNavigationSettings(): Promise<NavigationSettings | null> {
  const ref = doc(db, COLLECTIONS.NAVIGATION, DOC_IDS.NAVIGATION);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as NavigationSettings) : null;
}

export async function saveNavigationSettings(data: Partial<NavigationSettings>) {
  const ref = doc(db, COLLECTIONS.NAVIGATION, DOC_IDS.NAVIGATION);
  await setDoc(ref, withTimestamp(data), { merge: true });
}

// ── Section Visibility ─────────────────────────────────────────
export async function getSectionVisibility(): Promise<SectionVisibility | null> {
  const ref = doc(db, COLLECTIONS.SETTINGS, DOC_IDS.SECTIONS);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as SectionVisibility) : null;
}

export async function saveSectionVisibility(data: Partial<SectionVisibility>) {
  const ref = doc(db, COLLECTIONS.SETTINGS, DOC_IDS.SECTIONS);
  await setDoc(ref, withTimestamp(data), { merge: true });
}

// ── Floating Buttons ───────────────────────────────────────────
export async function getFloatingButtons(): Promise<FloatingButtonsSettings | null> {
  const ref = doc(db, COLLECTIONS.SETTINGS, DOC_IDS.FLOATING_BUTTONS);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as FloatingButtonsSettings) : null;
}

export async function saveFloatingButtons(data: Partial<FloatingButtonsSettings>) {
  const ref = doc(db, COLLECTIONS.SETTINGS, DOC_IDS.FLOATING_BUTTONS);
  await setDoc(ref, withTimestamp(data), { merge: true });
}

// ── Statistics ─────────────────────────────────────────────────
export async function getStatistics(): Promise<Statistic[]> {
  const ref = collection(db, COLLECTIONS.STATISTICS);
  const q = query(ref, orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Statistic))
    .filter((s) => s.isActive !== false);
}

export async function getAllStatistics(): Promise<Statistic[]> {
  const ref = collection(db, COLLECTIONS.STATISTICS);
  const q = query(ref, orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Statistic));
}

export async function addStatistic(data: Omit<Statistic, "id">) {
  const ref = collection(db, COLLECTIONS.STATISTICS);
  return await addDoc(ref, withTimestamp(data));
}

export async function updateStatistic(id: string, data: Partial<Statistic>) {
  const ref = doc(db, COLLECTIONS.STATISTICS, id);
  await updateDoc(ref, withTimestamp(data));
}

export async function deleteStatistic(id: string) {
  const ref = doc(db, COLLECTIONS.STATISTICS, id);
  await deleteDoc(ref);
}

// ── Courses ─────────────────────────────────────────────────────
export async function getCourses(): Promise<Course[]> {
  const ref = collection(db, COLLECTIONS.COURSES);
  const q = query(ref, orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Course))
    .filter((c) => c.isActive !== false);
}

export async function getAllCourses(): Promise<Course[]> {
  const ref = collection(db, COLLECTIONS.COURSES);
  const q = query(ref, orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course));
}

export async function addCourse(data: Omit<Course, "id">) {
  const ref = collection(db, COLLECTIONS.COURSES);
  return await addDoc(ref, withTimestamp(data));
}

export async function updateCourse(id: string, data: Partial<Course>) {
  const ref = doc(db, COLLECTIONS.COURSES, id);
  await updateDoc(ref, withTimestamp(data));
}

export async function deleteCourse(id: string) {
  const ref = doc(db, COLLECTIONS.COURSES, id);
  await deleteDoc(ref);
}

// ── Results ─────────────────────────────────────────────────────
export async function getResults(): Promise<StudentResult[]> {
  const ref = collection(db, COLLECTIONS.RESULTS);
  const snap = await getDocs(ref);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as StudentResult))
    .filter((r) => r.isActive !== false);
}

export async function getAllResults(): Promise<StudentResult[]> {
  const ref = collection(db, COLLECTIONS.RESULTS);
  const snap = await getDocs(ref);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as StudentResult));
}

export async function addResult(data: Omit<StudentResult, "id">) {
  const ref = collection(db, COLLECTIONS.RESULTS);
  return await addDoc(ref, withTimestamp(data));
}

export async function updateResult(id: string, data: Partial<StudentResult>) {
  const ref = doc(db, COLLECTIONS.RESULTS, id);
  await updateDoc(ref, withTimestamp(data));
}

export async function deleteResult(id: string) {
  const ref = doc(db, COLLECTIONS.RESULTS, id);
  await deleteDoc(ref);
}

// ── Achievements ───────────────────────────────────────────────
export async function getAchievements(): Promise<Achievement[]> {
  const ref = collection(db, COLLECTIONS.ACHIEVEMENTS);
  const q = query(ref, orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Achievement))
    .filter((a) => a.isActive !== false);
}

export async function getAllAchievements(): Promise<Achievement[]> {
  const ref = collection(db, COLLECTIONS.ACHIEVEMENTS);
  const q = query(ref, orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Achievement));
}

export async function addAchievement(data: Omit<Achievement, "id">) {
  const ref = collection(db, COLLECTIONS.ACHIEVEMENTS);
  return await addDoc(ref, withTimestamp(data));
}

export async function updateAchievement(id: string, data: Partial<Achievement>) {
  const ref = doc(db, COLLECTIONS.ACHIEVEMENTS, id);
  await updateDoc(ref, withTimestamp(data));
}

export async function deleteAchievement(id: string) {
  const ref = doc(db, COLLECTIONS.ACHIEVEMENTS, id);
  await deleteDoc(ref);
}

// ── Gallery ────────────────────────────────────────────────────
export async function getGallery(): Promise<GalleryImage[]> {
  const ref = collection(db, COLLECTIONS.GALLERY);
  const q = query(ref, orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as GalleryImage))
    .filter((g) => g.isActive !== false);
}

export async function getAllGallery(): Promise<GalleryImage[]> {
  const ref = collection(db, COLLECTIONS.GALLERY);
  const q = query(ref, orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryImage));
}

export async function addGalleryImage(data: Omit<GalleryImage, "id">) {
  const ref = collection(db, COLLECTIONS.GALLERY);
  return await addDoc(ref, withTimestamp(data));
}

export async function updateGalleryImage(id: string, data: Partial<GalleryImage>) {
  const ref = doc(db, COLLECTIONS.GALLERY, id);
  await updateDoc(ref, withTimestamp(data));
}

export async function deleteGalleryImage(id: string) {
  const ref = doc(db, COLLECTIONS.GALLERY, id);
  await deleteDoc(ref);
}

// ── Testimonials ───────────────────────────────────────────────
export async function getTestimonials(): Promise<Testimonial[]> {
  const ref = collection(db, COLLECTIONS.TESTIMONIALS);
  const snap = await getDocs(ref);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Testimonial))
    .filter((t) => t.isActive !== false);
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const ref = collection(db, COLLECTIONS.TESTIMONIALS);
  const snap = await getDocs(ref);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Testimonial));
}

export async function addTestimonial(data: Omit<Testimonial, "id">) {
  const ref = collection(db, COLLECTIONS.TESTIMONIALS);
  return await addDoc(ref, withTimestamp(data));
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>) {
  const ref = doc(db, COLLECTIONS.TESTIMONIALS, id);
  await updateDoc(ref, withTimestamp(data));
}

export async function deleteTestimonial(id: string) {
  const ref = doc(db, COLLECTIONS.TESTIMONIALS, id);
  await deleteDoc(ref);
}

// ── Faculty ────────────────────────────────────────────────────
export async function getFaculty(): Promise<Faculty[]> {
  const ref = collection(db, COLLECTIONS.FACULTY);
  const q = query(ref, orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Faculty))
    .filter((f) => f.isActive !== false);
}

export async function getAllFaculty(): Promise<Faculty[]> {
  const ref = collection(db, COLLECTIONS.FACULTY);
  const q = query(ref, orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Faculty));
}

export async function addFaculty(data: Omit<Faculty, "id">) {
  const ref = collection(db, COLLECTIONS.FACULTY);
  return await addDoc(ref, withTimestamp(data));
}

export async function updateFaculty(id: string, data: Partial<Faculty>) {
  const ref = doc(db, COLLECTIONS.FACULTY, id);
  await updateDoc(ref, withTimestamp(data));
}

export async function deleteFaculty(id: string) {
  const ref = doc(db, COLLECTIONS.FACULTY, id);
  await deleteDoc(ref);
}

// ── Announcements ──────────────────────────────────────────────
export async function getAnnouncements(): Promise<Announcement[]> {
  const ref = collection(db, COLLECTIONS.ANNOUNCEMENTS);
  const q = query(ref, where("isActive", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement));
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  const ref = collection(db, COLLECTIONS.ANNOUNCEMENTS);
  const snap = await getDocs(ref);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement));
}

export async function addAnnouncement(data: Omit<Announcement, "id">) {
  const ref = collection(db, COLLECTIONS.ANNOUNCEMENTS);
  return await addDoc(ref, withTimestamp(data));
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>) {
  const ref = doc(db, COLLECTIONS.ANNOUNCEMENTS, id);
  await updateDoc(ref, withTimestamp(data));
}

export async function deleteAnnouncement(id: string) {
  const ref = doc(db, COLLECTIONS.ANNOUNCEMENTS, id);
  await deleteDoc(ref);
}

// ── Enquiries ──────────────────────────────────────────────────
export async function getEnquiries(): Promise<Enquiry[]> {
  const ref = collection(db, COLLECTIONS.ENQUIRIES);
  const snap = await getDocs(ref);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Enquiry));
}

export async function addEnquiry(data: Omit<Enquiry, "id">) {
  const ref = collection(db, COLLECTIONS.ENQUIRIES);
  return await addDoc(ref, { ...data, createdAt: new Date().toISOString() });
}

export async function updateEnquiry(id: string, data: Partial<Enquiry>) {
  const ref = doc(db, COLLECTIONS.ENQUIRIES, id);
  await updateDoc(ref, withTimestamp(data));
}
