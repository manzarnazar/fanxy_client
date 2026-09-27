import type { FloatingEmoji } from "@/hooks/useFloatingEmojis";

interface FloatingEmojisProps {
  floats: FloatingEmoji[];
  className: string;
}

export function FloatingEmojis({ floats, className }: FloatingEmojisProps) {
  return (
    <div className={`pointer-events-none ${className}`}>
      {floats.map((float) => (
        <span
          key={float.id}
          className="absolute bottom-0"
          style={
            {
              left: float.x,
              fontSize: float.size,
              "--float-dx": float.dx,
              "--float-rot": float.rot,
              animation: `floatUp ${float.dur} ease-out forwards`,
            } as React.CSSProperties
          }
        >
          {float.emoji}
        </span>
      ))}
    </div>
  );
}
