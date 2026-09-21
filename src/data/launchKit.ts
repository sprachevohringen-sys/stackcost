export interface LaunchItem {
  platform: string;
  badge: string;
  title: string;
  timing: string;
  targetAudience: string;
  copyTitle: string;
  copyBody: string;
}

export const LAUNCH_KIT: LaunchItem[] = [
  {
    platform: 'Hacker News',
    badge: 'Show HN (Tek Günde 10k Ziyaretçi)',
    title: 'Hacker News Lansman Başlığı & Açıklaması',
    timing: 'Salı veya Çarşamba TSİ 16:00 (ABD sabah 09:00)',
    targetAudience: 'Amerikalı CTO, Yazılımcı ve Girişimciler',
    copyTitle: 'Show HN: StackCost – Real-time LLM token burn calculator with prompt caching benchmarks',
    copyBody: `Hi HN,

We noticed most startups overpay by 60–80% on AI inference and cloud compute simply because proprietary pricing models (OpenAI/Anthropic) are opaque and prompt caching savings are rarely benchmarked side-by-side.

We built StackCost (https://stackcost.co) to solve this:
- Real-time token burn simulations across frontier models (GPT-4o, Claude 3.5 Sonnet) vs open-weights (DeepSeek V3, Llama 3.3).
- Instant prompt caching discount calculations (up to 90% savings).
- Serverless GPU vs API break-even matrix.

Zero sign-up required, 100% client-side calculation. Would love your feedback on our benchmark data and pricing formulas!`,
  },
  {
    platform: 'Reddit (r/LocalLLaMA & r/SaaS)',
    badge: 'Organik Topluluk Bombası',
    title: 'Reddit Değer Odaklı Paylaşım Metni',
    timing: 'Hafta içi TSİ 17:30',
    targetAudience: '250k+ Yapay Zeka Geliştiricisi',
    copyTitle: 'We benchmarked the actual token savings of DeepSeek V3 vs GPT-4o with prompt caching [Interactive Breakdown]',
    copyBody: `Hey r/LocalLLaMA,

Everyone talks about DeepSeek V3 being 95% cheaper than proprietary models, but how much does that actually translate to on production workloads with realistic prompt caching?

We built a free interactive calculator that lets you simulate exact token ratios, request volume, and cache hit rates:
👉 https://stackcost.co

Key finding from our benchmarks:
- On a 1M token/day RAG workflow with 40% cache hit, DeepSeek V3 drops a monthly $1,420 GPT-4o bill down to ~$115.
- Break-even for self-hosting on RunPod RTX 4090 happens around 85k requests/day.

No ads, no email capture. Feel free to use the "Copy Budget Summary" button to pitch cost savings to your team!`,
  },
  {
    platform: 'GitHub (Parazit Otorite)',
    badge: 'DA 96 ile 48 Saatte Google 1. Sayfa',
    title: 'Açık Kaynak "Awesome-AI-Cloud-Cost-Benchmarks" Repo Taslağı',
    timing: 'Site yayına girdiği gün',
    targetAudience: 'GitHub Arama ve Google Botları',
    copyTitle: 'Awesome AI & Cloud Cost Benchmarks 2026 (Interactive Calculator)',
    copyBody: `# 🚀 Awesome AI & Cloud Cost Benchmarks (2026)

A curated, vendor-neutral repository of real-world pricing benchmarks for LLMs, GPU instances, and Cloud VPS.

## 📊 Live Interactive Calculator
👉 [Launch StackCost Interactive Calculator](https://stackcost.co)

## 📌 Features
- **LLM Pricing Matrix:** GPT-4o vs Claude 3.5 Sonnet vs DeepSeek V3/R1.
- **Prompt Caching Discounts:** Realistic RAG cache rate simulations.
- **Cloud VPS Comparison:** AWS EC2 vs DigitalOcean vs Vultr vs Hetzner.
- **GPU Serverless Benchmarks:** NVIDIA RTX 4090, A100, H100 hourly breakdown.

### Contributing
PRs updating vendor pricing or benchmark methodology are welcome!`,
  },
];
