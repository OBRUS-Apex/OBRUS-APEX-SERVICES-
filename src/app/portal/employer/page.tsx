"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, Briefcase, Users, X, Send,
  DollarSign, MapPin, ChevronRight, CheckCircle,
  FileText, Mail, Calendar, LogOut,
  Home, Menu, Building2, Clock, AlertCircle,
  Trash2, EyeOff, Eye, Globe, Bell, CreditCard, RefreshCw, Loader2, ArrowRight
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
    } catch { toast.error('Failed to load recruitment data'); }
    finally { setLoading(false); }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const load = toast.loading('Publishing vacancy...');
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobForm.title, 
          description: jobForm.description,
          requirements: jobForm.requirements, 
          category: jobForm.category,
          location: jobForm.location,
          salaryRange: { min: Number(jobForm.minPay) || 0, max: Number(jobForm.maxPay) || 0 },
          employerId: user._id,
        })
      });
      if (res.ok) {
        toast.success('Vacancy published successfully', { id: load });
        setPostModal(false);
        setJobForm({ title: '', category: 'HSE Consultancy', location: '', minPay: '', maxPay: '', description: '', requirements: '' });
        fetchJobs(user._id);
        setView('jobs');
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to post vacancy', { id: load });
      }
    } catch { toast.error('Network error', { id: load }); }
  };

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    const load = toast.loading('Updating status...');
    try {
      const res = await fetch('/api/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, status: newStatus })
      });
      if (res.ok) {
        toast.success(`Listing is now ${newStatus}`, { id: load });
        fetchJobs(user._id);
      } else toast.error('Failed to update status', { id: load });
    } catch { toast.error('Network error', { id: load }); }
  };

  const handleDeleteJob = async (jobId: string) => {
    const load = toast.loading('Removing listing...');
    try {
      const res = await fetch('/api/jobs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
      if (res.ok) {
        toast.success('Listing removed from registry', { id: load });
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
    } catch { toast.error('Failed to load candidate pool'); }
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
      if (res.ok) { 
        toast.success('Offer sent successfully', { id: load }); 
        openApplicants(selectedJobId!); 
      }
      else toast.error('Failed to send offer', { id: load });
    } catch { toast.error('Network error', { id: load }); }
  };

  const handleLogout = () => { localStorage.clear(); router.push('/auth'); };
  const switchView = (v: typeof view) => { setView(v); setSidebarOpen(false); };
  const isApproved = user?.status === 'active';
  const selectedJob = jobs.find(j => j._id === selectedJobId);
  const activeJobs = jobs.filter(j => j.status === 'open');

  if (loading) return (
    <div className="min-h-screen bg-[#112031] flex flex-col items-center justify-center font-sans">
      <div className="w-10 h-10 border-2 border-[#257242] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-white/30 font-semibold uppercase text-xs tracking-widest italic">Authenticating Access...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#fcfbf9] text-[#1a2e46] font-sans overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-[90] md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside style={{ transform: sidebarOpen ? 'translateX(0)' : undefined }} className="w-[280px] bg-[#112031] fixed inset-y-0 left-0 border-r border-white/5 z-[100] flex flex-col shadow-2xl -translate-x-full md:translate-x-0 transition-transform duration-500">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-white rounded-2xl p-1.5 w-11 h-11 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 duration-500">
               <img src="/logo.png" alt="O" className="h-full w-full object-contain" />
            </div>
            <div className="text-white">
               <h1 className="font-serif font-black text-xl italic tracking-tighter uppercase leading-none">Obrus</h1>
               <p className="text-[#257242] text-[8px] font-black uppercase tracking-[0.3em] mt-1 leading-none italic">Employer Hub</p>
            </div>
          </div>
        </div>

        <nav className="p-6 flex-1 space-y-1.5 mt-8 overflow-y-auto custom-scrollbar">
           <SidebarLink label="Dashboard" ico={<Home size={17}/>} active={view === 'overview'} onClick={() => switchView('overview')}/>
           <SidebarLink label="My Vacancies" ico={<Briefcase size={17}/>} active={view === 'jobs' || view === 'applicants'} onClick={() => switchView('jobs')}/>
           <SidebarLink label="Post New Job" ico={<Plus size={17}/>} active={false} onClick={() => { setSidebarOpen(false); setPostModal(true); }} disabled={!isApproved}/>
        </nav>

        <div className="p-8 border-t border-white/5 bg-[#0a1521]">
          <button onClick={handleLogout} className="flex items-center gap-4 text-red-400/40 hover:text-red-400 font-bold text-[10px] uppercase tracking-[0.3em] transition-all">
             <LogOut size={16}/> Sign Out
          </button>
        </div>
      </aside>

      <main className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-y-auto custom-scrollbar">
        <header className="h-[80px] bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-[50]">
          <div className="flex items-center gap-5">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-3 rounded-2xl bg-gray-50 text-[#1a2e46] transition-all"><Menu size={22}/></button>
            <h2 className="font-serif text-3xl font-black uppercase tracking-tighter italic text-[#1a2e46] underline decoration-[#257242]/20 underline-offset-[10px] decoration-4 leading-none">{view === 'applicants' ? 'Candidate Pool' : view}</h2>
          </div>
           <div className="flex gap-4 md:gap-6 items-center">
              <div className="hidden lg:flex items-center gap-2 bg-[#fcfbf9] px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 border border-gray-100 italic leading-none">
                 <Calendar size={12} className="text-[#257242]"/> {new Date().toDateString()}
              </div>
              <button onClick={() => fetchJobs(user._id)} className="p-2.5 rounded-xl text-gray-300 hover:text-[#257242] transition-colors"><RefreshCw size={18}/></button>
              <Link href="/" className="w-12 h-12 bg-[#1a2e46] rounded-2xl flex items-center justify-center text-[#c8921e] shadow-2xl transition-all hover:rotate-12 active:scale-95">
                <Globe size={20}/>
              </Link>
           </div>
        </header>

        <div className="p-6 md:p-12 pb-32 max-w-[1400px] mx-auto w-full animate-in fade-in duration-1000">

          {view === 'overview' && (
             <div className="space-y-10">
                {!isApproved && (
                  <div className="bg-amber-50 border border-[#c8921e]/20 rounded-[35px] p-8 flex items-start gap-6 shadow-sm">
                    <AlertCircle size={30} className="text-[#c8921e] shrink-0 mt-1"/>
                    <div>
                      <p className="font-black text-[#1a2e46] uppercase text-sm mb-1 tracking-tight">Verification in Progress</p>
                      <p className="text-gray-500 text-sm leading-relaxed italic">Your corporate profile is currently being audited. Recruitment features will be activated upon successful verification.</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                   <KpiCard label="Active Vacancies" val={activeJobs.length} unit="Live" theme="green" />
                   <KpiCard label="Total Listings" val={jobs.length} unit="History" theme="navy" />
                   <KpiCard label="Account Status" val={isApproved ? 'VERIFIED' : 'PENDING'} unit="Registry" theme={isApproved ? 'green' : 'gold'} highlight={!isApproved} />
                </div>

                <div className="bg-[#112031] p-12 md:p-20 rounded-[60px] text-white relative overflow-hidden shadow-3xl border border-white/5 group">
                   <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#257242]/[0.08] rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-[2000ms]"></div>
                   <Building2 className="absolute bottom-12 right-12 text-[#257242]/10 -rotate-12" size={180}/>
                   <div className="relative z-10">
                      <h3 className="font-serif text-5xl font-black mb-8 italic tracking-tighter decoration-[#257242] underline-offset-8 underline decoration-8 leading-none">{user?.employerProfile?.companyName || 'Corporate Hub'}</h3>
                      <p className="text-white/40 text-2xl font-light italic leading-relaxed max-w-xl border-l-4 border-[#257242] pl-8">Your account is authorized. You can now broadcast recruitment missions and engage with OBRUS-vetted professionals.</p>
                      <div className="flex gap-4 mt-14">
                        <button onClick={() => switchView('jobs')} className="bg-[#257242] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-green-700 transition-all">Manage Vacancies</button>
                        {isApproved && <button onClick={() => setPostModal(true)} className="bg-[#c8921e] text-[#112031] px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-white transition-all">Issue New Brief</button>}
                      </div>
                   </div>
                </div>
             </div>
          )}

          {view === 'jobs' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
               <div className="flex justify-between items-end px-4">
                  <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest italic">{jobs.length} Registered Listings</p>
                  {isApproved && <button onClick={() => setPostModal(true)} className="text-[#257242] font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-2"><Plus size={14}/> Add New Listing</button>}
               </div>

               {jobs.length === 0 ? (
                 <div className="bg-white p-32 rounded-[70px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-slate-200">
                    <Briefcase size={60} className="mb-6 opacity-10" />
                    <p className="font-black text-[10px] uppercase tracking-[0.3em]">No active vacancies found</p>
                 </div>
               ) : (
                 <div className="grid gap-6">
                    {jobs.map((job) => (
                      <div key={job._id} className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="flex-1 cursor-pointer" onClick={() => openApplicants(job._id)}>
                               <div className="flex items-center gap-4 mb-4">
                                  <span className="bg-[#1a2e46] text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic">{job.category}</span>
                                  <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${job.status === 'open' ? 'text-[#257242] border-[#257242]/20 bg-green-50' : 'text-gray-400 border-gray-100 bg-gray-50'}`}>{job.status}</span>
                               </div>
                               <h4 className="font-serif text-4xl font-bold italic tracking-tighter text-[#1a2e46] group-hover:underline decoration-[#257242]/20 mb-4">{job.title}</h4>
                               <div className="flex flex-wrap gap-8 text-[11px] font-black uppercase text-slate-400 tracking-tighter italic">
                                  <span className="flex items-center gap-3"><MapPin className="text-[#c8921e]" size={16}/> {job.location}</span>
                                  <span className="flex items-center gap-3"><DollarSign className="text-[#c8921e]" size={16}/> ₦{job.salaryRange?.min?.toLocaleString()} - ₦{job.salaryRange?.max?.toLocaleString()}</span>
                                  <span className="flex items-center gap-3"><Clock className="text-[#c8921e]" size={16}/> {new Date(job.createdAt).toLocaleDateString()}</span>
                               </div>
                            </div>
                            <div className="flex gap-3 shrink-0">
                               <button onClick={() => handleToggleStatus(job._id, job.status)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-[#1a2e46] hover:text-white transition-all shadow-inner">{job.status === 'open' ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                               <button onClick={() => setConfirmDelete(job._id)} className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-inner"><Trash2 size={18}/></button>
                               <button onClick={() => openApplicants(job._id)} className="bg-[#257242] text-white px-8 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#1a2e46] transition-all flex items-center gap-3">View Candidates <ChevronRight size={14}/></button>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {view === 'applicants' && (
            <div className="space-y-10 animate-in fade-in duration-700">
               <div className="flex items-center justify-between px-4">
                  <button onClick={() => switchView('jobs')} className="text-[10px] font-black uppercase text-slate-400 hover:text-[#1a2e46] flex items-center gap-2 transition-all"><ArrowRight size={14} className="rotate-180"/> Back to Vacancies</button>
                  {selectedJob && <span className="text-[10px] font-black uppercase text-[#257242] italic tracking-widest">Target: {selectedJob.title}</span>}
               </div>

               {loadingApplicants ? (
                 <div className="py-32 text-center"><Loader2 className="animate-spin mx-auto text-[#257242] mb-4" size={40}/><p className="font-black text-[10px] uppercase tracking-widest opacity-20">Scanning Registry...</p></div>
               ) : applicants.length === 0 ? (
                 <div className="bg-white p-32 rounded-[70px] border border-gray-100 flex flex-col items-center justify-center text-slate-200 text-center">
                    <Users size={60} className="mb-6 opacity-10" />
                    <p className="font-black text-[10px] uppercase tracking-[0.3em] mb-2">No candidates found</p>
                    <p className="text-xs font-medium text-slate-400 max-w-xs italic">Qualified candidates will appear here once they are vetted by OBRUS administrators.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {applicants.map((app) => (
                      <div key={app._id} className="bg-white p-10 rounded-[55px] border border-gray-100 shadow-2xl relative overflow-hidden group">
                         <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 bg-[#fcfbf9] rounded-2xl flex items-center justify-center font-serif text-2xl font-black text-[#1a2e46] italic border shadow-inner uppercase">{app.candidateId?.name?.[0]}</div>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${app.status === 'vetted' ? 'bg-green-50 text-[#257242] border-[#257242]/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{app.status}</span>
                         </div>
                         <h5 className="font-serif text-4xl font-bold italic tracking-tighter text-[#1a2e46] mb-2">{app.candidateId?.name}</h5>
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-10 italic border-l-4 border-[#257242] pl-4">Registry ID: {app._id.slice(-6).toUpperCase()}</p>

                         <div className="grid grid-cols-2 gap-4 mb-10">
                            <a href={app.cvUrl} target="_blank" rel="noreferrer" className="flex flex-col p-6 bg-gray-50 rounded-[30px] transition-all hover:bg-[#1a2e46] hover:text-white group/cv shadow-inner">
                               <FileText size={20} className="text-[#257242] mb-3 group-hover/cv:text-[#c8921e] transition-colors"/>
                               <span className="text-[10px] font-black uppercase tracking-widest">Audit CV</span>
                            </a>
                            <div className="flex flex-col p-6 border-2 border-gray-50 rounded-[30px] justify-center">
                               <span className="text-[9px] font-black uppercase text-slate-300 mb-1">Contact Link</span>
                               <span className="text-[11px] font-bold truncate text-[#1a2e46]">{app.candidateId?.email}</span>
                            </div>
                         </div>

                         {app.status === 'vetted' ? (
                           <button onClick={() => handleSendOffer(app._id, app.candidateId?.name)} className="w-full py-5 bg-[#257242] text-white rounded-[30px] font-black text-[10px] uppercase tracking-[0.3em] shadow-3xl hover:bg-[#1a2e46] transition-all active:scale-95">Send Job Offer</button>
                         ) : app.status === 'offered' ? (
                           <div className="w-full py-5 bg-blue-50 text-blue-600 rounded-[30px] font-black text-[10px] uppercase tracking-[0.3em] text-center border border-blue-100 italic">Offer Dispatched ✓</div>
                         ) : (
                           <div className="w-full py-5 bg-gray-50 text-gray-400 rounded-[30px] font-black text-[10px] uppercase tracking-[0.3em] text-center italic">Awaiting Vetting</div>
                         )}
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

        </div>
      </main>

      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-[#060f1e]/90 backdrop-blur-md no-print">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[60px] p-16 max-w-md w-full shadow-2xl text-center border border-gray-100">
              <Trash2 size={50} className="text-red-500 mx-auto mb-8 opacity-20"/>
              <h3 className="font-serif text-4xl font-bold text-[#1a2e46] italic mb-4">Archive Listing?</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-12 italic">This action will permanently remove the vacancy brief from the active network.</p>
              <div className="flex gap-4">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-4 bg-gray-50 text-[#1a2e46] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
                <button onClick={() => handleDeleteJob(confirmDelete)} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all">Confirm Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {postModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-[#060f1e]/98 backdrop-blur-xl no-print overflow-y-auto">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-4xl rounded-[80px] p-12 md:p-24 shadow-2xl relative my-auto border border-gray-100 overflow-y-auto max-h-[95vh] custom-scrollbar">
              <button type="button" onClick={() => setPostModal(false)} className="absolute top-12 right-12 p-4 bg-gray-50 rounded-full hover:bg-[#257242] hover:text-white transition-all duration-500 shadow-xl"><X size={28}/></button>
              <h3 className="font-serif text-7xl font-black italic tracking-tighter uppercase text-[#1a2e46] mb-4">Mission Brief</h3>
              <p className="text-[10px] font-black text-[#257242] uppercase tracking-[0.6em] border-l-[10px] border-[#257242] pl-8 mb-20 leading-none">Initialize Recruitment Loop</p>

              <form onSubmit={handlePostJob} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-3"><label className="l-st">Target Position</label><input required className="ih" placeholder="e.g. Lead HSE Supervisor" onChange={e => setJobForm({...jobForm, title: e.target.value})}/></div>
                   <div className="space-y-3"><label className="l-st"> Location</label><input required className="ih" placeholder="Site / Region" onChange={e => setJobForm({...jobForm, location: e.target.value})}/></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-3"><label className="l-st">Budget Floor (₦)</label><input type="number" required className="ih" placeholder="150,000" onChange={e => setJobForm({...jobForm, minPay: e.target.value})}/></div>
                   <div className="space-y-3"><label className="l-st">Budget Ceiling (₦)</label><input type="number" required className="ih" placeholder="400,000" onChange={e => setJobForm({...jobForm, maxPay: e.target.value})}/></div>
                </div>
                <div className="space-y-3">
                   <label className="l-st">Specialism Tier</label>
                   <select required className="ih cursor-pointer font-black italic" onChange={e => setJobForm({...jobForm, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                   </select>
                </div>
                <div className="space-y-3">
                   <label className="l-st">Technical Requirements</label>
                   <textarea required className="ih h-40 py-8 resize-none leading-relaxed italic" placeholder="Outline deliverables, vetting criteria, and mission scope..." onChange={e => setJobForm({...jobForm, description: e.target.value})}/>
                </div>
                <button type="submit" className="w-full py-8 bg-[#1a2e46] text-white rounded-[45px] font-black text-xs uppercase tracking-[0.6em] shadow-3xl hover:bg-[#257242] transition-all transform hover:scale-105 shadow-[#257242]/20">Transmit secure briefing</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .ih { width: 100%; background: #fdfdfd; border: 1.5px solid #efefef; border-radius: 25px; padding: 22px 28px; color: #112031; font-size: 15px; font-weight: 800; outline: none; transition: 0.5s; font-style: italic; }
        .ih:focus { border-color: #257242; box-shadow: 0 15px 40px rgba(37, 114, 66, 0.04); background: white; }
        .l-st { font-size: 10px; font-weight: 900; text-transform: uppercase; color: rgba(37, 114, 66, 0.3); margin-left: 20px; letter-spacing: 0.3em; display: block; margin-bottom: 8px; italic; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(37, 114, 66, 0.3); border-radius: 50px; }
      `}</style>
    </div>
  );
}

function SidebarLink({ label, ico, active, onClick, disabled }: any) {
  return (
    <button onClick={onClick} disabled={disabled} className={`w-full flex items-center gap-5 p-5 rounded-[22px] transition-all font-black text-[10px] uppercase tracking-[0.4em] border-l-4 italic ${active ? 'bg-[#257242]/20 text-[#257242] border-[#257242] shadow-2xl translate-x-2' : 'text-white/20 border-transparent hover:text-white/80 hover:bg-white/5'}`}>
       <span className={active ? 'text-[#257242]' : 'opacity-20'}>{ico}</span>
       <span>{label}</span>
    </button>
  );
}

function KpiCard({ label, val, unit, theme, highlight }: any) {
  const styles: any = { 
    green: "border-[#257242]/20 text-[#1a2e46] shadow-green-600/5", 
    gold: "border-[#c8921e]/20 text-[#112031] shadow-amber-600/5",
    navy: "border-[#1a2e46]/20 text-blue-900 shadow-blue-900/5"
  };
  return (
    <div className={`p-10 bg-white rounded-[55px] border shadow-2xl transition-all duration-1000 hover:rotate-1 group hover:border-[#257242] ${styles[theme]} ${highlight ? 'animate-pulse border-amber-300' : ''}`}>
       <div className="flex justify-between items-start mb-1">
          <h4 className="text-4xl font-serif font-black underline underline-offset-[8px] decoration-4 tracking-tighter decoration-[#257242]/20 italic">{val}</h4>
          <span className="text-[9px] font-black bg-gray-50 px-2 py-0.5 rounded italic shadow-inner">{unit}</span>
       </div>
       <p className="text-[10px] font-black uppercase text-slate-300 mt-5 leading-none italic tracking-tighter">{label}</p>
    </div>
  );
}