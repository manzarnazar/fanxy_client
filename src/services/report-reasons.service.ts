import apiClient from "@/services/api.client";
import type { ApiReportReasonsResponse } from "@/types/api/report.types";

// get_report_reason — confirmed against the Flutter app's
// lib/webservice/apiservices.dart. Lives at the app level (not a feature)
// because reels, stories, and any future report dialog share the same
// admin-configured reason list.
export const reportReasonsService = {
  getReasons: () => apiClient.post<ApiReportReasonsResponse>("get_report_reason", {}),
};
