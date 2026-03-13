"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, ShieldCheck, LayoutDashboard, LogOut, 
  Globe, Loader2, Mail, Phone, Calendar, 
  ShieldAlert, TrendingUp, Search, Bell, Briefcase, Trash2
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
        toast.error("Restricted Area: Executive Credentials Required");
        router.push('/portal/client');
        return;
      }

      setIsAuthorized(true);
      fetchAllData();
    };

    verifyAccess();
  }, []);

  const fetchAllData = async () => {
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

      if (!sRes.ok || !uRes.ok || !eRes.ok) {
        throw new Error("System is currently unresponsive.");
      }

      setStats(await sRes.json());
      setUsers(await uRes.json());
      setEnquiries(await eRes.json());
    } catch (err: any) {
      toast.error(err.message || "Operations Synchronization Error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, userName: string, newRole: string) => {
    const load = toast.loading(`Modifying ${userName} level...`);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      });
      if (res.ok) {
        toast.success(`User updated to ${newRole}`, { id: load });
        fetchAllData(); 
      }
    } catch (err) {
      toast.error("Internal Security Override Failed", { id: load });
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Permanently archive this entry?")) return;
    try {
      const res = await fetch('/api/admin/hse', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        toast.success("Entry removed from registry");
        fetchAllData();
      }
    } catch (err) {
      toast.error("Record cleanup error");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#060f1e] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white font-bold tracking-[0.4em] uppercase text-[9px]">Initializing OBRUS Management Hub</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f0ede6] text-[#0b1f3a] overflow-hidden">
      
      <aside className="w-[260px] bg-[#060f1e] border-r border-gold/10 flex flex-col fixed inset-y-0 z-50 shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gold rounded flex items-center justify-center font-bold text-navy text-xl uppercase shadow-xl">O</div>
            <div>
              <span className="block text-white font-serif font-bold text-lg uppercase leading-none">OBRUS</span>
              <span className="text-gold-lt text-[9px] uppercase tracking-[0.2em] font-bold">Apex Center</span>
            </div>
          </div>
        </div>

        <nav className="p-6 space-y-1.5 flex-1 overflow-y-auto">
          <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em] mb-8 mt-4 ml-2">Executive Navigation</p>
          <button onClick={() => setView('dashboard')} className={`nav-link ${view === 'dashboard' ? 'active' : ''}`}><LayoutDashboard size={18}/> Central Dashboard</button>
          <button onClick={() => setView('users')} className={`nav-link ${view === 'users' ? 'active' : ''}`}><Users size={18}/> Workforce Access</button>
          <button onClick={() => setView('hse')} className={`nav-link ${view === 'hse' ? 'active' : ''}`}><ShieldCheck size={18}/> Service Inquiries</button>
        </nav>

        <div className="p-6 bg-[#040a14] border-t border-white/5">
           <button onClick={() => { localStorage.clear(); router.push('/auth'); }} className="flex items-center gap-4 text-red-400/50 hover:text-red-400 font-bold text-[11px] transition-colors uppercase tracking-widest">
              <LogOut size={16}/> Revoke Authorization
           </button>
        </div>
      </aside>

      <main className="ml-[260px] flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar">
        <header className="h-[75px] bg-white border-b flex items-center justify-between px-12 sticky top-0 z-40 shadow-sm">
           <h2 className="font-serif text-2xl font-black uppercase tracking-tighter italic border-b-2 border-gold pb-1">
            {view === 'dashboard' ? 'Operations Overview' : view === 'users' ? 'Personnel Registry' : 'Active Leads'}
           </h2>
           <div className="flex items-center gap-8 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2 pr-4 border-r border-navy/5 leading-none"><Calendar size={13}/> {new Date().toLocaleDateString('en-GB')}</div>
              <div className="flex gap-4">
                <Globe className="cursor-pointer hover:text-gold transition-all" size={20} onClick={() => window.location.href='/'}/>
                <Bell className="cursor-pointer hover:text-gold transition-all" size={20}/>
              </div>
           </div>
        </header>

        <div className="p-12 pb-32 max-w-[1400px] mx-auto w-full">
          {view === 'dashboard' && (
             <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                   <OperationalMetric title="Total Profiles" val={users.length} theme="blue" />
                   <OperationalMetric title="Pending Leads" val={enquiries.length} theme="amber" />
                   <OperationalMetric title="Staff Strength" val={stats.staffCount} theme="green" />
                   <OperationalMetric title="System Uptime" val="100%" theme="gold" />
                </div>
                
                <div className="bg-[#0b1f3a] rounded-[60px] p-16 text-white relative overflow-hidden shadow-3xl">
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/[0.03] rounded-bl-full pointer-events-none"></div>
                   <TrendingUp className="absolute bottom-[-40px] right-[-20px] text-gold/5" size={300}/>
                   <div className="relative z-10">
                     <h3 className="font-serif text-5xl font-bold mb-8">Integrated Strategy</h3>
                     <p className="text-white/40 text-2xl leading-relaxed max-w-2xl font-light">Internal protocols are operating at peak efficiency. Recruitment cycles and safety consultancy inquiries are being routed through the automated dispatch system for manual review.</p>
                     <div className="flex gap-6 mt-14">
                        <div className="px-8 py-3 bg-gold text-navy rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl">Operations Active</div>
                        <div className="px-8 py-3 border border-white/20 rounded-full font-black text-[11px] uppercase tracking-[0.2em] text-white/30 italic">Priority 1 Zone</div>
                     </div>
                   </div>
                </div>
             </div>
          )}

          {view === 'users' && (
             <div className="bg-white rounded-[45px] shadow-3xl overflow-hidden border border-navy/5 animate-in slide-in-from-left-4 duration-700">
                <table className="w-full text-left">
                   <thead className="bg-[#060f1e] text-gold-lt uppercase italic">
                      <tr>
                         <th className="p-8 text-[11px] font-black tracking-[0.4em]">Individual Identity</th>
                         <th className="p-8 text-[11px] font-black tracking-[0.4em]">Official Email</th>
                         <th className="p-8 text-[11px] font-black tracking-[0.4em]">Designated Role</th>
                         <th className="p-8 text-[11px] font-black tracking-[0.4em]">Management</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#f0ede6]">
                      {users.map((u: any) => (
                         <tr key={u._id} className="hover:bg-gold/[0.04] transition-all">
                            <td className="p-8">
                               <div className="flex items-center gap-5">
                                  <div className="w-12 h-12 bg-navy text-gold rounded-2xl flex items-center justify-center font-bold italic shadow-lg uppercase">{u.name.charAt(0)}</div>
                                  <span className="font-bold text-base text-navy uppercase tracking-tighter">{u.name}</span>
                               </div>
                            </td>
                            <td className="p-8 text-[13px] text-slate-500 font-medium">{u.email}</td>
                            <td className="p-8">
                               <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${u.role === 'admin' ? 'bg-navy text-gold border border-gold/30' : u.role === 'staff' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                                  {u.role}
                               </span>
                            </td>
                            <td className="p-8">
                               {u.role === 'client' && (
                                  <button onClick={() => handleUpdateRole(u._id, u.name, 'staff')} className="bg-[#c8921e] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-navy transition-all active:scale-95">Verify Staff Access</button>
                               )}
                               {u.role === 'staff' && (
                                  <button onClick={() => handleUpdateRole(u._id, u.name, 'client')} className="bg-red-50 text-red-500 border border-red-100 px-8 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Revoke Profile</button>
                               )}
                               {u.role === 'admin' && <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">Master Credentials</span>}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}

          {view === 'hse' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in zoom-in-95 duration-500">
               {enquiries.length === 0 ? (
                  <div className="col-span-full py-40 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">Registry Empty: Scanning for Division Leads...</div>
               ) : (
                enquiries.map((e: any) => (
                    <div key={e._id} className="bg-white p-16 rounded-[65px] border border-navy/5 shadow-2xl relative overflow-hidden transition-all hover:border-gold hover:translate-x-2 group">
                       <ShieldCheck className="absolute top-12 right-12 text-gold/5 group-hover:scale-150 transition-transform duration-1000" size={200}/>
                       <div className="flex justify-between items-start mb-12">
                          <span className="text-[10px] font-black bg-[#0b1f3a] text-white px-5 py-2 rounded-full uppercase tracking-[0.3em] shadow-lg italic">{e.service}</span>
                          <button onClick={() => handleDeleteEnquiry(e._id)} className="text-red-200 hover:text-red-500 transition-colors p-2"><Trash2 size={24}/></button>
                       </div>
                       <h3 className="font-serif text-5xl font-black tracking-tight mb-6 text-navy italic">{e.organisation || 'Personal Entry'}</h3>
                       <div className="flex items-center gap-5 mb-14 border-l-4 border-gold pl-6">
                          <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] leading-none">Logged On · {new Date(e.createdAt).toLocaleDateString()}</p>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                          <a href={`mailto:${e.email}`} className="flex flex-col items-center p-8 bg-[#f0ede6] rounded-[40px] hover:bg-[#c8921e] hover:text-white transition-all group/btn shadow-inner">
                             <Mail size={24} className="mb-4"/>
                             <span className="text-[11px] font-black uppercase tracking-widest opacity-60">Correspondence</span>
                             <span className="text-sm font-bold w-full text-center truncate mt-2">{e.email}</span>
                          </a>
                          <a href={`tel:${e.phone}`} className="flex flex-col items-center p-8 bg-navy text-white rounded-[40px] hover:bg-[#c8921e] transition-all shadow-2xl">
                             <Phone size={24} className="mb-4"/>
                             <span className="text-[11px] font-black uppercase tracking-widest opacity-60">Mobile Direct</span>
                             <span className="text-lg font-black tracking-tighter mt-1">{e.phone}</span>
                          </a>
                       </div>
                       <div className="bg-slate-50 p-8 rounded-[30px] border border-dashed border-navy/10">
                          <p className="text-[10px] font-black uppercase text-navy/30 mb-2">Request Details:</p>
                          <p className="text-sm text-navy/60 font-medium italic">"{e.details || "No supplementary information provided by the user."}"</p>
                       </div>
                    </div>
                 ))
               )}
            </div>
          )}
        </div>
      </main>
      
      <style jsx>{`
        .nav-link {
          width: 100%; text-align: left; padding: 22px 28px; border-radius: 22px; font-size: 14px; font-weight: 700;
          display: flex; align-items: center; gap: 18px; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); color: rgba(255,255,255,0.25);
          text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid transparent;
        }
        .nav-link:hover { color: #e8b84b; background: rgba(255,255,255,0.05); transform: translateX(8px); }
        .nav-link.active { background: rgba(200, 146, 30, 0.15); color: #e8b84b; border-color: rgba(200, 146, 30, 0.1); border-right: 6px solid #c8921e; shadow: 0 10px 40px rgba(0,0,0,0.3); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(11, 31, 58, 0.1); border-radius: 20px; }
      `}</style>
    </div>
  );
}

function OperationalMetric({ title, val, theme }: any) {
  const variations: any = {
    blue: "text-blue-700 bg-blue-50/80 border-blue-100",
    amber: "text-amber-700 bg-amber-50/80 border-amber-100",
    green: "text-green-700 bg-green-50/80 border-green-100",
    gold: "text-[#c8921e] bg-gold/5 border-[#c8921e]/20"
  };
  return (
    <div className={`p-10 rounded-[50px] border shadow-2xl transition-all hover:scale-105 group ${variations[theme]}`}>
       <div className="text-5xl font-serif font-black tracking-tighter leading-none mb-3 underline decoration-gold/20">{val}</div>
       <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 block text-right">{title}</span>
    </div>
  );
}