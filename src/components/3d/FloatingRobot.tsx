'use client';

/**
 * FloatingRobot.tsx — Global Floating 3D Robot Companion (Nexus-01)
 *
 * Requirements:
 * - Mounted once in root layout, persistent across page navigations.
 * - Full-screen transparent overlay with `pointer-events: none` so website
 *   remains 100% interactive (no clicks or scrolls blocked).
 * - Small companion size (12-20% of viewport height).
 * - Autonomous procedural wandering, gestures (wave, think, happy, look around).
 * - Dynamic scroll reaction (flies, banks, follows visitor down/up the page).
 * - Attention modes (follows cursor, ignores, gets curious, gets distracted).
 * - Operates directly on the 29 Blender bones of ROBOT.glb.
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/lib/theme/ThemeProvider';

// ─── Bone Map (all 29 GLB joints) ─────────────────────────────────────────────
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

  // ── Physics Position & Spatial Target ──
  // Current 3D position of companion in world units
  const initializedRef = useRef(false);
  const currentPosRef = useRef(new THREE.Vector3(2.2, -1.3, 0));
  const targetPosRef = useRef(new THREE.Vector3(2.2, -1.3, 0));
  const currentVelRef = useRef(new THREE.Vector3(0, 0, 0));

  // Current body rotation (facing + banking)
  const baseRotY = Math.PI / 2; // +90 deg cancels Blender -90 deg export
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

  // Base scale (small companion, 12-20% viewport height)
  const modelScale = isMobile ? 0.15 : 0.20;

  // ── Bone Discovery & Materials Setup ──
  useEffect(() => {
    if (!scene) return;

    const mainArmor = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1e2330'),
      roughness: 0.28,
      metalness: 0.85,
    });
    const darkAlloy = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0d1117'),
      roughness: 0.45,
      metalness: 0.95,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: new THREE.Color(primaryColor),
      roughness: 0.2,
      metalness: 0.7,
      emissive: new THREE.Color(primaryColor),
      emissiveIntensity: 0.5,
    });
    const eyeGlow = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#38bdf8'),
      roughness: 0.08,
      metalness: 0.0,
      emissive: new THREE.Color('#38bdf8'),
      emissiveIntensity: 2.2,
    });

    const bones = bonesRef.current;
    const rests = new Map<THREE.Bone, THREE.Quaternion>();

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

    scene.traverse((obj) => {
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

      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const n = mesh.name.toLowerCase();

        if (
          n.includes('sphere.005') ||
          n.includes('sphere.006') ||
          n.includes('sphere.007') ||
          n.includes('sphere.004') ||
          n.includes('sphere004') ||
          n.includes('sphere005') ||
          n.includes('sphere006')
        ) {
          mesh.material = eyeGlow;
        } else if (
          n.includes('cylinder.0') ||
          n.includes('cylinder001') ||
          n.includes('cylinder002') ||
          n.includes('cylinder003')
        ) {
          mesh.material = accent;
        } else if (n.includes('cylinder')) {
          mesh.material = darkAlloy;
        } else {
          mesh.material = mainArmor;
        }
      }
    });

    restRef.current = rests;

    return () => {
      mainArmor.dispose();
      darkAlloy.dispose();
      accent.dispose();
      eyeGlow.dispose();
    };
  }, [scene, primaryColor]);

  // ── Main Frame Update ───────────────────────────────────────────────────────
  useFrame((_, delta) => {
    // Pause animation when tab is inactive to preserve GPU/battery
    if (typeof document !== 'undefined' && document.hidden) return;

    // Avoid large time jumps on background tab resume
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

    // Default companion home anchor (bottom-right area)
    const homeX = isMobile ? halfW * 0.65 : halfW * 0.72;
    const homeY = isMobile ? -halfH * 0.62 : -halfH * 0.52;

    // First frame initialization to home anchor
    if (!initializedRef.current) {
      initializedRef.current = true;
      currentPosRef.current.set(homeX, homeY, 0);
      targetPosRef.current.set(homeX, homeY, 0);
    }

    // Decay cooldowns
    const state = stateRef.current;
    state.elapsed += safeDt;
    state.attentionElapsed += safeDt;
    state.nextWander -= safeDt;

    Object.keys(state.cooldowns).forEach((k) => {
      state.cooldowns[k] -= safeDt;
      if (state.cooldowns[k] <= 0) delete state.cooldowns[k];
    });

    // ── 1. Scroll-Following & Flying Detection ──
    const scroll = scrollRef.current;
    const isScrollingFast = Math.abs(scroll.velocity) > 120;

    if (isScrollingFast && state.current !== 'flying' && !reducedMotion) {
      state.current = 'flying';
      state.elapsed = 0;
      state.duration = 2.5;
    }

    // Decay scroll velocity smoothly
    scroll.velocity *= Math.exp(-3.5 * safeDt);

    // ── 2. Behavior State Machine Scheduling ──
    if (state.elapsed >= state.duration) {
      state.elapsed = 0;

      // Choose next behavior
      if (state.current === 'flying' && !isScrollingFast) {
        state.current = 'idle';
        state.duration = 3.5 + Math.random() * 2.5;
        targetPosRef.current.set(homeX, homeY, 0);
      } else if (state.current !== 'idle') {
        // Return to idle / floating
        state.current = Math.random() > 0.4 ? 'idle' : 'floating';
        state.duration = 3.0 + Math.random() * 3.0;
      } else {
        // From idle, randomly select a gesture or excursion
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
          // Autonomous wander across the screen!
          state.current = 'floating';
          state.duration = 5.0 + Math.random() * 3.0;

          // Pick a random waypoint within comfortable screen bounds
          const wanderX = (Math.random() * 1.4 - 0.7) * (halfW * 0.75);
          const wanderY = (Math.random() * 1.2 - 0.6) * (halfH * 0.65);
          targetPosRef.current.set(wanderX, wanderY, 0);
        } else {
          state.current = 'idle';
          state.duration = 4.0;
        }
      }
    }

    // ── 3. Attention Mode Cycling (Mouse reaction) ──
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

    // ── 4. Spatial Position & Physics (Smooth Flight & Hover) ──
    if (state.current === 'idle') {
      // Return towards home anchor
      targetPosRef.current.set(homeX, homeY, 0);
    } else if (state.current === 'flying') {
      // During scroll-flight, companion reacts to scroll direction & velocity
      const scrollShiftY = THREE.MathUtils.clamp(
        -scroll.direction * (Math.abs(scroll.velocity) * 0.002),
        -1.2,
        1.2
      );
      // Small lateral sweep while flying
      const lateralShiftX = Math.sin(wallT * 3.5) * 0.4;
      targetPosRef.current.set(homeX + lateralShiftX, homeY + scrollShiftY, 0);
    }

    // Add gentle organic hovering float to target
    const hoverY = Math.sin(wallT * 2.0) * 0.07;
    const hoverX = Math.cos(wallT * 1.3) * 0.04;
    const finalTarget = new THREE.Vector3(
      targetPosRef.current.x + hoverX,
      targetPosRef.current.y + hoverY,
      targetPosRef.current.z
    );

    // Spring damping interpolation to finalTarget
    const posLerp = state.current === 'flying' ? 5.5 : 3.0;
    currentPosRef.current.lerp(finalTarget, 1 - Math.exp(-posLerp * safeDt));

    // Update group position
    groupRef.current.position.copy(currentPosRef.current);

    // ── 5. Body Rotation & Banking ──
    // Determine movement direction for aerodynamic tilt
    const velX = (finalTarget.x - currentPosRef.current.x) * 3;
    const velY = (finalTarget.y - currentPosRef.current.y) * 3;

    // Banking roll when moving sideways: bank into turn
    const bankZ = THREE.MathUtils.clamp(-velX * 0.25, -0.35, 0.35);

    // Pitch forward when flying or moving down
    let pitchX = THREE.MathUtils.clamp(velY * 0.18, -0.35, 0.45);
    if (state.current === 'flying') {
      pitchX += 0.25; // aerodynamic flight lean
    }

    // Yaw: face forward + slight orientation towards cursor if in follow mode
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

    // ── 7. Head & Neck Tracking (Attention-Driven) ──
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
        roll = 0.25; // curious head tilt
      } else if (state.attention === 'distracted') {
        yaw = Math.sin(wallT * 0.9) * 0.45;
        pitch = -0.15;
      } else {
        // ignore — look straight ahead with idle nod
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
      // ── IDLE / FLOATING ────────────────────────────────────────────────────
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

        // Legs relax naturally
        if (bones.thighL) restoreBone(bones.thighL, R(bones.thighL), 3, safeDt);
        if (bones.thighR) restoreBone(bones.thighR, R(bones.thighR), 3, safeDt);
        if (bones.shinL) restoreBone(bones.shinL, R(bones.shinL), 3, safeDt);
        if (bones.shinR) restoreBone(bones.shinR, R(bones.shinR), 3, safeDt);
        break;
      }

      // ── FLYING (Scroll reaction / sprint) ──────────────────────────────────
      case 'flying': {
        // Legs stream backward aerodynamically
        if (bones.thighL)
          slerpBone(bones.thighL, R(bones.thighL), localDelta(_axisX, -0.45), 6, safeDt);
        if (bones.thighR)
          slerpBone(bones.thighR, R(bones.thighR), localDelta(_axisX, -0.45), 6, safeDt);
        if (bones.shinL)
          slerpBone(bones.shinL, R(bones.shinL), localDelta(_axisX, 0.4), 6, safeDt);
        if (bones.shinR)
          slerpBone(bones.shinR, R(bones.shinR), localDelta(_axisX, 0.4), 6, safeDt);

        // Arms trail back slightly
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

      // ── WAVE (Friendly greeting) ───────────────────────────────────────────
      case 'wave': {
        // Raise right upper arm (local -Z)
        if (bones.upperArmR) {
          slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisZ, -1.35), 6, safeDt);
        }
        // Forearm bent up (local +X)
        if (bones.forearmR) {
          slerpBone(bones.forearmR, R(bones.forearmR), localDelta(_axisX, 1.25), 6, safeDt);
        }
        // Hand waves back and forth
        if (bones.handR) {
          const wave = Math.sin(t * 8.5) * 0.6;
          slerpBone(bones.handR, R(bones.handR), localDelta(_axisZ, wave), 10, safeDt);
        }

        // Left arm relaxed
        if (bones.upperArmL) restoreBone(bones.upperArmL, R(bones.upperArmL), 3, safeDt);
        if (bones.forearmL) restoreBone(bones.forearmL, R(bones.forearmL), 3, safeDt);

        // Legs relaxed
        if (bones.thighL) restoreBone(bones.thighL, R(bones.thighL), 3, safeDt);
        if (bones.thighR) restoreBone(bones.thighR, R(bones.thighR), 3, safeDt);
        break;
      }

      // ── THINKING ──────────────────────────────────────────────────────────
      case 'thinking': {
        // Head tilted with contemplative nods
        if (bones.head) {
          const thinkTilt = localDelta(_axisZ, 0.32)
            .multiply(localDelta(_axisX, 0.12 + Math.sin(wallT * 2.2) * 0.04));
          slerpBone(bones.head, R(bones.head), thinkTilt, 5, safeDt);
        }

        // Right hand placed near chin
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

        // Left arm relaxed
        if (bones.upperArmL) restoreBone(bones.upperArmL, R(bones.upperArmL), 3, safeDt);
        if (bones.forearmL) restoreBone(bones.forearmL, R(bones.forearmL), 3, safeDt);
        break;
      }

      // ── HAPPY ─────────────────────────────────────────────────────────────
      case 'happy': {
        // Both arms raised in celebration V
        if (bones.upperArmL)
          slerpBone(bones.upperArmL, R(bones.upperArmL), localDelta(_axisZ, 1.35), 6, safeDt);
        if (bones.upperArmR)
          slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisZ, -1.35), 6, safeDt);

        if (bones.forearmL)
          slerpBone(bones.forearmL, R(bones.forearmL), localDelta(_axisX, 0.5), 6, safeDt);
        if (bones.forearmR)
          slerpBone(bones.forearmR, R(bones.forearmR), localDelta(_axisX, 0.5), 6, safeDt);

        // Head raised cheerfully
        if (bones.head) {
          const cheerNod = Math.sin(t * 6.5) * 0.06;
          slerpBone(bones.head, R(bones.head), localDelta(_axisX, -0.22 + cheerNod), 7, safeDt);
        }

        // Chest celebratory bounce
        if (bones.chest) {
          const cheer = Math.sin(t * 6.5) * 0.08;
          slerpBone(bones.chest, R(bones.chest), localDelta(_axisX, cheer), 7, safeDt);
        }
        break;
      }

      // ── LOOK AROUND ───────────────────────────────────────────────────────
      case 'lookAround': {
        // Head sweeps independently across the page
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
  });

  return (
    <group ref={groupRef} scale={modelScale}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Global Floating Wrapper Component ─────────────────────────────────────────
export default function FloatingRobot() {
  const { primary } = useTheme();

  // Mouse & scroll tracking refs (no re-renders during 60fps loops)
  const pointerRef = useRef({ x: 0, y: 0, movedAt: 0 });
  const scrollRef = useRef({ velocity: 0, direction: 1, lastY: 0, lastTime: 0 });

  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Reduced motion preference
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(media.matches);

      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);

      // Window pointer tracking
      const handlePointerMove = (e: MouseEvent) => {
        // Normalized device coordinates [-1, 1]
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        pointerRef.current = { x: nx, y: ny, movedAt: performance.now() };
      };

      // Window scroll tracking
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
        {/* Balanced studio lighting tuned for transparent full-screen overlay */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 7, 5]} intensity={1.6} />
        <directionalLight position={[-5, 4, -4]} intensity={2.0} color={primary} />
        <pointLight position={[0, -3, 3]} intensity={0.6} color={primary} />
        <pointLight position={[-3, 2, 4]} intensity={0.7} color="#93c5fd" />

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
