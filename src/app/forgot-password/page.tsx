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
      setMessage(data.message);
    } catch (err) {
      setMessage("Failed to send email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060f1e] flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 opacity-[0.03] hero-grid"></div>
      <div className="relative w-full max-w-[400px] bg-[#0b1f3a]/90 backdrop-blur-2xl border border-[#c8921e]/20 rounded-[28px] p-10 shadow-2xl">
        <h2 className="font-serif text-3xl text-white font-bold text-center mb-2">Reset Password</h2>
        <p className="text-white/40 text-center text-sm mb-8">Enter your email and we'll send a reset link.</p>
        
        {message ? (
          <div className="text-center p-4 bg-gold/10 text-gold-lt rounded-xl text-sm mb-6 border border-gold/20">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-gold outline-none" 
              placeholder="Your email address" onChange={(e) => setEmail(e.target.value)}
            />
            <button disabled={loading} className="w-full bg-gold text-navy py-4 rounded-xl font-bold flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        )}
        <Link href="/auth" className="flex items-center justify-center gap-2 text-white/40 text-xs mt-8 hover:text-white uppercase tracking-widest font-bold">
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </div>
    </div>
  );
}