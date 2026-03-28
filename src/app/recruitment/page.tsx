"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase, MapPin, DollarSign, Plus, X, Send,
  FileText, CheckCircle, Users, ChevronRight,
  Search, Filter, Clock, Building2, Upload, Phone, User, Mail, Loader2, ArrowRight
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

  const [postModal, setPostModal] = useState(false);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [selectedMyJobId, setSelectedMyJobId] = useState<string | null>(null);
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
    setSelectedMyJobId(jobId);
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
    <div className="min-h-screen bg-[#f5f0e8] font-sans text-[#1a2e46]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a2e46] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="O" className="h-8 w-auto object-contain" />
            </div>
            <div className="text-white">
              <span className="block font-serif font-black text-xl leading-none tracking-tighter uppercase italic">OBRUS APEX</span>
              <span className="text-[#257242] text-[9px] font-black uppercase tracking-widest">Recruitment Hub</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[['/', 'Home'], ['/recruitment', 'Careers'], ['/hse', 'Safety'], ['/environmental', 'Environmental']].map(([href, label]) => (
              <Link key={href} href={href} className={`text-[10px] font-black uppercase tracking-widest transition-all ${href === '/recruitment' ? 'text-[#257242]' : 'text-white/40 hover:text-white'}`}>{label}</Link>
            ))}
            <Link href="/auth" className="px-6 py-2 bg-[#257242] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-green-700 transition-all">Portal Access</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 bg-[#1a2e46] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#257242]/10 rounded-full blur-[120px] -mr-40 -mt-40" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-[10px] font-black text-[#257242] uppercase tracking-[0.3em] mb-6 italic">
            <div className="w-2 h-2 bg-[#257242] rounded-full animate-pulse" /> Industrial Placement Node
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-black text-white leading-none tracking-tighter mb-6 italic">
            Strategic <span className="text-[#257242]">Workforce</span><br/>Acquisition.
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mb-12 font-medium leading-relaxed italic">Vetted technical personnel and HSE specialists for high-stakes operations. Browse vacancies or establish a corporate hiring brief.</p>

          <div className="flex gap-4">
            <button onClick={() => setTab('seeker')} className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${tab === 'seeker' ? 'bg-[#257242] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
              Candidate Search
            </button>
            <button onClick={() => setTab('employer')} className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${tab === 'employer' ? 'bg-[#257242] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
              Employer Console
            </button>
          </div>
        </div>
      </section>

      {tab === 'seeker' && (
        <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-700">
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by role, location or keyword..."
                className="w-full bg-white border border-gray-100 rounded-[25px] pl-14 pr-6 py-5 text-sm font-bold text-[#1a2e46] outline-none focus:border-[#257242] shadow-xl"
              />
            </div>
            <div className="flex gap-3 flex-wrap items-center">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCatFilter(cat)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${catFilter === cat ? 'bg-[#1a2e46] text-white border-[#1a2e46] shadow-lg' : 'bg-white text-gray-400 border-gray-50 hover:border-[#257242]'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredJobs.map((job: any) => (
              <div key={job._id} className="bg-white rounded-[50px] border border-gray-100 p-10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#257242]/5 rounded-bl-full group-hover:scale-110 transition-transform duration-700" />
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border mb-6 inline-block ${catColors[job.category] || 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                  {job.category}
                </span>
                <h3 className="font-serif text-4xl font-bold text-[#1a2e46] mb-4 tracking-tighter italic group-hover:underline decoration-[#257242] decoration-4 underline-offset-8 transition-all">{job.title}</h3>
                <div className="flex flex-wrap gap-8 text-[11px] font-black uppercase text-gray-300 mb-8 italic">
                  <span className="flex items-center gap-2"><MapPin size={14} className="text-[#257242]"/> {job.location}</span>
                  <span className="flex items-center gap-2"><DollarSign size={14} className="text-[#257242]"/> Competitive Comp.</span>
                </div>
                <button onClick={() => setSelectedJob(job)} className="w-full py-4 bg-[#1a2e46] text-white rounded-[22px] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-[#257242] transition-all flex items-center justify-center gap-3">
                  Audit Details <ArrowRight size={14}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'employer' && (
        <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b pb-12 border-gray-100">
            <div>
              <h2 className="font-serif text-5xl font-black text-[#1a2e46] italic tracking-tighter uppercase leading-none mb-3">{user?.employerProfile?.companyName || 'Corporate Registry'}</h2>
              <p className="text-[10px] font-black text-[#257242] uppercase tracking-[0.4em] italic">Active Recruitment Node: {myJobs.length} Briefs</p>
            </div>
            <button onClick={() => setPostModal(true)} className="bg-[#1a2e46] text-white px-10 py-5 rounded-[25px] font-black text-xs uppercase tracking-widest shadow-3xl hover:bg-[#257242] transition-all flex items-center gap-4 group">
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500"/> New Mission Brief
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-6">
              {myJobs.map((job: any) => (
                <div key={job._id} onClick={() => fetchApplicants(job._id)} className={`bg-white p-10 rounded-[50px] border cursor-pointer transition-all hover:shadow-2xl relative overflow-hidden ${selectedMyJobId === job._id ? 'border-[#257242] shadow-3xl' : 'border-gray-100 shadow-sm'}`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#257242]/5 rounded-bl-full" />
                  <span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-[#1a2e46] text-white rounded-full mb-4 inline-block shadow-lg italic">{job.category}</span>
                  <h3 className="font-serif text-3xl font-bold text-[#1a2e46] mb-4 italic tracking-tighter">{job.title}</h3>
                  <div className="flex gap-8 text-[10px] font-black uppercase text-gray-300 italic">
                    <span className="flex items-center gap-2"><MapPin size={14} className="text-[#257242]"/> {job.location}</span>
                    <span className="flex items-center gap-2"><Clock size={14} className="text-[#257242]"/> {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 bg-white rounded-[60px] p-12 border border-gray-100 shadow-3xl sticky top-28 h-fit min-h-[500px]">
              <h3 className="font-serif text-3xl font-black italic mb-2 tracking-tighter">Vetting Pool</h3>
              <p className="text-[10px] font-black uppercase text-[#257242] tracking-[0.2em] mb-10 italic border-b pb-6">Approved Professional Matches</p>
              
              {applicants.length > 0 ? (
                <div className="space-y-6">
                  {applicants.map((app: any) => (
                    <div key={app._id} className="p-8 bg-[#fcfbf9] rounded-[40px] border border-[#257242]/10 shadow-sm hover:shadow-xl transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="font-black text-2xl tracking-tighter uppercase text-[#1a2e46] italic leading-none mb-1">{app.candidateId?.name}</p>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Security Cleared ✓</span>
                        </div>
                        <CheckCircle className="text-[#257242]" size={24}/>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        <a href={app.cvUrl} target="_blank" className="flex items-center justify-center p-3 bg-white rounded-2xl border border-gray-100 hover:border-[#257242] transition-all text-[10px] font-black uppercase tracking-widest">Audit CV</a>
                        <div className="flex items-center justify-center p-3 bg-white rounded-2xl border border-gray-100 text-[10px] font-black uppercase tracking-widest opacity-20 italic">Verified</div>
                      </div>
                      <button className="w-full py-4 bg-[#1a2e46] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-[#257242] transition-all">Dispatch Offer</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center text-gray-200">
                  <Users size={60} className="mx-auto mb-6 opacity-5" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] leading-loose opacity-40">Select an active brief to view <br/> OBRUS-vetted candidates</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-[#060f1e]/98 backdrop-blur-xl overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[70px] shadow-3xl relative my-auto border border-white/10 animate-in zoom-in-95 duration-500 overflow-hidden">
            <div className="p-12 md:p-20 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-start justify-between mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 bg-[#1a2e46] text-white rounded-full shadow-lg italic">{selectedJob.category}</span>
                <button onClick={() => { setSelectedJob(null); setApplyModal(false); }} className="p-4 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-xl"><X size={24}/></button>
              </div>

              <h2 className="font-serif text-6xl font-bold text-[#1a2e46] mb-4 tracking-tighter italic leading-none">{selectedJob.title}</h2>
              <div className="flex flex-wrap gap-10 text-[11px] font-black uppercase text-gray-300 mb-12 italic border-b pb-8 border-gray-50">
                <span className="flex items-center gap-3"><MapPin size={16} className="text-[#257242]"/> {selectedJob.location}</span>
                <span className="flex items-center gap-3"><DollarSign size={16} className="text-[#257242]"/> Authorized Compensation Hub</span>
              </div>

              <div className="space-y-10 mb-16">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#257242] mb-4 italic">Mission Parameters</p>
                  <p className="text-lg text-gray-500 leading-relaxed font-medium italic">"{selectedJob.description}"</p>
                </div>
                {selectedJob.requirements && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#257242] mb-4 italic">Technical Requirements</p>
                    <p className="text-lg text-gray-500 leading-relaxed font-medium italic">"{selectedJob.requirements}"</p>
                  </div>
                )}
              </div>

              {!applyModal ? (
                <button onClick={() => setApplyModal(true)} className="w-full py-6 bg-[#1a2e46] text-white rounded-[35px] font-black uppercase tracking-[0.5em] text-xs shadow-3xl hover:bg-[#257242] transition-all transform hover:scale-[1.02] active:scale-95">
                  Secure Identity for Vetting →
                </button>
              ) : (
                <form onSubmit={handleApply} className="space-y-6 animate-in slide-in-from-bottom-10 duration-700">
                  <h3 className="font-serif text-3xl font-bold text-[#1a2e46] mb-8 italic underline decoration-[#257242] decoration-4 underline-offset-8">Application Registry</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input required value={applyForm.name} className="fts" placeholder="Legal Full Identity" readOnly />
                    <input required value={applyForm.phone} className="fts" placeholder="Mobile Node" readOnly />
                  </div>
                  <input value={applyForm.email} className="fts" placeholder="Network Address (Email)" readOnly />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#257242] ml-6">Digital CV Link (Drive/Dropbox)</label>
                    <input required value={applyForm.cvUrl} onChange={e => setApplyForm({...applyForm, cvUrl: e.target.value})} className="fts" placeholder="https://drive.google.com/file/..." />
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setApplyModal(false)} className="px-10 py-5 border-2 border-gray-100 rounded-[25px] font-black text-[10px] uppercase tracking-widest text-gray-300 hover:bg-gray-50 transition-all">Abort</button>
                    <button type="submit" className="flex-1 py-5 bg-[#257242] text-white rounded-[25px] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:bg-[#1a2e46] transition-all">Submit for Industrial Audit</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {postModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-[#060f1e]/98 backdrop-blur-xl overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[80px] p-16 md:p-24 shadow-3xl relative my-auto border border-white/10 animate-in slide-in-from-bottom-10 duration-700">
            <form onSubmit={handlePostJob} className="space-y-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-serif text-6xl font-black text-[#1a2e46] italic tracking-tighter uppercase leading-none">New brief</h2>
                <button type="button" onClick={() => setPostModal(false)} className="p-4 bg-gray-50 rounded-full hover:bg-[#257242] hover:text-white transition-all shadow-xl"><X size={28}/></button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2"><label className="lbs">Position Identification</label><input required value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="fts" placeholder="Role Name" /></div>
                   <div className="space-y-2"><label className="lbs">Deployment node</label><input required value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="fts" placeholder="Site / Region" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="lbs">Specialism Tier</label>
                    <select required value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})} className="fts font-black italic cursor-pointer">
                      <option>HSE Consultancy</option><option>Technical</option><option>Recruitment</option><option>Environmental</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2"><label className="lbs">Min (₦)</label><input type="number" value={jobForm.minPay} onChange={e => setJobForm({...jobForm, minPay: e.target.value})} className="fts" placeholder="150k" /></div>
                     <div className="space-y-2"><label className="lbs">Max (₦)</label><input type="number" value={jobForm.maxPay} onChange={e => setJobForm({...jobForm, maxPay: e.target.value})} className="fts" placeholder="400k" /></div>
                  </div>
                </div>

                <div className="space-y-2"><label className="lbs">Mission scope description</label><textarea required value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} className="fts h-32 py-6 resize-none leading-relaxed italic" placeholder="Outline deliverables and expectations..."/></div>
                <div className="space-y-2"><label className="lbs">Technical vetting requirements</label><textarea value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} className="fts h-28 py-6 resize-none leading-relaxed italic" placeholder="Certifications, years of experience..."/></div>
              </div>

              <button type="submit" className="w-full py-8 bg-[#1a2e46] text-white rounded-[45px] font-black uppercase tracking-[0.6em] text-xs shadow-3xl hover:bg-[#257242] transition-all flex items-center justify-center gap-6 group">
                PUBLISH MISSION BRIEF <Send size={20} className="group-hover:translate-x-3 transition-transform"/>
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-[#060f1e] py-16 px-6 text-center border-t border-white/10">
        <img src="/logo.png" className="h-10 w-auto opacity-20 mx-auto mb-8 grayscale" alt="Obrus" />
        <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.6em] italic">© 2026 OBRUS APEX SERVICES · NIGERIA OPERATIONS HUB</p>
      </footer>

      <style jsx>{`
        .fts { width: 100%; background: #fdfdfd; border: 1.5px solid #efefef; border-radius: 25px; padding: 22px 28px; color: #112031; font-size: 15px; font-weight: 800; outline: none; transition: 0.5s; font-style: italic; }
        .fts:focus { border-color: #257242; box-shadow: 0 15px 40px rgba(37, 114, 66, 0.04); background: white; }
        .lbs { font-size: 10px; font-weight: 900; text-transform: uppercase; color: rgba(37, 114, 66, 0.3); margin-left: 20px; letter-spacing: 0.3em; display: block; margin-bottom: 6px; italic; }
        .shadow-3xl { box-shadow: 0 45px 120px -25px rgba(26, 46, 70, 0.15); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(37, 114, 66, 0.2); border-radius: 50px; }
      `}</style>
    </div>
  );
}