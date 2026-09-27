import { isAxiosError } from "axios";

const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";
const NETWORK_ERROR_MESSAGE = "Network error. Please try again.";

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return NETWORK_ERROR_MESSAGE;
    }
    // Validation failures come back under `errors` (a string), not `message`.
    const data = error.response.data as { message?: string; errors?: string } | undefined;
    return data?.message ?? data?.errors ?? GENERIC_ERROR_MESSAGE;
  }
  return GENERIC_ERROR_MESSAGE;
}

export function isUnauthorizedError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 401;
}
