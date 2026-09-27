"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deletePackage, fetchPackages, resetPackages } from "@/store/slices/packagesSlice";
import type { CreatorPackage, PackagesPeriodFilter, PackagesSort, PackagesViewMode } from "@/features/packages/types/packages.types";
import { toast } from "@/lib/utils/toast";

function sortPackages(packages: CreatorPackage[], sort: PackagesSort): CreatorPackage[] {
  const sorted = [...packages];
  switch (sort) {
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "alphabetical":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case "newest":
    default:
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export function usePackagesFeed() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const { packages, status, error, hasMore, isLoadingMore, page, deletingId } = useAppSelector((state) => state.packages);

  const [periodFilter, setPeriodFilter] = useState<PackagesPeriodFilter>("all");
  const [sort, setSort] = useState<PackagesSort>("newest");
  const [viewMode, setViewMode] = useState<PackagesViewMode>("grid");
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CreatorPackage | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userId) return;
    dispatch(resetPackages());
    void dispatch(fetchPackages({ userId, page: 1, append: false }));
  }, [dispatch, userId]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !userId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasMore && status === "succeeded" && !isLoadingMore) {
          void dispatch(fetchPackages({ userId, page: page + 1, append: true }));
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [dispatch, userId, hasMore, status, isLoadingMore, page]);

  const filteredPackages = useMemo(() => {
    let items = packages;
    if (periodFilter !== "all") items = items.filter((pkg) => pkg.period === periodFilter);
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) items = items.filter((pkg) => pkg.name.toLowerCase().includes(normalizedQuery));
    return sortPackages(items, sort);
  }, [packages, periodFilter, query, sort]);

  const retry = useCallback(() => {
    if (!userId) return;
    void dispatch(fetchPackages({ userId, page: 1, append: false }));
  }, [dispatch, userId]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deletePackage({ packageId: deleteTarget.id })).unwrap();
      toast.success(`"${deleteTarget.name}" deleted.`);
    } catch {
      toast.error("Unable to delete package.");
    } finally {
      setDeleteTarget(null);
    }
  }, [dispatch, deleteTarget]);

  return {
    userId,
    packages: filteredPackages,
    resultCount: filteredPackages.length,
    totalCount: packages.length,
    status,
    error,
    hasMore,
    sentinelRef,
    retry,
    periodFilter,
    setPeriodFilter,
    sort,
    setSort,
    viewMode,
    setViewMode,
    query,
    setQuery,
    deleteTarget,
    openDelete: setDeleteTarget,
    closeDelete: () => setDeleteTarget(null),
    confirmDelete: () => void confirmDelete(),
    isDeleting: (packageId: string) => deletingId === packageId,
  };
}
