'use client';

/**
 * MarketFlowArchitecture.tsx
 * Animated microservices architecture diagram for MarketFlow AI.
 * Shows 6 services connected to a central API Gateway.
 */

import React from 'react';
import { Network, Shield, Mail, Share2, Brain, BarChart3, MessageSquare, Database, Server } from 'lucide-react';
import type { ProjectArchitectureService } from '@/types/content';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'API Gateway':    <Network className="size-5" />,
  'Auth Service':   <Shield className="size-4" />,
  'Email Hub':      <Mail className="size-4" />,
  'Social Media':   <Share2 className="size-4" />,
  'AI Studio':      <Brain className="size-4" />,
  'Analytics':      <BarChart3 className="size-4" />,
  'ARIA Bot':       <MessageSquare className="size-4" />,
};

interface Props {
  services: ProjectArchitectureService[];
}

export default function MarketFlowArchitecture({ services }: Props) {
  const gateway = services.find((s) => s.name === 'API Gateway');
  const microservices = services.filter((s) => s.name !== 'API Gateway');

  return (
    <div className="rounded-2xl border border-[#FFC400]/20 bg-[#0A0C12] p-6 sm:p-8 overflow-x-auto">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-xs font-mono text-[#FFC400]/70 uppercase tracking-widest">
          MarketFlow AI — Microservices Architecture
        </span>
      </div>

      {/* Client row */}
      <div className="flex justify-center mb-6">
        <div className="px-6 py-3 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-mono font-semibold">
          🌐 Client Applications
          <div className="text-[10px] text-blue-400/60 mt-0.5">Web (Next.js) · Mobile</div>
        </div>
      </div>

      {/* Connector */}
      <Connector />

      {/* API Gateway */}
      {gateway && (
        <div className="flex justify-center mb-6">
          <div
            className="relative px-8 py-4 rounded-xl border-2 font-mono text-center min-w-[220px]"
            style={{ borderColor: gateway.color || '#FFC400', background: `${gateway.color || '#FFC400'}15` }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span style={{ color: gateway.color || '#FFC400' }}>
                {SERVICE_ICONS['API Gateway']}
              </span>
              <span className="text-sm font-bold text-fg">{gateway.name}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              {gateway.features.map((f) => (
                <span key={f} className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-white/60 border border-white/10">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fan-out connectors */}
      <div className="flex justify-center mb-2">
        <div className="w-px h-4 bg-[#FFC400]/40" />
      </div>
      <div className="relative flex justify-center mb-2">
        <div className="w-[80%] h-px bg-[#FFC400]/30" />
        {/* Dots for 6 connections */}
        {microservices.map((_, i) => (
          <span
            key={i}
            className="absolute top-0 size-1.5 rounded-full bg-[#FFC400]/60 -translate-y-1/2"
            style={{ left: `${10 + (i * 80) / (microservices.length - 1)}%` }}
          />
        ))}
      </div>

      {/* 6 microservices */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-2">
        {microservices.map((svc) => (
          <ServiceCard key={svc.name} service={svc} />
        ))}
      </div>

      {/* Infrastructure row */}
      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="text-center text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4">
          Shared Infrastructure
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { name: 'PostgreSQL × 6', icon: <Database className="size-3" />, color: '#4169E1' },
            { name: 'Redis Cache', icon: <Server className="size-3" />, color: '#DC382D' },
            { name: 'Elasticsearch', icon: <Network className="size-3" />, color: '#FEC514' },
            { name: 'Docker', icon: <Server className="size-3" />, color: '#2496ED' },
            { name: 'Jenkins CI/CD', icon: <Network className="size-3" />, color: '#D33833' },
          ].map((inf) => (
            <span
              key={inf.name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono"
              style={{ borderColor: `${inf.color}40`, color: inf.color, background: `${inf.color}10` }}
            >
              {inf.icon}
              {inf.name}
            </span>
          ))}
        </div>
      </div>

      {/* External integrations */}
      <div className="mt-6 pt-5 border-t border-white/5">
        <div className="text-center text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4">
          External Integrations
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            'Groq LLM', 'Gemini AI', 'Facebook', 'Instagram', 'LinkedIn',
            'X (Twitter)', 'TikTok', 'YouTube', 'Cloudinary', 'SMTP Provider', 'n8n',
          ].map((ext) => (
            <span
              key={ext}
              className="px-2.5 py-1 rounded-md border border-white/10 text-[10px] font-mono text-white/40 bg-white/5"
            >
              {ext}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: ProjectArchitectureService }) {
  return (
    <div
      className="p-3 rounded-xl border text-center transition-all hover:scale-[1.03]"
      style={{ borderColor: `${service.color}40`, background: `${service.color}08` }}
    >
      <div
        className="flex items-center justify-center mb-2 mx-auto size-8 rounded-lg"
        style={{ background: `${service.color}20`, color: service.color }}
      >
        {SERVICE_ICONS[service.name] || <Network className="size-4" />}
      </div>
      <div className="text-xs font-semibold text-fg font-mono leading-tight mb-1">
        {service.name}
      </div>
      <div className="text-[9px] text-white/40 leading-snug mb-2">{service.description}</div>
      <div className="flex flex-wrap justify-center gap-1">
        {service.features.slice(0, 3).map((f) => (
          <span
            key={f}
            className="px-1.5 py-0.5 rounded text-[9px] font-mono"
            style={{ background: `${service.color}15`, color: service.color }}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center mb-2">
      <div className="w-px h-6 bg-[#FFC400]/40 relative">
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-[#FFC400]/60" />
      </div>
    </div>
  );
}

