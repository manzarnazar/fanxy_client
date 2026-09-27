import axios, { type InternalAxiosRequestConfig } from "axios";
import { STORAGE_KEYS } from "@/lib/constants/keys";
import { toast } from "@/lib/utils/toast";

const isProd = process.env.NODE_ENV === "production";

// Dev  → /api-proxy  (Next.js rewrites → avoids CORS)
// Prod → NEXT_PUBLIC_API_BASE_URL (direct call)
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Api-Token": process.env.NEXT_PUBLIC_API_TOKEN ?? "",
  },
});

// Returns the authenticated user's ID from localStorage, persisted by
// authSlice on login (a plain string, not JSON). Returns null when the
// user is not logged in — callers must NOT send user_id in that case.
function getAuthUserId(): string | null {
  if (typeof window === "undefined") return null;
  const userId = localStorage.getItem(STORAGE_KEYS.AUTH_USER_ID);
  return userId && userId.length > 0 ? userId : null;
}

// Inject user_id into every POST body — only when a real authenticated
// user ID is available. Never inject "0", undefined, or null.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.data instanceof FormData) {
      // Let Axios set multipart/form-data with boundary automatically
      delete config.headers["Content-Type"];
    }

    if (config.method === "post") {
      const userId = getAuthUserId();

      if (userId !== null) {
        if (config.data instanceof FormData) {
          if (!config.data.has("user_id")) config.data.append("user_id", userId);
        } else if (config.data == null) {
          // No body was passed at all (e.g. apiClient.post("get_pages")) —
          // still needs one so user_id actually reaches the request.
          config.data = { user_id: userId };
        } else if (typeof config.data === "object" && !Array.isArray(config.data)) {
          if (!("user_id" in config.data)) {
            config.data = { ...config.data, user_id: userId };
          }
        }

        // get_profile with no explicit to_user_id means "my own profile" —
        // the real backend expects to_user_id to equal user_id in that case,
        // not 0 and not omitted.
        if (config.url === "get_profile" && typeof config.data === "object" && !("to_user_id" in config.data)) {
          config.data = { ...config.data, to_user_id: userId };
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor.
// The API uses a body-level `status` field alongside the HTTP status, and
// reports several benign non-errors as body status 400:
//   "Data Not Found"  → an empty list, not a failure
//   "View Exists"     → add_view called twice for the same story — idempotent no-op
//   "...already..."   → duplicate-action responses in general
// Those resolve quietly; any other 4xx/5xx body status → toast + reject.
const BENIGN_ERROR_PATTERNS = [/not found/i, /view exists/i, /already/i];

apiClient.interceptors.response.use(
  (response) => {
    const bodyStatus = response.data?.status;
    // Validation failures use `errors` (a string) instead of `message`.
    const bodyMessage: string = response.data?.message ?? response.data?.errors ?? "";

    if (typeof bodyStatus === "number" && bodyStatus >= 400) {
      if (BENIGN_ERROR_PATTERNS.some((pattern) => pattern.test(bodyMessage))) {
        response.data = { status: 200, message: bodyMessage, result: [] };
        return response;
      }
      toast.error(bodyMessage || "Something went wrong. Please try again.");
      return Promise.reject(new Error(bodyMessage || "API error"));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER_ID);
      window.dispatchEvent(new CustomEvent("auth:signout"));
    }
    const message: string = error.response?.data?.message || error.message;
    if (error.name !== "CanceledError") {
      toast.error(message);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
