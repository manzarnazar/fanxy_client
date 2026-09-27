"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createPackage, editPackage } from "@/store/slices/packagesSlice";
import { toast } from "@/lib/utils/toast";
import type { CreatorPackage, PackageFormInput } from "@/features/packages/types/packages.types";

function buildEmptyForm(): PackageFormInput {
  return { name: "", price: "", period: "Month", periodCount: "1", canChat: false, canViewLiveStream: false };
}

// can_chat / can_view_live_stream are write-only on the real backend — the
// list endpoint never echoes them back, so editing or duplicating an
// existing package can't know its current flags and starts them unset.
function buildFormFromPackage(pkg: CreatorPackage): PackageFormInput {
  return {
    name: pkg.name,
    price: String(pkg.price),
    period: pkg.period,
    periodCount: String(pkg.periodCount),
    canChat: false,
    canViewLiveStream: false,
  };
}

export function usePackageEditor(userId: string | null) {
  const dispatch = useAppDispatch();
  const saving = useAppSelector((state) => state.packages.saving);
  const [open, setOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [form, setForm] = useState<PackageFormInput>(buildEmptyForm());

  const openCreate = () => {
    setEditingPackageId(null);
    setForm(buildEmptyForm());
    setOpen(true);
  };

  const openEdit = (pkg: CreatorPackage) => {
    setEditingPackageId(pkg.id);
    setForm(buildFormFromPackage(pkg));
    setOpen(true);
  };

  const openDuplicate = (pkg: CreatorPackage) => {
    setEditingPackageId(null);
    setForm(buildFormFromPackage(pkg));
    setOpen(true);
  };

  const close = () => setOpen(false);

  const setField = <TKey extends keyof PackageFormInput>(key: TKey, value: PackageFormInput[TKey]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = form.name.trim().length > 0 && Number(form.price) > 0 && Number(form.periodCount) > 0;

  const submit = async () => {
    if (!userId || !canSubmit) {
      toast.warning("Please complete all required fields.");
      return;
    }
    try {
      if (editingPackageId) {
        await dispatch(editPackage({ userId, packageId: editingPackageId, input: form })).unwrap();
        toast.success("Package updated successfully.");
      } else {
        await dispatch(createPackage({ userId, input: form })).unwrap();
        toast.success("Package created successfully.");
      }
      setOpen(false);
    } catch {
      toast.error("Failed to save package.");
    }
  };

  return {
    open,
    isEditing: editingPackageId !== null,
    openCreate,
    openEdit,
    openDuplicate,
    close,
    form,
    setField,
    canSubmit,
    saving,
    submit: () => void submit(),
  };
}
