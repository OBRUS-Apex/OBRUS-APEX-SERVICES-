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

    const authToast = toast.loading(isLogin ? 'Signing you in...' : 'Setting up account...');
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
          } : undefined 
        };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Access Denied');

      if (isLogin) {
        if (data.user.status === 'pending') {
          toast.error('Account under review. Please wait for activation.', { id: authToast, duration: 6000 });
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
          else if (type === 'service') window.location.href = '/client/portal';
          else window.location.href = '/recruitment';
        }, 1000);
      } else {
        toast.success('Account registered successfully!', { id: authToast });
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
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-blue-50 flex items-center justify-center p-6 font-sans">
      <div className="relative w-full max-w-[500px]">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-[#1a2e46] text-sm mb-6 transition-all group font-bold w-fit uppercase tracking-widest">
          <ArrowLeft size={16} /> Home
        </Link>

        <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-4 mb-6">
              <img src="/logo.png" alt="OBRUS" className="h-10 w-auto object-contain" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-10 h-10 bg-[#257242] rounded-xl flex items-center justify-center text-white font-bold italic shadow-md text-xl">O</div>';
                }} 
              />
              <div className="text-left border-l border-gray-200 pl-4 text-[#1a2e46] font-serif font-black text-2xl leading-none">
                 OBRUS APEX
              </div>
            </div>
            
            <h2 className="text-3xl font-extrabold text-[#1a2e46] tracking-tighter">
              {isLogin ? 'Secure Sign In' : 'Join Our Network'}
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-1">
              {isLogin ? 'Enter your account details' : 'Choose how you want to partner with us'}
            </p>
          </div>

          {!isLogin && !userType ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
               <PathCard ico={<Briefcase size={22}/>} title="Candidate" desc="I want to apply for jobs" onClick={() => setUserType('candidate')} />
               <PathCard ico={<Building size={22}/>} title="Employer" desc="I want to hire skilled staff" onClick={() => setUserType('employer')} />
               <PathCard ico={<ClipboardList size={22}/>} title="Service Client" desc="I need facility or safety services" onClick={() => setUserType('service')} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-bottom-8">
              {!isLogin && (
                <button type="button" onClick={() => setUserType(null)} className="text-[10px] font-black uppercase text-[#257242] flex items-center gap-2 mb-4 tracking-widest underline decoration-[#257242]/20">
                  <ArrowLeft size={14}/> Back to paths
                </button>
              )}

              {!isLogin && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative"><input required className="input-field" placeholder="Legal Name" onChange={(e) => setFormData({...formData, name: e.target.value})} /><UserIcon className="input-icon" size={18}/></div>
                  <div className="relative"><input required className="input-field" placeholder="Phone Link" onChange={(e) => setFormData({...formData, phone: e.target.value})} /><Phone className="input-icon" size={18}/></div>
                </div>
              )}

              <div className="relative"><input required type="email" className="input-field" placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} /><Mail className="input-icon" size={18}/></div>

              {!isLogin && userType === 'employer' && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <p className="text-[10px] font-black text-gray-300 text-center uppercase tracking-widest italic">Corporate Profile</p>
                  <div className="relative"><input required className="input-field" placeholder="Company Name" onChange={(e) => setFormData({...formData, companyName: e.target.value})} /><Building className="input-icon" size={18}/></div>
                  <div className="relative"><input required className="input-field" placeholder="CAC RC Number" onChange={(e) => setFormData({...formData, rcNumber: e.target.value})} /><ShieldCheck className="input-icon" size={18}/></div>
                  <div className="relative"><textarea required className="input-field h-24 py-4 resize-none" placeholder="Head Office Address" onChange={(e) => setFormData({...formData, officeAddress: e.target.value})} /><MapPin className="input-icon top-5" size={18}/></div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secured Key</label>
                  {isLogin && <Link href="/forgot-password" className="text-[10px] text-[#257242] font-black uppercase hover:text-[#1a2e46] transition-all">Recover Password?</Link>}
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required className="input-field" placeholder="••••••••" 
                    onChange={(e) => {
                      setFormData({...formData, password: e.target.value});
                      if (!isLogin) checkStrength(e.target.value);
                    }} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-300 hover:text-[#257242]">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <Lock className="input-icon" size={18}/>
                </div>
              </div>

              <button disabled={loading} className="w-full mt-6 bg-[#1a2e46] text-white py-4.5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-[#257242] transition-all flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" size={18} /> : isLogin ? 'Launch Dashboard' : 'Initiate Partnership'}
              </button>
            </form>
          )}

          <div className="mt-12 text-center border-t border-gray-50 pt-10">
            <button onClick={() => { setIsLogin(!isLogin); setUserType(null); }} className="text-gray-400 text-[10px] font-bold tracking-widest uppercase transition-all">
              {isLogin ? "No access node yet?" : "Have an authorized login?"} 
              <span className="text-[#257242] font-black ml-4 bg-green-50 px-4 py-2 rounded-full border border-green-100 italic transition-all hover:bg-[#257242] hover:text-white">
                {isLogin ? 'Sign Up' : 'Log In'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-field { 
          width: 100%; background: #fdfdfd; border: 1.5px solid #efefef; border-radius: 18px; padding: 16px 20px 16px 52px; 
          color: #1a2e46; font-size: 14px; font-weight: 700; outline: none; transition: 0.3s; 
        }
        .input-field:focus { border-color: #257242; box-shadow: 0 0 30px rgba(37, 114, 66, 0.04); }
        .input-field::placeholder { color: #d1d1d1; text-transform: uppercase; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; }
        .input-icon { position: absolute; left: 18px; top: 18px; color: #e5e5e5; }
      `}</style>
    </div>
  );
}

function PathCard({ ico, title, desc, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full group p-8 bg-[#fdfdfd] border border-gray-100 rounded-[35px] flex items-center justify-between hover:border-[#257242] transition-all text-left">
      <div className="flex gap-6 items-center">
        <div className="w-16 h-16 bg-[#1a2e46] text-white rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:bg-[#257242]">{ico}</div>
        <div>
          <span className="block text-[#1a2e46] font-black text-xl uppercase tracking-tighter leading-none mb-1.5 italic">{title}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{desc}</span>
        </div>
      </div>
      <ChevronRight className="text-gray-200 group-hover:text-[#257242] transition-all" size={24}/>
    </button>
  );
}