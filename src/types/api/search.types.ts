import type { ApiListEnvelope } from "@/types/api/common.types";

// search_user — confirmed against the Flutter app's
// lib/webservice/apiservices.dart + lib/model/searchmodel.dart.
// Request: { user_id, name, page }. Only the fields the web app consumes
// are typed here; the real rows carry the full user shape.
export interface ApiSearchUserResult {
  id: number;
  firebase_id: string | null;
  is_creator: number;
  user_name: string;
  full_name: string;
  image: string | null;
  is_verified_at: number;
  bio: string | null;
}

export type ApiSearchUsersResponse = ApiListEnvelope<ApiSearchUserResult>;
