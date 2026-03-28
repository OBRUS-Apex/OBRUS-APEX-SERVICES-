"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Loader2, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-blue-50 flex items-center justify-center p-6 font-sans">
      <div className="relative w-full max-w-[460px]">
        <Link href="/auth" className="flex items-center gap-2 text-gray-400 hover:text-[#1a2e46] text-sm mb-8 transition-all group font-bold w-fit uppercase tracking-widest">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
        </Link>

        <div className="bg-white rounded-[40px] p-10 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#257242] rounded-2xl flex items-center justify-center text-white shadow-xl">
                <ShieldCheck size={24} />
              </div>
              <div className="text-left border-l border-gray-200 pl-4">
                 <h1 className="text-[#1a2e46] font-serif font-black text-2xl leading-none">OBRUS APEX</h1>
                 <p className="text-[#257242] text-[10px] font-black uppercase tracking-widest mt-0.5">Security Hub</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-extrabold text-[#1a2e46] tracking-tighter">
              {isSent ? 'Link Dispatched' : 'Reset Password'}
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-2 leading-relaxed">
              {isSent 
                ? 'Please check your email inbox for the secure recovery link.' 
                : 'Enter your registered email address to receive a secure recovery link.'}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input 
                  required 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-[#fdfdfd] border-2 border-[#efefef] rounded-2xl pl-14 pr-4 py-4 text-sm font-bold text-[#1a2e46] outline-none focus:border-[#257242] transition-all placeholder:text-gray-300 placeholder:uppercase placeholder:text-[11px] placeholder:tracking-widest" 
                  placeholder="Your Email Address"
                />
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-200" size={20}/>
              </div>
              
              <button 
                disabled={loading} 
                className="w-full bg-[#257242] text-white py-4.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-green-700 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : 'Send Recovery Link'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="p-6 bg-green-50 rounded-3xl border border-green-100">
                <p className="text-[#257242] text-xs font-bold leading-relaxed">
                  We have sent a verification link to <br/>
                  <span className="underline decoration-2 underline-offset-4">{email}</span>
                </p>
              </div>
              <button 
                onClick={() => { setIsSent(false); setEmail(''); }} 
                className="text-[#257242] text-[10px] font-black uppercase tracking-widest hover:text-[#1a2e46] transition-colors italic underline underline-offset-4"
              >
                Try a different email address
              </button>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            &copy; 2026 OBRUS APEX SERVICES · SECURITY DIVISION
          </p>
        </div>
      </div>
    </div>
  );
}