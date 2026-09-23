export interface AffiliatePartner {
  id: string;
  name: string;
  category: 'cloud' | 'ai' | 'gpu' | 'fintech';
  description: string;
  badge: string;
  dealHighlight: string;
  referralUrl: string;
  ctaText: string;
  isFeatured?: boolean;
}

export const AFFILIATE_CONFIG: Record<string, AffiliatePartner> = {
  digitalocean: {
    id: 'digitalocean',
    name: 'DigitalOcean',
    category: 'cloud',
    description: 'Simple, scalable cloud computing with transparent pricing and 99.99% uptime.',
    badge: 'Staff Pick',
    dealHighlight: '$200 Free Credit for 60 Days',
    referralUrl: 'https://m.do.co/c/4fc4e8aa3fc9', // Kullanıcının gerçek DigitalOcean referans linki
    ctaText: 'Claim $200 Cloud Credit',
    isFeatured: true,
  },
  vultr: {
    id: 'vultr',
    name: 'Vultr Cloud',
    category: 'cloud',
    description: 'Global high-performance NVMe cloud compute and bare metal servers.',
    badge: 'Fastest NVMe',
    dealHighlight: '$100 Free Server Credit',
    referralUrl: 'https://www.vultr.com/?ref=stackcost', // Kullanıcı referans linki
    ctaText: 'Claim $100 Credit',
    isFeatured: true,
  },
  runpod: {
    id: 'runpod',
    name: 'RunPod Serverless',
    category: 'gpu',
    description: 'Rent on-demand GPUs (RTX 4090, A100, H100) or deploy serverless AI endpoints at up to 80% less than AWS.',
    badge: 'Best for AI',
    dealHighlight: 'Deploy Serverless GPU from $0.20/hr',
    referralUrl: 'https://runpod.io?ref=stackcost', // Kullanıcı referans linki
    ctaText: 'Deploy GPU in 30s',
    isFeatured: true,
  },
  togetherai: {
    id: 'togetherai',
    name: 'Together AI',
    category: 'ai',
    description: 'Ultra-fast inference engine for open-weights models (DeepSeek, Llama 3, Qwen) with OpenAI-compatible API.',
    badge: 'Cheapest LLM Engine',
    dealHighlight: '$25 Free Developer Inference Credit',
    referralUrl: 'https://together.ai/?via=stackcost', // Kullanıcı referans linki
    ctaText: 'Get $25 Free Tokens',
    isFeatured: true,
  },
  hetzner: {
    id: 'hetzner',
    name: 'Hetzner Cloud',
    category: 'cloud',
    description: 'Unbeatable European price-to-performance ratio for dedicated cores and cloud nodes.',
    badge: 'Cheapest Bare-Metal',
    dealHighlight: '€20 Cloud Credits',
    referralUrl: 'https://hetzner.cloud/?ref=stackcost',
    ctaText: 'Claim €20 Credit',
    isFeatured: false,
  },
  wise: {
    id: 'wise',
    name: 'Wise Business',
    category: 'fintech',
    description: 'Receive multi-currency revenue and pay global cloud providers without bank markup fees.',
    badge: 'Save on FX',
    dealHighlight: 'Free International Transfer up to $600',
    referralUrl: 'https://wise.com/invite/stackcost',
    ctaText: 'Get Free Transfer',
    isFeatured: false,
  }
};
