"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface MediaLightboxProps {
  open: boolean;
  mediaType: "image" | "video";
  src: string | null;
  onClose: () => void;
}

export function MediaLightbox({ open, mediaType, src, onClose }: MediaLightboxProps) {
  if (!open || !src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      {mediaType === "video" ? (
        <video
          src={src}
          controls
          autoPlay
          playsInline
          onClick={(event) => event.stopPropagation()}
          className="max-h-full max-w-full rounded-lg"
        />
      ) : (
        <div className="relative h-full max-h-[90vh] w-full max-w-[90vw]" onClick={(event) => event.stopPropagation()}>
          <Image src={src} alt="" fill className="object-contain" sizes="90vw" />
        </div>
      )}
    </div>
  );
}
