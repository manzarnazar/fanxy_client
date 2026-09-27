"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { useMyContentFeed } from "@/features/my-content/hooks/useMyContentFeed";
import { useMyContentUpload } from "@/features/my-content/hooks/useMyContentUpload";
import { MyContentHeaderBar } from "@/features/my-content/components/MyContentHeaderBar";
import { MyContentTabs } from "@/features/my-content/components/MyContentTabs";
import { MyContentToolbar } from "@/features/my-content/components/MyContentToolbar";
import { MyContentSkeleton } from "@/features/my-content/components/MyContentSkeleton";
import { MyContentEmptyState } from "@/features/my-content/components/MyContentEmptyState";
import { MyContentCard } from "@/features/my-content/components/MyContentCard";
import { MyContentListRow } from "@/features/my-content/components/MyContentListRow";
import { MyContentPreviewModal } from "@/features/my-content/components/MyContentPreviewModal";
import { MyContentDeleteModal } from "@/features/my-content/components/MyContentDeleteModal";
import { MyContentRightSidebar } from "@/features/my-content/components/MyContentRightSidebar";
import { MyContentUploadModal } from "@/features/my-content/components/MyContentUploadModal";
import type { ContentItem } from "@/features/my-content/types/my-content.types";

export function MyContentPageContent() {
  const router = useRouter();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const isCreator = user?.role === "creator";

  const {
    tab,
    setTab,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    query,
    setQuery,
    items,
    resultCount,
    postsTotalCount,
    storiesTotalCount,
    status,
    error,
    hasMore,
    sentinelRef,
    retry,
    deleteItem,
    topPerforming,
  } = useMyContentFeed();
  const upload = useMyContentUpload();
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);

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

  const isEmpty = status !== "loading" && status !== "failed" && items.length === 0;
  const isFiltered = statusFilter !== "all" || query.trim().length > 0;

  const handleClearFilters = () => {
    setStatusFilter("all");
    setQuery("");
  };

  const handleConfirmDelete = (item: ContentItem) => {
    setDeleteTarget(null);
    deleteItem(item);
  };

  return (
    <>
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
        <div className="mx-auto max-w-[900px]">
          <MyContentHeaderBar onUpload={upload.openUpload} />

          <MyContentTabs activeTab={tab} onSelect={setTab} postsCount={postsTotalCount} storiesCount={storiesTotalCount} />

          <MyContentToolbar
            tab={tab}
            query={query}
            onQueryChange={setQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            resultCount={resultCount}
          />

          {status === "loading" && items.length === 0 && <MyContentSkeleton />}

          {status === "failed" && items.length === 0 && (
            <SectionStateMessage
              variant="error"
              title="Couldn't load your content"
              body={error ?? "Something went wrong. Please try again."}
              onRetry={retry}
              minHeightClassName="min-h-[40vh]"
            />
          )}

          {isEmpty && <MyContentEmptyState isFiltered={isFiltered} onClear={handleClearFilters} />}

          {items.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {items.map((item) => (
                <MyContentCard key={item.id} item={item} onPreview={() => setPreviewItem(item)} onDelete={() => setDeleteTarget(item)} />
              ))}
            </div>
          )}

          {items.length > 0 && viewMode !== "grid" && (
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <MyContentListRow
                  key={item.id}
                  item={item}
                  viewMode={viewMode === "compact" ? "compact" : "list"}
                  onPreview={() => setPreviewItem(item)}
                  onDelete={() => setDeleteTarget(item)}
                />
              ))}
            </div>
          )}

          {hasMore && items.length > 0 && (
            <div ref={sentinelRef} className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-primary-light" aria-hidden="true" />
            </div>
          )}
        </div>
      </main>

      <MyContentRightSidebar topPerforming={topPerforming} />

      <MyContentPreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
      <MyContentDeleteModal item={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} />
      <MyContentUploadModal
        open={upload.open}
        onClose={upload.closeUpload}
        form={upload.form}
        onFieldChange={upload.setField}
        saving={upload.saving}
        canSubmit={upload.canSubmit}
        onSubmit={upload.submit}
      />
    </>
  );
}
