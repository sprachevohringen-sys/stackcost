import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StackCost — AI & Cloud Infrastructure Cost Optimizer (2026)",
  description: "Calculate and compare LLM token pricing (OpenAI, Claude 3.5, DeepSeek V3), Cloud VPS (AWS vs DigitalOcean vs Vultr), and GPU serverless compute. Cut startup infrastructure burn by up to 70%.",
  keywords: [
    "LLM cost calculator",
    "AI token pricing comparison",
    "DeepSeek V3 pricing vs GPT-4o",
    "AWS EC2 vs DigitalOcean cost",
    "RunPod GPU pricing",
    "cloud cost optimization tool",
    "startup cloud savings",
  ],
  authors: [{ name: "StackCost Research" }],
  openGraph: {
    title: "StackCost — AI & Cloud Infrastructure Cost Optimizer",
    description: "Compare LLM token costs, cloud VPS, and serverless GPUs side-by-side. Free developer tool.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackCost — Cut Cloud & AI Burn by 70%",
    description: "Interactive real-time infrastructure cost calculator for founders and developers.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
