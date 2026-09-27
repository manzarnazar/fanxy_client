interface StoryProgressBarsProps {
  count: number;
  activeIndex: number;
  activeProgress: number;
}

export function StoryProgressBars({ count, activeIndex, activeProgress }: StoryProgressBarsProps) {
  return (
    <div className="absolute top-3.5 right-3.5 left-3.5 z-[6] flex gap-1.5">
      {Array.from({ length: count }, (_, index) => {
        const width = index < activeIndex ? 100 : index === activeIndex ? activeProgress : 0;
        return (
          <div key={index} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/28">
            <span className="block h-full rounded-full bg-white" style={{ width: `${width}%` }} />
          </div>
        );
      })}
    </div>
  );
}
