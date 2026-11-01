import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Mail,
  Lock,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    socialLogin
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | '2fa'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === '2fa') {
      if (twoFactorCode.trim() !== '849201' && twoFactorCode.trim().length !== 6) {
        setError('Invalid authentication code. Please check your authenticator app (demo code: 849201).');
        return;
      }
      setLoading(true);
      await login(email || 'alex.rivera@prime.example.com', 'password123');
      setLoading(false);
      setIsAuthModalOpen(false);
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    // Advance to 2FA verification step for robust security protocol demonstration
    setMode('2fa');
  };

  const handleSocialClick = async (provider: 'google' | 'apple' | 'facebook' | 'github') => {
    setLoading(true);
    await socialLogin(provider);
    setLoading(false);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Surface */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#181c1d] text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl overflow-hidden my-auto z-10 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#131921] text-white flex items-center justify-between border-b border-[#232F3E]">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black text-white">
              amazon<span className="text-[#FF9900]">id</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-2">
              Secure Sign-In
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === '2fa' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-500/10 text-[#FF9900] rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-500/30">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Two-Factor Authentication
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter the 6-digit verification code from your security token or SMS.
                </p>
                <div className="mt-1 text-[11px] font-mono text-[#FF9900] bg-amber-50 dark:bg-amber-950/40 p-1 rounded inline-block">
                  Demo 2FA Code: 849201
                </div>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="849201"
                  className="w-full text-center tracking-[0.5em] text-lg font-mono py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-[#FF9900]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 text-xs font-bold rounded-lg transition shadow-xs flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying Code...' : 'Verify & Continue'}
              </button>

              <button
                type="button"
                onClick={() => setMode('signin')}
                className="w-full text-center text-xs text-slate-500 hover:underline"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <>
              {/* Social Login Buttons */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  One-Click Social Sign-In:
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('google')}
                    className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('apple')}
                    className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.66 1.38-.56.64-1.06 1.7-0.93 2.74 1.04.08 2.06-.5 2.67-1.25"/>
                    </svg>
                    <span>Apple ID</span>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('facebook')}
                    className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    <svg className="w-4 h-4 text-blue-600 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </button>

                  {/* GitHub */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('github')}
                    className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    <svg className="w-4 h-4 fill-current text-slate-800 dark:text-slate-200" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-2 text-[11px] text-slate-400 uppercase">or with email</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="First and last name"
                      className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Email or mobile phone number
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.rivera@example.com"
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => alert('Password reset link simulated to email')}
                        className="text-[11px] text-[#007185] dark:text-[#3db2c6] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 text-xs font-bold rounded-md transition shadow-xs"
                >
                  {mode === 'signin' ? 'Sign In & Verify 2FA' : 'Create your Amazon Account'}
                </button>
              </form>

              {/* Mode switch */}
              <div className="pt-2 text-center text-xs">
                {mode === 'signin' ? (
                  <div className="text-slate-600 dark:text-slate-400">
                    New to Amazon?{' '}
                    <button
                      onClick={() => setMode('signup')}
                      className="font-semibold text-[#007185] dark:text-[#3db2c6] hover:underline"
                    >
                      Create your Amazon account
                    </button>
                  </div>
                ) : (
                  <div className="text-slate-600 dark:text-slate-400">
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('signin')}
                      className="font-semibold text-[#007185] dark:text-[#3db2c6] hover:underline"
                    >
                      Sign in
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-3 border-t border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by Amazon Multi-Factor Security</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
