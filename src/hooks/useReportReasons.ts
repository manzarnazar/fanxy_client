"use client";

import { useEffect, useState } from "react";
import { reportReasonsService } from "@/services/report-reasons.service";

/**
 * Server-driven report reasons (get_report_reason), shared by every report
 * dialog. Fetched once per session (module cache) with the given fallback
 * list used until the fetch resolves — or permanently if it fails, so
 * reporting always works.
 */
let cachedReasons: string[] | null = null;
let inflight: Promise<string[]> | null = null;

async function loadReasons(): Promise<string[]> {
  const reasons: string[] = [];
  let page = 1;
  // The endpoint paginates server-side; keep pulling while more_page is set
  // (bounded — the reason list is admin-curated and small).
  for (let guard = 0; guard < 10; guard += 1) {
    const response = await reportReasonsService.getReasons();
    reasons.push(...(response.data.result ?? []).filter((row) => row.status === 1).map((row) => row.reason));
    if (!response.data.more_page || (response.data.current_page ?? page) >= (response.data.total_page ?? page)) break;
    page += 1;
  }
  // Dedupe (the API can repeat rows across pages).
  return Array.from(new Set(reasons));
}

export function useReportReasons(fallback: readonly string[]): string[] {
  const [reasons, setReasons] = useState<string[]>(() => cachedReasons ?? [...fallback]);

  useEffect(() => {
    if (cachedReasons) return;
    inflight ??= loadReasons();
    let cancelled = false;
    inflight
      .then((loaded) => {
        if (loaded.length > 0) {
          cachedReasons = loaded;
          if (!cancelled) setReasons(loaded);
        }
      })
      .catch(() => {
        inflight = null; // allow a retry on the next mount
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return reasons;
}
