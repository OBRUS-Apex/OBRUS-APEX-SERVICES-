"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase, MapPin, DollarSign, Plus, X, Send,
  FileText, CheckCircle, Users, ChevronRight,
  Search, Filter, Clock, Building2, Upload, Phone, User, Mail
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'HSE Consultancy', 'Technical', 'Recruitment', 'Environmental'];

export default function RecruitmentPage() {
  const [tab, setTab] = useState<'seeker' | 'employer'>('seeker');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applyModal, setApplyModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Employer state
  const [postModal, setPostModal] = useState(false);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [selectedMyJob, setSelectedMyJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);

  const [applyForm, setApplyForm] = useState({ name: '', phone: '', email: '', cvUrl: '' });
  const [jobForm, setJobForm] = useState({
    title: '', category: 'HSE Consultancy', location: '',
    minPay: '', maxPay: '', description: '', requirements: ''
  });

  useEffect(() => {
    const session = localStorage.getItem('user');
    if (session) {
      const u = JSON.parse(session);
      setUser(u);
      setApplyForm(f => ({ ...f, name: u.name || '', phone: u.phone || '', email: u.email || '' }));
      if (u.userType === 'employer') setTab('employer');
    }
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyJobs = async () => {
    if (!user?._id) return;
    const res = await fetch(`/api/jobs?employerId=${user._id}`);
    const data = await res.json();
    setMyJobs(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (tab === 'employer' && user?._id) fetchMyJobs();
  }, [tab, user]);

  const fetchApplicants = async (jobId: string) => {
    setSelectedMyJob(jobId);
    const res = await fetch(`/api/applications?jobId=${jobId}`);
    const data = await res.json();
    setApplicants(Array.isArray(data) ? data : []);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return toast.error('Please log in to apply');
    if (!applyForm.cvUrl) return toast.error('Please provide your CV link');
    const load = toast.loading('Submitting application...');
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJob._id,
          candidateId: user._id,
          employerId: selectedJob.employerId,
          cvUrl: applyForm.cvUrl,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Application submitted!', { id: load });
        setApplyModal(false);
        setSelectedJob(null);
      } else {
        toast.error(data.message || 'Submission failed', { id: load });
      }
    } catch {
      toast.error('Network error', { id: load });
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return toast.error('Please log in');
    const load = toast.loading('Posting job...');
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...jobForm,
          employerId: user._id,
          salaryRange: { min: Number(jobForm.minPay), max: Number(jobForm.maxPay) },
        }),
      });
      if (res.ok) {
        toast.success('Job posted!', { id: load });
        setPostModal(false);
        setJobForm({ title: '', category: 'HSE Consultancy', location: '', minPay: '', maxPay: '', description: '', requirements: '' });
        fetchMyJobs();
        fetchAllJobs();
      } else {
        const d = await res.json();
        toast.error(d.message || 'Failed', { id: load });
      }
    } catch {
      toast.error('Network error', { id: load });
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchCat = catFilter === 'All' || j.category === catFilter;
    const matchSearch = !search || j.title?.toLowerCase().includes(search.toLowerCase()) || j.location?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const catColors: Record<string, string> = {
    'HSE Consultancy': 'bg-amber-50 text-amber-700 border-amber-200',
    'Technical': 'bg-blue-50 text-blue-700 border-blue-200',
    'Recruitment': 'bg-purple-50 text-purple-700 border-purple-200',
    'Environmental': 'bg-green-50 text-green-700 border-green-200',
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] font-sans">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(6,10,20,0.96)] backdrop-blur border-b border-[rgba(200,146,30,0.16)]">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c8921e] rounded flex items-center justify-center font-black text-[#0b1f3a] text-lg italic">O</div>
            <div>
              <span className="block text-white font-bold text-sm leading-none">OBRUS</span>
              <span className="text-[#e8b84b] text-[9px] uppercase tracking-widest">Apex Services</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {[['/', 'Home'], ['/recruitment', 'Recruitment'], ['/environmental', 'Environmental'], ['/equipment', 'Equipment'], ['/hse', 'HSE']].map(([href, label]) => (
              <Link key={href} href={href} className={`px-3 py-1.5 rounded text-sm transition-all ${href === '/recruitment' ? 'bg-[rgba(200,146,30,0.15)] text-[#e8b84b]' : 'text-white/60 hover:text-[#e8b84b] hover:bg-[rgba(200,146,30,0.1)]'}`}>{label}</Link>
            ))}
            <Link href="/auth" className="ml-2 px-4 py-1.5 border border-white/20 rounded text-sm text-white/70 hover:text-white transition-all">Login</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-28 pb-14 px-5 bg-gradient-to-br from-[#060f1e] to-[#0b1f3a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(200,146,30,0.1),transparent_68%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-[rgba(200,146,30,0.12)] border border-[rgba(200,146,30,0.25)] rounded-full px-4 py-1.5 text-xs text-[#e8b84b] uppercase tracking-widest mb-4">💼 Recruitment Division</div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-4">Find Your Next<br/><span className="text-[#e8b84b]">Industrial Role</span></h1>
          <p className="text-white/50 text-base leading-relaxed max-w-xl mb-8">Browse verified job listings across HSE, Technical, Environmental, and Recruitment divisions. Apply directly and get matched by OBRUS.</p>

          {/* Tab switcher */}
          <div className="flex gap-3">
            <button onClick={() => setTab('seeker')} className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${tab === 'seeker' ? 'bg-[#c8921e] text-[#0b1f3a]' : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'}`}>
              👤 Job Seekers
            </button>
            <a href="https://obrus-apex-servicess.pxxl.click/portal/employer" className="flex items-center px-6 py-3 rounded-2xl font-bold text-sm transition-all bg-white/10 text-white/60 hover:bg-white/20 hover:text-white">
              🏢 Employers
            </a>
          </div>
        </div>
      </section>

      {/* ── JOB SEEKER VIEW ── */}
      {tab === 'seeker' && (
        <div className="max-w-6xl mx-auto px-5 py-10">

          {/* Search + filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search job title or location..."
                className="w-full bg-white border border-[rgba(11,31,58,0.08)] rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium text-[#0b1f3a] outline-none focus:border-[#c8921e] shadow-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCatFilter(cat)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${catFilter === cat ? 'bg-[#0b1f3a] text-white border-[#0b1f3a]' : 'bg-white text-slate-500 border-[rgba(11,31,58,0.08)] hover:border-[#c8921e] hover:text-[#c8921e]'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{filteredJobs.length} positions available</p>

          {loading ? (
            <div className="py-32 text-center">
              <div className="w-10 h-10 border-2 border-[#c8921e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-32 text-center bg-white rounded-3xl border border-[rgba(11,31,58,0.06)]">
              <Briefcase size={48} className="mx-auto mb-4 text-slate-200" />
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No jobs found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job: any) => (
                <div key={job._id} className="bg-white rounded-3xl border border-[rgba(11,31,58,0.06)] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer" onClick={() => setSelectedJob(job)}>
                  {/* Category badge */}
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block ${catColors[job.category] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {job.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-xl font-bold text-[#0b1f3a] mb-3 leading-snug group-hover:text-[#c8921e] transition-colors">{job.title}</h3>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400 mb-5">
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#c8921e]"/> {job.location || 'Nigeria'}</span>
                    {job.salary && job.salary !== 'Negotiable' && (
  <span className="flex items-center gap-1.5"><DollarSign size={13} className="text-[#c8921e]"/> {job.salary}</span>
)}
                    <span className="flex items-center gap-1.5"><Clock size={13}/> {new Date(job.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                  </div>

                  {/* Description preview */}
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-5">{job.description}</p>

                  <button className="w-full py-3 bg-[#0b1f3a] text-white rounded-2xl text-xs font-bold uppercase tracking-widest group-hover:bg-[#c8921e] transition-all">
                    Apply Now →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── EMPLOYER VIEW ── */}
      {tab === 'employer' && (
        <div className="max-w-6xl mx-auto px-5 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#0b1f3a] italic tracking-tighter">{user?.employerProfile?.companyName || 'Your Company'}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{myJobs.length} active listing{myJobs.length !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => setPostModal(true)} className="flex items-center gap-2 bg-[#0b1f3a] text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-[#c8921e] transition-all shadow-lg shrink-0">
              <Plus size={18}/> Post a Job
            </button>
          </div>

          {myJobs.length === 0 ? (
            <div className="py-32 text-center bg-white rounded-3xl border border-dashed border-[rgba(11,31,58,0.1)]">
              <Briefcase size={48} className="mx-auto mb-4 text-slate-200" />
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">No jobs posted yet</p>
              <button onClick={() => setPostModal(true)} className="px-8 py-3 bg-[#c8921e] text-[#0b1f3a] rounded-2xl font-bold text-sm">Post Your First Job</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myJobs.map((job: any) => (
                <div key={job._id} onClick={() => fetchApplicants(job._id)} className={`bg-white rounded-3xl border p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 ${selectedMyJob === job._id ? 'border-[#c8921e] shadow-lg' : 'border-[rgba(11,31,58,0.06)] shadow-sm'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${catColors[job.category] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>{job.category}</span>
                    <div className="w-9 h-9 bg-[#f0ede6] rounded-xl flex items-center justify-center text-[#0b1f3a] hover:bg-[#c8921e] hover:text-white transition-all">
                      <ChevronRight size={16}/>
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#0b1f3a] mb-3 leading-snug">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#c8921e]"/> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13}/> {new Date(job.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Applicants panel */}
          {selectedMyJob && applicants.length > 0 && (
            <div className="mt-8 bg-white rounded-3xl border border-[rgba(11,31,58,0.06)] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[rgba(11,31,58,0.05)] flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-[#0b1f3a] italic">Applicants ({applicants.length})</h3>
                <button onClick={() => { setSelectedMyJob(null); setApplicants([]); }} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"><X size={16}/></button>
              </div>
              <div className="divide-y divide-[rgba(11,31,58,0.04)]">
                {applicants.map((app: any) => (
                  <div key={app._id} className="p-5 flex items-center justify-between gap-4 hover:bg-[#fcfbf9] transition-all">
                    <div>
                      <p className="font-bold text-[#0b1f3a]">{app.candidateId?.name || 'Candidate'}</p>
                      <p className="text-xs text-slate-400">{app.candidateId?.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${app.status === 'vetted' ? 'bg-green-50 text-green-600' : app.status === 'offered' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>{app.status}</span>
                      {app.cvUrl && (
                        <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-[#f0ede6] rounded-xl text-xs font-bold text-[#0b1f3a] hover:bg-[#c8921e] hover:text-white transition-all">
                          <FileText size={13}/> CV
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── JOB DETAIL + APPLY MODAL ── */}
      {selectedJob && (
        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#060f1e]/90 backdrop-blur-xl">
          <div className="bg-white w-full sm:max-w-2xl rounded-t-[40px] sm:rounded-[40px] shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="p-6 sm:p-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${catColors[selectedJob.category] || ''}`}>{selectedJob.category}</span>
                <button onClick={() => setSelectedJob(null)} className="p-2.5 bg-[#f0ede6] rounded-full hover:bg-[#c8921e] hover:text-white transition-all"><X size={18}/></button>
              </div>

              <h2 className="font-serif text-3xl font-bold text-[#0b1f3a] mb-2 leading-tight">{selectedJob.title}</h2>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400 mb-6">
                <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#c8921e]"/> {selectedJob.location}</span>
                {selectedJob.salaryRange?.min > 0 && (
                  <span className="flex items-center gap-1.5"><DollarSign size={13} className="text-[#c8921e]"/> ₦{selectedJob.salaryRange.min.toLocaleString()} – ₦{selectedJob.salaryRange.max.toLocaleString()}/mo</span>
                )}
              </div>

              <div className="space-y-5 mb-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#c8921e] mb-2">About the Role</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedJob.description}</p>
                </div>
                {selectedJob.requirements && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#c8921e] mb-2">Requirements</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedJob.requirements}</p>
                  </div>
                )}
              </div>

              {!applyModal ? (
                <button onClick={() => setApplyModal(true)} className="w-full py-4 bg-[#0b1f3a] text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-[#c8921e] transition-all">
                  Apply for this Role →
                </button>
              ) : (
                <form onSubmit={handleApply} className="space-y-4 border-t border-[rgba(11,31,58,0.06)] pt-6">
                  <p className="font-serif text-xl font-bold text-[#0b1f3a] mb-4">Your Application</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                      <input required value={applyForm.name} onChange={e => setApplyForm({...applyForm, name: e.target.value})} className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.06)] rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium outline-none focus:border-[#c8921e]" placeholder="Full Name *"/>
                    </div>
                    <div className="relative">
                      <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                      <input required value={applyForm.phone} onChange={e => setApplyForm({...applyForm, phone: e.target.value})} className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.06)] rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium outline-none focus:border-[#c8921e]" placeholder="Phone Number *"/>
                    </div>
                  </div>
                  <div className="relative">
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input value={applyForm.email} onChange={e => setApplyForm({...applyForm, email: e.target.value})} className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.06)] rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium outline-none focus:border-[#c8921e]" placeholder="Email Address"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">CV / Resume Link *</label>
                    <input
                      required
                      value={applyForm.cvUrl}
                      onChange={e => setApplyForm({...applyForm, cvUrl: e.target.value})}
                      className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.06)] rounded-2xl px-4 py-3.5 text-sm font-medium outline-none focus:border-[#c8921e]"
                      placeholder="Paste Google Drive / Dropbox CV link"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 ml-1">Upload your CV to Google Drive and paste the shareable link here</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setApplyModal(false)} className="flex-1 py-3.5 border border-[rgba(11,31,58,0.1)] rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-3.5 bg-[#c8921e] text-[#0b1f3a] rounded-2xl font-bold text-sm hover:bg-[#0b1f3a] hover:text-white transition-all flex items-center justify-center gap-2">
                      <Send size={16}/> Submit Application
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── POST JOB MODAL ── */}
      {postModal && (
        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#060f1e]/90 backdrop-blur-xl">
          <div className="bg-white w-full sm:max-w-2xl rounded-t-[40px] sm:rounded-[40px] shadow-2xl max-h-[92vh] overflow-y-auto">
            <form onSubmit={handlePostJob} className="p-6 sm:p-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-3xl font-bold text-[#0b1f3a] italic">Post a Job</h2>
                <button type="button" onClick={() => setPostModal(false)} className="p-2.5 bg-[#f0ede6] rounded-full hover:bg-[#c8921e] hover:text-white transition-all"><X size={18}/></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Job Title *</label>
                  <input
                    required
                    value={jobForm.title}
                    onChange={e => setJobForm({...jobForm, title: e.target.value})}
                    className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.06)] rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-[#c8921e]"
                    placeholder="e.g. Lead HSE Supervisor, Site Engineer..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Category *</label>
                    <select required value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})} className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.06)] rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-[#c8921e]">
                      <option>HSE Consultancy</option>
                      <option>Technical</option>
                      <option>Recruitment</option>
                      <option>Environmental</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Location *</label>
                    <input required value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.06)] rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-[#c8921e]" placeholder="e.g. Port Harcourt, Lagos"/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Min Pay (₦/Mo)</label>
                    <input type="number" value={jobForm.minPay} onChange={e => setJobForm({...jobForm, minPay: e.target.value})} className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.06)] rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-[#c8921e]" placeholder="150,000"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Max Pay (₦/Mo)</label>
                    <input type="number" value={jobForm.maxPay} onChange={e => setJobForm({...jobForm, maxPay: e.target.value})} className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.06)] rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-[#c8921e]" placeholder="400,000"/>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Job Description *</label>
                  <textarea required value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.06)] rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-[#c8921e] h-28 resize-none" placeholder="Describe the role, responsibilities, and expectations..."/>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Requirements</label>
                  <textarea value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.06)] rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-[#c8921e] h-24 resize-none" placeholder="Qualifications, certifications, years of experience..."/>
                </div>
              </div>

              <button type="submit" className="w-full mt-6 py-4 bg-[#0b1f3a] text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-[#c8921e] hover:text-[#0b1f3a] transition-all flex items-center justify-center gap-2">
                <Send size={16}/> Publish Job Listing
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-[#060f1e] py-8 px-6 text-center text-white/40 text-sm mt-10">
        <p>© 2026 OBRUS APEX SERVICES · <Link href="/" className="text-[#e8b84b]">Home</Link> · <Link href="/hse" className="text-[#e8b84b]">HSE</Link> · <Link href="/environmental" className="text-[#e8b84b]">Environmental</Link> · <Link href="/equipment" className="text-[#e8b84b]">Equipment</Link></p>
      </footer>

      <style jsx>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
