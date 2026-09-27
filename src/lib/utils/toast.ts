export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

type ToastListener = (toastItem: ToastItem) => void;

let listener: ToastListener | null = null;

export function registerToastListener(fn: ToastListener): () => void {
  listener = fn;
  return () => {
    if (listener === fn) {
      listener = null;
    }
  };
}

function emit(type: ToastType, message: string): void {
  listener?.({ id: crypto.randomUUID(), type, message });
}

export const toast = {
  success: (message: string) => emit("success", message),
  error: (message: string) => emit("error", message),
  warning: (message: string) => emit("warning", message),
  info: (message: string) => emit("info", message),
};
