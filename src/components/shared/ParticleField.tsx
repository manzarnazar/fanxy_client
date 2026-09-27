const PARTICLES = [
  { left: "6%", size: 4, color: "#7fd4f5", duration: 9, delay: 0 },
  { left: "14%", size: 3, color: "#f5da8f", duration: 11, delay: 1.2 },
  { left: "22%", size: 5, color: "#ff5b78", duration: 8, delay: 2.4 },
  { left: "31%", size: 3, color: "#7fd4f5", duration: 10, delay: 0.6 },
  { left: "39%", size: 4, color: "#c1a3ff", duration: 12, delay: 3.1 },
  { left: "47%", size: 3, color: "#7fd4f5", duration: 9.5, delay: 1.8 },
  { left: "55%", size: 5, color: "#f5da8f", duration: 7.5, delay: 4 },
  { left: "63%", size: 4, color: "#ff5b78", duration: 10.5, delay: 0.3 },
  { left: "71%", size: 3, color: "#7fd4f5", duration: 8.5, delay: 2.9 },
  { left: "78%", size: 4, color: "#c1a3ff", duration: 11.5, delay: 1.5 },
  { left: "85%", size: 3, color: "#f5da8f", duration: 9, delay: 3.6 },
  { left: "91%", size: 5, color: "#7fd4f5", duration: 10, delay: 0.9 },
  { left: "18%", size: 3, color: "#ff5b78", duration: 12.5, delay: 5.2 },
  { left: "66%", size: 4, color: "#c1a3ff", duration: 8, delay: 4.7 },
];

export function ParticleField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="absolute bottom-[-14px] animate-[drift_linear_infinite] rounded-full"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 8px ${particle.color}`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
