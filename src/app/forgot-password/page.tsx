"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');
    
    setLoading(true);
    const load = toast.loading('Sending reset link...');

    try {
      // Use Supabase's native password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Reset link sent!', { id: load });
      setIsSent(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset link', { id: load });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060f1e] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-[#c8921e]/10 rounded-full blur-[120px] -top-40 -right-40 pointer-events-none" />
      <div className="relative w-full max-w-[440px]">
        <Link href="/auth" className="flex items-center gap-2 text-white/30 hover:text-white text-sm mb-6 transition-all w-fit">
          <ArrowLeft size={15}/> Back to login
        </Link>
        <div className="bg-[#0b1f3a]/95 backdrop-blur-2xl border border-[#c8921e]/20 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl text-white font-bold tracking-tight mb-2">Reset Password</h2>
            <p className="text-white/40 text-xs leading-relaxed">
              {isSent ? 'Check your email inbox for the secure reset link.' : 'Enter your registered email address and we will send you a secure link to reset your password.'}
            </p>
          </div>
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-white outline-none focus:border-[#c8921e] transition-all" placeholder="Email Address"/>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18}/>
              </div>
              <button disabled={loading} className="w-full bg-[#c8921e] text-[#0b1f3a] py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#e8b84b] transition-all disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin mx-auto" size={18}/> : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <button onClick={() => { setIsSent(false); setEmail(''); }} className="text-[#c8921e] text-xs font-bold uppercase tracking-widest hover:underline">
                Try another email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
                }
