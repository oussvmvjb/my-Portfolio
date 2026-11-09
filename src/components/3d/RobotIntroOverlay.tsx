'use client';

import React, { useEffect, useState } from 'react';
import { useRobotIntro, IntroPhase } from './RobotIntroContext';
import { Sparkles, Zap, Shield, Radio, ChevronRight } from 'lucide-react';

export default function RobotIntroOverlay() {
  const { phase, progress, statusText, skipIntro, isIntroActive } = useRobotIntro();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  // Handle fade out when intro enters reveal phase
  useEffect(() => {
    if (phase === 'reveal' || phase === 'returnFromLeft' || phase === 'companionIdle') {
      setFading(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setFading(false);
      setVisible(true);
    }
  }, [phase]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-1000 select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      aria-label="Loading portfolio experience"
    >
      {/* ── Dark Futuristic Cyber Backdrop ──────────────────────────────────── */}
      <div className="absolute inset-0 bg-[#07090D] overflow-hidden">
        {/* Subtle cyber grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(to right, #FFBE00 1px, transparent 1px),
                              linear-gradient(to bottom, #FFBE00 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Ambient Energon / Bumblebee Yellow & Cyan lighting glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#FFBE00]/15 via-[#00CFFF]/5 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#FFBE00]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Hexagonal mechanical vignette */}
        <div className="absolute inset-0 bg-radial-vignette opacity-80" />

        {/* Diagonal warning hazard stripes (Top and Bottom borders) */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFBE00] to-transparent opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFBE00] to-transparent opacity-60" />
      </div>

      {/* ── Transformers HUD Overlay ────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-10 pointer-events-none">
        {/* Top Header: System Status & Skip */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-3 rounded-full bg-[#FFBE00] shadow-[0_0_12px_#FFBE00] animate-ping" />
            <div className="flex flex-col">
              <span className="font-mono text-xs tracking-[0.25em] text-[#FFBE00] uppercase font-bold flex items-center gap-1.5">
                <Shield className="size-3" />
                NEXUS-01 // AUTOBOT PROTOCOL
              </span>
              <span className="font-mono text-[10px] text-zinc-400 tracking-wider">
                SYS.REV 2.0 // GLB ENGINE INITIALIZED
              </span>
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={skipIntro}
            type="button"
            className="pointer-events-auto group px-3.5 py-1.5 rounded-full border border-[#FFBE00]/40 bg-[#0B0E14]/80 backdrop-blur-md hover:bg-[#FFBE00]/20 hover:border-[#FFBE00] transition-all flex items-center gap-2 cursor-pointer"
            aria-label="Skip introduction"
          >
            <span className="font-mono text-[11px] text-zinc-300 group-hover:text-[#FFBE00] tracking-widest font-semibold uppercase">
              Skip Intro
            </span>
            <span className="font-mono text-[10px] text-zinc-400 group-hover:text-zinc-200 bg-white/10 px-1 rounded">
              ESC
            </span>
            <ChevronRight className="size-3 text-[#FFBE00] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Center: Open area where 3D Robot performs in Canvas */}
        <div className="flex-1 flex items-center justify-center">
          {/* Subtle targeting reticle lines around center */}
          <div className="relative w-72 h-72 rounded-full border border-[#FFBE00]/10 flex items-center justify-center pointer-events-none">
            <div
              className="absolute inset-4 rounded-full border border-dashed border-[#00CFFF]/20"
              style={{ animation: 'spin 18s linear infinite' }}
            />
            <div className="absolute top-0 w-4 h-0.5 bg-[#FFBE00]/40" />
            <div className="absolute bottom-0 w-4 h-0.5 bg-[#FFBE00]/40" />
            <div className="absolute left-0 h-4 w-0.5 bg-[#FFBE00]/40" />
            <div className="absolute right-0 h-4 w-0.5 bg-[#FFBE00]/40" />
          </div>
        </div>

        {/* Bottom HUD: Progress Bar & Status Text */}
        <div className="flex flex-col items-center gap-3.5 max-w-lg mx-auto w-full">
          {/* Status Message */}
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#0A0D12]/90 border border-[#FFBE00]/30 shadow-[0_0_15px_rgba(255,190,0,0.1)]">
            <Zap className="size-3.5 text-[#FFBE00] animate-bounce" />
            <span className="font-mono text-[11px] sm:text-xs text-[#FFBE00] font-semibold tracking-wider text-center">
              {statusText}
            </span>
          </div>

          {/* Futuristic Segmented Progress Bar */}
          <div className="w-full flex items-center gap-3">
            <span className="font-mono text-[11px] text-zinc-400 tracking-wider">
              0%
            </span>

            <div className="flex-1 h-2 rounded-full bg-zinc-900 border border-zinc-800 p-0.5 relative overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FFBE00] via-[#FFAA00] to-[#00CFFF] transition-all duration-150 ease-out relative shadow-[0_0_12px_#FFBE00]"
                style={{ width: `${progress}%` }}
              >
                {/* Glowing spark lead tip */}
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
              </div>
            </div>

            <span className="font-mono text-xs font-bold text-[#FFBE00] tracking-wider min-w-[36px] text-right">
              {progress}%
            </span>
          </div>

          {/* Subtitle / Key info */}
          <div className="flex items-center justify-between w-full font-mono text-[10px] text-zinc-400 px-1">
            <span className="flex items-center gap-1">
              <Radio className="size-2.5 text-[#00CFFF] animate-pulse" />
              MATRIX POWER: 100%
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="size-2.5 text-[#FFBE00]" />
              PRESS ESC TO BYPASS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
