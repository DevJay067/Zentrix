import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { SplashScreen } from "./components/SplashScreen";
import { HomePage } from "./pages/Home";
import { AboutPage } from "./pages/About";
import { MarketplacePage } from "./pages/Marketplace";
import { AgentPage } from "./pages/Agent";
import { PricingPage } from "./pages/Pricing";
import { DashboardPage } from "./pages/Dashboard";
import { LoginPage } from "./pages/Login";
import { OnboardingPage } from "./pages/Onboarding";
import { ExternalLink } from "lucide-react";

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--zx-cream)] text-[var(--zx-ink)]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--zx-border)] bg-[var(--zx-surface)]/80 backdrop-blur-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--zx-muted)]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--zx-ink)]">Zentrix</span>
            <span>· MST Blockchain Buildathon 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--zx-success)] animate-pulse" />
              <span>Chain ID 91562037</span>
            </span>
            <span>·</span>
            <a
              href="https://testnet.mstscan.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--zx-primary-deep)] transition-colors flex items-center gap-1"
            >
              <span>MSTScan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>·</span>
            <a
              href="https://bridgekey.io"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--zx-primary-deep)] transition-colors flex items-center gap-1"
            >
              <span>BridgeKey</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
