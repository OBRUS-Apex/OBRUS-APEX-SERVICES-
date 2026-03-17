"use client";
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, LayoutDashboard, LogOut,
  Globe, Mail, Phone, Calendar,
  Briefcase, FileText, CheckCircle, XCircle,
  ClipboardList, AlertTriangle, Trash2, RefreshCw, Menu, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminDashboard() {
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, staffCount: 0, hseCount: 0, adminCount: 0 });

  const [employers, setEmployers] = useState<any[]>([]);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [uRes, aRes, hRes, sRes, srRes] = await Promise.all([
        fetch('/api/admin/user'),
        fetch('/api/applications'),
        fetch('/api/admin/hse'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/service-requests'),
      ]);
      const allUsers = await uRes.json();
      setEmployers(Array.isArray(allUsers) ? allUsers.filter((u: any) => u.userType === 'employer') : []);
      setPendingApplications(await aRes.json());
      setEnquiries(await hRes.json());
      setStats(await sRes.json());
      setServiceRequests(await srRes.json());
    } catch {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAction = async (id: string, type: 'employer' | 'candidate', action: 'approve' | 'reject') => {
    const load = toast.loading('Processing...');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, action })
      });
      if (res.ok) { toast.success('Updated successfully', { id: load }); fetchAllData(); }
      else toast.error('Action failed', { id: load });
    } catch { toast.error('Network error', { id: load }); }
  };

  const handleEnquiryStatus = async (id: string, status: string) => {
    const load = toast.loading('Updating...');
    try {
      const res = await fetch('/api/admin/hse', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) { toast.success('Enquiry updated', { id: load }); fetchAllData(); }
    } catch { toast.error('Update failed', { id: load }); }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Delete this enquiry permanently?')) return;
    const load = toast.loading('Deleting...');
    try {
      const res = await fetch('/api/admin/hse', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) { toast.success('Deleted', { id: load }); fetchAllData(); }
    } catch { toast.error('Delete failed', { id: load }); }
  };

  const handleServiceRequestStatus = async (id: string, status: string) => {
    const load = toast.loading('Updating...');
    try {
      const res = await fetch('/api/admin/service-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) { toast.success('Updated', { id: load }); fetchAllData(); }
    } catch { toast.error('Update failed', { id: load }); }
  };

  const switchView = (v: string) => { setView(v); setSidebarOpen(false); };

  if (loading) return (
    <div className="min-h-screen bg-[#060f1e] flex flex-col items-center justify-center font-sans">
      <div className="w-10 h-10 border-2 border-[#c8921e] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-white/30 font-semibold uppercase text-xs tracking-widest">Loading dashboard...</p>
    </div>
  );

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    employers: 'Business Approvals',
    applications: 'Candidate Vetting',
    hse: 'HSE Enquiries',
    servicerequests: 'Client Requests',
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', ico: <LayoutDashboard size={17}/> },
    { id: 'employers', label: 'Business Approvals', ico: <ShieldCheck size={17}/> },
    { id: 'applications', label: 'Candidate Vetting', ico: <Briefcase size={17}/> },
    { id: 'hse', label: 'HSE Enquiries', ico: <AlertTriangle size={17}/> },
    { id: 'servicerequests', label: 'Client Requests', ico: <ClipboardList size={17}/> },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f0e8] text-[#0b1f3a] font-sans">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-[90] md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside
        style={{ transform: sidebarOpen ? 'translateX(0)' : undefined }}
        className="w-[240px] bg-[#060f1e] fixed inset-y-0 left-0 border-r border-white/5 z-[100] flex flex-col shadow-2xl -translate-x-full md:translate-x-0 transition-transform duration-300"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#c8921e] rounded-xl flex items-center justify-center font-black text-[#0b1f3a] text-base italic">O</div>
            <div>
              <span className="block text-white font-bold text-sm leading-none">OBRUS</span>
              <span className="text-[#e8b84b] text-[9px] uppercase tracking-widest opacity-60">Admin</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/30 hover:text-white transition-all">
            <X size={18}/>
          </button>
        </div>

        <nav className="p-4 space-y-1 mt-4 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => switchView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border-l-4 ${view === item.id ? 'bg-[#c8921e]/15 text-[#e8b84b] border-[#c8921e]' : 'text-white/25 border-transparent hover:text-white hover:bg-white/5'}`}
            >
              <span className={view === item.id ? 'text-[#c8921e]' : 'opacity-30'}>{item.ico}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={() => window.location.href='/auth'} className="flex items-center gap-3 text-red-400/40 hover:text-red-400 font-semibold text-xs uppercase tracking-widest transition-all">
            <LogOut size={15}/> Log Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="md:ml-[240px] flex-1 min-h-screen flex flex-col overflow-y-auto">

        <header className="h-[64px] bg-white border-b border-[rgba(11,31,58,0.06)] flex items-center justify-between px-5 md:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-xl border border-[rgba(11,31,58,0.08)] text-[#0b1f3a]/40 hover:text-[#c8921e] hover:border-[#c8921e] transition-all">
              <Menu size={19}/>
            </button>
            <h2 className="font-serif text-xl md:text-2xl font-bold italic text-[#0b1f3a] tracking-tight">
              {viewTitles[view]}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchAllData} className="p-2 rounded-xl text-[#0b1f3a]/30 hover:text-[#c8921e] hover:bg-[#c8921e]/10 transition-all" title="Refresh">
              <RefreshCw size={17}/>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-[rgba(11,31,58,0.06)]">
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <Link href="/" className="w-9 h-9 rounded-xl border border-[rgba(11,31,58,0.08)] flex items-center justify-center text-[#0b1f3a]/30 hover:text-[#c8921e] hover:border-[#c8921e] transition-all">
              <Globe size={17}/>
            </Link>
          </div>
        </header>

        <div className="p-5 md:p-10 pb-24 w-full max-w-[1400px] mx-auto">

          {/* DASHBOARD */}
          {view === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <Stat val={stats.totalUsers} label="Total Users" sub="All roles" />
                <Stat val={stats.hseCount} label="HSE Enquiries" sub="All time" />
                <Stat val={employers.length} label="Businesses" sub="Registered" />
                <Stat val={serviceRequests.filter((r: any) => r.status === 'pending').length} label="Pending Requests" sub="Need attention" />
              </div>

              <div className="bg-[#0b1f3a] p-8 md:p-14 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#c8921e]/[0.04] rounded-bl-full pointer-events-none" />
                <CheckCircle className="absolute bottom-8 right-8 text-[#c8921e]/[0.06]" size={140}/>
                <h3 className="font-serif text-2xl md:text-4xl font-bold mb-4 italic">All systems running</h3>
                <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-2xl mb-6">
                  Recruitment, client requests, HSE enquiries, and business onboarding are all active.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <span className="px-4 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-[#e8b84b]">System Active</span>
                  <span className="px-4 py-2 rounded-full border border-green-500/30 bg-green-500/5 text-xs font-bold uppercase tracking-widest text-green-400">{stats.staffCount} Staff Members</span>
                </div>
              </div>

              {/* Recent requests preview */}
              <div className="bg-white rounded-2xl border border-[rgba(11,31,58,0.06)] overflow-hidden shadow-sm">
                <div className="p-5 md:p-7 border-b border-[rgba(11,31,58,0.05)] flex items-center justify-between">
                  <h3 className="font-semibold text-[#0b1f3a]">Recent Client Requests</h3>
                  <button onClick={() => setView('servicerequests')} className="text-xs font-semibold text-[#c8921e] hover:underline">View all →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[400px]">
                    <thead className="bg-[#f9f8f6] text-[#0b1f3a]/30 uppercase">
                      <tr>
                        <th className="p-4 text-[10px] font-bold tracking-widest">Client</th>
                        <th className="p-4 text-[10px] font-bold tracking-widest">Service</th>
                        <th className="p-4 text-[10px] font-bold tracking-widest">Priority</th>
                        <th className="p-4 text-[10px] font-bold tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0ede6]">
                      {serviceRequests.slice(0, 5).map((req: any) => (
                        <tr key={req._id} className="hover:bg-[#f9f8f6] transition-all">
                          <td className="p-4 font-semibold text-sm text-[#0b1f3a]">{req.userId?.name || 'Unknown'}</td>
                          <td className="p-4 font-serif font-bold text-[#0b1f3a] italic">{req.serviceType}</td>
                          <td className="p-4">
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${req.priority === 'Urgent' ? 'bg-red-50 text-red-500' : req.priority === 'High Priority' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                              {req.priority}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${req.status === 'completed' ? 'bg-green-500' : req.status === 'vetted' ? 'bg-blue-500' : 'bg-[#c8921e]'}`} />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0b1f3a]/60">{req.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {serviceRequests.length === 0 && (
                        <tr><td colSpan={4} className="p-10 text-center text-slate-400 text-sm">No client requests yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* EMPLOYER APPROVALS */}
          {view === 'employers' && (
            <div className="bg-white rounded-2xl border border-[rgba(11,31,58,0.06)] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <p className="text-[10px] font-semibold text-slate-400 px-5 pt-3 md:hidden">← Scroll to see more</p>
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-[#0b1f3a] text-[#e8b84b] uppercase">
                    <tr>
                      <th className="p-5 md:p-7 text-[10px] font-bold tracking-widest">Company</th>
                      <th className="p-5 md:p-7 text-[10px] font-bold tracking-widest">Contact</th>
                      <th className="p-5 md:p-7 text-[10px] font-bold tracking-widest">RC Number</th>
                      <th className="p-5 md:p-7 text-[10px] font-bold tracking-widest">Status</th>
                      <th className="p-5 md:p-7 text-[10px] font-bold tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede6]">
                    {employers.length === 0 && (
                      <tr><td colSpan={5} className="p-16 text-center text-slate-400 text-sm">No businesses registered yet.</td></tr>
                    )}
                    {employers.map((emp: any) => (
                      <tr key={emp._id} className="hover:bg-[#f9f8f6] transition-all">
                        <td className="p-5 md:p-7">
                          <span className="block font-bold text-base text-[#0b1f3a]">{emp.employerProfile?.companyName || emp.name}</span>
                          <span className="text-xs text-slate-400">{emp.employerProfile?.officeAddress}</span>
                        </td>
                        <td className="p-5 md:p-7">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-[#0b1f3a] flex items-center gap-1.5"><Mail size={11} className="text-[#c8921e]"/> {emp.email}</span>
                            {emp.phone && <span className="text-xs text-slate-400 flex items-center gap-1.5"><Phone size={11}/> {emp.phone}</span>}
                          </div>
                        </td>
                        <td className="p-5 md:p-7 font-mono text-sm font-bold text-[#c8921e]">CAC-{emp.employerProfile?.rcNumber}</td>
                        <td className="p-5 md:p-7">
                          <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${emp.status === 'active' ? 'bg-green-50 text-green-600' : emp.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-[#c8921e]/10 text-[#c8921e] animate-pulse'}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="p-5 md:p-7 text-right">
                          {emp.status === 'pending' ? (
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleVerifyAction(emp._id, 'employer', 'approve')} className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all" title="Approve"><CheckCircle size={18}/></button>
                              <button onClick={() => handleVerifyAction(emp._id, 'employer', 'reject')} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all" title="Reject"><XCircle size={18}/></button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CANDIDATE VETTING */}
          {view === 'applications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingApplications.length === 0 && (
                <div className="col-span-2 p-20 text-center text-slate-400 bg-white rounded-2xl border border-[rgba(11,31,58,0.06)] text-sm">
                  No pending applications.
                </div>
              )}
              {(pendingApplications as any[]).map((app: any) => (
                <div key={app._id} className="bg-white p-6 md:p-8 rounded-2xl border-l-4 border-[#c8921e] shadow-sm hover:shadow-md transition-all">
                  <h3 className="font-serif text-xl font-bold text-[#0b1f3a] italic mb-1">{app.candidateId?.name || 'Unknown Candidate'}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">ID: {app._id.slice(-8).toUpperCase()}</p>
                  {app.candidateId?.email && (
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-5"><Mail size={11} className="text-[#c8921e]"/> {app.candidateId.email}</p>
                  )}
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0b1f3a] uppercase tracking-widest"><Briefcase size={13} className="text-[#c8921e]"/> {app.jobId?.category || 'General'}</div>
                    {app.cvUrl && (
                      <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 bg-[#f5f0e8] rounded-xl hover:bg-[#0b1f3a] hover:text-white transition-all font-semibold text-xs uppercase tracking-widest">
                        <FileText size={15}/> View CV / Resume
                      </a>
                    )}
                  </div>
                  {app.status === 'pending' && (
                    <div className="flex gap-3 border-t pt-5 border-[rgba(11,31,58,0.05)]">
                      <button onClick={() => handleVerifyAction(app._id, 'candidate', 'approve')} className="flex-1 py-3 bg-[#c8921e] text-[#0b1f3a] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#0b1f3a] hover:text-white transition-all active:scale-95">Approve</button>
                      <button onClick={() => handleVerifyAction(app._id, 'candidate', 'reject')} className="px-5 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><XCircle size={17}/></button>
                    </div>
                  )}
                  {app.status === 'vetted' && <div className="text-green-600 font-bold text-xs uppercase flex items-center gap-2 mt-3 bg-green-50 w-fit px-4 py-1.5 rounded-full border border-green-200">Approved ✓</div>}
                  {app.status === 'rejected' && <div className="text-red-500 font-bold text-xs uppercase flex items-center gap-2 mt-3 bg-red-50 w-fit px-4 py-1.5 rounded-full border border-red-100">Rejected ✗</div>}
                </div>
              ))}
            </div>
          )}

          {/* HSE ENQUIRIES */}
          {view === 'hse' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6">
                <Stat val={enquiries.length} label="Total Enquiries" sub="All time" />
                <Stat val={enquiries.filter(e => e.status === 'Pending').length} label="Awaiting Response" sub="Action needed" />
                <Stat val={enquiries.filter(e => e.status === 'Closed').length} label="Closed" sub="Resolved" />
              </div>

              <div className="bg-white rounded-2xl border border-[rgba(11,31,58,0.06)] overflow-hidden shadow-sm">
                <div className="p-5 md:p-7 border-b border-[rgba(11,31,58,0.05)] flex items-center justify-between bg-[#f9f8f6]">
                  <h3 className="font-semibold text-[#0b1f3a]">HSE & Environmental Enquiries</h3>
                  <AlertTriangle className="text-[#c8921e]/30" size={24}/>
                </div>
                <div className="overflow-x-auto">
                  <p className="text-[10px] font-semibold text-slate-400 px-5 pt-3 md:hidden">← Scroll to see more</p>
                  <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-[#0b1f3a] text-[#e8b84b] uppercase">
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
                    <tbody className="divide-y divide-[#f0ede6]">
                      {enquiries.length === 0 && (
                        <tr><td colSpan={7} className="p-16 text-center text-slate-400 text-sm">No enquiries yet.</td></tr>
                      )}
                      {enquiries.map((enq: any) => (
                        <tr key={enq._id} className="hover:bg-[#f9f8f6] transition-all">
                          <td className="p-4 md:p-6">
                            <span className="block font-bold text-[#0b1f3a] text-sm">{enq.name}</span>
                            <span className="text-xs text-slate-400">{enq.organisation || '—'}</span>
                          </td>
                          <td className="p-4 md:p-6">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-semibold text-[#0b1f3a] flex items-center gap-1.5"><Mail size={11} className="text-[#c8921e]"/> {enq.email}</span>
                              {enq.phone && <span className="text-xs text-slate-400 flex items-center gap-1.5"><Phone size={11}/> {enq.phone}</span>}
                            </div>
                          </td>
                          <td className="p-4 md:p-6">
                            <span className="block font-semibold text-sm text-[#0b1f3a]">{enq.service}</span>
                            {enq.participants && <span className="text-xs text-slate-400">{enq.participants} participants</span>}
                            {enq.timeline && <span className="block text-xs text-slate-400">{enq.timeline}</span>}
                          </td>
                          <td className="p-4 md:p-6 max-w-[200px]">
                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{enq.details || '—'}</p>
                          </td>
                          <td className="p-4 md:p-6 text-xs font-semibold text-slate-400 whitespace-nowrap">
                            {new Date(enq.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-4 md:p-6">
                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${enq.status === 'Closed' ? 'bg-green-50 text-green-600' : enq.status === 'Contacted' ? 'bg-blue-50 text-blue-500' : 'bg-[#c8921e]/10 text-[#c8921e] animate-pulse'}`}>
                              {enq.status || 'Pending'}
                            </span>
                          </td>
                          <td className="p-4 md:p-6 text-right">
                            <div className="flex gap-2 justify-end flex-wrap">
                              {enq.status !== 'Contacted' && (
                                <button onClick={() => handleEnquiryStatus(enq._id, 'Contacted')} className="px-3 py-2 bg-blue-50 text-blue-500 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
                                  Contacted
                                </button>
                              )}
                              {enq.status !== 'Closed' && (
                                <button onClick={() => handleEnquiryStatus(enq._id, 'Closed')} className="px-3 py-2 bg-green-50 text-green-600 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">
                                  Close
                                </button>
                              )}
                              <button onClick={() => handleDeleteEnquiry(enq._id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all" title="Delete">
                                <Trash2 size={13}/>
                              </button>
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

          {/* CLIENT SERVICE REQUESTS */}
          {view === 'servicerequests' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6">
                <Stat val={serviceRequests.length} label="Total Requests" sub="All clients" />
                <Stat val={serviceRequests.filter((r: any) => r.status === 'pending').length} label="Pending" sub="Need action" />
                <Stat val={serviceRequests.filter((r: any) => r.status === 'completed').length} label="Completed" sub="Fulfilled" />
              </div>

              <div className="bg-white rounded-2xl border border-[rgba(11,31,58,0.06)] overflow-hidden shadow-sm">
                <div className="p-5 md:p-7 border-b border-[rgba(11,31,58,0.05)] flex items-center justify-between bg-[#f9f8f6]">
                  <h3 className="font-semibold text-[#0b1f3a]">Client Service Requests</h3>
                  <ClipboardList className="text-[#c8921e]/30" size={24}/>
                </div>
                <div className="overflow-x-auto">
                  <p className="text-[10px] font-semibold text-slate-400 px-5 pt-3 md:hidden">← Scroll to see more</p>
                  <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-[#0b1f3a] text-[#e8b84b] uppercase">
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
                    <tbody className="divide-y divide-[#f0ede6]">
                      {serviceRequests.length === 0 && (
                        <tr><td colSpan={7} className="p-16 text-center text-slate-400 text-sm">No client requests yet.</td></tr>
                      )}
                      {serviceRequests.map((req: any) => (
                        <tr key={req._id} className="hover:bg-[#f9f8f6] transition-all align-top">
                          <td className="p-4 md:p-6">
                            <span className="block font-bold text-sm text-[#0b1f3a]">{req.userId?.name || 'Unknown'}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1"><Mail size={10}/> {req.userId?.email || '—'}</span>
                          </td>
                          <td className="p-4 md:p-6 font-serif font-bold text-[#0b1f3a] italic">{req.serviceType}</td>
                          <td className="p-4 md:p-6 text-xs font-semibold text-slate-500 max-w-[120px]">{req.location}</td>
                          <td className="p-4 md:p-6 text-xs font-semibold text-slate-400 whitespace-nowrap">
                            <span className="flex items-center gap-1"><Calendar size={11} className="text-[#c8921e]"/>
                              {req.targetDate ? new Date(req.targetDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}
                            </span>
                          </td>
                          <td className="p-4 md:p-6">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap ${req.priority === 'Urgent' ? 'bg-red-50 text-red-500' : req.priority === 'High Priority' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                              {req.priority}
                            </span>
                          </td>
                          <td className="p-4 md:p-6">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${req.status === 'completed' ? 'bg-green-50 text-green-600' : req.status === 'vetted' ? 'bg-blue-50 text-blue-500' : 'bg-[#c8921e]/10 text-[#c8921e] animate-pulse'}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4 md:p-6 text-right">
                            <select
                              value={req.status}
                              onChange={(e) => handleServiceRequestStatus(req._id, e.target.value)}
                              className="text-[10px] font-bold uppercase bg-[#f9f8f6] border border-[rgba(11,31,58,0.08)] rounded-xl px-3 py-2 text-[#0b1f3a] cursor-pointer hover:border-[#c8921e] transition-all outline-none"
                            >
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

                {serviceRequests.some((r: any) => r.details) && (
                  <div className="p-6 border-t border-[rgba(11,31,58,0.05)] bg-[#f9f8f6]">
                    <h4 className="font-semibold text-[#0b1f3a] mb-4 text-sm">Request Notes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {serviceRequests.filter((r: any) => r.details).map((req: any) => (
                        <div key={`note-${req._id}`} className="p-4 bg-white rounded-xl border border-[rgba(11,31,58,0.06)] shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm text-[#0b1f3a] italic font-serif">{req.serviceType}</span>
                            <span className="text-[9px] font-bold text-[#c8921e] uppercase">{req.userId?.name}</span>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed">{req.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <style jsx>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

function Stat({ val, label, sub }: any) {
  return (
    <div className="bg-white p-5 md:p-7 rounded-2xl border border-[rgba(11,31,58,0.06)] shadow-sm hover:shadow-md hover:border-[#c8921e]/30 transition-all">
      <h4 className="text-2xl md:text-4xl font-serif font-bold italic text-[#0b1f3a] mb-2 truncate">{val}</h4>
      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-0.5">{label}</p>
      <span className="text-[9px] font-semibold text-slate-300 italic">{sub}</span>
    </div>
  );
}
