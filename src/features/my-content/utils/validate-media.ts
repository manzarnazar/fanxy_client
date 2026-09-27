// The server's PHP upload_max_filesize is 2 MB — larger videos are dropped
// before Laravel validation and image_upload fails with "The video failed
// to upload." Enforce the same cap client-side with a clear message.
export const MAX_VIDEO_UPLOAD_BYTES = 2 * 1024 * 1024;

export function isVideoTooLarge(file: File): boolean {
  return file.type.startsWith("video/") && file.size > MAX_VIDEO_UPLOAD_BYTES;
}

export const VIDEO_TOO_LARGE_MESSAGE = "Videos must be under 2 MB.";
