"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, ShieldCheck, LayoutDashboard, LogOut, 
  Globe, Loader2, Mail, Phone, Calendar, 
  ShieldAlert, TrendingUp, Search, Bell, Briefcase
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
        toast.error("Unauthorized: Admin Access Required");
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

      if (!sRes.ok || !uRes.ok || !eRes.ok) throw new Error();
      
      setStats(await sRes.json());
      setUsers(await uRes.json());
      setEnquiries(await eRes.json());
    } catch (err) {
      toast.error("Security session expired. Please re-login.");
      localStorage.clear();
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, userName: string, newRole: string) => {
    const load = toast.loading(`Updating credentials for ${userName}...`);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      });
      if (res.ok) {
        toast.success(`Success: ${userName} assigned to ${newRole}`, { id: load });
        fetchAllData(); 
      }
    } catch (err) {
      toast.error("Role update failed", { id: load });
    }
  };

 
  if (loading && !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#060f1e] flex flex-col items-center justify-center font-sans">
        <Loader2 className="animate-spin text-gold mb-4" size={40} />
        <p className="text-white font-bold tracking-[0.3em] uppercase text-[10px]">Validating Master Credentials...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f0ede6] text-[#0b1f3a] overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-[#060f1e] border-r border-gold/10 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center font-bold text-navy text-2xl shadow-xl">O</div>
          <div>
            <span className="block text-white font-serif font-bold text-lg uppercase">OBRUS</span>
            <span className="text-gold-lt text-[9px] uppercase tracking-widest font-bold">Control Panel</span>
          </div>
        </div>

        <nav className="p-6 space-y-1.5 flex-1">
          <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-4">Operations Console</p>
          <button onClick={() => setView('dashboard')} className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`}><LayoutDashboard size={18}/> Overview</button>
          <button onClick={() => setView('users')} className={`nav-btn ${view === 'users' ? 'active' : ''}`}><Users size={18}/> Identity Pool</button>
          <button onClick={() => setView('hse')} className={`nav-btn ${view === 'hse' ? 'active' : ''}`}><ShieldCheck size={18}/> Field Inquiries</button>
        </nav>

        <div className="p-6 bg-[#040a14] border-t border-white/5">
           <button onClick={() => { localStorage.clear(); router.push('/auth'); }} className="flex items-center gap-4 text-red-400/50 hover:text-red-400 font-bold text-xs">
              <LogOut size={16}/> EXIT MASTER PANEL
           </button>
        </div>
      </aside>

    
      <main className="ml-[260px] flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-[70px] bg-white border-b flex items-center justify-between px-10 sticky top-0 z-40 shadow-sm">
           <h2 className="font-serif text-2xl font-bold uppercase tracking-tight">{view === 'dashboard' ? 'Command Intelligence' : view === 'users' ? 'Operator Management' : 'Industrial Pipeline'}</h2>
           <div className="flex items-center gap-6 text-slate-400 font-bold text-[10px] uppercase">
              <Calendar size={14}/> {new Date().toDateString()}
              <Globe className="cursor-pointer hover:text-gold ml-4" onClick={() => window.location.href='/'}/>
           </div>
        </header>

        <div className="p-10">
          {view === 'dashboard' && (
             <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                   <Metric title="Total Identities" val={users.length} up={true}/>
                   <Metric title="Service Requests" val={enquiries.length} up={true}/>
                   <Metric title="Authorized Staff" val={stats.staffCount} up={false}/>
                   <Metric title="Active Nodes" val="STABLE" up={true}/>
                </div>
                <div className="bg-white rounded-[40px] p-12 border shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full"></div>
                   <h3 className="font-serif text-3xl font-bold mb-6 italic underline decoration-gold/30">Operations Pulse</h3>
                   <p className="text-slate-400 leading-relaxed mb-0 max-w-2xl text-lg">System communication with <b>MongoDB Cluster0</b> is established. Monitoring recruitment and safety division engagement metrics.</p>
                </div>
             </div>
          )}

          {view === 'users' && (
             <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-navy/5">
                <table className="w-full text-left">
                   <thead className="bg-[#0b1f3a] text-[#e8b84b]">
                      <tr>
                         <th className="p-6 text-[10px] uppercase font-bold tracking-[0.2em]">Operator Identity</th>
                         <th className="p-6 text-[10px] uppercase font-bold tracking-[0.2em]">Network Node</th>
                         <th className="p-6 text-[10px] uppercase font-bold tracking-[0.2em]">Auth Role</th>
                         <th className="p-6 text-[10px] uppercase font-bold tracking-[0.2em]">Manual Override</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#f0ede6]">
                      {users.map((u: any) => (
                         <tr key={u._id} className="hover:bg-[#fcfbf9] transition-all">
                            <td className="p-6 flex items-center gap-4 font-bold text-sm tracking-tight text-navy uppercase">{u.name}</td>
                            <td className="p-6 text-xs text-slate-400 font-mono tracking-tighter">{u.email}</td>
                            <td className="p-6 font-bold text-[10px] uppercase tracking-widest text-[#c8921e]">{u.role}</td>
                            <td className="p-6">
                               {u.role === 'client' ? (
                                  <button onClick={() => handleUpdateRole(u._id, u.name, 'staff')} className="bg-[#c8921e] text-white px-5 py-2 rounded-xl text-[9px] font-extrabold uppercase shadow-lg shadow-gold/20">Elevate to Staff</button>
                               ) : u.role === 'staff' ? (
                                  <button onClick={() => handleUpdateRole(u._id, u.name, 'client')} className="bg-red-50 text-red-500 px-5 py-2 rounded-xl text-[9px] font-extrabold uppercase border border-red-100">Revoke Auth</button>
                               ) : <span className="text-[10px] font-bold text-slate-300 italic tracking-widest">Master Admin</span>}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}

          {view === 'hse' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {enquiries.map((e: any) => (
                  <div key={e._id} className="bg-white p-12 rounded-[50px] border shadow-2xl relative overflow-hidden transition-transform hover:-translate-y-2 group">
                     <ShieldCheck className="absolute top-10 right-10 text-navy/[0.03] group-hover:scale-125 transition-transform" size={120}/>
                     <span className="text-[9px] font-extrabold bg-navy text-white px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">HSE Div. Inquiry</span>
                     <h3 className="font-serif text-3xl font-bold tracking-tighter mb-4 decoration-gold/20 underline">{e.organisation || 'N/A Provider'}</h3>
                     <div className="space-y-4 mb-10">
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest"><Mail className="text-gold" size={14}/> {e.email}</div>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest"><Phone className="text-gold" size={14}/> {e.phone}</div>
                     </div>
                     <a href={`mailto:${e.email}`} className="block w-full py-4 bg-navy text-white text-center rounded-3xl font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-navy/20 hover:bg-gold transition-all">Engage Operator</a>
                  </div>
               ))}
            </div>
          )}
        </div>
      </main>
      
      <style jsx>{`
        .nav-btn {
          width: 100%; text-align: left; padding: 16px; border-radius: 12px; font-size: 13px; font-weight: 500;
          display: flex; align-items: center; gap: 16px; transition: all 0.3s; color: rgba(255,255,255,0.4);
        }
        .nav-btn:hover { background: rgba(255,255,255,0.05); color: white; }
        .nav-btn.active { background: rgba(200, 146, 30, 0.15); color: #e8b84b; border-right: 4px solid #c8921e; }
      `}</style>
    </div>
  );
}

function Metric({ title, val, up }: any) {
  return (
    <div className="bg-white p-8 rounded-[40px] border shadow-xl group hover:border-gold/50 transition-all">
       <div className="text-4xl font-serif font-bold text-navy mb-2 tracking-tight">{val}</div>
       <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">{title}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{up ? '↑' : '↓'}</span>
       </div>
    </div>
  );
}