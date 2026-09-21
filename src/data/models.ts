export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  category: 'flagship' | 'efficient' | 'open-weights' | 'reasoning';
  inputCostPer1M: number; // USD per 1M tokens
  outputCostPer1M: number; // USD per 1M tokens
  cachedInputCostPer1M?: number;
  contextWindow: string;
  recommendedAlternativeId?: string;
  badge?: string;
  affiliatePartnerId?: string;
}

export const LLM_MODELS: LLMModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'OpenAI',
    category: 'flagship',
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
    cachedInputCostPer1M: 1.25,
    contextWindow: '128k',
    recommendedAlternativeId: 'deepseek-v3',
    badge: 'Popular Flagship',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    category: 'flagship',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    cachedInputCostPer1M: 0.30,
    contextWindow: '200k',
    recommendedAlternativeId: 'deepseek-r1',
    badge: 'Best for Coding',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    category: 'efficient',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    cachedInputCostPer1M: 0.075,
    contextWindow: '128k',
    recommendedAlternativeId: 'deepseek-v3',
    badge: 'High Value',
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    category: 'efficient',
    inputCostPer1M: 0.80,
    outputCostPer1M: 4.00,
    cachedInputCostPer1M: 0.08,
    contextWindow: '200k',
    recommendedAlternativeId: 'deepseek-v3',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3 (via Together/Open)',
    provider: 'DeepSeek / Together AI',
    category: 'open-weights',
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    contextWindow: '64k',
    badge: '95% Cheaper',
    affiliatePartnerId: 'togetherai',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 (Reasoning)',
    provider: 'DeepSeek / RunPod Serverless',
    category: 'reasoning',
    inputCostPer1M: 0.55,
    outputCostPer1M: 2.19,
    contextWindow: '64k',
    badge: '85% Cheaper Reasoning',
    affiliatePartnerId: 'runpod',
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B Turbo',
    provider: 'Meta / Together AI',
    category: 'open-weights',
    inputCostPer1M: 0.80,
    outputCostPer1M: 0.80,
    contextWindow: '128k',
    badge: 'Enterprise Open',
    affiliatePartnerId: 'togetherai',
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google Cloud',
    category: 'flagship',
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.00,
    contextWindow: '2M',
    recommendedAlternativeId: 'deepseek-v3',
  }
];
