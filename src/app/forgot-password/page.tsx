"use client";
import React, { useState } from 'react';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || 'If that email exists, a reset link has been sent.');
    } catch {
      setMessage('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060f1e] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-[#c8921e]/10 rounded-full blur-[120px] -top-40 -right-40 pointer-events-none" />

      <div className="relative w-full max-w-[420px]">
        <Link href="/auth" className="flex items-center gap-2 text-white/30 hover:text-white text-sm mb-6 transition-all w-fit">
          <ArrowLeft size={15}/> Back to Sign In
        </Link>

        <div className="bg-[#0b1f3a]/95 backdrop-blur-2xl border border-[#c8921e]/20 rounded-3xl p-10 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-[#c8921e]/10 border border-[#c8921e]/30 rounded-2xl flex items-center justify-center">
              <Mail size={22} className="text-[#c8921e]"/>
            </div>
          </div>
          <h2 className="font-serif text-2xl text-white font-bold text-center mb-2">Reset Password</h2>
          <p className="text-white/40 text-center text-sm mb-8">Enter your email and we'll send you a reset link.</p>

          {message ? (
            <div className="text-center p-4 bg-[#c8921e]/10 text-[#e8b84b] rounded-2xl text-sm mb-6 border border-[#c8921e]/20 leading-relaxed">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-white focus:border-[#c8921e] outline-none transition-all placeholder:text-white/20 font-medium"
                  placeholder="Your email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#c8921e] to-[#e8b84b] text-[#0b1f3a] py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
