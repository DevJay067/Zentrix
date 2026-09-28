import React, { useState } from "react";
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
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Cpu,
} from "lucide-react";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const { address, isConnected, isCorrectNetwork, connectWallet, switchNetwork } = useWallet();

  // Redirect destination after successful login
  const from = (location.state as any)?.from || "/dashboard";

  const [authMode, setAuthMode] = useState<"wallet" | "email">("wallet");
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in or wallet connected, provide quick redirect
  const handleProceedWithWallet = () => {
    navigate(from, { replace: true });
  };

  const handleWalletConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const connectedAddress = await connectWallet("bridgekey");
      if (connectedAddress) {
        if (!isCorrectNetwork) {
          await switchNetwork();
        }
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error("[Login] Wallet connection failed:", err);
      setError(err?.message || "Failed to connect BridgeKey wallet.");
    } finally {
      setLoading(false);
    }
  };

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
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || "Google sign-in cancelled or failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-10 px-4 relative overflow-hidden">
      {/* ─── Ambient Glow Spheres ─── */}
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
        {/* ─── Brand Hero Badge ─── */}
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
              Enter Zentrix Protocol
            </h1>
            <p className="text-xs text-[var(--zx-muted)] max-w-sm mx-auto leading-relaxed">
              Decentralized freelance marketplace with non-custodial milestone escrow on MST Blockchain (Chain ID 91562037).
            </p>
          </div>

          {/* Destination Notice if redirected from Protected Route */}
          {location.state?.from && (
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(163, 4, 2, 0.08)",
                border: "1px solid rgba(163, 4, 2, 0.25)",
                color: "var(--zx-primary-deep)",
              }}
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Login required to access {location.state.from}</span>
            </div>
          )}
        </div>

        {/* ─── Main Glassmorphic Auth Bento Card ─── */}
        <div
          className="rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl"
          style={{
            background: "rgba(255, 255, 255, 0.94)",
            borderColor: "var(--zx-border)",
            boxShadow: "0 25px 50px -12px rgba(42, 15, 15, 0.12)",
          }}
        >
          {/* Auth Mode Toggle Pill */}
          <div
            className="flex p-1 rounded-2xl border"
            style={{
              background: "var(--zx-surface-alt)",
              borderColor: "var(--zx-border)",
            }}
          >
            <button
              type="button"
              onClick={() => { setAuthMode("wallet"); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMode === "wallet"
                  ? "bg-white text-[var(--zx-primary-deep)] shadow-sm"
                  : "text-[var(--zx-muted)] hover:text-[var(--zx-ink)]"
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Web3 Wallet</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode("email"); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMode === "email"
                  ? "bg-white text-[var(--zx-primary-deep)] shadow-sm"
                  : "text-[var(--zx-muted)] hover:text-[var(--zx-ink)]"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Google</span>
            </button>
          </div>

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
                onClick={() => setError(null)}
                className="text-xs opacity-60 hover:opacity-100 font-bold ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* ─── TAB 1: WEB3 WALLET LOGIN ─── */}
          {authMode === "wallet" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">BridgeKey EIP-1193 Provider</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    MST Testnet (91562037)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Connect your native BridgeKey or MetaMask wallet. Zero passwords, tamper-proof cryptographic identity with non-custodial milestone release capabilities.
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
                      Approved
                    </span>
                  </div>

                  <button
                    onClick={handleProceedWithWallet}
                    className="btn-primary w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Proceed to Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleWalletConnect}
                    disabled={loading}
                    className="btn-primary w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Connecting BridgeKey...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        <span>Connect BridgeKey Wallet</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-[var(--zx-muted)]">
                    Don't have BridgeKey installed? Connect via MetaMask or{" "}
                    <a
                      href="https://bridgekey.io"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-bold text-[var(--zx-primary-deep)]"
                    >
                      install BridgeKey Extension
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ─── TAB 2: EMAIL & GOOGLE SOCIAL LOGIN ─── */}
          {authMode === "email" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Google Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl border text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 transition-all flex items-center justify-center gap-2.5 shadow-xs cursor-pointer border-slate-200"
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
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
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
          )}

          {/* ─── Bento Trust Metrics Footer ─── */}
          <div
            className="pt-4 border-t flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[var(--zx-muted)]"
            style={{ borderColor: "var(--zx-border)" }}
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-PII On-Chain</span>
            </div>
            <div>Chain ID: 91562037</div>
            <div>Pull Payments: Active</div>
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
