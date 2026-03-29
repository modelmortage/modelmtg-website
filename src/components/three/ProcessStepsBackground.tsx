"use client";

import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function StepBlock({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: [number, number, number];
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#2a2a2a" roughness={0.75} metalness={0.25} />
    </mesh>
  );
}

function StairField() {
  const group = useRef<THREE.Group>(null);

  const blocks = useMemo(() => {
    const items: Array<{ position: [number, number, number]; scale: [number, number, number] }> = [];
    const rows = 18;
    const cols = 24;

    for (let row = 0; row < rows; row++) {
      const ry = row / (rows - 1);
      for (let col = 0; col < cols; col++) {
        const cx = col / (cols - 1);

        const xBase = -11 + cx * 24;
        const y = 4.5 - ry * 9;
        const x = xBase - row * 0.42;
        const z = -1.7 + row * 0.14 + Math.sin(cx * Math.PI * 1.15) * 0.1;

        items.push({
          position: [x, y, z],
          scale: [2.8 - ry * 0.45, 0.14, 0.58 + ry * 0.12],
        });
      }
    }

    return items;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.position.x = Math.sin(t * 0.08) * 0.22;
    group.current.position.z = Math.sin(t * 0.11) * 0.05;
  });

  return (
    <group ref={group}>
      {blocks.map((b, i) => (
        <StepBlock key={i} {...b} />
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 7, 18]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-3, 5, 5]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-6, -1, 3]} intensity={0.8} color="#a0a8b0" />
      <pointLight position={[-2.5, 1.5, 4]} intensity={1.5} color="#ffffff" />

      <StairField />

      <mesh position={[0, 0, -3.4]} receiveShadow>
        <planeGeometry args={[50, 22]} />
        <meshStandardMaterial color="#000000" roughness={1} />
      </mesh>
    </>
  );
}

export default function ProcessStepsBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 9], fov: 34 }} dpr={[1, 1.5]}>
        <Scene />
      </Canvas>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.14) 18%, rgba(0,0,0,0.46) 34%, rgba(0,0,0,0.84) 49%, rgba(0,0,0,0.97) 60%, rgba(0,0,0,1) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.15) 26%, rgba(0,0,0,0.03) 50%, rgba(0,0,0,0.22) 76%, rgba(0,0,0,0.93) 100%)",
        }}
      />
    </div>
  );
}
