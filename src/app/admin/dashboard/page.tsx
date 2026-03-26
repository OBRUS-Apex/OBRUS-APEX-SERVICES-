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
    const load = toast.loading('Processing...');
    try {
      const res = await fetch('/api/admin/verify', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, type, action }) });
      if (res.ok) { toast.success('Updated successfully', { id: load }); fetchAllData(); }
      else toast.error('Action failed', { id: load });
    } catch { toast.error('Network error', { id: load }); }
  };

  const handleEnquiryStatus = async (id: string, status: string) => {
    const load = toast.loading('Updating...');
    try {
      const res = await fetch('/api/admin/hse', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      if (res.ok) { toast.success('Enquiry updated', { id: load }); fetchAllData(); }
    } catch { toast.error('Update failed', { id: load }); }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Delete this enquiry permanently?')) return;
    const load = toast.loading('Deleting...');
    try {
      const res = await fetch('/api/admin/hse', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (res.ok) { toast.success('Deleted', { id: load }); fetchAllData(); }
    } catch { toast.error('Delete failed', { id: load }); }
  };

  const handleServiceRequestStatus = async (id: string, status: string) => {
    const load = toast.loading('Updating...');
    try {
      const res = await fetch('/api/admin/service-requests', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      if (res.ok) { toast.success('Updated', { id: load }); fetchAllData(); }
    } catch { toast.error('Update failed', { id: load }); }
  };

  const handleToggleJob = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    const load = toast.loading('Updating job...');
    try {
      const res = await fetch('/api/jobs', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId, status: newStatus }) });
      if (res.ok) { toast.success(`Job ${newStatus}`, { id: load }); fetchAllData(); }
      else toast.error('Failed to update', { id: load });
    } catch { toast.error('Network error', { id: load }); }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Delete this job listing permanently?')) return;
    const load = toast.loading('Deleting...');
    try {
      const res = await fetch('/api/jobs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId }) });
      if (res.ok) { toast.success('Deleted', { id: load }); fetchAllData(); }
    } catch { toast.error('Delete failed', { id: load }); }
  };

  const switchView = (v: string) => { setView(v); setSidebarOpen(false); };

  const priorityStyle = (p: string) => {
    if (p === 'Urgent Dispatch') return 'bg-red-50 text-red-500';
    if (p === 'High Priority') return 'bg-amber-50 text-amber-600';
    return 'bg-green-50 text-[#257242]';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#112031] flex flex-col items-center justify-center font-sans">
      <div className="w-10 h-10 border-2 border-[#257242] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-white/30 font-semibold uppercase text-xs tracking-widest italic">Authenticating Access Hub...</p>
    </div>
  );

  const viewTitles: Record<string, string> = {
    dashboard: 'Administrative Overview', employers: 'Corporate Verification',
    applications: 'Recruitment Vetting', hse: 'Safety Logs',
    servicerequests: 'Operational Orders', jobs: 'Career Inventory', users: 'User Registry',
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', ico: <LayoutDashboard size={17}/> },
    { id: 'employers', label: 'Verify Businesses', ico: <ShieldCheck size={17}/>, badge: employers.filter(e => e.status === 'pending').length },
    { id: 'applications', label: 'Vett Candidates', ico: <Briefcase size={17}/>, badge: pendingApplications.filter((a: any) => a.status === 'pending').length },
    { id: 'hse', label: 'Safety Inquiries', ico: <AlertTriangle size={17}/>, badge: enquiries.filter((e: any) => e.status === 'Pending').length },
    { id: 'servicerequests', label: 'Order Pipeline', ico: <ClipboardList size={17}/>, badge: serviceRequests.filter((r: any) => r.status === 'pending').length },
    { id: 'jobs', label: 'Job Catalog', ico: <FileText size={17}/> },
    { id: 'users', label: 'Identity Manager', ico: <Users size={17}/> },
  ];

  return (
    <div className="flex min-h-screen bg-[#fcfbf9] text-[#1a2e46] font-sans selection:bg-[#257242]/10">

      {sidebarOpen && <div className="fixed inset-0 bg-black/70 z-[90] md:hidden" onClick={() => setSidebarOpen(false)} />}

    
      <aside
        style={{ transform: sidebarOpen ? 'translateX(0)' : undefined }}
        className="w-[260px] bg-[#112031] fixed inset-y-0 left-0 border-r border-white/5 z-[100] flex flex-col shadow-2xl -translate-x-full md:translate-x-0 transition-transform duration-300"
      >
        <div className="p-6 border-b border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-white rounded-lg p-1 w-11 h-11 flex items-center justify-center shadow-lg">
                <img src="/logo.png" alt="OBRUS" className="h-full w-full object-contain" />
             </div>
             <div className="text-white">
                <p className="font-serif font-bold text-lg leading-tight tracking-tighter italic">OBRUS APEX</p>
                <p className="text-[#257242] text-[8px] font-black uppercase tracking-[0.2em]">Management Hub</p>
             </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 mt-4 flex-1 overflow-y-auto custom-scrollbar">
          {navItems.map(item => (
            <button key={item.id} onClick={() => switchView(item.id)} className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all font-bold text-[11px] uppercase tracking-widest border-r-4 ${view === item.id ? 'bg-[#257242]/10 text-[#257242] border-[#257242] shadow-inner' : 'text-white/30 border-transparent hover:bg-white/5 hover:text-white'}`}>
              <span className={view === item.id ? 'text-[#257242]' : 'opacity-20'}>{item.ico}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && item.badge > 0 ? <span className="w-5 h-5 bg-[#c8921e] text-[#1a2e46] rounded flex items-center justify-center shrink-0 animate-bounce">{item.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-[#0a1521]">
          <button onClick={() => { localStorage.clear(); window.location.href = '/auth'; }} className="flex items-center gap-3 text-red-400/40 hover:text-red-400 font-bold text-[10px] uppercase tracking-widest transition-all">
            <LogOut size={16}/> Terminate Link
          </button>
        </div>
      </aside>

   
      <main className="md:ml-[260px] flex-1 min-h-screen flex flex-col overflow-y-auto">

        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-5 md:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-3 rounded-xl bg-gray-50 text-[#1a2e46] transition-all"><Menu size={22}/></button>
            <h2 className="font-serif text-2xl font-black italic text-[#1a2e46] tracking-tighter decoration-[#257242]/20 underline decoration-4">{viewTitles[view]}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchAllData} className="p-2.5 rounded-xl text-gray-300 hover:text-[#257242] hover:bg-[#257242]/5 transition-all"><RefreshCw size={18}/></button>
            <div className="hidden sm:flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 bg-[#f9fafb] px-5 py-2.5 rounded-full border border-gray-100">
               <Calendar size={13}/> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long' })}
            </div>
            <Link href="/" className="w-11 h-11 rounded-xl bg-[#1a2e46] flex items-center justify-center text-[#c8921e] shadow-xl hover:scale-105 transition-all">
              <Globe size={18}/>
            </Link>
          </div>
        </header>

        <div className="p-5 md:p-10 pb-32 w-full max-w-[1400px] mx-auto">

        
          {view === 'dashboard' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Stat val={stats.totalUsers} label="Identity Nodes" color="green" ico={<Users size={20}/>} />
                <Stat val={stats.hseCount} label="Field Enquiries" color="gold" ico={<ShieldCheck size={20}/>} />
                <Stat val={employers.filter(e => e.status === 'pending').length} label="Vetting Alert" color="red" ico={<AlertTriangle size={20}/>} />
                <Stat val={serviceRequests.filter((r: any) => r.status === 'pending').length} label="New Orders" color="green" ico={<TrendingUp size={20}/>} />
              </div>

              <div className="bg-gradient-to-r from-[#1a2e46] to-[#112031] p-10 md:p-16 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#257242]/[0.06] rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
                <CheckCircle className="absolute bottom-10 right-10 text-white/5" size={160}/>
                <span className="bg-[#257242] text-white text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full mb-6 inline-block shadow-lg">HUB OPS SECURED</span>
                <h3 className="font-serif text-3xl md:text-5xl font-bold mb-6 italic tracking-tighter">Unified Mission Control</h3>
                <p className="text-white/40 text-lg md:text-xl leading-relaxed max-w-2xl italic font-medium mb-10">Cross-departmental diagnostics complete. Current personnel count is stable at {stats.staffCount} vetted members.</p>
                <div className="flex gap-4 flex-wrap">
                   <button onClick={() => switchView('employers')} className="bg-[#c8921e] text-[#112031] px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">Registry Audit</button>
                   <button onClick={() => switchView('servicerequests')} className="bg-white/5 border border-white/20 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Pipeline Activity</button>
                </div>
              </div>

              
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-7 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold uppercase text-xs tracking-widest text-[#1a2e46] opacity-40 italic">Real-Time Request Stream</h3>
                  <button onClick={() => switchView('servicerequests')} className="text-[10px] font-black uppercase tracking-widest text-[#257242] hover:underline">Inspect Log →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#f9fafb] text-gray-400 uppercase font-black">
                      <tr>
                        <th className="p-5 text-[9px] tracking-widest">Client Identity</th>
                        <th className="p-5 text-[9px] tracking-widest">Assigned Division</th>
                        <th className="p-5 text-[9px] tracking-widest">Protocol Index</th>
                        <th className="p-5 text-[9px] tracking-widest text-right">Synchronization</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {serviceRequests.slice(0, 6).map((req: any) => (
                        <tr key={req._id} className="hover:bg-green-50/30 transition-all">
                          <td className="p-5 font-black text-xs text-[#1a2e46] uppercase italic">{req.userId?.name || 'NODE UNKNOWN'}</td>
                          <td className="p-5 font-serif font-bold text-base text-[#1a2e46]">{req.serviceType}</td>
                          <td className="p-5"><span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm ${priorityStyle(req.priority)}`}>{req.priority}</span></td>
                          <td className="p-5 text-right font-black text-[10px] text-gray-400 uppercase tracking-tighter italic">{req.status} Node Established</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

         
          {(view === 'employers' || view === 'hse' || view === 'servicerequests' || view === 'jobs' || view === 'users') && (
            <div className="bg-white rounded-[40px] shadow-3xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
               <div className="bg-[#112031] text-white p-10 flex justify-between items-center relative overflow-hidden">
                  <div className="relative z-10">
                     <h3 className="font-serif text-4xl font-bold italic tracking-tighter italic mb-2 leading-none uppercase underline decoration-[#257242] decoration-4">{viewTitles[view]} Registry</h3>
                     <p className="text-[#c8921e] text-[9px] font-black uppercase tracking-[0.3em] ml-1 italic opacity-80 leading-none">Internal Registry · Authorized Area</p>
                  </div>
                  <CheckCircle size={80} className="text-[#257242] absolute right-[-10px] top-[-10px] opacity-10" />
               </div>
               
               <div className="overflow-x-auto">
              
                 <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-[#f9fafb] text-[#1a2e46]/30 uppercase italic font-black">
                      <tr>
                        {view === 'users' ? (<><th className="p-6 text-[10px] tracking-widest">Identified Name</th><th className="p-6 text-[10px] tracking-widest">Path</th><th className="p-6 text-[10px] tracking-widest">Credentials</th><th className="p-6 text-[10px] tracking-widest">Since</th><th className="p-6 text-[10px] tracking-widest">Hub</th></>) : null}
                        {view === 'employers' ? (<><th className="p-6 text-[10px] tracking-widest">Company Node</th><th className="p-6 text-[10px] tracking-widest">Email Chain</th><th className="p-6 text-[10px] tracking-widest">Doc Ref</th><th className="p-6 text-[10px] tracking-widest">Registry Status</th><th className="p-6 text-[10px] tracking-widest text-right">Approval Protocol</th></>) : null}
                       
                        {view === 'hse' ? (<><th className="p-6 text-[10px] tracking-widest">Personnel</th><th className="p-6 text-[10px] tracking-widest">Subject</th><th className="p-6 text-[10px] tracking-widest">Detailed Brief</th><th className="p-6 text-[10px] tracking-widest">Trace</th><th className="p-6 text-[10px] tracking-widest">Status</th><th className="p-6 text-[10px] tracking-widest text-right">Manage</th></>) : null}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                   
                       {view === 'users' && allUsers.map((u: any) => (
                         <tr key={u._id} className="hover:bg-green-50 transition-colors group">
                           <td className="p-6 font-black uppercase text-xs tracking-tighter italic text-[#1a2e46]">{u.name}</td>
                           <td className="p-6"><span className="bg-[#1a2e46]/5 text-[#1a2e46] text-[8px] font-black uppercase px-2.5 py-1 rounded-md">{u.userType}</span></td>
                           <td className="p-6 font-bold text-[9px] uppercase tracking-widest italic text-gray-300">{u.role} NODE</td>
                           <td className="p-6 text-[10px] font-bold text-gray-400">{new Date(u.createdAt).toDateString()}</td>
                           <td className="p-6 text-right"><div className={`w-2 h-2 rounded-full mx-auto ${u.status==='active'?'bg-[#257242] animate-pulse':'bg-gray-200'}`}/></td>
                         </tr>
                       ))}

                       
                       {view === 'employers' && employers.map((emp: any) => (
                         <tr key={emp._id} className="hover:bg-gray-50/50">
                           <td className="p-6"><h4 className="font-serif font-black italic text-xl uppercase tracking-tighter leading-none text-[#1a2e46] mb-1">{emp.employerProfile?.companyName || 'IDENT-HUB'}</h4><p className="text-[10px] text-gray-400 font-bold italic tracking-wider">{emp.employerProfile?.officeAddress}</p></td>
                           <td className="p-6 text-xs font-semibold text-gray-400">{emp.email}</td>
                           <td className="p-6 font-mono text-[10px] text-[#257242] font-black uppercase">RC-{emp.employerProfile?.rcNumber}</td>
                           <td className="p-6"><span className={`text-[8px] font-black px-3 py-1.5 rounded-lg border-2 ${emp.status==='active'?'border-[#257242]/20 text-[#257242] uppercase shadow-sm':'border-[#c8921e]/20 text-[#c8921e]'}`}>{emp.status} NODE</span></td>
                           <td className="p-6 text-right">
                              {emp.status === 'pending' && (
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => handleVerifyAction(emp._id, 'employer', 'approve')} className="w-10 h-10 bg-[#257242] text-white rounded-xl shadow-lg shadow-[#257242]/30 flex items-center justify-center transition-all active:scale-90 hover:scale-105"><CheckCircle size={18}/></button>
                                  <button onClick={() => handleVerifyAction(emp._id, 'employer', 'reject')} className="w-10 h-10 bg-red-100 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><XCircle size={18}/></button>
                                </div>
                              )}
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
                {pendingApplications.map((app:any) => (
                  <div key={app._id} className="bg-white p-12 rounded-[55px] border-l-[16px] border-[#257242] shadow-2xl hover:border-r-[16px] hover:border-l-0 transition-all duration-700 relative overflow-hidden group">
                     <ShieldCheck className="absolute top-10 right-10 opacity-[0.03]" size={140}/>
                     <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#257242] mb-3 italic">Identity Pending Authorization</p>
                     <h3 className="font-serif text-4xl font-bold tracking-tighter italic text-[#1a2e46] leading-none mb-1">{app.candidateId?.name}</h3>
                     <p className="text-gray-300 text-[10px] font-bold tracking-widest mb-10 border-b border-gray-100 pb-5 uppercase">Ref: OBRUS-AUDIT-{app._id.slice(-5)}</p>
                     <div className="grid grid-cols-2 gap-6 mb-12">
                        <a href={app.cvUrl} target="_blank" className="flex flex-col p-6 bg-gray-50 rounded-[30px] shadow-inner group/btn transition-all hover:bg-[#112031] hover:text-white">
                           <FileText size={20} className="text-[#257242] group-hover/btn:text-[#c8921e] transition-colors mb-3"/>
                           <span className="text-[10px] font-black uppercase tracking-[0.25em]">Audit Files</span>
                        </a>
                        <div className="flex flex-col p-6 border-2 border-gray-50 rounded-[30px]">
                           <MapPin size={20} className="text-gray-300 mb-3"/>
                           <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-30 italic">{app.candidateId?.email.split('@')[0]}</span>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => handleVerifyAction(app._id, 'candidate', 'approve')} className="flex-1 bg-[#1a2e46] text-white py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-[#257242] active:scale-95 transition-all">Establish Clear Status</button>
                        <button onClick={() => handleVerifyAction(app._id, 'candidate', 'reject')} className="px-6 py-4 rounded-3xl text-red-500 border-2 border-red-50 hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
                     </div>
                  </div>
                ))}
             </div>
          )}

        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(37, 114, 66, 0.2); border-radius: 20px; }
      `}</style>
    </div>
  );
}

function Stat({ val, label, sub, color }: any) {
  const pal: any = {
    green: "border-[#257242]/20 bg-white group-hover:border-[#257242]",
    gold: "border-[#c8921e]/20 bg-white group-hover:border-[#c8921e]",
    red: "border-red-100 bg-white group-hover:border-red-500 shadow-lg shadow-red-500/5",
  };
  const iconBg: any = {
    green: "bg-[#257242]/5 text-[#257242]",
    gold: "bg-[#c8921e]/5 text-[#c8921e]",
    red: "bg-red-50 text-red-500",
  };
  return (
    <div className={`p-8 rounded-[40px] border shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${pal[color]}`}>
      <div className={`w-14 h-14 ${iconBg[color]} rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/5 transition-all duration-700 group-hover:rotate-12`}>{ico}</div>
      <h4 className="text-4xl font-serif font-black italic tracking-tighter text-[#1a2e46] leading-none mb-3 underline decoration-[#257242]/20">{val}</h4>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em] ml-1 leading-none">{label}</p>
      <span className="text-[9px] font-bold text-gray-300 italic uppercase block mt-1 ml-1">{sub}</span>
    </div>
  );
}

