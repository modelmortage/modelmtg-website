"use client";

import * as THREE from "three";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function Monolith() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.position.x = -4.6 + Math.sin(t * 0.08) * 0.08;
    group.current.rotation.y = -0.28 + Math.sin(t * 0.06) * 0.015;
  });

  return (
    <group ref={group} position={[-4.6, -0.1, -1.6]} rotation={[0.04, -0.28, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.2, 8.5, 1.2]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.75} metalness={0.25} />
      </mesh>

      <mesh position={[0.9, 0, 0.7]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 8.2, 0.35]} />
        <meshStandardMaterial color="#353535" roughness={0.7} metalness={0.22} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 6, 16]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-2, 5, 5]} intensity={2.0} color="#ffffff" />
      <pointLight position={[-3, 1, 4]} intensity={1.5} color="#ffffff" />
      <Monolith />
      <mesh position={[0, 0, -4]}>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#000000" roughness={1} />
      </mesh>
    </>
  );
}

export default function CtaMonolithBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 36 }} dpr={[1, 1.5]}>
        <Scene />
      </Canvas>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.2) 18%, rgba(0,0,0,0.58) 34%, rgba(0,0,0,0.9) 54%, rgba(0,0,0,0.98) 66%, rgba(0,0,0,1) 100%)",
        }}
      />
    </div>
  );
}
