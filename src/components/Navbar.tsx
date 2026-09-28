import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import {
  ChevronDown,
  Layers,
  Bot,
  BarChart3,
  CreditCard,
  LogOut,
  Wallet,
  ShieldCheck,
  Menu,
  X,
  KeyRound,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { AmbientAudio } from "./AmbientAudio";

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const { user, profile, currentRole, updateRole, logout } = useAuth();
  const { address, isConnected, isCorrectNetwork, switchNetwork, openConnectModal } = useWallet();

  const [productsOpen, setProductsOpen] = useState(false);
  const [monitorOpen, setMonitorOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const productsRef = useRef<HTMLDivElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
      if (monitorRef.current && !monitorRef.current.contains(event.target as Node)) {
        setMonitorOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
    setMonitorOpen(false);
  }, [pathname]);

  const formatShortAddress = (addr: string | null) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isActive = (path: string) => pathname === path;
  const isActivePrefix = (prefix: string) => pathname.startsWith(prefix);

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 pt-3 pb-2 transition-all duration-300">
      <div
        className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full border shadow-sm transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "var(--zx-border)",
          boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
        }}
      >
        {/* ─── LEFT: Crisp Navlogo + Network Indicator ─── */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/navlogo.png"
              alt="Zentrix"
              className="h-7 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            MST Testnet
          </span>
        </div>

        {/* ─── CENTER: Minimal Floating Nav Island (ReactBits style) ─── */}
        <nav
          className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full border shadow-inner text-xs font-semibold"
          style={{
            background: "var(--zx-surface-alt)",
            borderColor: "var(--zx-border)",
          }}
        >
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              isActive("/")
                ? "bg-white text-[var(--zx-primary-deep)] shadow-sm font-bold"
                : "text-[var(--zx-muted)] hover:text-[var(--zx-ink)] hover:bg-white/60"
            }`}
          >
            Home
          </Link>

          <Link
            to="/marketplace"
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              isActivePrefix("/marketplace")
                ? "bg-white text-[var(--zx-primary-deep)] shadow-sm font-bold"
                : "text-[var(--zx-muted)] hover:text-[var(--zx-ink)] hover:bg-white/60"
            }`}
          >
            Marketplace
          </Link>

          <Link
            to="/agent"
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              isActivePrefix("/agent")
                ? "bg-white text-[var(--zx-primary-deep)] shadow-sm font-bold"
                : "text-[var(--zx-muted)] hover:text-[var(--zx-ink)] hover:bg-white/60"
            }`}
          >
            <span>AI Agent</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--zx-primary)] animate-pulse" />
          </Link>

          {/* Monitor Dropdown */}
          <div
            className="relative"
            ref={monitorRef}
            onMouseEnter={() => setMonitorOpen(true)}
            onMouseLeave={() => setMonitorOpen(false)}
          >
            <button
              onClick={() => setMonitorOpen(!monitorOpen)}
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1 ${
                isActivePrefix("/dashboard") || isActivePrefix("/pricing")
                  ? "bg-white text-[var(--zx-primary-deep)] shadow-sm font-bold"
                  : "text-[var(--zx-muted)] hover:text-[var(--zx-ink)] hover:bg-white/60"
              }`}
            >
              <span>Monitor</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  monitorOpen ? "rotate-180 text-[var(--zx-primary)]" : ""
                }`}
              />
            </button>

            {monitorOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 rounded-2xl p-2 shadow-2xl border z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                style={{
                  background: "var(--zx-surface)",
                  borderColor: "var(--zx-border)",
                }}
              >
                <Link
                  to="/dashboard"
                  onClick={() => setMonitorOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--zx-surface-alt)] transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-red-50 text-[var(--zx-primary-deep)] group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--zx-ink)]">Dashboard</div>
                    <div className="text-[11px] text-[var(--zx-muted)]">Live escrow metrics</div>
                  </div>
                </Link>

                <Link
                  to="/pricing"
                  onClick={() => setMonitorOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--zx-surface-alt)] transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700 group-hover:scale-105 transition-transform">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--zx-ink)]">Pricing & Passes</div>
                    <div className="text-[11px] text-[var(--zx-muted)]">Pass NFT credits</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/about"
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              isActive("/about")
                ? "bg-white text-[var(--zx-primary-deep)] shadow-sm font-bold"
                : "text-[var(--zx-muted)] hover:text-[var(--zx-ink)] hover:bg-white/60"
            }`}
          >
            About
          </Link>
        </nav>

        {/* ─── RIGHT: Actions & Wallet ─── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Minimal Ambient Audio Equalizer */}
          <div className="hidden sm:block">
            <AmbientAudio />
          </div>

          {/* Network Switcher Pill if Wrong Network */}
          {isConnected && !isCorrectNetwork && (
            <button
              onClick={switchNetwork}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors"
            >
              Switch to MST
            </button>
          )}

          {/* Auth & Wallet Controls */}
          {!user ? (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white transition-all shadow hover:shadow-md hover:scale-105 active:scale-95"
              style={{ background: "var(--zx-primary-deep)" }}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          ) : !profile?.isOnboarded ? (
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white transition-all shadow hover:shadow-md hover:scale-105 active:scale-95"
              style={{ background: "var(--zx-primary-deep)" }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Onboard</span>
            </Link>
          ) : !isConnected ? (
            <button
              onClick={openConnectModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white transition-all shadow hover:shadow-md hover:scale-105 active:scale-95"
              style={{ background: "var(--zx-primary-deep)" }}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Connect Wallet</span>
            </button>
          ) : (
            /* Connected Pill */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border shadow-sm transition-all hover:bg-slate-50"
                style={{
                  background: "var(--zx-surface)",
                  borderColor: "var(--zx-border)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 animate-pulse" />
                <span className="font-mono text-xs font-bold text-[var(--zx-ink)]">
                  {formatShortAddress(address)}
                </span>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                  style={{ background: "var(--zx-primary-deep)" }}
                >
                  {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "ZX"}
                </div>
                <ChevronDown
                  className={`w-3 h-3 text-[var(--zx-muted)] transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Card */}
              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl p-2.5 shadow-2xl border z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  style={{
                    background: "var(--zx-surface)",
                    borderColor: "var(--zx-border)",
                  }}
                >
                  <div className="p-2.5 mb-1.5 border-b" style={{ borderColor: "var(--zx-border)" }}>
                    <p className="text-[10px] font-mono uppercase text-[var(--zx-muted)]">Signed in as</p>
                    <p className="text-xs font-bold text-[var(--zx-ink)] truncate">{profile?.email || user.email}</p>
                    <div
                      className="mt-2 flex items-center justify-between text-[11px] font-mono p-1.5 rounded-lg border"
                      style={{
                        background: "var(--zx-surface-alt)",
                        borderColor: "var(--zx-border)",
                      }}
                    >
                      <span className="text-[var(--zx-muted)]">Wallet:</span>
                      <span className="font-semibold text-[var(--zx-primary-deep)]">{formatShortAddress(address)}</span>
                    </div>
                  </div>

                  {/* Active Role Selector */}
                  <div className="px-2 py-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--zx-muted)] mb-1">
                      Active Role
                    </p>
                    <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100">
                      {(["client", "freelancer"] as const).map((role) => (
                        <button
                          key={role}
                          onClick={() => updateRole(role)}
                          className={`text-xs py-1 rounded-lg font-semibold capitalize transition-all ${
                            currentRole === role
                              ? "bg-white text-[var(--zx-primary-deep)] shadow-sm"
                              : "text-[var(--zx-muted)] hover:text-[var(--zx-ink)]"
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Links & Signout */}
                  <div className="pt-1.5 mt-1 border-t" style={{ borderColor: "var(--zx-border)" }}>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[var(--zx-ink)] rounded-xl hover:bg-[var(--zx-surface-alt)] transition-colors"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-[var(--zx-primary-deep)]" />
                      View Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 rounded-xl hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full border hover:bg-slate-50 transition-colors"
            style={{
              borderColor: "var(--zx-border)",
              background: "var(--zx-surface)",
            }}
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="w-4 h-4 text-[var(--zx-ink)]" /> : <Menu className="w-4 h-4 text-[var(--zx-ink)]" />}
          </button>
        </div>
      </div>

      {/* ─── MOBILE DRAWER (Glass card) ─── */}
      {mobileOpen && (
        <div
          className="md:hidden mt-2 p-4 rounded-3xl border shadow-xl space-y-2 animate-in fade-in slide-in-from-top-3 duration-200"
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            borderColor: "var(--zx-border)",
          }}
        >
          <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
            <Link
              to="/"
              className={`p-3 rounded-2xl flex items-center gap-2 ${
                isActive("/") ? "bg-red-50 text-[var(--zx-primary-deep)]" : "bg-slate-50 text-slate-700"
              }`}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className={`p-3 rounded-2xl flex items-center gap-2 ${
                isActivePrefix("/marketplace") ? "bg-red-50 text-[var(--zx-primary-deep)]" : "bg-slate-50 text-slate-700"
              }`}
            >
              Marketplace
            </Link>
            <Link
              to="/agent"
              className={`p-3 rounded-2xl flex items-center gap-2 ${
                isActivePrefix("/agent") ? "bg-red-50 text-[var(--zx-primary-deep)]" : "bg-slate-50 text-slate-700"
              }`}
            >
              AI Agent
            </Link>
            <Link
              to="/dashboard"
              className={`p-3 rounded-2xl flex items-center gap-2 ${
                isActivePrefix("/dashboard") ? "bg-red-50 text-[var(--zx-primary-deep)]" : "bg-slate-50 text-slate-700"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/pricing"
              className={`p-3 rounded-2xl flex items-center gap-2 ${
                isActivePrefix("/pricing") ? "bg-red-50 text-[var(--zx-primary-deep)]" : "bg-slate-50 text-slate-700"
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`p-3 rounded-2xl flex items-center gap-2 ${
                isActive("/about") ? "bg-red-50 text-[var(--zx-primary-deep)]" : "bg-slate-50 text-slate-700"
              }`}
            >
              About
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-between border-t" style={{ borderColor: "var(--zx-border)" }}>
            <AmbientAudio />
            <span className="text-[10px] font-mono text-[var(--zx-muted)]">MST TESTNET 91562037</span>
          </div>
        </div>
      )}
    </header>
  );
};
