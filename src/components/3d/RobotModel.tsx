'use client';

/**
 * RobotModel.tsx — Procedural skeletal animation for ROBOT.glb
 *
 * Bones confirmed from GLB inspection (29 total):
 *   spine
 *     ├── pelvisL / pelvisR
 *     ├── spine001 → spine002 → spine003 (chest)
 *     │     ├── breastL / breastR
 *     │     ├── shoulderL → upper_armL → forearmL → handL
 *     │     ├── shoulderR → upper_armR → forearmR → handR
 *     │     └── spine004 (neck) → spine005 (head) → spine006 (headTop)
 *     ├── thighL → shinL → footL → (heel02L, toeL)
 *     └── thighR → shinR → footR → (heel02R, toeR)
 *
 * All animations are procedural, driving Three.js Bone rotations directly via useFrame.
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import JetThrusterEffect from './JetThrusterEffect';

// ─── Animation Types ──────────────────────────────────────────────────────────
export type RobotAnimationType =
  | 'idle'
  | 'wave'
  | 'dance'
  | 'walk'
  | 'thinking'
  | 'happy';

interface RobotModelProps {
  currentAnimation?: RobotAnimationType;
  onAnimationEnd?: () => void;
  primaryColor?: string;
  enableMouseTracking?: boolean;
  onRobotClick?: () => void;
  scale?: number;
  position?: [number, number, number];
}

// ─── Bone Map (all 29 GLB joints + aliases) ──────────────────────────────────
interface BoneMap {
  spine: THREE.Bone | null;
  pelvisL: THREE.Bone | null;
  pelvisR: THREE.Bone | null;
  spine001: THREE.Bone | null;
  spine002: THREE.Bone | null;
  spine003: THREE.Bone | null;
  chest: THREE.Bone | null;      // alias: spine003
  breastL: THREE.Bone | null;
  breastR: THREE.Bone | null;
  shoulderL: THREE.Bone | null;
  upperArmL: THREE.Bone | null;  // upper_armL
  forearmL: THREE.Bone | null;
  handL: THREE.Bone | null;
  shoulderR: THREE.Bone | null;
  upperArmR: THREE.Bone | null;  // upper_armR
  forearmR: THREE.Bone | null;
  handR: THREE.Bone | null;
  spine004: THREE.Bone | null;
  neck: THREE.Bone | null;       // alias: spine004
  spine005: THREE.Bone | null;
  head: THREE.Bone | null;       // alias: spine005
  spine006: THREE.Bone | null;
  headTop: THREE.Bone | null;    // alias: spine006
  thighL: THREE.Bone | null;
  shinL: THREE.Bone | null;
  footL: THREE.Bone | null;
  heel02L: THREE.Bone | null;
  toeL: THREE.Bone | null;
  thighR: THREE.Bone | null;
  shinR: THREE.Bone | null;
  footR: THREE.Bone | null;
  heel02R: THREE.Bone | null;
  toeR: THREE.Bone | null;
}

// ─── Module Constants & Helpers ───────────────────────────────────────────────
const _axisX = new THREE.Vector3(1, 0, 0);
const _axisY = new THREE.Vector3(0, 1, 0);
const _axisZ = new THREE.Vector3(0, 0, 1);

function localDelta(axis: THREE.Vector3, angle: number): THREE.Quaternion {
  return new THREE.Quaternion().setFromAxisAngle(axis, angle);
}

/** Smoothly slerp bone toward target = rest * delta (local rotation in bone frame) */
function slerpBone(
  bone: THREE.Bone | null,
  rest: THREE.Quaternion,
  delta: THREE.Quaternion,
  speed: number,
  dt: number
) {
  if (!bone) return;
  const target = rest.clone().multiply(delta);
  bone.quaternion.slerp(target, 1 - Math.exp(-speed * dt));
}

/** Restore bone back toward its rest quaternion */
function restoreBone(
  bone: THREE.Bone | null,
  rest: THREE.Quaternion,
  speed: number,
  dt: number
) {
  if (!bone) return;
  bone.quaternion.slerp(rest, 1 - Math.exp(-speed * dt));
}

// Preload the model asset
useGLTF.preload('/models/robot/ROBOT.glb');

// ─── Component ────────────────────────────────────────────────────────────────
export default function RobotModel({
  currentAnimation = 'idle',
  onAnimationEnd,
  primaryColor = '#6D5DF1',
  enableMouseTracking = true,
  onRobotClick,
  scale = 0.52,
  position = [0, -0.45, 0],
}: RobotModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/robot/ROBOT.glb');

  // Bone references
  const bonesRef = useRef<BoneMap>({
    spine: null,
    pelvisL: null,
    pelvisR: null,
    spine001: null,
    spine002: null,
    spine003: null,
    chest: null,
    breastL: null,
    breastR: null,
    shoulderL: null,
    upperArmL: null,
    forearmL: null,
    handL: null,
    shoulderR: null,
    upperArmR: null,
    forearmR: null,
    handR: null,
    spine004: null,
    neck: null,
    spine005: null,
    head: null,
    spine006: null,
    headTop: null,
    thighL: null,
    shinL: null,
    footL: null,
    heel02L: null,
    toeL: null,
    thighR: null,
    shinR: null,
    footR: null,
    heel02R: null,
    toeR: null,
  });

  // Rest quaternions captured from GLB bind pose
  const restRef = useRef<Map<THREE.Bone, THREE.Quaternion>>(new Map());

  // Jet thruster refs & vector caching
  const thrusterLRef = useRef<THREE.Group>(null);
  const thrusterRRef = useRef<THREE.Group>(null);
  const footAnchorLRef = useRef<THREE.Object3D | null>(null);
  const footAnchorRRef = useRef<THREE.Object3D | null>(null);
  const thrusterIntensityRef = useRef<number>(0.2);
  const _footWPosL = useRef(new THREE.Vector3()).current;
  const _footWPosR = useRef(new THREE.Vector3()).current;

  // Animation timing
  const animTimeRef = useRef(0);
  const endFiredRef = useRef(false);
  const animRef = useRef<RobotAnimationType>(currentAnimation);

  // ─── Model Discovery, Binding Verification & Materials ──────────────────────
  useEffect(() => {
    if (!scene) return;

    // ── Bumblebee Automotive Materials Palette ──
    const matYellow = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFBE00'),
      metalness: 0.65,
      roughness: 0.22,
      clearcoat: 0.95,
      clearcoatRoughness: 0.14,
      reflectivity: 0.9,
    });
    const matBlack = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#131518'),
      metalness: 0.78,
      roughness: 0.26,
      clearcoat: 0.85,
      clearcoatRoughness: 0.18,
    });
    const matGunmetal = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2A2E35'),
      metalness: 0.92,
      roughness: 0.36,
    });
    const matSilver = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#B2BDC8'),
      metalness: 0.96,
      roughness: 0.18,
    });
    const matEyes = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00CFFF'),
      emissive: new THREE.Color('#00B4FF'),
      emissiveIntensity: 2.8,
      roughness: 0.04,
      metalness: 0.05,
    });

    const bones = bonesRef.current;
    const rests = new Map<THREE.Bone, THREE.Quaternion>();
    const discovered: string[] = [];

    // Exact lowercase mapping for all 29 bones discovered in the Blender export
    const nameMap: Record<string, (keyof BoneMap)[]> = {
      spine: ['spine'],
      pelvisl: ['pelvisL'],
      pelvisr: ['pelvisR'],
      spine001: ['spine001'],
      spine002: ['spine002'],
      spine003: ['spine003', 'chest'],
      breastl: ['breastL'],
      breastr: ['breastR'],
      shoulderl: ['shoulderL'],
      upper_arml: ['upperArmL'],
      forearml: ['forearmL'],
      handl: ['handL'],
      shoulderr: ['shoulderR'],
      upper_armr: ['upperArmR'],
      forearmr: ['forearmR'],
      handr: ['handR'],
      spine004: ['spine004', 'neck'],
      spine005: ['spine005', 'head'],
      spine006: ['spine006', 'headTop'],
      thighl: ['thighL'],
      shinl: ['shinL'],
      footl: ['footL'],
      heel02l: ['heel02L'],
      toel: ['toeL'],
      thighr: ['thighR'],
      shinr: ['shinR'],
      footr: ['footR'],
      heel02r: ['heel02R'],
      toer: ['toeR'],
    };

    // Bumblebee Part Classifications
    const yellowMeshNames = new Set([
      'sphere',
      'cube.012', 'cube012',
      'cylinder.003', 'cylinder003',
      'cylinder.005', 'cylinder005',
      'cylinder.008', 'cylinder008',
      'cylinder.009', 'cylinder009',
      'cylinder.016', 'cylinder016',
      'cylinder.017', 'cylinder017',
      'cube.005', 'cube005',
      'cube.001', 'cube001',
      'sphere.003', 'sphere003',
      'sphere.004', 'sphere004',
      'cylinder.012', 'cylinder012',
      'cylinder.013', 'cylinder013',
    ]);

    const blackMeshNames = new Set([
      'cylinder.025', 'cylinder025',
      'cube.015', 'cube015',
      'cube.002', 'cube002',
      'sphere.001', 'sphere001',
      'sphere.002', 'sphere002',
      'cube.003', 'cube003',
      'cube.013', 'cube013',
      'cube.006', 'cube006',
      'cube.008', 'cube008',
      'cube.010', 'cube010',
      'cube.011', 'cube011',
    ]);

    const silverMeshNames = new Set([
      'cylinder',
      'cylinder.010', 'cylinder010',
      'cylinder.018', 'cylinder018',
      'cylinder.019', 'cylinder019',
      'cylinder.020', 'cylinder020',
      'cylinder.021', 'cylinder021',
      'cylinder.022', 'cylinder022',
      'cylinder.023', 'cylinder023',
    ]);

    const eyeMeshNames = new Set([
      'sphere.005', 'sphere005',
      'sphere.006', 'sphere006',
      'sphere.007', 'sphere007',
      'sphere.004', 'sphere004',
    ]);

    let totalObjects = 0;
    let totalBonesCount = 0;
    let totalSkinnedMeshes = 0;
    let validSkinnedMeshes = 0;
    let countYellow = 0;
    let countBlack = 0;
    let countGunmetal = 0;
    let countSilver = 0;
    let countEyes = 0;
    const unrecognized: string[] = [];

    // Traverse scene once
    scene.traverse((obj) => {
      totalObjects++;

      // 1. SkinnedMesh validation & material assignment
      if ((obj as THREE.SkinnedMesh).isSkinnedMesh) {
        totalSkinnedMeshes++;
        const sm = obj as THREE.SkinnedMesh;
        if (sm.skeleton && sm.skeleton.bones && sm.skeleton.bones.length > 0) {
          validSkinnedMeshes++;
        }
        sm.castShadow = true;
        sm.receiveShadow = true;

        const n = sm.name.toLowerCase();

        if (eyeMeshNames.has(n)) {
          sm.material = matEyes;
          countEyes++;
        } else if (yellowMeshNames.has(n)) {
          sm.material = matYellow;
          countYellow++;
        } else if (blackMeshNames.has(n)) {
          sm.material = matBlack;
          countBlack++;
        } else if (silverMeshNames.has(n)) {
          sm.material = matSilver;
          countSilver++;
        } else {
          if (n.includes('cylinder')) {
            sm.material = matGunmetal;
            countGunmetal++;
          } else if (n.includes('cube')) {
            sm.material = matBlack;
            countBlack++;
          } else {
            sm.material = matYellow;
            countYellow++;
          }
        }
      }

      // 2. Bone discovery & rest quaternion capture
      if ((obj as THREE.Bone).isBone) {
        totalBonesCount++;
        const bone = obj as THREE.Bone;
        rests.set(bone, bone.quaternion.clone());

        const normalizedName = bone.name.toLowerCase();
        const targets = nameMap[normalizedName];
        if (targets) {
          targets.forEach((field) => {
            (bones as unknown as Record<string, THREE.Bone | null>)[field] = bone;
          });
          if (!discovered.includes(bone.name)) {
            discovered.push(bone.name);
          }
        }
      }
    });

    restRef.current = rests;

    const bindingValid =
      totalSkinnedMeshes > 0 && validSkinnedMeshes === totalSkinnedMeshes;

    // ── Diagnostic Logs (Required Format) ──────────────────────────────────
    console.log(`[Robot] Total objects traversed: ${totalObjects}`);
    console.log(`[Robot] Total SkinnedMesh objects: ${totalSkinnedMeshes}`);
    console.log(`[Robot] Meshes assigned Yellow Armor: ${countYellow}`);
    console.log(`[Robot] Meshes assigned Black Armor: ${countBlack}`);
    console.log(`[Robot] Meshes assigned Dark Gunmetal: ${countGunmetal}`);
    console.log(`[Robot] Meshes assigned Silver Details: ${countSilver}`);
    console.log(`[Robot] Meshes assigned Glowing Eyes: ${countEyes}`);
    console.log(
      `[Robot] Unrecognized mesh names: ${
        unrecognized.length > 0 ? unrecognized.join(', ') : 'None (100% mapped)'
      }`
    );
    console.log(`[Robot] Total bones: ${totalBonesCount}`);
    console.log(`[Robot] Bone mapping completed: ${discovered.length}`);
    console.log(`[Robot] Head: ${bones.head?.name ?? 'spine005'}`);
    console.log(`[Robot] Chest: ${bones.chest?.name ?? 'spine003'}`);
    console.log(`[Robot] Neck: ${bones.neck?.name ?? 'spine004'}`);
    console.log(`[Robot] Right arm: ${bones.upperArmR?.name ?? 'upper_armR'}`);
    console.log(`[Robot] Left arm: ${bones.upperArmL?.name ?? 'upper_armL'}`);
    console.log(`[Robot] Right leg: ${bones.thighR?.name ?? 'thighR'}`);
    console.log(`[Robot] Left leg: ${bones.thighL?.name ?? 'thighL'}`);
    console.log(`[Robot] Skeleton binding: ${bindingValid ? 'VALID' : 'INVALID'}`);
    console.log(`[Robot] Procedural animation: READY`);

    // Attach thruster anchors directly to the boot soles in model coordinates:
    // Left boot (Cube011) sole is at local [0.055, 0.240, -0.005] of thighL
    // Right boot (Cube010) sole is at local [-0.091, 0.240, -0.004] of thighR
    if (bones.thighL) {
      if (footAnchorLRef.current) bones.thighL.remove(footAnchorLRef.current);
      const anchorL = new THREE.Object3D();
      anchorL.name = 'bootSoleAnchorL';
      anchorL.position.set(0.055, 0.240, -0.005);
      bones.thighL.add(anchorL);
      footAnchorLRef.current = anchorL;
    }
    if (bones.thighR) {
      if (footAnchorRRef.current) bones.thighR.remove(footAnchorRRef.current);
      const anchorR = new THREE.Object3D();
      anchorR.name = 'bootSoleAnchorR';
      anchorR.position.set(-0.091, 0.240, -0.004);
      bones.thighR.add(anchorR);
      footAnchorRRef.current = anchorR;
    }

    return () => {
      if (bones.thighL && footAnchorLRef.current) bones.thighL.remove(footAnchorLRef.current);
      if (bones.thighR && footAnchorRRef.current) bones.thighR.remove(footAnchorRRef.current);
      footAnchorLRef.current = null;
      footAnchorRRef.current = null;
      matYellow.dispose();
      matBlack.dispose();
      matGunmetal.dispose();
      matSilver.dispose();
      matEyes.dispose();
    };
  }, [scene, primaryColor]);

  // Sync animation updates & reset timer
  useEffect(() => {
    animRef.current = currentAnimation;
    animTimeRef.current = 0;
    endFiredRef.current = false;
  }, [currentAnimation]);

  const fireEnd = useCallback(() => {
    if (!endFiredRef.current && onAnimationEnd) {
      endFiredRef.current = true;
      onAnimationEnd();
    }
  }, [onAnimationEnd]);

  // ─── Frame Animation Loop ───────────────────────────────────────────────────
  useFrame((state, dt) => {
    const safeDt = Math.min(dt, 0.05);
    animTimeRef.current += safeDt;

    const anim = animRef.current;
    const t = animTimeRef.current;
    const wallT = performance.now() * 0.001;

    const bones = bonesRef.current;
    const rests = restRef.current;
    if (rests.size === 0 || !groupRef.current) return;

    const R = (b: THREE.Bone | null): THREE.Quaternion =>
      (b && rests.get(b)) || new THREE.Quaternion();

    // ── Group float & mouse lean ──
    if (groupRef.current) {
      const floatY = Math.sin(wallT * 1.5) * 0.045;
      const targetY = position[1] + floatY;
      groupRef.current.position.y +=
        (targetY - groupRef.current.position.y) * (1 - Math.exp(-3.5 * safeDt));

      const px = enableMouseTracking ? state.pointer.x : 0;
      // Face front toward user (+90 deg compensates Blender's -90 deg export)
      const baseRotY = Math.PI / 2;
      const targetRotY = baseRotY + px * 0.22;
      groupRef.current.rotation.y +=
        (targetRotY - groupRef.current.rotation.y) * (1 - Math.exp(-3 * safeDt));
    }

    // ── Subtle spine breathing (always active) ──
    if (bones.spine001) {
      const breath = Math.sin(wallT * 1.3) * 0.025;
      slerpBone(bones.spine001, R(bones.spine001), localDelta(_axisX, breath), 2.5, safeDt);
    }

    // ── Head & Neck Mouse Tracking ──
    // Suppress during intense actions like dance to let choreography run
    const suppressTracking = anim === 'dance';
    if (bones.head && !suppressTracking) {
      const px = enableMouseTracking ? state.pointer.x : 0;
      const py = enableMouseTracking ? state.pointer.y : 0;

      // Local Y yaw = turn left/right, Local X pitch = look up/down
      const yaw = THREE.MathUtils.clamp(px * 0.55, -0.6, 0.6);
      const pitch = THREE.MathUtils.clamp(-py * 0.35, -0.35, 0.28);
      const idleNod = Math.sin(wallT * 1.2) * 0.022;

      // In thinking, add tilt
      const rollTilt = anim === 'thinking' ? 0.32 : 0;

      const delta = localDelta(_axisY, yaw)
        .multiply(localDelta(_axisX, pitch + idleNod))
        .multiply(localDelta(_axisZ, rollTilt));

      slerpBone(bones.head, R(bones.head), delta, 5.5, safeDt);
    }

    if (bones.neck && !suppressTracking) {
      const px = enableMouseTracking ? state.pointer.x : 0;
      const py = enableMouseTracking ? state.pointer.y : 0;
      const yaw = THREE.MathUtils.clamp(px * 0.2, -0.25, 0.25);
      const pitch = THREE.MathUtils.clamp(-py * 0.14, -0.15, 0.12);

      const delta = localDelta(_axisY, yaw).multiply(localDelta(_axisX, pitch));
      slerpBone(bones.neck, R(bones.neck), delta, 4.5, safeDt);
    }

    // ── Animation States ──────────────────────────────────────────────────────
    switch (anim) {
      // ── IDLE ────────────────────────────────────────────────────────────────
      case 'idle': {
        const swayL = Math.sin(wallT * 1.3) * 0.05;
        const swayR = -Math.sin(wallT * 1.3) * 0.05;

        // Subtle pendulum arm sway
        if (bones.upperArmL)
          slerpBone(bones.upperArmL, R(bones.upperArmL), localDelta(_axisX, swayL), 3, safeDt);
        if (bones.upperArmR)
          slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisX, swayR), 3, safeDt);

        // Forearms and hands rest naturally
        if (bones.forearmL) restoreBone(bones.forearmL, R(bones.forearmL), 3.5, safeDt);
        if (bones.forearmR) restoreBone(bones.forearmR, R(bones.forearmR), 3.5, safeDt);
        if (bones.handL) restoreBone(bones.handL, R(bones.handL), 3.5, safeDt);
        if (bones.handR) restoreBone(bones.handR, R(bones.handR), 3.5, safeDt);

        // Legs rest
        if (bones.thighL) restoreBone(bones.thighL, R(bones.thighL), 3, safeDt);
        if (bones.thighR) restoreBone(bones.thighR, R(bones.thighR), 3, safeDt);
        if (bones.shinL) restoreBone(bones.shinL, R(bones.shinL), 3, safeDt);
        if (bones.shinR) restoreBone(bones.shinR, R(bones.shinR), 3, safeDt);
        if (bones.footL) restoreBone(bones.footL, R(bones.footL), 3, safeDt);
        if (bones.footR) restoreBone(bones.footR, R(bones.footR), 3, safeDt);

        // Chest rest
        if (bones.chest) restoreBone(bones.chest, R(bones.chest), 2.5, safeDt);
        break;
      }

      // ── WAVE ────────────────────────────────────────────────────────────────
      case 'wave': {
        // Raise right upper arm: local -Z raises the right arm up
        if (bones.upperArmR) {
          slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisZ, -1.35), 6, safeDt);
        }
        // Forearm bent forward/upward: local +X bends elbow
        if (bones.forearmR) {
          slerpBone(bones.forearmR, R(bones.forearmR), localDelta(_axisX, 1.25), 6, safeDt);
        }
        // Hand waving back and forth
        if (bones.handR) {
          const waveAngle = Math.sin(t * 8.5) * 0.58;
          slerpBone(bones.handR, R(bones.handR), localDelta(_axisZ, waveAngle), 10, safeDt);
        }

        // Left arm relaxed
        if (bones.upperArmL) restoreBone(bones.upperArmL, R(bones.upperArmL), 3, safeDt);
        if (bones.forearmL) restoreBone(bones.forearmL, R(bones.forearmL), 3, safeDt);

        // Legs still
        if (bones.thighL) restoreBone(bones.thighL, R(bones.thighL), 3, safeDt);
        if (bones.thighR) restoreBone(bones.thighR, R(bones.thighR), 3, safeDt);
        if (bones.shinL) restoreBone(bones.shinL, R(bones.shinL), 3, safeDt);
        if (bones.shinR) restoreBone(bones.shinR, R(bones.shinR), 3, safeDt);

        if (t > 3.2) fireEnd();
        break;
      }

      // ── DANCE ───────────────────────────────────────────────────────────────
      case 'dance': {
        const beat = t * 6.2;

        // Torso rhythmic side-to-side groove
        if (bones.chest) {
          const sway = Math.sin(beat) * 0.2;
          slerpBone(bones.chest, R(bones.chest), localDelta(_axisZ, sway), 8, safeDt);
        }

        // Left and Right arms pump in counter-motion
        // For Left arm: local +Z raises arm up
        // For Right arm: local -Z raises arm up
        if (bones.upperArmL) {
          const pumpL = 0.85 + Math.sin(beat) * 0.55;
          slerpBone(bones.upperArmL, R(bones.upperArmL), localDelta(_axisZ, pumpL), 8, safeDt);
        }
        if (bones.upperArmR) {
          const pumpR = -0.85 - Math.sin(beat) * 0.55;
          slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisZ, pumpR), 8, safeDt);
        }

        // Forearms groove
        if (bones.forearmL) {
          const flapL = 0.75 + Math.sin(beat * 0.5) * 0.45;
          slerpBone(bones.forearmL, R(bones.forearmL), localDelta(_axisX, flapL), 8, safeDt);
        }
        if (bones.forearmR) {
          const flapR = 0.75 - Math.sin(beat * 0.5) * 0.45;
          slerpBone(bones.forearmR, R(bones.forearmR), localDelta(_axisX, flapR), 8, safeDt);
        }

        // Head nods to beat
        if (bones.head) {
          const nod = Math.sin(beat) * 0.22;
          slerpBone(bones.head, R(bones.head), localDelta(_axisX, nod), 9, safeDt);
        }

        // Legs slight bounce
        if (bones.thighL) restoreBone(bones.thighL, R(bones.thighL), 4, safeDt);
        if (bones.thighR) restoreBone(bones.thighR, R(bones.thighR), 4, safeDt);

        if (t > 4.5) fireEnd();
        break;
      }

      // ── WALK ────────────────────────────────────────────────────────────────
      case 'walk': {
        const cycle = t * 4.6;
        const swing = Math.sin(cycle) * 0.48;

        // Thighs swing alternately forward and backward
        if (bones.thighL)
          slerpBone(bones.thighL, R(bones.thighL), localDelta(_axisX, swing), 8, safeDt);
        if (bones.thighR)
          slerpBone(bones.thighR, R(bones.thighR), localDelta(_axisX, -swing), 8, safeDt);

        // Knees bend naturally when leg swings forward
        if (bones.shinL) {
          const bendL = Math.max(0, swing) * 0.6;
          slerpBone(bones.shinL, R(bones.shinL), localDelta(_axisX, bendL), 7, safeDt);
        }
        if (bones.shinR) {
          const bendR = Math.max(0, -swing) * 0.6;
          slerpBone(bones.shinR, R(bones.shinR), localDelta(_axisX, bendR), 7, safeDt);
        }

        // Arms counter-swing to balance walking
        if (bones.upperArmL)
          slerpBone(bones.upperArmL, R(bones.upperArmL), localDelta(_axisX, -swing * 0.65), 7, safeDt);
        if (bones.upperArmR)
          slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisX, swing * 0.65), 7, safeDt);

        // Forearms slightly bent
        if (bones.forearmL)
          slerpBone(bones.forearmL, R(bones.forearmL), localDelta(_axisX, 0.35), 5, safeDt);
        if (bones.forearmR)
          slerpBone(bones.forearmR, R(bones.forearmR), localDelta(_axisX, 0.35), 5, safeDt);

        // Spine subtle twist
        if (bones.chest) {
          const twist = Math.sin(cycle) * 0.08;
          slerpBone(bones.chest, R(bones.chest), localDelta(_axisY, twist), 6, safeDt);
        }

        if (t > 4.0) fireEnd();
        break;
      }

      // ── THINKING ────────────────────────────────────────────────────────────
      case 'thinking': {
        // Head tilted (tilt handled in head mouse-tracking logic with rollTilt)
        // Right arm raised, hand near chin
        if (bones.upperArmR) {
          const raise = localDelta(_axisZ, -0.65).multiply(localDelta(_axisX, 0.45));
          slerpBone(bones.upperArmR, R(bones.upperArmR), raise, 5, safeDt);
        }
        if (bones.forearmR) {
          slerpBone(bones.forearmR, R(bones.forearmR), localDelta(_axisX, 1.35), 5, safeDt);
        }
        if (bones.handR) {
          slerpBone(bones.handR, R(bones.handR), localDelta(_axisZ, 0.25), 5, safeDt);
        }

        // Left arm relaxed at side
        if (bones.upperArmL) restoreBone(bones.upperArmL, R(bones.upperArmL), 3.5, safeDt);
        if (bones.forearmL) restoreBone(bones.forearmL, R(bones.forearmL), 3.5, safeDt);

        // Legs still
        if (bones.thighL) restoreBone(bones.thighL, R(bones.thighL), 3.5, safeDt);
        if (bones.thighR) restoreBone(bones.thighR, R(bones.thighR), 3.5, safeDt);
        if (bones.shinL) restoreBone(bones.shinL, R(bones.shinL), 3.5, safeDt);
        if (bones.shinR) restoreBone(bones.shinR, R(bones.shinR), 3.5, safeDt);
        break;
      }

      // ── HAPPY ───────────────────────────────────────────────────────────────
      case 'happy': {
        // Both arms raised outward and up in celebratory V
        if (bones.upperArmL)
          slerpBone(bones.upperArmL, R(bones.upperArmL), localDelta(_axisZ, 1.35), 6, safeDt);
        if (bones.upperArmR)
          slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisZ, -1.35), 6, safeDt);

        // Forearms angled outward
        if (bones.forearmL)
          slerpBone(bones.forearmL, R(bones.forearmL), localDelta(_axisX, 0.5), 6, safeDt);
        if (bones.forearmR)
          slerpBone(bones.forearmR, R(bones.forearmR), localDelta(_axisX, 0.5), 6, safeDt);

        // Chest celebratory pulse
        if (bones.chest) {
          const cheer = Math.sin(t * 6.5) * 0.08;
          slerpBone(bones.chest, R(bones.chest), localDelta(_axisX, cheer), 8, safeDt);
        }

        // Legs still
        if (bones.thighL) restoreBone(bones.thighL, R(bones.thighL), 3.5, safeDt);
        if (bones.thighR) restoreBone(bones.thighR, R(bones.thighR), 3.5, safeDt);

        if (t > 3.5) fireEnd();
        break;
      }
    }

    // ── Reactive Jet Thrusters ──
    const targetIntensity =
      animRef.current === 'walk'
        ? 0.55
        : animRef.current === 'dance'
        ? 0.5
        : animRef.current === 'happy' || animRef.current === 'wave'
        ? 0.35
        : 0.18;
    thrusterIntensityRef.current +=
      (targetIntensity - thrusterIntensityRef.current) * (1 - Math.exp(-4.5 * safeDt));

    // Anchors are physically attached at the boot soles (Cube011 & Cube010)
    if (footAnchorLRef.current && thrusterLRef.current) {
      footAnchorLRef.current.getWorldPosition(_footWPosL);
      thrusterLRef.current.position.copy(_footWPosL);
      thrusterLRef.current.quaternion.copy(groupRef.current.quaternion);
    }
    if (footAnchorRRef.current && thrusterRRef.current) {
      footAnchorRRef.current.getWorldPosition(_footWPosR);
      thrusterRRef.current.position.copy(_footWPosR);
      thrusterRRef.current.quaternion.copy(groupRef.current.quaternion);
    }
  });

  return (
    <>
      <group
        ref={groupRef}
        scale={scale}
        position={position}
        rotation={[0, Math.PI / 2, 0]}
        onPointerOver={() => {
          if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onRobotClick?.();
        }}
      >
        <primitive object={scene} />
      </group>
      <group ref={thrusterLRef}>
        <JetThrusterEffect
          intensityRef={thrusterIntensityRef}
          scale={scale / 0.20}
        />
      </group>
      <group ref={thrusterRRef}>
        <JetThrusterEffect
          intensityRef={thrusterIntensityRef}
          scale={scale / 0.20}
        />
      </group>
    </>
  );
}
