"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

function GlossyIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [target] = useState(() => new THREE.Vector2());

  useFrame((state) => {
    const { pointer } = state;
    target.x = THREE.MathUtils.damp(target.x, pointer.x, 3, 0.1);
    target.y = THREE.MathUtils.damp(target.y, pointer.y, 3, 0.1);
    if (meshRef.current) {
      meshRef.current.rotation.x = target.y * 0.6;
      meshRef.current.rotation.y = -target.x * 0.6;
    }
  });

  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      roughness: 0.05,
      metalness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      reflectivity: 1,
      envMapIntensity: 1.25,
    });
    return m;
  }, []);

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={1.1}>
        <icosahedronGeometry args={[1, 0]} />
        <primitive object={material} attach="material" />
      </mesh>
    </Float>
  );
}

export default function Scene() {
  return (
    <div className="h-[50vh] w-full sm:h-[60vh]">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3], fov: 45 }}>
        <color attach="background" args={[0, 0, 0]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[3, 3, 3]} intensity={2} />
        <directionalLight position={[-3, -2, 1]} intensity={1} />
        <Environment preset="city" />
        <GlossyIcosahedron />
      </Canvas>
    </div>
  );
}
