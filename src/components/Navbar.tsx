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
  User,
  LogOut,
  Wallet,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const { user, profile, currentRole, updateRole, logout } = useAuth();
  const { address, isConnected, isCorrectNetwork, connectWallet, switchNetwork } = useWallet();

  const [productsOpen, setProductsOpen] = useState(false);
  const [monitorOpen, setMonitorOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const productsRef = useRef<HTMLDivElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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

  const formatShortAddress = (addr: string | null) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--zx-border)] bg-[var(--zx-cream)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* 1. Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--zx-primary-deep)] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-[var(--zx-cream)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[var(--zx-primary-deep)]">
                Zentrix
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--zx-muted)] -mt-1">
                MST Escrow & AI
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {/* 2. Home */}
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-[var(--zx-primary-deep)] bg-[var(--zx-surface)] font-semibold"
                  : "text-[var(--zx-ink)] hover:text-[var(--zx-primary-deep)] hover:bg-[var(--zx-surface)]"
              }`}
            >
              Home
            </Link>

            {/* 3. About */}
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/about")
                  ? "text-[var(--zx-primary-deep)] bg-[var(--zx-surface)] font-semibold"
                  : "text-[var(--zx-ink)] hover:text-[var(--zx-primary-deep)] hover:bg-[var(--zx-surface)]"
              }`}
            >
              About
            </Link>

            {/* 4. Products (Dropdown: Marketplace, Agents) */}
            <div className="relative" ref={productsRef}>
              <button
                onClick={() => {
                  setProductsOpen(!productsOpen);
                  setMonitorOpen(false);
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors ${
                  pathname.startsWith("/marketplace") || pathname.startsWith("/agent")
                    ? "text-[var(--zx-primary-deep)] bg-[var(--zx-surface)] font-semibold"
                    : "text-[var(--zx-ink)] hover:text-[var(--zx-primary-deep)] hover:bg-[var(--zx-surface)]"
                }`}
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
              </button>

              {productsOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-[var(--zx-surface)] border border-[var(--zx-border)] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <Link
                    to="/marketplace"
                    onClick={() => setProductsOpen(false)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--zx-surface-alt)] transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-[var(--zx-cream)] text-[var(--zx-primary-deep)] mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--zx-ink)]">Marketplace</div>
                      <div className="text-xs text-[var(--zx-muted)]">Browse gigs & milestone plans</div>
                    </div>
                  </Link>

                  <Link
                    to="/agent"
                    onClick={() => setProductsOpen(false)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--zx-surface-alt)] transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-[var(--zx-cream)] text-[var(--zx-primary-deep)] mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--zx-ink)]">AI Agents</div>
                      <div className="text-xs text-[var(--zx-muted)]">Sarvam AI intelligent match</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 5. Monitor (Dropdown: Pricing, Dashboard) */}
            <div className="relative" ref={monitorRef}>
              <button
                onClick={() => {
                  setMonitorOpen(!monitorOpen);
                  setProductsOpen(false);
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors ${
                  pathname.startsWith("/pricing") || pathname.startsWith("/dashboard")
                    ? "text-[var(--zx-primary-deep)] bg-[var(--zx-surface)] font-semibold"
                    : "text-[var(--zx-ink)] hover:text-[var(--zx-primary-deep)] hover:bg-[var(--zx-surface)]"
                }`}
              >
                Monitor
                <ChevronDown className={`w-4 h-4 transition-transform ${monitorOpen ? "rotate-180" : ""}`} />
              </button>

              {monitorOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-[var(--zx-surface)] border border-[var(--zx-border)] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <Link
                    to="/pricing"
                    onClick={() => setMonitorOpen(false)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--zx-surface-alt)] transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-[var(--zx-cream)] text-[var(--zx-primary-deep)] mt-0.5">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--zx-ink)]">Pricing & Passes</div>
                      <div className="text-xs text-[var(--zx-muted)]">Pass NFT tiers & credits</div>
                    </div>
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setMonitorOpen(false)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--zx-surface-alt)] transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-[var(--zx-cream)] text-[var(--zx-primary-deep)] mt-0.5">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--zx-ink)]">Dashboard</div>
                      <div className="text-xs text-[var(--zx-muted)]">Escrow & milestone tracking</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* 6. End of Navbar: Abstracted User / Login Button */}
        <div className="flex items-center gap-3">
          {/* Network indicator badge if connected */}
          {isConnected && (
            <div className="hidden sm:flex items-center">
              {isCorrectNetwork ? (
                <span className="badge-success text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--zx-success)] animate-pulse" />
                  MST Testnet
                </span>
              ) : (
                <button
                  onClick={switchNetwork}
                  className="badge-warning text-xs cursor-pointer hover:opacity-80"
                >
                  Switch to MST
                </button>
              )}
            </div>
          )}

          {/* User state */}
          {!user ? (
            /* Not logged in: Show Login Button */
            <Link to="/login" className="btn-primary text-sm shadow-sm">
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          ) : !profile?.isOnboarded ? (
            /* Logged in with Firebase, but needs onboarding */
            <Link to="/onboarding" className="btn-primary text-sm shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Complete Onboarding</span>
            </Link>
          ) : !isConnected ? (
            /* Onboarded, but needs mandatory wallet connection */
            <button
              onClick={connectWallet}
              className="btn-primary text-sm shadow-sm flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect BridgeKey</span>
            </button>
          ) : (
            /* Logged in, Onboarded, and Wallet Connected: Abstracted Profile Pill */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[var(--zx-surface)] border border-[var(--zx-border)] hover:bg-[var(--zx-surface-alt)] transition-all shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--zx-primary-deep)] text-white flex items-center justify-center font-bold text-xs">
                  {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "ZX"}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[var(--zx-ink)] leading-tight truncate max-w-[90px]">
                    {profile?.name || "Account"}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--zx-muted)] leading-tight">
                    {formatShortAddress(address)}
                  </div>
                </div>
                <span className="badge-tier text-[10px] uppercase font-bold py-0.5 px-1.5">
                  {currentRole || "User"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--zx-muted)]" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[var(--zx-surface)] border border-[var(--zx-border)] shadow-2xl p-2 z-50">
                  <div className="p-3 border-b border-[var(--zx-border)] mb-1">
                    <p className="text-xs text-[var(--zx-muted)]">Signed in as</p>
                    <p className="text-sm font-bold text-[var(--zx-ink)] truncate">{profile?.email || user.email}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-[var(--zx-muted)] font-mono bg-[var(--zx-cream)] p-1.5 rounded-lg">
                      <span>Wallet:</span>
                      <span className="font-semibold text-[var(--zx-primary-deep)]">{formatShortAddress(address)}</span>
                    </div>
                  </div>

                  {/* Role Switcher */}
                  <div className="px-3 py-2">
                    <p className="text-[11px] font-semibold text-[var(--zx-muted)] uppercase tracking-wider mb-1.5">
                      Active Role
                    </p>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--zx-cream)] rounded-lg">
                      <button
                        onClick={() => updateRole("client")}
                        className={`text-xs py-1 rounded font-medium transition-all ${
                          currentRole === "client"
                            ? "bg-[var(--zx-primary-deep)] text-white shadow-xs"
                            : "text-[var(--zx-ink)] hover:text-[var(--zx-primary-deep)]"
                        }`}
                      >
                        Client
                      </button>
                      <button
                        onClick={() => updateRole("freelancer")}
                        className={`text-xs py-1 rounded font-medium transition-all ${
                          currentRole === "freelancer"
                            ? "bg-[var(--zx-primary-deep)] text-white shadow-xs"
                            : "text-[var(--zx-ink)] hover:text-[var(--zx-primary-deep)]"
                        }`}
                      >
                        Freelancer
                      </button>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-[var(--zx-border)]">
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[var(--zx-ink)] rounded-lg hover:bg-[var(--zx-surface-alt)]"
                    >
                      <BarChart3 className="w-4 h-4 text-[var(--zx-primary-deep)]" />
                      View Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[var(--zx-primary-deep)] rounded-lg hover:bg-[var(--zx-surface-alt)] text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
