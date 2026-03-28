"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-blue-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute w-[600px] h-[600px] bg-[#257242]/5 rounded-full blur-[120px] -top-40 -right-40 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-[#1a2e46]/5 rounded-full blur-[100px] -bottom-20 -left-20 pointer-events-none" />

      <div className="relative w-full max-w-[460px]">
        <Link href="/auth" className="flex items-center gap-2 text-gray-400 hover:text-[#1a2e46] text-sm mb-8 transition-all group font-bold w-fit uppercase tracking-widest">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
        </Link>

        <div className="bg-white rounded-[40px] p-10 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-4 mb-6">
              <img src="/logo.png" alt="O" className="h-10 w-auto object-contain" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-10 h-10 bg-[#257242] rounded-xl flex items-center justify-center text-white font-bold italic shadow-md text-xl">O</div>';
                }} 
              />
              <div className="text-left border-l border-gray-200 pl-4">
                 <h1 className="text-[#1a2e46] font-serif font-black text-2xl leading-none">OBRUS APEX</h1>
                 <p className="text-[#257242] text-[10px] font-black uppercase tracking-widest mt-0.5">Security Hub</p>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-[#1a2e46] tracking-tighter">New Password</h2>
            <p className="text-gray-500 text-sm font-medium mt-2">Establish a secure key for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Secure Key</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="input-field" 
                  placeholder="••••••••"
                />
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-200" size={18}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#257242] transition-colors">
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-[#1a2e46] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-[#257242] transform active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" size={18}/> : 'Update Credentials'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              This action will terminate all active sessions <br /> to ensure account integrity.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-field { 
          width: 100%; background: #fdfdfd; border: 1.5px solid #efefef; border-radius: 20px; padding: 18px 20px 18px 56px; 
          color: #1a2e46; font-size: 14px; font-weight: 700; outline: none; transition: 0.3s; 
        }
        .input-field:focus { border-color: #257242; box-shadow: 0 10px 30px rgba(37, 114, 66, 0.05); }
        .input-field::placeholder { color: #d1d1d1; }
      `}</style>
    </div>
  );
}