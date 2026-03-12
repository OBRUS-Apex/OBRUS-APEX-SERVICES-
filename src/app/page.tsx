"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API configuration error. Please verify MONGODB_URI is set in pxxl dashboard.");
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Authentication failed');

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.role === 'admin') window.location.href = '/admin/dashboard';
        else if (data.user.role === 'staff') window.location.href = '/staff/portal';
        else window.location.href = '/portal/client';
      } else {
        setIsLogin(true);
        alert("Registration successful. Please sign in to continue.");
      }
    } catch (err: any) {
      setError(err.message);
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
            <p className="text-white/40 text-sm mt-2 font-medium">
              {isLogin ? 'Unified Portal for Staff & Clients' : 'Sign up for integrated service management'}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4.5 h-4.5 text-white/20" />
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-[#c8921e] outline-none transition-all placeholder:text-white/10"
                    placeholder="Enter full name"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-white/20" />
                <input 
                  type="email" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-[#c8921e] outline-none transition-all placeholder:text-white/10"
                  placeholder="name@obrusapex.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] ml-1">Password</label>
                {isLogin && (
                  <Link 
                    href="/forgot-password" 
                    className="text-[10px] text-[#c8921e] font-bold uppercase tracking-widest hover:text-[#e8b84b] transition-colors"
                  >
                    Forgot?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-white/20" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white focus:border-[#c8921e] outline-none transition-all placeholder:text-white/10"
                  placeholder="••••••••"
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (!isLogin) checkStrength(e.target.value);
                  }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-3.5 text-white/20 hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>

              {!isLogin && (
                <div className="flex gap-1.5 mt-3 px-1">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                        i < strength ? (strength <= 2 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'bg-[#1a7a4a] shadow-[0_0_8px_rgba(26,122,74,0.4)]') : 'bg-white/5'
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-white/40 text-[13px] font-medium group transition-all"
            >
              {isLogin ? "New to the platform?" : "Joined us before?"} 
              <span className="text-[#c8921e] font-bold ml-1 group-hover:text-[#e8b84b]">{isLogin ? 'Register' : 'Login'}</span>
            </button>
          </div>
        </div>

        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 text-white/20 text-[11px] font-bold uppercase tracking-[0.2em] mt-8 hover:text-[#c8921e] transition-colors"
        >
          ← Back to Website
        </Link>
      </div>
    </div>
  );
}