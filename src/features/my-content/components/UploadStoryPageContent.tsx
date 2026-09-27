"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Play, Sparkles, UploadCloud, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { uploadStory } from "@/store/slices/myContentSlice";
import { ROUTES } from "@/lib/constants/routes";
import { toast } from "@/lib/utils/toast";

export function UploadStoryPageContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const isCreator = user?.role === "creator";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isBootstrapped && !isCreator) router.replace(ROUTES.HOME);
  }, [isBootstrapped, isCreator, router]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!isBootstrapped || !isCreator) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  const mediaType: "image" | "video" = file?.type.startsWith("video/") ? "video" : "image";

  const handleFile = (selected: File) => {
    setFile(selected);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const clearMedia = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.warning("Add a photo or video first.");
      return;
    }
    setSaving(true);
    const result = await dispatch(uploadStory({ description: description.trim(), mediaType, file }));
    setSaving(false);
    if (uploadStory.fulfilled.match(result)) {
      toast.success("Story published successfully.");
      router.push(ROUTES.MY_CONTENT);
    } else {
      toast.error("Failed to publish story.");
    }
  };

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[420px]">
        <div className="mb-5 text-center">
          <h1 className="font-display text-[26px] leading-tight font-semibold text-text-primary">Upload Story</h1>
          <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
            Stories are visible to your fans for 24 hours.
          </p>
        </div>

        {file && previewUrl ? (
          <div className="relative aspect-[9/16] overflow-hidden rounded-[24px] border border-primary/16 bg-surface">
            {mediaType === "video" ? (
              <video src={previewUrl} controls playsInline className="h-full w-full object-cover" />
            ) : (
              <Image src={previewUrl} alt="" fill sizes="420px" className="object-cover" unoptimized />
            )}
            <button
              type="button"
              onClick={clearMedia}
              aria-label="Remove media"
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-md bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            {mediaType === "video" && (
              <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 font-sans text-[10px] font-semibold text-white backdrop-blur-sm">
                <Play className="h-3 w-3" aria-hidden="true" />
                Video
              </span>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-[9/16] w-full flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-primary/24 bg-surface/40 transition hover:border-primary/50 hover:bg-primary/6"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/12 text-primary-light">
              <UploadCloud className="h-8 w-8" aria-hidden="true" />
            </span>
            <span className="font-sans text-[14px] font-semibold text-text-primary">Add photo or video</span>
            <span className="font-sans text-[11.5px] font-light text-text-secondary/65">Portrait works best</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
          className="hidden"
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (selected) handleFile(selected);
            event.target.value = "";
          }}
        />

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={2}
          placeholder="Add a caption… (optional)"
          className="mt-4 w-full resize-none rounded-md border border-primary/16 bg-surface/70 px-3.5 py-2.5 font-sans text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/45 focus:outline-none"
        />

        <button
          type="button"
          disabled={saving || !file}
          onClick={() => void handleSubmit()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark px-5 py-3.5 font-sans text-[14.5px] font-semibold text-white transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Sparkles className="h-5 w-5" aria-hidden="true" />}
          Publish Story
        </button>
      </div>
    </main>
  );
}
