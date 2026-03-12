"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const checkStrength = (pass: string) => {
    let s = 0;
    if (pass.length > 7) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    setStrength(s);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const authToast = toast.loading(isLogin ? "Authenticating..." : "Creating account...");

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("System configuration error. Connection failed.");
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Action failed');

      if (isLogin) {
        toast.success(`Welcome back, ${data.user.name}`, { id: authToast });
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => {
          if (data.user.role === 'admin') window.location.href = '/admin/dashboard';
          else if (data.user.role === 'staff') window.location.href = '/staff/portal';
          else window.location.href = '/portal/client';
        }, 1200);

      } else {
        toast.success("Account created! Please sign in.", { id: authToast });
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred", { id: authToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060f1e] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-[0.03] hero-grid"></div>
      <div className="absolute w-[500px] h-[500px] bg-[#c8921e]/10 rounded-full blur-[120px] -top-40 -right-40"></div>

      <div className="relative w-full max-w-[440px]">
        <div className="bg-[#0b1f3a]/90 backdrop-blur-2xl border border-[#c8921e]/20 rounded-[28px] p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#c8921e] rounded-xl flex items-center justify-center font-bold text-[#0b1f3a] text-2xl shadow-lg uppercase">O</div>
              <div className="text-left leading-none">
                <span className="block font-serif text-white text-xl font-bold tracking-tight uppercase">OBRUS</span>
                <span className="text-[10px] text-[#e8b84b] uppercase tracking-[0.2em] font-bold">Apex Services</span>
              </div>
            </div>
            <h2 className="font-serif text-3xl text-white font-bold tracking-tight">
              {isLogin ? 'Secure Access' : 'Create Account'}
            </h2>
            <p className="text-white/40 text-sm mt-2 font-medium text-center">
              {isLogin ? 'Integrated Portal Access' : 'Register for OBRUS Apex Services'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Full Name</label>
                 <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:border-[#c8921e] outline-none transition-all"
                  placeholder="e.g John Doe"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:border-[#c8921e] outline-none transition-all"
                placeholder="name@obrusapex.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Password</label>
                {isLogin && (
                  <Link 
                    href="/forgot-password" 
                    className="text-[10px] text-[#c8921e] font-bold uppercase tracking-widest hover:text-[#e8b84b]"
                  >
                    Forgot?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:border-[#c8921e] outline-none"
                  placeholder="••••••••"
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (!isLogin) checkStrength(e.target.value);
                  }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-white/20">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {!isLogin && (
                <div className="flex gap-1.5 mt-3 px-1">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                        i < strength ? (strength <= 2 ? 'bg-orange-500' : 'bg-[#1a7a4a]') : 'bg-white/5'
                      }`} 
                    />
                  ))}
                </div>
              )}
            </div>

            <button 
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-[#c8921e] to-[#e8b84b] text-[#060f1e] py-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SUBMIT'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <button onClick={() => setIsLogin(!isLogin)} className="text-white/40 text-[13px] font-medium transition-all group">
              {isLogin ? "Accessing for the first time?" : "Return to login?"} 
              <span className="text-[#c8921e] font-bold ml-1">{isLogin ? 'Register Here' : 'Login Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}