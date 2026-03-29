"use client";

import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

type RibProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  rotY: number;
  index: number;
};

function Rib({ x, y, z, width, height, depth, rotY, index }: RibProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = rotY + Math.sin(t * 0.18 + index * 0.17) * 0.01;
    ref.current.position.z = z + Math.sin(t * 0.15 + index * 0.12) * 0.025;
  });

  return (
    <mesh
      ref={ref}
      position={[x, y, z]}
      rotation={[0, rotY, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color="#1a1a1a"
        roughness={0.75}
        metalness={0.25}
      />
    </mesh>
  );
}

function ArchitecturalField({
  density = 24,
  side = "left",
}: {
  density?: number;
  side?: "left" | "right";
}) {
  const group = useRef<THREE.Group>(null);

  const ribs = useMemo(() => {
    const items: RibProps[] = [];
    const total = density;

    for (let i = 0; i < total; i++) {
      const t = i / (total - 1);

      const spreadX = side === "left" ? -5.8 + t * 4.8 : 1.0 + t * 4.8;
      const arc = Math.sin(t * Math.PI * 1.05) * 1.2;
      const stepY = 2.6 - t * 5.4;
      const z = -1.4 + Math.cos(t * 2.7) * 0.75 + arc * 0.35;

      const width = 5.8 - t * 2.4;
      const height = 0.09 + (1 - t) * 0.025;
      const depth = 0.24 + t * 0.28;
      const rotY =
        side === "left"
          ? -0.58 + t * 0.18
          : 0.58 - t * 0.18;

      items.push({
        x: spreadX,
        y: stepY,
        z,
        width,
        height,
        depth,
        rotY,
        index: i,
      });
    }

    return items;
  }, [density, side]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.x = Math.sin(t * 0.08) * 0.01;
    group.current.rotation.y += 0.00035;
  });

  return (
    <group ref={group}>
      {ribs.map((rib, i) => (
        <Rib key={i} {...rib} />
      ))}
    </group>
  );
}

function Scene({
  side = "left",
  density = 24,
}: {
  side?: "left" | "right";
  density?: number;
}) {
  const keyLight = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (!keyLight.current) return;
    const t = state.clock.getElapsedTime();
    keyLight.current.position.x =
      (side === "left" ? -2.5 : 2.5) + Math.sin(t * 0.12) * 0.08;
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 6, 16]} />

      <ambientLight intensity={0.4} />

      <directionalLight
        ref={keyLight}
        position={side === "left" ? [-2.5, 3.5, 4] : [2.5, 3.5, 4]}
        intensity={1.8}
        color="#ffffff"
      />

      <directionalLight
        position={side === "left" ? [-5, -1, 2] : [5, -1, 2]}
        intensity={0.6}
        color="#a0a8b0"
      />

      <pointLight
        position={side === "left" ? [-3.2, 0.4, 3.8] : [3.2, 0.4, 3.8]}
        intensity={1.2}
        distance={12}
        color="#e0e3e6"
      />

      <ArchitecturalField density={density} side={side} />

      <mesh position={[0, 0, -3.2]} receiveShadow>
        <planeGeometry args={[30, 16]} />
        <meshStandardMaterial color="#000000" roughness={1} metalness={0} />
      </mesh>
    </>
  );
}

export default function ArchitecturalFieldBackground({
  side = "left",
  density = 24,
  opacity = 0.9,
}: {
  side?: "left" | "right";
  density?: number;
  opacity?: number;
}) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ 
        opacity, 
        zIndex: 0,
        minHeight: '100%',
        width: '100%'
      }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8.2], fov: 34 }}
        gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          zIndex: 1
        }}
      >
        <Scene side={side} density={density} />
      </Canvas>

      {/* content readability mask */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 2,
          pointerEvents: 'none',
          background:
            side === "left"
              ? "linear-gradient(90deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.28) 22%, rgba(0,0,0,0.72) 44%, rgba(0,0,0,0.94) 58%, rgba(0,0,0,1) 72%, rgba(0,0,0,1) 100%)"
              : "linear-gradient(270deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.28) 22%, rgba(0,0,0,0.72) 44%, rgba(0,0,0,0.94) 58%, rgba(0,0,0,1) 72%, rgba(0,0,0,1) 100%)",
        }}
      />

      {/* top/bottom vignette */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 3,
          pointerEvents: 'none',
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.32) 20%, rgba(0,0,0,0.08) 48%, rgba(0,0,0,0.38) 82%, rgba(0,0,0,0.96) 100%)",
        }}
      />
    </div>
  );
}
