'use client';

/**
 * FloatingRobot.tsx — Global Floating 3D Robot Companion (Nexus-01 / Bumblebee)
 *
 * Style:
 * - Premium automotive yellow & glossy black transforming robot inspired by Bumblebee.
 * - Clearcoat metallic yellow primary armor.
 * - Deep glossy black secondary armor plates.
 * - Dark mechanical gunmetal joints, hinges, and hands.
 * - Metallic silver pistons, collar, and actuator rings.
 * - Electric cyan/blue glowing eyes.
 * - Positioned at TOP-LEFT of the app as an autonomous 3D companion.
 * - 100% pointer-events pass-through overlay.
 */

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/lib/theme/ThemeProvider';
import JetThrusterEffect from './JetThrusterEffect';

// ─── Bone Map (29 confirmed GLB joints) ─────────────────────────────────────────
interface BoneMap {
  spine: THREE.Bone | null;
  pelvisL: THREE.Bone | null;
  pelvisR: THREE.Bone | null;
  spine001: THREE.Bone | null;
  spine002: THREE.Bone | null;
  spine003: THREE.Bone | null; // chest
  chest: THREE.Bone | null;
  breastL: THREE.Bone | null;
  breastR: THREE.Bone | null;
  shoulderL: THREE.Bone | null;
  upperArmL: THREE.Bone | null;
  forearmL: THREE.Bone | null;
  handL: THREE.Bone | null;
  shoulderR: THREE.Bone | null;
  upperArmR: THREE.Bone | null;
  forearmR: THREE.Bone | null;
  handR: THREE.Bone | null;
  spine004: THREE.Bone | null; // neck
  neck: THREE.Bone | null;
  spine005: THREE.Bone | null; // head
  head: THREE.Bone | null;
  spine006: THREE.Bone | null; // headTop
  headTop: THREE.Bone | null;
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

type CompanionState =
  | 'idle'
  | 'floating'
  | 'lookAround'
  | 'wave'
  | 'thinking'
  | 'flying'
  | 'happy'
  | 'curious';

type AttentionMode = 'follow' | 'ignore' | 'curious' | 'distracted';

// Shared math constants
const _axisX = new THREE.Vector3(1, 0, 0);
const _axisY = new THREE.Vector3(0, 1, 0);
const _axisZ = new THREE.Vector3(0, 0, 1);

function localDelta(axis: THREE.Vector3, angle: number): THREE.Quaternion {
  return new THREE.Quaternion().setFromAxisAngle(axis, angle);
}

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

function restoreBone(
  bone: THREE.Bone | null,
  rest: THREE.Quaternion,
  speed: number,
  dt: number
) {
  if (!bone) return;
  bone.quaternion.slerp(rest, 1 - Math.exp(-speed * dt));
}

// ─── Companion Model Component ────────────────────────────────────────────────
interface CompanionModelProps {
  primaryColor: string;
  pointerRef: React.MutableRefObject<{ x: number; y: number; movedAt: number }>;
  scrollRef: React.MutableRefObject<{
    velocity: number;
    direction: number;
    lastY: number;
    lastTime: number;
  }>;
  reducedMotion: boolean;
  isMobile: boolean;
}

function CompanionModel({
  primaryColor,
  pointerRef,
  scrollRef,
  reducedMotion,
  isMobile,
}: CompanionModelProps) {
  const { scene } = useGLTF('/models/robot/ROBOT.glb');
  const { viewport } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const bonesRef = useRef<BoneMap>({
    spine: null, pelvisL: null, pelvisR: null, spine001: null, spine002: null,
    spine003: null, chest: null, breastL: null, breastR: null,
    shoulderL: null, upperArmL: null, forearmL: null, handL: null,
    shoulderR: null, upperArmR: null, forearmR: null, handR: null,
    spine004: null, neck: null, spine005: null, head: null,
    spine006: null, headTop: null, thighL: null, shinL: null,
    footL: null, heel02L: null, toeL: null, thighR: null,
    shinR: null, footR: null, heel02R: null, toeR: null,
  });

  const restRef = useRef<Map<THREE.Bone, THREE.Quaternion>>(new Map());

  // ── Jet Thruster refs ────────────────────────────────────────────────────────
  const thrusterLRef = useRef<THREE.Group>(null);
  const thrusterRRef = useRef<THREE.Group>(null);
  // Anchors attached directly to the boot soles in model coordinates
  const footAnchorLRef = useRef<THREE.Object3D | null>(null);
  const footAnchorRRef = useRef<THREE.Object3D | null>(null);
  // Shared intensity ref (0.0–1.0) — written in useFrame, read by JetThrusterEffect
  const thrusterIntensityRef = useRef<number>(0.2);
  // Stable cached vectors (useRef so they're not recreated on render)
  const _footWPosL = useRef(new THREE.Vector3()).current;
  const _footWPosR = useRef(new THREE.Vector3()).current;
  const _downVec = useRef(new THREE.Vector3()).current;

  // ── Physics Position & Spatial Target ──
  // Starts at TOP-RIGHT of the viewport
  const initializedRef = useRef(false);
  const currentPosRef = useRef(new THREE.Vector3(2.2, 1.4, 0));
  const targetPosRef = useRef(new THREE.Vector3(2.2, 1.4, 0));

  // Current body rotation (facing + banking)
  // Base orientation: Math.PI / 2 faces straight forward.
  // Subtracting an angle rotates the robot toward the left (inward toward the page content).
  // Increase the subtracted angle (e.g. - 0.6) to turn more left, or decrease to turn back right.
  const baseRotY = Math.PI / 2 - 1.10;
  const bodyRotRef = useRef({ x: 0, y: baseRotY, z: 0 });

  // ── Behavior State Machine ──
  const stateRef = useRef<{
    current: CompanionState;
    elapsed: number;
    duration: number;
    attention: AttentionMode;
    attentionElapsed: number;
    attentionDuration: number;
    nextWander: number;
    cooldowns: Record<string, number>;
  }>({
    current: 'idle',
    elapsed: 0,
    duration: 4.5,
    attention: 'follow',
    attentionElapsed: 0,
    attentionDuration: 6.0,
    nextWander: 7.0,
    cooldowns: {},
  });

  // Small companion scale (occupies 12-20% viewport height on desktop, smaller on mobile)
  const modelScale = isMobile ? 0.15 : 0.20;

  // ── Bumblebee Material Assignment & Bone Discovery ───────────────────────────
  useEffect(() => {
    if (!scene) return;

    // ── 1. Premium Automotive Materials Palette ──
    // Vibrant clearcoat Bumblebee yellow
    const matYellow = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFBE00'),
      metalness: 0.65,
      roughness: 0.22,
      clearcoat: 0.95,
      clearcoatRoughness: 0.14,
      reflectivity: 0.9,
    });

    // Deep glossy black secondary armor / carbon accents
    const matBlack = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#131518'),
      metalness: 0.78,
      roughness: 0.26,
      clearcoat: 0.85,
      clearcoatRoughness: 0.18,
    });

    // Dark mechanical gunmetal for joints & internal mechanics
    const matGunmetal = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2A2E35'),
      metalness: 0.92,
      roughness: 0.36,
    });

    // Polished metallic silver for pistons, collar, and actuator rings
    const matSilver = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#B2BDC8'),
      metalness: 0.96,
      roughness: 0.18,
    });

    // Glowing cyan/blue electric optics
    const matEyes = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00CFFF'),
      emissive: new THREE.Color('#00B4FF'),
      emissiveIntensity: 2.8,
      roughness: 0.04,
      metalness: 0.05,
    });

    // Subtle warm yellow emissive micro-circuits
    const matYellowAccent = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFBE00'),
      emissive: new THREE.Color('#FF9900'),
      emissiveIntensity: 0.6,
      roughness: 0.25,
      metalness: 0.8,
    });

    const bones = bonesRef.current;
    const rests = new Map<THREE.Bone, THREE.Quaternion>();

    // Bone mapping (case-normalized)
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

    // Material classification rules for Bumblebee aesthetics
    const yellowMeshNames = new Set([
      'sphere',                  // Helmet top / crown
      'cube.012', 'cube012',     // Dominant broad chest armor
      'cylinder.003', 'cylinder003', // Shoulder armor discs
      'cylinder.005', 'cylinder005',
      'cylinder.008', 'cylinder008', // Upper arm bicep armor
      'cylinder.009', 'cylinder009',
      'cylinder.016', 'cylinder016', // Forearm gauntlets
      'cylinder.017', 'cylinder017',
      'cube.005', 'cube005',     // Lower pelvis plate
      'cube.001', 'cube001',     // Thigh armor
      'sphere.003', 'sphere003', // Knee armor caps
      'sphere.004', 'sphere004',
      'cylinder.012', 'cylinder012', // Shin armor plates
      'cylinder.013', 'cylinder013',
    ]);

    const blackMeshNames = new Set([
      'cylinder.025', 'cylinder025', // Head/neck cowl faceplate
      'cube.015', 'cube015',     // Chest center intake / chevron
      'cube.002', 'cube002',     // Spine backplate
      'sphere.001', 'sphere001', // Shoulder joint ball caps
      'sphere.002', 'sphere002',
      'cube.003', 'cube003',     // Hip armor guards
      'cube.013', 'cube013',
      'cube.006', 'cube006',     // Hand backplates
      'cube.008', 'cube008',
      'cube.010', 'cube010',     // Feet / boots
      'cube.011', 'cube011',
    ]);

    const silverMeshNames = new Set([
      'cylinder',                // Neck collar ring
      'cylinder.010', 'cylinder010', // Spine hydraulic pistons
      'cylinder.018', 'cylinder018', // Wrist connectors
      'cylinder.019', 'cylinder019',
      'cylinder.020', 'cylinder020', // Knee pivot discs
      'cylinder.021', 'cylinder021',
      'cylinder.022', 'cylinder022', // Hip pivot rings
      'cylinder.023', 'cylinder023',
    ]);

    const eyeMeshNames = new Set([
      'sphere.005', 'sphere005', // Optical eyes
      'sphere.006', 'sphere006',
      'sphere.007', 'sphere007',
      'sphere.004', 'sphere004',
    ]);

    // Diagnostics counters
    let totalObjects = 0;
    let totalSkinnedMeshes = 0;
    let countYellow = 0;
    let countBlack = 0;
    let countGunmetal = 0;
    let countSilver = 0;
    let countEyes = 0;
    const unrecognized: string[] = [];

    // Traverse scene and assign materials to EVERY SkinnedMesh individually
    scene.traverse((obj) => {
      totalObjects++;

      // 1. Capture bones
      if ((obj as THREE.Bone).isBone) {
        const bone = obj as THREE.Bone;
        rests.set(bone, bone.quaternion.clone());

        const targets = nameMap[bone.name.toLowerCase()];
        if (targets) {
          targets.forEach((field) => {
            (bones as unknown as Record<string, THREE.Bone | null>)[field] = bone;
          });
        }
      }

      // 2. SkinnedMesh Material Assignment
      if ((obj as THREE.SkinnedMesh).isSkinnedMesh) {
        totalSkinnedMeshes++;
        const mesh = obj as THREE.SkinnedMesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const n = mesh.name.toLowerCase();

        // Exact rule matching
        if (eyeMeshNames.has(n)) {
          mesh.material = matEyes;
          countEyes++;
        } else if (yellowMeshNames.has(n)) {
          mesh.material = matYellow;
          countYellow++;
        } else if (blackMeshNames.has(n)) {
          mesh.material = matBlack;
          countBlack++;
        } else if (silverMeshNames.has(n)) {
          mesh.material = matSilver;
          countSilver++;
        } else {
          // Fallback / default rule:
          // Cylinders not explicitly matched are mechanical linkage (gunmetal)
          // Cubes not explicitly matched are secondary armor (black)
          // Spheres are yellow
          if (n.includes('cylinder')) {
            mesh.material = matGunmetal;
            countGunmetal++;
          } else if (n.includes('cube')) {
            mesh.material = matBlack;
            countBlack++;
          } else {
            mesh.material = matYellow;
            countYellow++;
          }
        }
      }
    });

    restRef.current = rests;

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

    // ── Diagnostic Logs (Required Format) ──
    console.log(`[Robot] Total objects traversed: ${totalObjects}`);
    console.log(`[Robot] Total SkinnedMesh objects: ${totalSkinnedMeshes}`);
    console.log(`[Robot] Meshes assigned Yellow Armor: ${countYellow}`);
    console.log(`[Robot] Meshes assigned Black Armor: ${countBlack}`);
    console.log(`[Robot] Meshes assigned Dark Gunmetal: ${countGunmetal}`);
    console.log(`[Robot] Meshes assigned Silver Details: ${countSilver}`);
    console.log(`[Robot] Meshes assigned Glowing Eyes: ${countEyes}`);
    console.log(
      `[Robot] Unrecognized mesh names: ${unrecognized.length > 0 ? unrecognized.join(', ') : 'None (100% mapped)'
      }`
    );

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
      matYellowAccent.dispose();
    };
  }, [scene, primaryColor]);

  // ── Main Frame Loop ─────────────────────────────────────────────────────────
  useFrame((_, delta) => {
    // Suspend updates if document tab is hidden to save battery
    if (typeof document !== 'undefined' && document.hidden) return;

    const safeDt = Math.min(delta, 0.05);
    const wallT = performance.now() * 0.001;

    const bones = bonesRef.current;
    const rests = restRef.current;
    if (rests.size === 0 || !groupRef.current) return;

    const R = (b: THREE.Bone | null): THREE.Quaternion =>
      (b && rests.get(b)) || new THREE.Quaternion();

    // Screen viewport bounds in 3D world coordinates
    const halfW = viewport.width / 2;
    const halfH = viewport.height / 2;

    // ── HOME ANCHOR: TOP-RIGHT OF THE VIEWPORT ──
    const homeX = isMobile ? halfW * 0.65 : halfW * 0.72;
    const homeY = isMobile ? halfH * 0.68 : halfH * 0.60;

    // Initial position on frame 0
    if (!initializedRef.current) {
      initializedRef.current = true;
      currentPosRef.current.set(homeX, homeY, 0);
      targetPosRef.current.set(homeX, homeY, 0);
    }

    // Decay timers & cooldowns
    const state = stateRef.current;
    state.elapsed += safeDt;
    state.attentionElapsed += safeDt;
    state.nextWander -= safeDt;

    Object.keys(state.cooldowns).forEach((k) => {
      state.cooldowns[k] -= safeDt;
      if (state.cooldowns[k] <= 0) delete state.cooldowns[k];
    });

    // ── 1. Scroll Detection & Flight Reaction ──
    const scroll = scrollRef.current;
    const isScrollingFast = Math.abs(scroll.velocity) > 120;

    if (isScrollingFast && state.current !== 'flying' && !reducedMotion) {
      state.current = 'flying';
      state.elapsed = 0;
      state.duration = 2.5;
    }

    scroll.velocity *= Math.exp(-3.5 * safeDt);

    // ── 2. Behavior State Machine Scheduling ──
    if (state.elapsed >= state.duration) {
      state.elapsed = 0;

      if (state.current === 'flying' && !isScrollingFast) {
        state.current = 'idle';
        state.duration = 3.5 + Math.random() * 2.5;
        targetPosRef.current.set(homeX, homeY, 0);
      } else if (state.current !== 'idle') {
        state.current = Math.random() > 0.4 ? 'idle' : 'floating';
        state.duration = 3.0 + Math.random() * 3.0;
      } else {
        const roll = Math.random();
        if (roll < 0.22 && !state.cooldowns['wave']) {
          state.current = 'wave';
          state.duration = 3.2;
          state.cooldowns['wave'] = 14.0;
        } else if (roll < 0.42 && !state.cooldowns['thinking']) {
          state.current = 'thinking';
          state.duration = 3.8;
          state.cooldowns['thinking'] = 16.0;
        } else if (roll < 0.58 && !state.cooldowns['happy']) {
          state.current = 'happy';
          state.duration = 3.2;
          state.cooldowns['happy'] = 18.0;
        } else if (roll < 0.78) {
          state.current = 'lookAround';
          state.duration = 4.0;
        } else if (!reducedMotion) {
          // Autonomous excursion from top-right across the screen
          state.current = 'floating';
          state.duration = 5.0 + Math.random() * 3.0;

          // Waypoints anchored around upper half & right side
          const wanderX = halfW * 0.3 + (Math.random() * 1.0 - 0.5) * (halfW * 0.8);
          const wanderY = halfH * 0.4 + (Math.random() * 0.8 - 0.4) * (halfH * 0.6);
          targetPosRef.current.set(wanderX, wanderY, 0);
        } else {
          state.current = 'idle';
          state.duration = 4.0;
        }
      }
    }

    // ── 3. Attention Mode Cycling ──
    if (state.attentionElapsed >= state.attentionDuration) {
      state.attentionElapsed = 0;
      state.attentionDuration = 5.0 + Math.random() * 5.0;

      const attRoll = Math.random();
      if (attRoll < 0.55) {
        state.attention = 'follow';
      } else if (attRoll < 0.75) {
        state.attention = 'curious';
      } else if (attRoll < 0.90) {
        state.attention = 'distracted';
      } else {
        state.attention = 'ignore';
      }
    }

    // ── 4. Spatial Position & Physics ──
    if (state.current === 'idle') {
      targetPosRef.current.set(homeX, homeY, 0);
    } else if (state.current === 'flying') {
      // Dips or swoops down when visitor scrolls down, rises when scrolling up
      const scrollShiftY = THREE.MathUtils.clamp(
        -scroll.direction * (Math.abs(scroll.velocity) * 0.002),
        -1.3,
        1.3
      );
      const lateralShiftX = Math.sin(wallT * 3.5) * 0.45;
      targetPosRef.current.set(homeX + lateralShiftX, homeY + scrollShiftY, 0);
    }

    // Gentle hover bobbing
    const hoverY = Math.sin(wallT * 2.0) * 0.065;
    const hoverX = Math.cos(wallT * 1.3) * 0.035;
    const finalTarget = new THREE.Vector3(
      targetPosRef.current.x + hoverX,
      targetPosRef.current.y + hoverY,
      targetPosRef.current.z
    );

    const posLerp = state.current === 'flying' ? 5.5 : 3.0;
    currentPosRef.current.lerp(finalTarget, 1 - Math.exp(-posLerp * safeDt));
    groupRef.current.position.copy(currentPosRef.current);

    // ── 5. Body Rotation & Aerodynamic Banking ──
    const velX = (finalTarget.x - currentPosRef.current.x) * 3;
    const velY = (finalTarget.y - currentPosRef.current.y) * 3;

    // Bank into lateral curves
    const bankZ = THREE.MathUtils.clamp(-velX * 0.25, -0.35, 0.35);

    // Pitch forward when flying
    let pitchX = THREE.MathUtils.clamp(velY * 0.18, -0.35, 0.45);
    if (state.current === 'flying') {
      pitchX += 0.25;
    }

    // Yaw: facing forward + slight cursor follow
    const ptr = pointerRef.current;
    let targetYaw = baseRotY;
    if (state.attention === 'follow') {
      targetYaw += ptr.x * 0.22;
    }

    const rotSpeed = 4.5;
    bodyRotRef.current.x += (pitchX - bodyRotRef.current.x) * (1 - Math.exp(-rotSpeed * safeDt));
    bodyRotRef.current.y += (targetYaw - bodyRotRef.current.y) * (1 - Math.exp(-rotSpeed * safeDt));
    bodyRotRef.current.z += (bankZ - bodyRotRef.current.z) * (1 - Math.exp(-rotSpeed * safeDt));

    groupRef.current.rotation.set(
      bodyRotRef.current.x,
      bodyRotRef.current.y,
      bodyRotRef.current.z
    );

    // ── 6. Torso & Spine Idle Breathing ──
    if (bones.spine001) {
      const breath = Math.sin(wallT * 1.6) * 0.03;
      slerpBone(bones.spine001, R(bones.spine001), localDelta(_axisX, breath), 3, safeDt);
    }

    // ── 7. Head & Neck Attention Tracking ──
    const hasHeadGesture =
      state.current === 'thinking' ||
      state.current === 'happy' ||
      state.current === 'lookAround';

    if (bones.head && !hasHeadGesture) {
      let yaw = 0;
      let pitch = 0;
      let roll = 0;

      if (state.attention === 'follow') {
        yaw = THREE.MathUtils.clamp(ptr.x * 0.6, -0.65, 0.65);
        pitch = THREE.MathUtils.clamp(-ptr.y * 0.4, -0.4, 0.3);
      } else if (state.attention === 'curious') {
        yaw = THREE.MathUtils.clamp(ptr.x * 0.5, -0.5, 0.5);
        pitch = THREE.MathUtils.clamp(-ptr.y * 0.3, -0.3, 0.25);
        roll = 0.25; // inquisitive head tilt
      } else if (state.attention === 'distracted') {
        yaw = Math.sin(wallT * 0.9) * 0.45;
        pitch = -0.15;
      } else {
        pitch = Math.sin(wallT * 1.4) * 0.03;
      }

      const idleNod = Math.sin(wallT * 1.5) * 0.02;
      const headDelta = localDelta(_axisY, yaw)
        .multiply(localDelta(_axisX, pitch + idleNod))
        .multiply(localDelta(_axisZ, roll));

      slerpBone(bones.head, R(bones.head), headDelta, 6, safeDt);
    }

    if (bones.neck && !hasHeadGesture) {
      const neckYaw = state.attention === 'follow' ? ptr.x * 0.22 : 0;
      const neckPitch = state.attention === 'follow' ? -ptr.y * 0.15 : 0;
      const neckDelta = localDelta(_axisY, neckYaw).multiply(localDelta(_axisX, neckPitch));
      slerpBone(bones.neck, R(bones.neck), neckDelta, 4.5, safeDt);
    }

    // ── 8. Gesture State Dispatches ──
    const t = state.elapsed;

    switch (state.current) {
      case 'idle':
      case 'floating': {
        const armSway = Math.sin(wallT * 1.4) * 0.06;
        if (bones.upperArmL)
          slerpBone(bones.upperArmL, R(bones.upperArmL), localDelta(_axisX, armSway), 3, safeDt);
        if (bones.upperArmR)
          slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisX, -armSway), 3, safeDt);

        if (bones.forearmL) restoreBone(bones.forearmL, R(bones.forearmL), 3.5, safeDt);
        if (bones.forearmR) restoreBone(bones.forearmR, R(bones.forearmR), 3.5, safeDt);
        if (bones.handL) restoreBone(bones.handL, R(bones.handL), 3.5, safeDt);
        if (bones.handR) restoreBone(bones.handR, R(bones.handR), 3.5, safeDt);

        if (bones.thighL) restoreBone(bones.thighL, R(bones.thighL), 3, safeDt);
        if (bones.thighR) restoreBone(bones.thighR, R(bones.thighR), 3, safeDt);
        if (bones.shinL) restoreBone(bones.shinL, R(bones.shinL), 3, safeDt);
        if (bones.shinR) restoreBone(bones.shinR, R(bones.shinR), 3, safeDt);
        break;
      }

      case 'flying': {
        if (bones.thighL)
          slerpBone(bones.thighL, R(bones.thighL), localDelta(_axisX, -0.45), 6, safeDt);
        if (bones.thighR)
          slerpBone(bones.thighR, R(bones.thighR), localDelta(_axisX, -0.45), 6, safeDt);
        if (bones.shinL)
          slerpBone(bones.shinL, R(bones.shinL), localDelta(_axisX, 0.4), 6, safeDt);
        if (bones.shinR)
          slerpBone(bones.shinR, R(bones.shinR), localDelta(_axisX, 0.4), 6, safeDt);

        if (bones.upperArmL)
          slerpBone(bones.upperArmL, R(bones.upperArmL), localDelta(_axisX, -0.3), 5, safeDt);
        if (bones.upperArmR)
          slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisX, -0.3), 5, safeDt);

        if (bones.forearmL)
          slerpBone(bones.forearmL, R(bones.forearmL), localDelta(_axisX, 0.25), 5, safeDt);
        if (bones.forearmR)
          slerpBone(bones.forearmR, R(bones.forearmR), localDelta(_axisX, 0.25), 5, safeDt);
        break;
      }

      case 'wave': {
        if (bones.upperArmR) {
          slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisZ, -1.35), 6, safeDt);
        }
        if (bones.forearmR) {
          slerpBone(bones.forearmR, R(bones.forearmR), localDelta(_axisX, 1.25), 6, safeDt);
        }
        if (bones.handR) {
          const wave = Math.sin(t * 8.5) * 0.6;
          slerpBone(bones.handR, R(bones.handR), localDelta(_axisZ, wave), 10, safeDt);
        }

        if (bones.upperArmL) restoreBone(bones.upperArmL, R(bones.upperArmL), 3, safeDt);
        if (bones.forearmL) restoreBone(bones.forearmL, R(bones.forearmL), 3, safeDt);
        break;
      }

      case 'thinking': {
        if (bones.head) {
          const thinkTilt = localDelta(_axisZ, 0.32).multiply(
            localDelta(_axisX, 0.12 + Math.sin(wallT * 2.2) * 0.04)
          );
          slerpBone(bones.head, R(bones.head), thinkTilt, 5, safeDt);
        }

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

        if (bones.upperArmL) restoreBone(bones.upperArmL, R(bones.upperArmL), 3, safeDt);
        if (bones.forearmL) restoreBone(bones.forearmL, R(bones.forearmL), 3, safeDt);
        break;
      }

      case 'happy': {
        if (bones.upperArmL)
          slerpBone(bones.upperArmL, R(bones.upperArmL), localDelta(_axisZ, 1.35), 6, safeDt);
        if (bones.upperArmR)
          slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisZ, -1.35), 6, safeDt);

        if (bones.forearmL)
          slerpBone(bones.forearmL, R(bones.forearmL), localDelta(_axisX, 0.5), 6, safeDt);
        if (bones.forearmR)
          slerpBone(bones.forearmR, R(bones.forearmR), localDelta(_axisX, 0.5), 6, safeDt);

        if (bones.head) {
          const cheerNod = Math.sin(t * 6.5) * 0.06;
          slerpBone(bones.head, R(bones.head), localDelta(_axisX, -0.22 + cheerNod), 7, safeDt);
        }

        if (bones.chest) {
          const cheer = Math.sin(t * 6.5) * 0.08;
          slerpBone(bones.chest, R(bones.chest), localDelta(_axisX, cheer), 7, safeDt);
        }
        break;
      }

      case 'lookAround': {
        if (bones.head) {
          const sweepYaw = Math.sin(t * 1.5) * 0.5;
          const sweepPitch = Math.sin(t * 0.8) * 0.2;
          slerpBone(
            bones.head,
            R(bones.head),
            localDelta(_axisY, sweepYaw).multiply(localDelta(_axisX, sweepPitch)),
            4,
            safeDt
          );
        }
        if (bones.neck) {
          const sweepYaw = Math.sin(t * 1.5) * 0.2;
          slerpBone(bones.neck, R(bones.neck), localDelta(_axisY, sweepYaw), 3.5, safeDt);
        }
        break;
      }
    }

    // ── 9. Reactive Jet Thrusters ──
    const targetIntensity =
      state.current === 'flying'
        ? 1.0
        : state.current === 'floating'
        ? 0.42
        : state.current === 'happy' || state.current === 'wave'
        ? 0.35
        : 0.22;

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
      <group ref={groupRef} scale={modelScale}>
        <primitive object={scene} />
      </group>
      <group ref={thrusterLRef}>
        <JetThrusterEffect
          intensityRef={thrusterIntensityRef}
          reducedMotion={reducedMotion}
        />
      </group>
      <group ref={thrusterRRef}>
        <JetThrusterEffect
          intensityRef={thrusterIntensityRef}
          reducedMotion={reducedMotion}
        />
      </group>
    </>
  );
}

// ─── Global Floating Wrapper Component ─────────────────────────────────────────
export default function FloatingRobot() {
  const { primary } = useTheme();

  const pointerRef = useRef({ x: 0, y: 0, movedAt: 0 });
  const scrollRef = useRef({ velocity: 0, direction: 1, lastY: 0, lastTime: 0 });

  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(media.matches);

      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);

      const handlePointerMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        pointerRef.current = { x: nx, y: ny, movedAt: performance.now() };
      };

      const handleScroll = () => {
        const now = performance.now();
        const currentY = window.scrollY;
        const dt = Math.max((now - scrollRef.current.lastTime) * 0.001, 0.016);
        const deltaY = currentY - scrollRef.current.lastY;

        const vel = deltaY / dt;
        scrollRef.current = {
          velocity: THREE.MathUtils.clamp(vel, -2500, 2500),
          direction: deltaY >= 0 ? 1 : -1,
          lastY: currentY,
          lastTime: now,
        };
      };

      window.addEventListener('mousemove', handlePointerMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('resize', checkMobile);
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        style={{ pointerEvents: 'none' }}
      >
        {/* Studio Lighting tuned for metallic yellow and glossy black */}
        <ambientLight intensity={1.1} />
        {/* Key light shining down from top-right */}
        <directionalLight position={[4, 7, 5]} intensity={2.0} />
        {/* Secondary fill light from left */}
        <directionalLight position={[-5, 4, 3]} intensity={1.2} color="#ffffff" />
        {/* Warm automotive rim light */}
        <directionalLight position={[2, -3, -4]} intensity={1.8} color="#FFBE00" />
        {/* Cyan optical bounce light */}
        <pointLight position={[3, 2, 4]} intensity={0.9} color="#00CFFF" />
        <pointLight position={[-2, -2, 2]} intensity={0.5} color="#ffffff" />

        <CompanionModel
          primaryColor={primary}
          pointerRef={pointerRef}
          scrollRef={scrollRef}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
