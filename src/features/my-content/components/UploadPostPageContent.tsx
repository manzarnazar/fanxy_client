"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarClock, Camera, Loader2, MessageCircle, Play, UploadCloud, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { uploadPost } from "@/store/slices/myContentSlice";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/utils/toast";
import { isVideoTooLarge, VIDEO_TOO_LARGE_MESSAGE } from "@/features/my-content/utils/validate-media";
import type { UploadPostInput } from "@/features/my-content/types/my-content.types";

function buildInitialForm(): UploadPostInput {
  return {
    title: "",
    description: "",
    mediaFiles: [],
    mediaType: "image",
    isCommentEnabled: true,
    isScheduled: false,
    scheduleDate: "",
    scheduleTime: "",
  };
}

interface MediaPreview {
  file: File;
  url: string;
  isVideo: boolean;
}

export function UploadPostPageContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const isCreator = user?.role === "creator";
  const saving = useAppSelector((state) => state.myContent.uploadStatus === "loading");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<UploadPostInput>(buildInitialForm);
  const [previews, setPreviews] = useState<MediaPreview[]>([]);

  useEffect(() => {
    if (isBootstrapped && !isCreator) router.replace(ROUTES.HOME);
  }, [isBootstrapped, isCreator, router]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isBootstrapped || !isCreator || !user) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  const setField = <TKey extends keyof UploadPostInput>(key: TKey, value: UploadPostInput[TKey]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFiles = (files: File[]) => {
    const accepted = files.filter((file) => {
      if (isVideoTooLarge(file)) {
        toast.error(`${file.name}: ${VIDEO_TOO_LARGE_MESSAGE}`);
        return false;
      }
      return true;
    });
    if (accepted.length === 0) return;
    setField("mediaFiles", [...form.mediaFiles, ...accepted]);
    setPreviews((prev) => [
      ...prev,
      ...accepted.map((file) => ({ file, url: URL.createObjectURL(file), isVideo: file.type.startsWith("video/") })),
    ]);
  };

  const removeMedia = (index: number) => {
    const preview = previews[index];
    if (preview) URL.revokeObjectURL(preview.url);
    setField(
      "mediaFiles",
      form.mediaFiles.filter((_, itemIndex) => itemIndex !== index),
    );
    setPreviews((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const canSubmit =
    form.mediaFiles.length > 0 && (!form.isScheduled || (form.scheduleDate.length > 0 && form.scheduleTime.length > 0));

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.warning(form.mediaFiles.length > 0 ? "Pick a schedule date and time." : "Add a photo or video first.");
      return;
    }
    const result = await dispatch(uploadPost({ userId: user.id, input: form }));
    if (uploadPost.fulfilled.match(result)) {
      toast.success(form.isScheduled ? "Post scheduled successfully." : "Post published successfully.");
      router.push(form.isScheduled ? ROUTES.SCHEDULED_POSTS : ROUTES.MY_CONTENT);
    } else {
      toast.error("Failed to publish post.");
    }
  };

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-5">
          <h1 className="font-display text-[26px] leading-tight font-semibold text-text-primary">Upload Post</h1>
          <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
            Share a photo or video with your fans — publish now or schedule it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
          {/* Media — multiple items become one post_content array */}
          <div>
            {previews.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {previews.map((preview, index) => (
                  <div
                    key={preview.url}
                    className="relative aspect-square overflow-hidden rounded-[16px] border border-primary/16 bg-surface"
                  >
                    {preview.isVideo ? (
                      <video src={preview.url} playsInline muted className="h-full w-full object-cover" />
                    ) : (
                      <Image src={preview.url} alt="" fill sizes="220px" className="object-cover" unoptimized />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      aria-label={`Remove media ${index + 1}`}
                      className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-md bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    {preview.isVideo && (
                      <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 font-sans text-[9.5px] font-semibold text-white backdrop-blur-sm">
                        <Play className="h-2.5 w-2.5" aria-hidden="true" />
                        Video
                      </span>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-[16px] border-2 border-dashed border-primary/24 bg-surface/40 transition hover:border-primary/50 hover:bg-primary/6"
                >
                  <UploadCloud className="h-7 w-7 text-primary-light" aria-hidden="true" />
                  <span className="font-sans text-[12px] font-medium text-text-secondary">Add more</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed border-primary/24 bg-surface/40 transition hover:border-primary/50 hover:bg-primary/6"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/12 text-primary-light">
                  <UploadCloud className="h-8 w-8" aria-hidden="true" />
                </span>
                <span className="font-sans text-[14px] font-semibold text-text-primary">Add photos or videos</span>
                <span className="font-sans text-[11.5px] font-light text-text-secondary/65">
                  Select one or more files from your device
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
              className="hidden"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                if (files.length > 0) handleFiles(files);
                event.target.value = "";
              }}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block font-sans text-[11.5px] font-medium tracking-wide text-text-secondary/70 uppercase">
                Title <span className="normal-case opacity-60">(optional)</span>
              </label>
              <input
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
                placeholder="Give your post a title…"
                className="h-12 w-full rounded-md border border-primary/16 bg-surface/70 px-3.5 font-sans text-[13.5px] text-text-primary placeholder:text-text-muted focus:border-primary/45 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-sans text-[11.5px] font-medium tracking-wide text-text-secondary/70 uppercase">
                Description <span className="normal-case opacity-60">(optional)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(event) => setField("description", event.target.value)}
                rows={4}
                placeholder="Tell your fans about this post…"
                className="w-full resize-none rounded-md border border-primary/16 bg-surface/70 px-3.5 py-2.5 font-sans text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/45 focus:outline-none"
              />
            </div>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-primary/12 bg-surface/50 px-4 py-3">
              <span className="flex items-center gap-2.5">
                <MessageCircle className="h-4.5 w-4.5 text-primary-light" aria-hidden="true" />
                <span className="font-sans text-[13px] font-medium text-text-primary">Allow comments</span>
              </span>
              <input
                type="checkbox"
                checked={form.isCommentEnabled}
                onChange={(event) => setField("isCommentEnabled", event.target.checked)}
                className="h-4 w-4 accent-[#0085c7]"
              />
            </label>

            <div className="rounded-xl border border-primary/12 bg-surface/50 px-4 py-3">
              <label className="flex cursor-pointer items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <CalendarClock className="h-4.5 w-4.5 text-primary-light" aria-hidden="true" />
                  <span className="font-sans text-[13px] font-medium text-text-primary">Schedule for later</span>
                </span>
                <input
                  type="checkbox"
                  checked={form.isScheduled}
                  onChange={(event) => setField("isScheduled", event.target.checked)}
                  className="h-4 w-4 accent-[#0085c7]"
                />
              </label>

              {form.isScheduled && (
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <input
                    type="date"
                    value={form.scheduleDate}
                    onChange={(event) => setField("scheduleDate", event.target.value)}
                    aria-label="Schedule date"
                    className="h-11 rounded-md border border-primary/16 bg-surface/70 px-3 font-sans text-[13px] text-text-primary focus:border-primary/45 focus:outline-none"
                  />
                  <input
                    type="time"
                    value={form.scheduleTime}
                    onChange={(event) => setField("scheduleTime", event.target.value)}
                    aria-label="Schedule time"
                    className="h-11 rounded-md border border-primary/16 bg-surface/70 px-3 font-sans text-[13px] text-text-primary focus:border-primary/45 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={saving || !canSubmit}
              onClick={() => void handleSubmit()}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-3.5 font-sans text-[14.5px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50",
              )}
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Camera className="h-5 w-5" aria-hidden="true" />}
              {form.isScheduled ? "Schedule Post" : "Publish Post"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
