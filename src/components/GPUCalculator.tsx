'use client';

import React, { useState } from 'react';
import { GPU_BENCHMARKS, GPUServer } from '@/data/cloudProviders';
import { AFFILIATE_CONFIG } from '@/config/affiliates';
import { trackEvent } from '@/lib/telemetry';
import { Cpu, ExternalLink, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

export const GPUCalculator: React.FC = () => {
  const [selectedGpuIndex, setSelectedGpuIndex] = useState<number>(0);
  const [hoursPerDay, setHoursPerDay] = useState<number>(12);
  const [gpuCount, setGpuCount] = useState<number>(2);

  const selectedGpu = GPU_BENCHMARKS[selectedGpuIndex];
  const monthlyHours = hoursPerDay * 30 * gpuCount;

  const awsMonthly = monthlyHours * selectedGpu.awsHourly;
  const runpodMonthly = monthlyHours * selectedGpu.runpodHourly;
  const monthlySavings = awsMonthly - runpodMonthly;
  const annualSavings = monthlySavings * 12;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>Serverless & Dedicated GPU Benchmark</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Enterprise GPU Compute at <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">70% Less Than AWS</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Compare on-demand AI training and serverless inference costs: NVIDIA RTX 4090, A100 & H100 benchmarks.
        </p>
      </div>

      {/* Calculator Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-5xl mx-auto space-y-8">
        {/* GPU Selector Tabs */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            Choose Target NVIDIA GPU Architecture
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {GPU_BENCHMARKS.map((gpu, index) => (
              <button
                key={gpu.name}
                onClick={() => setSelectedGpuIndex(index)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedGpuIndex === index
                    ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="font-bold text-sm text-white">{gpu.name.split('(')[0]}</div>
                <div className="text-xs text-emerald-400 font-mono font-semibold mt-1">
                  {gpu.vramGB}GB VRAM
                </div>
                <div className="text-[11px] text-slate-500 mt-1 truncate">{gpu.bestFor.split('&')[0]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders: Daily usage and count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Daily Active Workload Hours:</span>
              <span className="text-emerald-400 font-mono font-bold">{hoursPerDay} hrs / day</span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Batch (1 hr)</span>
              <span>Half Day (12 hrs)</span>
              <span>24/7 Production</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Parallel GPU Instances:</span>
              <span className="text-emerald-400 font-mono font-bold">{gpuCount} GPUs</span>
            </div>
            <input
              type="range"
              min="1"
              max="16"
              value={gpuCount}
              onChange={(e) => setGpuCount(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>1</span>
              <span>4</span>
              <span>8</span>
              <span>16 GPUs</span>
            </div>
          </div>
        </div>

        {/* Big Results Comparison Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* AWS EC2 GPU */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
              <span>AWS G5/P4 Instance</span>
              <span className="font-mono">${selectedGpu.awsHourly.toFixed(2)}/hr per GPU</span>
            </div>
            <div className="text-3xl font-black text-slate-300 font-mono">
              ${awsMonthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              <span className="text-sm font-normal text-slate-400"> / month</span>
            </div>
            <p className="text-xs text-slate-500">
              Standard on-demand pricing with AWS egress & storage markups.
            </p>
          </div>

          {/* RunPod Alternative */}
          <div className="p-6 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/80 space-y-3 relative shadow-xl shadow-emerald-500/10">
            <div className="flex justify-between items-center text-xs font-semibold text-emerald-400">
              <span>RunPod Serverless / Cloud</span>
              <span className="font-mono font-bold">${selectedGpu.runpodHourly.toFixed(2)}/hr per GPU</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
              ${runpodMonthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              <span className="text-sm font-normal text-slate-400"> / month</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-300">
                You save ${annualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/year ({selectedGpu.savingsPercent}% off) • Deploy with $200 free credit
              </span>
              <a
                href={AFFILIATE_CONFIG.digitalocean.referralUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent('affiliate_click', {
                    partnerId: 'digitalocean',
                    partnerName: 'DigitalOcean',
                    dealText: '$200 Free Credit for 60 Days',
                    location: 'gpu_benchmark_card',
                  });
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
              >
                <span>Claim $200 Free GPU Credit</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
