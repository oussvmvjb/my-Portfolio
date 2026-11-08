'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { Bot, Sparkles, Hand, Footprints, RotateCcw, Activity, Brain, Smile } from 'lucide-react';
import type { RobotAnimationType } from './RobotModel';
import RobotLoading from './RobotLoading';

// Dynamically import Canvas with SSR disabled to prevent hydration mismatches
const RobotCanvas = dynamic(() => import('./RobotCanvas'), {
  ssr: false,
  loading: () => <RobotLoading />,
});

interface RobotViewerProps {
  className?: string;
  defaultAnimation?: RobotAnimationType;
  showControls?: boolean;
}

export default function RobotViewer({
  className = '',
  defaultAnimation = 'idle',
  showControls = true,
}: RobotViewerProps) {
  const { primary } = useTheme();
  const [currentAnim, setCurrentAnim] = useState<RobotAnimationType>(defaultAnimation);
  const [mouseTracking, setMouseTracking] = useState(true);
  const [clickCount, setClickCount] = useState(0);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (media.matches) {
        setMouseTracking(false);
      }
    }
  }, []);

  const handleAnimationSelect = (anim: RobotAnimationType) => {
    setCurrentAnim(anim);
  };

  const handleRobotClick = () => {
    setClickCount((c) => c + 1);
    // Cycle through interactive animations when clicking the robot
    const cycleAnims: RobotAnimationType[] = ['dance', 'wave', 'happy'];
    setCurrentAnim(cycleAnims[clickCount % cycleAnims.length]);
  };

  const handleAnimationEnd = () => {
    setCurrentAnim('idle');
  };

  const animationButtons: { id: RobotAnimationType; label: string; icon: React.ReactNode }[] = [
    { id: 'idle', label: 'Idle', icon: <Bot className="size-3.5" /> },
    { id: 'wave', label: 'Wave', icon: <Hand className="size-3.5" /> },
    { id: 'dance', label: 'Dance', icon: <Sparkles className="size-3.5" /> },
    { id: 'walk', label: 'Walk', icon: <Footprints className="size-3.5" /> },
    { id: 'thinking', label: 'Think', icon: <Brain className="size-3.5" /> },
    { id: 'happy', label: 'Happy', icon: <Smile className="size-3.5" /> },
  ];

  return (
    <div
      className={`relative rounded-3xl border border-border/80 bg-surface/60 backdrop-blur-md p-3 sm:p-5 shadow-2xl overflow-hidden flex flex-col justify-between ${className}`}
      style={{
        boxShadow: `0 20px 50px -15px ${primary}18`,
      }}
    >
      {/* Background cyber grid & ambient aura */}
      <div
        className="pointer-events-none absolute -inset-2 rounded-3xl opacity-20 blur-2xl"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${primary}, transparent 70%)`,
        }}
      />

      {/* Top HUD Status Bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 px-2 py-1 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Bot className="size-4" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-fg font-display uppercase tracking-wider">
                Nexus-01
              </span>
              <span className="inline-flex size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] font-mono text-muted">Blender glTF 2.0 Rig</p>
          </div>
        </div>

        {/* Live state badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border text-[11px] font-mono">
          <Activity className="size-3 text-primary animate-pulse" />
          <span className="text-muted capitalize">
            {currentAnim === 'idle' ? 'Mode: Idle' : `Action: ${currentAnim}`}
          </span>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="relative w-full h-[340px] sm:h-[400px] md:h-[450px]">
        <RobotCanvas
          currentAnimation={currentAnim}
          onAnimationEnd={handleAnimationEnd}
          primaryColor={primary}
          enableMouseTracking={mouseTracking}
          onRobotClick={handleRobotClick}
          scale={0.52}
        />

        {/* Interactive Click Tip Overlay */}
        <div className="pointer-events-none absolute bottom-3 start-3 end-3 flex items-center justify-between text-[11px] font-mono text-muted/80 bg-surface/70 backdrop-blur-sm border border-border/60 rounded-xl px-3 py-1.5">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary" />
            Hover to aim head • Click robot to dance
          </span>
          {currentAnim !== 'idle' && (
            <button
              onClick={handleAnimationEnd}
              className="pointer-events-auto flex items-center gap-1 text-primary hover:underline"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Animation Control Switcher */}
      {showControls && (
        <div className="relative z-10 pt-3 border-t border-border/60">
          <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
            {animationButtons.map((btn) => {
              const isActive = currentAnim === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => handleAnimationSelect(btn.id)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 sm:px-3 rounded-xl text-xs font-semibold font-display transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-primary-fg shadow-md shadow-primary/25 scale-[1.03]'
                      : 'bg-surface text-muted hover:text-fg border border-border hover:border-primary/40'
                  }`}
                >
                  {btn.icon}
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

