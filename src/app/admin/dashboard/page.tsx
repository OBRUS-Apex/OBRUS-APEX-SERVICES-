"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, LayoutDashboard, LogOut, 
  Globe, Mail, Phone, Calendar, 
  Briefcase, FileText, CheckCircle, XCircle,
  ClipboardList, AlertTriangle, Trash2, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
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
    } catch (err) {
      toast.error("Database connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAction = async (id: string, type: 'employer' | 'candidate', action: 'approve' | 'reject') => {
    const load = toast.loading("Processing...");
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, action })
      });
      if (res.ok) { toast.success("Updated", { id: load }); fetchAllData(); }
      else toast.error("Action failed", { id: load });
    } catch { toast.error("Request failed", { id: load }); }
  };

  const handleEnquiryStatus = async (id: string, status: string) => {
    const load = toast.loading("Updating...");
    try {
      const res = await fetch('/api/admin/hse', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) { toast.success("Enquiry updated", { id: load }); fetchAllData(); }
    } catch { toast.error("Failed", { id: load }); }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Delete this enquiry permanently?")) return;
    const load = toast.loading("Deleting...");
    try {
      const res = await fetch('/api/admin/hse', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) { toast.success("Deleted", { id: load }); fetchAllData(); }
    } catch { toast.error("Delete failed", { id: load }); }
  };

  const handleServiceRequestStatus = async (id: string, status: string) => {
    const load = toast.loading("Updating...");
    try {
      const res = await fetch('/api/admin/service-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) { toast.success("Request updated", { id: load }); fetchAllData(); }
    } catch { toast.error("Failed", { id: load }); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#060f1e] flex flex-col items-center justify-center font-sans">
      <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.3em]">Syncing Central Registry</p>
    </div>
  );

  const viewTitles: Record<string, string> = {
    dashboard: 'Executive Insights',
    employers: 'Business Verification',
    applications: 'Staff Recruitment Vetting',
    hse: 'HSE Enquiry Desk',
    servicerequests: 'Client Service Requests',
  };

  return (
    <div className="flex min-h-screen bg-[#fcfbf9] text-[#0b1f3a] font-sans">

      <aside className="w-[260px] bg-[#060f1e] fixed inset-y-0 left-0 border-r border-gold/10 z-50 flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-navy">
          <div className="w-12 h-12 bg-gold rounded flex items-center justify-center font-black text-navy text-2xl italic uppercase shadow-xl">O</div>
          <div>
            <span className="block text-white font-serif font-black text-xl leading-none">OBRUS</span>
            <span className="text-gold-lt text-[9px] uppercase font-bold tracking-[0.2em] opacity-60">Admin Desk</span>
          </div>
        </div>
        <nav className="p-4 space-y-2 mt-8 overflow-y-auto flex-1">
          <TabBtn active={view === 'dashboard'} onClick={() => setView('dashboard')} label="Overview Hub" ico={<LayoutDashboard size={18}/>}/>
          <TabBtn active={view === 'employers'} onClick={() => setView('employers')} label="Business Approvals" ico={<ShieldCheck size={18}/>}/>
          <TabBtn active={view === 'applications'} onClick={() => setView('applications')} label="Candidate Vetting" ico={<Briefcase size={18}/>}/>
          <TabBtn active={view === 'hse'} onClick={() => setView('hse')} label="HSE Enquiries" ico={<AlertTriangle size={18}/>}/>
          <TabBtn active={view === 'servicerequests'} onClick={() => setView('servicerequests')} label="Client Requests" ico={<ClipboardList size={18}/>}/>
        </nav>
        <div className="p-8 border-t border-white/5 bg-[#040a14]">
          <button onClick={() => window.location.href='/auth'} className="flex items-center gap-4 text-red-400/40 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-all">
            <LogOut size={16}/> Terminate Link
          </button>
        </div>
      </aside>

      <main className="ml-[260px] flex-1 min-h-screen flex flex-col overflow-y-auto">
        <header className="h-[80px] bg-white border-b flex items-center justify-between px-12 sticky top-0 z-40">
          <h2 className="font-serif text-3xl font-black uppercase italic tracking-tighter decoration-gold underline-offset-8 underline decoration-4">
            {viewTitles[view] || view}
          </h2>
          <div className="flex items-center gap-6">
            <button onClick={fetchAllData} className="text-navy/30 hover:text-gold transition-all p-2 rounded-xl hover:bg-gold/10" title="Refresh">
              <RefreshCw size={18}/>
            </button>
            <div className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-6 py-2.5 rounded-2xl border border-navy/5 shadow-inner leading-none">
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric'})}
            </div>
            <Link href="/" className="w-11 h-11 rounded-2xl border border-navy/5 flex items-center justify-center text-navy/30 hover:text-gold hover:border-gold transition-all">
              <Globe size={20}/>
            </Link>
          </div>
        </header>

        <div className="p-12 pb-32 w-full max-w-[1500px] mx-auto">

          {/* ── OVERVIEW ── */}
          {view === 'dashboard' && (
            <div className="animate-in fade-in duration-700 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <Stat val={stats.totalUsers} label="Total Registered Users" sub="Across all roles" />
                <Stat val={stats.hseCount} label="HSE Enquiries" sub="Safety & Environmental" />
                <Stat val={employers.length} label="Registered Businesses" sub="Employer entities" />
                <Stat val={serviceRequests.filter((r: any) => r.status === 'pending').length} label="Pending Client Requests" sub="Awaiting action" />
              </div>
              <div className="bg-[#0b1f3a] p-16 rounded-[70px] text-white relative overflow-hidden shadow-3xl group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/[0.03] rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
                <CheckCircle className="absolute bottom-10 right-10 text-gold/5" size={200}/>
                <h3 className="font-serif text-5xl font-bold mb-10 leading-none underline decoration-gold/30">Registry Report</h3>
                <p className="text-white/40 text-2xl font-light italic leading-relaxed max-w-3xl mb-12">
                  The industrial portal is running. All systems are tracking recruitment, client service requests, HSE enquiries, and business documentation.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <span className="px-6 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest text-gold-lt italic">System Active</span>
                  <span className="px-6 py-2 rounded-full border border-green-500/30 bg-green-500/5 text-[10px] font-black uppercase tracking-widest text-green-400 italic">{stats.staffCount} Staff Members</span>
                </div>
              </div>
              <div className="bg-white rounded-[50px] border border-navy/5 shadow-2xl overflow-hidden">
                <div className="p-10 border-b border-navy/5 flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-black italic tracking-tighter">Recent Client Requests</h3>
                  <button onClick={() => setView('servicerequests')} className="text-[10px] font-black uppercase tracking-widest text-gold hover:underline">View All →</button>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-[#f9f8f6] text-navy/30 uppercase">
                    <tr>
                      <th className="p-6 text-[10px] font-black tracking-widest">Client</th>
                      <th className="p-6 text-[10px] font-black tracking-widest">Service</th>
                      <th className="p-6 text-[10px] font-black tracking-widest">Priority</th>
                      <th className="p-6 text-[10px] font-black tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede6]">
                    {serviceRequests.slice(0, 5).map((req: any) => (
                      <tr key={req._id} className="hover:bg-gold/[0.02]">
                        <td className="p-6 font-black text-navy text-sm">{req.userId?.name || 'Unknown'}</td>
                        <td className="p-6 font-serif font-bold text-navy italic">{req.serviceType}</td>
                        <td className="p-6">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${req.priority === 'Urgent Dispatch' ? 'bg-red-50 text-red-500' : req.priority === 'High Priority' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                            {req.priority}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className={`w-2 h-2 rounded-full inline-block mr-2 ${req.status === 'completed' ? 'bg-green-500' : req.status === 'vetted' ? 'bg-blue-500' : 'bg-gold'}`}></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-navy/60">{req.status}</span>
                        </td>
                      </tr>
                    ))}
                    {serviceRequests.length === 0 && (
                      <tr><td colSpan={4} className="p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No service requests yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── EMPLOYER APPROVALS ── */}
          {view === 'employers' && (
            <div className="bg-white rounded-[60px] shadow-3xl border border-navy/5 overflow-hidden animate-in slide-in-from-bottom-5">
              <table className="w-full text-left">
                <thead className="bg-[#0b1f3a] text-gold-lt uppercase">
                  <tr>
                    <th className="p-8 text-[11px] font-black tracking-widest">Business Entity</th>
                    <th className="p-8 text-[11px] font-black tracking-widest">Contact</th>
                    <th className="p-8 text-[11px] font-black tracking-widest">RC Number</th>
                    <th className="p-8 text-[11px] font-black tracking-widest">Status</th>
                    <th className="p-8 text-[11px] font-black tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede6]">
                  {employers.length === 0 && (
                    <tr><td colSpan={5} className="p-20 text-center text-slate-400 italic text-xs uppercase tracking-widest">No employers registered yet.</td></tr>
                  )}
                  {employers.map((emp: any) => (
                    <tr key={emp._id} className="hover:bg-gold/[0.02] transition-colors">
                      <td className="p-8">
                        <span className="block font-black text-xl uppercase tracking-tighter text-navy mb-1 italic">{emp.employerProfile?.companyName || emp.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{emp.employerProfile?.officeAddress}</span>
                      </td>
                      <td className="p-8">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-navy flex items-center gap-2"><Mail size={12} className="text-gold"/> {emp.email}</span>
                          {emp.phone && <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Phone size={12}/> {emp.phone}</span>}
                        </div>
                      </td>
                      <td className="p-8 font-mono text-sm font-black text-gold">CAC-{emp.employerProfile?.rcNumber}</td>
                      <td className="p-8">
                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${emp.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : emp.status === 'rejected' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-gold/10 text-gold border-gold/20 animate-pulse'}`}>{emp.status}</span>
                      </td>
                      <td className="p-8 text-right">
                        {emp.status === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleVerifyAction(emp._id, 'employer', 'approve')} className="p-4 bg-green-500 text-white rounded-3xl hover:bg-navy transition-all shadow-xl shadow-green-500/20"><CheckCircle size={20}/></button>
                            <button onClick={() => handleVerifyAction(emp._id, 'employer', 'reject')} className="p-4 bg-red-100 text-red-500 rounded-3xl hover:bg-red-500 hover:text-white transition-all"><XCircle size={20}/></button>
                          </div>
                        )}
                        {emp.status !== 'pending' && <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── CANDIDATE VETTING ── */}
          {view === 'applications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {pendingApplications.length === 0 && (
                <div className="col-span-2 p-32 text-center text-slate-400 font-bold uppercase tracking-widest text-sm bg-white rounded-[60px]">No pending applications.</div>
              )}
              {pendingApplications.map((app: any) => (
                <div key={app._id} className="bg-white p-12 rounded-[65px] border-l-[12px] border-[#c8921e] shadow-3xl group relative overflow-hidden transition-all hover:-translate-y-2">
                  <Briefcase className="absolute top-12 right-12 text-navy/5 group-hover:scale-125 transition-transform" size={150}/>
                  <h3 className="font-serif text-4xl font-bold text-navy italic tracking-tighter mb-1 leading-none">{app.candidateId?.name || 'Unknown'}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 border-l-2 border-gold pl-5">ID: {app._id.slice(-8).toUpperCase()}</p>
                  {app.candidateId?.email && (
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-6 pl-5"><Mail size={12} className="text-gold"/> {app.candidateId.email}</p>
                  )}
                  <div className="flex flex-col gap-3 mb-10">
                    <div className="flex items-center gap-3 text-xs font-black text-navy uppercase tracking-widest"><Briefcase size={14} className="text-gold"/> {app.jobId?.category || 'General'}</div>
                    {app.cvUrl && (
                      <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 bg-[#f0ede6] rounded-3xl hover:bg-[#0b1f3a] hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-xl group/btn">
                        View CV / Resume <FileText size={18} className="group-hover/btn:scale-125 transition-transform"/>
                      </a>
                    )}
                  </div>
                  {app.status === 'pending' && (
                    <div className="flex gap-4 border-t pt-8 border-navy/5">
                      <button onClick={() => handleVerifyAction(app._id, 'candidate', 'approve')} className="flex-1 py-4 bg-[#c8921e] text-navy rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Approve Candidate</button>
                      <button onClick={() => handleVerifyAction(app._id, 'candidate', 'reject')} className="px-6 py-4 bg-red-50 text-red-500 rounded-3xl border border-red-100 hover:bg-red-500 hover:text-white transition-all"><XCircle size={18}/></button>
                    </div>
                  )}
                  {app.status === 'vetted' && <div className="text-green-600 font-black text-xs uppercase flex items-center gap-2 mt-4 bg-green-50 w-fit px-4 py-2 rounded-full border border-green-200">Approved ✓</div>}
                  {app.status === 'rejected' && <div className="text-red-500 font-black text-xs uppercase flex items-center gap-2 mt-4 bg-red-50 w-fit px-4 py-2 rounded-full border border-red-100">Rejected ✗</div>}
                </div>
              ))}
            </div>
          )}

          {/* ── HSE ENQUIRIES ── */}
          {view === 'hse' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Stat val={enquiries.length} label="Total Enquiries" sub="All time" />
                <Stat val={enquiries.filter(e => e.status === 'Pending').length} label="Awaiting Contact" sub="Needs attention" />
                <Stat val={enquiries.filter(e => e.status === 'Closed').length} label="Closed" sub="Resolved tickets" />
              </div>
              <div className="bg-white rounded-[60px] shadow-3xl border border-navy/5 overflow-hidden">
                <div className="p-10 border-b border-navy/5 flex items-center justify-between bg-[#fcfbf9]">
                  <h3 className="font-serif text-2xl font-black italic tracking-tighter">HSE & Environmental Enquiries</h3>
                  <AlertTriangle className="text-gold/30" size={32}/>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-[#0b1f3a] text-gold-lt uppercase">
                    <tr>
                      <th className="p-7 text-[10px] font-black tracking-widest">Enquirer</th>
                      <th className="p-7 text-[10px] font-black tracking-widest">Contact</th>
                      <th className="p-7 text-[10px] font-black tracking-widest">Service Requested</th>
                      <th className="p-7 text-[10px] font-black tracking-widest">Details</th>
                      <th className="p-7 text-[10px] font-black tracking-widest">Date</th>
                      <th className="p-7 text-[10px] font-black tracking-widest">Status</th>
                      <th className="p-7 text-[10px] font-black tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede6]">
                    {enquiries.length === 0 && (
                      <tr><td colSpan={7} className="p-20 text-center text-slate-400 italic text-xs uppercase tracking-widest">No enquiries received yet.</td></tr>
                    )}
                    {enquiries.map((enq: any) => (
                      <tr key={enq._id} className="hover:bg-gold/[0.02] transition-colors align-top">
                        <td className="p-7">
                          <span className="block font-black text-navy text-base">{enq.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{enq.organisation || '—'}</span>
                        </td>
                        <td className="p-7">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-navy flex items-center gap-1.5"><Mail size={11} className="text-gold"/> {enq.email}</span>
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><Phone size={11}/> {enq.phone}</span>
                          </div>
                        </td>
                        <td className="p-7">
                          <span className="block font-black text-navy text-sm">{enq.service}</span>
                          {enq.participants && <span className="text-[10px] text-slate-400 font-bold">{enq.participants} participants</span>}
                          {enq.timeline && <span className="block text-[10px] text-slate-400 font-bold mt-0.5">Timeline: {enq.timeline}</span>}
                        </td>
                        <td className="p-7 max-w-[220px]">
                          <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-2">{enq.details || '—'}</p>
                        </td>
                        <td className="p-7 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                          {new Date(enq.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-7">
                          <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            enq.status === 'Closed' ? 'bg-green-50 text-green-600 border-green-100' :
                            enq.status === 'Contacted' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                            'bg-gold/10 text-gold border-gold/20 animate-pulse'
                          }`}>{enq.status}</span>
                        </td>
                        <td className="p-7 text-right">
                          <div className="flex gap-2 justify-end flex-wrap">
                            {enq.status !== 'Contacted' && (
                              <button onClick={() => handleEnquiryStatus(enq._id, 'Contacted')} className="px-4 py-2.5 bg-blue-50 text-blue-500 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
                                Contacted
                              </button>
                            )}
                            {enq.status !== 'Closed' && (
                              <button onClick={() => handleEnquiryStatus(enq._id, 'Closed')} className="px-4 py-2.5 bg-green-50 text-green-600 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">
                                Close
                              </button>
                            )}
                            <button onClick={() => handleDeleteEnquiry(enq._id)} className="p-2.5 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all" title="Delete">
                              <Trash2 size={14}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CLIENT SERVICE REQUESTS ── */}
          {view === 'servicerequests' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Stat val={serviceRequests.length} label="Total Requests" sub="All clients" />
                <Stat val={serviceRequests.filter((r: any) => r.status === 'pending').length} label="Pending" sub="Awaiting action" />
                <Stat val={serviceRequests.filter((r: any) => r.status === 'completed').length} label="Completed" sub="Fulfilled" />
              </div>
              <div className="bg-white rounded-[60px] shadow-3xl border border-navy/5 overflow-hidden">
                <div className="p-10 border-b border-navy/5 flex items-center justify-between bg-[#fcfbf9]">
                  <h3 className="font-serif text-2xl font-black italic tracking-tighter">Client Service Requests</h3>
                  <ClipboardList className="text-gold/30" size={32}/>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-[#0b1f3a] text-gold-lt uppercase">
                    <tr>
                      <th className="p-7 text-[10px] font-black tracking-widest">Client</th>
                      <th className="p-7 text-[10px] font-black tracking-widest">Service</th>
                      <th className="p-7 text-[10px] font-black tracking-widest">Location</th>
                      <th className="p-7 text-[10px] font-black tracking-widest">Target Date</th>
                      <th className="p-7 text-[10px] font-black tracking-widest">Priority</th>
                      <th className="p-7 text-[10px] font-black tracking-widest">Status</th>
                      <th className="p-7 text-[10px] font-black tracking-widest text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede6]">
                    {serviceRequests.length === 0 && (
                      <tr><td colSpan={7} className="p-20 text-center text-slate-400 italic text-xs uppercase tracking-widest">No client service requests yet.</td></tr>
                    )}
                    {serviceRequests.map((req: any) => (
                      <tr key={req._id} className="hover:bg-gold/[0.02] transition-colors align-top">
                        <td className="p-7">
                          <span className="block font-black text-navy text-base">{req.userId?.name || 'Unknown'}</span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5"><Mail size={10}/> {req.userId?.email || '—'}</span>
                        </td>
                        <td className="p-7 font-serif font-bold text-xl text-navy italic tracking-tighter">{req.serviceType}</td>
                        <td className="p-7 text-xs font-bold text-slate-500 max-w-[140px]">{req.location}</td>
                        <td className="p-7 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                          <span className="flex items-center gap-1.5"><Calendar size={11} className="text-gold"/>
                            {req.targetDate ? new Date(req.targetDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          </span>
                        </td>
                        <td className="p-7">
                          <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${req.priority === 'Urgent Dispatch' ? 'bg-red-50 text-red-500 border border-red-100' : req.priority === 'High Priority' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                            {req.priority}
                          </span>
                        </td>
                        <td className="p-7">
                          <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${req.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : req.status === 'vetted' ? 'bg-blue-50 text-blue-500 border-blue-100' : 'bg-gold/10 text-gold border-gold/20 animate-pulse'}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-7 text-right">
                          <select
                            value={req.status}
                            onChange={(e) => handleServiceRequestStatus(req._id, e.target.value)}
                            className="text-[10px] font-black uppercase bg-[#f9f8f6] border border-navy/10 rounded-2xl px-4 py-2.5 text-navy cursor-pointer hover:border-gold transition-all outline-none"
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
                {serviceRequests.some((r: any) => r.details) && (
                  <div className="p-10 border-t border-navy/5 bg-[#fcfbf9]">
                    <h4 className="font-serif font-black text-lg italic text-navy mb-6">Request Notes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {serviceRequests.filter((r: any) => r.details).map((req: any) => (
                        <div key={`detail-${req._id}`} className="p-6 bg-white rounded-[30px] border border-navy/5 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-black text-sm text-navy italic">{req.serviceType}</span>
                            <span className="text-[9px] font-black text-gold uppercase tracking-widest">{req.userId?.name}</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{req.details}</p>
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
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(11, 31, 58, 0.1); }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

function TabBtn({ active, onClick, label, ico }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-5 p-5 rounded-[22px] transition-all font-black text-[10px] uppercase tracking-[0.25em] border-l-4 border-t-2 border-r shadow-md group ${active ? 'bg-gold/15 text-gold-lt border-gold shadow-gold/20' : 'text-white/20 border-transparent hover:text-white hover:bg-white/5'}`}>
      <span className={active ? 'text-gold' : 'opacity-20 group-hover:opacity-40 transition-opacity'}>{ico}</span>
      <span>{label}</span>
    </button>
  );
}

function Stat({ val, label, sub }: any) {
  return (
    <div className="bg-white p-12 rounded-[55px] border border-navy/5 shadow-2xl relative overflow-hidden transition-all hover:scale-105 hover:border-gold duration-500">
      <h4 className="text-6xl font-serif font-black italic text-navy leading-none mb-4 underline decoration-gold/20 decoration-8 underline-offset-[2px]">{val}</h4>
      <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{label}</p>
      <span className="text-[9px] font-bold text-slate-300 italic opacity-60 tracking-widest">{sub}</span>
    </div>
  );
}
