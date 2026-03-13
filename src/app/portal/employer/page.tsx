"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, Building, Briefcase, Users, 
  CheckCircle, Loader2, Send, X, Mail, Phone, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState([]);
  const [vettedApplicants, setVettedApplicants] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  
  const [jobData, setJobData] = useState({ title: '', category: 'HSE', description: '', quantity: 1 });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(u);
    fetchEmployerData(u._id);
  }, []);

  const fetchEmployerData = async (id: string) => {
    try {
      const res = await fetch(`/api/jobs?employerId=${id}`);
      const data = await res.json();
      setJobs(data);
    } finally { setLoading(false); }
  };

  const postJob = async (e: any) => {
    e.preventDefault();
    const load = toast.loading("Publishing job...");
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({...jobData, employerId: user._id})
    });
    if (res.ok) {
      toast.success("Job posted. Monitoring for candidates.", { id: load });
      setIsPosting(false);
      fetchEmployerData(user._id);
    }
  };

  const hireCandidate = async (appId: string, name: string) => {
    const load = toast.loading(`Sending offer to ${name}...`);
    const res = await fetch('/api/jobs/offer', {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ applicationId: appId })
    });
    if(res.ok) toast.success("Offer sent and Email dispatched", { id: load });
  };

  if (loading) return <div className="h-screen bg-navy flex items-center justify-center"><Loader2 className="animate-spin text-gold" size={40}/></div>;

  return (
    <div className="min-h-screen bg-[#f5f0e8] pt-24 px-[5%] font-sans text-navy pb-20">
      
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-12 border-b border-navy/5 pb-8">
        <div>
           <h1 className="font-serif text-4xl font-bold italic underline decoration-gold/20 uppercase tracking-tighter">
             {user?.employerProfile?.companyName}
           </h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Active Procurement & Staffing Hub</p>
        </div>
        <button onClick={() => setIsPosting(true)} className="flex items-center gap-2 bg-gold text-navy px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">
          <Plus size={16}/> New Recruitment Brief
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
        
        
        <div className="lg:col-span-2 space-y-4">
           <h3 className="font-serif text-xl font-bold mb-6">Current Vacancies ({jobs.length})</h3>
           {jobs.map((job: any) => (
             <div key={job._id} onClick={() => setSelectedJob(job)} className="bg-white p-8 rounded-[35px] border border-navy/5 shadow-sm hover:shadow-xl cursor-pointer transition-all group relative">
                <Briefcase size={40} className="absolute right-8 top-8 opacity-5 text-navy"/>
                <span className="text-[9px] font-black bg-navy/5 px-3 py-1 rounded-full uppercase mb-2 inline-block tracking-widest">{job.category}</span>
                <h4 className="text-xl font-bold mb-4">{job.title}</h4>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                   <span>Quantity: {job.quantity} Staff</span>
                   <span className="text-gold group-hover:underline flex items-center gap-1">View Candidates <ArrowRight size={12}/></span>
                </div>
             </div>
           ))}
        </div>

        
        <div className="bg-white rounded-[45px] p-8 border border-navy/5 shadow-2xl sticky top-28 h-fit min-h-[400px]">
           {selectedJob ? (
              <div className="animate-in fade-in duration-500">
                 <h3 className="font-serif text-2xl font-bold mb-2 tracking-tight">{selectedJob.title}</h3>
                 <p className="text-xs font-medium text-slate-400 mb-8 border-b pb-4">Approved Professional Match Pool</p>
                 
                 <div className="space-y-4">
                   
                    <div className="p-5 bg-off rounded-[25px] border border-gold/10">
                       <span className="text-[10px] font-black bg-green-500 text-white px-2 py-0.5 rounded-full mb-2 inline-block">OBRUS VETTED</span>
                       <h5 className="font-bold text-sm mb-1">Musa Yusuf</h5>
                       <p className="text-[10px] text-slate-500 mb-4 tracking-tighter">7 Years HSE Experience · NEBOSH Cert.</p>
                       <button onClick={() => hireCandidate('app_id', 'Musa Yusuf')} className="w-full py-2 bg-navy text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-colors">Dispatch Job Offer</button>
                    </div>
                 </div>
              </div>
           ) : (
             <div className="flex flex-col items-center justify-center text-center pt-20 text-slate-300">
                <Users size={50} className="mb-4 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-widest">Select a vacancy brief to <br/> view matched identities</p>
             </div>
           )}
        </div>
      </div>

      
      {isPosting && (
        <div className="fixed inset-0 z-[2000] bg-navy-deep/90 backdrop-blur-md flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-lg rounded-[45px] p-12 shadow-2xl relative animate-in zoom-in-95 duration-300">
              <button onClick={() => setIsPosting(false)} className="absolute top-8 right-8"><X size={20}/></button>
              <h3 className="font-serif text-3xl font-bold mb-2">New Brief</h3>
              <p className="text-slate-400 text-sm mb-8 italic">Personnel specifications will be routed to OBRUS vetting team.</p>
              
              <form onSubmit={postJob} className="space-y-4">
                 <input className="input-f" placeholder="Target Role" required onChange={e => setJobData({...jobData, title: e.target.value})} />
                 <select className="input-f font-bold text-[11px] uppercase tracking-widest" onChange={e => setJobData({...jobData, category: e.target.value})}>
                    <option>HSE Consultancy</option><option>Recruitment</option><option>Environmental</option>
                 </select>
                 <textarea className="input-f h-32 py-4" placeholder="Brief Responsibilities & Qualifications" required onChange={e => setJobData({...jobData, description: e.target.value})} />
                 <button type="submit" className="w-full py-4 bg-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-navy/20 hover:bg-gold hover:text-navy transition-all">Establish Recruitment Loop</button>
              </form>
           </div>
        </div>
      )}

      <style jsx>{`
        .input-f { width: 100%; background: #fcfbf9; border: 1.5px solid rgba(11,31,58,0.06); padding: 16px; border-radius: 20px; font-size: 14px; font-weight: 500; outline: none; }
        .input-f:focus { border-color: #c8921e; }
      `}</style>
    </div>
  );
}