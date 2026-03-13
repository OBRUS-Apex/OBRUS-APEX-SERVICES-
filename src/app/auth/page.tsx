"use client";
import React, { useState } from 'react';
import { 
  Eye, EyeOff, Lock, Mail, User as UserIcon, 
  Briefcase, Building, ChevronRight, ArrowLeft, 
  Loader2, MapPin, Phone, Globe, ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<null | 'candidate' | 'employer'>(null);
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

    const authToast = toast.loading(isLogin ? "Authenticating node..." : "Registering identity...");
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
        throw new Error("System configuration error. Connection failed.");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Action failed');

      if (isLogin) {
        if (data.user.status === 'pending') {
          toast.error("Account Pending Approval: Our Admin is vetting your corporate profile.", { id: authToast });
          setLoading(false);
          return;
        }

        toast.success(`Access Granted: Welcome, ${data.user.name}`, { id: authToast });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => {
          if (data.user.role === 'admin') window.location.href = '/admin/dashboard';
          else if (data.user.userType === 'employer') window.location.href = '/portal/employer';
          else window.location.href = '/recruitment';
        }, 1200);

      } else {
        toast.success(data.message, { id: authToast, duration: 6000 });
        setIsLogin(true);
        setUserType(null);
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

      <div className="relative w-full max-w-[480px]">
        <div className="bg-[#0b1f3a]/90 backdrop-blur-2xl border border-[#c8921e]/20 rounded-[40px] p-10 shadow-3xl">
          
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="relative w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl border border-gold/20 p-1">
                <img src="/logo.png" alt="O" className="w-full h-full object-contain" />
              </div>
              <div className="text-left leading-none">
                <span className="block font-serif text-white text-xl font-bold tracking-tight uppercase">OBRUS</span>
                <span className="text-[10px] text-[#e8b84b] uppercase tracking-[0.2em] font-bold">Apex Center</span>
              </div>
            </div>
            <h2 className="font-serif text-3xl text-white font-bold tracking-tight italic">
              {isLogin ? 'Executive Portal' : 'Identity Setup'}
            </h2>
          </div>

          {!isLogin && !userType ? (
            <div className="space-y-4 animate-in fade-in zoom-in duration-500">
               <button onClick={() => setUserType('candidate')} className="w-full group p-6 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-between hover:border-gold hover:bg-gold/5 transition-all text-left">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center text-gold group-hover:scale-110 transition-transform"><Briefcase size={24}/></div>
                    <div>
                       <span className="block text-white font-bold text-lg leading-none mb-1 uppercase">Candidate</span>
                       <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Looking for job vacancies</span>
                    </div>
                  </div>
                  <ChevronRight className="text-white/20 group-hover:text-gold" />
               </button>

               <button onClick={() => setUserType('employer')} className="w-full group p-6 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-between hover:border-gold hover:bg-gold/5 transition-all text-left">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center text-gold group-hover:scale-110 transition-transform"><Building size={24}/></div>
                    <div>
                       <span className="block text-white font-bold text-lg leading-none mb-1 uppercase">Employer</span>
                       <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Sourcing industrial talent</span>
                    </div>
                  </div>
                  <ChevronRight className="text-white/20 group-hover:text-gold" />
               </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              {!isLogin && (
                 <button type="button" onClick={() => setUserType(null)} className="flex items-center gap-2 text-[10px] font-black uppercase text-gold hover:underline mb-4 tracking-widest">
                    <ArrowLeft size={14}/> Back to selection
                 </button>
              )}

              {!isLogin && (
                <div className="space-y-4">
                  <div className="relative">
                    <input type="text" required className="auth-input" placeholder="Legal Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <UserIcon className="input-ico" size={18}/>
                  </div>
                  <div className="relative">
                    <input type="tel" required className="auth-input" placeholder="Active Phone Line" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    <Phone className="input-ico" size={18}/>
                  </div>
                </div>
              )}

              <div className="relative">
                <input type="email" required className="auth-input" placeholder="Digital Address (Email)" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <Mail className="input-ico" size={18}/>
              </div>

              {!isLogin && userType === 'employer' && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                   <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-2 text-center">Corporate Registry</p>
                   <div className="relative">
                      <input type="text" required className="auth-input" placeholder="Company Name" onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                      <Building className="input-ico" size={18}/>
                   </div>
                   <div className="relative">
                      <input type="text" className="auth-input" placeholder="Business RC Number" onChange={(e) => setFormData({...formData, rcNumber: e.target.value})} />
                      <ShieldCheck className="input-ico" size={18}/>
                   </div>
                   <div className="relative">
                      <input type="text" className="auth-input" placeholder="Industry Sector" onChange={(e) => setFormData({...formData, industry: e.target.value})} />
                      <Globe className="input-ico" size={18}/>
                   </div>
                   <div className="relative">
                      <textarea required className="auth-input h-24 py-3" placeholder="Principal Office Address" onChange={(e) => setFormData({...formData, officeAddress: e.target.value})} />
                      <MapPin className="input-ico top-4" size={18}/>
                   </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Secret Credentials</label>
                  {isLogin && (
                    <Link href="/forgot-password" size="sm" className="text-[10px] text-[#c8921e] font-black uppercase tracking-widest hover:text-[#e8b84b]">Rescue?</Link>
                  )}
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required className="auth-input" placeholder="••••••••" 
                    onChange={(e) => {
                      setFormData({...formData, password: e.target.value});
                      if (!isLogin) checkStrength(e.target.value);
                    }} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-white/10 hover:text-gold transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <Lock className="input-ico" size={18}/>
                </div>
                {!isLogin && (
                  <div className="flex gap-1.5 mt-3 px-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-700 ${i < strength ? (strength <= 2 ? 'bg-orange-500 shadow-[0_0_8px_orange]' : 'bg-green-500 shadow-[0_0_8px_lime]') : 'bg-white/5'}`} />
                    ))}
                  </div>
                )}
              </div>

              <button disabled={loading} className="w-full mt-6 bg-gradient-to-r from-[#c8921e] to-[#e8b84b] text-[#060f1e] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-3xl shadow-gold/20 hover:-translate-y-1 active:scale-95 transition-all">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : isLogin ? 'Open Access' : 'Register Pipeline'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <button onClick={() => { setIsLogin(!isLogin); setUserType(null); }} className="text-white/40 text-[11px] font-bold tracking-widest uppercase transition-all group">
              {isLogin ? "Generate Access ID?" : "Identified Node?"} 
              <span className="text-[#c8921e] font-black ml-2 group-hover:text-gold">{isLogin ? 'Establish Account' : 'Verify Portal'}</span>
            </button>
          </div>
        </div>

        <Link href="/" className="flex items-center justify-center gap-2 text-white/10 text-[9px] font-black uppercase tracking-[0.4em] mt-10 hover:text-gold transition-colors italic">
          ← back to homepage
        </Link>
      </div>

      <style jsx>{`
        .auth-input {
          width: 100%; background: rgba(255,255,255,0.03); border: 1.5px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 14px 20px 14px 48px;
          color: white; font-size: 14px; font-weight: 500; outline: none; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .auth-input:focus { border-color: #c8921e; background: rgba(255,255,255,0.06); box-shadow: 0 0 25px rgba(200,146,30,0.1); }
        .auth-input::placeholder { color: rgba(255,255,255,0.1); font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; }
        .input-ico { position: absolute; left: 16px; top: 14px; color: rgba(255,255,255,0.08); }
      `}</style>
    </div>
  );
}