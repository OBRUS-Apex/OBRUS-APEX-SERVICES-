"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Users, X, Send, Loader2, DollarSign, MapPin, ChevronRight, CheckCircle, ShieldAlert, FileText, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployerPortal() {
  const [isJobModal, setIsJobModal] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [vettedApplicants, setVettedApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [jobForm, setJobForm] = useState({ 
    title: '', 
    category: 'HSE Consultancy', 
    location: '', 
    minPay: '', 
    maxPay: '', 
    desc: '', 
    reqs: '' 
  });

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(session);
    if (session?._id) {
      fetchEmployerJobs(session._id);
    } else {
      setLoading(false); // FIX: was stuck forever with no session
    }
  }, []);

  const fetchEmployerJobs = async (id: string) => {
    try {
      const res = await fetch(`/api/jobs?employerId=${id}`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Resource fetch failure");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const load = toast.loading("Syncing vacancy brief...");
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...jobForm, 
          employerId: user._id, 
          salaryRange: { min: Number(jobForm.minPay), max: Number(jobForm.maxPay) } 
        })
      });
      if (res.ok) {
        toast.success("Industrial Dispatch Live", { id: load });
        setIsJobModal(false);
        fetchEmployerJobs(user._id);
      }
    } catch (err) {
      toast.error("Logic transmission error", { id: load });
    }
  };

  const viewCandidates = async (jobId: string) => {
    setSelectedJobId(jobId);
    const res = await fetch(`/api/applications?jobId=${jobId}&status=vetted`);
    const data = await res.json();
    setVettedApplicants(Array.isArray(data) ? data : []);
  };

  const handleSendOffer = async (appId: string, candidateName: string) => {
    const load = toast.loading(`Dispatching offer to ${candidateName}...`);
    const res = await fetch('/api/jobs/offer', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: appId })
    });
    if (res.ok) toast.success("Contract terms transmitted", { id: load });
    else toast.error("Mail server timeout", { id: load });
  };

  if (loading) return (
    <div className="h-screen bg-[#060f1e] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-gold mb-4" size={40} />
      <p className="text-white/40 font-black uppercase text-[10px] tracking-[0.4em]">Establishing Portal Node...</p>
    </div>
  );

  const isApproved = user?.status === 'active';

  return (
    <div className="min-h-screen bg-[#fcfbf9] pt-28 pb-32 px-[5%] text-navy">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="w-full">
           <h1 className="font-serif text-5xl font-black italic tracking-tighter uppercase mb-2">
             {user?.employerProfile?.companyName || 'Industrial Division'}
           </h1>
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase text-gold tracking-[0.4em]">Corporate Hiring Hub</span>
              <div className="flex-1 h-[1px] bg-navy/5"></div>
           </div>
        </div>
        <button 
          onClick={() => setIsJobModal(true)} 
          disabled={!isApproved}
          className="bg-navy text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-gold hover:text-navy transition-all flex items-center gap-3 shrink-0 disabled:opacity-30"
        >
          <Plus size={18}/> Initiate Recruitment
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between px-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Current Mission Parameter: {jobs.length} Active</h3>
              {!isApproved && <span className="bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Profile Awaiting Vetting</span>}
           </div>

           {jobs.length === 0 ? (
              <div className="bg-white rounded-[45px] p-20 border border-dashed flex flex-col items-center justify-center text-slate-300">
                 <FileText size={50} className="mb-4 opacity-10" />
                 <p className="font-bold text-[10px] uppercase tracking-widest">No staffing briefs issued</p>
              </div>
           ) : (
             jobs.map((job: any) => (
                <div key={job._id} onClick={() => viewCandidates(job._id)} className={`p-10 rounded-[45px] border cursor-pointer transition-all bg-white group hover:shadow-2xl ${selectedJobId === job._id ? 'border-gold shadow-xl bg-off' : 'border-navy/5 shadow-sm'}`}>
                   <div className="flex justify-between items-start">
                      <div>
                         <span className="text-[9px] font-black bg-navy text-white px-3 py-1 rounded-full uppercase mb-4 inline-block tracking-[0.2em]">{job.category}</span>
                         <h4 className="text-3xl font-serif font-bold tracking-tight mb-3 italic">{job.title}</h4>
                         <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            <span className="flex items-center gap-2"><MapPin size={14} className="text-gold"/> {job.location}</span>
                            <span className="flex items-center gap-2 border-l pl-6 border-navy/10"><DollarSign size={14} className="text-gold"/> Monthly Budget: ₦{job.salaryRange.min.toLocaleString()} — ₦{job.salaryRange.max.toLocaleString()}</span>
                         </div>
                      </div>
                      <div className="w-14 h-14 bg-[#f0ede6] rounded-[22px] flex items-center justify-center text-navy group-hover:bg-gold transition-all duration-500 group-hover:rotate-90"><ChevronRight/></div>
                   </div>
                </div>
              ))
           )}
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-[50px] p-10 border border-navy/5 shadow-3xl sticky top-28 h-fit min-h-[500px]">
              <div className="text-center mb-10 border-b pb-8 border-navy/5">
                 <h3 className="font-serif text-2xl font-bold mb-1 tracking-tighter">Vetted match Pool</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Authorization Required</p>
              </div>

              {!isApproved && (
                <div className="absolute inset-0 bg-[#fcfbf9]/60 backdrop-blur-[2px] rounded-[50px] z-10 flex flex-col items-center justify-center p-12 text-center">
                   <Lock className="text-navy/20 mb-4" size={48}/>
                   <h4 className="font-bold text-navy/40 text-sm uppercase tracking-widest">Account Under Security Audit</h4>
                </div>
              )}

              {vettedApplicants.length > 0 ? (
                 <div className="space-y-4">
                    {vettedApplicants.map((app: any) => (
                       <div key={app._id} className="p-7 bg-[#fcfbf9] rounded-[35px] border border-gold/20 shadow-sm relative group/card overflow-hidden">
                          <CheckCircle className="text-green-500 mb-4" size={26}/>
                          <h5 className="font-bold text-xl mb-1 tracking-tight text-navy">{app.candidateId.name}</h5>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-6 tracking-tighter border-l-2 border-gold pl-3">Clearance: Level 1 Vetted</p>
                          
                          <div className="space-y-3 mb-8">
                             <a href={app.cvUrl} target="_blank" className="flex items-center gap-3 p-3 bg-white border border-navy/5 rounded-2xl hover:border-gold transition-all">
                                <FileText size={18} className="text-gold"/>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Analyze Resume</span>
                             </a>
                          </div>
                          
                          <button onClick={() => handleSendOffer(app._id, app.candidateId.name)} className="w-full py-4 bg-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-gold hover:text-navy transition-all active:scale-95">Send Job Offer</button>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="py-20 text-center text-slate-200">
                    <Users size={60} className="mx-auto mb-6 opacity-5"/>
                    <p className="text-[10px] font-bold uppercase tracking-widest leading-loose">Establish a Vacancy brief to <br/> activate personnel Matching</p>
                 </div>
              )}
           </div>
        </div>
      </div>

      {isJobModal && (
        <div className="fixed inset-0 z-[2000] bg-[#060f1e]/95 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
           <form onSubmit={handleCreateJob} className="bg-white w-full max-w-3xl rounded-[60px] p-16 shadow-2xl relative my-auto animate-in slide-in-from-bottom-10 duration-700">
              <button type="button" onClick={() => setIsJobModal(false)} className="absolute top-12 right-12 p-3 bg-navy/5 hover:bg-navy/10 rounded-full transition-all"><X size={20}/></button>
              <h3 className="font-serif text-5xl font-bold mb-3 tracking-tighter">Recruitment brief</h3>
              <p className="text-slate-400 text-sm mb-12 italic uppercase font-bold tracking-widest">Broadcasting Node: Verified OBRUS Submitter</p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                 <div className="space-y-2">
                   <label className="label-strict">Job Identification</label>
                   <input required className="input-strict" placeholder="e.g. Lead HSE Supervisor" onChange={e => setJobForm({...jobForm, title: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                   <label className="label-strict">Operational Node</label>
                   <input required className="input-strict" placeholder="Site / Region / HQ" onChange={e => setJobForm({...jobForm, location: e.target.value})} />
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                 <div className="space-y-2">
                   <label className="label-strict">Budget Floor (₦/Mo)</label>
                   <input type="number" required className="input-strict" placeholder="150,000" onChange={e => setJobForm({...jobForm, minPay: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                   <label className="label-strict">Budget Ceiling (₦/Mo)</label>
                   <input type="number" required className="input-strict" placeholder="350,000" onChange={e => setJobForm({...jobForm, maxPay: e.target.value})} />
                 </div>
              </div>

              <div className="space-y-2 mb-12">
                 <label className="label-strict">Division</label>
                 <select required className="input-strict cursor-pointer" onChange={e => setJobForm({...jobForm, category: e.target.value})}>
                    <option>HSE Consultancy</option><option>Technical</option><option>Recruitment</option><option>Environmental</option>
                 </select>
              </div>

              <div className="space-y-2 mb-14">
                 <label className="label-strict">Role Parameters</label>
                 <textarea required className="input-strict h-36 py-6 resize-none" placeholder="Provide full technical requirements and on-site expectations..." onChange={e => setJobForm({...jobForm, desc: e.target.value})} />
              </div>

              <button type="submit" className="w-full py-6 bg-navy text-white rounded-[30px] font-black text-xs uppercase tracking-[0.5em] shadow-3xl shadow-navy/30 hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-4">
                Establish Protocol <Send size={20}/>
              </button>
           </form>
        </div>
      )}

      <style jsx>{`
        .input-strict { width: 100%; background: #f9f8f6; border: 1.5px solid rgba(11,31,58,0.04); padding: 20px 24px; border-radius: 22px; font-size: 14px; font-weight: 700; color: #0b1f3a; outline: none; transition: 0.4s; }
        .input-strict:focus { border-color: #c8921e; background: white; box-shadow: 0 10px 40px rgba(200,146,30,0.1); }
        .label-strict { text-[10px] font-black uppercase text-navy/20 ml-6 tracking-widest block; }
      `}</style>
    </div>
  );
}
