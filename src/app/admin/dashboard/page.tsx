"use client";
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, LayoutDashboard, LogOut,
  Globe, Mail, Phone, Calendar,
  Briefcase, FileText, CheckCircle, XCircle,
  ClipboardList, AlertTriangle, Trash2, RefreshCw,
  Menu, X, Users, MapPin, EyeOff, Eye
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
    return 'bg-green-50 text-green-600';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#112031] flex flex-col items-center justify-center font-sans">
      <div className="w-10 h-10 border-2 border-[#257242] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-white/30 font-semibold uppercase text-xs tracking-widest">Loading dashboard...</p>
    </div>
  );

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard', employers: 'Business Approvals',
    applications: 'Candidate Vetting', hse: 'HSE Enquiries',
    servicerequests: 'Client Requests', jobs: 'All Job Listings', users: 'User Management',
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', ico: <LayoutDashboard size={17}/> },
    { id: 'employers', label: 'Business Approvals', ico: <ShieldCheck size={17}/>, badge: employers.filter(e => e.status === 'pending').length },
    { id: 'applications', label: 'Candidate Vetting', ico: <Briefcase size={17}/>, badge: pendingApplications.filter((a: any) => a.status === 'pending').length },
    { id: 'hse', label: 'HSE Enquiries', ico: <AlertTriangle size={17}/>, badge: enquiries.filter((e: any) => e.status === 'Pending').length },
    { id: 'servicerequests', label: 'Client Requests', ico: <ClipboardList size={17}/>, badge: serviceRequests.filter((r: any) => r.status === 'pending').length },
    { id: 'jobs', label: 'Job Listings', ico: <FileText size={17}/> },
    { id: 'users', label: 'User Management', ico: <Users size={17}/> },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-[#1a2e46] font-sans">

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-[90] md:hidden" onClick={() => setSidebarOpen(false)} />}

   
      <aside
        style={{ transform: sidebarOpen ? 'translateX(0)' : undefined }}
        className="w-[260px] bg-[#112031] fixed inset-y-0 left-0 border-r border-white/5 z-[100] flex flex-col shadow-2xl -translate-x-full md:translate-x-0 transition-transform duration-300"
      >
        <div className="p-5 border-b border-white/5 flex items-start justify-between">
          <div>
            <div className="bg-white rounded-xl px-2 py-1.5 inline-block">
              <img src="/logo.png" alt="OBRUS Apex Services" className="h-8 w-auto" />
            </div>
            <p className="text-[#4ade80] text-[10px] uppercase tracking-widest opacity-60 mt-2 ml-1">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/30 hover:text-white transition-all mt-1">
            <X size={18}/>
          </button>
        </div>

        <nav className="p-4 space-y-1 mt-4 flex-1 overflow-y-auto custom-scrollbar">
          {navItems.map(item => (
            <button key={item.id} onClick={() => switchView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border-l-4 ${view === item.id ? 'bg-[#257242]/20 text-[#4ade80] border-[#257242]' : 'text-white/30 border-transparent hover:text-white hover:bg-white/5'}`}>
              <span className={view === item.id ? 'text-[#4ade80]' : 'opacity-40'}>{item.ico}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && item.badge > 0 ? <span className="w-5 h-5 bg-[#257242] text-white rounded-full text-[9px] font-black flex items-center justify-center shrink-0">{item.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={() => { localStorage.clear(); window.location.href = '/auth'; }} className="flex items-center gap-3 text-red-400/50 hover:text-red-400 font-semibold text-xs uppercase tracking-widest transition-all">
            <LogOut size={15}/> Log Out
          </button>
        </div>
      </aside>

   
      <main className="md:ml-[260px] flex-1 min-h-screen flex flex-col overflow-y-auto">

        <header className="h-[64px] bg-white border-b border-[rgba(26,46,70,0.06)] flex items-center justify-between px-5 md:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-xl border border-[rgba(26,46,70,0.08)] text-[#1a2e46]/40 hover:text-[#257242] hover:border-[#257242] transition-all"><Menu size={19}/></button>
            <h2 className="font-serif text-xl md:text-2xl font-bold italic text-[#1a2e46] tracking-tight">{viewTitles[view]}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchAllData} className="p-2 rounded-xl text-[#1a2e46]/30 hover:text-[#257242] hover:bg-[#257242]/10 transition-all" title="Refresh"><RefreshCw size={17}/></button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-[rgba(26,46,70,0.06)]">
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <Link href="/" className="w-9 h-9 rounded-xl border border-[rgba(26,46,70,0.08)] flex items-center justify-center text-[#1a2e46]/30 hover:text-[#257242] hover:border-[#257242] transition-all">
              <Globe size={17}/>
            </Link>
          </div>
        </header>

        <div className="p-5 md:p-10 pb-24 w-full max-w-[1400px] mx-auto">

       
          {view === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <Stat val={stats.totalUsers} label="Total Users" sub="All roles" />
                <Stat val={stats.hseCount} label="HSE Enquiries" sub="All time" />
                <Stat val={employers.filter(e => e.status === 'pending').length} label="Pending Approvals" sub="Need action" />
                <Stat val={serviceRequests.filter((r: any) => r.status === 'pending').length} label="Open Requests" sub="Client requests" />
              </div>

              <div className="bg-[#1a2e46] p-8 md:p-14 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#257242]/[0.08] rounded-bl-full pointer-events-none" />
                <CheckCircle className="absolute bottom-8 right-8 text-[#257242]/[0.12]" size={140}/>
                <h3 className="font-serif text-2xl md:text-4xl font-bold mb-4 italic">All systems running</h3>
                <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl mb-6">Recruitment, client requests, HSE enquiries, and business onboarding are all active.</p>
                <div className="flex gap-3 flex-wrap">
                  <span className="px-4 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-[#4ade80]">System Active</span>
                  <span className="px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-xs font-bold uppercase tracking-widest text-green-300">{stats.staffCount} Staff Members</span>
                  <span className="px-4 py-2 rounded-full border border-[#257242]/40 bg-[#257242]/10 text-xs font-bold uppercase tracking-widest text-green-300">{allJobs.length} Job Listings</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[rgba(26,46,70,0.06)] overflow-hidden shadow-sm">
                <div className="p-5 md:p-7 border-b border-[rgba(26,46,70,0.05)] flex items-center justify-between">
                  <h3 className="font-semibold text-[#1a2e46]">Recent Client Requests</h3>
                  <button onClick={() => setView('servicerequests')} className="text-xs font-semibold text-[#257242] hover:underline">View all â†’</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[400px]">
                    <thead className="bg-[#f1f5f9] text-[#1a2e46]/40 uppercase">
                      <tr>
                        <th className="p-4 text-[10px] font-bold tracking-widest">Client</th>
                        <th className="p-4 text-[10px] font-bold tracking-widest">Service</th>
                        <th className="p-4 text-[10px] font-bold tracking-widest">Priority</th>
                        <th className="p-4 text-[10px] font-bold tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {serviceRequests.slice(0, 5).map((req: any) => (
                        <tr key={req._id} className="hover:bg-[#f8fafc] transition-all">
                          <td className="p-4 font-semibold text-sm text-[#1a2e46]">{req.userId?.name || 'Unknown'}</td>
                          <td className="p-4 font-serif font-bold text-[#1a2e46] italic">{req.serviceType}</td>
                          <td className="p-4"><span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${priorityStyle(req.priority)}`}>{req.priority}</span></td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${req.status === 'completed' ? 'bg-green-500' : req.status === 'vetted' ? 'bg-blue-500' : 'bg-[#257242]'}`} />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a2e46]/60">{req.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {serviceRequests.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-slate-500 text-sm">No client requests yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        
          {view === 'employers' && (
            <div className="bg-white rounded-2xl border border-[rgba(26,46,70,0.06)] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <p className="text-[10px] font-semibold text-slate-400 px-5 pt-3 md:hidden">â† Scroll to see more</p>
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-[#1a2e46] text-white uppercase">
                    <tr>
                      <th className="p-5 md:p-7 text-[10px] font-bold tracking-widest">Company</th>
                      <th className="p-5 md:p-7 text-[10px] font-bold tracking-widest">Contact</th>
                      <th className="p-5 md:p-7 text-[10px] font-bold tracking-widest">RC Number</th>
                      <th className="p-5 md:p-7 text-[10px] font-bold tracking-widest">Status</th>
                      <th className="p-5 md:p-7 text-[10px] font-bold tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {employers.length === 0 && <tr><td colSpan={5} className="p-16 text-center text-slate-500 text-sm">No businesses registered yet.</td></tr>}
                    {employers.map((emp: any) => (
                      <tr key={emp._id} className="hover:bg-[#f8fafc] transition-all">
                        <td className="p-5 md:p-7">
                          <span className="block font-bold text-base text-[#1a2e46]">{emp.employerProfile?.companyName || emp.name}</span>
                          <span className="text-xs text-slate-500">{emp.employerProfile?.officeAddress}</span>
                        </td>
                        <td className="p-5 md:p-7">
                          <span className="text-xs font-semibold text-[#1a2e46] flex items-center gap-1.5 mb-1"><Mail size={11} className="text-[#257242]"/> {emp.email}</span>
                          {emp.phone && <span className="text-xs text-slate-500 flex items-center gap-1.5"><Phone size={11}/> {emp.phone}</span>}
                        </td>
                        <td className="p-5 md:p-7 font-mono text-sm font-bold text-[#257242]">CAC-{emp.employerProfile?.rcNumber}</td>
                        <td className="p-5 md:p-7">
                          <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${emp.status === 'active' ? 'bg-green-50 text-green-700' : emp.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-[#257242]/10 text-[#257242] animate-pulse'}`}>{emp.status}</span>
                        </td>
                        <td className="p-5 md:p-7 text-right">
                          {emp.status === 'pending' ? (
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleVerifyAction(emp._id, 'employer', 'approve')} className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all" title="Approve"><CheckCircle size={18}/></button>
                              <button onClick={() => handleVerifyAction(emp._id, 'employer', 'reject')} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all" title="Reject"><XCircle size={18}/></button>
                            </div>
                          ) : <span className="text-xs text-slate-300">â€”</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

      
          {view === 'applications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingApplications.length === 0 && <div className="col-span-2 p-20 text-center text-slate-500 bg-white rounded-2xl border border-[rgba(26,46,70,0.06)] text-sm">No pending applications.</div>}
              {(pendingApplications as any[]).map((app: any) => (
                <div key={app._id} className="bg-white p-6 md:p-8 rounded-2xl border-l-4 border-[#257242] shadow-sm hover:shadow-md transition-all">
                  <h3 className="font-serif text-xl font-bold text-[#1a2e46] italic mb-1">{app.candidateId?.name || 'Unknown Candidate'}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Ref: {app._id.slice(-8).toUpperCase()}</p>
                  {app.candidateId?.email && <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-5"><Mail size={11} className="text-[#257242]"/> {app.candidateId.email}</p>}
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1a2e46] uppercase tracking-widest"><Briefcase size={13} className="text-[#257242]"/> {app.jobId?.category || 'General'}</div>
                    {app.cvUrl && <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 bg-[#f8fafc] border border-slate-100 rounded-xl hover:bg-[#1a2e46] hover:text-white transition-all font-semibold text-xs uppercase tracking-widest"><FileText size={15}/> View CV / Resume</a>}
                  </div>
                  {app.status === 'pending' && (
                    <div className="flex gap-3 border-t pt-5 border-[rgba(26,46,70,0.05)]">
                      <button onClick={() => handleVerifyAction(app._id, 'candidate', 'approve')} className="flex-1 py-3 bg-[#257242] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#1a2e46] transition-all active:scale-95">Approve</button>
                      <button onClick={() => handleVerifyAction(app._id, 'candidate', 'reject')} className="px-5 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><XCircle size={17}/></button>
                    </div>
                  )}
                  {app.status === 'vetted' && <div className="text-green-700 font-bold text-xs uppercase mt-3 bg-green-50 w-fit px-4 py-1.5 rounded-full border border-green-200">Approved âœ“</div>}
                  {app.status === 'rejected' && <div className="text-red-600 font-bold text-xs uppercase mt-3 bg-red-50 w-fit px-4 py-1.5 rounded-full border border-red-200">Rejected âœ—</div>}
                </div>
              ))}
            </div>
          )}

      
          {view === 'hse' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6">
                <Stat val={enquiries.length} label="Total Enquiries" sub="All time" />
                <Stat val={enquiries.filter(e => e.status === 'Pending').length} label="Awaiting Response" sub="Action needed" />
                <Stat val={enquiries.filter(e => e.status === 'Closed').length} label="Closed" sub="Resolved" />
              </div>
              <div className="bg-white rounded-2xl border border-[rgba(26,46,70,0.06)] overflow-hidden shadow-sm">
                <div className="p-5 md:p-7 border-b border-[rgba(26,46,70,0.05)] flex items-center justify-between bg-[#f1f5f9]">
                  <h3 className="font-semibold text-[#1a2e46]">HSE & Environmental Enquiries</h3>
                  <AlertTriangle className="text-[#257242]/40" size={24}/>
                </div>
                <div className="overflow-x-auto">
                  <p className="text-[10px] font-semibold text-slate-400 px-5 pt-3 md:hidden">â† Scroll to see more</p>
                  <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-[#1a2e46] text-white uppercase">
                      <tr>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Name</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Contact</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Service</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Message</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Date</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Status</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {enquiries.length === 0 && <tr><td colSpan={7} className="p-16 text-center text-slate-500 text-sm">No enquiries yet.</td></tr>}
                      {enquiries.map((enq: any) => (
                        <tr key={enq._id} className="hover:bg-[#f8fafc] transition-all">
                          <td className="p-4 md:p-6">
                            <span className="block font-bold text-[#1a2e46] text-sm">{enq.name}</span>
                            <span className="text-xs text-slate-500">{enq.organisation || 'â€”'}</span>
                          </td>
                          <td className="p-4 md:p-6">
                            <span className="text-xs font-semibold text-[#1a2e46] flex items-center gap-1.5 mb-1"><Mail size={11} className="text-[#257242]"/> {enq.email}</span>
                            {enq.phone && <span className="text-xs text-slate-500 flex items-center gap-1.5"><Phone size={11}/> {enq.phone}</span>}
                          </td>
                          <td className="p-4 md:p-6">
                            <span className="block font-semibold text-sm text-[#1a2e46]">{enq.service}</span>
                            {enq.participants && <span className="text-xs text-slate-500">{enq.participants} participants</span>}
                          </td>
                          <td className="p-4 md:p-6 max-w-[180px]"><p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{enq.details || 'â€”'}</p></td>
                          <td className="p-4 md:p-6 text-xs font-semibold text-slate-500 whitespace-nowrap">{new Date(enq.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td className="p-4 md:p-6">
                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${enq.status === 'Closed' ? 'bg-green-50 text-green-700' : enq.status === 'Contacted' ? 'bg-blue-50 text-blue-600' : 'bg-[#257242]/10 text-[#257242] animate-pulse'}`}>{enq.status || 'Pending'}</span>
                          </td>
                          <td className="p-4 md:p-6 text-right">
                            <div className="flex gap-2 justify-end flex-wrap">
                              {enq.status !== 'Contacted' && <button onClick={() => handleEnquiryStatus(enq._id, 'Contacted')} className="px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Contacted</button>}
                              {enq.status !== 'Closed' && <button onClick={() => handleEnquiryStatus(enq._id, 'Closed')} className="px-3 py-2 bg-green-50 text-green-700 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all">Close</button>}
                              <button onClick={() => handleDeleteEnquiry(enq._id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all" title="Delete"><Trash2 size={13}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

       
          {view === 'servicerequests' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6">
                <Stat val={serviceRequests.length} label="Total Requests" sub="All clients" />
                <Stat val={serviceRequests.filter((r: any) => r.status === 'pending').length} label="Pending" sub="Need action" />
                <Stat val={serviceRequests.filter((r: any) => r.status === 'completed').length} label="Completed" sub="Fulfilled" />
              </div>
              <div className="bg-white rounded-2xl border border-[rgba(26,46,70,0.06)] overflow-hidden shadow-sm">
                <div className="p-5 md:p-7 border-b border-[rgba(26,46,70,0.05)] flex items-center justify-between bg-[#f1f5f9]">
                  <h3 className="font-semibold text-[#1a2e46]">Client Service Requests</h3>
                  <ClipboardList className="text-[#257242]/40" size={24}/>
                </div>
                <div className="overflow-x-auto">
                  <p className="text-[10px] font-semibold text-slate-400 px-5 pt-3 md:hidden">â† Scroll to see more</p>
                  <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-[#1a2e46] text-white uppercase">
                      <tr>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Client</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Service</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Location</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Date</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Priority</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Status</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest text-right">Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {serviceRequests.length === 0 && <tr><td colSpan={7} className="p-16 text-center text-slate-500 text-sm">No client requests yet.</td></tr>}
                      {serviceRequests.map((req: any) => (
                        <tr key={req._id} className="hover:bg-[#f8fafc] transition-all align-top">
                          <td className="p-4 md:p-6">
                            <span className="block font-bold text-sm text-[#1a2e46]">{req.userId?.name || 'Unknown'}</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1"><Mail size={10}/> {req.userId?.email || 'â€”'}</span>
                          </td>
                          <td className="p-4 md:p-6 font-serif font-bold text-[#1a2e46] italic">{req.serviceType}</td>
                          <td className="p-4 md:p-6 text-xs font-semibold text-slate-600 max-w-[120px]">{req.location}</td>
                          <td className="p-4 md:p-6 text-xs font-semibold text-slate-500 whitespace-nowrap">
                            <span className="flex items-center gap-1"><Calendar size={11} className="text-[#257242]"/>
                              {req.targetDate ? new Date(req.targetDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'â€”'}
                            </span>
                          </td>
                          <td className="p-4 md:p-6">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap ${priorityStyle(req.priority)}`}>{req.priority}</span>
                          </td>
                          <td className="p-4 md:p-6">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${req.status === 'completed' ? 'bg-green-50 text-green-700' : req.status === 'vetted' ? 'bg-blue-50 text-blue-600' : 'bg-[#257242]/10 text-[#257242] animate-pulse'}`}>{req.status}</span>
                          </td>
                          <td className="p-4 md:p-6 text-right">
                            <select value={req.status} onChange={(e) => handleServiceRequestStatus(req._id, e.target.value)} className="text-[10px] font-bold uppercase bg-[#f1f5f9] border border-[rgba(26,46,70,0.08)] rounded-xl px-3 py-2 text-[#1a2e46] cursor-pointer hover:border-[#257242] transition-all outline-none">
                              <option value="pending">Pending</option>
                              <option value="vetted">Vetted</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

     
          {view === 'jobs' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6">
                <Stat val={allJobs.length} label="Total Listings" sub="All employers" />
                <Stat val={allJobs.filter(j => j.status === 'open').length} label="Open" sub="Visible to candidates" />
                <Stat val={allJobs.filter(j => j.status === 'closed').length} label="Closed" sub="Hidden" />
              </div>
              <div className="bg-white rounded-2xl border border-[rgba(26,46,70,0.06)] overflow-hidden shadow-sm">
                <div className="p-5 md:p-7 border-b border-[rgba(26,46,70,0.05)] flex items-center justify-between bg-[#f1f5f9]">
                  <h3 className="font-semibold text-[#1a2e46]">All Job Listings</h3>
                  <Briefcase className="text-[#257242]/40" size={24}/>
                </div>
                <div className="overflow-x-auto">
                  <p className="text-[10px] font-semibold text-slate-400 px-5 pt-3 md:hidden">â† Scroll to see more</p>
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-[#1a2e46] text-white uppercase">
                      <tr>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Job</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Category</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Location</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Posted</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Status</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {allJobs.length === 0 && <tr><td colSpan={6} className="p-16 text-center text-slate-500 text-sm">No job listings yet.</td></tr>}
                      {allJobs.map((job: any) => (
                        <tr key={job._id} className="hover:bg-[#f8fafc] transition-all">
                          <td className="p-4 md:p-6"><span className="block font-bold text-sm text-[#1a2e46]">{job.title}</span></td>
                          <td className="p-4 md:p-6"><span className="text-[9px] font-bold uppercase tracking-widest bg-[#1a2e46] text-white px-3 py-1 rounded-full">{job.category}</span></td>
                          <td className="p-4 md:p-6 text-xs font-semibold text-slate-600">{job.location}</td>
                          <td className="p-4 md:p-6 text-xs text-slate-500">{new Date(job.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td className="p-4 md:p-6">
                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${job.status === 'open' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{job.status}</span>
                          </td>
                          <td className="p-4 md:p-6 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleToggleJob(job._id, job.status)} className={`p-2.5 rounded-xl transition-all ${job.status === 'open' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-green-50 text-green-700 hover:bg-green-600 hover:text-white'}`} title={job.status === 'open' ? 'Close' : 'Reopen'}>
                                {job.status === 'open' ? <EyeOff size={14}/> : <Eye size={14}/>}
                              </button>
                              <button onClick={() => handleDeleteJob(job._id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all" title="Delete"><Trash2 size={14}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

     
          {view === 'users' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
                <Stat val={allUsers.length} label="Total Users" sub="All accounts" />
                <Stat val={allUsers.filter(u => u.userType === 'candidate').length} label="Candidates" sub="Job seekers" />
                <Stat val={allUsers.filter(u => u.userType === 'employer').length} label="Employers" sub="Businesses" />
                <Stat val={allUsers.filter(u => u.userType === 'service').length} label="Clients" sub="Service users" />
              </div>
              <div className="bg-white rounded-2xl border border-[rgba(26,46,70,0.06)] overflow-hidden shadow-sm">
                <div className="p-5 md:p-7 border-b border-[rgba(26,46,70,0.05)] flex items-center justify-between bg-[#f1f5f9]">
                  <h3 className="font-semibold text-[#1a2e46]">All Registered Users</h3>
                  <Users className="text-[#257242]/40" size={24}/>
                </div>
                <div className="overflow-x-auto">
                  <p className="text-[10px] font-semibold text-slate-400 px-5 pt-3 md:hidden">â† Scroll to see more</p>
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-[#1a2e46] text-white uppercase">
                      <tr>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">User</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Type</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Role</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Joined</th>
                        <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {allUsers.length === 0 && <tr><td colSpan={5} className="p-16 text-center text-slate-500 text-sm">No users found.</td></tr>}
                      {allUsers.map((u: any) => (
                        <tr key={u._id} className="hover:bg-[#f8fafc] transition-all">
                          <td className="p-4 md:p-6">
                            <span className="block font-bold text-sm text-[#1a2e46]">{u.name}</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1"><Mail size={10}/> {u.email}</span>
                          </td>
                          <td className="p-4 md:p-6">
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${u.userType === 'employer' ? 'bg-blue-50 text-blue-700' : u.userType === 'service' ? 'bg-purple-50 text-purple-700' : 'bg-[#257242]/10 text-[#257242]'}`}>{u.userType}</span>
                          </td>
                          <td className="p-4 md:p-6">
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${u.role === 'admin' ? 'bg-red-50 text-red-600' : u.role === 'staff' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span>
                          </td>
                          <td className="p-4 md:p-6 text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td className="p-4 md:p-6">
                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${u.status === 'active' ? 'bg-green-50 text-green-700' : u.status === 'pending' ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-red-50 text-red-600'}`}>{u.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <style jsx>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(37,114,66,0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
}

function Stat({ val, label, sub }: any) {
  return (
    <div className="bg-white p-5 md:p-7 rounded-2xl border border-[rgba(26,46,70,0.06)] shadow-sm hover:shadow-md hover:border-[#257242]/40 transition-all">
      <h4 className="text-2xl md:text-4xl font-serif font-bold italic text-[#1a2e46] mb-2 truncate">{val}</h4>
      <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-0.5">{label}</p>
      <span className="text-[9px] font-semibold text-slate-400 italic">{sub}</span>
    </div>
  );
}