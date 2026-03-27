"use client";
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, LayoutDashboard, LogOut,
  Globe, Mail, Phone, Calendar,
  Briefcase, FileText, CheckCircle, XCircle,
  ClipboardList, AlertTriangle, Trash2, RefreshCw,
  Menu, X, Users, TrendingUp, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminDashboard() {
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, staffCount: 0, hseCount: 0, adminCount: 0 });

  const [employers, setEmployers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [allJobs, setAllJobs] = useState<any[]>([]);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [uRes, aRes, hRes, sRes, srRes, jRes] = await Promise.all([
        fetch('/api/admin/user'),
        fetch('/api/applications'),
        fetch('/api/admin/hse'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/service-requests'),
        fetch('/api/jobs'),
      ]);

      const users = uRes.ok ? await uRes.json() : [];
      setAllUsers(Array.isArray(users) ? users : []);
      setEmployers(Array.isArray(users) ? users.filter((u: any) => u.userType === 'employer') : []);
      setPendingApplications(aRes.ok ? await aRes.json() : []);
      setEnquiries(hRes.ok ? await hRes.json() : []);
      setStats(sRes.ok ? await sRes.json() : { totalUsers: 0, staffCount: 0, hseCount: 0, adminCount: 0 });
      setServiceRequests(srRes.ok ? await srRes.json() : []);
      setAllJobs(jRes.ok ? await jRes.json() : []);
    } catch { 
      toast.error('Data synchronization failed.'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleVerifyAction = async (id: string, type: 'employer' | 'candidate', action: 'approve' | 'reject') => {
    const load = toast.loading('Processing update...');
    try {
      const res = await fetch('/api/admin/verify', { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id, type, action }) 
      });
      if (res.ok) { 
        toast.success('System record updated', { id: load }); 
        fetchAllData(); 
      }
      else toast.error('Action failed', { id: load });
    } catch { 
      toast.error('Connection error', { id: load }); 
    }
  };

  const handleEnquiryStatus = async (id: string, status: string) => {
    const load = toast.loading('Updating...');
    try {
      const res = await fetch('/api/admin/hse', { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id, status }) 
      });
      if (res.ok) { 
        toast.success('Inquiry updated', { id: load }); 
        fetchAllData(); 
      }
    } catch { toast.error('Update failed', { id: load }); }
  };

  const handleServiceRequestStatus = async (id: string, status: string) => {
    const load = toast.loading('Syncing...');
    try {
      const res = await fetch('/api/admin/service-requests', { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id, status }) 
      });
      if (res.ok) { toast.success('Order status updated', { id: load }); fetchAllData(); }
    } catch { toast.error('Update failure', { id: load }); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#112031] flex flex-col items-center justify-center font-sans">
      <div className="w-12 h-12 border-4 border-[#257242] border-t-transparent rounded-full animate-spin mb-6" />
      <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.4em]">Establishing secure connection...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#fcfbf9] text-[#1a2e46] font-sans">
      
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-[90] md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside style={{ transform: sidebarOpen ? 'translateX(0)' : undefined }} className="w-[260px] bg-[#112031] fixed inset-y-0 left-0 border-r border-white/5 z-[100] flex flex-col shadow-2xl -translate-x-full md:translate-x-0 transition-transform duration-500">
        <div className="p-8 border-b border-white/5 flex flex-col items-center">
          <div className="bg-white rounded-2xl p-2 w-14 h-14 flex items-center justify-center shadow-lg mb-4">
             <img src="/logo.png" alt="Obrus" className="w-full h-full object-contain" />
          </div>
          <p className="text-white font-serif font-black text-xl italic uppercase tracking-tighter">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1 mt-6 flex-1 overflow-y-auto custom-scrollbar">
           <AdminNavLink label="Management Hub" active={view === 'dashboard'} onClick={() => switchView('dashboard')} ico={<LayoutDashboard size={17}/>}/>
           <AdminNavLink label="Verify Businesses" active={view === 'employers'} onClick={() => switchView('employers')} ico={<ShieldCheck size={17}/>}/>
           <AdminNavLink label="Staff Vetting" active={view === 'applications'} onClick={() => switchView('applications')} ico={<Briefcase size={17}/>}/>
           <AdminNavLink label="Safety Inquiries" active={view === 'hse'} onClick={() => switchView('hse')} ico={<AlertTriangle size={17}/>}/>
           <AdminNavLink label="Client Orders" active={view === 'servicerequests'} onClick={() => switchView('servicerequests')} ico={<ClipboardList size={17}/>}/>
           <AdminNavLink label="User Registry" active={view === 'users'} onClick={() => switchView('users')} ico={<Users size={17}/>}/>
        </nav>

        <div className="p-8 border-t border-white/5 bg-[#0a1521]">
           <button onClick={() => { localStorage.clear(); window.location.href='/auth'; }} className="flex items-center gap-4 text-red-400/50 hover:text-red-500 font-black text-[10px] transition-all uppercase tracking-[0.3em]">
             <LogOut size={16}/> Revoke Authorization
           </button>
        </div>
      </aside>

      <main className="md:ml-[260px] flex-1 flex flex-col min-h-screen overflow-y-auto custom-scrollbar">
        <header className="h-[75px] bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-[50]">
          <div className="flex items-center gap-5">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-3 rounded-2xl bg-gray-50 text-navy transition-all"><Menu size={20}/></button>
            <h2 className="font-serif text-3xl font-black uppercase tracking-tighter italic text-[#1a2e46] underline decoration-[#257242]/20 underline-offset-8 decoration-4">{view} control</h2>
          </div>
          <div className="flex gap-4">
             <div className="hidden lg:flex bg-[#fcfbf9] px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-300 border italic leading-none items-center gap-3"><Calendar size={13}/> {new Date().toDateString()}</div>
             <button onClick={fetchAllData} className="w-12 h-12 bg-white border rounded-[18px] flex items-center justify-center text-gray-300 hover:text-[#257242] transition-colors"><RefreshCw size={20}/></button>
          </div>
        </header>

        <div className="p-8 md:p-12 pb-32 max-w-[1500px] mx-auto w-full">
          {view === 'dashboard' && (
             <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                   <MetricCard val={stats.totalUsers} label="Total Members" color="navy" ico={<Users size={20}/>} />
                   <MetricCard val={stats.hseCount} label="Field Entries" color="gold" ico={<AlertTriangle size={20}/>} />
                   <MetricCard val={employers.filter(e => e.status === 'pending').length} label="Pending Review" color="red" ico={<ShieldCheck size={20}/>} />
                   <MetricCard val={stats.staffCount} label="Active Staff" color="green" ico={<Briefcase size={20}/>} />
                </div>

                <div className="bg-[#1a2e46] p-16 rounded-[60px] text-white relative overflow-hidden shadow-3xl">
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#257242]/[0.05] rounded-bl-full animate-pulse"></div>
                   <h3 className="font-serif text-5xl font-black mb-6 italic underline decoration-[#c8921e] underline-offset-8">Administrative Status</h3>
                   <p className="text-white/40 text-2xl font-light leading-relaxed max-w-2xl border-l-4 border-[#257242] pl-8">Strategic databases are currently synchronized. Management has full clearance to authorize corporate documentation and verify staff deployment cycles.</p>
                </div>
             </div>
          )}

          {(view === 'employers' || view === 'users') && (
            <div className="bg-white rounded-[60px] shadow-3xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
               <div className="bg-[#112031] text-white p-12 flex justify-between items-center relative overflow-hidden">
                  <div className="relative z-10">
                     <h3 className="font-serif text-4xl font-bold italic tracking-tighter uppercase mb-2 underline decoration-[#c8921e] decoration-4">{view} registry</h3>
                     <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] italic">Official Central Repository</p>
                  </div>
                  <ShieldCheck size={100} className="text-[#257242] absolute right-[-20px] top-[-20px] opacity-10" />
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                     <thead className="bg-[#f9fafb] text-[#1a2e46]/30 uppercase font-black italic">
                        <tr>
                          {view === 'users' ? (<><th className="p-9 text-[10px] tracking-widest">Profile Name</th><th className="p-9 text-[10px] tracking-widest">Division Type</th><th className="p-9 text-[10px] tracking-widest">Authority Role</th><th className="p-9 text-[10px] tracking-widest">Status</th></>) : null}
                          {view === 'employers' ? (<><th className="p-9 text-[10px] tracking-widest">Organization Name</th><th className="p-9 text-[10px] tracking-widest">Contact Link</th><th className="p-9 text-[10px] tracking-widest">Audit ID</th><th className="p-9 text-[10px] tracking-widest text-right">Approval Logic</th></>) : null}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {view === 'users' && allUsers.map((u) => (
                           <tr key={u._id} className="hover:bg-green-50 transition-all">
                              <td className="p-9 flex items-center gap-5">
                                 <div className="w-12 h-12 rounded-2xl bg-navy text-gold flex items-center justify-center font-serif font-black text-xl italic shadow-lg uppercase">{u.name.charAt(0)}</div>
                                 <span className="font-black text-lg text-navy uppercase tracking-tight italic underline decoration-gold/10 underline-offset-4">{u.name}</span>
                              </td>
                              <td className="p-9"><span className="text-[10px] font-black uppercase px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-slate-400">{u.userType} Path</span></td>
                              <td className="p-9 text-xs font-bold text-slate-300 italic uppercase">{u.role} Node</td>
                              <td className="p-9 text-right"><span className={`px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest ${u.status === 'active' ? 'bg-green-50 text-green-700 shadow-inner shadow-green-500/10 border border-green-200' : 'bg-red-50 text-red-600'}`}>{u.status} Node</span></td>
                           </tr>
                        ))}

                        {view === 'employers' && employers.map((emp) => (
                          <tr key={emp._id} className="hover:bg-blue-50/20">
                            <td className="p-9">
                               <h4 className="font-serif font-black text-2xl uppercase tracking-tighter text-navy leading-none mb-1 italic">{emp.employerProfile?.companyName}</h4>
                               <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">{emp.employerProfile?.officeAddress}</p>
                            </td>
                            <td className="p-9 text-sm font-semibold text-[#c8921e] italic underline underline-offset-2 decoration-gold/20">{emp.email}</td>
                            <td className="p-9 font-mono text-[10px] font-black bg-navy text-white px-3 py-1.5 rounded-lg w-fit">REG-{emp.employerProfile?.rcNumber}</td>
                            <td className="p-9 text-right">
                               {emp.status === 'pending' ? (
                                  <div className="flex gap-3 justify-end animate-in fade-in duration-500">
                                     <button onClick={() => handleVerifyAction(emp._id, 'employer', 'approve')} className="w-12 h-12 bg-[#257242] text-white rounded-[18px] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"><CheckCircle size={22}/></button>
                                     <button onClick={() => handleVerifyAction(emp._id, 'employer', 'reject')} className="w-12 h-12 bg-red-100 text-red-500 rounded-[18px] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><XCircle size={22}/></button>
                                  </div>
                               ) : <span className="text-[9px] font-black uppercase text-[#257242] italic">Protocol Clearance Verified</span>}
                            </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {view === 'applications' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {pendingApplications.map((app) => (
                  <div key={app._id} className="bg-white p-14 rounded-[70px] border border-gray-100 shadow-3xl hover:border-[#257242] transition-all duration-700 relative overflow-hidden group">
                     <CheckCircle className="absolute bottom-10 right-10 text-[#257242] opacity-[0.03]" size={150}/>
                     <h3 className="font-serif text-5xl font-bold tracking-tighter text-[#1a2e46] italic leading-none mb-3 underline decoration-[#257242]/10 decoration-8 underline-offset-[-2px]">{app.candidateId?.name}</h3>
                     <p className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] mb-10 pl-2">Vetting Identification: OBR-PL-{app._id.slice(-6).toUpperCase()}</p>
                     
                     <div className="space-y-6 mb-12">
                        <a href={app.cvUrl} target="_blank" className="flex flex-col p-10 bg-gray-50 rounded-[45px] transition-all hover:bg-navy hover:text-white group/btn">
                           <FileText size={24} className="text-[#257242] group-hover/btn:text-[#c8921e] mb-4"/>
                           <span className="text-[11px] font-black uppercase tracking-[0.4em]">Audit Documentation</span>
                        </a>
                        <div className="px-8 flex items-center justify-between text-xs font-bold text-slate-300 italic uppercase">
                           <span>{app.candidateId?.email}</span>
                           <span>{app.candidateId?.phone || 'N/A Contact'}</span>
                        </div>
                     </div>

                     <div className="flex gap-4 border-t pt-10 border-gray-100">
                        <button onClick={() => handleVerifyAction(app._id, 'candidate', 'approve')} className="flex-1 bg-navy text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-[#257242] transition-all transform active:scale-95">Approve Status</button>
                        <button onClick={() => handleVerifyAction(app._id, 'candidate', 'reject')} className="w-16 h-16 rounded-[22px] bg-red-50 text-red-500 border border-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                     </div>
                  </div>
                ))}
             </div>
          )}

          {/* ADDITIONAL VIEWS WOULD FOLLOW HERE (HSE, SERVICES, JOBS) USING THE SAME BRAND COLOR SCHEME */}

        </div>
      </main>

      <style jsx>{`
        .shadow-3xl { box-shadow: 0 45px 120px -25px rgba(26, 46, 70, 0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(37, 114, 66, 0.2); border-radius: 20px; }
      `}</style>
    </div>
  );

  function switchView(v: string) { setView(v); setSidebarOpen(false); }
}

function AdminNavLink({ label, ico, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-6 p-6 rounded-[24px] transition-all font-black text-[11px] uppercase tracking-[0.3em] border-l-4 group italic ${active ? 'bg-[#257242]/10 text-emerald-400 border-[#257242] shadow-2xl' : 'text-white/20 border-transparent hover:text-white hover:bg-white/5'}`}>
       <span className={active ? 'text-[#257242] group-hover:scale-125 duration-500' : 'opacity-10 group-hover:opacity-60 transition-opacity'}>{ico}</span>
       <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

function MetricCard({ val, label, ico, color }: any) {
  const pals: any = { 
     navy: "text-[#112031] border-navy/10 bg-white",
     green: "text-[#257242] border-[#257242]/10 bg-white",
     gold: "text-[#c8921e] border-gold/10 bg-white",
     red: "text-red-600 border-red-100 bg-red-50/50" 
  };
  const iconBgs: any = { 
     navy: "bg-[#112031]/5 text-navy", 
     green: "bg-[#257242]/5 text-[#257242]", 
     gold: "bg-gold-50 text-gold", 
     red: "bg-red-500 text-white" 
  };
  
  return (
    <div className={`p-8 rounded-[45px] border shadow-2xl transition-all duration-700 hover:-translate-y-2 group ${pals[color]}`}>
       <div className={`w-14 h-14 ${iconBgs[color]} rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/5 transition-all duration-700 group-hover:rotate-12`}>{ico}</div>
       <div className="text-4xl font-serif font-black italic tracking-tighter leading-none mb-3 underline decoration-[#257242]/20">{val}</div>
       <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.3em] ml-1 leading-none">{label}</p>
    </div>
  );
}