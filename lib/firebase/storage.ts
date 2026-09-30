import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase/config";

export type StorageFolder =
  | "logo"
  | "hero"
  | "courses"
  | "gallery"
  | "students"
  | "results"
  | "faculty"
  | "testimonials"
  | "achievements"
  | "announcements";

export async function uploadFile(
  file: File,
  folder: StorageFolder
): Promise<{ url: string; path: string }> {
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const path = `${folder}/${fileName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
}
