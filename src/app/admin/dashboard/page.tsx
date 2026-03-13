"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, ShieldCheck, LayoutDashboard, LogOut, 
  Globe, Loader2, Mail, Phone, Calendar, 
  ShieldAlert, TrendingUp, Search, Bell, Briefcase, Trash2,
  MoreVertical, Check, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, staffCount: 0, hseCount: 0, adminCount: 0 });
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    const verifyAccess = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        router.push('/auth');
        return;
      }

      const user = JSON.parse(storedUser);

      if (user.role !== 'admin') {
        toast.error("Access Restricted: Admin Authority Required");
        router.push('/portal/client');
        return;
      }

      setIsAuthorized(true);
      fetchRealData();
    };

    verifyAccess();
  }, []);

  const fetchRealData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      };

      const [sRes, uRes, eRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/hse', { headers })
      ]);

      if (sRes.status === 401) {
        localStorage.clear();
        router.push('/auth');
        return;
      }

      if (!sRes.ok || !uRes.ok || !eRes.ok) throw new Error("Synchronization Failure");

      setStats(await sRes.json());
      setUsers(await uRes.json());
      setEnquiries(await eRes.json());
    } catch (err: any) {
      toast.error("Internal connection error. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, userName: string, newRole: string) => {
    const load = toast.loading(`Upgrading security tier for ${userName}...`);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      });
      if (res.ok) {
        toast.success(`${userName} promoted to ${newRole}. System Email Sent.`, { id: load });
        fetchRealData(); 
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Tier adjustment failed", { id: load });
    }
  };

  if (!isAuthorized || loading) {
    return (
      <div className="min-h-screen bg-[#060f1e] flex flex-col items-center justify-center font-sans">
        <div className="w-16 h-16 border-t-4 border-gold border-r-4 border-r-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-white font-bold tracking-[0.4em] uppercase text-[10px]">Authorizing OBRUS Control Systems...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f0ede6] text-[#0b1f3a] font-sans">
      
      <aside className="w-[260px] bg-[#060f1e] border-r border-gold/10 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-lt rounded-xl flex items-center justify-center font-serif text-white font-bold text-2xl">O</div>
          <div className="leading-none">
            <span className="block text-white font-serif font-bold text-lg leading-tight tracking-tight uppercase">OBRUS</span>
            <span className="text-gold-lt text-[9px] uppercase tracking-[0.2em] font-bold">Admin Control</span>
          </div>
        </div>

        <nav className="mt-8 px-4 flex-1">
          <div className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em] px-4 mb-6">Operations Hub</div>
          <div className="space-y-1">
            <NavButton active={view === 'dashboard'} onClick={() => setView('dashboard')} ico={<LayoutDashboard size={18}/>} label="Executive Summary" />
            <NavButton active={view === 'users'} onClick={() => setView('users')} ico={<Users size={18}/>} label="Workforce Registry" />
            <NavButton active={view === 'hse'} onClick={() => setView('hse')} ico={<ShieldCheck size={18}/>} label="Safety Pipeline" />
            <NavButton active={false} onClick={() => {}} ico={<Briefcase size={18}/>} label="Recruitment Logs" />
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 bg-[#040a14]">
          <button onClick={() => { localStorage.clear(); router.push('/auth'); }} className="flex items-center gap-4 text-red-400/40 hover:text-red-400 transition-all font-black text-[11px] uppercase tracking-widest">
            <LogOut size={16}/> Terminate Link
          </button>
        </div>
      </aside>

      <main className="ml-[260px] flex-1 min-h-screen flex flex-col h-screen overflow-hidden">
        <header className="h-[75px] bg-white border-b border-[#0b1f3a]/10 flex items-center justify-between px-12 sticky top-0 z-40 shadow-sm flex-shrink-0">
           <div className="flex items-center gap-8">
              <h2 className="font-serif text-2xl font-black uppercase italic tracking-tighter decoration-gold underline-offset-8">
                {view === 'dashboard' ? 'Analytical Intelligence' : view === 'users' ? 'Identity Authorization' : 'Industrial Service Lead'}
              </h2>
              <div className="hidden lg:flex bg-[#f0ede6] px-4 py-2 rounded-full border text-[10px] font-bold text-slate-500 uppercase tracking-widest items-center gap-2">
                 <Calendar size={12}/> {new Date().toDateString()}
              </div>
           </div>
           
           <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 group cursor-pointer border px-4 py-1.5 rounded-xl border-gold/20 hover:bg-gold/5 transition-all">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                <span className="text-[10px] font-bold text-navy uppercase tracking-widest">System Online</span>
              </div>
              <Globe className="text-navy/30 cursor-pointer hover:text-gold transition-colors" onClick={() => window.location.href='/'}/>
           </div>
        </header>

        <div className="p-12 overflow-y-auto flex-1 custom-scrollbar">
          
          {view === 'dashboard' && (
             <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                  <KPI val={stats.totalUsers} label="Registered Members" ico={<Users size={22}/>} theme="gold" />
                  <KPI val={stats.hseCount} label="Field Enquiries" ico={<ShieldCheck size={22}/>} theme="navy" />
                  <KPI val={stats.staffCount} label="Assigned Staff" ico={<Shield size={22}/>} theme="green" />
                  <KPI val="STABLE" label="Infrastructure" ico={<ShieldAlert size={22}/>} theme="navy" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 bg-white rounded-[50px] p-16 shadow-2xl border border-navy/5 relative overflow-hidden group">
                      <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-gold/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
                      <h3 className="font-serif text-3xl font-bold italic mb-6">Operations Outlook</h3>
                      <p className="text-xl text-slate-400 font-light leading-relaxed max-w-2xl mb-12">The unified database is operating at optimal latency. Current metrics indicate a surge in <b>Industrial HSE Training</b> leads and manpower registration from the Rivers State region.</p>
                      <div className="flex gap-4">
                         <div className="px-10 py-4 bg-[#0b1f3a] text-white rounded-full font-bold text-[11px] uppercase tracking-widest shadow-2xl">Manual Audit Ready</div>
                      </div>
                   </div>
                   <div className="bg-[#0b1f3a] rounded-[50px] p-12 text-white shadow-3xl flex flex-col justify-center border-t-8 border-gold">
                      <TrendingUp className="text-gold/20 mb-10" size={60}/>
                      <h4 className="font-serif text-2xl font-bold italic mb-4">Master Security</h4>
                      <p className="text-white/40 text-sm mb-10 leading-relaxed font-medium">Internal protocols require bi-weekly authority resets. Identity pools are vetted using automated encryption standards.</p>
                      <div className="h-[2px] w-12 bg-gold/30"></div>
                   </div>
                </div>
             </div>
          )}

          {view === 'users' && (
            <div className="bg-white rounded-[45px] shadow-2xl overflow-hidden border border-[#0b1f3a]/5 animate-in slide-in-from-left-6 duration-700 max-w-[1300px] mx-auto">
               <div className="p-10 border-b border-[#f0ede6] bg-[#fcfbf9] flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <div className="w-1 h-12 bg-gold"></div>
                    <div><h3 className="font-serif text-3xl font-black uppercase italic tracking-tighter">Authority Registry</h3><p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Management of workforce access credentials</p></div>
                  </div>
                  <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/><input className="bg-white border rounded-full px-12 py-3 text-sm font-medium w-80 outline-none focus:border-gold transition-all" placeholder="Identity filter..."/></div>
               </div>
               <table className="w-full text-left">
                  <thead className="bg-[#060f1e] text-gold-lt uppercase italic">
                     <tr>
                        <th className="p-8 text-[11px] font-black tracking-[0.3em]">Full Operator Name</th>
                        <th className="p-8 text-[11px] font-black tracking-[0.3em]">Registered Mail</th>
                        <th className="p-8 text-[11px] font-black tracking-[0.3em]">Credentials</th>
                        <th className="p-8 text-[11px] font-black tracking-[0.3em]">Master Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede6]">
                     {users.map((u: any) => (
                        <tr key={u._id} className="hover:bg-gold/[0.03] transition-all">
                           <td className="p-8 flex items-center gap-5">
                              <div className="w-12 h-12 bg-navy text-gold rounded-full flex items-center justify-center font-bold text-xl italic shadow-inner uppercase border border-gold/10">{u.name.charAt(0)}</div>
                              <span className="font-serif font-black text-lg text-navy uppercase">{u.name}</span>
                           </td>
                           <td className="p-8 text-xs font-bold text-slate-400 font-mono tracking-tighter italic uppercase">{u.email}</td>
                           <td className="p-8 text-center">
                              <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm inline-block border ${u.role === 'admin' ? 'bg-[#0b1f3a] text-gold-lt border-gold/20' : u.role === 'staff' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                 {u.role}
                              </div>
                           </td>
                           <td className="p-8 text-right">
                              {u.role === 'client' ? (
                                 <button onClick={() => handleUpdateRole(u._id, u.name, 'staff')} className="bg-[#c8921e] text-[#060f1e] px-8 py-3 rounded-full text-[10px] font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">Verify <Check size={14}/></button>
                              ) : u.role === 'staff' ? (
                                 <button onClick={() => handleUpdateRole(u._id, u.name, 'client')} className="bg-red-50 text-red-500 border border-red-100 px-8 py-3 rounded-full text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Revoke Profile</button>
                              ) : <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest pr-4 select-none">Access Owner</span>}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          )}

          {view === 'hse' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in zoom-in-95 duration-1000 max-w-[1300px] mx-auto">
               {enquiries.length === 0 ? (
                  <div className="col-span-full py-40 text-center text-slate-400 font-bold uppercase text-xs italic tracking-[0.5em]">Waiting for Lead Transmission...</div>
               ) : (
                enquiries.map((e: any) => (
                  <div key={e._id} className="bg-white p-14 rounded-[70px] border-b-[12px] border-gold shadow-3xl relative overflow-hidden transition-all hover:-translate-y-2 group">
                     <ShieldCheck size={180} className="absolute bottom-[-40px] right-[-20px] text-navy/[0.03] group-hover:scale-125 transition-transform duration-1000"/>
                     <div className="flex justify-between items-start mb-10">
                        <span className="text-[10px] font-black bg-navy text-white px-5 py-2 rounded-full uppercase tracking-widest italic">{e.service}</span>
                        <div className="flex gap-2 text-slate-200"><Phone size={18} /><Mail size={18} /></div>
                     </div>
                     <h3 className="font-serif text-5xl font-black tracking-tight text-navy italic mb-4 uppercase leading-none">{e.organisation || 'N/A Provider'}</h3>
                     <p className="text-[11px] font-black text-gold uppercase tracking-[0.3em] mb-12 italic border-l-2 border-gold/30 pl-5">Lead Timestamp: {new Date(e.createdAt).toDateString()}</p>
                     
                     <div className="space-y-3 mb-12">
                        <div className="text-lg font-medium flex items-center gap-4 text-navy/60"><Check size={20} className="text-gold"/> <span className="underline decoration-gold/10 font-bold text-navy">{e.name}</span></div>
                        <div className="text-base font-bold flex items-center gap-4 text-navy/60"><Mail size={18} className="text-gold"/> {e.email}</div>
                     </div>
                     <div className="flex gap-4">
                       <a href={`mailto:${e.email}`} className="flex-1 py-5 bg-[#0b1f3a] text-white text-center rounded-[30px] font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-gold transition-all duration-300">Respond to Operator</a>
                     </div>
                  </div>
                ))
               )}
             </div>
          )}

        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0b1f3a20; border-radius: 20px; }
      `}</style>
    </div>
  );
}

function NavButton({ active, onClick, ico, label }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full text-left p-5 rounded-[22px] flex items-center gap-4 text-[14px] font-black uppercase tracking-widest transition-all duration-500 italic
      ${active ? 'bg-gold/15 text-[#e8b84b] border-l-[8px] border-gold shadow-[0_15px_40px_rgba(0,0,0,0.3)] translate-x-3 scale-105' : 'text-white/20 hover:text-gold hover:bg-white/5'}`}
    >
      {ico} {label}
    </button>
  );
}

function KPI({ val, label, ico, theme }: any) {
  return (
    <div className={`bg-white p-10 rounded-[50px] shadow-2xl border border-navy/5 relative overflow-hidden transition-transform hover:scale-105 group ${theme === 'gold' ? 'border-b-4 border-gold' : ''}`}>
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl ${theme === 'gold' ? 'bg-[#0b1f3a] text-gold' : 'bg-navy/5 text-navy group-hover:bg-navy group-hover:text-white transition-all duration-700'}`}>
          {ico}
       </div>
       <div className="text-4xl font-serif font-black tracking-tighter text-navy mb-1 leading-none">{val}</div>
       <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">{label}</p>
    </div>
  );
}