import type { ApiListEnvelope } from "@/types/api/common.types";

// get_report_reason — confirmed against the Flutter app's
// lib/model/reportreasonmodel.dart. Request body is empty (the endpoint
// ignores user_id/page in the request; pagination is server-driven via the
// envelope's current_page/total_page/more_page).
export interface ApiReportReasonResult {
  id: number;
  reason: string;
  status: number;
}

export type ApiReportReasonsResponse = ApiListEnvelope<ApiReportReasonResult>;
