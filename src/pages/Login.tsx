import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Sparkles,
  KeyRound,
} from "lucide-react";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();

  // Redirect destination after successful login & onboarding
  const from = (location.state as any)?.from || "/dashboard";

  // Strict onboarding redirect logic:
  // If authenticated with Firebase, immediately forward to Onboarding (if not onboarded)
  // or to target destination (if fully onboarded)
  useEffect(() => {
    if (user) {
      if (!profile?.isOnboarded) {
        navigate("/onboarding", { replace: true, state: { from } });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, profile, navigate, from]);

  // Form states
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // On success, useEffect automatically forwards to /onboarding
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please verify credentials.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      setLoading(true);
      await loginWithGoogle();
      // On success, useEffect automatically forwards to /onboarding
    } catch (err: any) {
      if (err?.code === "auth/popup-blocked") {
        setError("Popup was blocked by your browser. Redirecting you to sign in with Google...");
      } else if (err?.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup closed before completion. Please try again.");
      } else {
        setError(err?.message || "Google sign-in cancelled or failed.");
      }
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

      <div className="w-full max-w-md space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
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
              {isRegister ? "Create Zentrix Account" : "Sign In to Zentrix"}
            </h1>
            <p className="text-xs text-[var(--zx-muted)] max-w-xs mx-auto leading-relaxed">
              Authenticate with your credentials, then proceed directly to strict protocol onboarding.
            </p>
          </div>
        </div>

        {/* Target Destination Notice if Redirected */}
        {location.state?.from && (
          <div
            className="p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-xs"
            style={{
              background: "rgba(163, 4, 2, 0.06)",
              border: "1px solid var(--zx-primary)",
              color: "var(--zx-primary-deep)",
            }}
          >
            <Lock className="w-4 h-4 shrink-0" />
            <span>Login required to access {location.state.from}. Authenticate to proceed.</span>
          </div>
        )}

        {/* Main Authentication Card */}
        <div
          className="rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 relative overflow-hidden backdrop-blur-xl"
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

          {/* Google 1-Click Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl border text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 transition-all flex items-center justify-center gap-2.5 shadow-xs cursor-pointer border-slate-200 active:scale-98 disabled:opacity-60"
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

          {/* Email / Password Form */}
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
                  <span>Create Account & Onboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Sign In & Proceed</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign In / Register */}
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(null); }}
              className="text-xs font-bold text-[var(--zx-primary-deep)] hover:underline cursor-pointer"
            >
              {isRegister ? "Already registered? Sign In" : "Need an account? Create one now"}
            </button>
          </div>

          {/* Trust Metrics Footer */}
          <div
            className="pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[var(--zx-muted)]"
            style={{ borderColor: "var(--zx-border)" }}
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Non-Custodial Escrow</span>
            </div>
            <div>MST Testnet (91562037)</div>
            <div>DPDP 2023 Compliant</div>
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
