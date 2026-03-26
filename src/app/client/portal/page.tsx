"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home, ClipboardList, CreditCard, Bell,
  Plus, X, Printer, LogOut, Upload, ShieldCheck, Download, Calendar, Menu, Globe, ChevronRight, CheckCircle, Wallet
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function MasterClientPortal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [requestForm, setRequestForm] = useState({
    location: '', priority: 'Normal', targetDate: '', details: ''
  });

  useEffect(() => {
    const session = localStorage.getItem('user');
    if (!session) { router.push('/auth'); return; }
    const parsedUser = JSON.parse(session);
    setUser(parsedUser);
    fetchData(parsedUser._id);
  }, [router]);

  const fetchData = async (userId: string) => {
    try {
      const [reqRes, invRes] = await Promise.all([
        fetch(`/api/client/requests?userId=${userId}`),
        fetch(`/api/client/invoices?userId=${userId}`)
      ]);
      const reqData = reqRes.ok ? await reqRes.json() : [];
      const invData = invRes.ok ? await invRes.json() : [];
      setRequests(Array.isArray(reqData) ? reqData : []);
      setInvoices(Array.isArray(invData) ? invData : []);
    } catch {
      toast.error('Portal synchronization failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const load = toast.loading('Logging request...');
    try {
      const res = await fetch('/api/client/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...requestForm, userId: user._id, serviceType: selectedService })
      });
      if (res.ok) {
        toast.success('Service request transmitted successfully', { id: load });
        setSelectedService(null);
        fetchData(user._id);
        setActiveTab('activity');
      } else {
        toast.error('Failed to submit mission parameters', { id: load });
      }
    } catch {
      toast.error('Connection failure.', { id: load });
    }
  };

  const handleReceiptUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) return toast.error('Selection required.');
    const load = toast.loading('Uploading documentation...');

    try {
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, receiptFile);

      if (uploadError) throw new Error('Cloud transmission error.');

      const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(fileName);

      const res = await fetch('/api/client/invoices/reconcile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: selectedInvoice._id, receiptUrl: publicUrl })
      });

      if (res.ok) {
        toast.success('Payment evidence logged successfully', { id: load });
        setSelectedInvoice(null);
        setReceiptFile(null);
        fetchData(user._id);
      }
    } catch (err: any) {
      toast.error(err.message || 'System error.', { id: load });
    }
  };

  const handleLogout = () => { localStorage.clear(); router.push('/auth'); };

  const totalUnpaid = Array.isArray(invoices)
    ? invoices.filter(i => i.status === 'unpaid' || i.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0)
    : 0;

  const tabTitles: Record<string, string> = {
    overview: 'Hub Console', engage: 'Industrial Services', billing: 'Finance Registry', activity: 'Audit History',
  };

  if (loading) return (
    <div className="min-h-screen bg-[#112031] flex flex-col items-center justify-center font-sans text-white">
      <div className="w-10 h-10 border-2 border-[#257242] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="font-black uppercase text-[9px] tracking-[0.4em] opacity-40 italic leading-none">Connecting User Terminal...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f9fafb] text-[#1a2e46] font-sans overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-[90] md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside style={{ transform: sidebarOpen ? 'translateX(0)' : undefined }} className="w-[280px] bg-[#112031] fixed inset-y-0 left-0 border-r border-white/5 z-[100] flex flex-col shadow-2xl -translate-x-full md:translate-x-0 transition-transform duration-500">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 group">
            <div className="bg-white rounded-2xl p-1.5 w-12 h-12 flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 duration-500">
               <img src="/logo.png" alt="O" className="h-full w-full object-contain" />
            </div>
            <div className="text-white">
               <h1 className="font-serif font-black text-xl italic tracking-tighter uppercase leading-none">Obrus</h1>
               <p className="text-[#257242] text-[8px] font-black uppercase tracking-[0.3em] mt-1 leading-none italic">Services Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-6 flex-1 space-y-1.5 mt-8 overflow-y-auto custom-scrollbar">
           <SidebarLink label="Operation Center" ico={<Home size={17}/>} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}/>
           <SidebarLink label="Request Action" ico={<Plus size={17}/>} active={activeTab === 'engage'} onClick={() => setActiveTab('engage')}/>
           <SidebarLink label="Billing Deck" ico={<CreditCard size={17}/>} active={activeTab === 'billing'} onClick={() => setActiveTab('billing')}/>
           <SidebarLink label="Registry Logs" ico={<ClipboardList size={17}/>} active={activeTab === 'activity'} onClick={() => setActiveTab('activity')}/>
        </nav>

        <div className="p-8 border-t border-white/5 bg-[#0a1521]">
          <button onClick={handleLogout} className="flex items-center gap-4 text-red-400/40 hover:text-red-500 font-black text-[10px] uppercase tracking-[0.3em] transition-all">
             <LogOut size={16}/> Revoke Credentials
          </button>
        </div>
      </aside>

      <main className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-y-auto custom-scrollbar no-print">
        <header className="h-[80px] bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-[50]">
          <div className="flex items-center gap-5">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-3 rounded-2xl bg-gray-50 text-navy transition-all"><Menu size={20}/></button>
            <h2 className="font-serif text-3xl font-black uppercase tracking-tighter italic decoration-[#257242] underline underline-offset-[8px] decoration-4">{tabTitles[activeTab]} Node</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 bg-[#fcfbf9] px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 border leading-none italic"><Calendar size={12}/> {new Date().toDateString()}</div>
             <Link href="/" className="w-12 h-12 bg-[#1a2e46] rounded-[18px] flex items-center justify-center text-[#c8921e] shadow-xl hover:rotate-12 transition-transform duration-500"><Globe size={18}/></Link>
          </div>
        </header>

        <div className="p-5 md:p-12 pb-32 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-5 duration-700">
          {activeTab === 'overview' && (
             <div className="space-y-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                   <StatItem val={requests.length} label="Division Enquiries" theme="green" up={true}/>
                   <StatItem val={`₦${totalUnpaid.toLocaleString()}`} label="Balance Hub" theme="gold" up={false}/>
                   <StatItem val="AUTHORIZED" label="User Protocol" theme="green" up={true}/>
                   <StatItem val="0%" label="Failure rate" theme="gold" up={true}/>
                </div>
                
                <div className="bg-[#112031] p-16 rounded-[60px] text-white relative overflow-hidden shadow-3xl">
                   <div className="absolute top-0 right-0 w-80 h-80 bg-[#257242]/[0.06] rounded-bl-[200px] animate-pulse"></div>
                   <ShieldCheck className="absolute bottom-12 right-12 text-[#257242]/[0.06] -rotate-12" size={180}/>
                   <h3 className="font-serif text-5xl font-black mb-6 tracking-tight">Access Granted</h3>
                   <p className="text-white/40 text-xl font-light italic leading-relaxed max-w-xl border-l border-[#257242] pl-8">Corporate mission profile activated. Your credentials allow for direct engagement with Recruitment, Maintenance, and Safety division dispatchers.</p>
                   <button onClick={() => setActiveTab('engage')} className="mt-14 bg-[#257242] text-white px-14 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-3xl shadow-green-900/40 transition-all hover:bg-green-700 transform hover:-translate-y-1">Establish New Mission</button>
                </div>
             </div>
          )}

          {activeTab === 'engage' && (
            <div className="grid md:grid-cols-3 gap-8">
               {[
                  { t: 'Recruitment & Hire', d: 'Workforce strategy and staff nodes.', i: '👥', c: 'text-emerald-500', bg: 'bg-emerald-50/40' },
                  { t: 'Safety (HSE)', d: 'Industrial standard compliance audit.', i: '🛡️', c: 'text-[#1a2e46]', bg: 'bg-[#1a2e46]/5' },
                  { t: 'Facility Ops', d: 'Comprehensive maintenance mission.', i: '🏗️', c: 'text-green-700', bg: 'bg-green-50' },
                  { t: 'Pest Control', d: 'Fumigation and specialized chemical.', i: '🧪', c: 'text-amber-600', bg: 'bg-amber-50' },
                  { t: 'Logistics / Waste', d: 'Refuse evacuation & environmental ops.', i: '♻️', c: 'text-[#257242]', bg: 'bg-[#257242]/5' },
                  { t: 'Consultancy', d: 'Bespoke strategic operational hub.', i: '💡', c: 'text-[#c8921e]', bg: 'bg-gold-50/50' }
               ].map((s) => (
                  <div key={s.t} onClick={() => setSelectedService(s.t)} className="bg-white p-12 rounded-[55px] border border-gray-100 shadow-xl transition-all hover:-translate-y-3 cursor-pointer group hover:border-[#257242]">
                     <div className="text-5xl mb-8 transition-transform duration-700 group-hover:scale-110">{s.i}</div>
                     <h4 className="font-serif text-2xl font-black text-navy uppercase italic mb-3 tracking-tighter decoration-[#257242]/20 group-hover:underline underline-offset-4 decoration-4">{s.t}</h4>
                     <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.25em]">{s.d}</p>
                     <div className={`mt-8 h-1 w-0 group-hover:w-full transition-all duration-1000 ${s.bg} rounded-full`}></div>
                  </div>
               ))}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white rounded-[60px] shadow-3xl border border-gray-100 overflow-hidden">
               <div className="p-12 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-serif text-4xl font-bold text-[#1a2e46] italic uppercase">Financial Ledger</h3>
                  <Wallet size={40} className="text-[#257242]/30"/>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-[#1a2e46] text-white">
                      <tr>
                        <th className="p-9 text-[11px] font-black uppercase tracking-[0.3em] italic">Mission Identifer</th>
                        <th className="p-9 text-[11px] font-black uppercase tracking-[0.3em] italic">Description</th>
                        <th className="p-9 text-[11px] font-black uppercase tracking-[0.3em] italic text-right">Sum (NGN)</th>
                        <th className="p-9 text-[11px] font-black uppercase tracking-[0.3em] italic text-center">Authorization Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {invoices.length === 0 ? (
                        <tr><td colSpan={4} className="p-24 text-center font-black text-slate-300 text-xs uppercase tracking-[0.4em] italic opacity-50">Archive Registry is empty</td></tr>
                      ) : (
                        invoices.map((inv) => (
                           <tr key={inv._id} className="hover:bg-green-50 transition-colors">
                              <td className="p-9 font-mono font-black text-[#1a2e46] opacity-60">AUDIT-{inv._id.substring(0,8).toUpperCase()}</td>
                              <td className="p-9 font-serif font-black text-2xl text-navy italic">{inv.serviceType}</td>
                              <td className="p-9 text-right font-black text-xl tracking-tighter">₦{inv.amount.toLocaleString()}</td>
                              <td className="p-9 text-center">
                                {inv.status === 'unpaid' || inv.status === 'pending' ? (
                                  <button onClick={() => setSelectedInvoice(inv)} className="bg-[#257242] text-white px-8 py-3 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] shadow-lg transition-all active:scale-90 hover:shadow-[#257242]/20 hover:-translate-y-1">Audit node & pay</button>
                                ) : (
                                  <div className="inline-flex items-center gap-3 bg-green-50 text-[#257242] px-6 py-2 rounded-full border border-green-200">
                                    <span className="text-[10px] font-black uppercase tracking-widest">{inv.status}</span><CheckCircle size={12}/>
                                  </div>
                                )}
                              </td>
                           </tr>
                        ))
                      )}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'activity' && (
             <div className="bg-white rounded-[60px] border border-gray-100 shadow-3xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#1a2e46] text-[#c8921e]">
                    <tr>
                      <th className="p-9 text-[10px] font-black uppercase tracking-[0.4em] italic">Identity Key</th>
                      <th className="p-9 text-[10px] font-black uppercase tracking-[0.4em] italic">Mission Title</th>
                      <th className="p-9 text-[10px] font-black uppercase tracking-[0.4em] italic">Registry Date</th>
                      <th className="p-9 text-[10px] font-black uppercase tracking-[0.4em] italic text-right">Flow Phase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {requests.map((r) => (
                      <tr key={r._id} className="hover:bg-green-50 transition-colors">
                        <td className="p-9 text-slate-300 font-mono font-bold">X72-{r._id.slice(-6).toUpperCase()}</td>
                        <td className="p-9 font-serif font-black text-3xl italic text-[#1a2e46] leading-none decoration-[#257242]/20 underline decoration-4 underline-offset-4">{r.serviceType}</td>
                        <td className="p-9 text-xs font-black uppercase text-slate-400 tracking-[0.25em]">{new Date(r.createdAt).toDateString()}</td>
                        <td className="p-9 text-right"><span className={`px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest ${r.status==='completed'?'bg-green-50 text-[#257242]':'bg-amber-50 text-gold shadow-inner animate-pulse'}`}>{r.status} NODE</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-[#060f1e]/98 backdrop-blur-xl no-print">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-4xl rounded-[80px] p-24 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-[#257242]/10 custom-scrollbar">
              <button onClick={() => setSelectedService(null)} className="absolute top-16 right-16 p-5 bg-gray-50 rounded-full hover:bg-navy hover:text-white transition-all shadow-xl"><X size={32}/></button>
              <h3 className="font-serif text-7xl font-bold tracking-tighter uppercase italic text-[#1a2e46]">Mission Hub</h3>
              <p className="text-[10px] font-black text-[#257242] uppercase tracking-[0.6em] border-l-[10px] border-[#257242] pl-8 mb-20">{selectedService} Channel Request</p>
              
              <form onSubmit={handleRequestSubmit} className="space-y-12">
                <div className="grid md:grid-cols-2 gap-10">
                   <div className="space-y-4"><label className="lb-st">Registry address</label><input required className="input-hub" placeholder="Operations HQ Location" onChange={e => setRequestForm({...requestForm, location: e.target.value})}/></div>
                   <div className="space-y-4"><label className="lb-st">Vetting tier</label>
                      <select className="input-hub cursor-pointer font-black" onChange={e => setRequestForm({...requestForm, priority: e.target.value})}><option>Standard Node</option><option>Executive Node</option><option>Crisis Ops</option></select>
                   </div>
                </div>
                <div className="space-y-4"><label className="lb-st">Authorized Mission timeline</label><input type="date" required className="input-hub" onChange={e => setRequestForm({...requestForm, targetDate: e.target.value})}/></div>
                <div className="space-y-4"><label className="lb-st">Brief details and tactical description</label><textarea className="input-hub h-48 py-8 resize-none leading-relaxed italic" required placeholder="Outline tactical deliverables, headcount, or technical compliance required for this deployment brief..." onChange={e => setRequestForm({...requestForm, details: e.target.value})}/></div>
                <button type="submit" className="w-full py-8 bg-[#1a2e46] text-white rounded-[45px] font-black text-xs uppercase tracking-[0.8em] shadow-3xl hover:bg-[#257242] active:scale-95 transition-all">Submit for Industrial Clearance</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-0 md:p-6 bg-navy-deep/98 backdrop-blur-2xl no-print overflow-y-auto">
             <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white w-full max-w-6xl rounded-none md:rounded-[100px] flex flex-col md:flex-row shadow-2xl relative overflow-hidden h-full max-h-screen border border-gray-100">
                <div id="invoice-printable" className="flex-1 p-10 md:p-28 overflow-y-auto bg-white">
                   <div className="flex justify-between items-start mb-24">
                      <div className="flex items-center gap-6">
                        <img src="/logo.png" className="h-16 w-auto" alt="Logo" />
                        <div className="h-14 w-0.5 bg-navy/[0.08] mx-2"></div>
                        <h4 className="font-serif font-black text-4xl text-[#1a2e46] tracking-tighter leading-none italic underline decoration-green-600 decoration-8 underline-offset-[-2px]">Official HUB Doc</h4>
                      </div>
                      <div className="text-right"><p className="text-[10px] font-black uppercase text-slate-300 tracking-widest italic leading-none mb-4">Certified Transaction node</p><span className="text-3xl font-mono font-black text-navy">{selectedInvoice.invoiceNumber || 'NODE-REG-ID'}</span></div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-24 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-20 leading-loose pt-12 border-t">
                      <div><span className="text-[#257242] block mb-3 text-sm italic decoration-[#257242] decoration-4 underline">AUTHORIZED ISSUER</span>OBRUS APEX SERVICES LTD<br/>Port Harcourt Sector HQ<br/>Niger-Delta Command Operations</div>
                      <div><span className="text-[#257242] block mb-3 text-sm italic decoration-[#257242] decoration-4 underline">CLIENT RECIPIENT NODE</span>{user?.name}<br/>Registry Mail: {user?.email}</div>
                   </div>
                   <div className="border-y-8 border-navy py-20 flex flex-col md:flex-row justify-between items-end gap-10">
                      <div><p className="text-emerald-700 font-black text-[10px] uppercase tracking-[0.3em] mb-4 italic">Description Tier</p><h5 className="font-serif text-5xl font-black italic text-[#1a2e46] leading-none tracking-tight">{selectedInvoice.serviceType}</h5></div>
                      <h5 className="text-7xl font-black text-navy tracking-tighter italic leading-none">₦{selectedInvoice.amount?.toLocaleString()}</h5>
                   </div>
                   <div className="mt-20 p-12 bg-[#f9fafb] rounded-[55px] text-center text-xs font-black uppercase tracking-[0.15em] text-[#1a2e46]/30 leading-loose border-2 border-dashed">Transaction Hub: Zenith Command Hub · ID 102XXXXXXXXX<br/>Upload evidence in terminal link below for registry update.</div>
                </div>

                <div className="w-full md:w-[440px] bg-[#1a2e46] p-12 md:p-24 flex flex-col justify-center border-l border-white/5 relative shadow-inner no-print">
                   <button onClick={() => setSelectedInvoice(null)} className="absolute top-12 right-12 p-5 bg-white shadow-xl rounded-[20px] text-navy hover:bg-[#257242] hover:text-white transition-all transform hover:-rotate-180 duration-700"><X size={30}/></button>
                   <div className="relative mb-14"><ShieldCheck className="text-[#257242]/30 mb-8" size={60}/><h3 className="font-serif text-4xl text-white font-bold leading-tight uppercase italic decoration-[#257242] underline decoration-4 underline-offset-8">Verify Transaction</h3></div>
                   <form onSubmit={handleReceiptUpload} className="space-y-8">
                      <div className="relative group cursor-pointer h-[260px]">
                        <input type="file" required className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={e => setReceiptFile(e.target.files?.[0] || null)} />
                        <div className="h-full w-full bg-white/[0.04] border-4 border-dashed rounded-[45px] border-white/5 flex flex-col items-center justify-center text-center p-8 group-hover:border-[#257242] group-hover:bg-white/[0.06] transition-all duration-700 relative shadow-2xl">
                           <Upload size={38} className="text-[#c8921e] opacity-20 mb-6 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700" />
                           <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] leading-relaxed group-hover:text-white transition-colors">{receiptFile ? receiptFile.name : 'Vett identity by receipt upload'}</p>
                        </div>
                      </div>
                      <button type="submit" className="w-full py-6 bg-[#257242] text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-3xl hover:bg-green-700 transition-all hover:scale-105 active:scale-95 shadow-green-500/30">Commit Payment Link</button>
                   </form>
                   <div className="mt-14 space-y-4">
                      <button onClick={() => window.print()} className="w-full py-5 border border-white/10 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white hover:bg-white/5 transition-all leading-none italic"><Printer size={15}/> Print Hardcopy Node</button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .input-hub { width: 100%; background: #fdfdfd; border: 1.5px solid #efefef; border-radius: 22px; padding: 22px 28px; color: #112031; font-size: 15px; font-weight: 700; outline: none; transition: 0.3s; }
        .input-hub:focus { border-color: #257242; box-shadow: 0 12px 30px rgba(0,0,0,0.05); }
        .lb-st { font-size: 10px; font-weight: 900; text-transform: uppercase; color: rgba(37, 114, 66, 0.2); margin-left: 20px; letter-spacing: 0.3em; display: block; margin-bottom: 6px; italic; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(37, 114, 66, 0.2); border-radius: 10px; }
        @media print { .no-print { display: none !important; } #invoice-printable { position: fixed; inset: 0; background: white; z-index: 10000; padding: 40px !important; } h2, h3, h4, h5, p, span { color: black !important; } }
      `}</style>
    </div>
  );
}

function SidebarLink({ label, ico, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-5 p-5 rounded-[22px] transition-all font-black text-[10px] uppercase tracking-[0.3em] border-r-4 italic ${active ? 'bg-[#257242]/10 text-emerald-400 border-[#257242] shadow-xl translate-x-2' : 'text-white/20 border-transparent hover:text-white hover:bg-white/5'}`}>
       <span className={active ? 'text-emerald-400' : 'opacity-10'}>{ico}</span>
       <span>{label}</span>
    </button>
  );
}

function StatItem({ val, label, theme, up }: any) {
  const styles: any = { green: "border-[#257242]/20 text-[#1a2e46]", gold: "border-[#c8921e]/20 text-[#112031]" };
  return (
    <div className={`p-8 bg-white rounded-[45px] border shadow-2xl transition-all duration-700 hover:-translate-y-3 group hover:border-[#257242] ${styles[theme]}`}>
       <div className="flex justify-between items-start mb-2 italic">
          <h4 className="text-4xl font-serif font-black underline decoration-[#257242]/20">{val}</h4>
          <span className={`text-[9px] font-black ${up?'text-[#257242] animate-pulse':'text-gold'} px-3 py-1 rounded-full uppercase leading-none shadow-inner`}>{up ? 'HIGH-ACTIVE' : 'AUDIT-MODE'}</span>
       </div>
       <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300 ml-1 leading-none">{label}</p>
    </div>
  );
}