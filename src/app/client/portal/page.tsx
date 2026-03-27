"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home, ClipboardList, CreditCard, Bell,
  Plus, X, Printer, LogOut, Upload, ShieldCheck, Download, Calendar, Menu, Globe, ChevronRight, CheckCircle, Wallet, Loader2, DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
    if (!session) {
      router.push('/auth');
      return;
    }
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
      toast.error('Synchronization failure.');
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
        toast.success('Service request submitted successfully', { id: load });
        setSelectedService(null);
        fetchData(user._id);
        setActiveTab('activity');
      } else {
        toast.error('Submission failed', { id: load });
      }
    } catch {
      toast.error('Connection failure.', { id: load });
    }
  };

  const handleReceiptUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) return toast.error('Please select a file.');
    const load = toast.loading('Uploading payment evidence...');

    try {
      const res = await fetch('/api/client/invoices/reconcile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: selectedInvoice._id,
          receiptUrl: "https://placeholder-url.com/receipt.jpg"
        })
      });

      if (res.ok) {
        toast.success('Payment evidence logged successfully', { id: load });
        setSelectedInvoice(null);
        setReceiptFile(null);
        fetchData(user._id);
      }
    } catch {
      toast.error('System error.', { id: load });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth');
  };

  const totalUnpaid = Array.isArray(invoices)
    ? invoices.filter(i => i.status === 'unpaid' || i.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0)
    : 0;

  if (loading) return (
    <div className="min-h-screen bg-[#112031] flex flex-col items-center justify-center font-sans">
      <div className="w-10 h-10 border-2 border-[#257242] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-white/30 font-semibold uppercase text-xs tracking-widest italic">Authenticating Access...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#fcfbf9] text-[#1a2e46] font-sans overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-[90] md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside style={{ transform: sidebarOpen ? 'translateX(0)' : undefined }} className="w-[280px] bg-[#112031] fixed inset-y-0 left-0 border-r border-white/5 z-[100] flex flex-col no-print transition-transform duration-500 -translate-x-full md:translate-x-0 shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-white rounded-2xl p-1.5 w-11 h-11 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 duration-500">
               <img src="/logo.png" alt="O" className="h-full w-full object-contain" />
            </div>
            <div className="text-white">
               <h1 className="font-serif font-black text-xl italic tracking-tighter uppercase leading-none">Obrus</h1>
               <p className="text-[#257242] text-[8px] font-black uppercase tracking-[0.3em] mt-1 leading-none italic">Client Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-6 flex-1 space-y-1.5 mt-8 overflow-y-auto custom-scrollbar">
           <SidebarLink label="Dashboard" ico={<Home size={17}/>} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}/>
           <SidebarLink label="Request Service" ico={<Plus size={17}/>} active={activeTab === 'engage'} onClick={() => setActiveTab('engage')}/>
           <SidebarLink label="Invoices & Billing" ico={<CreditCard size={17}/>} active={activeTab === 'billing'} onClick={() => setActiveTab('billing')}/>
           <SidebarLink label="Service History" ico={<ClipboardList size={17}/>} active={activeTab === 'activity'} onClick={() => setActiveTab('activity')}/>
        </nav>

        <div className="p-8 border-t border-white/5 bg-[#0a1521]">
          <button onClick={handleLogout} className="flex items-center gap-4 text-red-400/40 hover:text-red-400 font-bold text-[10px] uppercase tracking-widest transition-all">
             <LogOut size={16}/> Sign Out
          </button>
        </div>
      </aside>

      <main className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-y-auto custom-scrollbar no-print">
        <header className="h-[80px] bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-[50]">
          <div className="flex items-center gap-5">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-3 rounded-2xl bg-gray-50 text-[#112031] transition-all"><Menu size={22}/></button>
            <h2 className="font-serif text-3xl font-black uppercase tracking-tighter italic text-[#1a2e46] underline decoration-[#257242]/20 underline-offset-[10px] decoration-4 leading-none capitalize">{activeTab}</h2>
          </div>
           <div className="flex gap-4 md:gap-6 items-center">
              <div className="hidden lg:flex items-center gap-2 bg-[#fcfbf9] px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 border border-gray-100 italic leading-none">
                 <Calendar size={12} className="text-[#257242]"/> {new Date().toDateString()}
              </div>
              <Link href="/" className="w-12 h-12 bg-[#1a2e46] rounded-2xl flex items-center justify-center text-[#c8921e] shadow-2xl transition-all hover:rotate-12 active:scale-95">
                <Globe size={20}/>
              </Link>
           </div>
        </header>

        <div className="p-6 md:p-12 pb-32 max-w-[1400px] mx-auto w-full animate-in fade-in duration-1000">
          {activeTab === 'overview' && (
             <div className="space-y-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                   <MiniCard label="Active Requests" val={requests?.length || 0} theme="green" up={true}/>
                   <MiniCard label="Pending Balance" val={`₦${totalUnpaid.toLocaleString()}`} theme="navy" up={false}/>
                   <MiniCard label="Account Status" val="VERIFIED" theme="green" up={true}/>
                   <MiniCard label="Safety Tier" val="GOLD" theme="gold" up={true}/>
                </div>

                <div className="bg-[#112031] p-12 md:p-20 rounded-[60px] text-white relative overflow-hidden shadow-2xl border border-white/5 group">
                   <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#257242]/[0.08] rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-[2000ms]"></div>
                   <CheckCircle className="absolute bottom-12 right-12 text-[#257242]/10" size={180}/>
                   <div className="relative z-10">
                      <h3 className="font-serif text-5xl font-black mb-8 italic tracking-tighter decoration-[#257242] underline-offset-8 underline decoration-8 leading-none">Welcome back, {user?.name?.split(' ')[0]}</h3>
                      <p className="text-white/40 text-2xl font-light italic leading-relaxed max-w-xl border-l-4 border-[#257242] pl-8">Your account is fully authorized. You can now request manpower, facility maintenance, and safety consultancy services directly from this dashboard.</p>
                      <button onClick={() => setActiveTab('engage')} className="mt-14 bg-[#257242] text-white px-14 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:bg-green-700 active:scale-95 transition-all transform hover:-translate-y-1">New Service Request</button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'engage' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                  { t: 'Manpower Supply', i: '👥', d: 'Hire skilled technical staff.', c: 'text-[#257242]' },
                  { t: 'HSE Consultancy', i: '🛡️', d: 'Safety audits and training.', c: 'text-red-700' },
                  { t: 'Facility Maintenance', i: '🏗️', d: 'Building and site upkeep.', c: 'text-sky-700' },
                  { t: 'Fumigation', i: '🧪', d: 'Pest and rodent control.', c: 'text-[#c8921e]' },
                  { t: 'Waste Management', i: '♻️', d: 'Refuse evacuation services.', c: 'text-[#1a2e46]' },
                  { t: 'Procurement', i: '📦', d: 'Safety gear and equipment.', c: 'text-[#1a2e46]' }
               ].map((s) => (
                  <div key={s.t} onClick={() => setSelectedService(s.t)} className="bg-white p-12 rounded-[55px] border border-gray-100 shadow-xl transition-all hover:border-[#257242] hover:shadow-2xl hover:-translate-y-4 group cursor-pointer relative overflow-hidden">
                     <div className="text-5xl mb-8 group-hover:scale-125 transition-transform duration-700">{s.i}</div>
                     <h4 className="font-serif text-3xl font-black uppercase italic tracking-tighter text-[#1a2e46] group-hover:underline decoration-[#257242]/20 mb-3">{s.t}</h4>
                     <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">{s.d}</p>
                     <div className="absolute top-0 right-0 w-2 h-0 group-hover:h-full bg-[#257242] transition-all duration-1000"></div>
                  </div>
               ))}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white rounded-[60px] shadow-2xl border border-gray-100 overflow-hidden">
               <div className="p-12 border-b bg-gray-50 flex items-center justify-between">
                  <h3 className="font-serif text-4xl font-bold uppercase italic text-[#1a2e46]">Billing Ledger</h3>
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border shadow-xl"><Wallet className="text-[#257242]"/></div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-[#1a2e46] text-white font-black">
                      <tr>
                        <th className="p-10 text-[10px] tracking-widest italic uppercase">Invoice ID</th>
                        <th className="p-10 text-[10px] tracking-widest italic uppercase">Service Description</th>
                        <th className="p-10 text-[10px] tracking-widest italic uppercase text-right">Amount</th>
                        <th className="p-10 text-[10px] tracking-widest italic uppercase text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 italic">
                      {invoices.length === 0 ? (
                        <tr><td colSpan={4} className="p-32 text-center text-gray-300 font-bold tracking-[0.4em] uppercase text-xs">No invoices found.</td></tr>
                      ) : (
                        invoices.map((inv) => (
                           <tr key={inv._id} className="hover:bg-green-50/50 transition-colors">
                              <td className="p-10 font-mono font-black text-[#1a2e46] opacity-60">#{inv._id.substring(0,8).toUpperCase()}</td>
                              <td className="p-10 font-serif font-black text-2xl text-navy italic">{inv.serviceType || inv.service || "INDUSTRIAL SERVICE"}</td>
                              <td className="p-10 text-right font-black text-2xl tracking-tighter">₦{inv.amount.toLocaleString()}</td>
                              <td className="p-10 text-center">
                                {inv.status === 'pending' || inv.status === 'unpaid' ? (
                                  <button onClick={() => setSelectedInvoice(inv)} className="bg-[#112031] text-white px-8 py-3.5 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] shadow-xl hover:bg-[#257242] transition-all">Pay Now</button>
                                ) : (
                                  <span className="inline-flex items-center gap-2 bg-green-100 text-[#257242] px-6 py-2 rounded-full border border-green-200 font-black text-[10px] shadow-sm uppercase italic">Paid ✓</span>
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
             <div className="bg-white rounded-[70px] border border-gray-100 shadow-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#112031] text-[#257242] uppercase italic">
                    <tr>
                      <th className="p-11 text-[11px] font-black tracking-widest">Request Ref</th>
                      <th className="p-11 text-[11px] font-black tracking-widest">Service Type</th>
                      <th className="p-11 text-[11px] font-black tracking-widest text-center">Date</th>
                      <th className="p-11 text-[11px] font-black tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 italic">
                    {requests.length === 0 ? (
                       <tr><td colSpan={4} className="p-40 text-center text-gray-200 uppercase font-black text-[10px] tracking-widest">No history found.</td></tr>
                    ) : (
                      requests.map((r) => (
                        <tr key={r._id} className="hover:bg-green-50 transition-colors">
                          <td className="p-11 font-mono font-black opacity-30 text-[#1a2e46]">{r._id.slice(-8).toUpperCase()}</td>
                          <td className="p-11 font-serif font-black text-4xl italic text-[#1a2e46] underline decoration-[#257242]/10 decoration-8 underline-offset-[-2px]">{r.serviceType}</td>
                          <td className="p-11 text-center font-bold text-[10px] text-gray-400 uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</td>
                          <td className="p-11 text-right">
                             <div className={`px-5 py-2.5 rounded-full inline-block font-black text-[9px] uppercase tracking-[0.25em] shadow-lg shadow-navy/5 ${r.status === 'completed' ? 'bg-[#257242] text-white' : 'bg-gold-50 text-[#c8921e] animate-pulse'}`}>{r.status}</div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
             </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-navy-deep/98 backdrop-blur-xl no-print overflow-y-auto">
            <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }} className="bg-white w-full max-w-4xl rounded-[80px] p-20 shadow-2xl relative my-auto border border-[#257242]/10 overflow-y-auto max-h-[92vh] custom-scrollbar">
              <button onClick={() => setSelectedService(null)} className="absolute top-16 right-16 p-5 bg-navy/5 hover:bg-[#257242] hover:text-white rounded-full transition-all duration-700 shadow-lg text-[#1a2e46]"><X size={32}/></button>
              <h3 className="font-serif text-7xl font-bold tracking-tighter uppercase italic text-[#1a2e46]">Service Request</h3>
              <p className="text-[10px] font-black text-[#257242] uppercase tracking-[0.6em] border-l-[10px] border-[#257242] pl-8 mb-20">{selectedService}</p>
              
              <form onSubmit={handleRequestSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                     <label className="ls">Location Address</label>
                     <input required className="ih" placeholder="Site or Office Address" onChange={e => setRequestForm({...requestForm, location: e.target.value})}/>
                   </div>
                   <div className="space-y-4">
                     <label className="ls">Preferred Date</label>
                     <input type="date" required className="ih" onChange={e => setRequestForm({...requestForm, targetDate: e.target.value})}/>
                   </div>
                </div>
                <div className="space-y-4">
                   <label className="ls">Detailed Requirements</label>
                   <textarea className="ih h-44 py-8 resize-none italic leading-relaxed font-semibold text-lg" required placeholder="Tell us exactly what you need..." onChange={e => setRequestForm({...requestForm, details: e.target.value})}/>
                </div>
                <button type="submit" className="w-full py-8 bg-[#1a2e46] text-white rounded-[45px] font-black text-xs uppercase tracking-[0.6em] shadow-3xl hover:bg-[#257242] transition-all transform hover:scale-105">Submit Request</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedInvoice && (
           <div className="fixed inset-0 z-[2000] flex items-center justify-center p-0 md:p-12 bg-navy-deep/99 backdrop-blur-2xl no-print overflow-y-auto">
             <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="bg-white w-full max-w-6xl rounded-none md:rounded-[100px] flex flex-col md:flex-row shadow-2xl relative h-full max-h-screen border border-gray-100 overflow-hidden">
                <div id="invoice-printable" className="flex-1 p-10 md:p-32 overflow-y-auto bg-white custom-scrollbar">
                   <div className="flex justify-between items-start mb-24 border-b pb-20">
                      <div className="flex items-center gap-10">
                        <img src="/logo.png" className="h-20 w-auto" alt="Logo" />
                        <h4 className="font-serif font-black text-6xl text-[#1a2e46] tracking-tighter italic decoration-[#257242] decoration-[14px] underline-offset-[-2px] underline">Official Invoice</h4>
                      </div>
                      <div className="text-right flex flex-col items-end gap-3 uppercase font-black"><p className="text-[10px] text-gray-200 tracking-widest italic leading-none">Reference Token</p><span className="text-3xl font-mono text-navy">#{selectedInvoice._id?.slice(-8).toUpperCase()}</span></div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-32 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-20 leading-loose">
                      <div className="space-y-2"><span className="text-[#257242] block mb-4 font-black italic decoration-[#257242] decoration-4 underline">ISSUER</span>Obrus Apex Services Ltd<br/>Port Harcourt Headquarters<br/>Rivers State, Nigeria</div>
                      <div className="space-y-2"><span className="text-[#257242] block mb-4 font-black italic decoration-[#257242] decoration-4 underline">CLIENT</span>{user?.name}<br/>Email: {user?.email}</div>
                   </div>
                   <div className="bg-[#1a2e46] rounded-[60px] p-20 flex flex-col md:flex-row justify-between items-end gap-16 text-white mb-20 relative overflow-hidden">
                      <ShieldCheck size={200} className="absolute right-[-40px] bottom-[-40px] opacity-[0.03]"/>
                      <div><p className="text-[#c8921e] font-black text-[11px] uppercase tracking-widest mb-6 border-l-4 pl-5">SERVICE ITEM</p><h5 className="font-serif text-6xl font-black italic leading-none">{selectedInvoice.serviceType || selectedInvoice.service || 'Industrial Service'}</h5></div>
                      <div className="text-right shrink-0 leading-none"><p className="text-[11px] font-black uppercase opacity-20 mb-3 italic">Total Amount</p><h5 className="text-7xl font-black tracking-tighter text-[#c8921e] italic">₦{selectedInvoice.amount?.toLocaleString()}</h5></div>
                   </div>
                   <div className="p-16 border-4 border-dashed rounded-[65px] border-[#257242]/20 text-center font-black uppercase text-[13px] tracking-[0.1em] text-slate-200 leading-relaxed italic">Payment: Zenith Bank · Account ID 102XXXXXXXXX<br/>Please upload your receipt in the side panel to confirm payment.</div>
                </div>

                <div className="w-full md:w-[460px] bg-[#112031] p-12 md:p-24 flex flex-col justify-center border-l border-[#257242]/10 relative no-print shadow-2xl">
                   <button onClick={() => setSelectedInvoice(null)} className="absolute top-12 right-12 p-5 bg-white shadow-xl rounded-[20px] text-navy hover:scale-110 active:rotate-180 transition-all"><X size={32}/></button>
                   <div className="mb-20 text-center md:text-left">
                     <ShieldCheck className="text-[#257242] opacity-20 mb-10 hidden md:block" size={80}/>
                     <h3 className="font-serif text-6xl font-bold text-white leading-none tracking-tighter italic decoration-[#257242] underline decoration-[10px] underline-offset-4 mb-4">Confirm Payment</h3>
                     <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed italic">Upload bank transfer receipt.</p>
                   </div>
                   <form onSubmit={handleReceiptUpload} className="space-y-8">
                      <div className="relative group cursor-pointer h-[260px]">
                        <input type="file" required className="absolute inset-0 opacity-0 cursor-pointer z-30" onChange={e => setReceiptFile(e.target.files?.[0] || null)} />
                        <div className="h-full w-full bg-white/[0.02] border-4 border-dashed rounded-[50px] border-white/5 flex flex-col items-center justify-center text-center p-12 group-hover:bg-[#257242]/10 group-hover:border-[#257242]/50 transition-all duration-700 relative shadow-2xl">
                           <Upload size={44} className="text-[#c8921e] opacity-20 mb-8 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000" />
                           <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] leading-loose group-hover:text-[#257242] transition-colors">{receiptFile ? receiptFile.name : 'Click to upload receipt'}</p>
                        </div>
                      </div>
                      <button type="submit" className="w-full py-8 bg-[#257242] text-white rounded-[35px] font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-[1.03] active:scale-95 transition-all">Submit Evidence</button>
                   </form>
                   <div className="mt-14 pt-10 border-t border-white/5 flex justify-center"><button onClick={handlePrint} className="flex items-center gap-6 text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic hover:text-[#c8921e] transition-colors"><Printer size={20}/> Print Invoice</button></div>
                </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .ih { width: 100%; background: #fdfdfd; border: 1.5px solid #efefef; border-radius: 25px; padding: 22px 28px; color: #112031; font-size: 16px; font-weight: 800; outline: none; transition: 0.5s; font-style: italic; }
        .ih:focus { border-color: #257242; box-shadow: 0 15px 40px rgba(37, 114, 66, 0.04); background: white; }
        .ls { font-size: 10px; font-weight: 900; text-transform: uppercase; color: rgba(37, 114, 66, 0.3); margin-left: 20px; letter-spacing: 0.3em; display: block; margin-bottom: 8px; italic; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(37, 114, 66, 0.3); border-radius: 50px; }
        @media print { .no-print { display: none !important; } #invoice-printable { position: fixed; inset: 0; background: white; z-index: 10000; padding: 40px !important; margin: 0 !important; width: 100vw !important; max-width: none !important; height: 100vh !important; } h2, h3, h4, h5, p, span, b, strong { color: black !important; } .md\:ml-\[280px\] { margin-left: 0 !important; } }
      `}</style>
    </div>
  );
}

function SidebarLink({ label, ico, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-5 p-5 rounded-[22px] transition-all font-black text-[10px] uppercase tracking-[0.4em] border-l-4 italic ${active ? 'bg-[#257242]/20 text-[#257242] border-[#257242] shadow-2xl' : 'text-white/20 border-transparent hover:text-white/80 hover:bg-white/5'}`}>
       <span className={active ? 'text-[#257242]' : 'opacity-20'}>{ico}</span>
       <span>{label}</span>
    </button>
  );
}

function MiniCard({ label, val, theme, up }: any) {
  const styles: any = { 
    green: "border-[#257242]/20 text-[#1a2e46]", 
    navy: "border-[#1a2e46]/20 text-blue-900",
    gold: "border-[#c8921e]/20 text-[#112031]"
  };
  return (
    <div className={`p-8 bg-white rounded-[45px] border shadow-2xl transition-all duration-1000 hover:rotate-1 group hover:border-[#257242] ${styles[theme]}`}>
       <div className="flex justify-between items-start mb-1">
          <h4 className="text-4xl font-serif font-black underline underline-offset-[8px] decoration-4 tracking-tighter decoration-[#257242]/20 italic">{val}</h4>
          <span className={`text-[8px] font-black ${up?'text-emerald-500 animate-pulse':'text-red-500'} bg-gray-50 px-2 py-0.5 rounded italic`}>{up ? 'ACTIVE' : 'PENDING'}</span>
       </div>
       <p className="text-[10px] font-black uppercase text-slate-300 mt-5 leading-none italic tracking-tighter">{label}</p>
    </div>
  );
}