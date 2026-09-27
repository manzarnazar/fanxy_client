"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { signOut } from "@/store/slices/authSlice";
import { ROUTES } from "@/lib/constants/routes";

export function useAccountActions() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const confirmLogout = async () => {
    await dispatch(signOut());
    setLogoutOpen(false);
    router.push(ROUTES.SIGN_IN);
  };

  return {
    logoutOpen,
    openLogout: () => setLogoutOpen(true),
    closeLogout: () => setLogoutOpen(false),
    confirmLogout: () => void confirmLogout(),
  };
}
