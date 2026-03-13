"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, MapPin, Briefcase, Filter, 
  Settings, Loader2, ArrowRight, X,
  Clock, CheckCircle, Bell, ChevronRight, User as UserIcon, Mail, Phone
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function SeekerPortal() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const session = localStorage.getItem("user");
    if (!session) {
      router.push('/auth');
      return;
    }
    const parsedUser = JSON.parse(session);
    setUser(parsedUser);
    
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        toast.error("Database connection failed");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = (id: string, title: string) => {
    toast.success(`Submission locked: ${title}`);
  };

  if (loading) return (
    <div className="h-screen bg-[#060f1e] flex flex-col items-center justify-center font-sans">
      <Loader2 className="animate-spin text-gold mb-4" size={42} />
      <p className="text-white/40 font-black uppercase text-[9px] tracking-[0.4em]">Establishing Seeker Link...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f0e8] pt-32 pb-24 px-[5%] font-sans text-navy">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-navy/5 pb-10">
        <div>
           <div className="flex items-center gap-3 mb-2 text-gold font-black uppercase text-[10px] tracking-[0.3em]">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div> Node Operational
           </div>
           <h1 className="font-serif text-5xl font-black italic tracking-tighter">Verified Node: {user?.name.split(' ')[0]}</h1>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setIsModal(true)} className="p-4 bg-white border border-navy/5 rounded-2xl hover:border-gold transition-all shadow-sm">
             <Settings size={20}/>
           </button>
           <button className="bg-navy text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gold hover:text-navy transition-all shadow-2xl">
             Explore Operations
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-5 rounded-[30px] shadow-sm border border-navy/5 flex items-center gap-5 px-8">
             <Search size={22} className="text-slate-300"/>
             <input onChange={e => setFilter(e.target.value)} className="flex-1 bg-transparent outline-none font-bold text-sm" placeholder="Filter Vacancies (Title, Category...)" />
             <div className="w-10 h-10 bg-[#f0ede6] rounded-xl flex items-center justify-center"><Filter size={18}/></div>
          </div>

          <div className="space-y-6">
             {jobs.filter((j:any) => j.title.toLowerCase().includes(filter.toLowerCase())).map((job: any) => (
                <motion.div key={job._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.01 }} className="bg-white p-10 rounded-[45px] border border-navy/5 shadow-lg group relative overflow-hidden transition-all hover:border-gold">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-[100px] pointer-events-none"></div>
                   <div className="flex flex-col md:flex-row justify-between md:items-center gap-8 relative z-10">
                      <div>
                        <span className="bg-navy text-white text-[9px] font-black uppercase px-3 py-1 rounded-full mb-3 inline-block tracking-widest">{job.category}</span>
                        <h3 className="font-serif text-3xl font-bold mb-4 tracking-tighter italic">{job.title}</h3>
                        <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                           <span className="flex items-center gap-2"><MapPin size={16} className="text-gold"/> Nationwide Dispatch</span>
                           <span className="flex items-center gap-2"><Briefcase size={16} className="text-gold"/> Industrial Placement</span>
                        </div>
                      </div>
                      <button onClick={() => handleApply(job._id, job.title)} className="bg-navy text-white px-10 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest shadow-xl hover:bg-gold transition-all group-hover:-translate-x-2">Secure Application</button>
                   </div>
                </motion.div>
             ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-navy p-10 rounded-[50px] text-white relative overflow-hidden shadow-3xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-bl-full pointer-events-none"></div>
              <h4 className="font-serif text-2xl font-bold mb-8 italic">Pipeline Analytics</h4>
              <div className="space-y-6 mb-12">
                 <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                       <CheckCircle className="text-green-400" size={22}/>
                       <span className="text-[11px] font-black uppercase tracking-widest">Active Application</span>
                    </div>
                    <ChevronRight size={18} className="text-white/20"/>
                 </div>
              </div>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] text-center italic border-t border-white/10 pt-8">Synchronization Level: Critical</p>
           </div>

           <div className="bg-white p-12 rounded-[50px] border shadow-sm flex flex-col items-center text-center group transition-all hover:border-gold">
              <div className="w-20 h-20 bg-[#f0ede6] rounded-3xl flex items-center justify-center text-navy mb-6 group-hover:bg-gold group-hover:text-white transition-all"><Bell size={32}/></div>
              <h4 className="font-serif text-xl font-bold mb-2">Automated Notifications</h4>
              <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">Stay calibrated with real-time feedback on your vetting status.</p>
              <div className="px-6 py-2 bg-navy/5 text-navy text-[10px] font-black uppercase rounded-full">Dispatcher Active</div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-[#060f1e]/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-xl rounded-[60px] p-16 shadow-2xl relative">
              <button onClick={() => setIsModal(false)} className="absolute top-10 right-10 text-slate-300 hover:text-navy"><X size={28}/></button>
              <h3 className="font-serif text-4xl font-bold mb-2 tracking-tight italic">Registry Profile</h3>
              <p className="text-slate-400 text-sm mb-10 font-medium">Verify your corporate identity for industrial placement.</p>
              <form className="space-y-5">
                 <div className="relative">
                    <input className="modal-input" placeholder="Update Full Legal Identity" defaultValue={user?.name}/>
                    <UserIcon size={18} className="modal-ico"/>
                 </div>
                 <div className="relative">
                    <input className="modal-input" placeholder="Primary Dispatch (Email)" defaultValue={user?.email}/>
                    <Mail size={18} className="modal-ico"/>
                 </div>
                 <div className="relative">
                    <input className="modal-input" placeholder="Mobile Node" defaultValue={user?.phone}/>
                    <Phone size={18} className="modal-ico"/>
                 </div>
                 <button className="w-full bg-navy text-white py-5 rounded-[25px] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-gold transition-all mt-6">Confirm Modifications</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .modal-input { width: 100%; background: #fcfbf9; border: 1.5px solid rgba(11,31,58,0.06); padding: 18px 24px 18px 55px; border-radius: 20px; font-size: 14px; font-weight: 700; outline: none; transition: all 0.3s; }
        .modal-input:focus { border-color: #c8921e; background: white; }
        .modal-ico { position: absolute; left: 22px; top: 20px; color: #c8921e; opacity: 0.3; }
      `}</style>
    </div>
  );
}