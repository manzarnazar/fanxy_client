import type { ApiListEnvelope } from "@/types/api/common.types";

// view_comment / add_comment / edit_comment / delete_comment — confirmed
// against the real Flutter app's lib/webservice/apiservices.dart. Comments
// are keyed by post_id only; there is no parent/reply field on this model,
// so the real backend has no threaded-reply support.
export interface ApiCommentResult {
  id: number;
  post_id: number;
  user_id: number;
  comment: string;
  status: number;
  created_at: string;
  updated_at: string;
  user_name: string;
  full_name: string;
  email: string;
  mobile_number: string | null;
  profile_img: string | null;
}

export type ApiCommentsResponse = ApiListEnvelope<ApiCommentResult>;
