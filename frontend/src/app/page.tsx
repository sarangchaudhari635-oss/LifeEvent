"use client";

import { TopHeroSection } from "@/components/TopHeroSection";
import { InfiniteMarquee } from "@/components/InfiniteMarquee";
import { CrisisQuestionsLedger } from "@/components/CrisisQuestionsLedger";
import { InteractiveJourneySimulator } from "@/components/InteractiveJourneySimulator";
import { EvidenceTrapInspector } from "@/components/EvidenceTrapInspector";
import { PaytmBridgeShowcase } from "@/components/PaytmBridgeShowcase";
import { HospitalConsolePreview } from "@/components/HospitalConsolePreview";
import { HackathonJudgeLaunchpad } from "@/components/HackathonJudgeLaunchpad";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col antialiased selection:bg-neutral-900 selection:text-white">
      {/* 1. Locked Hero Section (UNTOUCHED & PRESERVED) */}
      <TopHeroSection />

      {/* 2. Infinite Horizontal Marquee (Integrated Networks & Clinical Guarantees) */}
      <InfiniteMarquee />

      {/* 3. The 5 Urgent Questions: Master-Detail Crisis Response Ledger */}
      <CrisisQuestionsLedger />

      {/* 4. Signature Architecture: The Living Journey Line Interactive State Machine */}
      <InteractiveJourneySimulator />

      {/* 5. Zero-Hallucination Evidence Inspector & Planted Trap Defense */}
      <EvidenceTrapInspector />

      {/* 6. Paytm Emergency Liquidity Rail & Instant Caution Deposit Bridge */}
      <PaytmBridgeShowcase />

      {/* 7. Institutional B2B SaaS: Hospital Financial Counselor Cockpit */}
      <HospitalConsolePreview />

      {/* 8. Paytm AI Hackathon Technical Differentiation Matrix & 3-Min Judge Launchpad */}
      <HackathonJudgeLaunchpad />
    </div>
  );
}
