const NOISE_DATA_URI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>";

export function GradientMesh() {
  return (
    <>
      <div className="pointer-events-none absolute -inset-[12%]" data-parallax data-depth="0.4">
        <div className="absolute -top-[6%] -left-[4%] h-[62%] w-[60%] animate-[mesh_14s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(0,175,240,.34),transparent_62%)] blur-[6px]" />
        <div className="absolute -right-[6%] -bottom-[10%] h-[60%] w-[58%] animate-[mesh_17s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(circle,rgba(226,29,91,.24),transparent_62%)] blur-[6px]" />
        <div className="absolute top-[34%] left-[38%] h-[46%] w-[42%] animate-[mesh_20s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(120,90,230,.2),transparent_64%)] blur-[8px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: "radial-gradient(rgba(0,175,240,.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(80% 70% at 40% 30%, #000, transparent 82%)",
          WebkitMaskImage: "radial-gradient(80% 70% at 40% 30%, #000, transparent 82%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{ backgroundImage: `url('${NOISE_DATA_URI}')` }}
      />
    </>
  );
}
