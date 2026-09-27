"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetUploadStatus, uploadPost } from "@/store/slices/myContentSlice";
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

export function useMyContentUpload() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const uploadStatus = useAppSelector((state) => state.myContent.uploadStatus);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<UploadPostInput>(buildInitialForm());

  const openUpload = () => {
    setForm(buildInitialForm());
    setOpen(true);
  };

  const closeUpload = () => {
    setOpen(false);
    dispatch(resetUploadStatus());
  };

  const setField = <TKey extends keyof UploadPostInput>(key: TKey, value: UploadPostInput[TKey]) => {
    if (key === "mediaFiles" && Array.isArray(value) && value.some((file) => file instanceof File && isVideoTooLarge(file))) {
      toast.error(VIDEO_TOO_LARGE_MESSAGE);
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = form.mediaFiles.length > 0 && (!form.isScheduled || (form.scheduleDate.length > 0 && form.scheduleTime.length > 0));

  const submit = async () => {
    if (!userId || !canSubmit) {
      toast.warning("Please add media before publishing.");
      return;
    }
    try {
      await dispatch(uploadPost({ userId, input: form })).unwrap();
      toast.success(form.isScheduled ? "Post scheduled successfully." : "Post published successfully.");
      setOpen(false);
    } catch {
      toast.error("Failed to publish post.");
    }
  };

  return {
    open,
    openUpload,
    closeUpload,
    form,
    setField,
    canSubmit,
    saving: uploadStatus === "loading",
    submit: () => void submit(),
  };
}
