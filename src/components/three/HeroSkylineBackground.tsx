"use client";

import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function Building({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 0.12 + position[0]) * 0.02;
  });

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial
        color="#050608"
        roughness={0.92}
        metalness={0.08}
        emissive="#0a0c0e"
        emissiveIntensity={Math.random() > 0.82 ? 0.03 : 0.008}
      />
    </mesh>
  );
}

function Skyline() {
  const buildings = useMemo(() => {
    const items: Array<{ position: [number, number, number]; scale: [number, number, number] }> = [];
    const count = 32;

    for (let i = 0; i < count; i++) {
      const x = -14 + (i / count) * 28;
      const height = 2 + Math.random() * 5.5;
      const width = 0.6 + Math.random() * 1.2;
      const depth = 0.5 + Math.random() * 0.8;
      const y = -2 + height / 2;
      const z = -3 - Math.random() * 2;

      items.push({
        position: [x, y, z],
        scale: [width, height, depth],
      });
    }

    return items;
  }, []);

  return (
    <>
      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}
    </>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 8, 20]} />
      <ambientLight intensity={0.12} />
      <directionalLight position={[5, 8, 6]} intensity={0.35} color="#d4d8dd" />
      <pointLight position={[0, 2, 5]} intensity={0.18} color="#c8a45a" />
      <Skyline />
      <mesh position={[0, -2, -5]} receiveShadow>
        <planeGeometry args={[60, 30]} />
        <meshStandardMaterial color="#000000" roughness={1} />
      </mesh>
    </>
  );
}

export default function HeroSkylineBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 12], fov: 38 }} dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.42) 28%, rgba(0,0,0,0.18) 52%, rgba(0,0,0,0.68) 82%, rgba(0,0,0,0.94) 100%)",
        }}
      />
    </div>
  );
}
