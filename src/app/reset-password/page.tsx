"use client";
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Loader2, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (err) {
      alert("Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-[#060f1e] flex items-center justify-center">
      <div className="text-center p-10 bg-[#0b1f3a] rounded-3xl border border-gold">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h2 className="text-white text-2xl font-serif">Success!</h2>
        <p className="text-white/50 text-sm mt-2">Password reset. Redirecting to login...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060f1e] flex items-center justify-center p-6">
      <div className="relative w-full max-w-[400px] bg-[#0b1f3a]/90 backdrop-blur-2xl border border-[#c8921e]/20 rounded-[28px] p-10 shadow-2xl">
        <h2 className="font-serif text-3xl text-white font-bold text-center mb-6">New Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-white/20 w-4" />
            <input 
              type="password" required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-gold outline-none" 
              placeholder="Enter new password" onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button disabled={loading} className="w-full bg-gold text-navy py-4 rounded-xl font-bold flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}