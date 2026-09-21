'use client';

import React, { useState } from 'react';
import { CLOUD_TIERS, CloudTier } from '@/data/cloudProviders';
import { AFFILIATE_CONFIG } from '@/config/affiliates';
import { Server, Check, ArrowRight, ExternalLink, ShieldAlert, Zap, TrendingDown } from 'lucide-react';
import { trackEvent } from '@/lib/telemetry';

export const CloudCalculator: React.FC = () => {
  const [selectedTierId, setSelectedTierId] = useState<string>('growth');
  const [instanceCount, setInstanceCount] = useState<number>(3);
  const [extraStorageGB, setExtraStorageGB] = useState<number>(50);

  const currentTier = CLOUD_TIERS.find((t) => t.id === selectedTierId) || CLOUD_TIERS[2];

  // Storage pricing: ~$0.10/GB on AWS vs ~$0.08 on DO / Vultr
  const awsTotal = (currentTier.awsPrice + extraStorageGB * 0.10) * instanceCount;
  const doTotal = (currentTier.digitalOceanPrice + extraStorageGB * 0.08) * instanceCount;
  const vultrTotal = (currentTier.vultrPrice + extraStorageGB * 0.075) * instanceCount;
  const hetznerTotal = (currentTier.hetznerPrice + extraStorageGB * 0.045) * instanceCount;

  const monthlyAwsSavingsDo = awsTotal - doTotal;
  const annualAwsSavingsDo = monthlyAwsSavingsDo * 12;

  return (
    <div className="space-y-8">
      {/* Title & Subtitle */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Server className="w-3.5 h-3.5" />
          <span>Cloud VPS & Compute Comparison</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          AWS Tax vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Modern Cloud VPS</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Most startups pay 50%–70% excess markup on AWS for standard web applications and database nodes. Compare real pricing side-by-side.
        </p>
      </div>

      {/* Control Bar: Select Specification & Instance Count */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-5xl mx-auto space-y-6">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            Select Server Configuration Tier
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CLOUD_TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTierId(tier.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedTierId === tier.id
                    ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="font-bold text-sm text-white">{tier.name.split('/')[0]}</div>
                <div className="text-xs text-emerald-400 font-mono mt-1 font-semibold">
                  {tier.vCPU} vCPU • {tier.ramGB}GB RAM
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {tier.storageGB}GB NVMe SSD
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Cluster Nodes / Instances:</span>
              <span className="text-emerald-400 font-mono font-bold">{instanceCount} servers</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={instanceCount}
              onChange={(e) => setInstanceCount(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Extra Block Storage (SSD):</span>
              <span className="text-emerald-400 font-mono font-bold">+{extraStorageGB} GB</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="25"
              value={extraStorageGB}
              onChange={(e) => setExtraStorageGB(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Side by Side Cloud Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {/* AWS (Baseline / Overpriced) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Baseline</span>
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Overpriced
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-2">AWS EC2</h3>
            <p className="text-xs text-slate-400 mt-1">t4g/c6i instances + standard EBS volume pricing.</p>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="text-3xl font-black text-white font-mono">
                ${awsTotal.toFixed(0)}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
              <span className="text-xs text-slate-500 block mt-1">
                ${(awsTotal * 12).toFixed(0)} / year for {instanceCount} nodes
              </span>
            </div>

            <ul className="mt-6 space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Expensive outbound egress fees</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Complex IAM & VPC setup required</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <span className="text-xs text-slate-500 block text-center">Reference Standard</span>
          </div>
        </div>

        {/* DigitalOcean (Featured Partner) */}
        <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative shadow-xl shadow-emerald-500/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
            Most Popular Deal
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Recommended</span>
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Save 55%
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-2">DigitalOcean</h3>
            <p className="text-xs text-slate-400 mt-1">Dedicated & shared droplets with 99.99% SLA.</p>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="text-3xl font-black text-emerald-400 font-mono">
                ${doTotal.toFixed(0)}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
              <span className="text-xs text-emerald-400 font-semibold block mt-1">
                Save ${(annualAwsSavingsDo).toFixed(0)}/year vs AWS
              </span>
            </div>

            <ul className="mt-6 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Free generous outbound bandwidth</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>1-Click Docker & Kubernetes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>$200 Free 60-day credit</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <a
              href={AFFILIATE_CONFIG.digitalocean.referralUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent('affiliate_click', {
                  partnerId: 'digitalocean',
                  partnerName: 'DigitalOcean',
                  dealText: AFFILIATE_CONFIG.digitalocean.dealHighlight,
                  location: 'cloud_droplet_card',
                  tier: currentTier.name,
                  instances: instanceCount,
                  annualSavings: annualAwsSavingsDo,
                });
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <span>{AFFILIATE_CONFIG.digitalocean.ctaText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Vultr Cloud */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fast NVMe</span>
              <span className="text-[11px] font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                Save 60%
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-2">Vultr Compute</h3>
            <p className="text-xs text-slate-400 mt-1">Global 32+ data centers with high-frequency CPU cores.</p>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="text-3xl font-black text-white font-mono">
                ${vultrTotal.toFixed(0)}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
              <span className="text-xs text-teal-400 font-semibold block mt-1">
                Save ${((awsTotal - vultrTotal) * 12).toFixed(0)}/year vs AWS
              </span>
            </div>

            <ul className="mt-6 space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                <span>3.0GHz+ Intel & AMD cores</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                <span>Instant API provisioning</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                <span>$100 Free Server Credit</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <a
              href={AFFILIATE_CONFIG.vultr.referralUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent('affiliate_click', {
                  partnerId: 'vultr',
                  partnerName: 'Vultr',
                  dealText: AFFILIATE_CONFIG.vultr.dealHighlight,
                  location: 'cloud_vultr_card',
                  tier: currentTier.name,
                  instances: instanceCount,
                  annualSavings: (awsTotal - vultrTotal) * 12,
                });
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
            >
              <span>{AFFILIATE_CONFIG.vultr.ctaText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Hetzner (Ultra Budget) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Budget King</span>
              <span className="text-[11px] font-bold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                Save 75%
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-2">Hetzner Cloud</h3>
            <p className="text-xs text-slate-400 mt-1">European server giant with lowest raw cost per core.</p>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="text-3xl font-black text-white font-mono">
                ${hetznerTotal.toFixed(0)}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
              <span className="text-xs text-sky-400 font-semibold block mt-1">
                Save ${((awsTotal - hetznerTotal) * 12).toFixed(0)}/year vs AWS
              </span>
            </div>

            <ul className="mt-6 space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sky-400" />
                <span>Lowest European latency</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sky-400" />
                <span>20TB included traffic</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <a
              href={AFFILIATE_CONFIG.hetzner.referralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
            >
              <span>{AFFILIATE_CONFIG.hetzner.ctaText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
