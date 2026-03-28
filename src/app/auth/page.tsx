"use client";
import React, { useState } from 'react';
import { 
  Eye, EyeOff, Lock, Mail, User as UserIcon, 
  Briefcase, Building, ChevronRight, ArrowLeft, 
  Loader2, MapPin, Phone, ShieldCheck, ClipboardList,
  Target, Zap, Shield
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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

    const authToast = toast.loading(isLogin ? 'Authenticating Credentials...' : 'Establishing Partner Account...');
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
      if (!res.ok) throw new Error(data.message || 'Access Denied');

      if (isLogin) {
        if (data.user.status === 'pending') {
          toast.error('Account Under Audit: Our administrators are verifying your credentials.', { id: authToast, duration: 6000 });
          setLoading(false);
          return;
        }

        toast.success(`Welcome to the Hub`, { id: authToast });
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
        toast.success('Registration successfully logged.', { id: authToast });
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
    <div className="min-h-screen bg-[#1a2e46] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      
    
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#257242 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#257242]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#c8921e]/10 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-[550px] z-10">
        
        <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#c8921e] text-[10px] font-black uppercase tracking-[0.3em] mb-8 transition-all group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Command Center
        </Link>

        <div className="bg-white/95 backdrop-blur-xl rounded-[50px] p-10 md:p-14 shadow-3xl border border-white/20 relative overflow-hidden">
          
          
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#1a2e46] rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                <img src="/logo.png" alt="O" className="w-8 h-8 object-contain -rotate-3" />
              </div>
              <div className="text-left">
                 <h1 className="text-[#1a2e46] font-serif font-black text-2xl leading-none italic tracking-tighter">OBRUS APEX</h1>
                 <p className="text-[#257242] text-[9px] font-black uppercase tracking-[0.3em] mt-1">Secure Gateway</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-black text-[#1a2e46] tracking-tighter uppercase italic leading-none">
              {isLogin ? 'Initialize' : 'Partner'} <br /> <span className="text-[#257242]">Access.</span>
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {!isLogin && !userType ? (
              <motion.div 
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                 <p className="text-[#1a2e46]/30 text-[10px] font-black text-center uppercase tracking-[0.4em] mb-6">Select Identity Path</p>
                 <IdentityCard ico={<Target size={22}/>} title="Candidate" desc="I am seeking industrial vacancies" onClick={() => setUserType('candidate')} />
                 <IdentityCard ico={<Zap size={22}/>} title="Employer" desc="I need to hire or outsource talent" onClick={() => setUserType('employer')} />
                 <IdentityCard ico={<Shield size={22}/>} title="Service Client" desc="I require facility or safety audits" onClick={() => setUserType('service')} />
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-5"
              >
                {!isLogin && (
                  <button type="button" onClick={() => setUserType(null)} className="text-[10px] font-black uppercase text-[#257242] hover:text-[#1a2e46] transition-colors flex items-center gap-2 mb-6 tracking-widest">
                    <ArrowLeft size={14}/> Re-select Path
                  </button>
                )}

                <div className="space-y-4">
                  {!isLogin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <input required className="apex-input" placeholder="Full Legal Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        <UserIcon className="apex-icon" size={18}/>
                      </div>
                      <div className="relative">
                        <input required className="apex-input" placeholder="Mobile Link" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        <Phone className="apex-icon" size={18}/>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <input required type="email" className="apex-input" placeholder="Official Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <Mail className="apex-icon" size={18}/>
                  </div>

                  {!isLogin && userType === 'employer' && (
                    <div className="space-y-4 pt-6 border-t border-gray-100">
                      <p className="text-[10px] font-black text-gray-300 text-center uppercase tracking-[0.4em] italic mb-2">Corporate Audit Data</p>
                      <div className="relative"><input required className="apex-input" placeholder="Company Name" onChange={(e) => setFormData({...formData, companyName: e.target.value})} /><Building className="apex-icon" size={18}/></div>
                      <div className="relative"><input required className="apex-input" placeholder="CAC RC Number" onChange={(e) => setFormData({...formData, rcNumber: e.target.value})} /><ShieldCheck className="apex-icon" size={18}/></div>
                      <div className="relative"><textarea required className="apex-input h-24 py-4 resize-none" placeholder="Physical HQ Address" onChange={(e) => setFormData({...formData, officeAddress: e.target.value})} /><MapPin className="apex-icon top-5" size={18}/></div>
                    </div>
                  )}

                  <div className="relative">
                    <div className="flex justify-between items-center mb-1 px-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Security Key</label>
                      {isLogin && <Link href="/forgot-password"  className="text-[9px] text-[#257242] font-black uppercase hover:text-[#1a2e46] transition-all">forgot password ?</Link>}
                    </div>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} required className="apex-input" placeholder="••••••••" 
                        onChange={(e) => {
                          setFormData({...formData, password: e.target.value});
                          if (!isLogin) checkStrength(e.target.value);
                        }} 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-300 hover:text-[#257242] transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <Lock className="apex-icon" size={18}/>
                    </div>
                  </div>
                </div>

                <button disabled={loading} className="w-full mt-8 bg-[#1a2e46] text-[#c8921e] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-[#257242] hover:text-white transform active:scale-[0.98] transition-all flex items-center justify-center gap-4">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : isLogin ? 'Authorize Access' : 'Initiate Partnership'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-12 text-center border-t border-gray-50 pt-10">
            <button onClick={() => { setIsLogin(!isLogin); setUserType(null); }} className="text-gray-400 text-[10px] font-bold tracking-widest uppercase transition-all hover:text-[#1a2e46]">
              {isLogin ? "New to the network?" : "Existing authorized member?"} 
              <span className="text-[#257242] font-black ml-4 bg-[#fcfbf9] px-5 py-2 rounded-full border border-gray-100 hover:bg-[#257242] hover:text-white transition-all italic shadow-inner">
                {isLogin ? 'Register Hub' : 'Login Hub'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .apex-input { 
          width: 100%; background: #fcfbf9; border: 2px solid #f3f4f6; border-radius: 20px; padding: 18px 20px 18px 56px; 
          color: #1a2e46; font-size: 14px; font-weight: 700; outline: none; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .apex-input:focus { border-color: #257242; background: white; box-shadow: 0 15px 40px rgba(37, 114, 66, 0.08); }
        .apex-input::placeholder { color: #d1d5db; text-transform: uppercase; font-size: 11px; font-weight: 800; letter-spacing: 0.15em; }
        .apex-icon { position: absolute; left: 20px; top: 18px; color: #d1d5db; transition: color 0.3s; }
        .apex-input:focus + .apex-icon { color: #257242; }
      `}</style>
    </div>
  );
}

function IdentityCard({ ico, title, desc, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full group p-8 bg-[#fcfbf9] border-2 border-gray-50 rounded-[35px] flex items-center justify-between hover:border-[#257242] hover:shadow-2xl transition-all text-left relative overflow-hidden">
      <div className="flex gap-6 items-center">
        <div className="w-16 h-16 bg-[#1a2e46] text-[#c8921e] rounded-2xl flex items-center justify-center shadow-xl group-hover:bg-[#257242] group-hover:text-white transition-all duration-500 group-hover:rotate-12">{ico}</div>
        <div>
          <span className="block text-[#1a2e46] font-black text-xl uppercase tracking-tighter leading-none mb-2 italic">{title}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">{desc}</span>
        </div>
      </div>
      <ChevronRight className="text-gray-200 group-hover:text-[#257242] transition-all" size={24}/>
    </button>
  );
}