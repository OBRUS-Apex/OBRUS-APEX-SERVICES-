"use client";
import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setError('Invalid or missing reset token.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/auth'), 3000);
      } else {
        setError(data.message || 'Failed to update password.');
      }
    } catch {
      setError('A connection error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="text-center p-10 bg-[#0b1f3a] rounded-3xl border border-[#c8921e]/20">
      <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={32}/>
      </div>
      <h2 className="text-white text-2xl font-serif font-bold mb-3">Password Updated</h2>
      <p className="text-white/50 text-sm leading-relaxed">Your password has been updated. Redirecting to sign in...</p>
    </div>
  );

  return (
    <div className="relative w-full max-w-[420px] bg-[#0b1f3a]/95 backdrop-blur-2xl border border-[#c8921e]/20 rounded-3xl p-10 shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-[#c8921e]/10 border border-[#c8921e]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock size={20} className="text-[#c8921e]"/>
        </div>
        <h2 className="font-serif text-2xl text-white font-bold">Set New Password</h2>
        <p className="text-white/40 text-sm mt-2">Create a strong password for your account.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="password"
            required
            minLength={8}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[#c8921e] outline-none transition-all placeholder:text-white/20 font-medium"
            placeholder="New password (min. 8 characters)"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Lock className="absolute left-4 top-4 text-white/20" size={16}/>
        </div>
        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#c8921e] to-[#e8b84b] text-[#0b1f3a] py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18}/> : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#060f1e] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute w-[500px] h-[500px] bg-[#c8921e]/10 rounded-full blur-[120px] -top-40 -right-40 pointer-events-none" />
      <Link href="/auth" className="flex items-center gap-2 text-white/30 hover:text-white text-sm mb-6 transition-all">
        <ArrowLeft size={15}/> Back to Sign In
      </Link>
      <Suspense fallback={
        <div className="text-white flex items-center gap-2 font-medium tracking-widest text-xs">
          <Loader2 className="animate-spin text-[#c8921e]" size={16}/> Loading...
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
