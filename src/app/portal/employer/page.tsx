"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Users, X, Send, Loader2, DollarSign, MapPin, ChevronRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployerPortal() {
  const [isJobModal, setIsJobModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [vettedApplicants, setVettedApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [jobForm, setJobForm] = useState({ title: '', category: 'HSE Consultancy', location: '', minPay: '', maxPay: '', desc: '', reqs: '' });

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("user") || "{}");
    if (!session.token && session.role !== 'client') window.location.href = '/auth';
    setUser(session);
    fetchEmployerJobs(session._id);
  }, []);

  const fetchEmployerJobs = async (id: string) => {
    const res = await fetch(`/api/jobs?employerId=${id}`);
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const load = toast.loading("Syncing vacancy with OBRUS network...");
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...jobForm, employerId: user._id, salaryRange: { min: jobForm.minPay, max: jobForm.maxPay } })
    });
    if (res.ok) {
      toast.success("Vacancy Live", { id: load });
      setIsJobModal(false);
      fetchEmployerJobs(user._id);
    }
  };

  const viewCandidates = async (jobId: string) => {
    setSelectedJobId(jobId);
    const res = await fetch(`/api/applications?jobId=${jobId}&status=vetted`);
    const data = await res.json();
    setVettedApplicants(data);
  };

  if (loading) return <div className="h-screen bg-[#060f1e] flex items-center justify-center"><Loader2 className="animate-spin text-gold" /></div>;

  return (
    <div className="min-h-screen bg-[#fcfbf9] pt-28 pb-20 px-[5%] text-navy">
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-12">
        <div>
           <h1 className="font-serif text-5xl font-black italic tracking-tighter">Command: {user?.employerProfile?.companyName}</h1>
           <p className="text-[10px] font-black uppercase text-gold tracking-[0.4em] mt-2">Active Procurement Hub</p>
        </div>
        <button onClick={() => setIsJobModal(true)} className="bg-navy text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-gold transition-all flex items-center gap-3">
          <Plus size={18}/> Initiate Recruitment
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
           <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Your Active Briefs</h3>
           {jobs.map((job: any) => (
             <div key={job._id} onClick={() => viewCandidates(job._id)} className={`p-10 rounded-[45px] border cursor-pointer transition-all bg-white group hover:shadow-2xl ${selectedJobId === job._id ? 'border-gold shadow-xl' : 'border-navy/5 shadow-sm'}`}>
                <div className="flex justify-between items-start">
                   <div>
                      <span className="text-[9px] font-black bg-navy/5 px-3 py-1 rounded-full uppercase mb-4 inline-block">{job.category}</span>
                      <h4 className="text-3xl font-serif font-bold tracking-tight mb-2 italic">{job.title}</h4>
                      <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <span className="flex items-center gap-2"><MapPin size={14}/> {job.location}</span>
                         <span className="flex items-center gap-2"><DollarSign size={14}/> ₦{job.salaryRange.min.toLocaleString()} - ₦{job.salaryRange.max.toLocaleString()}</span>
                      </div>
                   </div>
                   <div className="w-12 h-12 bg-[#f0ede6] rounded-2xl flex items-center justify-center text-navy group-hover:bg-gold transition-all"><ChevronRight/></div>
                </div>
             </div>
           ))}
        </div>

        <div className="lg:col-span-4 bg-white rounded-[50px] p-10 border border-navy/5 shadow-3xl sticky top-28 h-fit min-h-[500px]">
           <h3 className="font-serif text-2xl font-bold mb-8">Vetted Match Pool</h3>
           {vettedApplicants.length > 0 ? (
              <div className="space-y-4">
                 {vettedApplicants.map((app: any) => (
                    <div key={app._id} className="p-6 bg-[#fcfbf9] rounded-[30px] border border-gold/20 shadow-sm">
                       <CheckCircle className="text-green-500 mb-3" size={24}/>
                       <h5 className="font-bold text-lg mb-1">{app.candidateId.name}</h5>
                       <p className="text-[11px] text-slate-400 uppercase font-black mb-4 tracking-tighter">Approved by OBRUS Technical Team</p>
                       <a href={app.cvUrl} target="_blank" className="text-[10px] font-bold text-gold uppercase underline block mb-4">Analyze Resume (CV)</a>
                       <button className="w-full py-3 bg-navy text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all">Dispatch Final Offer</button>
                    </div>
                 ))}
              </div>
           ) : (
              <div className="py-20 text-center text-slate-300">
                 <Briefcase size={50} className="mx-auto mb-4 opacity-5"/>
                 <p className="text-[10px] font-black uppercase tracking-widest leading-loose">No OBRUS-Vetted <br/> Personnel found for this brief</p>
              </div>
           )}
        </div>
      </div>

      
      {isJobModal && (
        <div className="fixed inset-0 z-[2000] bg-[#060f1e]/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
           <form onSubmit={handleCreateJob} className="bg-white w-full max-w-2xl rounded-[60px] p-16 shadow-2xl relative my-auto animate-in zoom-in-95">
              <button type="button" onClick={() => setIsJobModal(false)} className="absolute top-10 right-10 p-2 hover:bg-slate-50 rounded-full"><X/></button>
              <h3 className="font-serif text-4xl font-bold mb-2 italic">New Recruitment Brief</h3>
              <p className="text-slate-400 text-sm mb-10">Personnel requirements will be broadcast to our verified specialist pool.</p>
              <div className="grid md:grid-cols-2 gap-5 mb-5">
                 <div className="space-y-1"><label className="label-strict">Job Title</label><input required className="input-strict" placeholder="e.g Senior HSE Auditor" onChange={e => setJobForm({...jobForm, title: e.target.value})} /></div>
                 <div className="space-y-1"><label className="label-strict">Location</label><input required className="input-strict" placeholder="State / Site" onChange={e => setJobForm({...jobForm, location: e.target.value})} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-5 mb-5">
                 <div className="space-y-1"><label className="label-strict">Min Salary (Monthly)</label><input type="number" required className="input-strict" placeholder="₦ 150,000" onChange={e => setJobForm({...jobForm, minPay: e.target.value})} /></div>
                 <div className="space-y-1"><label className="label-strict">Max Salary (Monthly)</label><input type="number" required className="input-strict" placeholder="₦ 350,000" onChange={e => setJobForm({...jobForm, maxPay: e.target.value})} /></div>
              </div>
              <div className="space-y-1 mb-10">
                 <label className="label-strict">Responsibilities & Tech Spec</label>
                 <textarea required className="input-strict h-32 py-4" placeholder="Break down the job requirements and professional responsibilities..." onChange={e => setJobForm({...jobForm, desc: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-5 bg-navy text-white rounded-[25px] font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-gold transition-all">Transmit Dispatch →</button>
           </form>
        </div>
      )}
      <style jsx>{`
        .input-strict { width: 100%; background: #fcfbf9; border: 1.5px solid rgba(11,31,58,0.06); padding: 18px; border-radius: 20px; font-size: 14px; font-weight: 700; outline: none; transition: 0.3s; }
        .input-strict:focus { border-color: #c8921e; }
        .label-strict { text-[10px] font-black uppercase text-navy/20 ml-4 tracking-widest; }
      `}</style>
    </div>
  );
}