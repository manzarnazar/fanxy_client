"use client";

import { useEffect, useState } from "react";

export function useHomeUI() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setFabOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    sidebarExpanded,
    toggleSidebar: () => setSidebarExpanded((prev) => !prev),
    fabOpen,
    toggleFab: () => setFabOpen((prev) => !prev),
    closeFab: () => setFabOpen(false),
    searchOpen,
    openSearch: () => setSearchOpen(true),
    closeSearch: () => setSearchOpen(false),
    searchQuery,
    setSearchQuery,
  };
}
