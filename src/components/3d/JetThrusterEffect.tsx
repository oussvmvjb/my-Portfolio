'use client';

/**
 * JetThrusterEffect.tsx — Reactive jet flame for Bumblebee robot feet
 *
 * - Two cone meshes: inner blue-white core + outer orange flame
 * - Metallic nozzle collar at y = 0 to ensure 100% seamless connection to boot
 * - Anchored at origin (y = 0): base of cone stays strictly locked at foot,
 *   scaling only extends apex downwards.
 * - Intensity 0.0 → 1.0, driven externally via ref (no React state in useFrame)
 * - All geometry/material created once via useMemo; zero allocations in useFrame
 * - Respects prefers-reduced-motion
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface JetThrusterEffectProps {
  /** 0.0 (off) → 1.0 (full throttle). Read each frame — no re-render needed. */
  intensityRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
  scale?: number;
}

export default function JetThrusterEffect({
  intensityRef,
  reducedMotion,
  scale = 1,
}: JetThrusterEffectProps) {
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const nozzleRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  // ── Geometries (anchored at origin y = 0, pointing downwards along -Y) ────────
  // By pre-translating so the base circle is at y = 0, mesh.scale.y scales only
  // the length of the flame downwards — the base never separates from the foot!
  const innerGeo = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.026, 0.15, 12);
    // Invert so base is up (+Y) and apex is down (-Y)
    geo.rotateX(Math.PI);
    // Shift so base is at y = 0, apex is at y = -0.15
    geo.translate(0, -0.075, 0);
    return geo;
  }, []);

  const outerGeo = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.048, 0.24, 12);
    geo.rotateX(Math.PI);
    // Shift so base is at y = 0, apex is at y = -0.24
    geo.translate(0, -0.12, 0);
    return geo;
  }, []);

  // Nozzle collar ring at the base (y = 0) to physically link boot sole to flame
  const nozzleGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.034, 0.038, 0.014, 12);
    geo.translate(0, 0.007, 0); // sits slightly inside the sole
    return geo;
  }, []);

  // ── Materials (created once) ────────────────────────────────────────────────
  const innerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#B0E0FF'),
        emissive: new THREE.Color('#3399FF'),
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    []
  );

  const outerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FF7700'),
        emissive: new THREE.Color('#FFAA00'),
        emissiveIntensity: 1.8,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    []
  );

  const nozzleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1F2228'),
        emissive: new THREE.Color('#FF8800'),
        emissiveIntensity: 0.6,
        metalness: 0.85,
        roughness: 0.25,
      }),
    []
  );

  // ── Frame loop ──────────────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const intensity = intensityRef.current;

    // Hide completely when off or reduced-motion
    if (intensity < 0.01 || reducedMotion) {
      if (innerRef.current) innerRef.current.visible = false;
      if (outerRef.current) outerRef.current.visible = false;
      if (nozzleRef.current) nozzleRef.current.visible = false;
      if (glowRef.current) glowRef.current.intensity = 0;
      return;
    }

    if (innerRef.current) innerRef.current.visible = true;
    if (outerRef.current) outerRef.current.visible = true;
    if (nozzleRef.current) nozzleRef.current.visible = true;

    const t = clock.elapsedTime;

    // Multi-frequency flicker for high-energy rocket exhaust
    const flicker =
      0.84 +
      Math.sin(t * 22.0) * 0.08 +
      Math.sin(t * 31.5 + 1.2) * 0.05 +
      Math.sin(t * 13.0 + 0.7) * 0.03;

    const eff = intensity * flicker;

    // Inner core: scales length (Y) with throttle while base stays at y = 0
    if (innerRef.current) {
      const sx = 0.7 + intensity * 0.4;
      const sy = 0.5 + intensity * 1.5;
      innerRef.current.scale.set(sx * flicker, sy * flicker, sx * flicker);
      (innerRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        3.5 * eff;
      (innerRef.current.material as THREE.MeshStandardMaterial).opacity =
        Math.min(0.98, 0.6 + intensity * 0.38) * flicker;
    }

    // Outer flame: wider envelope, longer tail
    if (outerRef.current) {
      const sx = 0.6 + intensity * 0.5;
      const sy = 0.5 + intensity * 1.7;
      outerRef.current.scale.set(sx * flicker, sy * flicker, sx * flicker);
      (outerRef.current.material as THREE.MeshStandardMaterial).opacity =
        Math.min(0.8, 0.3 + intensity * 0.45) * flicker;
    }

    // Nozzle glow brightens with throttle
    if (nozzleRef.current) {
      (nozzleRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.4 + intensity * 1.2 * flicker;
    }

    // Point light glow underneath feet
    if (glowRef.current) {
      glowRef.current.intensity = intensity * 2.8 * flicker;
    }
  });

  return (
    <group scale={scale}>
      {/* Dark metallic thruster collar right at the sole */}
      <mesh ref={nozzleRef} geometry={nozzleGeo} material={nozzleMat} />
      {/* Inner blue-white core — starts right at y = 0 and points down */}
      <mesh ref={innerRef} geometry={innerGeo} material={innerMat} />
      {/* Outer orange flame — starts right at y = 0 and points down */}
      <mesh ref={outerRef} geometry={outerGeo} material={outerMat} />
      {/* Orange glow halo around the foot */}
      <pointLight ref={glowRef} color="#FF9900" distance={1.2} decay={2} intensity={0} position={[0, -0.05, 0]} />
    </group>
  );
}
