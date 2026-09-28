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
import { ProfilePage } from "./pages/Profile";
import { DisclosurePage } from "./pages/Disclosure";
import { ContactPage } from "./pages/Contact";
import { ManualPage } from "./pages/Manual";
import { Footer } from "./components/Footer";
import { CursorFollower } from "./components/CursorFollower";

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--zx-cream)] text-[var(--zx-ink)]">
      <CursorFollower />
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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/disclosure" element={<DisclosurePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/manual" element={<ManualPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
