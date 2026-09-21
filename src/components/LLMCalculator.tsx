'use client';

import React, { useState, useMemo } from 'react';
import { LLM_MODELS, LLMModel } from '@/data/models';
import { AFFILIATE_CONFIG } from '@/config/affiliates';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingDown, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { trackEvent } from '@/lib/telemetry';

export const LLMCalculator: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('gpt-4o');
  const [monthlyRequests, setMonthlyRequests] = useState<number>(100000);
  const [avgInputTokens, setAvgInputTokens] = useState<number>(1200);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(350);
  const [enableCaching, setEnableCaching] = useState<boolean>(true);
  const [cacheHitRate, setCacheHitRate] = useState<number>(40); // 40% cached
  const [copied, setCopied] = useState<boolean>(false);

  const selectedModel = useMemo(
    () => LLM_MODELS.find((m) => m.id === selectedModelId) || LLM_MODELS[0],
    [selectedModelId]
  );

  // Cost calculation function
  const calculateModelCost = (model: LLMModel) => {
    const totalInputTokens = monthlyRequests * avgInputTokens;
    const totalOutputTokens = monthlyRequests * avgOutputTokens;

    let effectiveInputCost = 0;
    if (enableCaching && model.cachedInputCostPer1M) {
      const cachedTokens = totalInputTokens * (cacheHitRate / 100);
      const regularTokens = totalInputTokens * (1 - cacheHitRate / 100);
      effectiveInputCost =
        (regularTokens / 1_000_000) * model.inputCostPer1M +
        (cachedTokens / 1_000_000) * model.cachedInputCostPer1M;
    } else {
      effectiveInputCost = (totalInputTokens / 1_000_000) * model.inputCostPer1M;
    }

    const outputCost = (totalOutputTokens / 1_000_000) * model.outputCostPer1M;
    return effectiveInputCost + outputCost;
  };

  const baselineCost = useMemo(() => calculateModelCost(selectedModel), [
    selectedModel,
    monthlyRequests,
    avgInputTokens,
    avgOutputTokens,
    enableCaching,
    cacheHitRate,
  ]);

  // Compare against top alternatives
  const comparisons = useMemo(() => {
    return LLM_MODELS.filter((m) => m.id !== selectedModel.id)
      .map((model) => {
        const cost = calculateModelCost(model);
        const monthlySavings = baselineCost - cost;
        const annualSavings = monthlySavings * 12;
        const percentSavings = baselineCost > 0 ? ((baselineCost - cost) / baselineCost) * 100 : 0;
        return {
          model,
          cost,
          monthlySavings,
          annualSavings,
          percentSavings,
        };
      })
      .sort((a, b) => b.monthlySavings - a.monthlySavings);
  }, [baselineCost, selectedModel, monthlyRequests, avgInputTokens, avgOutputTokens, enableCaching, cacheHitRate]);

  const bestAlternative = comparisons.find((c) => c.percentSavings > 0) || comparisons[0];

  const handleCopySummary = () => {
    trackEvent('budget_summary_copied', {
      model: selectedModel.name,
      monthlyBurn: baselineCost,
      annualSavings: bestAlternative.annualSavings,
    });
    const summary = `📊 StackCost AI Budget Summary:
Current Stack: ${selectedModel.name} ($${baselineCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo)
Recommended: ${bestAlternative.model.name} ($${bestAlternative.cost.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo)
Potential Savings: $${bestAlternative.annualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/year (${bestAlternative.percentSavings.toFixed(0)}% reduction)
Calculated via: https://stackcost.co`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive AI Inference Optimizer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Stop Overpaying for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">LLM API Tokens</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Calculate your real production token burn rate across proprietary models (OpenAI, Anthropic) vs open-weights engines (DeepSeek, Llama 3).
        </p>
      </div>

      {/* Main Grid: Inputs on Left, Real-Time Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
          <h2 className="text-lg font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
            <span>Production Parameters</span>
            <span className="text-xs font-normal text-slate-400">Real-time update</span>
          </h2>

          {/* Model Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Current Primary Model
            </label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {LLM_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} — (${model.inputCostPer1M} in / ${model.outputCostPer1M} out)
                </option>
              ))}
            </select>
          </div>

          {/* Monthly Requests Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Monthly Requests:</span>
              <span className="text-emerald-400 font-mono font-bold">
                {monthlyRequests.toLocaleString('en-US')}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="2000000"
              step="10000"
              value={monthlyRequests}
              onChange={(e) => setMonthlyRequests(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>10k</span>
              <span>500k</span>
              <span>1M</span>
              <span>2M req/mo</span>
            </div>
          </div>

          {/* Avg Input Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Avg Input Tokens (Prompt):</span>
              <span className="text-emerald-400 font-mono font-bold">{avgInputTokens} tokens</span>
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={avgInputTokens}
              onChange={(e) => setAvgInputTokens(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>100</span>
              <span>2,500</span>
              <span>5,000</span>
              <span>10,000</span>
            </div>
          </div>

          {/* Avg Output Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Avg Output Tokens (Completion):</span>
              <span className="text-emerald-400 font-mono font-bold">{avgOutputTokens} tokens</span>
            </div>
            <input
              type="range"
              min="50"
              max="4000"
              step="50"
              value={avgOutputTokens}
              onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>50</span>
              <span>1,000</span>
              <span>2,000</span>
              <span>4,000</span>
            </div>
          </div>

          {/* Prompt Caching Toggle */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="caching"
                  checked={enableCaching}
                  onChange={(e) => setEnableCaching(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-700"
                />
                <label htmlFor="caching" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Enable Prompt Caching
                </label>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded">
                Anthropic & OpenAI
              </span>
            </div>

            {enableCaching && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Cache Hit Rate:</span>
                  <span className="font-mono text-emerald-400 font-bold">{cacheHitRate}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={cacheHitRate}
                  onChange={(e) => setCacheHitRate(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Calculations & Comparison Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Summary Hero Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Current Estimated Burn
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                  ${baselineCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-sm font-normal text-slate-400"> / month</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Based on {selectedModel.name} ({((monthlyRequests * (avgInputTokens + avgOutputTokens)) / 1_000_000).toFixed(1)}M total tokens/mo)
                </p>
              </div>

              {bestAlternative && bestAlternative.annualSavings > 0 && (
                <div className="sm:text-right bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4">
                  <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
                    Potential Annual Savings
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-0.5">
                    ${bestAlternative.annualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    <span className="text-xs font-normal text-emerald-300"> / yr</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 mt-1 font-medium">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Save up to {bestAlternative.percentSavings.toFixed(0)}% with {bestAlternative.model.name}
                  </span>
                </div>
              )}
            </div>

            {/* Top Recommended Action CTA Banner */}
            {bestAlternative && (
              <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Recommended: Switch to {bestAlternative.model.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Drops your monthly bill to{' '}
                      <span className="text-emerald-400 font-mono font-semibold">
                        ${bestAlternative.cost.toLocaleString('en-US', { maximumFractionDigits: 2 })}/mo
                      </span>{' '}
                      with comparable benchmark reasoning.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={AFFILIATE_CONFIG.togetherai.referralUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackEvent('affiliate_clicked', {
                        partnerId: 'togetherai',
                        partnerName: 'Together AI',
                        location: 'llm_hero_banner',
                        model: bestAlternative.model.name,
                      });
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                  >
                    <span>{AFFILIATE_CONFIG.togetherai.ctaText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Quick Share / Copy Bar */}
            <div className="mt-4 pt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Updated with Q1 2026 official vendor pricing
              </span>
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Budget Summary</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Side-by-Side Model Comparison Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
              <span>Alternative Model Economics</span>
              <span className="text-xs font-normal text-slate-400">Ranked by monthly cost</span>
            </h3>

            <div className="space-y-3">
              {comparisons.slice(0, 4).map(({ model, cost, monthlySavings, percentSavings }) => {
                const isCheaper = percentSavings > 0;
                return (
                  <div
                    key={model.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <CheckCircle2 className={`w-4 h-4 ${isCheaper ? 'text-emerald-400' : 'text-slate-500'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{model.name}</span>
                          {model.badge && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          ${model.inputCostPer1M} in / ${model.outputCostPer1M} out per 1M tokens
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800">
                      <div className="text-left sm:text-right">
                        <span className="text-sm font-mono font-bold text-white block">
                          ${cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            isCheaper ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isCheaper
                            ? `Save $${monthlySavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo (-${percentSavings.toFixed(0)}%)`
                            : `+$${Math.abs(monthlySavings).toFixed(0)}/mo more`}
                        </span>
                      </div>

                      {model.affiliatePartnerId && (
                        <a
                          href={AFFILIATE_CONFIG[model.affiliatePartnerId]?.referralUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all inline-flex items-center gap-1 shrink-0"
                        >
                          <span>Deploy</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
