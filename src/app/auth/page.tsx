"use client";
import React, { useState } from 'react';
import {
  Eye, EyeOff, Lock, Mail, User as UserIcon,
  Briefcase, Building, ChevronRight, ArrowLeft,
  Loader2, MapPin, Phone, ShieldCheck, ClipboardList
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<null | 'candidate' | 'employer' | 'service'>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
    companyName: '', rcNumber: '', industry: '', officeAddress: '',
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

    const authToast = toast.loading(isLogin ? 'Signing you in...' : 'Creating your account...');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          userType,
          employerProfile: userType === 'employer' ? {
            companyName: formData.companyName,
            rcNumber: formData.rcNumber,
            officeAddress: formData.officeAddress,
            industry: formData.industry,
          } : undefined
        };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      if (isLogin) {
        if (data.user.status === 'pending') {
          toast.error('Your account is pending approval. Our team will review and activate it shortly.', { id: authToast, duration: 6000 });
          setLoading(false);
          return;
        }

        toast.success('Welcome back!', { id: authToast });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => {
          const role = data.user.role;
          const type = data.user.userType;

          if (role === 'admin') window.location.href = '/admin/dashboard';
          else if (type === 'employer') window.location.href = '/portal/employer';
          else if (type === 'service') window.location.href = '/client/portal'; // FIX: was /portal/client
          else window.location.href = '/recruitment';
        }, 800);
      } else {
        toast.success('Account created! You can now sign in.', { id: authToast });
        setIsLogin(true);
        setUserType(null);
      }
    } catch (err: any) {
      toast.error(err.message, { id: authToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060f1e] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-[#c8921e]/10 rounded-full blur-[120px] -top-40 -right-40 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-[#1a7a4a]/5 rounded-full blur-[100px] -bottom-20 -left-20 pointer-events-none" />

      <div className="relative w-full max-w-[500px]">

        {/* Back to home */}
        <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white text-sm mb-6 transition-all w-fit">
          <ArrowLeft size={15}/> Back to home
        </Link>

        <div className="bg-[#0b1f3a]/95 backdrop-blur-2xl border border-[#c8921e]/20 rounded-3xl p-10 shadow-2xl">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#c8921e] rounded-xl flex items-center justify-center font-black text-[#0b1f3a] text-lg italic">O</div>
              <span className="text-white font-serif font-bold text-xl italic uppercase">OBRUS APEX</span>
            </div>
            <h2 className="font-serif text-2xl text-white font-bold tracking-tight mb-1">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-white/30 text-xs">
              {isLogin ? 'Welcome back. Enter your credentials to continue.' : 'Join the OBRUS partner network.'}
            </p>
          </div>

          {/* Registration — account type selection */}
          {!isLogin && !userType ? (
            <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
              <p className="text-white/40 text-xs text-center uppercase tracking-widest font-bold mb-4">I am a...</p>
              <PathCard ico={<Briefcase size={22}/>} title="Job Seeker" desc="Apply for verified industrial roles" onClick={() => setUserType('candidate')} />
              <PathCard ico={<Building size={22}/>} title="Employer" desc="Post jobs and hire professionals" onClick={() => setUserType('employer')} />
              <PathCard ico={<ClipboardList size={22}/>} title="Service Client" desc="Book HSE, environmental, or maintenance services" onClick={() => setUserType('service')} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              {!isLogin && (
                <button type="button" onClick={() => setUserType(null)} className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#c8921e] hover:underline tracking-widest mb-2">
                  <ArrowLeft size={13}/> Change account type
                </button>
              )}

              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input required className="ai" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <UserIcon className="ii" size={16}/>
                  </div>
                  <div className="relative">
                    <input required className="ai" placeholder="Phone Number" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    <Phone className="ii" size={16}/>
                  </div>
                </div>
              )}

              <div className="relative">
                <input required type="email" className="ai" placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <Mail className="ii" size={16}/>
              </div>

              {!isLogin && userType === 'employer' && (
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <p className="text-[10px] font-bold text-[#c8921e] uppercase text-center tracking-widest">Company Details</p>
                  <div className="relative">
                    <input required className="ai" placeholder="Company Name" onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                    <Building className="ii" size={16}/>
                  </div>
                  <div className="relative">
                    <input required className="ai" placeholder="CAC RC Number" onChange={(e) => setFormData({...formData, rcNumber: e.target.value})} />
                    <ShieldCheck className="ii" size={16}/>
                  </div>
                  <div className="relative">
                    <textarea required className="ai h-20 py-4 resize-none" placeholder="Office Address" onChange={(e) => setFormData({...formData, officeAddress: e.target.value})} />
                    <MapPin className="ii top-4" size={16}/>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Password</label>
                  {isLogin && (
                    <Link href="/forgot-password" className="text-[10px] text-[#c8921e] font-bold uppercase hover:text-white transition-colors">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="ai"
                    placeholder="••••••••"
                    onChange={(e) => {
                      setFormData({...formData, password: e.target.value});
                      if (!isLogin) checkStrength(e.target.value);
                    }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-white/20 hover:text-[#c8921e] transition-all">
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                  <Lock className="ii" size={16}/>
                </div>
                {!isLogin && (
                  <div className="flex gap-1.5 mt-2 px-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < strength ? (strength <= 2 ? 'bg-amber-500' : 'bg-green-500') : 'bg-white/5'}`} />
                    ))}
                  </div>
                )}
              </div>

              <button
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-[#c8921e] to-[#e8b84b] text-[#0b1f3a] py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" size={18}/> : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Toggle login/register */}
          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <button
              onClick={() => { setIsLogin(!isLogin); setUserType(null); }}
              className="text-white/30 text-xs font-semibold tracking-widest uppercase transition-all hover:text-white"
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="text-[#c8921e] font-bold ml-1">{isLogin ? 'Sign Up' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ai { width: 100%; background: rgba(255,255,255,0.03); border: 1.5px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 14px 18px 14px 46px; color: white; font-size: 14px; font-weight: 600; outline: none; transition: 0.3s; font-family: inherit; }
        .ai:focus { border-color: #c8921e; background: rgba(255,255,255,0.06); }
        .ai::placeholder { color: rgba(255,255,255,0.15); font-size: 13px; }
        .ii { position: absolute; left: 15px; top: 16px; color: rgba(255,255,255,0.15); pointer-events: none; }
      `}</style>
    </div>
  );
}

function PathCard({ ico, title, desc, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full group p-5 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-between hover:border-[#c8921e] hover:bg-[#c8921e]/5 transition-all text-left"
    >
      <div className="flex gap-4 items-center">
        <div className="w-11 h-11 bg-[#0b1f3a] text-[#c8921e] rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform">{ico}</div>
        <div>
          <span className="block text-white font-bold text-base leading-none mb-1">{title}</span>
          <span className="text-[11px] text-white/30 font-medium">{desc}</span>
        </div>
      </div>
      <ChevronRight className="text-white/10 group-hover:text-[#c8921e] transition-all shrink-0" size={20}/>
    </button>
  );
}
