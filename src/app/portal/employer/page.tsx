"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Briefcase, Users, X, Send, Loader2, DollarSign, MapPin, ChevronRight, CheckCircle, ShieldAlert, FileText, Lock, Mail, Phone, Calendar, Globe, Bell, LogOut, Home} from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployerPortal() {
  const router = useRouter();
  const [isJobModal, setIsJobModal] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState<any>(null);
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
    const session = localStorage.getItem("user");
    if (!session) {
      router.push('/auth');
      return;
    }
    const parsedUser = JSON.parse(session);
    setUser(parsedUser);
    fetchEmployerJobs(parsedUser._id);
  }, [router]);

  const fetchEmployerJobs = async (id: string) => {
    try {
      const res = await fetch(`/api/jobs?employerId=${id}`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Cloud synchronization failure");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const load = toast.loading("Broadcasting recruitment brief...");
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
        toast.success("Job Live on Seeker Network", { id: load });
        setIsJobModal(false);
        fetchEmployerJobs(user._id);
      }
    } catch (err) {
      toast.error("Transmission logic error", { id: load });
    }
  };

  const viewCandidates = async (job: any) => {
    setSelectedJobId(job._id);
    setSelectedJobDetails(job);
    const res = await fetch(`/api/applications?jobId=${job._id}&status=vetted`);
    const data = await res.json();
    setVettedApplicants(Array.isArray(data) ? data : []);
  };

  const handleSendOffer = async (appId: string, candidateName: string) => {
    const load = toast.loading(`Dispatching contract offer to ${candidateName}...`);
    try {
      const res = await fetch('/api/jobs/offer', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId })
      });
      if (res.ok) toast.success("Offer Letter Transmitted", { id: load });
      else throw new Error();
    } catch (err) {
      toast.error("Mail Dispatch Failure", { id: load });
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#060f1e] flex flex-col items-center justify-center font-sans">
      <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-white/30 font-black uppercase text-[9px] tracking-[0.4em]">Establishing Employer node...</p>
    </div>
  );

  const isApproved = user?.status === 'active';

  return (
    <div className="flex min-h-screen bg-[#f5f0e8] text-navy font-sans overflow-hidden">
      
      <aside className="w-[280px] bg-[#060f1e] fixed inset-y-0 left-0 border-r border-gold/10 z-[100] flex flex-col no-print">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
           <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center font-black text-navy text-2xl shadow-xl uppercase italic">O</div>
           <div className="leading-tight">
              <span className="block text-white font-serif font-black text-xl uppercase tracking-tighter">OBRUS</span>
              <span className="text-gold-lt text-[10px] uppercase font-black tracking-widest opacity-60">Employer Node</span>
           </div>
        </div>

        <nav className="p-6 flex-1 space-y-1.5 mt-8">
           <button onClick={() => setSelectedJobId(null)} className="nav-l"><Home size={18}/> Central Dashboard</button>
           <button className="nav-l"><Users size={18}/> Management Team</button>
           <button className="nav-l"><CreditCard size={18}/> Payment Registry</button>
        </nav>

        <div className="p-8 border-t border-white/5 bg-[#040a14]">
           <button onClick={() => { localStorage.clear(); router.push('/auth'); }} className="flex items-center gap-4 text-red-400/40 hover:text-red-400 font-black text-[10px] transition-all uppercase tracking-[0.3em]">
             <LogOut size={16}/> Revoke Authorization
           </button>
        </div>
      </aside>

      <main className="ml-[280px] flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar bg-[#fcfbf9]">
        <header className="h-[80px] bg-white border-b flex items-center justify-between px-12 sticky top-0 z-[50]">
           <h2 className="font-serif text-3xl font-black uppercase tracking-tighter italic decoration-gold underline-offset-[10px] underline decoration-4">Operational hub</h2>
           <div className="flex gap-6 items-center">
              <div className="bg-[#fcfbf9] px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 border border-navy/5 shadow-inner flex items-center gap-3">
                 <Calendar size={13}/> {new Date().toLocaleDateString('en-GB')}
              </div>
              <Globe className="cursor-pointer hover:text-gold transition-colors text-navy/20" onClick={() => window.location.href='/'}/>
           </div>
        </header>

        <div className="p-12 pb-32 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b pb-12 border-navy/5">
             <div className="flex-1">
                <h1 className="font-serif text-6xl font-black italic tracking-tighter uppercase mb-2 leading-none text-navy underline decoration-gold/20">{user?.employerProfile?.companyName || 'Corporate Entity'}</h1>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] flex items-center gap-2 italic">Official Workforce Channel ID: {user?._id?.substring(0,8).toUpperCase()}</p>
             </div>
             <button onClick={() => setIsJobModal(true)} disabled={!isApproved} className="bg-navy text-white px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-3xl hover:bg-gold hover:text-navy transition-all transform hover:-translate-y-1 disabled:opacity-20 flex items-center gap-4">
               <Plus size={20}/> Issue Staffing Brief
             </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-6">
               <p className="text-[10px] font-black uppercase tracking-widest text-navy/20 ml-2 mb-4">Registry Inquiries ({jobs.length})</p>
               {jobs.length === 0 ? (
                 <div className="bg-white p-24 rounded-[60px] border border-dashed flex flex-col items-center justify-center text-slate-300">
                    <Briefcase size={60} className="mb-6 opacity-5" />
                    <p className="font-black text-[11px] uppercase tracking-[0.3em] opacity-30 italic">Registry database empty</p>
                 </div>
               ) : (
                jobs.map((job) => (
                  <div key={job._id} onClick={() => viewCandidates(job)} className={`p-12 rounded-[55px] border cursor-pointer transition-all bg-white relative group hover:shadow-2xl overflow-hidden ${selectedJobId === job._id ? 'border-gold shadow-3xl' : 'border-navy/5 shadow-sm'}`}>
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.03] rounded-bl-full group-hover:scale-125 transition-transform duration-700"></div>
                     <span className="bg-[#f0ede6] text-navy px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">{job.category}</span>
                     <h4 className="text-4xl font-serif font-black italic tracking-tighter mb-4 text-navy group-hover:text-gold transition-colors">{job.title}</h4>
                     <div className="flex flex-wrap gap-8 text-[11px] font-black uppercase text-slate-400 tracking-tighter">
                        <span className="flex items-center gap-2"><MapPin className="text-gold" size={14}/> {job.location}</span>
                        <span className="flex items-center gap-2"><DollarSign className="text-gold" size={14}/> Personnel Budget Pool</span>
                     </div>
                  </div>
                ))
               )}
            </div>

            <div className="lg:col-span-5">
               <div className="bg-white rounded-[60px] p-12 border border-navy/5 shadow-3xl sticky top-28 h-fit min-h-[600px] overflow-hidden">
                  <div className="relative z-10">
                     <div className="flex justify-between items-start border-b pb-8 border-navy/5 mb-10">
                        <div><h3 className="font-serif text-3xl font-black italic">Vetted Identities</h3><p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mt-1">Manual Approval Pipeline</p></div>
                        {!isApproved && <Lock size={22} className="text-red-500 animate-pulse" />}
                     </div>

                     {!isApproved ? (
                        <div className="py-20 text-center flex flex-col items-center">
                           <ShieldAlert className="text-navy opacity-5 mb-8" size={100}/>
                           <p className="text-[11px] font-black uppercase text-red-500 tracking-[0.3em] bg-red-50 px-5 py-3 rounded-full mb-4 leading-none">Security vetting Required</p>
                           <p className="text-slate-400 text-xs font-bold leading-relaxed px-10">Identity restricted until corporate documentation audit is complete by OBRUS Executive team.</p>
                        </div>
                     ) : vettedApplicants.length > 0 ? (
                       <div className="space-y-6">
                         {vettedApplicants.map((app: any) => (
                           <div key={app._id} className="p-8 bg-[#fcfbf9] rounded-[45px] border border-gold/10 relative overflow-hidden group/card shadow-sm hover:shadow-xl transition-all">
                              <CheckCircle className="text-green-500 mb-6" size={28}/>
                              <h5 className="font-black text-2xl tracking-tighter uppercase text-navy italic">{app.candidateId.name}</h5>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-8">Node Rating: Operational Level 1</p>
                              
                              <div className="grid grid-cols-2 gap-3 mb-10">
                                 <a href={app.cvUrl} target="_blank" className="flex items-center justify-center p-3 bg-white rounded-2xl border border-navy/5 hover:border-gold transition-all text-[10px] font-black uppercase tracking-widest">Read CV</a>
                                 <div className="flex items-center justify-center p-3 bg-white rounded-2xl border border-navy/5 text-[10px] font-black uppercase tracking-widest opacity-20 italic">Credentials Verified</div>
                              </div>

                              <button onClick={() => handleSendOffer(app._id, app.candidateId.name)} className="w-full py-5 bg-navy text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-gold hover:text-navy transition-all">Transmit Dispatch Offer</button>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="py-32 text-center text-slate-300">
                          <Users size={60} className="mx-auto mb-6 opacity-5 animate-bounce-slow" />
                          <p className="text-[11px] font-black uppercase tracking-[0.25em] leading-relaxed">Establish an Operational Brief to<br/>activate automated Candidate Match</p>
                       </div>
                     )}
                  </div>
                  <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-gold/[0.02] rounded-full pointer-events-none"></div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isJobModal && (
          <div className="fixed inset-0 z-[2000] bg-[#060f1e]/98 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
             <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white w-full max-w-4xl rounded-[70px] p-16 md:p-24 shadow-2xl relative my-auto border border-gold/10">
                <button type="button" onClick={() => setIsJobModal(false)} className="absolute top-16 right-16 p-4 bg-navy/5 hover:bg-gold rounded-full transition-all text-navy"><X size={28}/></button>
                <h3 className="font-serif text-6xl font-black italic tracking-tighter uppercase mb-3 text-navy">new briefing</h3>
                <p className="text-gold text-[10px] font-black uppercase tracking-[0.5em] mb-16 border-l-4 border-gold pl-8">Recruitment Pipeline Initiative</p>
                
                <form onSubmit={handleCreateJob} className="space-y-10">
                   <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-3"><label className="lb">Primary Position</label><input required className="fi" placeholder="Technical/Officer Role" onChange={e => setJobForm({...jobForm, title: e.target.value})} /></div>
                      <div className="space-y-3"><label className="lb">Operational Site</label><input required className="fi" placeholder="Sector / Office Location" onChange={e => setJobForm({...jobForm, location: e.target.value})} /></div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-3"><label className="lb">Budget Minimum (Monthly)</label><input type="number" required className="fi" placeholder="₦ 150,000" onChange={e => setJobForm({...jobForm, minPay: e.target.value})} /></div>
                      <div className="space-y-3"><label className="lb">Budget Ceiling (Monthly)</label><input type="number" required className="fi" placeholder="₦ 350,000" onChange={e => setJobForm({...jobForm, maxPay: e.target.value})} /></div>
                   </div>

                   <div className="space-y-3">
                      <label className="lb">Specialized Division</label>
                      <select required className="fi cursor-pointer font-bold" onChange={e => setJobForm({...jobForm, category: e.target.value})}>
                         <option>HSE Consultancy</option><option>Technical Supply</option><option>Waste Operations</option><option>Recruitment</option>
                      </select>
                   </div>

                   <div className="space-y-3">
                      <label className="lb">Requirements & Responsibilities Matrix</label>
                      <textarea required className="fi h-44 py-8 resize-none leading-relaxed" placeholder="Delineate full scope of deployment, including required certifications and key KPI targets..." onChange={e => setJobForm({...jobForm, desc: e.target.value})} />
                   </div>

                   <button type="submit" className="w-full py-6 bg-navy text-white rounded-[35px] font-black text-xs uppercase tracking-[0.5em] shadow-3xl hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-6">
                      Engage OBRUS Workforce Pipeline <Send size={20}/>
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .fi { width: 100%; background: #fcfbf9; border: 1.5px solid rgba(11,31,58,0.03); padding: 22px 28px; border-radius: 25px; font-size: 15px; font-weight: 700; color: #0b1f3a; outline: none; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .fi:focus { border-color: #c8921e; background: white; box-shadow: 0 15px 40px rgba(200,146,30,0.1); }
        .lb { font-size: 10px; font-weight: 900; text-transform: uppercase; color: rgba(11,31,58,0.2); margin-left: 1.8rem; letter-spacing: 0.25em; display: block; }
        .nav-l { width: 100%; text-align: left; padding: 18px 24px; border-radius: 22px; font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 16px; transition: all 0.3s; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 0.15em; }
        .nav-l:hover { background: rgba(255,255,255,0.04); color: white; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(200, 146, 30, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}