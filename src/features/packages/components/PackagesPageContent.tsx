"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { usePackagesFeed } from "@/features/packages/hooks/usePackagesFeed";
import { usePackageEditor } from "@/features/packages/hooks/usePackageEditor";
import { PackagesHeaderBar } from "@/features/packages/components/PackagesHeaderBar";
import { PackagesFilterChips } from "@/features/packages/components/PackagesFilterChips";
import { PackagesToolbar } from "@/features/packages/components/PackagesToolbar";
import { PackagesSkeleton } from "@/features/packages/components/PackagesSkeleton";
import { PackagesEmptyState } from "@/features/packages/components/PackagesEmptyState";
import { PackageCard } from "@/features/packages/components/PackageCard";
import { PackageListRow } from "@/features/packages/components/PackageListRow";
import { PackageFormModal } from "@/features/packages/components/PackageFormModal";
import { PackageDeleteModal } from "@/features/packages/components/PackageDeleteModal";

export function PackagesPageContent() {
  const router = useRouter();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const isCreator = user?.role === "creator";

  const {
    userId,
    packages,
    resultCount,
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
    openDelete,
    closeDelete,
    confirmDelete,
  } = usePackagesFeed();
  const editor = usePackageEditor(userId);

  useEffect(() => {
    if (isBootstrapped && !isCreator) {
      router.replace(ROUTES.HOME);
    }
  }, [isBootstrapped, isCreator, router]);

  if (!isBootstrapped || !isCreator) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  const isEmpty = status !== "loading" && status !== "failed" && packages.length === 0;
  const isFiltered = periodFilter !== "all" || query.trim().length > 0;

  const handleClearFilters = () => {
    setPeriodFilter("all");
    setQuery("");
  };

  return (
    <>
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
        <div className="mx-auto max-w-[900px]">
          <PackagesHeaderBar onCreate={editor.openCreate} />

          <PackagesFilterChips activeFilter={periodFilter} onSelect={setPeriodFilter} />

          <PackagesToolbar
            query={query}
            onQueryChange={setQuery}
            sort={sort}
            onSortChange={setSort}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            resultCount={resultCount}
          />

          {status === "loading" && packages.length === 0 && <PackagesSkeleton />}

          {status === "failed" && packages.length === 0 && (
            <SectionStateMessage
              variant="error"
              title="Couldn't load your packages"
              body={error ?? "Something went wrong. Please try again."}
              onRetry={retry}
              minHeightClassName="min-h-[40vh]"
            />
          )}

          {isEmpty && <PackagesEmptyState isFiltered={isFiltered} onClear={handleClearFilters} onCreate={editor.openCreate} />}

          {packages.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onEdit={() => editor.openEdit(pkg)}
                  onDuplicate={() => editor.openDuplicate(pkg)}
                  onDelete={() => openDelete(pkg)}
                />
              ))}
            </div>
          )}

          {packages.length > 0 && viewMode === "list" && (
            <div className="flex flex-col gap-2">
              {packages.map((pkg) => (
                <PackageListRow
                  key={pkg.id}
                  pkg={pkg}
                  onEdit={() => editor.openEdit(pkg)}
                  onDuplicate={() => editor.openDuplicate(pkg)}
                  onDelete={() => openDelete(pkg)}
                />
              ))}
            </div>
          )}

          {hasMore && packages.length > 0 && (
            <div ref={sentinelRef} className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-primary-light" aria-hidden="true" />
            </div>
          )}
        </div>
      </main>

      <PackageFormModal
        open={editor.open}
        isEditing={editor.isEditing}
        onClose={editor.close}
        form={editor.form}
        onFieldChange={editor.setField}
        saving={editor.saving}
        canSubmit={editor.canSubmit}
        onSubmit={editor.submit}
      />

      <PackageDeleteModal pkg={deleteTarget} onClose={closeDelete} onConfirm={confirmDelete} />
    </>
  );
}
