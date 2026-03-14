"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, ShieldCheck, LayoutDashboard, LogOut, 
  Globe, Loader2, Mail, Phone, Calendar, 
  Briefcase, Trash2, FileText, CheckCircle, XCircle, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, staffCount: 0, hseCount: 0 });
  
  const [employers, setEmployers] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [uRes, aRes, hRes, sRes] = await Promise.all([
        fetch('/api/admin/users'), 
        fetch('/api/applications'),
        fetch('/api/admin/hse'),
        fetch('/api/admin/stats')
      ]);

      const allUsers = await uRes.json();
      setEmployers(allUsers.filter((u: any) => u.userType === 'employer'));
      setPendingApplications(await aRes.json());
      setEnquiries(await hRes.json());
      setStats(await sRes.json());
    } catch (err) {
      toast.error("Database connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAction = async (id: string, type: 'employer' | 'candidate', action: 'approve' | 'reject') => {
    const load = toast.loading("Executing security update...");
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, action })
      });
      if (res.ok) {
        toast.success("Security Ledger Updated", { id: load });
        fetchAllData();
      }
    } catch (err) {
      toast.error("Process interrupted", { id: load });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#060f1e] flex flex-col items-center justify-center font-sans">
      <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.3em]">Syncing Central Registry</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#fcfbf9] text-[#0b1f3a] font-sans">
      
    
      <aside className="w-[260px] bg-[#060f1e] fixed inset-y-0 left-0 border-r border-gold/10 z-50 flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-navy">
          <div className="w-12 h-12 bg-gold rounded flex items-center justify-center font-black text-navy text-2xl italic uppercase shadow-xl">O</div>
          <div>
            <span className="block text-white font-serif font-black text-xl leading-none">OBRUS</span>
            <span className="text-gold-lt text-[9px] uppercase font-bold tracking-[0.2em] opacity-60">Admin Desk</span>
          </div>
        </div>

        <nav className="p-4 space-y-2 mt-8 overflow-y-auto flex-1">
          <TabBtn active={view === 'dashboard'} onClick={() => setView('dashboard')} label="Overview Hub" ico={<LayoutDashboard size={18}/>}/>
          <TabBtn active={view === 'employers'} onClick={() => setView('employers')} label="Business Approvals" ico={<ShieldCheck size={18}/>}/>
          <TabBtn active={view === 'applications'} onClick={() => setView('applications')} label="Candidate Vetting" ico={<Briefcase size={18}/>}/>
          <TabBtn active={view === 'hse'} onClick={() => setView('hse')} label="Inquiry Desk" ico={<FileText size={18}/>}/>
        </nav>

        <div className="p-8 border-t border-white/5 bg-[#040a14]">
          <button onClick={() => window.location.href='/auth'} className="flex items-center gap-4 text-red-400/40 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-all">
             <LogOut size={16}/> Terminate Link
          </button>
        </div>
      </aside>

      <main className="ml-[260px] flex-1 min-h-screen flex flex-col overflow-y-auto">
        
      
        <header className="h-[80px] bg-white border-b flex items-center justify-between px-12 sticky top-0 z-40">
           <h2 className="font-serif text-3xl font-black uppercase italic tracking-tighter decoration-gold underline-offset-8 underline decoration-4">
             {view === 'dashboard' ? 'Executive Insights' : view === 'employers' ? 'Business verification' : view === 'applications' ? 'Staff recruitment vetting' : 'Client Operations'}
           </h2>
           <div className="flex items-center gap-6">
              <div className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-6 py-2.5 rounded-2xl border border-navy/5 shadow-inner leading-none">
                 {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric'})}
              </div>
              <Link href="/" className="w-11 h-11 rounded-2xl border border-navy/5 flex items-center justify-center text-navy/30 hover:text-gold hover:border-gold transition-all">
                <Globe size={20}/>
              </Link>
           </div>
        </header>

        <div className="p-12 pb-32 w-full max-w-[1500px] mx-auto">
          
         
          {view === 'dashboard' && (
             <div className="animate-in fade-in duration-1000 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   <Stat val={stats.totalUsers} label="Total Verified Identities" sub="Across all divisions" />
                   <Stat val={stats.hseCount} label="Field Service inquiries" sub="Safety & Environmental" />
                   <Stat val={employers.length} label="Authorized Corporations" sub="Hiring entities" />
                </div>

                <div className="bg-[#0b1f3a] p-16 rounded-[70px] text-white relative overflow-hidden shadow-3xl group">
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/[0.03] rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
                   <CheckCircle className="absolute bottom-10 right-10 text-gold/5" size={200}/>
                   <h3 className="font-serif text-5xl font-bold mb-10 leading-none underline decoration-gold/30">Registry Report</h3>
                   <p className="text-white/40 text-2xl font-light italic leading-relaxed max-w-3xl mb-12">The industrial portal is running optimally. Automated security backups are currently tracking recruitment status updates and business documentation audits.</p>
                   <div className="flex gap-4">
                      <span className="px-6 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest text-gold-lt italic">Manual Override System Active</span>
                   </div>
                </div>
             </div>
          )}

          
          {view === 'employers' && (
             <div className="bg-white rounded-[60px] shadow-3xl border border-navy/5 overflow-hidden animate-in slide-in-from-bottom-5">
                <table className="w-full text-left">
                   <thead className="bg-[#0b1f3a] text-gold-lt uppercase">
                      <tr>
                         <th className="p-8 text-[11px] font-black tracking-widest">Business Legal Entity</th>
                         <th className="p-8 text-[11px] font-black tracking-widest">Credentials</th>
                         <th className="p-8 text-[11px] font-black tracking-widest">Current Authorization</th>
                         <th className="p-8 text-[11px] font-black tracking-widest text-right">Operational Logic</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#f0ede6]">
                      {employers.map((emp: any) => (
                         <tr key={emp._id} className="hover:bg-gold/[0.02] transition-colors">
                            <td className="p-8">
                               <span className="block font-black text-xl uppercase tracking-tighter text-navy mb-1 italic">{emp.employerProfile?.companyName}</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HQ Address: {emp.employerProfile?.officeAddress}</span>
                            </td>
                            <td className="p-8 font-mono text-sm font-black text-gold">CAC-{emp.employerProfile?.rcNumber}</td>
                            <td className="p-8">
                               <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${emp.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gold/10 text-gold border-gold/20 animate-pulse'}`}>{emp.status}</span>
                            </td>
                            <td className="p-8 text-right">
                               {emp.status === 'pending' && (
                                 <div className="flex gap-2 justify-end">
                                    <button onClick={() => handleVerifyAction(emp._id, 'employer', 'approve')} className="p-4 bg-green-500 text-white rounded-3xl hover:bg-navy transition-all shadow-xl shadow-green-500/20"><CheckCircle size={20}/></button>
                                    <button onClick={() => handleVerifyAction(emp._id, 'employer', 'reject')} className="p-4 bg-red-100 text-red-500 rounded-3xl hover:bg-red-500 hover:text-white transition-all"><XCircle size={20}/></button>
                                 </div>
                               )}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}

        
          {view === 'applications' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {pendingApplications.map((app: any) => (
                   <div key={app._id} className="bg-white p-12 rounded-[65px] border-l-[12px] border-[#c8921e] shadow-3xl group relative overflow-hidden transition-all hover:-translate-y-2">
                      <Briefcase className="absolute top-12 right-12 text-navy/5 group-hover:scale-125 transition-transform" size={150}/>
                      <h3 className="font-serif text-4xl font-bold text-navy italic tracking-tighter mb-1 leading-none">{app.candidateId.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-8 border-l-2 border-gold pl-5">Vetting ID: {app._id.slice(-8).toUpperCase()}</p>
                      
                      <div className="flex flex-col gap-3 mb-10">
                         <div className="flex items-center gap-3 text-xs font-black text-navy uppercase tracking-widest"><Globe size={14} className="text-gold" /> Applied via {app.jobId?.category || "Unknown Loop"}</div>
                         <a href={app.cvUrl} target="_blank" className="flex items-center gap-4 p-5 bg-[#f0ede6] rounded-3xl hover:bg-[#0b1f3a] hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-xl group/btn">
                           Analyze Curriculum Vitae (CV) <FileText size={18} className="group-hover/btn:scale-125 transition-transform"/>
                         </a>
                      </div>

                      {app.status === 'pending' && (
                         <div className="flex gap-4 border-t pt-8 border-navy/5">
                            <button onClick={() => handleVerifyAction(app._id, 'candidate', 'approve')} className="flex-1 py-4 bg-[#c8921e] text-navy rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:shadow-[#c8921e]/40 transform active:scale-95 transition-all">Verify Operator</button>
                            <button onClick={() => handleVerifyAction(app._id, 'candidate', 'reject')} className="px-6 py-4 bg-red-50 text-red-500 rounded-3xl border border-red-100 hover:bg-red-500 hover:text-white transition-all"><XCircle size={18}/></button>
                         </div>
                      )}
                      
                      {app.status === 'vetted' && <div className="text-green-600 font-black text-xs uppercase flex items-center gap-2 mt-4 shadow-sm bg-green-50 w-fit px-4 py-2 rounded-full border border-green-200">System Vetted ✓</div>}
                   </div>
                ))}
             </div>
          )}

        </div>
      </main>

      <style jsx>{`
         .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(11, 31, 58, 0.1); }
      `}</style>
    </div>
  );
}

function TabBtn({ active, onClick, label, ico }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-5 p-5 rounded-[22px] transition-all font-black text-[10px] uppercase tracking-[0.25em] border-l-4 border-t-2 border-r shadow-md group ${active ? 'bg-gold/15 text-gold-lt border-gold shadow-gold/20' : 'text-white/20 border-transparent hover:text-white hover:bg-white/5'}`}>
       <span className={active ? 'text-gold' : 'opacity-20 group-hover:opacity-40 transition-opacity'}>{ico}</span>
       <span>{label}</span>
    </button>
  );
}

function Stat({ val, label, sub }: any) {
   return (
      <div className="bg-white p-12 rounded-[55px] border border-navy/5 shadow-2xl relative overflow-hidden transition-all hover:scale-105 hover:border-gold duration-500">
         <h4 className="text-6xl font-serif font-black italic text-navy leading-none mb-4 underline decoration-gold/20 decoration-8 underline-offset-[2px]">{val}</h4>
         <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{label}</p>
         <span className="text-[9px] font-bold text-slate-300 italic opacity-60 tracking-widest">{sub}</span>
      </div>
   );
}