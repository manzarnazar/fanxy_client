import { NotificationListItem } from "@/features/notifications/components/NotificationListItem";
import type { NotificationGroup } from "@/features/notifications/types/notifications.types";

interface NotificationGroupSectionProps {
  group: NotificationGroup;
  onOpen: (id: string) => void;
}

export function NotificationGroupSection({ group, onOpen }: NotificationGroupSectionProps) {
  return (
    <div className="mb-2">
      <div className="sticky top-[-1px] z-10 flex items-center gap-2.5 bg-gradient-to-b from-background from-70% to-transparent py-2.5">
        <span className="font-sans text-[11px] font-semibold tracking-[1px] text-text-secondary/55 uppercase">{group.label}</span>
        <span className="h-px flex-1 bg-primary/10" />
        <span className="font-sans text-[11px] font-normal text-text-secondary/45">{group.items.length}</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {group.items.map((item) => (
          <NotificationListItem key={item.id} item={item} onOpen={() => onOpen(item.id)} />
        ))}
      </div>
    </div>
  );
}
