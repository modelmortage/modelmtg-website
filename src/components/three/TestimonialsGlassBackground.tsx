"use client";

import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function GlassPanel({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 0.14 + position[0]) * 0.03;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1, 0.08]} />
      <meshPhysicalMaterial
        color="#090a0c"
        metalness={0.08}
        roughness={0.22}
        transmission={0.7}
        thickness={0.7}
        ior={1.12}
        transparent
        opacity={0.14}
        reflectivity={0.25}
      />
    </mesh>
  );
}

function Scene() {
  const panels = useMemo(
    () => [
      { position: [-5, 1.4, -2], rotation: [-0.1, 0.35, 0], scale: [6, 5, 1] },
      { position: [0.5, -0.3, -1.6], rotation: [0.04, -0.12, 0], scale: [8, 4.8, 1] },
      { position: [5.4, 1.2, -2.5], rotation: [0.08, -0.32, 0], scale: [5.2, 5.2, 1] },
    ],
    []
  );

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 8, 18]} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[4, 5, 6]} intensity={0.55} color="#e4e7eb" />
      <pointLight position={[-2, 1, 4]} intensity={0.2} color="#d6dbe0" />

      {panels.map((p, i) => (
        <GlassPanel key={i} position={p.position as [number, number, number]} rotation={p.rotation as [number, number, number]} scale={p.scale as [number, number, number]} />
      ))}

      <mesh position={[0, 0, -4]}>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#000000" roughness={1} />
      </mesh>
    </>
  );
}

export default function TestimonialsGlassBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 36 }} dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.48) 58%, rgba(0,0,0,0.9) 100%)",
        }}
      />
    </div>
  );
}
