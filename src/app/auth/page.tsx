"use client";
import React, { useState } from 'react';
import { 
  Eye, EyeOff, Lock, Mail, User as UserIcon, 
  Briefcase, Building, ChevronRight, ArrowLeft, 
  Loader2, MapPin, Phone, ShieldCheck, ClipboardList 
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AuthPage() {
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

    const authToast = toast.loading(isLogin ? "Confirming credentials..." : "Setting up your account...");
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { 
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          userType: userType, 
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
      if (!res.ok) throw new Error(data.message || 'Operation denied');

      if (isLogin) {
        if (data.user.status === 'pending') {
          toast.error("Vetting in progress. Account access restricted.", { id: authToast });
          setLoading(false);
          return;
        }

        toast.success(`Access Granted`, { id: authToast });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => {
          const role = data.user.role;
          const type = data.user.userType;
          
          if (role === 'admin') window.location.href = '/admin/dashboard';
          else if (type === 'employer') window.location.href = '/portal/employer';
          else if (type === 'service') window.location.href = '/portal/client';
          else window.location.href = '/recruitment';
        }, 1200);
      } else {
        toast.success(data.message, { id: authToast });
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
      <div className="absolute inset-0 opacity-[0.03] hero-grid pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] bg-[#c8921e]/10 rounded-full blur-[120px] -top-40 -right-40"></div>

      <div className="relative w-full max-w-[520px]">
        <div className="bg-[#0b1f3a]/95 backdrop-blur-2xl border border-[#c8921e]/20 rounded-[45px] p-12 shadow-3xl">
          
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="relative w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl border border-gold/30 p-1">
                <img src="/logo.png" alt="O" className="w-full h-full object-contain" />
              </div>
              <div className="text-left leading-none text-white font-serif font-black text-xl italic uppercase">OBRUS APEX</div>
            </div>
            <h2 className="font-serif text-3xl text-white font-bold tracking-tight mb-2 uppercase italic underline decoration-gold/20">
              {isLogin ? 'Security Access' : 'Partner Network'}
            </h2>
          </div>

          {!isLogin && !userType ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
               <PathCard ico={<Briefcase size={26}/>} title="Job Seeker" desc="Apply for verified industrial roles" onClick={() => setUserType('candidate')} />
               <PathCard ico={<Building size={26}/>} title="Employer" desc="Sourcing professional workforce" onClick={() => setUserType('employer')} />
               <PathCard ico={<ClipboardList size={26}/>} title="Services" desc="Request maintenance or training" onClick={() => setUserType('service')} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-bottom-8">
              {!isLogin && (
                 <button type="button" onClick={() => setUserType(null)} className="flex items-center gap-2 text-[10px] font-black uppercase text-gold hover:underline tracking-[0.3em] mb-4"><ArrowLeft size={14}/> Back</button>
              )}
              {!isLogin && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative"><input required className="ai" placeholder="Legal Name" onChange={(e) => setFormData({...formData, name: e.target.value})} /><UserIcon className="ii" size={18}/></div>
                  <div className="relative"><input required className="ai" placeholder="Phone Link" onChange={(e) => setFormData({...formData, phone: e.target.value})} /><Phone className="ii" size={18}/></div>
                </div>
              )}
              <div className="relative"><input required className="ai" placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} /><Mail className="ii" size={18}/></div>
              {!isLogin && userType === 'employer' && (
                <div className="space-y-4 pt-6 border-t border-white/5">
                   <p className="text-[10px] font-black text-gold uppercase text-center opacity-40 italic">Business Data</p>
                   <div className="relative"><input required className="ai" placeholder="Organization Name" onChange={(e) => setFormData({...formData, companyName: e.target.value})} /><Building className="ii" size={18}/></div>
                   <div className="relative"><input required className="ai" placeholder="CAC RC Number" onChange={(e) => setFormData({...formData, rcNumber: e.target.value})} /><ShieldCheck className="ii" size={18}/></div>
                   <div className="relative"><textarea required className="ai h-24 py-4 resize-none" placeholder="Company Address" onChange={(e) => setFormData({...formData, officeAddress: e.target.value})} /><MapPin className="ii top-5" size={18}/></div>
                </div>
              )}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Password</label>
                  {isLogin && <Link href="/forgot-password"  className="text-[10px] text-gold font-black uppercase hover:text-white transition-colors">Rescue Credentials?</Link>}
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required className="ai" placeholder="••••••••" onChange={(e) => { setFormData({...formData, password: e.target.value}); if (!isLogin) checkStrength(e.target.value); }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-white/10 hover:text-gold">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button><Lock className="ii" size={18}/>
                </div>
                {!isLogin && (
                  <div className="flex gap-2 mt-4 px-1">{[...Array(4)].map((_, i) => (<div key={i} className={`h-1 flex-1 rounded-full transition-all duration-700 ${i < strength ? (strength <= 2 ? 'bg-orange-500' : 'bg-green-500 shadow-[0_0_8px_lime]') : 'bg-white/5'}`} />))}</div>
                )}
              </div>
              <button disabled={loading} className="w-full mt-8 bg-gradient-to-r from-gold to-gold-lt text-navy py-5 rounded-[22px] font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:-translate-y-1 active:scale-95 transition-all">{loading ? <Loader2 className="animate-spin mx-auto"/> : 'Grant Access'}</button>
            </form>
          )}
          <div className="mt-12 text-center border-t border-white/5 pt-10">
            <button onClick={() => { setIsLogin(!isLogin); setUserType(null); }} className="text-white/40 text-[10px] font-bold tracking-widest uppercase transition-all">
              {isLogin ? "Establish New Profile?" : "Verified Node?"} <span className="text-gold font-black ml-4 border border-gold/30 px-3 py-1 rounded-full">{isLogin ? 'Sign Up' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .ai { width: 100%; background: rgba(255,255,255,0.02); border: 1.5px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px 20px 16px 52px; color: white; font-size: 14px; font-weight: 700; outline: none; transition: 0.4s; }
        .ai:focus { border-color: #c8921e; background: rgba(255,255,255,0.05); }
        .ai::placeholder { color: rgba(255,255,255,0.08); font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; }
        .ii { position: absolute; left: 18px; top: 18px; color: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}

function PathCard({ ico, title, desc, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full group p-8 bg-white/[0.02] border border-white/10 rounded-[35px] flex items-center justify-between hover:border-gold hover:bg-gold/5 transition-all text-left">
      <div className="flex gap-6 items-center">
        <div className="w-14 h-14 bg-navy text-gold rounded-2xl flex items-center justify-center border border-white/5 transition-transform duration-500 group-hover:scale-110">{ico}</div>
        <div>
          <span className="block text-white font-black text-lg leading-none mb-2 uppercase tracking-tight">{title}</span>
          <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">{desc}</span>
        </div>
      </div>
      <ChevronRight className="text-white/10 group-hover:text-gold transition-all" size={24}/>
    </button>
  );
}