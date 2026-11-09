'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

export type IntroPhase =
  | 'loading'        // Assets loading, cyber backdrop, progress bar
  | 'arrival'        // Robot flies down from high into screen center
  | 'wakeUp'         // Optics power on (cyan pulse), diagnostics lock
  | 'wave'           // Friendly robotic greeting wave + head tilt
  | 'rotate360'      // 360-degree body turntable showcasing Bumblebee armor
  | 'takeoff'        // Thrusters surge, lifting into hover
  | 'backflip'       // Controlled 360-degree backflip with leg tuck
  | 'flying'         // Dynamic flight hover, checks app readiness
  | 'exitRight'      // Full throttle burst off right edge of viewport
  | 'reveal'         // Backdrop dissolves, portfolio revealed
  | 'returnFromLeft' // Robot re-enters from left, glides to top-right home
  | 'companionIdle'; // Transition complete, autonomous companion active

interface RobotIntroContextType {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
  progress: number;
  statusText: string;
  isAppReady: boolean;
  skipIntro: () => void;
  isIntroActive: boolean; // true until reveal completes
}

const RobotIntroContext = createContext<RobotIntroContextType | null>(null);

export function useRobotIntro() {
  const context = useContext(RobotIntroContext);
  if (!context) {
    throw new Error('useRobotIntro must be used within a RobotIntroProvider');
  }
  return context;
}

const STATUS_MESSAGES: Record<string, string> = {
  loading: 'INITIALIZING AUTOBOT PROTOCOL // NEXUS-01',
  arrival: 'INCOMING CARRIER SIGNAL DETECTED',
  wakeUp: 'CALIBRATING OPTICAL SENSORS... ONLINE',
  wave: 'GREETINGS, VISITOR // ESTABLISHING HANDSHAKE',
  rotate360: 'ARMOR INTEGRITY 100% // SCALING DEFENSE PLATES',
  takeoff: 'ENGAGING ENERGON THRUSTERS // FULL THROTTLE',
  backflip: 'AEROBATIC STABILIZATION // GYRO MATRIX ACTIVE',
  flying: 'ALL SYSTEMS SYNCHRONIZED // STANDBY FOR REVEAL',
  exitRight: 'DISENGAGING LAUNCH MATRIX // DEPLOYING PORTFOLIO',
  reveal: 'SYSTEMS ONLINE // WELCOME TO MY PORTFOLIO',
  returnFromLeft: 'COMPANION MODE ENGAGED // REPOSITIONING',
  companionIdle: 'AUTONOMOUS RECONNAISSANCE MODE ACTIVE',
};

export function RobotIntroProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>('loading');
  const [progress, setProgress] = useState(0);
  const [isAppReady, setIsAppReady] = useState(false);
  const [statusText, setStatusText] = useState(STATUS_MESSAGES.loading);

  const mountedTimeRef = useRef(0);
  const appReadyRef = useRef(false);

  // Skip intro helper
  const skipIntro = useCallback(() => {
    setPhase('companionIdle');
    setProgress(100);
    setStatusText(STATUS_MESSAGES.companionIdle);
  }, []);

  // Update status message when phase changes
  useEffect(() => {
    if (STATUS_MESSAGES[phase]) {
      setStatusText(STATUS_MESSAGES[phase]);
    }
  }, [phase]);

  // Real Application Readiness Monitor
  useEffect(() => {
    mountedTimeRef.current = performance.now();

    // Check prefers-reduced-motion: if enabled, skip long cinematic
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (media.matches) {
        skipIntro();
        return;
      }
    }

    let isCancelled = false;

    // Track multiple readiness criteria
    const checkReadiness = async () => {
      try {
        // 1. Wait for document fonts
        if (typeof document !== 'undefined' && document.fonts) {
          await document.fonts.ready;
        }

        // 2. Wait for document complete or window load
        if (typeof document !== 'undefined' && document.readyState !== 'complete') {
          await new Promise<void>((resolve) => {
            const onComplete = () => {
              window.removeEventListener('load', onComplete);
              resolve();
            };
            window.addEventListener('load', onComplete, { once: true });
            // Fallback timeout in case load event already fired
            setTimeout(resolve, 1500);
          });
        }

        // 3. Extra frame for initial hydration / paint
        await new Promise((r) => requestAnimationFrame(r));

        if (!isCancelled) {
          appReadyRef.current = true;
          setIsAppReady(true);
        }
      } catch {
        if (!isCancelled) {
          appReadyRef.current = true;
          setIsAppReady(true);
        }
      }
    };

    checkReadiness();

    // Safety timeout: Never let visitor get stuck for more than 7.5 seconds
    const safetyTimer = setTimeout(() => {
      appReadyRef.current = true;
      setIsAppReady(true);
    }, 7500);

    return () => {
      isCancelled = true;
      clearTimeout(safetyTimer);
    };
  }, [skipIntro]);

  // Loading progress bar simulation smoothly tracking real readiness
  useEffect(() => {
    if (phase !== 'loading' && phase !== 'arrival') {
      setProgress(100);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      // If app is ready, fast-forward to 100%
      if (appReadyRef.current) {
        current += Math.random() * 15 + 10;
      } else {
        // Gradually climb to 88% while waiting
        const targetMax = 88;
        if (current < targetMax) {
          current += Math.random() * 4 + 2;
        }
      }

      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setProgress(Math.min(100, Math.floor(current)));
    }, 60);

    return () => clearInterval(interval);
  }, [phase]);

  // Keyboard shortcut: Escape to skip intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase !== 'companionIdle') {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, skipIntro]);

  const isIntroActive = phase !== 'companionIdle';

  return (
    <RobotIntroContext.Provider
      value={{
        phase,
        setPhase,
        progress,
        statusText,
        isAppReady,
        skipIntro,
        isIntroActive,
      }}
    >
      {children}
    </RobotIntroContext.Provider>
  );
}

