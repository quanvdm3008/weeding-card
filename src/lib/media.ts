import { apiRequest, ApiError } from "@/lib/api";

export interface MediaUploadResult {
  url: string;
  key: string;
  contentType: string;
  size: number;
}

/**
 * Upload photos/music to backend (Cloudinary). Backend without CLOUDINARY_ENABLED will return 404 —
 * use isMediaUploadUnavailable to display instructions instead of generic errors.
 */
export function uploadMedia(file: File): Promise<MediaUploadResult> {
  const form = new FormData();
  form.append("file", file);
  return apiRequest<MediaUploadResult>("/api/media/upload", {
    method: "POST",
    body: form,
  });
}

export function isMediaUploadUnavailable(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}
