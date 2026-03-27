"use client";
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, LayoutDashboard, LogOut,
  Globe, Mail, Phone, Calendar,
  Briefcase, FileText, CheckCircle, XCircle,
  ClipboardList, AlertTriangle, Trash2, RefreshCw,
  Menu, X, Users, MapPin, EyeOff, Eye, TrendingUp
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
    } catch { toast.error('Failed to load dashboard data.'); }
    finally { setLoading(false); }
  };

  const handleVerifyAction = async (id: string, type: 'employer' | 'candidate', action: 'approve' | 'reject') => {
    const load = toast.loading('Processing decision...');
    try {
      const res = await fetch('/api/admin/verify', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, type, action }) });
      if (res.ok) { toast.success('Status updated', { id: load }); fetchAllData(); }
      else toast.error('Action failed', { id: load });
    } catch { toast.error('Network error', { id: load }); }
  };

  const handleEnquiryStatus = async (id: string, status: string) => {
    const load = toast.loading('Updating enquiry...');
    try {
      const res = await fetch('/api/admin/hse', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      if (res.ok) { toast.success('Status updated', { id: load }); fetchAllData(); }
    } catch { toast.error('Update failed', { id: load }); }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Delete this inquiry record?')) return;
    const load = toast.loading('Removing record...');
    try {
      const res = await fetch('/api/admin/hse', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (res.ok) { toast.success('Record removed', { id: load }); fetchAllData(); }
    } catch { toast.error('Removal failed', { id: load }); }
  };

  const handleServiceRequestStatus = async (id: string, status: string) => {
    const load = toast.loading('Updating workflow...');
    try {
      const res = await fetch('/api/admin/service-requests', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      if (res.ok) { toast.success('Operational status updated', { id: load }); fetchAllData(); }
    } catch { toast.error('Failed to update', { id: load }); }
  };

  const handleToggleJob = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    const load = toast.loading('Modifying career listing...');
    try {
      const res = await fetch('/api/jobs', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId, status: newStatus }) });
      if (res.ok) { toast.success(`Listing ${newStatus}`, { id: load }); fetchAllData(); }
      else toast.error('Update failure', { id: load });
    } catch { toast.error('Network link error', { id: load }); }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Remove this career opportunity listing?')) return;
    const load = toast.loading('Removing listing...');
    try {
      const res = await fetch('/api/jobs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId }) });
      if (res.ok) { toast.success('Entry archived', { id: load }); fetchAllData(); }
    } catch { toast.error('Action failed', { id: load }); }
  };

  const switchView = (v: string) => { setView(v); setSidebarOpen(false); };

  const priorityStyle = (p: string) => {
    if (p === 'Urgent Dispatch' || p === 'High Priority') return 'bg-red-50 text-red-600 border border-red-100 shadow-sm';
    return 'bg-green-50 text-[#257242] border border-green-100 shadow-sm';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a1521] flex flex-col items-center justify-center font-sans">
      <div className="w-12 h-12 border-2 border-[#257242] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.4em]">Initializing Security Portal...</p>
    </div>
  );

  const navItems = [
    { id: 'dashboard', label: 'Management Hub', ico: <LayoutDashboard size={17}/> },
    { id: 'employers', label: 'Authorize Businesses', ico: <ShieldCheck size={17}/>, badge: employers.filter(e => e.status === 'pending').length },
    { id: 'applications', label: 'Candidate Audit', ico: <Briefcase size={17}/>, badge: pendingApplications.filter((a: any) => a.status === 'pending').length },
    { id: 'hse', label: 'Safety Enquiries', ico: <AlertTriangle size={17}/>, badge: enquiries.filter((e: any) => e.status === 'Pending').length },
    { id: 'servicerequests', label: 'Operational Orders', ico: <ClipboardList size={17}/>, badge: serviceRequests.filter((r: any) => r.status === 'pending').length },
    { id: 'jobs', label: 'Career Listings', ico: <FileText size={17}/> },
    { id: 'users', label: 'Identity Registry', ico: <Users size={17}/> },
  ];

  return (
    <div className="flex min-h-screen bg-[#fcfbf9] text-[#1a2e46] font-sans selection:bg-[#257242]/10">

      {sidebarOpen && <div className="fixed inset-0 bg-black/70 z-[90] md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside style={{ transform: sidebarOpen ? 'translateX(0)' : undefined }} className="w-[260px] bg-[#112031] fixed inset-y-0 left-0 border-r border-white/5 z-[100] flex flex-col shadow-2xl -translate-x-full md:translate-x-0 transition-transform duration-500">
        <div className="p-8 border-b border-white/5 flex flex-col items-center">
          <div className="bg-white rounded-2xl p-2 w-14 h-14 flex items-center justify-center shadow-lg mb-4 group cursor-pointer" onClick={() => window.location.href='/'}>
             <img src="/logo.png" alt="Obrus" className="h-full w-full object-contain group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-white font-serif font-black text-xl italic uppercase tracking-tighter italic">Obrus Admin</p>
        </div>

        <nav className="p-5 flex-1 space-y-2 mt-6 overflow-y-auto custom-scrollbar">
          {navItems.map(item => (
            <button key={item.id} onClick={() => switchView(item.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] transition-all font-black text-[10px] uppercase tracking-widest border-r-4 ${view === item.id ? 'bg-[#257242]/10 text-emerald-400 border-[#257242] shadow-2xl' : 'text-white/20 border-transparent hover:text-white hover:bg-white/5'}`}>
              <span className={view === item.id ? 'text-emerald-400 animate-pulse' : 'opacity-30'}>{item.ico}</span>
              <span className="flex-1 text-left italic">{item.label}</span>
              {item.badge && item.badge > 0 ? <span className="w-5 h-5 bg-[#c8921e] text-[#1a2e46] rounded flex items-center justify-center shrink-0 font-black animate-bounce text-[9px] shadow-lg">{item.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-[#0a1521]">
          <button onClick={() => { localStorage.clear(); window.location.href = '/auth'; }} className="flex items-center gap-4 text-red-400/40 hover:text-red-400 font-bold text-[10px] uppercase tracking-widest transition-all">
            <LogOut size={16}/> Secure Log Out
          </button>
        </div>
      </aside>

      <main className="md:ml-[260px] flex-1 min-h-screen flex flex-col overflow-y-auto custom-scrollbar">
        <header className="h-[75px] bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-[50]">
          <div className="flex items-center gap-5">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-3 rounded-2xl bg-[#112031] text-[#c8921e] transition-all"><Menu size={20}/></button>
            <h2 className="font-serif text-3xl font-black uppercase tracking-tighter italic text-[#1a2e46] decoration-[#257242] underline underline-offset-8 decoration-4 capitalize">{view === 'servicerequests' ? 'Service Operations' : view} management</h2>
          </div>
          <div className="flex gap-4">
             <div className="hidden sm:flex items-center gap-3 bg-[#fcfbf9] px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-slate-300 border italic leading-none"><Calendar size={13} className="text-[#257242]"/> {new Date().toDateString()}</div>
             <Link href="/" className="w-12 h-12 bg-[#112031] rounded-[20px] flex items-center justify-center text-[#c8921e] shadow-xl hover:rotate-12 transition-all"><Globe size={20}/></Link>
          </div>
        </header>

        <div className="p-8 md:p-12 pb-32 max-w-[1500px] mx-auto w-full">

       
          {view === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in duration-1000">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <Stat val={stats.totalUsers} label="Identity Registry" color="green" ico={<Users size={22}/>} />
                <Stat val={stats.hseCount} label="Field Service Records" color="gold" ico={<ClipboardList size={22}/>} />
                <Stat val={employers.filter(e => e.status === 'pending').length} label="Pending Business Authorization" color="red" ico={<ShieldCheck size={22}/>} />
                <Stat val={stats.staffCount} label="Approved Internal Staff" color="navy" ico={<Briefcase size={22}/>} />
              </div>

              <div className="bg-[#112031] p-16 rounded-[60px] text-white relative overflow-hidden shadow-3xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#257242]/[0.06] rounded-full animate-pulse" />
                <CheckCircle className="absolute bottom-10 right-10 text-[#c8921e]/[0.04]" size={200}/>
                <span className="text-[#c8921e] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block italic">Admin Hub Access Active</span>
                <h3 className="font-serif text-5xl font-black mb-8 italic tracking-tighter">Centralized Decision Loop</h3>
                <p className="text-white/40 text-2xl font-light italic leading-relaxed max-w-2xl border-l-4 border-[#257242] pl-8">Recruitment vetting is optimized and Environmental Lead tracking is fully functional across Nigeria Sector Nodes.</p>
                <button onClick={fetchAllData} className="mt-14 px-8 py-3.5 bg-[#257242] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-green-700 active:scale-95 transition-all">Synchronize Operations Now</button>
              </div>

             
              <div className="bg-white rounded-[50px] shadow-3xl overflow-hidden border border-gray-100">
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                   <h4 className="font-serif text-2xl font-bold italic text-[#1a2e46] uppercase italic underline decoration-[#257242]/20">Latest Active Requests</h4>
                   <button onClick={() => setView('servicerequests')} className="text-[#c8921e] text-[10px] font-black uppercase hover:underline">Vett registry logs →</button>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-slate-300 font-black italic">
                    <tr>
                      <th className="p-8 text-[10px] uppercase">Identity</th>
                      <th className="p-8 text-[10px] uppercase">Mission Area</th>
                      <th className="p-8 text-[10px] uppercase">Urgency</th>
                      <th className="p-8 text-[10px] uppercase text-right">Synchronization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {serviceRequests.slice(0, 6).map((req: any) => (
                      <tr key={req._id} className="hover:bg-[#257242]/[0.02] transition-colors group">
                        <td className="p-8 font-black uppercase text-xs italic tracking-tighter text-[#1a2e46] group-hover:translate-x-2 transition-transform duration-500">{req.userId?.name || 'Inbound Unregistered'}</td>
                        <td className="p-8 font-serif font-black text-xl italic text-navy opacity-80">{req.serviceType}</td>
                        <td className="p-8"><span className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg ${priorityStyle(req.priority)}`}>{req.priority}</span></td>
                        <td className="p-8 text-right font-black text-[10px] text-gray-300 uppercase tracking-tighter">{req.status} LOGGED</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

         
          {view === 'employers' && (
            <div className="bg-white rounded-[60px] shadow-3xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-500">
              <div className="bg-[#1a2e46] p-12 flex justify-between items-center text-white">
                 <div>
                   <h3 className="font-serif text-4xl font-bold italic uppercase tracking-tighter underline decoration-[#257242] decoration-4 mb-2">Registry Audit</h3>
                   <p className="text-[#c8921e] text-[9px] font-black uppercase tracking-[0.4em] italic opacity-80 leading-none">Awaiting Corporate Approval Protocols</p>
                 </div>
                 <ShieldCheck size={70} className="text-[#257242] opacity-40"/>
              </div>
              <table className="w-full text-left">
                <thead className="bg-[#f9fafb] text-[#1a2e46]/30 uppercase font-black italic">
                   <tr><th className="p-9 text-[10px]">Business Identity</th><th className="p-9 text-[10px]">Digital Path</th><th className="p-9 text-[10px]">Official Registry</th><th className="p-9 text-[10px] text-right">Authorize</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employers.map((emp) => (
                    <tr key={emp._id} className="hover:bg-[#257242]/[0.01]">
                      <td className="p-9">
                        <h4 className="font-serif font-black italic text-3xl uppercase tracking-tighter text-[#112031] leading-none mb-1 group-hover:text-[#257242] transition-colors">{emp.employerProfile?.companyName || "Industrial Body"}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{emp.employerProfile?.officeAddress}</p>
                      </td>
                      <td className="p-9 font-semibold text-xs text-[#c8921e] italic underline decoration-[#c8921e]/20">{emp.email}</td>
                      <td className="p-9"><span className="text-[10px] font-black bg-navy text-white px-3 py-1.5 rounded-lg">REG-{emp.employerProfile?.rcNumber}</span></td>
                      <td className="p-9 text-right">
                         {emp.status === 'pending' ? (
                            <div className="flex gap-4 justify-end">
                               <button onClick={() => handleVerifyAction(emp._id, 'employer', 'approve')} className="w-14 h-14 bg-[#257242] text-white rounded-[24px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"><CheckCircle size={22}/></button>
                               <button onClick={() => handleVerifyAction(emp._id, 'employer', 'reject')} className="w-14 h-14 bg-red-100 text-red-500 rounded-[24px] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10"><XCircle size={22}/></button>
                            </div>
                         ) : <div className="inline-flex items-center gap-2 text-[10px] font-black text-[#257242] uppercase shadow-sm border border-green-50 px-4 py-2 rounded-full italic"><CheckCircle size={14}/> Node Established</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

         
          {view === 'applications' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {pendingApplications.map((app: any) => (
                  <div key={app._id} className="bg-white p-14 rounded-[70px] border border-gray-100 shadow-3xl hover:border-[#257242] transition-all duration-700 relative overflow-hidden group border-t-8 border-[#112031]">
                     <CheckCircle className="absolute top-10 right-10 text-[#257242]/[0.05] group-hover:scale-150 group-hover:rotate-12 transition-transform duration-1000" size={150}/>
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c8921e] italic block mb-2 leading-none animate-pulse">Authentication Pending Review</span>
                     <h3 className="font-serif text-5xl font-black tracking-tighter text-[#112031] leading-none mb-1 group-hover:text-[#257242] transition-colors">{app.candidateId?.name}</h3>
                     <p className="text-[10px] text-gray-300 font-bold tracking-[0.2em] mb-12 uppercase italic decoration-gold/40 underline decoration-2 underline-offset-4">Ref: OBRUS-AUDIT-22{app._id.slice(-4)}</p>
                     
                     <div className="space-y-6 mb-12 relative z-10">
                        <a href={app.cvUrl} target="_blank" className="flex flex-col p-12 bg-gray-50 border border-navy/5 rounded-[45px] hover:bg-[#112031] group/cv transition-all shadow-xl shadow-navy/5">
                           <FileText size={24} className="text-[#257242] mb-6 group-hover/cv:text-[#c8921e] group-hover/cv:scale-125 transition-transform"/>
                           <span className="text-[10px] font-black uppercase text-[#112031] group-hover/cv:text-white tracking-[0.5em]">Audit Registry Docs</span>
                        </a>
                        <div className="flex flex-col gap-4 text-xs font-black uppercase text-[#1a2e46]/30 px-4">
                           <span className="flex items-center gap-4"><Mail size={12}/> {app.candidateId?.email}</span>
                           <span className="flex items-center gap-4"><Globe size={12}/> Applied Tier: Industrial Safety</span>
                        </div>
                     </div>

                     {app.status === 'pending' && (
                        <div className="flex gap-4 border-t pt-10 border-navy/5">
                           <button onClick={() => handleVerifyAction(app._id, 'candidate', 'approve')} className="flex-1 py-5 bg-[#112031] text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-[#257242] transition-all transform active:scale-95 shadow-navy/40">Verify Status</button>
                           <button onClick={() => handleVerifyAction(app._id, 'candidate', 'reject')} className="p-5 bg-red-100 text-red-500 rounded-full border border-red-50 hover:bg-red-500 hover:text-white transition-all shadow-inner"><XCircle size={18}/></button>
                        </div>
                     )}
                  </div>
                ))}
             </div>
          )}

        
          {view === 'users' && (
             <div className="bg-white rounded-[55px] shadow-3xl overflow-hidden border border-gray-100">
                <div className="p-12 border-b bg-[#112031] text-white flex justify-between items-center relative overflow-hidden">
                   <Users className="absolute right-0 top-0 text-white/[0.02] -rotate-12" size={200} />
                   <div><h3 className="font-serif text-5xl font-black italic">User registry</h3><p className="text-[#c8921e] text-[9px] font-black uppercase tracking-[0.5em] italic">Accessing Master identity Table</p></div>
                   <Search size={32} className="opacity-10 text-emerald-400"/>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-[#fcfbf9] text-gray-400 font-black italic">
                         <tr><th className="p-10 text-[10px] tracking-widest">Operator Name</th><th className="p-10 text-[10px] tracking-widest text-center">Division Category</th><th className="p-10 text-[10px] tracking-widest">Authority Type</th><th className="p-10 text-[10px] tracking-widest text-right">Synchronization Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {allUsers.map((u:any) => (
                           <tr key={u._id} className="hover:bg-green-50/50 transition-colors">
                              <td className="p-10">
                                 <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-navy text-gold flex items-center justify-center font-serif font-black text-2xl shadow-xl italic uppercase shadow-gold/20">{u.name.charAt(0)}</div>
                                    <div className="leading-tight">
                                       <span className="block font-black text-xl text-navy uppercase tracking-tighter italic decoration-[#257242]/20 underline underline-offset-2">{u.name}</span>
                                       <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1 opacity-50 italic">Key: {u._id.substring(0,8).toUpperCase()}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-10 text-center"><span className="text-[10px] font-black uppercase px-6 py-2.5 bg-[#f5f0e8] text-gray-500 rounded-full italic tracking-[0.15em] border border-gray-100">{u.userType} loop</span></td>
                              <td className="p-10"><span className={`text-[10px] font-bold px-3 py-1 bg-[#1a2e46] text-[#c8921e] rounded shadow-inner shadow-[#000]/10 uppercase italic`}>{u.role}</span></td>
                              <td className="p-10 text-right"><span className={`px-5 py-2.5 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-inner shadow-green-900/10 border ${u.status==='active'?'text-[#257242] border-[#257242]/30':'text-gray-300 border-gray-100 opacity-20 italic'}`}>{u.status} Node Established</span></td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(37, 114, 66, 0.2); border-radius: 20px; }
        .shadow-3xl { box-shadow: 0 45px 120px -25px rgba(26, 46, 70, 0.1); }
      `}</style>
    </div>
  );
}

function Stat({ val, label, sub, color, ico }: any) {
  const pals: any = {
    green: "bg-green-100/10 text-[#257242] border-[#257242]/10",
    gold: "bg-gold-50/50 text-[#c8921e] border-[#c8921e]/10",
    red: "bg-red-50/80 text-red-500 border-red-200 shadow-xl shadow-red-600/5",
    navy: "bg-[#112031]/5 text-[#112031] border-navy/10"
  };
  const iconStyle: any = {
    green: "bg-[#257242] text-white", gold: "bg-[#c8921e] text-white", red: "bg-red-500 text-white", navy: "bg-[#112031] text-white"
  };
  
  return (
    <div className={`p-8 md:p-10 bg-white rounded-[50px] border shadow-2xl transition-all duration-700 hover:-translate-y-3 group ${pals[color]}`}>
       <div className={`w-16 h-16 ${iconStyle[color]} rounded-[22px] flex items-center justify-center mb-8 shadow-2xl transition-all group-hover:rotate-12 duration-1000`}>
         {ico}
       </div>
       <h4 className="text-5xl font-serif font-black italic tracking-tighter text-[#112031] leading-none mb-3 underline decoration-[#257242]/20">{val}</h4>
       <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1 leading-none italic">{label}</p>
       <span className="text-[9px] font-bold text-gray-300 italic uppercase block mt-2 ml-1 opacity-60 leading-none">{sub}</span>
    </div>
  );
}