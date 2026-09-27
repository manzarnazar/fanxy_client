"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import type { Group } from "three";

// Brand palette only — cyan primary family + pink secondary (see globals.css).
const GLASS_CYAN = "#00aff0";
const GLASS_LIGHT = "#7fd4f5";
const GLASS_PINK = "#e2455f";

function FloatingShapes() {
  const groupRef = useRef<Group>(null);

  // The whole cluster leans gently toward the pointer — parallax camera feel
  // without ever hijacking scroll or click behavior.
  useFrame(({ pointer }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const targetY = pointer.x * 0.35;
    const targetX = -pointer.y * 0.22;
    group.rotation.y += (targetY - group.rotation.y) * Math.min(1, delta * 3);
    group.rotation.x += (targetX - group.rotation.x) * Math.min(1, delta * 3);
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.4}>
        <mesh position={[-2.6, 0.7, -1]}>
          <icosahedronGeometry args={[0.85, 0]} />
          <meshPhysicalMaterial
            color={GLASS_CYAN}
            roughness={0.15}
            transmission={0.75}
            thickness={1.2}
            emissive={GLASS_CYAN}
            emissiveIntensity={0.08}
          />
        </mesh>
      </Float>

      <Float speed={1.1} rotationIntensity={0.4} floatIntensity={1.1}>
        <mesh position={[2.7, -0.5, -1.4]}>
          <torusGeometry args={[0.62, 0.22, 24, 64]} />
          <meshPhysicalMaterial
            color={GLASS_PINK}
            roughness={0.2}
            transmission={0.6}
            thickness={1}
            emissive={GLASS_PINK}
            emissiveIntensity={0.06}
          />
        </mesh>
      </Float>

      <Float speed={1.7} rotationIntensity={0.6} floatIntensity={1.6}>
        <mesh position={[1.6, 1.35, -2.2]}>
          <octahedronGeometry args={[0.45, 0]} />
          <meshPhysicalMaterial
            color={GLASS_LIGHT}
            roughness={0.1}
            transmission={0.85}
            thickness={0.8}
            emissive={GLASS_LIGHT}
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>

      <Float speed={0.9} rotationIntensity={0.3} floatIntensity={0.9}>
        <mesh position={[-1.7, -1.2, -2]}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshPhysicalMaterial
            color={GLASS_LIGHT}
            roughness={0.05}
            transmission={0.9}
            thickness={0.6}
          />
        </mesh>
      </Float>
    </group>
  );
}

/**
 * Decorative hero backdrop — pointer-parallax floating glass shapes in the
 * brand palette. Purely visual: pointer-events pass through, and callers
 * gate it behind desktop + no-reduced-motion (see ThreeHero.tsx).
 */
export default function HeroScene() {
  return (
    <Canvas
      className="pointer-events-none"
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} intensity={26} color={GLASS_LIGHT} />
      <pointLight position={[-5, -3, 2]} intensity={12} color={GLASS_PINK} />
      <FloatingShapes />
      <Environment preset="city" />
    </Canvas>
  );
}
