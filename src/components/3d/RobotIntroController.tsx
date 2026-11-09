'use client';

/**
 * RobotIntroController.tsx — Cinematic Transformers-Style Intro Choreography
 *
 * State Sequence:
 *   loading → arrival → wakeUp → wave → rotate360 → takeoff → backflip → flying → exitRight → reveal → returnFromLeft → companionIdle
 *
 * Controls:
 * - Real asset readiness tracking
 * - Smooth camera / position interpolation
 * - Aerobatic backflip & turntable 360° rotation
 * - Energon eye pulse & reactive jet flames
 * - Seamless handoff to companion idle
 */

import * as THREE from 'three';
import { IntroPhase } from './RobotIntroContext';

// Math helpers
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

export interface ChoreographyParams {
  phase: IntroPhase;
  setPhase: (p: IntroPhase) => void;
  elapsed: number;
  safeDt: number;
  wallT: number;
  isAppReady: boolean;
  bones: Record<string, THREE.Bone | null>;
  rests: Map<THREE.Bone, THREE.Quaternion>;
  group: THREE.Group;
  currentPos: THREE.Vector3;
  bodyRot: { x: number; y: number; z: number };
  thrusterIntensityRef: React.MutableRefObject<number>;
  matEyesRef: React.MutableRefObject<THREE.MeshStandardMaterial | null>;
  pointerRef?: React.MutableRefObject<{ x: number; y: number; movedAt: number }>;
  halfW: number;
  halfH: number;
  homeX: number;
  homeY: number;
  heroScale: number;
  companionScale: number;
  baseRotY: number;
}

// ── Base rotation: Math.PI / 2 points robot chest and eyes directly at user / camera ──
const INTRO_FACE_Y = Math.PI / 2;

export function updateIntroChoreography({
  phase,
  setPhase,
  elapsed,
  safeDt,
  wallT,
  isAppReady,
  bones,
  rests,
  group,
  currentPos,
  bodyRot,
  thrusterIntensityRef,
  matEyesRef,
  pointerRef,
  halfW,
  homeX,
  homeY,
  heroScale,
  companionScale,
  baseRotY,
}: ChoreographyParams) {
  const R = (b: THREE.Bone | null): THREE.Quaternion =>
    (b && rests.get(b)) || new THREE.Quaternion();

  // Subtle interactive gaze tracking toward visitor's cursor if present
  const pointerX = pointerRef ? pointerRef.current.x : 0;
  const pointerY = pointerRef ? pointerRef.current.y : 0;

  switch (phase) {
    // ── 1. LOADING: Hovering high above screen, facing straight at visitor ───
    case 'loading': {
      currentPos.set(0, 3.0, -1.8);
      bodyRot.x = 0.15;
      bodyRot.y = INTRO_FACE_Y; // Dead center facing visitor
      bodyRot.z = 0;
      group.scale.setScalar(heroScale);
      thrusterIntensityRef.current = 0.35;

      // Dark optics until activation
      if (matEyesRef.current) matEyesRef.current.emissiveIntensity = 0.0;

      if (elapsed >= 0.8) {
        setPhase('arrival');
      }
      break;
    }

    // ── 2. ARRIVAL: Fast cinematic glide down facing visitor ─────────────────
    case 'arrival': {
      const p = Math.min(1, elapsed / 1.6);
      const ease = p * p * (3 - 2 * p); // smooth deceleration

      // Glide from [0, 3.0, -1.8] down to center [0, -0.15, 0]
      currentPos.x = 0;
      currentPos.y = THREE.MathUtils.lerp(3.0, -0.15, ease);
      currentPos.z = THREE.MathUtils.lerp(-1.8, 0, ease);

      // Pitch forward slightly on entry then recover upright facing visitor
      const pitch = Math.sin(p * Math.PI) * 0.22;
      bodyRot.x = pitch;
      bodyRot.y = INTRO_FACE_Y; // Straight at visitor
      bodyRot.z = 0;

      // High deceleration thruster burn
      thrusterIntensityRef.current = p > 0.7 ? 0.45 : 0.85;

      if (matEyesRef.current) matEyesRef.current.emissiveIntensity = 0.0;

      if (elapsed >= 1.6) {
        setPhase('wakeUp');
      }
      break;
    }

    // ── 3. WAKE UP: Optics ignite, robot looks directly into visitor's eyes ───
    case 'wakeUp': {
      const p = Math.min(1, elapsed / 1.4);
      currentPos.x = 0;
      currentPos.y = -0.15 + Math.sin(wallT * 2.0) * 0.03;
      currentPos.z = 0;

      // Body faces straight at user
      bodyRot.x = 0;
      bodyRot.y = INTRO_FACE_Y;
      bodyRot.z = 0;

      // Dramatic eye flicker and ignition surge
      if (matEyesRef.current) {
        const pulse = Math.sin(elapsed * 26) * 0.8 + 1.2;
        matEyesRef.current.emissiveIntensity = p > 0.3 ? 3.5 * pulse : 0.5;
      }

      // Head levels perfectly to make direct eye contact with the visitor
      // +0.18 pitch levels the robot's head dead-center on the camera
      const lookYaw = THREE.MathUtils.clamp(pointerX * 0.25, -0.35, 0.35);
      const lookPitch = THREE.MathUtils.clamp(-pointerY * 0.18, -0.25, 0.25);

      if (bones.head) {
        const headTarget = localDelta(_axisY, lookYaw).multiply(
          localDelta(_axisX, 0.18 + lookPitch)
        );
        slerpBone(bones.head, R(bones.head), headTarget, 7, safeDt);
      }
      if (bones.neck) {
        slerpBone(bones.neck, R(bones.neck), localDelta(_axisY, lookYaw * 0.5), 5, safeDt);
      }

      thrusterIntensityRef.current = 0.4;

      if (elapsed >= 1.4) {
        setPhase('wave');
      }
      break;
    }

    // ── 4. WAVE: Friendly robotic greeting gesture directly facing visitor ───
    case 'wave': {
      currentPos.x = 0;
      currentPos.y = -0.15 + Math.sin(wallT * 2.0) * 0.035;
      currentPos.z = 0;

      bodyRot.x = 0;
      bodyRot.y = INTRO_FACE_Y; // Straight at visitor
      bodyRot.z = 0;

      if (matEyesRef.current) matEyesRef.current.emissiveIntensity = 3.0;

      // Right arm raises into friendly wave
      if (bones.upperArmR) {
        slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisZ, -1.35), 7, safeDt);
      }
      if (bones.forearmR) {
        slerpBone(bones.forearmR, R(bones.forearmR), localDelta(_axisX, 1.25), 7, safeDt);
      }
      if (bones.handR) {
        const waveAngle = Math.sin(elapsed * 9.0) * 0.65;
        slerpBone(bones.handR, R(bones.handR), localDelta(_axisZ, waveAngle), 12, safeDt);
      }

      // Head looks directly at visitor with an inquisitive friendly tilt
      const lookYaw = THREE.MathUtils.clamp(pointerX * 0.22, -0.3, 0.3);
      const lookPitch = THREE.MathUtils.clamp(-pointerY * 0.16, -0.2, 0.2);
      if (bones.head) {
        const tilt = localDelta(_axisZ, 0.12).multiply(
          localDelta(_axisY, lookYaw).multiply(localDelta(_axisX, 0.16 + lookPitch))
        );
        slerpBone(bones.head, R(bones.head), tilt, 6, safeDt);
      }

      thrusterIntensityRef.current = 0.42;

      if (elapsed >= 2.2) {
        setPhase('rotate360');
      }
      break;
    }

    // ── 5. ROTATE 360: Full 360-degree turntable showcasing Bumblebee armor ───
    case 'rotate360': {
      const p = Math.min(1, elapsed / 3.0);
      const ease = p * p * (3 - 2 * p); // luxury smoothstep rotation

      currentPos.x = 0;
      currentPos.y = -0.15 + Math.sin(wallT * 2.2) * 0.03;
      currentPos.z = 0;

      // Body rotates 360° continuously around Y, starting & ending facing visitor
      bodyRot.x = 0;
      bodyRot.y = INTRO_FACE_Y + ease * Math.PI * 2;
      bodyRot.z = 0;

      // Arms restore to neutral sides
      if (bones.upperArmR) restoreBone(bones.upperArmR, R(bones.upperArmR), 5, safeDt);
      if (bones.forearmR) restoreBone(bones.forearmR, R(bones.forearmR), 5, safeDt);
      if (bones.handR) restoreBone(bones.handR, R(bones.handR), 5, safeDt);
      if (bones.head) restoreBone(bones.head, R(bones.head), 4, safeDt);

      thrusterIntensityRef.current = 0.45;

      if (elapsed >= 3.0) {
        setPhase('takeoff');
      }
      break;
    }

    // ── 6. TAKEOFF: Jet thrusters surge, lifting robot higher ────────────────
    case 'takeoff': {
      const p = Math.min(1, elapsed / 1.0);
      const ease = p * p;

      // Body rises upward from -0.15 to +0.22
      currentPos.x = 0;
      currentPos.y = THREE.MathUtils.lerp(-0.15, 0.22, ease);
      currentPos.z = 0;

      bodyRot.x = 0.15 * Math.sin(p * Math.PI); // slight crouch & spring
      bodyRot.y = INTRO_FACE_Y; // Straight at visitor
      bodyRot.z = 0;

      // Blazing thruster surge to 1.0
      thrusterIntensityRef.current = THREE.MathUtils.lerp(0.45, 1.0, ease);

      if (elapsed >= 1.0) {
        setPhase('backflip');
      }
      break;
    }

    // ── 7. BACKFLIP: Controlled 360° pitch flip with procedural leg tuck ─────
    case 'backflip': {
      const p = Math.min(1, elapsed / 1.8);

      // Vertical parabolic vault arc: starts at 0.22, vaults to 0.75, returns to 0.22
      const vaultY = 0.22 + Math.sin(p * Math.PI) * 0.55;
      currentPos.x = 0;
      currentPos.y = vaultY;
      currentPos.z = 0;

      // Full 360° pitch rotation along X axis (backwards flip facing visitor)
      bodyRot.x = -p * Math.PI * 2;
      bodyRot.y = INTRO_FACE_Y;
      bodyRot.z = 0;

      // Maximum thruster fire
      thrusterIntensityRef.current = 1.0;

      // Procedural tuck at flip apex (legs bend inward, arms tuck)
      const tuck = Math.sin(p * Math.PI);
      if (bones.thighL) slerpBone(bones.thighL, R(bones.thighL), localDelta(_axisX, -0.9 * tuck), 14, safeDt);
      if (bones.thighR) slerpBone(bones.thighR, R(bones.thighR), localDelta(_axisX, -0.9 * tuck), 14, safeDt);
      if (bones.shinL) slerpBone(bones.shinL, R(bones.shinL), localDelta(_axisX, 0.8 * tuck), 14, safeDt);
      if (bones.shinR) slerpBone(bones.shinR, R(bones.shinR), localDelta(_axisX, 0.8 * tuck), 14, safeDt);

      if (bones.upperArmL) slerpBone(bones.upperArmL, R(bones.upperArmL), localDelta(_axisZ, 0.45 * tuck), 10, safeDt);
      if (bones.upperArmR) slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisZ, -0.45 * tuck), 10, safeDt);

      if (elapsed >= 1.8) {
        setPhase('flying');
      }
      break;
    }

    // ── 8. FLYING: Dynamic aerodynamic hover facing visitor + readiness sync ─
    case 'flying': {
      currentPos.x = 0;
      currentPos.y = 0.20 + Math.sin(wallT * 2.5) * 0.04;
      currentPos.z = 0;

      // Aerodynamic forward pitch
      bodyRot.x = 0.30;
      bodyRot.y = INTRO_FACE_Y; // Straight at visitor
      bodyRot.z = 0;

      // Legs trailing back naturally in flight
      if (bones.thighL) slerpBone(bones.thighL, R(bones.thighL), localDelta(_axisX, -0.4), 6, safeDt);
      if (bones.thighR) slerpBone(bones.thighR, R(bones.thighR), localDelta(_axisX, -0.4), 6, safeDt);
      if (bones.shinL) slerpBone(bones.shinL, R(bones.shinL), localDelta(_axisX, 0.35), 6, safeDt);
      if (bones.shinR) slerpBone(bones.shinR, R(bones.shinR), localDelta(_axisX, 0.35), 6, safeDt);

      // Arms swept back
      if (bones.upperArmL) slerpBone(bones.upperArmL, R(bones.upperArmL), localDelta(_axisX, -0.3), 5, safeDt);
      if (bones.upperArmR) slerpBone(bones.upperArmR, R(bones.upperArmR), localDelta(_axisX, -0.3), 5, safeDt);

      thrusterIntensityRef.current = 0.7;

      // If app is fully loaded (and min 0.8s flight pose displayed), launch exit!
      if (isAppReady && elapsed >= 0.8) {
        setPhase('exitRight');
      }
      break;
    }

    // ── 9. EXIT RIGHT: Full throttle acceleration off the right edge ─────────
    case 'exitRight': {
      const p = Math.min(1, elapsed / 1.3);

      // Banks and rolls into turn toward the right
      bodyRot.y = INTRO_FACE_Y - p * 0.85;
      bodyRot.x = 0.35;
      bodyRot.z = -p * 0.45; // banking into turn

      // Accelerates rapidly off-screen to the right
      currentPos.x += (halfW * 1.6 - currentPos.x) * (1 - Math.exp(-3.8 * safeDt));
      thrusterIntensityRef.current = 1.0;

      // Trigger reveal of website at midpoint of flight
      if (p >= 0.4) {
        setPhase('reveal');
      }
      break;
    }

    // ── 10. REVEAL: Website backdrop dissolves, website is live ──────────────
    case 'reveal': {
      // Continue off-screen flight
      currentPos.x += (halfW * 1.8 - currentPos.x) * (1 - Math.exp(-4 * safeDt));
      thrusterIntensityRef.current = 1.0;

      // Once off-screen and overlay fading starts (0.7s), queue return
      if (elapsed >= 0.7) {
        setPhase('returnFromLeft');
      }
      break;
    }

    // ── 11. RETURN FROM LEFT: Swoops in from left, transitions to top-right ───
    case 'returnFromLeft': {
      const p = Math.min(1, elapsed / 2.0);
      const ease = p * p * (3 - 2 * p); // smooth s-curve flight path

      // Swoop in from off-screen left into home anchor
      const startX = -halfW * 1.3;
      const startY = homeY + 0.35;

      currentPos.x = THREE.MathUtils.lerp(startX, homeX, ease);
      currentPos.y = THREE.MathUtils.lerp(startY, homeY, ease);
      currentPos.z = 0;

      // Smoothly reduce scale from hero (0.44) down to companion (0.20)
      const currentScale = THREE.MathUtils.lerp(heroScale, companionScale, ease);
      group.scale.setScalar(currentScale);

      // Level out rotation from INTRO_FACE_Y to companion baseRotY
      bodyRot.y = THREE.MathUtils.lerp(INTRO_FACE_Y, baseRotY, ease);
      bodyRot.x = THREE.MathUtils.lerp(0.2, 0, ease);
      bodyRot.z = THREE.MathUtils.lerp(0.25, 0, ease);

      // Settle thruster intensity down to idle
      thrusterIntensityRef.current = THREE.MathUtils.lerp(0.75, 0.22, ease);

      // Restore limbs to neutral companion pose
      if (bones.thighL) restoreBone(bones.thighL, R(bones.thighL), 4, safeDt);
      if (bones.thighR) restoreBone(bones.thighR, R(bones.thighR), 4, safeDt);
      if (bones.shinL) restoreBone(bones.shinL, R(bones.shinL), 4, safeDt);
      if (bones.shinR) restoreBone(bones.shinR, R(bones.shinR), 4, safeDt);
      if (bones.upperArmL) restoreBone(bones.upperArmL, R(bones.upperArmL), 4, safeDt);
      if (bones.upperArmR) restoreBone(bones.upperArmR, R(bones.upperArmR), 4, safeDt);

      if (elapsed >= 2.0) {
        setPhase('companionIdle');
      }
      break;
    }

    // ── 12. COMPANION IDLE: Handed off to autonomous companion machine ───────
    case 'companionIdle':
    default: {
      group.scale.setScalar(companionScale);
      break;
    }
  }
}

