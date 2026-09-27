"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAppDispatch } from "@/store/hooks";
import { fetchCurrentUser, forceSignOut, markBootstrapped } from "@/store/slices/authSlice";
import { STORAGE_KEYS } from "@/lib/constants/keys";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleSignOut = () => {
      dispatch(forceSignOut());
      void fetch("/api/auth/session", { method: "DELETE" });
    };
    window.addEventListener("auth:signout", handleSignOut);
    return () => window.removeEventListener("auth:signout", handleSignOut);
  }, [dispatch]);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)) {
      void dispatch(fetchCurrentUser());
    } else {
      dispatch(markBootstrapped());
    }
  }, [dispatch]);

  // Firebase's own session can expire or be revoked independently of the
  // app's cookie/session — keep them from drifting apart silently.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser && localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)) {
        dispatch(forceSignOut());
        void fetch("/api/auth/session", { method: "DELETE" });
      }
    });
    return unsubscribe;
  }, [dispatch]);

  return <>{children}</>;
}
