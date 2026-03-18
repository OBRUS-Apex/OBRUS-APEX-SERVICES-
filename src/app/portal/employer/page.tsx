"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Briefcase, Users, X, Send,
  DollarSign, MapPin, ChevronRight, CheckCircle,
  FileText, Mail, Calendar, LogOut,
  Home, Menu, Building2, Clock, AlertCircle,
  Trash2, EyeOff, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['HSE Consultancy', 'Technical', 'Recruitment', 'Environmental'];

export default function EmployerPortal() {
  const router = useRouter();
  const [view, setView] = useState<'overview' | 'jobs' | 'applicants'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [jobForm, setJobForm] = useState({
    title: '', category: 'HSE Consultancy', location: '',
    minPay: '', maxPay: '', description: '', requirements: ''
  });

  useEffect(() => {
    const session = localStorage.getItem('user');
    if (!session) { router.push('/auth'); return; }
    const u = JSON.parse(session);
    setUser(u);
    fetchJobs(u._id);
  }, [router]);

  const fetchJobs = async (id: string) => {
    try {
      const res = await fetch(`/api/jobs?employerId=${id}`);
      const data = res.ok ? await res.json() : [];
      setJobs(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const load = toast.loading('Posting job...');
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobForm.title, description: jobForm.description,
          requirements: jobForm.requirements, category: jobForm.category,
          location: jobForm.location,
          salaryRange: { min: Number(jobForm.minPay) || 0, max: Number(jobForm.maxPay) || 0 },
          employerId: user._id,
        })
      });
      if (res.ok) {
        toast.success('Job posted successfully', { id: load });
        setPostModal(false);
        setJobForm({ title: '', category: 'HSE Consultancy', location: '', minPay: '', maxPay: '', description: '', requirements: '' });
        fetchJobs(user._id);
        setView('jobs');
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || 'Failed to post job', { id: load });
      }
    } catch { toast.error('Network error', { id: load }); }
  };

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    const load = toast.loading(newStatus === 'closed' ? 'Closing listing...' : 'Reopening listing...');
    try {
      const res = await fetch('/api/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, status: newStatus })
      });
      if (res.ok) {
        toast.success(newStatus === 'closed' ? 'Listing closed' : 'Listing reopened', { id: load });
        fetchJobs(user._id);
      } else toast.error('Failed to update status', { id: load });
    } catch { toast.error('Network error', { id: load }); }
  };

  const handleDeleteJob = async (jobId: string) => {
    const load = toast.loading('Deleting listing...');
    try {
      const res = await fetch('/api/jobs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
      if (res.ok) {
        toast.success('Listing deleted', { id: load });
        setConfirmDelete(null);
        if (selectedJobId === jobId) { setSelectedJobId(null); setView('jobs'); }
        fetchJobs(user._id);
      } else toast.error('Failed to delete', { id: load });
    } catch { toast.error('Network error', { id: load }); }
  };

  const openApplicants = async (jobId: string) => {
    setSelectedJobId(jobId);
    setView('applicants');
    setLoadingApplicants(true);
    try {
      const res = await fetch(`/api/applications?jobId=${jobId}`);
      const data = res.ok ? await res.json() : [];
      setApplicants(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load applicants'); }
    finally { setLoadingApplicants(false); }
  };

  const handleSendOffer = async (appId: string, candidateName: string) => {
    const load = toast.loading(`Sending offer to ${candidateName}...`);
    try {
      const res = await fetch('/api/jobs/offer', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId })
      });
      if (res.ok) { toast.success('Offer sent!', { id: load }); openApplicants(selectedJobId!); }
      else toast.error('Failed to send offer', { id: load });
    } catch { toast.error('Network error', { id: load }); }
  };

  const handleLogout = () => { localStorage.clear(); router.push('/auth'); };
  const switchView = (v: typeof view) => { setView(v); setSidebarOpen(false); };
  const isApproved = user?.status === 'active';
  const selectedJob = jobs.find(j => j._id === selectedJobId);
  const activeJobs = jobs.filter(j => j.status === 'open');
  const viewTitles = { overview: 'Overview', jobs: 'My Job Listings', applicants: 'Applicants' };

  if (loading) return (
    <div className="h-screen bg-[#060f1e] flex flex-col items-center justify-center font-sans">
      <div className="w-10 h-10 border-2 border-[#c8921e] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-white/30 font-semibold uppercase text-xs tracking-widest">Loading your portal...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f5f0e8] text-[#0b1f3a] font-sans overflow-hidden">

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-[90] md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Trash2 size={24} className="text-red-500"/>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0b1f3a] italic mb-2">Delete Listing?</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">This will permanently remove the job listing and cannot be undone. All associated applicants will also be affected.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 bg-[#f5f0e8] text-[#0b1f3a] rounded-2xl font-bold text-sm hover:bg-[#e8e3db] transition-all">Cancel</button>
                <button onClick={() => handleDeleteJob(confirmDelete)} className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 transition-all active:scale-95">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside
        style={{ transform: sidebarOpen ? 'translateX(0)' : undefined }}
        className="w-[260px] bg-[#060f1e] fixed inset-y-0 left-0 border-r border-white/5 z-[100] flex flex-col shadow-2xl -translate-x-full md:translate-x-0 transition-transform duration-300"
      >
        <div className="p-5 border-b border-white/5">
          <div className="bg-white rounded-xl px-2 py-1.5 inline-block">
            <img src="/logo.png" alt="OBRUS Apex Services" className="h-8 w-auto" />
          </div>
          <p className="text-[#e8b84b] text-[10px] uppercase tracking-widest opacity-60 mt-2 ml-1">Employer Portal</p>
        </div>

        <nav className="p-4 flex-1 space-y-1 mt-4">
          <SidebarLink label="Overview" ico={<Home size={17}/>} active={view === 'overview'} onClick={() => switchView('overview')}/>
          <SidebarLink label="My Job Listings" ico={<Briefcase size={17}/>} active={view === 'jobs' || view === 'applicants'} onClick={() => switchView('jobs')}/>
          <SidebarLink label="Post a Job" ico={<Plus size={17}/>} active={false} onClick={() => { setSidebarOpen(false); setPostModal(true); }} disabled={!isApproved}/>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400/40 hover:text-red-400 font-semibold text-xs uppercase tracking-widest transition-all">
            <LogOut size={15}/> Log Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="md:ml-[260px] flex-1 flex flex-col min-h-screen overflow-y-auto custom-scrollbar">

        <header className="h-[64px] bg-white border-b border-[rgba(11,31,58,0.06)] flex items-center justify-between px-5 md:px-10 sticky top-0 z-[50]">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-xl border border-[rgba(11,31,58,0.08)] text-[#0b1f3a]/40 hover:text-[#c8921e] hover:border-[#c8921e] transition-all">
              <Menu size={19}/>
            </button>
            <h2 className="font-serif text-xl md:text-2xl font-bold italic text-[#0b1f3a] tracking-tight">{viewTitles[view]}</h2>
          </div>
          <div className="flex gap-3 items-center">
            <div className="hidden sm:flex items-center gap-2 bg-[#f9f8f6] px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 border border-[rgba(11,31,58,0.06)]">
              <Calendar size={12}/> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <button onClick={() => setPostModal(true)} disabled={!isApproved} className="flex items-center gap-2 bg-[#0b1f3a] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#c8921e] hover:text-[#0b1f3a] transition-all disabled:opacity-30">
              <Plus size={15}/> <span className="hidden sm:inline">Post Job</span>
            </button>
          </div>
        </header>

        <div className="p-5 md:p-10 pb-24 w-full max-w-[1100px] mx-auto">

          {/* OVERVIEW */}
          {view === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {!isApproved && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
                  <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5"/>
                  <div>
                    <p className="font-bold text-amber-700 text-sm mb-1">Account Pending Approval</p>
                    <p className="text-amber-600 text-xs leading-relaxed">Your account is under review. You'll be notified by email once your RC documentation is verified and your account is activated.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                <KpiCard label="Active Listings" val={activeJobs.length} unit="Open" />
                <KpiCard label="Total Listings" val={jobs.length} unit="All time" />
                <KpiCard label="Account Status" val={isApproved ? 'Active' : 'Pending'} unit={isApproved ? 'Verified' : 'Review'} highlight={!isApproved}/>
              </div>

              <div className="bg-[#0b1f3a] p-8 md:p-12 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#c8921e]/[0.04] rounded-bl-full pointer-events-none" />
                <Building2 className="absolute bottom-6 right-6 text-[#c8921e]/[0.06]" size={120}/>
                <div className="relative z-10">
                  <h3 className="font-serif text-2xl md:text-3xl font-bold italic mb-3">{user?.employerProfile?.companyName || 'Welcome'}</h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-lg mb-8">Post job listings, review vetted candidates from OBRUS, and send offers directly. All candidates are pre-screened before reaching you.</p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => switchView('jobs')} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all">View Listings →</button>
                    {isApproved && (
                      <button onClick={() => setPostModal(true)} className="bg-[#c8921e] text-[#0b1f3a] px-6 py-3 rounded-2xl text-sm font-bold hover:bg-[#e8b84b] transition-all">Post a Job →</button>
                    )}
                  </div>
                </div>
              </div>

              {jobs.length > 0 && (
                <div className="bg-white rounded-2xl border border-[rgba(11,31,58,0.06)] overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-[rgba(11,31,58,0.05)] flex items-center justify-between">
                    <h3 className="font-semibold text-[#0b1f3a]">Recent Listings</h3>
                    <button onClick={() => switchView('jobs')} className="text-xs font-semibold text-[#c8921e] hover:underline">View all →</button>
                  </div>
                  {jobs.slice(0, 3).map((job: any) => (
                    <div key={job._id} onClick={() => openApplicants(job._id)} className="flex items-center justify-between p-4 border-b border-[rgba(11,31,58,0.04)] last:border-0 hover:bg-[#f9f8f6] cursor-pointer transition-all">
                      <div>
                        <p className="font-bold text-sm text-[#0b1f3a]">{job.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{job.location} · {job.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-full ${job.status === 'open' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>{job.status}</span>
                        <ChevronRight size={15} className="text-slate-300 shrink-0"/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* JOB LISTINGS */}
          {view === 'jobs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">{jobs.length} listing{jobs.length !== 1 ? 's' : ''} · {activeJobs.length} active</p>
                {isApproved && (
                  <button onClick={() => setPostModal(true)} className="flex items-center gap-1.5 text-xs font-bold text-[#c8921e] hover:underline">
                    <Plus size={13}/> Post new job
                  </button>
                )}
              </div>

              {jobs.length === 0 ? (
                <div className="py-28 text-center bg-white rounded-2xl border border-dashed border-[rgba(11,31,58,0.1)]">
                  <Briefcase size={40} className="mx-auto mb-4 text-slate-200"/>
                  <p className="text-slate-400 text-sm mb-6">No jobs posted yet.</p>
                  {isApproved && (
                    <button onClick={() => setPostModal(true)} className="px-8 py-3 bg-[#c8921e] text-[#0b1f3a] rounded-2xl font-bold text-sm hover:bg-[#e8b84b] transition-all">Post Your First Job</button>
                  )}
                </div>
              ) : (
                <div className="grid gap-3">
                  {jobs.map((job: any) => (
                    <div
                      key={job._id}
                      className={`bg-white rounded-2xl border p-5 md:p-6 transition-all ${job.status === 'closed' ? 'opacity-60' : ''} ${selectedJobId === job._id ? 'border-[#c8921e] shadow-md' : 'border-[rgba(11,31,58,0.06)] shadow-sm hover:shadow-md'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openApplicants(job._id)}>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-[9px] font-bold uppercase tracking-widest bg-[#0b1f3a] text-white px-3 py-1 rounded-full">{job.category}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${job.status === 'open' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>{job.status}</span>
                          </div>
                          <h4 className="font-serif text-xl font-bold text-[#0b1f3a] italic mb-2">{job.title}</h4>
                          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#c8921e]"/> {job.location}</span>
                            {job.salary && job.salary !== 'Negotiable' && (
  <span className="flex items-center gap-1.5"><DollarSign size={12} className="text-[#c8921e]"/> {job.salary}</span>
)}
                            <span className="flex items-center gap-1.5"><Clock size={12}/> {new Date(job.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleToggleStatus(job._id, job.status)}
                            className={`p-2.5 rounded-xl transition-all ${job.status === 'open' ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white'}`}
                            title={job.status === 'open' ? 'Close listing' : 'Reopen listing'}
                          >
                            {job.status === 'open' ? <EyeOff size={15}/> : <Eye size={15}/>}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(job._id)}
                            className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            title="Delete listing"
                          >
                            <Trash2 size={15}/>
                          </button>
                          <button
                            onClick={() => openApplicants(job._id)}
                            className="p-2.5 bg-[#f0ede6] text-[#0b1f3a] rounded-xl hover:bg-[#c8921e] hover:text-white transition-all"
                            title="View applicants"
                          >
                            <Users size={15}/>
                          </button>
                        </div>
                      </div>
                      {job.description && <p className="text-sm text-slate-500 leading-relaxed mt-3 line-clamp-2">{job.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* APPLICANTS */}
          {view === 'applicants' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <button onClick={() => switchView('jobs')} className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#0b1f3a] transition-all">
                ← Back to listings
              </button>

              {selectedJob && (
                <div className="bg-white rounded-2xl border border-[rgba(11,31,58,0.06)] p-5 shadow-sm flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#c8921e] mb-1">{selectedJob.category}</p>
                    <h3 className="font-serif text-xl font-bold text-[#0b1f3a] italic">{selectedJob.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{selectedJob.location}</p>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-3 py-1.5 rounded-full shrink-0 ${selectedJob.status === 'open' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>{selectedJob.status}</span>
                </div>
              )}

              {loadingApplicants ? (
                <div className="py-20 text-center">
                  <div className="w-8 h-8 border-2 border-[#c8921e] border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
                  <p className="text-slate-400 text-sm">Loading applicants...</p>
                </div>
              ) : applicants.length === 0 ? (
                <div className="py-28 text-center bg-white rounded-2xl border border-[rgba(11,31,58,0.06)]">
                  <Users size={40} className="mx-auto mb-4 text-slate-200"/>
                  <p className="text-slate-400 text-sm font-semibold">No applicants yet</p>
                  <p className="text-slate-300 text-xs mt-2 max-w-xs mx-auto leading-relaxed">Applicants appear here once they apply and are reviewed by the OBRUS team.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applicants.map((app: any) => (
                    <div key={app._id} className="bg-white rounded-2xl border border-[rgba(11,31,58,0.06)] p-5 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#f0ede6] rounded-xl flex items-center justify-center text-[#c8921e] font-bold text-base shrink-0">
                          {app.candidateId?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-[#0b1f3a] truncate">{app.candidateId?.name || 'Unknown'}</h5>
                          {app.candidateId?.email && (
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate"><Mail size={10} className="shrink-0"/> {app.candidateId.email}</p>
                          )}
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shrink-0 ${app.status === 'vetted' ? 'bg-green-50 text-green-600' : app.status === 'offered' ? 'bg-blue-50 text-blue-600' : app.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {app.cvUrl && (
                          <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#f5f0e8] rounded-xl text-xs font-bold text-[#0b1f3a] hover:bg-[#0b1f3a] hover:text-white transition-all">
                            <FileText size={13}/> View CV
                          </a>
                        )}
                        {app.status === 'vetted' && (
                          <button onClick={() => handleSendOffer(app._id, app.candidateId?.name)} className="flex-1 py-2.5 bg-[#0b1f3a] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#c8921e] hover:text-[#0b1f3a] transition-all active:scale-95">
                            Send Offer
                          </button>
                        )}
                        {app.status === 'offered' && (
                          <div className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2">
                            <CheckCircle size={13}/> Offer Sent
                          </div>
                        )}
                        {app.status === 'pending' && (
                          <div className="flex-1 py-2.5 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold uppercase tracking-widest text-center">Under Review</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* POST JOB MODAL */}
      <AnimatePresence>
        {postModal && (
          <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#060f1e]/90 backdrop-blur-xl">
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto custom-scrollbar">
              <form onSubmit={handlePostJob} className="p-7 md:p-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold italic text-[#0b1f3a]">Post a Job</h2>
                  <button type="button" onClick={() => setPostModal(false)} className="p-2.5 bg-[#f0ede6] rounded-full hover:bg-[#c8921e] hover:text-white transition-all"><X size={18}/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="fl">Job Title *</label>
                    <input required value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="fi" placeholder="e.g. Lead HSE Supervisor, Site Engineer..."/>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="fl">Category *</label>
                      <select required value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})} className="fi">
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="fl">Location *</label>
                      <input required value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="fi" placeholder="e.g. Port Harcourt, Lagos"/>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="fl">Min Pay (₦/Month)</label>
                      <input type="number" value={jobForm.minPay} onChange={e => setJobForm({...jobForm, minPay: e.target.value})} className="fi" placeholder="150,000"/>
                    </div>
                    <div>
                      <label className="fl">Max Pay (₦/Month)</label>
                      <input type="number" value={jobForm.maxPay} onChange={e => setJobForm({...jobForm, maxPay: e.target.value})} className="fi" placeholder="400,000"/>
                    </div>
                  </div>
                  <div>
                    <label className="fl">Job Description *</label>
                    <textarea required value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} className="fi h-28 py-4 resize-none" placeholder="Describe the role and key responsibilities..."/>
                  </div>
                  <div>
                    <label className="fl">Requirements</label>
                    <textarea value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} className="fi h-24 py-4 resize-none" placeholder="Qualifications, certifications, experience required..."/>
                  </div>
                </div>
                <button type="submit" className="w-full mt-6 py-4 bg-[#0b1f3a] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#c8921e] hover:text-[#0b1f3a] transition-all flex items-center justify-center gap-2 active:scale-95">
                  <Send size={16}/> Publish Job Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .fi { width: 100%; background: #f9f8f6; border: 1.5px solid rgba(11,31,58,0.06); padding: 13px 16px; border-radius: 14px; font-size: 14px; font-weight: 600; color: #0b1f3a; outline: none; transition: 0.3s; font-family: inherit; }
        .fi:focus { border-color: #c8921e; background: white; box-shadow: 0 4px 16px rgba(200,146,30,0.08); }
        .fl { font-size: 10px; font-weight: 700; text-transform: uppercase; color: rgba(11,31,58,0.35); letter-spacing: 0.2em; display: block; margin-bottom: 5px; margin-left: 2px; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(200,146,30,0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}

function SidebarLink({ label, ico, active, onClick, disabled }: any) {
  return (
    <button onClick={onClick} disabled={disabled} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest disabled:opacity-30 ${active ? 'bg-[#c8921e]/15 text-[#e8b84b] border-l-4 border-[#c8921e]' : 'text-white/25 hover:text-white hover:bg-white/5 border-l-4 border-transparent'}`}>
      <span className={active ? 'text-[#c8921e]' : 'opacity-30'}>{ico}</span>
      <span>{label}</span>
    </button>
  );
}

function KpiCard({ label, val, unit, highlight }: any) {
  return (
    <div className={`p-5 md:p-6 bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all ${highlight ? 'border-amber-200' : 'border-[rgba(11,31,58,0.06)] hover:border-[#c8921e]/30'}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xl md:text-2xl font-serif font-bold text-[#0b1f3a] italic truncate max-w-[70%]">{val}</h4>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-tight shrink-0 ${highlight ? 'bg-amber-50 text-amber-600' : 'bg-[#c8921e]/10 text-[#c8921e]'}`}>{unit}</span>
      </div>
      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{label}</span>
    </div>
  );
}
