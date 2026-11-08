'use client';

import React from 'react';
import { Bot, Loader2 } from 'lucide-react';

export default function RobotLoading({ message = 'Initializing 3D Robot...' }: { message?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Glowing cyber hexagon container */}
      <div className="relative flex items-center justify-center size-24 mb-4">
        {/* Pulsing glow background */}
        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-pulse" />

        {/* Outer rotating cyber border */}
        <div className="absolute inset-0 rounded-2xl border border-primary/30 animate-[spin_6s_linear_infinite]" />

        {/* Inner rotating accent border */}
        <div className="absolute inset-2 rounded-xl border border-dashed border-primary/50 animate-[spin_4s_linear_infinite_reverse]" />

        {/* Center robot icon */}
        <div className="relative z-10 flex items-center justify-center size-12 rounded-xl bg-surface/80 border border-border shadow-inner">
          <Bot className="size-6 text-primary animate-pulse" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono font-medium text-primary">
        <Loader2 className="size-3.5 animate-spin" />
        <span className="tracking-widest uppercase">{message}</span>
      </div>

      <p className="mt-2 text-[11px] text-muted font-mono">
        Skeletal rig &amp; materials loading
      </p>
    </div>
  );
}

