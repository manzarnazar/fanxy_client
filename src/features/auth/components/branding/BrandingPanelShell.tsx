"use client";

import { useEffect, useRef } from "react";
import { GradientMesh } from "@/components/shared/GradientMesh";
import { ParticleField } from "@/components/shared/ParticleField";

interface BrandingPanelShellProps {
  flexGrow: number;
  floatingCards: React.ReactNode;
  children: React.ReactNode;
}

export function BrandingPanelShell({ flexGrow, floatingCards, children }: BrandingPanelShellProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const layers = Array.from(panel.querySelectorAll<HTMLElement>("[data-parallax]"));

    const handleMouseMove = (event: MouseEvent) => {
      const rect = panel.getBoundingClientRect();
      const cx = (event.clientX - rect.left) / rect.width - 0.5;
      const cy = (event.clientY - rect.top) / rect.height - 0.5;
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth) || 0;
        layer.style.transform = `translate(${(cx * depth * 14).toFixed(1)}px, ${(cy * depth * 14).toFixed(1)}px)`;
      });
    };

    panel.addEventListener("mousemove", handleMouseMove);
    return () => panel.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={panelRef}
      aria-hidden="true"
      data-theme="dark"
      style={{ flexGrow }}
      className="relative hidden overflow-hidden bg-[radial-gradient(120%_90%_at_12%_-8%,#0b3f5c_0%,#07293f_34%,#041a29_62%,#020c14_100%)] lg:flex"
    >
      <GradientMesh />
      <ParticleField />
      {floatingCards}

      <div className="relative z-[2] flex max-w-[38rem] flex-col justify-center px-16 py-12">
        {children}
      </div>
    </section>
  );
}
