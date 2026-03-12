"use client";
import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
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
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
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
        setError(data.message || "Failed to update password.");
      }
    } catch (err) {
      setError("A connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="text-center p-10 bg-[#0b1f3a] rounded-3xl border border-[#c8921e] animate-fade-in">
      <div className="w-16 h-16 bg-[#1a7a4a]/20 text-[#28a866] rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={32} />
      </div>
      <h2 className="text-white text-2xl font-serif font-bold">Success!</h2>
      <p className="text-white/50 text-sm mt-3 leading-relaxed">Your password has been securely updated. Redirecting to login...</p>
    </div>
  );

  return (
    <div className="relative w-full max-w-[420px] bg-[#0b1f3a]/90 backdrop-blur-2xl border border-[#c8921e]/20 rounded-[28px] p-10 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl text-white font-bold">New Password</h2>
        <p className="text-white/40 text-sm mt-2 font-medium">Create a strong, unique password for your OBRUS portal</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] ml-1">Secure Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-white/20" />
            <input 
              type="password" 
              required 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-[#c8921e] outline-none transition-all placeholder:text-white/10"
              placeholder="••••••••" 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#c8921e] to-[#e8b84b] text-[#060f1e] py-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 hover:-translate-y-1 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'UPDATE PASSWORD'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#060f1e] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-[0.03] hero-grid"></div>
      <div className="absolute w-[500px] h-[500px] bg-[#c8921e]/10 rounded-full blur-[120px] -top-40 -right-40"></div>
      
      <Suspense fallback={
        <div className="text-white flex items-center gap-2 font-medium tracking-widest text-xs">
          <Loader2 className="animate-spin text-gold" /> INITIALIZING SECURITY...
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}