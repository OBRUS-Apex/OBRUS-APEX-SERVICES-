"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Briefcase, Users, X, Send, Loader2, DollarSign, MapPin, 
  ChevronRight, CheckCircle, ShieldAlert, FileText, Lock, Mail, 
  Phone, Calendar, Globe, Bell, LogOut, CreditCard, Home 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmployerPortal() {
  const router = useRouter();
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
      toast.error("Registry connection timeout");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const load = toast.loading("Logging vacancy data...");
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
        toast.success("Broadcast Node Active", { id: load });
        setIsJobModal(false);
        fetchEmployerJobs(user._id);
      }
    } catch (err) {
      toast.error("Transmission Error", { id: load });
    }
  };

  const viewCandidates = async (jobId: string) => {
    setSelectedJobId(jobId);
    try {
      const res = await fetch(`/api/applications?jobId=${jobId}&status=vetted`);
      const data = await res.json();
      setVettedApplicants(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Vetting Pool unreachable");
    }
  };

  const handleSendOffer = async (appId: string, candidateName: string) => {
    const load = toast.loading(`Dispatching contract to ${candidateName}...`);
    try {
      const res = await fetch('/api/jobs/offer', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId })
      });
      if (res.ok) toast.success("Offer Dispatched", { id: load });
      else throw new Error();
    } catch (err) {
      toast.error("Comms Link Error", { id: load });
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#060f1e] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-white/20 font-black uppercase text-[9px] tracking-[0.5em]">Synchronizing Personnel Center...</p>
    </div>
  );

  const isApproved = user?.status === 'active';

  return (
    <div className="flex min-h-screen bg-[#f5f0e8] text-navy font-sans overflow-hidden">
      
      <aside className="w-[280px] bg-[#060f1e] fixed inset-y-0 left-0 border-r border-gold/10 z-[100] flex flex-col">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
           <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center font-black text-navy text-2xl shadow-xl italic uppercase">O</div>
           <div className="leading-tight">
              <span className="block text-white font-serif font-black text-xl uppercase tracking-tighter leading-none">OBRUS</span>
              <span className="text-gold-lt text-[9px] uppercase font-black tracking-widest opacity-60">Apex Hub</span>
           </div>
        </div>

        <nav className="p-6 flex-1 space-y-2 mt-8">
           <button onClick={() => setSelectedJobId(null)} className="nb-l active"><Home size={18}/> Overview Hub</button>
           <button className="nb-l"><Users size={18}/> Field Operatives</button>
           <button className="nb-l"><CreditCard size={18}/> Bill Ledger</button>
        </nav>

        <div className="p-8 border-t border-white/5 bg-[#040a14]">
           <button onClick={() => { localStorage.clear(); router.push('/auth'); }} className="flex items-center gap-4 text-red-400/40 hover:text-red-400 font-black text-[10px] uppercase tracking-[0.3em] transition-all">
             <LogOut size={16}/> Terminate Link
           </button>
        </div>
      </aside>

      <main className="ml-[280px] flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar bg-[#fcfbf9]">
        <header className="h-[80px] bg-white border-b flex items-center justify-between px-12 sticky top-0 z-[50]">
           <h2 className="font-serif text-3xl font-black uppercase tracking-tighter italic decoration-gold underline-offset-8 underline decoration-4">Operations node</h2>
           <div className="flex gap-8 items-center text-slate-400 font-black uppercase text-[10px] tracking-widest">
              <div className="flex items-center gap-3"><Calendar size={13}/> {new Date().toLocaleDateString('en-GB')}</div>
              <div className="flex gap-4 items-center">
                 <Globe className="cursor-pointer hover:text-gold transition-colors" size={20} onClick={() => window.location.href='/'}/>
                 <Bell className="cursor-pointer hover:text-gold transition-colors" size={20}/>
              </div>
           </div>
        </header>

        <div className="p-12 pb-32 max-w-[1400px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-20 border-b border-navy/5 pb-14">
             <div className="flex-1">
                <h1 className="font-serif text-6xl font-black italic tracking-tighter uppercase mb-2 leading-none text-navy">{user?.employerProfile?.companyName || 'Corporate Division'}</h1>
                <p className="text-[10px] font-black uppercase text-gold tracking-[0.4em] flex items-center gap-4 italic leading-none ml-2">Verification Registry ID: {user?._id?.toUpperCase().substring(0,10)}</p>
             </div>
             <button onClick={() => setIsJobModal(true)} disabled={!isApproved} className="bg-navy text-white px-14 py-6 rounded-[35px] font-black text-xs uppercase tracking-[0.5em] shadow-3xl hover:bg-gold hover:text-navy transition-all active:scale-95 disabled:opacity-10 flex items-center justify-center gap-4 group">
               Issue Dispatch <Plus className="group-hover:rotate-180 transition-transform duration-700" size={22}/>
             </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
               <div className="flex items-center justify-between px-6 mb-6">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/20 leading-none">Industrial Briefs Pool ({jobs.length})</h3>
                 {!isApproved && <span className="bg-red-50 text-red-500 font-black text-[9px] uppercase px-4 py-1.5 rounded-full tracking-widest">Status: Vetting Incomplete</span>}
               </div>

               {jobs.length === 0 ? (
                 <div className="bg-white p-32 rounded-[70px] border-2 border-dashed border-navy/5 flex flex-col items-center justify-center text-slate-300 shadow-sm transition-all hover:border-gold/30">
                    <FileText size={70} className="mb-8 opacity-5" />
                    <p className="font-black text-[11px] uppercase tracking-[0.4em] opacity-30 italic leading-loose text-center">Central vacancy registry empty.<br/>Broadcast your first mission parameters.</p>
                 </div>
               ) : (
                jobs.map((job) => (
                  <div key={job._id} onClick={() => viewCandidates(job._id)} className={`p-14 rounded-[65px] border cursor-pointer transition-all bg-white relative group overflow-hidden ${selectedJobId === job._id ? 'border-gold shadow-3xl' : 'border-navy/5 shadow-sm hover:shadow-xl hover:translate-x-2'}`}>
                     <div className="absolute top-0 right-0 w-48 h-48 bg-gold/[0.04] rounded-bl-[150px] group-hover:scale-125 transition-transform duration-1000"></div>
                     <span className="bg-navy text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.25em] mb-6 inline-block shadow-lg leading-none italic">{job.category}</span>
                     <h4 className="text-4xl font-serif font-black italic tracking-tighter mb-6 text-navy group-hover:underline decoration-gold decoration-4 underline-offset-[10px] transition-all">{job.title}</h4>
                     <div className="flex flex-wrap gap-12 text-[11px] font-black uppercase text-slate-400 tracking-tighter italic">
                        <span className="flex items-center gap-3"><MapPin className="text-gold" size={16}/> {job.location}</span>
                        <span className="flex items-center gap-3 leading-none"><DollarSign className="text-gold" size={16}/> Compensation Hub Protected</span>
                     </div>
                  </div>
                ))
               )}
            </div>

            <div className="lg:col-span-5">
               <div className="bg-white rounded-[70px] p-12 border border-navy/5 shadow-3xl sticky top-28 h-fit min-h-[600px] flex flex-col transition-all">
                  <div className="text-center mb-16 border-b pb-12 border-navy/5 relative">
                     <h3 className="font-serif text-5xl font-black italic tracking-tighter italic underline decoration-gold/10 decoration-8 underline-offset-[-2px]">Vetting Link</h3>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mt-2 italic">Approved Operator Pool</p>
                     <Users size={30} className="absolute right-0 top-2 opacity-5 text-gold" />
                  </div>

                  {!isApproved ? (
                     <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-10 animate-pulse">
                        <Lock className="text-navy opacity-5" size={120}/>
                        <div>
                          <p className="text-[10px] font-black uppercase text-red-500 tracking-[0.4em] mb-3 leading-none italic">identity verification lock</p>
                          <p className="text-slate-400 text-xs font-bold leading-relaxed px-8 opacity-60">Operations restricted pending mandatory RC documentation and HQ structural audit.</p>
                        </div>
                     </div>
                  ) : vettedApplicants.length > 0 ? (
                     <div className="space-y-10">
                        {vettedApplicants.map((app) => (
                           <div key={app._id} className="p-10 bg-[#f9f8f6] rounded-[60px] border border-gold/10 relative overflow-hidden group/card shadow-inner transition-all hover:shadow-2xl">
                              <CheckCircle className="text-green-500 mb-8" size={36}/>
                              <h5 className="font-black text-3xl tracking-tighter uppercase text-navy italic leading-none mb-3">{app.candidateId.name}</h5>
                              <p className="text-[11px] font-black text-slate-400 uppercase mb-10 tracking-[0.2em] border-l-4 border-gold pl-5 leading-none">Security clearance: valid</p>
                              
                              <div className="grid grid-cols-2 gap-4 mb-10">
                                 <a href={app.cvUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center p-4 bg-white rounded-2xl border border-navy/5 hover:bg-[#060f1e] hover:text-gold transition-all text-[9px] font-black uppercase tracking-widest shadow-xl group">Audit resume <FileText size={14} className="ml-3 group-hover:scale-125 transition-transform" /></a>
                                 <div className="flex items-center justify-center p-4 bg-white rounded-2xl border border-navy/5 text-[9px] font-black uppercase tracking-widest opacity-20 italic">Vetting Complete</div>
                              </div>

                              <button onClick={() => handleSendOffer(app._id, app.candidateId.name)} className="w-full py-6 bg-navy text-white rounded-[30px] font-black text-[11px] uppercase tracking-[0.3em] shadow-3xl hover:bg-gold hover:text-navy transition-all transform active:scale-95">transmit offer brief</button>
                           </div>
                        ))}
                     </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-300 py-32 animate-in fade-in duration-1000">
                       <ShieldCheck size={80} className="mx-auto mb-8 opacity-5 italic" />
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] leading-loose opacity-40">Scan successful. Select an active vacancy <br/> briefly to initialize operator matching.</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isJobModal && (
          <div className="fixed inset-0 z-[2000] bg-[#060f1e]/98 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
             <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-5xl rounded-[80px] p-20 md:p-32 shadow-2xl relative my-auto border border-white/10">
                <button type="button" onClick={() => setIsJobModal(false)} className="absolute top-16 right-16 p-4 bg-navy/5 hover:bg-navy hover:text-white rounded-full transition-all duration-500 shadow-xl"><X size={32}/></button>
                <h3 className="font-serif text-7xl font-black italic tracking-tighter uppercase mb-4 text-navy">mission hub</h3>
                <p className="text-gold text-[10px] font-black uppercase tracking-[0.5em] mb-16 border-l-[6px] border-gold pl-10 opacity-70">Log recruitment and specialized personnel mission briefs</p>
                
                <form onSubmit={handleCreateJob} className="space-y-12">
                   <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-4"><label className="lbs">Dispatch title / node name</label><input required className="fts" placeholder="Operational Identifier" onChange={e => setJobForm({...jobForm, title: e.target.value})} /></div>
                      <div className="space-y-4"><label className="lbs">Deployment node (Site)</label><input required className="fts" placeholder="Region / Division HQ" onChange={e => setJobForm({...jobForm, location: e.target.value})} /></div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-4"><label className="lbs">Compensation floor (₦/Cycle)</label><input type="number" required className="fts" placeholder="Min. Budget Entry" onChange={e => setJobForm({...jobForm, minPay: e.target.value})} /></div>
                      <div className="space-y-4"><label className="lbs">Compensation ceiling (₦/Cycle)</label><input type="number" required className="fts" placeholder="Max. Authorized Cap" onChange={e => setJobForm({...jobForm, maxPay: e.target.value})} /></div>
                   </div>

                   <div className="space-y-4">
                      <label className="lbs">Core specialism tier</label>
                      <select required className="fts cursor-pointer font-black italic" onChange={e => setJobForm({...jobForm, category: e.target.value})}>
                         <option>HSE Consultancy</option><option>Engineering node</option><option>Chemical Management</option><option>Operations / Admin</option>
                      </select>
                   </div>

                   <div className="space-y-4">
                      <label className="lbs">Mission scope documentation</label>
                      <textarea required className="fts h-48 py-8 resize-none leading-relaxed italic" placeholder="Establish target deliverables, vetting requirements, and operative parameters..." onChange={e => setJobForm({...jobForm, desc: e.target.value})} />
                   </div>

                   <button type="submit" className="w-full py-8 bg-navy text-white rounded-[45px] font-black text-xs uppercase tracking-[0.6em] shadow-3xl hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-8 group">
                      INITIALIZE BRODCAST LOOP <Send size={24} className="group-hover:translate-x-3 transition-transform"/>
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .fts { width: 100%; background: #fcfbf9; border: 1.5px solid rgba(11,31,58,0.03); padding: 24px 30px; border-radius: 28px; font-size: 15px; font-weight: 700; color: #0b1f3a; outline: none; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .fts:focus { border-color: #c8921e; background: white; box-shadow: 0 20px 50px rgba(200,146,30,0.12); }
        .lbs { font-size: 11px; font-weight: 900; text-transform: uppercase; color: rgba(11,31,58,0.15); margin-left: 2rem; letter-spacing: 0.3em; display: block; }
        .nb-l { width: 100%; text-align: left; padding: 22px 28px; border-radius: 22px; font-size: 14px; font-weight: 800; display: flex; align-items: center; gap: 18px; transition: all 0.4s; color: rgba(255,255,255,0.22); text-transform: uppercase; letter-spacing: 0.2em; }
        .nb-l:hover { color: white; background: rgba(255,255,255,0.04); padding-left: 36px; }
        .nb-l.active { background: rgba(200, 146, 30, 0.12); color: #e8b84b; border-right: 5px solid #c8921e; box-shadow: 15px 0 35px rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(200, 146, 30, 0.25); border-radius: 20px; }
      `}</style>
    </div>
  );
}