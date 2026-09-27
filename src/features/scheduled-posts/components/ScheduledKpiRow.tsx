import { CalendarClock, CalendarDays, CalendarRange, Clock } from "lucide-react";
import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { formatCount } from "@/lib/formatter/count";

interface ScheduledKpiRowProps {
  total: number;
  today: number;
  week: number;
  month: number;
}

export function ScheduledKpiRow({ total, today, week, month }: ScheduledKpiRowProps) {
  const cards = [
    { key: "total", icon: CalendarClock, colorClassName: "bg-primary/14 text-primary-light", value: formatCount(total), label: "Scheduled" },
    { key: "today", icon: Clock, colorClassName: "bg-warning/16 text-warning", value: formatCount(today), label: "Today" },
    { key: "week", icon: CalendarDays, colorClassName: "bg-success/16 text-success", value: formatCount(week), label: "This week" },
    { key: "month", icon: CalendarRange, colorClassName: "bg-secondary/14 text-secondary-light", value: formatCount(month), label: "This month" },
  ];

  return (
    <div className="mb-4.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.key} className="rounded-xl border border-primary/14 bg-surface/50 p-3.5">
          <span className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-md ${card.colorClassName}`}>
            <card.icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div className="font-display text-xl font-semibold text-text-primary"><AnimatedNumber value={card.value} /></div>
          <div className="mt-0.5 font-sans text-[11.5px] font-light text-text-secondary/70">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
