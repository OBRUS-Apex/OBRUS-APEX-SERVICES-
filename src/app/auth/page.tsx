"use client";
import React, { useState } from 'react';
import { 
  Eye, EyeOff, Lock, Mail, User as UserIcon, 
  Briefcase, Building, ChevronRight, ArrowLeft, 
  Loader2, MapPin, Phone, Globe, ShieldCheck, ClipboardList
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
    name: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    rcNumber: '',
    industry: '',
    officeAddress: '',
    website: ''
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

    const authToast = toast.loading(isLogin ? "Verifying Credentials..." : "Creating Authorized Account...");
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { 
          ...formData, 
          userType, 
          employerProfile: userType === 'employer' ? {
            companyName: formData.companyName,
            rcNumber: formData.rcNumber,
            officeAddress: formData.officeAddress,
            industry: formData.industry,
            website: formData.website
          } : undefined 
        };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("System node timeout. Please try again.");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Action denied');

      if (isLogin) {
        if (data.user.status === 'pending') {
          toast.error("Vetting in Progress: Access restricted until Admin approval.", { id: authToast });
          setLoading(false);
          return;
        }

        toast.success(`Welcome, ${data.user.name}`, { id: authToast });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => {
          if (data.user.role === 'admin') window.location.href = '/admin/dashboard';
          else if (data.user.userType === 'employer') window.location.href = '/portal/employer';
          else if (data.user.userType === 'service') window.location.href = '/portal/client';
          else window.location.href = '/recruitment';
        }, 1200);

      } else {
        toast.success(data.message, { id: authToast, duration: 6000 });
        setIsLogin(true);
        setUserType(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Encryption error", { id: authToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060f1e] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-[0.03] hero-grid"></div>
      <div className="absolute w-[500px] h-[500px] bg-[#c8921e]/10 rounded-full blur-[120px] -top-40 -right-40"></div>

      <div className="relative w-full max-w-[520px]">
        <div className="bg-[#0b1f3a]/90 backdrop-blur-2xl border border-[#c8921e]/20 rounded-[45px] p-12 shadow-3xl">
          
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="relative w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl border border-gold/30 p-1 shadow-2xl">
                <img src="/logo.png" alt="O" className="w-full h-full object-contain" />
              </div>
              <div className="text-left leading-none">
                <span className="block font-serif text-white text-2xl font-black uppercase tracking-tighter italic">OBRUS APEX</span>
                <span className="text-[10px] text-[#e8b84b] uppercase font-bold tracking-[0.4em] opacity-60">Integrated Center</span>
              </div>
            </div>
            
            <h2 className="font-serif text-4xl text-white font-bold tracking-tight mb-2 uppercase">
              {isLogin ? 'Secure Gateway' : 'Partner Registry'}
            </h2>
            <p className="text-white/30 text-xs font-black uppercase tracking-widest leading-loose">
              {isLogin ? 'Enter Authorized Credentials' : 'Identify your mission profile below'}
            </p>
          </div>

          {!isLogin && !userType ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
               <PathCard 
                ico={<Briefcase size={26}/>} 
                title="Candidate" 
                desc="Looking for industrial job vacancies" 
                onClick={() => setUserType('candidate')} 
               />
               <PathCard 
                ico={<Building size={26}/>} 
                title="Employer" 
                desc="Sourcing industrial manpower talent" 
                onClick={() => setUserType('employer')} 
               />
               <PathCard 
                ico={<ClipboardList size={26}/>} 
                title="Services" 
                desc="HSE, Environmental & Maintenance requests" 
                onClick={() => setUserType('service')} 
               />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-bottom-8">
              {!isLogin && (
                 <button type="button" onClick={() => setUserType(null)} className="flex items-center gap-2 text-[10px] font-black uppercase text-gold hover:underline tracking-[0.3em] mb-4">
                    <ArrowLeft size={14}/> Node Selection
                 </button>
              )}

              {!isLogin && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input type="text" required className="ai" placeholder="Legal Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <UserIcon className="ii" size={18}/>
                  </div>
                  <div className="relative">
                    <input type="tel" required className="ai" placeholder="Phone Link" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    <Phone className="ii" size={18}/>
                  </div>
                </div>
              )}

              <div className="relative">
                <input type="email" required className="ai" placeholder="Network Address (Email)" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <Mail className="ii" size={18}/>
              </div>

              {!isLogin && userType === 'employer' && (
                <div className="space-y-4 pt-6 mt-2 border-t border-white/5">
                   <p className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-2 text-center opacity-40 italic">Corporate Log Details</p>
                   <div className="relative"><input type="text" required className="ai" placeholder="Organization Legal Name" onChange={(e) => setFormData({...formData, companyName: e.target.value})} /><Building className="ii" size={18}/></div>
                   <div className="relative"><input type="text" className="ai" placeholder="CAC RC Number" onChange={(e) => setFormData({...formData, rcNumber: e.target.value})} /><ShieldCheck className="ii" size={18}/></div>
                   <div className="relative"><textarea required className="ai h-24 py-4 resize-none" placeholder="HQ Principal Office Address" onChange={(e) => setFormData({...formData, officeAddress: e.target.value})} /><MapPin className="ii top-5" size={18}/></div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Credentials</label>
                  {isLogin && <Link href="/forgot-password" className="text-[10px] text-gold font-black uppercase hover:text-white transition-colors">Forgotten ID?</Link>}
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required className="ai" placeholder="••••••••" 
                    onChange={(e) => {
                      setFormData({...formData, password: e.target.value});
                      if (!isLogin) checkStrength(e.target.value);
                    }} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-white/10 hover:text-gold transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  <Lock className="ii" size={18}/>
                </div>
                {!isLogin && (
                  <div className="flex gap-2 mt-4 px-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-700 ${i < strength ? (strength <= 2 ? 'bg-orange-500' : 'bg-green-500 shadow-[0_0_8px_lime]') : 'bg-white/5'}`} />
                    ))}
                  </div>
                )}
              </div>

              <button disabled={loading} className="w-full mt-8 bg-gradient-to-r from-gold to-gold-lt text-navy py-5 rounded-[22px] font-black text-xs uppercase tracking-[0.4em] shadow-3xl shadow-gold/10 hover:-translate-y-1 active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Engage Interface'}
              </button>
            </form>
          )}

          <div className="mt-12 text-center border-t border-white/5 pt-10">
            <button onClick={() => { setIsLogin(!isLogin); setUserType(null); }} className="text-white/40 text-[10px] font-black tracking-widest uppercase transition-all group">
              {isLogin ? "Unregistered Node?" : "Previously Identified?"} 
              <span className="text-gold font-black ml-4 border border-gold/30 px-3 py-1 rounded-full group-hover:bg-gold group-hover:text-navy transition-all italic">{isLogin ? 'Initiate Registry' : 'Portal Return'}</span>
            </button>
          </div>
        </div>

        <Link href="/" className="flex items-center justify-center gap-3 text-white/10 text-[9px] font-black uppercase tracking-[0.5em] mt-12 hover:text-gold transition-all">
          <ArrowLeft size={10}/> Public Domain Access
        </Link>
      </div>

      <style jsx>{`
        .ai { width: 100%; background: rgba(255,255,255,0.02); border: 1.5px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px 20px 16px 52px; color: white; font-size: 14px; font-weight: 700; outline: none; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .ai:focus { border-color: #c8921e; background: rgba(255,255,255,0.05); shadow: 0 0 40px rgba(200,146,30,0.05); }
        .ai::placeholder { color: rgba(255,255,255,0.08); font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; }
        .ii { position: absolute; left: 18px; top: 18px; color: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}

function PathCard({ ico, title, desc, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full group p-8 bg-white/[0.02] border border-white/10 rounded-[35px] flex items-center justify-between hover:border-gold hover:bg-gold/5 transition-all text-left relative overflow-hidden shadow-sm">
      <div className="flex gap-6 items-center">
        <div className="w-16 h-16 bg-navy text-gold rounded-2xl flex items-center justify-center shadow-xl border border-white/5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">{ico}</div>
        <div>
          <span className="block text-white font-black text-lg leading-none mb-2 uppercase tracking-tight">{title}</span>
          <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">{desc}</span>
        </div>
      </div>
      <ChevronRight className="text-white/10 group-hover:text-gold transition-all" size={24}/>
      <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-gold opacity-0 group-hover:opacity-[0.03] rounded-full blur-2xl"></div>
    </button>
  );
}