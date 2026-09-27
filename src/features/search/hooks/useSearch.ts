"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { runSearch, searchCleared, searchQueryChanged } from "@/store/slices/searchSlice";
import {
  clearRecentSearches,
  getRecentSearchesServerSnapshot,
  getRecentSearchesSnapshot,
  removeRecentSearch,
  saveRecentSearch,
  subscribeRecentSearches,
} from "@/features/search/utils/recent-searches";
import type { SearchCategory } from "@/features/search/types/search.types";

const SEARCH_DEBOUNCE_MS = 400;

export function useSearch() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { query, results, hasMore, page, status, isLoadingMore, error } = useAppSelector((state) => state.search);

  const [category, setCategory] = useState<SearchCategory>("all");
  const recentSearches = useSyncExternalStore(
    subscribeRecentSearches,
    getRecentSearchesSnapshot,
    getRecentSearchesServerSnapshot,
  );

  // Seed the ?q= param (from the header's search overlay) once; clear on leave.
  useEffect(() => {
    const initial = searchParams.get("q")?.trim();
    if (initial) dispatch(searchQueryChanged(initial));
    return () => {
      dispatch(searchCleared());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search whenever the query changes.
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const timer = window.setTimeout(() => {
      void dispatch(runSearch({ query: trimmed, page: 1, append: false }));
      saveRecentSearch(trimmed);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [dispatch, query]);

  const setQuery = useCallback(
    (value: string) => {
      dispatch(searchQueryChanged(value));
    },
    [dispatch],
  );

  const loadMore = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed || !hasMore || isLoadingMore) return;
    void dispatch(runSearch({ query: trimmed, page: page + 1, append: true }));
  }, [dispatch, query, hasMore, isLoadingMore, page]);

  const retry = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    void dispatch(runSearch({ query: trimmed, page: 1, append: false }));
  }, [dispatch, query]);

  const removeRecent = useCallback((value: string) => {
    removeRecentSearch(value);
  }, []);

  const clearRecents = useCallback(() => {
    clearRecentSearches();
  }, []);

  const filteredResults = useMemo(() => {
    if (category === "creators") return results.filter((result) => result.isCreator);
    if (category === "users") return results.filter((result) => !result.isCreator);
    return results;
  }, [results, category]);

  return {
    query,
    setQuery,
    category,
    setCategory,
    results: filteredResults,
    totalLoaded: results.length,
    status,
    error,
    hasMore,
    isLoadingMore,
    loadMore,
    retry,
    recentSearches,
    removeRecent,
    clearRecents,
  };
}
