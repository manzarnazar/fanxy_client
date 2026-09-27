"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMyPromoCodes } from "@/store/slices/promoCodesSlice";
import { toast } from "@/lib/utils/toast";
import type { PromoCode, PromoCodesFilter } from "@/features/promo-codes/types/promo-codes.types";

export function usePromoCodes() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const { promoCodes, status, error } = useAppSelector((state) => state.promoCodes);

  const [filter, setFilter] = useState<PromoCodesFilter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!userId || status !== "idle") return;
    void dispatch(fetchMyPromoCodes());
  }, [dispatch, userId, status]);

  const refresh = useCallback(() => {
    void dispatch(fetchMyPromoCodes());
  }, [dispatch]);

  const copyCode = useCallback(async (promo: PromoCode) => {
    try {
      await navigator.clipboard.writeText(promo.code);
      toast.success(`${promo.code.toUpperCase()} copied to clipboard.`);
    } catch {
      toast.error("Unable to copy the code.");
    }
  }, []);

  const derived = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const filtered = promoCodes.filter((promo) => {
      if (filter === "new-users" && !promo.newUsersOnly) return false;
      if (trimmed && !promo.code.toLowerCase().includes(trimmed) && !promo.name.toLowerCase().includes(trimmed)) {
        return false;
      }
      return true;
    });

    return {
      rows: filtered,
      counts: {
        all: promoCodes.length,
        newUsers: promoCodes.filter((promo) => promo.newUsersOnly).length,
      },
      maxDiscount: promoCodes.reduce((max, promo) => Math.max(max, promo.discountPercent), 0),
      avgDiscount:
        promoCodes.length > 0
          ? Math.round(promoCodes.reduce((sum, promo) => sum + promo.discountPercent, 0) / promoCodes.length)
          : 0,
    };
  }, [promoCodes, filter, query]);

  return {
    status,
    error,
    refresh,
    copyCode,
    filter,
    setFilter,
    query,
    setQuery,
    hasAny: promoCodes.length > 0,
    ...derived,
  };
}
