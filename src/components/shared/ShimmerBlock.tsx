interface ShimmerBlockProps {
  className: string;
}

export function ShimmerBlock({ className }: ShimmerBlockProps) {
  return (
    <span
      className={`block animate-[shimmer_1.3s_linear_infinite] bg-[linear-gradient(90deg,rgba(8,28,42,.7),rgba(0,175,240,.14),rgba(8,28,42,.7))] bg-[length:320px_100%] ${className}`}
    />
  );
}
