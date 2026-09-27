import { Bell } from "lucide-react";

export function NotificationsEmptyState() {
  return (
    <div className="flex flex-col items-center px-10 py-15 text-center">
      <div className="relative mb-5 h-24 w-24">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" aria-hidden="true" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-surface/60 shadow-[inset_0_0_0_1.5px_rgba(0,175,240,.3)]">
          <Bell className="h-10.5 w-10.5 text-primary-light" aria-hidden="true" />
        </div>
      </div>
      <div className="font-display text-[23px] font-semibold text-text-primary">No notifications yet</div>
      <p className="mt-2 max-w-[300px] font-sans text-[13px] leading-relaxed font-light text-text-secondary/75">
        When something happens across your account, you&apos;ll see it here.
      </p>
    </div>
  );
}
