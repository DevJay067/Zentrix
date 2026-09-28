import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Wallet,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  KeyRound,
} from "lucide-react";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const { address, isConnected, isCorrectNetwork, connectWallet, switchNetwork, openConnectModal } = useWallet();

  // Redirect destination after successful onboarding
  const from = (location.state as any)?.from || "/dashboard";

  // If already logged in and fully onboarded, redirect to target
  useEffect(() => {
    if (user && profile?.isOnboarded) {
      navigate(from, { replace: true });
    }
  }, [user, profile, navigate, from]);

  // Form states
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sequential Step logic:
  // Step 1: Email & Google Authentication (Mandatory)
  // Step 2: Web3 Wallet Binding & Onboarding Anchor (Sequential)
  const isAuthCompleted = !!user;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      // Moves sequentially to Step 2 (user state becomes truthy)
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      setLoading(true);
      await loginWithGoogle();
      // Moves sequentially to Step 2 (user state becomes truthy)
    } catch (err: any) {
      if (err?.code === "auth/popup-blocked") {
        setError("Popup was blocked by your browser. Redirecting you to sign in with Google...");
      } else if (err?.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup closed before completion. Please try again.");
      } else {
        setError(err?.message || "Google sign-in cancelled or failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStep2WalletConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const connected = await connectWallet();
      if (connected) {
        if (!isCorrectNetwork) {
          await switchNetwork();
        }
        // Proceed directly into sequential profile setup
        navigate("/onboarding", { state: { from } });
      }
    } catch (err: any) {
      setError(err?.message || "Wallet connection cancelled or failed. Please check BridgeKey.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-8 px-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--zx-primary) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--zx-primary-deep) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="w-full max-w-lg space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div
              className="w-16 h-16 rounded-3xl p-1 flex items-center justify-center mx-auto shadow-xl border relative"
              style={{
                background: "linear-gradient(135deg, var(--zx-primary-deep) 0%, var(--zx-primary) 100%)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <img
                src="/navlogo.png"
                alt="Zentrix Logo"
                className="w-10 h-10 object-contain drop-shadow-md"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
              ✓
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--zx-ink)] tracking-tight">
              Sequential Protocol Onboarding
            </h1>
            <p className="text-xs text-[var(--zx-muted)] max-w-sm mx-auto leading-relaxed">
              Step 1: Identity & Credentials &nbsp;→&nbsp; Step 2: MST Testnet Web3 Anchor.
            </p>
          </div>

          {/* Sequential Step Progress Bar */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold">
              <span className={`w-2 h-2 rounded-full ${!isAuthCompleted ? "bg-[var(--zx-primary)] animate-pulse" : "bg-emerald-500"}`} />
              <span className={!isAuthCompleted ? "text-[var(--zx-primary-deep)] font-bold" : "text-emerald-700"}>
                1. Identity {isAuthCompleted && "✓"}
              </span>
            </div>
            <div className="w-4 h-0.5 bg-slate-200" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold">
              <span className={`w-2 h-2 rounded-full ${isAuthCompleted ? "bg-[var(--zx-primary)] animate-pulse" : "bg-slate-300"}`} />
              <span className={isAuthCompleted ? "text-[var(--zx-primary-deep)] font-bold" : "text-slate-500"}>
                2. Web3 Anchor
              </span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div
          className="rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl"
          style={{
            background: "rgba(255, 255, 255, 0.96)",
            borderColor: "var(--zx-border)",
            boxShadow: "0 25px 50px -12px rgba(42, 15, 15, 0.12)",
          }}
        >
          {/* Error Banner */}
          {error && (
            <div
              className="p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-semibold shadow-xs animate-in fade-in duration-200"
              style={{
                background: "rgba(163, 4, 2, 0.08)",
                border: "1px solid var(--zx-primary)",
                color: "var(--zx-primary-deep)",
              }}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{error}</div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-xs opacity-60 hover:opacity-100 font-bold ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              STEP 1: EMAIL & GOOGLE AUTHENTICATION (MANDATORY)
             ═══════════════════════════════════════════════ */}
          {!isAuthCompleted ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-black uppercase tracking-wider text-[var(--zx-ink)]">
                  Step 1: Authenticate Identity
                </span>
                <span className="text-[10px] font-mono text-[var(--zx-muted)]">Mandatory</span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl border text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 transition-all flex items-center justify-center gap-2.5 shadow-xs cursor-pointer border-slate-200 active:scale-98"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="var(--zx-google-blue)"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="var(--zx-google-green)"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="var(--zx-google-yellow)"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="var(--zx-google-red)"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--zx-muted)]">
                  or email credentials
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--zx-ink)]">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--zx-muted)]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs text-[var(--zx-ink)] bg-white focus:outline-none transition-shadow"
                      style={{ borderColor: "var(--zx-border)" }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--zx-ink)]">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--zx-muted)]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs text-[var(--zx-ink)] bg-white focus:outline-none transition-shadow"
                      style={{ borderColor: "var(--zx-border)" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--zx-muted)] hover:text-[var(--zx-ink)]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60 mt-1"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : isRegister ? (
                    <>
                      <span>Register & Proceed to Wallet</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Sign In & Proceed to Wallet</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Mode Toggle */}
              <div className="text-center pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsRegister(!isRegister); setError(null); }}
                  className="text-xs font-bold text-[var(--zx-primary-deep)] hover:underline cursor-pointer"
                >
                  {isRegister ? "Already registered? Sign In" : "Need an account? Create one now"}
                </button>
              </div>
            </div>
          ) : (
            /* ═══════════════════════════════════════════════
               STEP 2: IN SERIES MANDATORY WALLET CONNECTION
               ═══════════════════════════════════════════════ */
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950">Identity Verified</div>
                    <div className="text-[11px] text-emerald-700 font-mono truncate max-w-[200px]">
                      {user.email || user.displayName || user.uid}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Step 1 Complete
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Step 2: Connect MST Web3 Wallet</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    MST Testnet (91562037)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  To complete onboarding, connect your BridgeKey or EVM wallet. All milestone escrow releases and soulbound credentials are permanently anchored to this cryptographic address.
                </p>
              </div>

              {isConnected && address ? (
                <div className="space-y-4">
                  <div
                    className="p-4 rounded-2xl border flex items-center justify-between"
                    style={{
                      background: "rgba(22, 101, 52, 0.05)",
                      borderColor: "rgba(22, 101, 52, 0.2)",
                    }}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase font-bold text-emerald-800">
                        Connected Address
                      </span>
                      <div className="font-mono text-xs font-black text-slate-900">
                        {address.slice(0, 10)}...{address.slice(-8)}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Ready
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/onboarding", { state: { from } })}
                    className="btn-primary w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Proceed to Profile Setup</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleStep2WalletConnect}
                    disabled={loading}
                    className="btn-primary w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Connecting Wallet...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        <span>Connect Wallet & Complete Onboarding</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-[var(--zx-muted)]">
                    Compatible with BridgeKey and MetaMask on MST Testnet (Chain ID 91562037).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Trust Metrics Footer */}
          <div
            className="pt-4 border-t flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[var(--zx-muted)]"
            style={{ borderColor: "var(--zx-border)" }}
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Non-Custodial Escrow</span>
            </div>
            <div>Chain ID: 91562037</div>
            <div>Automated Release: 72h</div>
          </div>
        </div>

        {/* Support Link */}
        <p className="text-center text-xs text-[var(--zx-muted)]">
          Need technical assistance? Explore our{" "}
          <Link to="/manual" className="font-bold underline text-[var(--zx-ink)]">
            User Manual
          </Link>{" "}
          or reach the{" "}
          <Link to="/contact" className="font-bold underline text-[var(--zx-primary-deep)]">
            Support Desk
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
