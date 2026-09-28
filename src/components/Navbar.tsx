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
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const { user, profile, currentRole, updateRole, logout } = useAuth();
  const { address, isConnected, isCorrectNetwork, connectWallet, switchNetwork } = useWallet();

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
  }, [pathname]);

  const formatShortAddress = (addr: string | null) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isActive = (path: string) => pathname === path;
  const isActivePrefix = (prefix: string) => pathname.startsWith(prefix);

  const navLinkClass = (active: boolean) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "text-[var(--zx-primary-deep)] bg-[var(--zx-surface-alt)] font-semibold"
        : "text-[var(--zx-ink)] hover:text-[var(--zx-primary-deep)] hover:bg-[var(--zx-surface)]"
    }`;

  return (
    <header
      style={{
        background: "rgba(247, 239, 223, 0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--zx-border)",
      }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* ─── LEFT: Logo + Desktop Nav ─── */}
        <div className="flex items-center gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            {/* Stylized 'Z' brand mark */}
            <div
              style={{
                background: "var(--zx-primary-deep)",
                borderRadius: "10px",
              }}
              className="w-9 h-9 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"
            >
              <span
                style={{ color: "var(--zx-cream)", fontWeight: 900, fontSize: "1.1rem", lineHeight: 1 }}
              >
                Z
              </span>
            </div>
            <span
              style={{ color: "var(--zx-primary-deep)", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em" }}
            >
              Zentrix
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            <Link to="/" className={navLinkClass(isActive("/"))}>Home</Link>
            <Link to="/about" className={navLinkClass(isActive("/about"))}>About</Link>

            {/* Products dropdown — hover on desktop */}
            <div
              className="relative"
              ref={productsRef}
              onMouseEnter={() => { setProductsOpen(true); setMonitorOpen(false); }}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                onClick={() => { setProductsOpen(!productsOpen); setMonitorOpen(false); }}
                className={navLinkClass(
                  isActivePrefix("/marketplace") || isActivePrefix("/agent")
                ) + " flex items-center gap-1"}
              >
                Products
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
              </button>

              {productsOpen && (
                <div
                  style={{ borderRadius: "1rem", background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}
                  className="absolute left-0 top-full mt-1.5 w-56 shadow-2xl py-1.5 z-50"
                >
                  <Link
                    to="/marketplace"
                    onClick={() => setProductsOpen(false)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--zx-surface-alt)] transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-[var(--zx-cream)] text-[var(--zx-primary-deep)] mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--zx-ink)]">Marketplace</div>
                      <div className="text-xs text-[var(--zx-muted)]">Browse gigs &amp; milestone plans</div>
                    </div>
                  </Link>
                  <Link
                    to="/agent"
                    onClick={() => setProductsOpen(false)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--zx-surface-alt)] transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-[var(--zx-cream)] text-[var(--zx-primary-deep)] mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--zx-ink)]">AI Agent</div>
                      <div className="text-xs text-[var(--zx-muted)]">Sarvam AI intelligent match</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Monitor dropdown — hover on desktop */}
            <div
              className="relative"
              ref={monitorRef}
              onMouseEnter={() => { setMonitorOpen(true); setProductsOpen(false); }}
              onMouseLeave={() => setMonitorOpen(false)}
            >
              <button
                onClick={() => { setMonitorOpen(!monitorOpen); setProductsOpen(false); }}
                className={navLinkClass(
                  isActivePrefix("/pricing") || isActivePrefix("/dashboard")
                ) + " flex items-center gap-1"}
              >
                Monitor
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${monitorOpen ? "rotate-180" : ""}`} />
              </button>

              {monitorOpen && (
                <div
                  style={{ borderRadius: "1rem", background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}
                  className="absolute left-0 top-full mt-1.5 w-56 shadow-2xl py-1.5 z-50"
                >
                  <Link
                    to="/pricing"
                    onClick={() => setMonitorOpen(false)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--zx-surface-alt)] transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-[var(--zx-cream)] text-[var(--zx-primary-deep)] mt-0.5">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--zx-ink)]">Pricing &amp; Passes</div>
                      <div className="text-xs text-[var(--zx-muted)]">Pass NFT tiers &amp; credits</div>
                    </div>
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMonitorOpen(false)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--zx-surface-alt)] transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-[var(--zx-cream)] text-[var(--zx-primary-deep)] mt-0.5">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--zx-ink)]">Dashboard</div>
                      <div className="text-xs text-[var(--zx-muted)]">Escrow &amp; milestone tracking</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* ─── RIGHT: Actions ─── */}
        <div className="flex items-center gap-2">
          {/* Network badge */}
          {isConnected && (
            <div className="hidden sm:flex items-center">
              {isCorrectNetwork ? (
                <span className="badge-success text-xs flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "var(--zx-success)" }}
                  />
                  MST Testnet
                </span>
              ) : (
                <button onClick={switchNetwork} className="badge-warning text-xs cursor-pointer hover:opacity-80">
                  Switch to MST
                </button>
              )}
            </div>
          )}

          {/* Auth / Wallet state */}
          {!user ? (
            /* Not logged in */
            <Link to="/login" className="btn-primary text-sm shadow-sm">
              <KeyRound className="w-4 h-4" />
              <span>Login</span>
            </Link>
          ) : !profile?.isOnboarded ? (
            /* Needs onboarding */
            <Link to="/onboarding" className="btn-primary text-sm shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Complete Onboarding</span>
            </Link>
          ) : !isConnected ? (
            /* Needs wallet */
            <button onClick={connectWallet} className="btn-primary text-sm shadow-sm flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>Connect BridgeKey</span>
            </button>
          ) : (
            /* Fully connected — wallet address pill + profile dropdown */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  background: "var(--zx-surface)",
                  border: "1px solid var(--zx-border)",
                  borderRadius: "9999px",
                }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-[var(--zx-surface-alt)] transition-all shadow-sm"
              >
                {/* Green dot + address pill */}
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--zx-success)", boxShadow: "0 0 0 2px var(--zx-surface)" }}
                />
                <span
                  className="font-mono text-xs font-semibold"
                  style={{ color: "var(--zx-primary-deep)" }}
                >
                  {formatShortAddress(address)}
                </span>
                {/* Avatar initials */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]"
                  style={{ background: "var(--zx-primary-deep)", color: "var(--zx-cream)" }}
                >
                  {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "ZX"}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[var(--zx-muted)] transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <div
                  style={{ borderRadius: "1rem", background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}
                  className="absolute right-0 top-full mt-2 w-64 shadow-2xl p-2 z-50"
                >
                  {/* Header */}
                  <div className="p-3 mb-1" style={{ borderBottom: "1px solid var(--zx-border)" }}>
                    <p className="text-[11px] text-[var(--zx-muted)]">Signed in as</p>
                    <p className="text-sm font-bold text-[var(--zx-ink)] truncate">{profile?.email || user.email}</p>
                    <div
                      className="mt-2 flex items-center justify-between text-xs font-mono p-1.5 rounded-lg"
                      style={{ background: "var(--zx-cream)", color: "var(--zx-muted)" }}
                    >
                      <span>Wallet:</span>
                      <span className="font-semibold text-[var(--zx-primary-deep)]">{formatShortAddress(address)}</span>
                    </div>
                  </div>

                  {/* Role switcher */}
                  <div className="px-3 py-2">
                    <p className="text-[11px] font-semibold text-[var(--zx-muted)] uppercase tracking-wider mb-1.5">
                      Active Role
                    </p>
                    <div className="grid grid-cols-2 gap-1 p-1 rounded-lg" style={{ background: "var(--zx-cream)" }}>
                      {(["client", "freelancer"] as const).map((role) => (
                        <button
                          key={role}
                          onClick={() => updateRole(role)}
                          className={`text-xs py-1.5 rounded font-medium transition-all capitalize ${
                            currentRole === role
                              ? "text-white shadow-sm"
                              : "text-[var(--zx-ink)] hover:text-[var(--zx-primary-deep)]"
                          }`}
                          style={currentRole === role ? { background: "var(--zx-primary-deep)" } : {}}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-1" style={{ borderTop: "1px solid var(--zx-border)" }}>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[var(--zx-ink)] rounded-lg hover:bg-[var(--zx-surface-alt)]"
                    >
                      <BarChart3 className="w-4 h-4 text-[var(--zx-primary-deep)]" />
                      View Dashboard
                    </Link>
                    <button
                      onClick={() => { setProfileOpen(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-[var(--zx-surface-alt)] text-left"
                      style={{ color: "var(--zx-primary-deep)" }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--zx-surface-alt)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen
              ? <X className="w-5 h-5 text-[var(--zx-ink)]" />
              : <Menu className="w-5 h-5 text-[var(--zx-ink)]" />
            }
          </button>
        </div>
      </div>

      {/* ─── Mobile slide-down menu ─── */}
      {mobileOpen && (
        <div
          style={{ borderTop: "1px solid var(--zx-border)", background: "rgba(247, 239, 223, 0.97)" }}
          className="md:hidden w-full px-4 pb-4 pt-2 space-y-1"
        >
          <Link to="/" className={`block ${navLinkClass(isActive("/"))}`}>Home</Link>
          <Link to="/about" className={`block ${navLinkClass(isActive("/about"))}`}>About</Link>

          {/* Products group */}
          <div>
            <button
              className="w-full text-left flex items-center justify-between px-3 py-2 text-sm font-medium text-[var(--zx-ink)]"
              onClick={() => setProductsOpen(!productsOpen)}
            >
              Products
              <ChevronDown className={`w-4 h-4 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
            </button>
            {productsOpen && (
              <div className="pl-3 space-y-0.5">
                <Link to="/marketplace" className={`block ${navLinkClass(isActivePrefix("/marketplace"))}`}>Marketplace</Link>
                <Link to="/agent" className={`block ${navLinkClass(isActivePrefix("/agent"))}`}>AI Agent</Link>
              </div>
            )}
          </div>

          {/* Monitor group */}
          <div>
            <button
              className="w-full text-left flex items-center justify-between px-3 py-2 text-sm font-medium text-[var(--zx-ink)]"
              onClick={() => setMonitorOpen(!monitorOpen)}
            >
              Monitor
              <ChevronDown className={`w-4 h-4 transition-transform ${monitorOpen ? "rotate-180" : ""}`} />
            </button>
            {monitorOpen && (
              <div className="pl-3 space-y-0.5">
                <Link to="/pricing" className={`block ${navLinkClass(isActivePrefix("/pricing"))}`}>Pricing &amp; Passes</Link>
                <Link to="/dashboard" className={`block ${navLinkClass(isActivePrefix("/dashboard"))}`}>Dashboard</Link>
              </div>
            )}
          </div>

          {/* Network badge (mobile) */}
          {isConnected && (
            <div className="pt-1">
              {isCorrectNetwork ? (
                <span className="badge-success text-xs flex items-center gap-1 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--zx-success)" }} />
                  MST Testnet
                </span>
              ) : (
                <button onClick={switchNetwork} className="badge-warning text-xs w-fit">
                  Switch to MST
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
