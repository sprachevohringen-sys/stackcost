export interface CloudTier {
  id: string;
  name: string;
  vCPU: number;
  ramGB: number;
  storageGB: number;
  bandwidthTB: number;
  awsPrice: number; // Approximate EC2 standard pricing + EBS
  digitalOceanPrice: number; // Droplet pricing
  vultrPrice: number; // High Performance NVMe
  hetznerPrice: number; // CX / CPX tier in USD
}

export const CLOUD_TIERS: CloudTier[] = [
  {
    id: 'starter',
    name: 'Starter / Microservice',
    vCPU: 1,
    ramGB: 2,
    storageGB: 50,
    bandwidthTB: 2,
    awsPrice: 24.50,
    digitalOceanPrice: 12.00,
    vultrPrice: 10.00,
    hetznerPrice: 5.50,
  },
  {
    id: 'standard',
    name: 'General Production API',
    vCPU: 2,
    ramGB: 4,
    storageGB: 80,
    bandwidthTB: 4,
    awsPrice: 52.80,
    digitalOceanPrice: 24.00,
    vultrPrice: 20.00,
    hetznerPrice: 11.20,
  },
  {
    id: 'growth',
    name: 'Growth Scale / Database',
    vCPU: 4,
    ramGB: 8,
    storageGB: 160,
    bandwidthTB: 5,
    awsPrice: 112.40,
    digitalOceanPrice: 48.00,
    vultrPrice: 40.00,
    hetznerPrice: 22.80,
  },
  {
    id: 'enterprise',
    name: 'High-Throughput Cluster',
    vCPU: 8,
    ramGB: 16,
    storageGB: 320,
    bandwidthTB: 6,
    awsPrice: 228.00,
    digitalOceanPrice: 96.00,
    vultrPrice: 80.00,
    hetznerPrice: 44.50,
  },
  {
    id: 'heavyweight',
    name: 'Compute-Intensive / Cache',
    vCPU: 16,
    ramGB: 32,
    storageGB: 640,
    bandwidthTB: 8,
    awsPrice: 460.00,
    digitalOceanPrice: 192.00,
    vultrPrice: 160.00,
    hetznerPrice: 89.00,
  },
];

export interface GPUServer {
  name: string;
  vramGB: number;
  awsHourly: number; // g5 or p4 equivalents
  runpodHourly: number; // RunPod serverless / secure cloud
  savingsPercent: number;
  bestFor: string;
  affiliatePartnerId: string;
}

export const GPU_BENCHMARKS: GPUServer[] = [
  {
    name: 'NVIDIA RTX 4090 (24GB VRAM)',
    vramGB: 24,
    awsHourly: 1.45, // equivalent compute
    runpodHourly: 0.34,
    savingsPercent: 76,
    bestFor: 'Fine-tuning 7B-14B models & high-throughput inference',
    affiliatePartnerId: 'runpod',
  },
  {
    name: 'NVIDIA A40 / L40S (48GB VRAM)',
    vramGB: 48,
    awsHourly: 2.65,
    runpodHourly: 0.79,
    savingsPercent: 70,
    bestFor: 'Production Llama 3.3 70B Quantized & SDXL image generation',
    affiliatePartnerId: 'runpod',
  },
  {
    name: 'NVIDIA A100 SXM (80GB VRAM)',
    vramGB: 80,
    awsHourly: 4.10, // p4de on AWS
    runpodHourly: 1.64,
    savingsPercent: 60,
    bestFor: 'Enterprise LLM Serving & Large scale batch processing',
    affiliatePartnerId: 'runpod',
  },
  {
    name: 'NVIDIA H100 PCIe (80GB VRAM)',
    vramGB: 80,
    awsHourly: 6.80, // p5 on AWS
    runpodHourly: 2.89,
    savingsPercent: 57,
    bestFor: 'DeepSeek R1 full reasoning & fast training jobs',
    affiliatePartnerId: 'runpod',
  },
];
