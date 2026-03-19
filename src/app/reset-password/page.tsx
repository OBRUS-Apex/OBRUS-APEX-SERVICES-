"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Supabase automatically handles the hash token in the URL for us.
  // If a user lands here without a valid session token, we can redirect them.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Invalid or expired reset link.");
        router.push('/auth');
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    const load = toast.loading('Updating password...');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast.success('Password updated successfully!', { id: load });
      
      // Force log out so they have to sign in with the new credentials
      await supabase.auth.signOut();
      localStorage.clear();
      router.push('/auth');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password', { id: load });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060f1e] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-[#c8921e]/10 rounded-full blur-[120px] -top-40 -right-40 pointer-events-none" />
      <div className="relative w-full max-w-[440px]">
        <div className="bg-[#0b1f3a]/95 backdrop-blur-2xl border border-[#c8921e]/20 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl text-white font-bold tracking-tight mb-2">Create New Password</h2>
            <p className="text-white/40 text-xs">Enter a strong new password for your account.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-sm font-medium text-white outline-none focus:border-[#c8921e] transition-all" placeholder="New Password (min 6 chars)"/>
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18}/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#c8921e] transition-all">
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            <button disabled={loading} className="w-full bg-[#c8921e] text-[#0b1f3a] py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#e8b84b] transition-all disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin mx-auto" size={18}/> : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
