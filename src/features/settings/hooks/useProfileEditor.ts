"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProfile } from "@/store/slices/settingsSlice";
import { toast } from "@/lib/utils/toast";
import type { SettingsProfile, UpdateProfileInput } from "@/features/settings/types/settings.types";

function buildInitialForm(profile: SettingsProfile): UpdateProfileInput {
  return {
    fullName: profile.fullName,
    username: profile.username,
    email: profile.email,
    mobileNumber: profile.phone ?? "",
    countryCode: profile.countryCode ?? "",
    bio: profile.bio ?? "",
    instagramUrl: profile.instagramUrl ?? "",
    facebookUrl: profile.facebookUrl ?? "",
    twitterUrl: profile.twitterUrl ?? "",
    youtubeUrl: profile.youtubeUrl ?? "",
    dateOfBirth: profile.dateOfBirth ?? "",
    gender: profile.gender ?? "",
    avatarFile: null,
    coverFile: null,
  };
}

export function useProfileEditor(profile: SettingsProfile) {
  const dispatch = useAppDispatch();
  const saving = useAppSelector((state) => state.settings.savingProfile);
  const [form, setForm] = useState<UpdateProfileInput>(() => buildInitialForm(profile));
  const [dirty, setDirty] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  const setField = <TKey extends keyof UpdateProfileInput>(key: TKey, value: UpdateProfileInput[TKey]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);

    if (key === "avatarFile") {
      setAvatarPreviewUrl(value instanceof File ? URL.createObjectURL(value) : null);
    }
    if (key === "coverFile") {
      setCoverPreviewUrl(value instanceof File ? URL.createObjectURL(value) : null);
    }
  };

  const discard = () => {
    setForm(buildInitialForm(profile));
    setAvatarPreviewUrl(null);
    setCoverPreviewUrl(null);
    setDirty(false);
  };

  const save = async () => {
    try {
      await dispatch(updateProfile(form)).unwrap();
      toast.success("Profile updated successfully.");
      setAvatarPreviewUrl(null);
      setCoverPreviewUrl(null);
      setDirty(false);
    } catch {
      toast.error("Failed to save changes.");
    }
  };

  return {
    form,
    setField,
    dirty,
    saving,
    discard,
    save: () => void save(),
    avatarPreviewUrl,
    coverPreviewUrl,
  };
}
