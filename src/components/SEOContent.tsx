'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Layers, Lightbulb } from 'lucide-react';

const FAQS = [
  {
    q: 'How does prompt caching reduce AI inference bills?',
    a: 'Both Anthropic and OpenAI support prompt caching. When your application repeatedly sends long system prompts, documentation, or code context, providers cache the prefix in GPU memory. Cached tokens cost up to 90% less (e.g. $0.30 per 1M on Claude 3.5 Sonnet instead of $3.00), resulting in dramatic monthly savings for RAG and agentic workflows.'
  },
  {
    q: 'Is DeepSeek V3 / R1 genuinely comparable to GPT-4o and Claude 3.5?',
    a: 'According to independent LMSYS Chatbot Arena and HumanEval benchmarks, DeepSeek V3 and DeepSeek R1 achieve parity with GPT-4o in reasoning, math, and code generation, while costing up to 90% less per 1M tokens when served via Together AI, DeepInfra, or RunPod.'
  },
  {
    q: 'Why is AWS EC2 significantly more expensive than DigitalOcean or Vultr?',
    a: 'AWS prices in extensive enterprise compliance, proprietary networking topologies, and heavy outbound data transfer (egress) fees ($0.09/GB). For 95% of standard web applications, APIs, and databases, modern cloud VPS providers like DigitalOcean and Vultr offer equivalent NVMe performance with generous free bandwidth at less than half the cost.'
  },
  {
    q: 'When does renting dedicated GPU compute beat serverless API endpoints?',
    a: 'If your application processes steady, sustained batch inference or generates more than 50,000 requests per day, running open-weights models (such as Llama 3.3 70B or DeepSeek) on dedicated RunPod GPUs (e.g., RTX 4090 or A40) breaks even within days compared to paying on-demand per-token API prices.'
  }
];

export const SEOContent: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>2026 Architecture Guide</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How Top Engineering Teams Cut Infrastructure Burn by 65%
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Smart Model Cascading</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Route 80% of routine requests to lightweight models like GPT-4o-mini or DeepSeek V3, reserving heavy frontier models only for complex reasoning tasks.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Aggressive Prompt Caching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Structure prompt templates so static system instructions and few-shot examples sit at the head of the payload, triggering automatic vendor cache discounts.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Hybrid Cloud Topology</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Keep stateful databases and web workers on affordable VPS nodes (DigitalOcean/Vultr) while bursting heavy AI inference to serverless GPU pools.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
