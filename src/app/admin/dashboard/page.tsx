"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, LayoutDashboard, LogOut, 
  Globe, Loader2, Mail, Phone, Calendar, 
  CheckCircle2, Trash2, ShieldAlert, TrendingUp 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminDashboard() {
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, staffCount: 0, hseCount: 0, adminCount: 0 });
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes, eRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/hse')
      ]);

      const [sData, uData, eData] = await Promise.all([sRes.json(), uRes.json(), eRes.json()]);
      
      setStats(sData);
      setUsers(uData);
      setEnquiries(eData);
    } catch (err) {
      toast.error("Database connection lost. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, userName: string, newRole: string) => {
    const action = newRole === 'staff' ? 'Promoting' : 'Revoking';
    const load = toast.loading(`${action} ${userName}...`);
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      });
      
      if (res.ok) {
        toast.success(`${userName} is now ${newRole}. ${newRole === 'staff' ? 'Welcome email sent.' : ''}`, { id: load });
        fetchAllData(); 
      }
    } catch (err) {
      toast.error("Action failed", { id: load });
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Permanently delete this enquiry?")) return;
    try {
      const res = await fetch('/api/admin/hse', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        toast.success("Enquiry deleted");
        fetchAllData();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f0ede6] flex flex-col items-center justify-center font-sans">
      <Loader2 className="animate-spin text-[#c8921e] mb-4" size={42} />
      <p className="text-[#0b1f3a] font-bold tracking-[0.2em] uppercase text-[10px]">OBRUS Syncing Live Data</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f0ede6] font-sans text-[#0b1f3a]">
      {/* SIDEBAR */}
      <aside className="w-[248px] bg-[#060f1e] fixed inset-y-0 left-0 border-r border-[#c8921e]/10 z-50 overflow-y-auto">
        <div className="p-6 border-bottom border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c8921e] rounded flex items-center justify-center font-bold text-[#0b1f3a] text-xl">O</div>
            <div>
              <span className="block text-white font-serif font-bold leading-none">OBRUS</span>
              <span className="text-[10px] text-[#e8b84b] uppercase tracking-widest font-bold">Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="mt-8 px-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Overview', ico: <LayoutDashboard size={18}/> },
            { id: 'users', label: 'System Users', ico: <Users size={18}/> },
            { id: 'hse', label: 'HSE Requests', ico: <ShieldCheck size={18}/> },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full text-left p-3.5 rounded-xl text-[13px] flex items-center gap-3 transition-all ${view === item.id ? 'bg-[#c8921e]/15 text-[#e8b84b] border border-[#c8921e]/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {item.ico} {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-white/5 bg-[#060f1e]">
          <button onClick={() => window.location.href='/auth'} className="flex items-center gap-3 text-white/30 hover:text-red-400 transition-colors text-sm font-medium">
            <LogOut size={18}/> Secure Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-[248px] flex-1">
        {/* HEADER */}
        <header className="h-[65px] bg-white border-b flex items-center justify-between px-10 sticky top-0 z-40">
          <h2 className="font-serif text-2xl font-bold tracking-tight uppercase border-l-4 border-[#c8921e] pl-4 leading-none">
            {view === 'dashboard' ? 'Analytical Hub' : view === 'users' ? 'Identity Management' : 'Safety Compliance Enquiries'}
          </h2>
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-bold text-[#8494aa] uppercase tracking-[0.1em] flex items-center gap-2">
              <Calendar size={14}/> {new Date().toDateString()}
            </div>
            <Link href="/" className="text-[#0b1f3a]/40 hover:text-[#c8921e] transition-all"><Globe size={20}/></Link>
          </div>
        </header>

        <div className="p-10">
          {/* VIEW: DASHBOARD */}
          {view === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard title="Registered Users" val={stats.totalUsers} ico={<Users size={20}/>} bg="bg-blue-50" text="text-blue-600" />
                <StatCard title="Total Enquiries" val={stats.hseCount} ico={<ShieldCheck size={20}/>} bg="bg-amber-50" text="text-amber-600" />
                <StatCard title="Active Staff" val={stats.staffCount} ico={<Users size={20}/>} bg="bg-green-50" text="text-green-600" />
                <StatCard title="Administrator" val={stats.adminCount} ico={<ShieldAlert size={20}/>} bg="bg-purple-50" text="text-purple-600" />
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[32px] border border-[#0b1f3a]/5 shadow-sm">
                   <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-[#c8921e]"/> Operation Insight</h3>
                   <div className="space-y-4">
                      <p className="text-sm text-[#8494aa] leading-relaxed">The system is currently operational. Recent database traffic shows increasing engagement from the <b>Environmental Division</b> enquiries.</p>
                      <div className="p-4 bg-[#f0ede6] rounded-2xl flex items-center justify-between">
                         <span className="text-[11px] font-bold uppercase tracking-widest text-[#0b1f3a]/60">MongoDB Latency</span>
                         <span className="text-green-600 font-bold text-xs">0.42ms - Stable</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: USER MANAGEMENT */}
          {view === 'users' && (
            <div className="bg-white rounded-[32px] border border-[#0b1f3a]/5 shadow-sm overflow-hidden animate-in fade-in duration-500">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#0b1f3a] text-white">
                  <tr>
                    <th className="p-5 text-[11px] uppercase tracking-widest">Identified Name</th>
                    <th className="p-5 text-[11px] uppercase tracking-widest">Digital Contact</th>
                    <th className="p-5 text-[11px] uppercase tracking-widest">Auth Role</th>
                    <th className="p-5 text-[11px] uppercase tracking-widest">Authorization Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede6]">
                  {users.map((u: any) => (
                    <tr key={u._id} className="hover:bg-[#f0ede6]/50 transition-colors">
                      <td className="p-5">
                         <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#0b1f3a]/5 rounded-full flex items-center justify-center font-bold text-[#c8921e] uppercase">{u.name.charAt(0)}</div>
                            <span className="font-bold text-sm tracking-tight">{u.name}</span>
                         </div>
                      </td>
                      <td className="p-5 text-sm font-medium text-[#8494aa]">{u.email}</td>
                      <td className="p-5">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded tracking-tighter ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'staff' ? 'bg-[#c8921e]/10 text-[#c8921e]' : 'bg-slate-100 text-slate-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-5">
                        {u.role === 'client' && (
                          <button onClick={() => handleUpdateRole(u._id, u.name, 'staff')} className="text-[10px] font-bold uppercase bg-[#c8921e] text-[#060f1e] px-4 py-2 rounded-lg hover:shadow-lg transition-all active:scale-95">Approve Staff Access</button>
                        )}
                        {u.role === 'staff' && (
                          <button onClick={() => handleUpdateRole(u._id, u.name, 'client')} className="text-[10px] font-bold uppercase text-red-500 bg-red-50 px-4 py-2 rounded-lg border border-red-100">Revoke Auth</button>
                        )}
                        {u.role === 'admin' && <span className="text-[10px] font-bold uppercase text-slate-300 italic">System Owner</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW: HSE ENQUIRIES */}
          {view === 'hse' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
              {enquiries.length === 0 ? (
                 <div className="col-span-full p-20 text-center text-[#8494aa]">No incoming safety enquiries detected.</div>
              ) : (
                enquiries.map((e: any) => (
                  <div key={e._id} className="bg-white p-10 rounded-[32px] border border-[#0b1f3a]/5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8921e]/5 rounded-bl-[100px]"></div>
                    <div className="flex justify-between items-start mb-8">
                      <span className="bg-[#c8921e] text-[#060f1e] text-[9px] font-extrabold uppercase px-3 py-1.5 rounded-full tracking-widest">{e.service}</span>
                      <button onClick={() => handleDeleteEnquiry(e._id)} className="text-red-400/20 hover:text-red-500 transition-all p-2"><Trash2 size={18}/></button>
                    </div>
                    <h3 className="font-serif text-2xl font-bold mb-1 tracking-tight">{e.organisation || "Individual Case"}</h3>
                    <p className="text-slate-400 text-xs mb-8 flex items-center gap-2 uppercase tracking-widest font-bold"><Calendar size={12}/> Received {new Date(e.createdAt).toLocaleDateString()}</p>
                    
                    <div className="space-y-4 mb-10">
                      <div className="flex items-center gap-3 text-sm font-medium"><Mail size={16} className="text-[#c8921e]"/> {e.email}</div>
                      <div className="flex items-center gap-3 text-sm font-medium"><Phone size={16} className="text-[#c8921e]"/> {e.phone}</div>
                    </div>

                    <div className="flex gap-4 border-t border-[#f0ede6] pt-8">
                      <a href={`mailto:${e.email}`} className="flex-1 bg-[#0b1f3a] text-white py-3.5 rounded-2xl text-[11px] font-bold uppercase text-center shadow-xl shadow-navy/20 hover:-translate-y-1 transition-all">Resolve via Email</a>
                      <a href={`tel:${e.phone}`} className="w-14 h-14 border-2 border-[#0b1f3a]/5 flex items-center justify-center rounded-2xl text-[#c8921e] hover:border-[#c8921e] transition-all"><Phone size={20}/></a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, val, ico, bg, text }: any) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-[#0b1f3a]/5 shadow-sm transition-all hover:shadow-2xl group">
      <div className={`w-14 h-14 ${bg} ${text} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>{ico}</div>
      <div className="text-4xl font-serif font-bold text-[#0b1f3a] leading-none mb-2">{val}</div>
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8494aa]">{title}</div>
    </div>
  );
}