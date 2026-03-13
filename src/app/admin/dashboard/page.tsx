"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, LayoutDashboard, LogOut, 
  Globe, Loader2, Mail, Phone, Calendar, 
  ShieldAlert, TrendingUp, Search, Bell, Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminDashboard() {
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, staffCount: 0, hseCount: 0, adminCount: 0 });
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      const [sRes, uRes, eRes] = await Promise.all([
        fetch('/api/admin/stats'), fetch('/api/admin/users'), fetch('/api/admin/hse')
      ]);
      if (!sRes.ok || !uRes.ok || !eRes.ok) throw new Error();
      setStats(await sRes.json());
      setUsers(await uRes.json());
      setEnquiries(await eRes.json());
    } catch (err) {
      toast.error("Database connection failed. Re-trying...");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, userName: string, newRole: string) => {
    const load = toast.loading(`Updating ${userName} privileges...`);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      });
      if (res.ok) {
        toast.success(`${userName} is now ${newRole}. System notified.`, { id: load });
        fetchAllData(); 
      }
    } catch (err) {
      toast.error("Critical: Security update failed.", { id: load });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#060f1e] flex flex-col items-center justify-center font-sans">
      <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-white font-bold tracking-[0.3em] uppercase text-[10px]">Synchronizing OBRUS Control Panel</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f0ede6] text-[#0b1f3a] overflow-hidden">
      
      {/* ── SIDEBAR (NAVY DEEP) ── */}
      <aside className="w-[260px] bg-[#060f1e] border-r border-gold/10 flex flex-col fixed inset-y-0 z-50 transition-all">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-lt rounded-xl flex items-center justify-center font-bold text-[#0b1f3a] text-2xl shadow-xl">O</div>
          <div>
            <span className="block text-white font-serif font-bold text-lg leading-tight uppercase">OBRUS</span>
            <span className="text-gold-lt text-[9px] uppercase tracking-[0.2em] font-bold">Control Panel</span>
          </div>
        </div>

        <div className="p-6">
           <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-6">Master Console</p>
           <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Operations Desk', ico: <LayoutDashboard size={18}/> },
              { id: 'users', label: 'Workforce ID', ico: <Users size={18}/> },
              { id: 'hse', label: 'Safety Enquiries', ico: <ShieldCheck size={18}/> },
              { id: 'recruitment', label: 'Portal Analytics', ico: <Briefcase size={18}/> },
            ].map((item) => (
              <button key={item.id} onClick={() => setView(item.id)}
                className={`w-full text-left px-5 py-4 rounded-xl text-[13px] font-medium flex items-center gap-4 transition-all border-r-4 ${view === item.id ? 'bg-gold/10 text-gold-lt border-gold' : 'text-white/30 border-transparent hover:bg-white/5 hover:text-white'}`}>
                {item.ico} {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 bg-[#040a14] border-t border-white/5">
           <Link href="/auth" className="flex items-center gap-4 text-red-400/50 hover:text-red-400 transition-all font-bold text-xs">
              <LogOut size={16}/> DE-AUTHENTICATE
           </Link>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="ml-[260px] flex-1 flex flex-col h-screen">
        
        {/* TOPBAR */}
        <header className="h-[70px] bg-white border-b flex items-center justify-between px-10 flex-shrink-0 sticky top-0 z-40">
           <div className="flex items-center gap-6">
              <h2 className="font-serif text-2xl font-bold tracking-tight text-[#0b1f3a] uppercase">
                {view === 'dashboard' ? 'Analytical Intelligence' : view === 'users' ? 'Staff Authorization' : 'Industrial Requests'}
              </h2>
              <div className="hidden md:flex bg-[#f0ede6] px-4 py-1.5 rounded-full text-[10px] font-bold text-slate uppercase border tracking-widest gap-2 items-center">
                 <Calendar size={12}/> {new Date().toLocaleDateString('en-GB')}
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer w-10 h-10 border-2 border-navy/5 rounded-full flex items-center justify-center text-navy/40 hover:text-gold hover:border-gold transition-all">
                <Bell size={20}/><div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="w-[1px] h-10 bg-navy/5 mx-2"></div>
              <div className="flex items-center gap-3">
                 <div className="text-right leading-none">
                    <span className="block text-[11px] font-bold text-navy uppercase mb-0.5">Admin Hub</span>
                    <span className="text-[9px] font-extrabold text-gold tracking-widest uppercase">System Secured</span>
                 </div>
                 <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center font-bold text-gold italic">A</div>
              </div>
           </div>
        </header>

        {/* CONTENT */}
        <div className="p-10 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* OPERATIONS VIEW */}
          {view === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                 <MetricCard title="Workforce Registrations" val={users.length} diff="+4" ico={<Users size={22}/>} up={true} />
                 <MetricCard title="Safety Inquiries" val={stats.hseCount} diff="+18%" ico={<ShieldCheck size={22}/>} up={true} />
                 <MetricCard title="Vetted Personnel" val={stats.staffCount} diff="-2%" ico={<Briefcase size={22}/>} up={false} />
                 <MetricCard title="Security Level" val="ALPHA" diff="100%" ico={<ShieldAlert size={22}/>} up={true} />
               </div>

               <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-navy/5 shadow-xl relative overflow-hidden group">
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/5 rounded-full"></div>
                     <h3 className="font-serif text-2xl font-bold mb-8">Integrated Analytics Pipeline</h3>
                     <p className="text-[#8494aa] leading-relaxed mb-10">Systems check normal. The <b>Manpower Outsourcing</b> division is currently experiencing high demand. All email servers are active for automated welcome protocols.</p>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-navy text-white rounded-3xl">
                           <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Real-time Latency</span>
                           <h4 className="text-2xl font-bold text-gold">0.2s HighSpeed</h4>
                        </div>
                        <div className="p-6 bg-[#f0ede6] rounded-3xl border border-navy/5">
                           <span className="text-[10px] text-navy/40 uppercase font-bold tracking-widest">Database Health</span>
                           <h4 className="text-2xl font-bold text-green-600 uppercase tracking-tighter italic underline decoration-gold/50">Optimal</h4>
                        </div>
                     </div>
                  </div>
                  <div className="bg-[#0b1f3a] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-full h-1 bg-gold shadow-[0_0_15px_gold]"></div>
                     <TrendingUp size={48} className="text-gold opacity-10 absolute bottom-8 right-8"/>
                     <h3 className="font-serif text-xl font-bold italic mb-4">Master Security Status</h3>
                     <div className="space-y-4">
                        <StatusItem label="Encryption" active={true}/>
                        <StatusItem label="Atlas Connectivity" active={true}/>
                        <StatusItem label="Admin Protocols" active={true}/>
                        <StatusItem label="Audit Logs" active={false}/>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* WORKFORCE MANAGEMENT VIEW */}
          {view === 'users' && (
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700">
               <div className="p-8 border-b border-navy/5 bg-[#fcfbf9] flex justify-between items-center">
                  <div><h3 className="font-serif text-2xl font-bold">Authorized Personnel List</h3><p className="text-slate-400 text-xs">Verify identities and grant operational access levels</p></div>
                  <div className="bg-white border rounded-xl p-2 flex items-center gap-3"><Search size={16} className="text-slate-300"/><input className="bg-transparent outline-none text-sm w-48" placeholder="Filter by email..."/></div>
               </div>
               <table className="w-full text-left">
                  <thead className="bg-[#060f1e] text-[#e8b84b]">
                    <tr>
                      <th className="p-6 text-[10px] uppercase font-bold tracking-widest">Operator Name</th>
                      <th className="p-6 text-[10px] uppercase font-bold tracking-widest">Access Node</th>
                      <th className="p-6 text-[10px] uppercase font-bold tracking-widest">Credential Level</th>
                      <th className="p-6 text-[10px] uppercase font-bold tracking-widest">Override Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/5">
                    {users.map((u: any) => (
                      <tr key={u._id} className="hover:bg-gold/[0.02] transition-colors">
                        <td className="p-6 flex items-center gap-4">
                          <div className="w-10 h-10 bg-navy/5 border border-gold/10 rounded-full flex items-center justify-center font-bold text-navy italic">{u.name.charAt(0)}</div>
                          <span className="font-bold tracking-tight text-sm uppercase">{u.name}</span>
                        </td>
                        <td className="p-6 text-xs font-medium text-slate-500 font-mono tracking-tighter">{u.email}</td>
                        <td className="p-6">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${u.role === 'admin' ? 'bg-navy text-gold shadow-lg' : u.role === 'staff' ? 'bg-gold/10 text-[#c8921e] border border-gold/20' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                              {u.role}
                           </span>
                        </td>
                        <td className="p-6">
                          {u.role === 'client' && (
                             <button onClick={() => handleUpdateRole(u._id, u.name, 'staff')} className="bg-[#c8921e] text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase shadow-lg shadow-gold/20 hover:scale-105 transition-all">Authorize Staff</button>
                          )}
                          {u.role === 'staff' && (
                             <button onClick={() => handleUpdateRole(u._id, u.name, 'client')} className="text-red-500 bg-red-50 border border-red-100 px-5 py-2 rounded-xl text-[10px] font-bold uppercase hover:bg-red-500 hover:text-white transition-all">Revoke Control</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}

          {/* SAFETY REQUESTS VIEW */}
          {view === 'hse' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {enquiries.map((e: any) => (
                <div key={e._id} className="bg-white p-12 rounded-[45px] border-b-[8px] border-[#c8921e] shadow-2xl relative overflow-hidden transition-all hover:-translate-y-2 group">
                   <div className="absolute top-10 right-10 opacity-5 group-hover:scale-110 transition-transform"><ShieldCheck size={100}/></div>
                   <div className="flex items-center gap-2 mb-8">
                      <div className="w-2 h-2 bg-[#c8921e] rounded-full animate-ping"></div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#c8921e]">Critical Operational Request</span>
                   </div>
                   <h3 className="font-serif text-3xl font-bold text-navy mb-2 tracking-tighter underline decoration-gold/20">{e.organisation || "Anonymous Source"}</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase mb-10 italic">Inbound Date: {new Date(e.createdAt).toDateString()}</p>
                   
                   <div className="grid grid-cols-2 gap-4 mb-10">
                      <a href={`mailto:${e.email}`} className="flex flex-col p-5 bg-[#f0ede6] rounded-3xl hover:bg-gold transition-colors hover:text-white group/btn">
                         <Mail size={20} className="mb-3"/>
                         <span className="text-[10px] font-bold uppercase tracking-widest mb-1">Send Comm</span>
                         <span className="text-[11px] font-medium opacity-50 overflow-hidden text-ellipsis">{e.email}</span>
                      </a>
                      <a href={`tel:${e.phone}`} className="flex flex-col p-5 bg-navy text-white rounded-3xl hover:bg-[#c8921e] transition-colors">
                         <Phone size={20} className="mb-3"/>
                         <span className="text-[10px] font-bold uppercase tracking-widest mb-1">Direct Logic</span>
                         <span className="text-[11px] font-medium opacity-50 underline">{e.phone}</span>
                      </a>
                   </div>
                   <button className="w-full py-4 border-2 border-navy/10 rounded-full font-bold text-[11px] uppercase tracking-widest hover:border-gold hover:text-gold transition-all">Secure Dispatch Data</button>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, val, diff, ico, up }: any) {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-navy/5 shadow-xl group hover:border-gold transition-all cursor-default relative overflow-hidden">
      <div className={`w-14 h-14 bg-navy text-gold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-700`}>{ico}</div>
      <div className="flex items-end justify-between mb-1">
        <h4 className="text-4xl font-serif font-extrabold text-navy tracking-tighter">{val}</h4>
        <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{diff}</span>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{title}</p>
    </div>
  );
}

function StatusItem({ label, active }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
       <span className="text-[11px] font-bold text-white/50 tracking-wide uppercase">{label}</span>
       <div className={`px-3 py-1 rounded-md text-[9px] font-bold tracking-widest border ${active ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-gold/10 text-gold border-gold/30'}`}>{active ? 'ENCRYPTED' : 'AWAITING'}</div>
    </div>
  );
}