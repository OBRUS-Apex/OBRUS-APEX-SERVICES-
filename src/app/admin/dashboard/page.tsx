"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, ShieldCheck, LayoutDashboard, LogOut, 
  Globe, Loader2, Mail, Phone, Calendar, 
  ShieldAlert, TrendingUp, Search, Bell, Briefcase, Trash2, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  
  const [stats, setStats] = useState({ totalUsers: 0, staffCount: 0, hseCount: 0, adminCount: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push('/auth');
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== 'admin') {
      toast.error("Administrative Privileges Required");
      router.push('/');
      return;
    }
    setAdminUser(user);
    setIsAuthorized(true);
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [sRes, uRes, eRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/user'),
        fetch('/api/admin/hse')
      ]);

      if (!sRes.ok || !uRes.ok || !eRes.ok) throw new Error("Sync Failed");

      const sData = await sRes.json();
      const uData = await uRes.json();
      const eData = await eRes.json();

      setStats(sData);
      setUsers(Array.isArray(uData) ? uData : []);
      setEnquiries(Array.isArray(eData) ? eData : []);
    } catch (err) {
      toast.error("Central Registry Offline. Reconnecting...");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, userName: string, newRole: string) => {
    const load = toast.loading(`Upgrading Access: ${userName}...`);
    try {
      const res = await fetch('/api/admin/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      });
      if (res.ok) {
        toast.success(`Access Modified: ${newRole}`, { id: load });
        fetchAllData(); 
      }
    } catch (err) {
      toast.error("Authorization Override Failed", { id: load });
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-[#f0ede6] text-[#0b1f3a] font-sans">
      
      
      <aside className="w-[248px] bg-[#060f1e] border-r border-white/5 flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-[#0b1f3a]">
          <div className="w-10 h-10 bg-[#c8921e] rounded flex items-center justify-center font-bold text-navy text-xl uppercase shadow-lg">O</div>
          <div className="leading-tight">
            <span className="block text-white font-serif font-bold text-base uppercase">OBRUS</span>
            <span className="text-[#e8b84b] text-[9px] uppercase tracking-widest font-bold">Admin Hub</span>
          </div>
        </div>

        
        <div className="p-5 border-b border-white/5 bg-[#060f1e]">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c8921e] to-[#e8b84b] flex items-center justify-center text-navy font-bold italic">A</div>
             <div className="leading-tight">
                <span className="block text-white text-[13px] font-bold uppercase truncate max-w-[120px]">{adminUser?.name || 'Admin'}</span>
                <span className="text-[#e8b84b] text-[10px] font-black tracking-widest">MASTER CONTROL</span>
             </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase font-bold tracking-tighter">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Link Established
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-4 ml-4">Core Overview</p>
          <button onClick={() => setView('dashboard')} className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`}><LayoutDashboard size={16}/> Central Console</button>
          
          <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-4 mt-6 ml-4">Registry Control</p>
          <button onClick={() => setView('users')} className={`nav-btn ${view === 'users' ? 'active' : ''}`}><Users size={16}/> Operator Database</button>
          <button onClick={() => setView('hse')} className={`nav-btn ${view === 'hse' ? 'active' : ''}`}><ShieldCheck size={16}/> Client Leads</button>
        </nav>

        <div className="mt-auto p-4 border-t border-white/5">
           <button onClick={() => { localStorage.clear(); window.location.href='/auth'; }} className="w-full text-left p-4 text-red-400/40 hover:text-red-400 font-bold text-xs uppercase transition-colors flex items-center gap-3">
              <LogOut size={14}/> Terminate Auth
           </button>
        </div>
      </aside>

      
      <main className="ml-[248px] flex-1 flex flex-col min-h-screen">
        
        
        <header className="h-[60px] bg-white border-b flex items-center justify-between px-10 sticky top-0 z-40">
           <div className="flex items-center gap-6">
              <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-[#0b1f3a]">
                {view === 'dashboard' ? 'Administrative Analytics' : view === 'users' ? 'Identity Verification' : 'Inbound Opportunities'}
              </h2>
           </div>
           <div className="flex items-center gap-5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-navy/5">
                {new Date().toDateString()}
              </div>
              <Link href="/" className="w-10 h-10 border rounded-xl flex items-center justify-center text-navy/30 hover:text-[#c8921e] hover:border-[#c8921e] transition-all"><Globe size={18}/></Link>
           </div>
        </header>

        
        <div className="p-8">
          
          {loading ? (
             <div className="py-20 text-center animate-pulse">
                <Loader2 className="animate-spin mx-auto text-[#c8921e] mb-4" size={32}/>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Recalibrating Database Hub</p>
             </div>
          ) : (
            <>
             
              {view === 'dashboard' && (
                <div className="animate-in fade-in duration-1000">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <KPI val={stats.totalUsers} label="Total Records" color="gold" ico={<Users/>}/>
                    <KPI val={stats.hseCount} label="Division Leads" color="green" ico={<ShieldCheck/>}/>
                    <KPI val={stats.staffCount} label="Authorized Ops" color="navy" ico={<Briefcase/>}/>
                    <KPI val="₦4.2M" label="Yield Estimate" color="red" ico={<TrendingUp/>}/>
                  </div>

                  <div className="bg-white rounded-3xl p-10 border border-navy/5 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-40 h-40 bg-[#c8921e]/5 rounded-bl-full transition-transform group-hover:scale-110 duration-700"></div>
                     <h3 className="font-serif text-2xl font-bold mb-6 italic border-b border-navy/5 pb-4">Strategy Control Center</h3>
                     <p className="text-slate-500 leading-relaxed text-lg max-w-3xl mb-8">Integrated database synchronization confirmed. All field entries and workforce identifications are available for administrative vetting.</p>
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-navy text-white px-3 py-1 rounded uppercase tracking-tighter shadow-xl shadow-navy/20">Operational Layer 1</span>
                        <div className="w-12 h-[2px] bg-gold/30"></div>
                        <span className="text-[10px] font-bold text-slate-300">OBRUS APEX HUB SYSTEM v1.02</span>
                     </div>
                  </div>
                </div>
              )}

           
              {view === 'users' && (
                <div className="bg-white rounded-3xl shadow-xl border border-navy/5 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#f0ede6] text-navy">
                      <tr>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-40 italic">Identifier</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-40 italic">Authorization</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest opacity-40 italic">System Command</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map((u: any) => (
                        <tr key={u._id} className="hover:bg-gold/[0.02] transition-colors">
                          <td className="p-6">
                             <div className="flex items-center gap-4">
                                <div className="w-11 h-11 bg-navy text-gold rounded-full flex items-center justify-center font-bold italic shadow-md">{u.name.charAt(0).toUpperCase()}</div>
                                <div className="leading-tight">
                                   <span className="block font-bold text-sm text-navy uppercase tracking-tighter">{u.name}</span>
                                   <span className="text-slate-400 text-xs font-mono">{u.email}</span>
                                </div>
                             </div>
                          </td>
                          <td className="p-6">
                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${u.role === 'admin' ? 'bg-[#0b1f3a] text-gold border-gold/30' : u.role === 'staff' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                {u.role}
                            </span>
                          </td>
                          <td className="p-6">
                            {u.role === 'client' && (
                              <button onClick={() => handleUpdateRole(u._id, u.name, 'staff')} className="bg-[#c8921e] text-[#060f1e] px-6 py-2.5 rounded-xl text-[9px] font-black uppercase hover:shadow-2xl hover:-translate-y-0.5 transition-all">Authorize Staff</button>
                            )}
                            {u.role === 'staff' && (
                              <button onClick={() => handleUpdateRole(u._id, u.name, 'client')} className="bg-red-50 text-red-600 border border-red-100 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Revoke Status</button>
                            )}
                            {u.role === 'admin' && <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={12}/> Master Key</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              
              {view === 'hse' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {enquiries.length === 0 ? (
                    <div className="col-span-full py-40 text-center text-slate-300 font-bold uppercase tracking-[0.4em]">Listening for Data...</div>
                  ) : (
                    enquiries.map((e: any) => (
                      <div key={e._id} className="bg-white p-12 rounded-[45px] border-b-8 border-[#c8921e] shadow-2xl relative group overflow-hidden">
                        <div className="absolute -top-10 -right-10 opacity-5 transition-transform group-hover:scale-125 duration-1000"><ShieldCheck size={250}/></div>
                        <div className="flex justify-between items-start mb-10">
                          <span className="text-[9px] font-black bg-navy text-white px-5 py-2 rounded-full uppercase tracking-widest">{e.service}</span>
                          <span className="text-slate-300 font-bold text-[10px] italic">#{e._id.slice(-6)}</span>
                        </div>
                        <h3 className="font-serif text-3xl font-black text-navy mb-8 decoration-gold/10 underline decoration-8">{e.organisation || 'N/A Operator'}</h3>
                        <div className="grid grid-cols-2 gap-4 mb-10 text-[11px] font-bold uppercase tracking-widest text-slate-400 italic">
                           <span><Calendar className="inline mr-2 text-gold" size={14}/> {new Date(e.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-4">
                           <a href={`mailto:${e.email}`} className="flex-1 bg-navy text-white text-center py-4 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-navy/20 hover:bg-gold transition-all">Engage Case</a>
                           <a href={`tel:${e.phone}`} className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-gold hover:text-navy transition-all"><Phone size={22}/></a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <style jsx>{`
        .nav-btn {
          width: 100%; text-align: left; padding: 18px 24px; border-radius: 16px; font-size: 13px; font-weight: 500;
          display: flex; align-items: center; gap: 14px; transition: all 0.3s; color: rgba(255,255,255,0.25);
        }
        .nav-btn:hover { color: #fff; background: rgba(255,255,255,0.04); }
        .nav-btn.active { background: rgba(200, 146, 30, 0.12); color: #e8b84b; border-right: 4px solid #c8921e; shadow: 0 4px 30px rgba(0,0,0,0.4); }
      `}</style>
    </div>
  );
}

function KPI({ val, label, ico, color }: any) {
  const styles: any = {
    gold: "bg-gold/10 text-gold",
    green: "bg-green-50 text-green-600",
    navy: "bg-navy/5 text-navy",
    red: "bg-red-50 text-red-500"
  };
  return (
    <div className="bg-white p-8 rounded-[40px] shadow-lg border border-navy/[0.03] group hover:-translate-y-2 transition-all duration-500">
       <div className={`w-12 h-12 ${styles[color]} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-700 shadow-sm`}>{ico}</div>
       <div className="text-4xl font-serif font-black text-navy leading-none mb-1">{val}</div>
       <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</div>
    </div>
  );
}