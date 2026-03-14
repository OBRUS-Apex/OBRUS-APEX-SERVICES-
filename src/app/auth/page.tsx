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

    const authToast = toast.loading(isLogin ? "Signing you in..." : "Creating your account...");
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

      if (!res.ok) {
        throw new Error(data.message || 'Action failed. Please check your connection.');
      }

      if (isLogin) {
        if (data.user.status === 'pending') {
          toast.error("Account Review: Your account is currently being reviewed by an Administrator.", { id: authToast });
          setLoading(false);
          return;
        }

        toast.success(`Welcome back, ${data.user.name}`, { id: authToast });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => {
          if (data.user.role === 'admin') window.location.href = '/admin/dashboard';
          else if (data.user.userType === 'employer') window.location.href = '/portal/employer';
          else if (data.user.userType === 'service') window.location.href = '/portal/client';
          else window.location.href = '/recruitment';
        }, 1200);

      } else {
        toast.success("Account successfully created!", { id: authToast });
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
    <div className="min-h-screen bg-[#060f1e] flex items-center justify-center p-6 relative overflow-hidden font-sans">
    
      <div className="absolute inset-0 opacity-[0.03] hero-grid"></div>
      <div className="absolute w-[500px] h-[500px] bg-[#c8921e]/10 rounded-full blur-[120px] -top-40 -right-40"></div>

      <div className="relative w-full max-w-[520px]">
        <div className="bg-[#0b1f3a]/95 backdrop-blur-2xl border border-[#c8921e]/20 rounded-[45px] p-12 shadow-3xl">
          
          
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="relative w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl border border-gold/30 p-1 shadow-2xl">
                <img src="/logo.png" alt="O" className="w-full h-full object-contain" />
              </div>
              <div className="text-left leading-none">
                <span className="block font-serif text-white text-2xl font-bold uppercase tracking-tighter italic">OBRUS APEX</span>
                <span className="text-[10px] text-[#e8b84b] uppercase font-bold tracking-[0.2em] opacity-60">Corporate Portal</span>
              </div>
            </div>
            
            <h2 className="font-serif text-4xl text-white font-bold tracking-tight mb-2 uppercase">
              {isLogin ? 'Sign In' : 'Join Our Network'}
            </h2>
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest leading-loose">
              {isLogin ? 'Access your account' : 'Tell us how you would like to proceed'}
            </p>
          </div>

          
          {!isLogin && !userType ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
               <PathCard 
                ico={<Briefcase size={26}/>} 
                title="Job Seeker" 
                desc="Candidate – Looking for Job Vacancies" 
                onClick={() => setUserType('candidate')} 
               />
               <PathCard 
                ico={<Building size={26}/>} 
                title="Employer" 
                desc="Employer – Sourcing Industrial Talent" 
                onClick={() => setUserType('employer')} 
               />
               <PathCard 
                ico={<ClipboardList size={26}/>} 
                title="Client / Service" 
                desc="Requesting Facility or Training Services" 
                onClick={() => setUserType('service')} 
               />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-bottom-8">
              {!isLogin && (
                 <button type="button" onClick={() => setUserType(null)} className="flex items-center gap-2 text-[10px] font-black uppercase text-gold hover:underline tracking-[0.3em] mb-4">
                    <ArrowLeft size={14}/> Back to categories
                 </button>
              )}

             
              {!isLogin && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input type="text" required className="ai" placeholder="Your Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <UserIcon className="ii" size={18}/>
                  </div>
                  <div className="relative">
                    <input type="tel" required className="ai" placeholder="Phone Number" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    <Phone className="ii" size={18}/>
                  </div>
                </div>
              )}

              <div className="relative">
                <input type="email" required className="ai" placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <Mail className="ii" size={18}/>
              </div>

            
              {!isLogin && userType === 'employer' && (
                <div className="space-y-4 pt-6 mt-2 border-t border-white/5">
                   <p className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-2 text-center opacity-40 italic">Business Details</p>
                   <div className="relative"><input type="text" required className="ai" placeholder="Company Name" onChange={(e) => setFormData({...formData, companyName: e.target.value})} /><Building className="ii" size={18}/></div>
                   <div className="relative"><input type="text" className="ai" placeholder="CAC RC Number" onChange={(e) => setFormData({...formData, rcNumber: e.target.value})} /><ShieldCheck className="ii" size={18}/></div>
                   <div className="relative"><textarea required className="ai h-24 py-4 resize-none" placeholder="Official Company Address" onChange={(e) => setFormData({...formData, officeAddress: e.target.value})} /><MapPin className="ii top-5" size={18}/></div>
                </div>
              )}

              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Credentials</label>
                  {isLogin && <Link href="/forgot-password"  className="text-[10px] text-gold font-black uppercase hover:text-white transition-colors">Forgot Password?</Link>}
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required className="ai" placeholder="Enter Password" 
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
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-700 ${i < strength ? (strength <= 2 ? 'bg-orange-500 shadow-[0_0_8px_orange]' : 'bg-green-500 shadow-[0_0_8px_lime]') : 'bg-white/5'}`} />
                    ))}
                  </div>
                )}
              </div>

              <button disabled={loading} className="w-full mt-8 bg-gradient-to-r from-gold to-gold-lt text-navy py-5 rounded-[22px] font-black text-xs uppercase tracking-[0.4em] shadow-3xl shadow-gold/10 hover:-translate-y-1 active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : isLogin ? 'SIGN IN NOW' : 'CREATE ACCOUNT'}
              </button>
            </form>
          )}

          <div className="mt-12 text-center border-t border-white/5 pt-10">
            <button onClick={() => { setIsLogin(!isLogin); setUserType(null); }} className="text-white/40 text-[10px] font-bold tracking-widest uppercase transition-all group">
              {isLogin ? "No account yet?" : "Already a member?"} 
              <span className="text-gold font-black ml-4 border border-gold/30 px-3 py-1 rounded-full group-hover:bg-gold group-hover:text-navy transition-all italic">{isLogin ? 'Sign Up' : 'Log In'}</span>
            </button>
          </div>
        </div>

        <Link href="/" className="flex items-center justify-center gap-3 text-white/10 text-[9px] font-black uppercase tracking-[0.5em] mt-12 hover:text-gold transition-all">
          <ArrowLeft size={10}/> Back to Main Website
        </Link>
      </div>

      <style jsx>{`
        .ai { width: 100%; background: rgba(255,255,255,0.02); border: 1.5px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px 20px 16px 52px; color: white; font-size: 14px; font-weight: 700; outline: none; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .ai:focus { border-color: #c8921e; background: rgba(255,255,255,0.05); }
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