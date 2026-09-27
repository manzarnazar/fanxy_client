/**
 * image_upload requires a thumbnail `image` alongside every video (the
 * mobile app generates one from the video file). Captures an early frame
 * to a JPEG File client-side.
 */
export function captureVideoThumbnail(videoFile: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(videoFile);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;

    const cleanup = () => URL.revokeObjectURL(url);

    video.onloadeddata = () => {
      // Seek slightly in — frame 0 is often black.
      video.currentTime = Math.min(0.1, video.duration || 0.1);
    };
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 720;
      canvas.height = video.videoHeight || 1280;
      const context = canvas.getContext("2d");
      if (!context) {
        cleanup();
        reject(new Error("Canvas unavailable"));
        return;
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          cleanup();
          if (!blob) {
            reject(new Error("Thumbnail capture failed"));
            return;
          }
          resolve(new File([blob], "video_thumbnail.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.85,
      );
    };
    video.onerror = () => {
      cleanup();
      reject(new Error("Unable to read video for thumbnail"));
    };
  });
}
