"use client";

import { useSyncExternalStore } from "react";

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function subscribe() {
  return () => {};
}

function getSnapshot(): string {
  return greetingForHour(new Date().getHours());
}

function getServerSnapshot(): string {
  return "Welcome back";
}

export function useGreeting(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
