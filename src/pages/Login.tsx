import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import { ShieldCheck, Mail, Lock, RefreshCw } from "lucide-react";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const { address, isConnected, connectWallet, signMessage } = useWallet();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate("/onboarding");
    } catch (err: any) {
      setError(err?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      navigate("/onboarding");
    } catch (err: any) {
      setError(err?.message || "Google sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[var(--zx-primary-deep)] text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-6 h-6 text-[var(--zx-cream)]" />
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--zx-ink)]">
          {isRegister ? "Create Zentrix Account" : "Sign In to Zentrix"}
        </h1>
        <p className="text-xs text-[var(--zx-muted)]">
          Step 1 of 3: Authenticate with Firebase, complete onboarding, and connect your BridgeKey wallet.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-[var(--zx-surface)] border border-[var(--zx-danger)] text-xs text-[var(--zx-danger)]">
          {error}
        </div>
      )}

      {/* Auth Card */}
      <div className="card-surface p-6 space-y-5">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn-secondary w-full text-xs py-2.5 flex items-center justify-center gap-2 shadow-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--zx-border)]" />
          <span className="text-[11px] text-[var(--zx-muted)] font-medium">or email</span>
          <div className="flex-1 h-px bg-[var(--zx-border)]" />
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--zx-ink)] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--zx-muted)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--zx-primary-deep)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--zx-ink)] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--zx-muted)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--zx-primary-deep)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-xs py-2.5 shadow-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Please wait...
              </span>
            ) : isRegister ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[var(--zx-border)]">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-[var(--zx-primary-deep)] font-semibold hover:underline"
          >
            {isRegister ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
