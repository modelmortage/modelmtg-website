"use client";

import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function Terrain() {
  const mesh = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(28, 14, 120, 60);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z =
        Math.sin(x * 0.55) * 0.22 +
        Math.cos(y * 0.9) * 0.18 +
        Math.sin((x + y) * 0.35) * 0.16;
      pos.setZ(i, z);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.06) * 0.02;
  });

  return (
    <mesh ref={mesh} geometry={geometry} rotation={[-Math.PI / 2.6, 0, 0]} position={[0, -1.5, -2]}>
      <meshStandardMaterial
        color="#060709"
        roughness={0.9}
        metalness={0.06}
        wireframe={false}
      />
    </mesh>
  );
}

function LightSweep() {
  const ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.x = Math.sin(t * 0.16) * 8;
  });

  return <pointLight ref={ref} position={[0, 1.2, 3]} intensity={0.26} color="#c8a45a" distance={18} />;
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 6, 16]} />
      <ambientLight intensity={0.16} />
      <directionalLight position={[2, 6, 5]} intensity={0.52} color="#d7dbe0" />
      <LightSweep />
      <Terrain />
    </>
  );
}

export default function ResourcesTerrainBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 2.6, 8], fov: 34 }} dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.54) 20%, rgba(0,0,0,0.26) 45%, rgba(0,0,0,0.78) 84%, rgba(0,0,0,0.96) 100%)",
        }}
      />
    </div>
  );
}
