"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, ClipboardList, CreditCard, Bell, 
  Plus, X, Printer, LogOut, Upload, ShieldCheck, Download, Calendar, Menu
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
    location: '', priority: 'Normal Ops', targetDate: '', details: ''
  });

  useEffect(() => {
    const session = localStorage.getItem("user");
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
      setRequests(await reqRes.json());
      setInvoices(await invRes.json());
    } catch (err) {
      toast.error("Resource Synchronization Error");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const load = toast.loading("Broadcasting Deployment Brief...");
    try {
      const res = await fetch('/api/client/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...requestForm, userId: user._id, serviceType: selectedService })
      });
      if (res.ok) {
        toast.success("Dispatch Node Logged", { id: load });
        setSelectedService(null);
        fetchData(user._id);
        setActiveTab('activity');
      }
    } catch (err) {
      toast.error("Transmission Failure", { id: load });
    }
  };

  const handleReceiptUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) return toast.error("Evidence file missing");
    const load = toast.loading("Validating Transaction Node...");
    try {
      const res = await fetch('/api/client/invoices/reconcile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: selectedInvoice._id, receiptUrl: "https://cloudinary-placeholder.com/receipt.jpg" })
      });
      if (res.ok) {
        toast.success("Reconciliation Pending Admin Audit", { id: load });
        setSelectedInvoice(null);
        fetchData(user._id);
      }
    } catch (err) {
      toast.error("Gateway Sync Error");
    }
  };

  const handleLogout = () => { localStorage.clear(); router.push('/auth'); };

  const totalUnpaid = Array.isArray(invoices)
    ? invoices.filter(i => i.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0)
    : 0;

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  if (loading) return (
    <div className="h-screen bg-[#060f1e] flex flex-col items-center justify-center font-sans">
      <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-white/20 font-black uppercase text-[9px] tracking-[0.4em]">Calibrating User Environment...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f5f0e8] text-navy font-sans overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[90] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR — inline style handles open state; static classes handle closed/desktop */}
      <aside
        style={{ transform: sidebarOpen ? 'translateX(0)' : undefined }}
        className="w-[280px] bg-[#060f1e] fixed inset-y-0 left-0 border-r border-gold/10 z-[100] flex flex-col no-print shadow-2xl -translate-x-full md:translate-x-0 transition-transform duration-300"
      >
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center font-black text-navy text-2xl shadow-xl uppercase italic">O</div>
          <div className="leading-tight">
            <span className="block text-white font-serif font-black text-xl uppercase tracking-tighter">OBRUS</span>
            <span className="text-gold-lt text-[10px] uppercase font-black tracking-widest opacity-60">Master Node</span>
          </div>
        </div>

        <nav className="p-6 flex-1 space-y-1.5 mt-8">
          <SidebarLink label="Overview" ico={<Home size={18}/>} active={activeTab === 'overview'} onClick={() => switchTab('overview')}/>
          <SidebarLink label="Industrial Services" ico={<Plus size={18}/>} active={activeTab === 'engage'} onClick={() => switchTab('engage')}/>
          <SidebarLink label="Financial Registry" ico={<CreditCard size={18}/>} active={activeTab === 'billing'} onClick={() => switchTab('billing')}/>
          <SidebarLink label="Entry Tracking" ico={<ClipboardList size={18}/>} active={activeTab === 'activity'} onClick={() => switchTab('activity')}/>
        </nav>

        <div className="p-8 border-t border-white/5 bg-[#040a14]">
          <button onClick={handleLogout} className="flex items-center gap-4 text-red-400/40 hover:text-red-400 font-black text-[10px] transition-all uppercase tracking-[0.3em]">
            <LogOut size={16}/> Terminate Link
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-y-auto custom-scrollbar">

        {/* HEADER */}
        <header className="h-[70px] md:h-[80px] bg-white border-b flex items-center justify-between px-5 md:px-12 sticky top-0 z-[50] no-print">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl border border-navy/10 text-navy/40 hover:text-gold hover:border-gold transition-all"
            >
              <Menu size={20}/>
            </button>
            <h2 className="font-serif text-xl md:text-3xl font-black uppercase tracking-tighter italic decoration-gold underline-offset-[10px] underline decoration-4">
              {activeTab} console
            </h2>
          </div>
          <div className="flex gap-3 md:gap-6 items-center">
            <div className="hidden sm:flex bg-[#fcfbf9] px-4 md:px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 border border-navy/5 shadow-inner leading-none items-center gap-3">
              <Calendar size={13}/> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric'})}
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-navy flex items-center justify-center text-white cursor-pointer hover:bg-gold transition-all shadow-xl shadow-navy/20 relative">
              <Bell size={18}/><div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
        </header>

        <div className="p-5 md:p-12 pb-32 w-full max-w-[1400px] mx-auto">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-14">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <KpiCard label="Total Inquiries" val={requests?.length || 0} unit="Nodes" />
                <KpiCard label="Account Balance" val={`₦${totalUnpaid.toLocaleString()}`} unit="Pending" />
                <KpiCard label="Industrial Access" val="VERIFIED" unit="Clearance" />
                <KpiCard label="Staff Deployments" val="0" unit="Current" />
              </div>

              <div className="bg-[#0b1f3a] p-10 md:p-20 rounded-[40px] md:rounded-[60px] text-white relative overflow-hidden shadow-3xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold/[0.04] rounded-bl-full pointer-events-none"></div>
                <ShieldCheck className="absolute bottom-10 right-10 text-gold/[0.05]" size={180}/>
                <div className="relative z-10">
                  <h3 className="font-serif text-3xl md:text-5xl font-black mb-6 md:mb-8 italic tracking-tighter uppercase decoration-gold underline-offset-8 underline decoration-4">Authorization Confirmed</h3>
                  <p className="text-white/40 text-base md:text-2xl leading-relaxed max-w-2xl font-light">
                    Your portal environment is active. You have <b className="text-gold font-bold">industrial clearance</b> to book HSE Training, Waste Management, and Procurement services directly.
                  </p>
                  <button onClick={() => setActiveTab('engage')} className="mt-10 md:mt-14 bg-gradient-to-r from-gold to-gold-lt text-navy px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-105 transition-all">
                    Establish New Request
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ENGAGE */}
          {activeTab === 'engage' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {[
                { t: 'HSE Training', d: 'Industrial certifications for staff nodes.', i: '🛡️', b: 'border-navy' },
                { t: 'Pest Control', d: 'Systematic chemical treatment solutions.', i: '🧪', b: 'border-gold' },
                { t: 'Waste Management', d: 'Regular logistical refuse evacuation.', i: '♻️', b: 'border-green' },
                { t: 'Procurement', d: 'Source industrial gear & tech equipment.', i: '📦', b: 'border-gold' },
                { t: 'Janitorial', d: 'Comprehensive facility maintenance deep-cleans.', i: '🧹', b: 'border-navy' },
                { t: 'Custom Operations', d: 'General consultancy & strategy planning.', i: '💡', b: 'border-gold' }
              ].map((svc) => (
                <div key={svc.t} onClick={() => setSelectedService(svc.t)} className={`bg-white p-6 md:p-12 rounded-[35px] md:rounded-[55px] border-t-8 ${svc.b} shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer group`}>
                  <div className="text-4xl md:text-6xl mb-6 md:mb-10 transition-transform duration-700 group-hover:rotate-12">{svc.i}</div>
                  <h3 className="font-serif text-lg md:text-2xl font-black uppercase tracking-tighter mb-2 md:mb-4 text-navy group-hover:text-gold transition-colors">{svc.t}</h3>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-loose hidden md:block">{svc.d}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* BILLING */}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-[35px] md:rounded-[50px] shadow-3xl overflow-hidden border border-navy/5 animate-in slide-in-from-left-6 duration-700">
              <div className="p-6 md:p-10 bg-[#fcfbf9] border-b border-navy/5 flex justify-between items-center">
                <h3 className="font-serif text-2xl md:text-3xl font-black uppercase italic tracking-tighter">Finance Ledger</h3>
                <CreditCard className="text-gold/20" size={38}/>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="bg-[#0b1f3a] text-gold-lt uppercase">
                    <tr>
                      <th className="p-5 md:p-8 text-[10px] font-black tracking-widest">Reference</th>
                      <th className="p-5 md:p-8 text-[10px] font-black tracking-widest">Service</th>
                      <th className="p-5 md:p-8 text-[10px] font-black tracking-widest">Amount</th>
                      <th className="p-5 md:p-8 text-[10px] font-black tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede6]">
                    {invoices.length === 0 ? (
                      <tr><td colSpan={4} className="p-16 text-center text-slate-400 italic font-medium uppercase tracking-widest text-xs">Zero outstanding balances detected.</td></tr>
                    ) : (
                      invoices.map((inv: any) => (
                        <tr key={inv._id} className="hover:bg-gold/[0.04] transition-all">
                          <td className="p-5 md:p-8 font-mono text-sm font-black text-navy">{inv.id || 'INV-Node'}</td>
                          <td className="p-5 md:p-8 font-serif font-black text-lg text-navy italic">{inv.service}</td>
                          <td className="p-5 md:p-8 font-black tracking-tighter">₦{inv.amount.toLocaleString()}</td>
                          <td className="p-5 md:p-8">
                            {inv.status === 'pending' ? (
                              <button onClick={() => setSelectedInvoice(inv)} className="bg-navy text-gold-lt px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-gold/20 hover:bg-gold hover:text-navy transition-all active:scale-95">Verify & Audit</button>
                            ) : (
                              <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-gold/10 text-gold'}`}>Status: {inv.status}</span>
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

          {/* ACTIVITY */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-[35px] md:rounded-[55px] shadow-3xl overflow-hidden border border-navy/5 animate-in slide-in-from-right-6 duration-700">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="bg-[#0b1f3a] text-gold-lt uppercase italic">
                    <tr>
                      <th className="p-6 md:p-9 text-[10px] font-black tracking-[0.3em]">Log ID</th>
                      <th className="p-6 md:p-9 text-[10px] font-black tracking-[0.3em]">Service</th>
                      <th className="p-6 md:p-9 text-[10px] font-black tracking-[0.3em]">Date</th>
                      <th className="p-6 md:p-9 text-[10px] font-black tracking-[0.3em]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede6]">
                    {requests.length === 0 ? (
                      <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Listening for service broadcast nodes...</td></tr>
                    ) : (
                      requests.map((r: any) => (
                        <tr key={r._id} className="hover:bg-gold/[0.04] transition-colors">
                          <td className="p-6 md:p-9 font-mono font-black text-navy text-xs opacity-50 uppercase tracking-widest">{r._id.substring(0, 10)}</td>
                          <td className="p-6 md:p-9 font-serif font-black text-lg md:text-2xl text-navy italic tracking-tighter">{r.serviceType}</td>
                          <td className="p-6 md:p-9 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{new Date(r.createdAt).toDateString()}</td>
                          <td className="p-6 md:p-9">
                            <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full ${r.status === 'completed' ? 'bg-green-500' : 'bg-gold'}`}></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-navy">{r.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* SERVICE REQUEST MODAL */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-navy-deep/95 backdrop-blur-xl no-print">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[40px] md:rounded-[60px] p-8 md:p-16 shadow-2xl relative overflow-y-auto max-h-[95vh] custom-scrollbar"
            >
              <button onClick={() => setSelectedService(null)} className="absolute top-6 right-6 md:top-12 md:right-12 bg-navy/5 p-3 md:p-4 rounded-full hover:bg-gold transition-all duration-500">
                <X size={22}/>
              </button>
              <h3 className="font-serif text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-2">Mission Dispatch</h3>
              <p className="text-gold text-[10px] font-black uppercase tracking-[0.5em] mb-10 md:mb-14 border-l-4 border-gold pl-6">{selectedService} Node Engagement</p>
              <form onSubmit={handleRequestSubmit} className="space-y-6 md:space-y-8">
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="ls">Spatial Node (Address)</label>
                    <input required className="fi" placeholder="Sector Location" onChange={e => setRequestForm({...requestForm, location: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="ls">Response Index</label>
                    <select className="fi" onChange={e => setRequestForm({...requestForm, priority: e.target.value})}>
                      <option>Normal Ops</option>
                      <option>High Priority</option>
                      <option>Urgent Dispatch</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ls">Target Temporal Data (Date)</label>
                  <input type="date" required className="fi" onChange={e => setRequestForm({...requestForm, targetDate: e.target.value})}/>
                </div>
                <div className="space-y-2">
                  <label className="ls">Mission Parameters & Scope</label>
                  <textarea className="fi h-36 py-6 resize-none" required placeholder="Describe full mission briefing, staff requirements, or equipment needs..." onChange={e => setRequestForm({...requestForm, details: e.target.value})}/>
                </div>
                <button type="submit" className="w-full bg-navy text-white py-5 md:py-6 rounded-[30px] md:rounded-[35px] font-black text-xs uppercase tracking-[0.5em] shadow-3xl shadow-navy/30 hover:bg-gold hover:text-navy transition-all active:scale-95">
                  Initiate Secured Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INVOICE MODAL */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-navy-deep/98 backdrop-blur-xl no-print">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full max-w-5xl rounded-[40px] md:rounded-[70px] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/5 relative h-full max-h-[90vh]"
            >
              <div id="invoice-printable" className="flex-1 p-8 md:p-20 overflow-y-auto">
                <div className="flex justify-between items-start mb-10 md:mb-20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-navy text-gold rounded-2xl md:rounded-3xl flex items-center justify-center font-black text-2xl md:text-3xl uppercase italic">O</div>
                    <div>
                      <h4 className="font-serif text-2xl md:text-4xl font-bold tracking-tighter text-navy uppercase leading-none">OBRUS APEX</h4>
                      <p className="text-[10px] uppercase font-black tracking-[0.3em] text-gold mt-1">Services division hub</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[10px] text-slate-300 uppercase tracking-[0.5em] mb-2 leading-none italic">Secured Document</p>
                    <span className="text-xl md:text-3xl font-mono font-black tracking-tight text-navy">{selectedInvoice.id || "ID-NODE"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 md:gap-20 text-xs font-bold uppercase tracking-widest text-slate-500 mb-10 md:mb-20 leading-loose border-t pt-8 border-navy/5">
                  <div>
                    <span className="text-gold-lt text-[10px] block mb-2 font-black italic">Entity Issuer</span>
                    <b>OBRUS Apex Integrated Services Ltd</b><br/>HQ Port Harcourt<br/>Rivers State
                  </div>
                  <div>
                    <span className="text-gold-lt text-[10px] block mb-2 font-black italic">Recipient Node</span>
                    <b>{user?.name}</b><br/>{user?.email}<br/>ID: {user?._id?.substring(0, 8).toUpperCase()}
                  </div>
                </div>
                <div className="border-y-4 border-navy py-8 md:py-12 mb-10 md:mb-16 flex justify-between items-end">
                  <div>
                    <span className="text-gold font-black text-[10px] uppercase tracking-widest block mb-3 italic leading-none">Operational Items</span>
                    <h5 className="font-serif text-2xl md:text-4xl font-bold italic tracking-tighter">{selectedInvoice.service}</h5>
                  </div>
                  <h5 className="text-3xl md:text-5xl font-black text-navy tracking-tighter italic">₦{selectedInvoice.amount?.toLocaleString()}</h5>
                </div>
                <div className="p-6 md:p-10 bg-[#f9f8f6] rounded-[30px] md:rounded-[40px] border border-dashed border-navy/10 text-center text-xs font-black uppercase text-navy/30 leading-loose">
                  Reconciliation Channel: Account ID 102XXXXXXXXX (Zenith Node)<br/>Vett the link in lateral console for final node validation.
                </div>
              </div>

              <div className="w-full md:w-[380px] bg-[#f0ede6] p-8 md:p-16 flex flex-col no-print border-t md:border-t-0 md:border-l border-navy/5">
                <button onClick={() => setSelectedInvoice(null)} className="ml-auto mb-8 md:mb-16 hover:rotate-180 transition-all duration-700 bg-white p-3 md:p-4 rounded-full shadow-lg text-navy">
                  <X size={22}/>
                </button>
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3 italic tracking-tighter text-navy">Node Payment</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 md:mb-12 italic leading-relaxed">Identity confirmation and bank receipt upload required.</p>
                <form onSubmit={handleReceiptUpload} className="space-y-6 md:space-y-10 flex-1">
                  <div className="relative group">
                    <input type="file" required className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} />
                    <div className="w-full py-12 md:py-16 bg-white border-2 border-dashed rounded-[35px] md:rounded-[45px] border-gold/10 flex flex-col items-center justify-center text-center transition-all group-hover:border-gold shadow-sm group-hover:shadow-2xl">
                      <Upload size={28} className="text-gold opacity-10 mb-4 group-hover:opacity-100 transition-opacity duration-700"/>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">{receiptFile ? receiptFile.name : 'Upload Vetting Receipt'}</p>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 md:py-5 bg-navy text-white rounded-[25px] font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:bg-gold transition-all active:scale-95">
                    Vett Reconciliation →
                  </button>
                </form>
                <div className="pt-8 md:pt-12 flex flex-col gap-3 mt-auto">
                  <button onClick={() => window.print()} className="w-full py-3.5 bg-white text-navy rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-[#0b1f3a] hover:text-white transition-all shadow-xl">
                    <Printer size={16}/> Print Hardcopy
                  </button>
                  <button className="w-full py-3.5 bg-gold text-navy rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 shadow-3xl hover:-translate-y-1 transition-all">
                    <Download size={16}/> Archive Digital PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          main { margin-left: 0 !important; width: 100% !important; padding: 0 !important; }
          #invoice-printable { border: none !important; padding: 50px !important; position: absolute; top: 0; left: 0; background: white; z-index: 10000; }
          h2, h3, h4, h5, p, span, b { color: black !important; font-weight: bold; }
        }
        .fi { width: 100%; background: #f9f8f6; border: 1.5px solid rgba(11,31,58,0.03); padding: 18px 24px; border-radius: 20px; font-size: 14px; font-weight: 700; color: #0b1f3a; outline: none; transition: 0.4s; }
        .fi:focus { border-color: #c8921e; background: white; box-shadow: 0 10px 40px rgba(200,146,30,0.06); }
        .ls { font-size: 10px; font-weight: 900; text-transform: uppercase; color: rgba(11,31,58,0.2); margin-left: 1.5rem; letter-spacing: 0.25em; display: block; margin-bottom: 0.5rem; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(200, 146, 30, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(11, 31, 58, 0.1); }
      `}</style>
    </div>
  );
}

function SidebarLink({ label, ico, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-5 p-5 rounded-3xl transition-all font-black text-[10px] uppercase tracking-[0.3em] border-l-4 group ${active ? 'bg-gold/15 text-gold-lt border-gold shadow-lg translate-x-1' : 'text-white/20 border-transparent hover:text-white hover:bg-white/5'}`}>
      <span className={active ? 'text-gold' : 'opacity-10 group-hover:opacity-40 transition-opacity'}>{ico}</span>
      <span>{label}</span>
    </button>
  );
}

function KpiCard({ label, val, unit }: any) {
  return (
    <div className="p-6 md:p-10 bg-white rounded-[35px] md:rounded-[50px] border shadow-2xl border-navy/5 relative overflow-hidden transition-all hover:scale-105 hover:border-gold">
      <div className="flex justify-between items-start mb-1 leading-none">
        <h4 className="text-3xl md:text-5xl font-serif font-black text-navy italic">{val}</h4>
        <span className="text-[9px] font-black bg-gold/10 text-gold px-2 py-0.5 rounded italic shadow-sm tracking-tighter">{unit}</span>
      </div>
      <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.25em] block mt-1 ml-1">{label}</span>
    </div>
  );
}
