"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ScheduledPost } from "@/features/scheduled-posts/types/scheduled-posts.types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface ScheduledCalendarProps {
  posts: ScheduledPost[];
  onSelectPost: (post: ScheduledPost) => void;
}

export function ScheduledCalendar({ posts, onSelectPost }: ScheduledCalendarProps) {
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const { cells, monthLabel, monthCount } = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const isToday = (day: number) =>
      today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

    const byDay = new Map<number, ScheduledPost[]>();
    for (const post of posts) {
      const date = new Date(post.scheduledAtMs);
      if (date.getFullYear() !== year || date.getMonth() !== month) continue;
      const day = date.getDate();
      byDay.set(day, [...(byDay.get(day) ?? []), post]);
    }

    return {
      monthLabel: monthCursor.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
      monthCount: Array.from(byDay.values()).reduce((sum, list) => sum + list.length, 0),
      cells: [
        ...Array.from({ length: firstWeekday }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => ({
          day: index + 1,
          today: isToday(index + 1),
          posts: byDay.get(index + 1) ?? [],
        })),
      ],
    };
  }, [monthCursor, posts]);

  const shiftMonth = (delta: number) => {
    setMonthCursor((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 p-4">
      <div className="mb-3.5 flex items-center justify-between">
        <div>
          <div className="font-display text-lg font-semibold text-text-primary">{monthLabel}</div>
          <div className="font-sans text-[11.5px] font-light text-text-secondary/70">{monthCount} scheduled this month</div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => shiftMonth(-1)}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-text-secondary transition hover:bg-primary/12"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => shiftMonth(1)}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-text-secondary transition hover:bg-primary/12"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="pb-1.5 text-center font-sans text-[10px] font-semibold tracking-wide text-text-secondary/60 uppercase">
            {weekday}
          </div>
        ))}

        {cells.map((cell, index) =>
          cell === null ? (
            <div key={`pad-${index}`} />
          ) : (
            <div
              key={cell.day}
              className={cn(
                "min-h-[84px] rounded-md border p-1.5",
                cell.today ? "border-primary/40 bg-primary/8" : "border-primary/10 bg-surface-elevated/30",
              )}
            >
              <div
                className={cn(
                  "mb-1 font-sans text-[11px]",
                  cell.today ? "font-bold text-primary-light" : "font-medium text-text-secondary/80",
                )}
              >
                {cell.day}
              </div>
              <div className="flex flex-col gap-1">
                {cell.posts.slice(0, 2).map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => onSelectPost(post)}
                    title={`${post.timeLabel} · ${post.title}`}
                    className="flex items-center gap-1 truncate rounded-sm border-l-2 border-primary-light bg-primary/12 px-1 py-0.5 text-left font-sans text-[9.5px] font-medium text-text-primary transition hover:bg-primary/20"
                  >
                    {post.isVideo && <Play className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />}
                    <span className="truncate">
                      {post.timeLabel} {post.title}
                    </span>
                  </button>
                ))}
                {cell.posts.length > 2 && (
                  <span className="px-1 font-sans text-[9px] font-medium text-text-secondary/60">
                    +{cell.posts.length - 2} more
                  </span>
                )}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
