"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home, ClipboardList, CreditCard, Bell,
  Plus, X, Printer, LogOut, Upload, ShieldCheck, Download, Calendar, Menu
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientPortal() {
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

  // FIX: priority default matches model enum
  const [requestForm, setRequestForm] = useState({
    location: '', priority: 'Normal Ops', targetDate: '', details: ''
  });

  useEffect(() => {
    const session = localStorage.getItem('user');
    if (!session) { router.push('/auth'); return; }
    const parsedUser = JSON.parse(session);
    setUser(parsedUser);
    fetchData(parsedUser._id);
  }, [router]);

  // FIX: check res.ok before parsing JSON to avoid silent crashes
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
      toast.error('Failed to load your data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const load = toast.loading('Submitting request...');
    try {
      const res = await fetch('/api/client/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...requestForm, userId: user._id, serviceType: selectedService })
      });
      if (res.ok) {
        toast.success('Request submitted successfully', { id: load });
        setSelectedService(null);
        fetchData(user._id);
        setActiveTab('activity');
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || 'Failed to submit request', { id: load });
      }
    } catch {
      toast.error('Network error. Please try again.', { id: load });
    }
  };

  const handleReceiptUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) return toast.error('Please select a receipt file');
    const load = toast.loading('Uploading payment proof...');
    try {
      const res = await fetch('/api/client/invoices/reconcile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: selectedInvoice._id,
          receiptUrl: 'https://cloudinary-placeholder.com/receipt.jpg'
        })
      });
      if (res.ok) {
        toast.success('Payment proof submitted — pending admin review', { id: load });
        setSelectedInvoice(null);
        fetchData(user._id);
      } else {
        toast.error('Upload failed. Please try again.', { id: load });
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
  };

  const handleLogout = () => { localStorage.clear(); router.push('/auth'); };

  // FIX: model uses 'unpaid' not 'pending'
  const totalUnpaid = Array.isArray(invoices)
    ? invoices.filter(i => i.status === 'unpaid').reduce((acc, curr) => acc + curr.amount, 0)
    : 0;

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const tabTitles: Record<string, string> = {
    overview: 'Overview',
    engage: 'Book a Service',
    billing: 'Invoices',
    activity: 'My Requests',
  };

  if (loading) return (
    <div className="h-screen bg-[#060f1e] flex flex-col items-center justify-center font-sans">
      <div className="w-10 h-10 border-2 border-[#c8921e] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-white/30 font-semibold uppercase text-xs tracking-widest">Loading your portal...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f5f0e8] text-[#0b1f3a] font-sans overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-[90] md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside
        style={{ transform: sidebarOpen ? 'translateX(0)' : undefined }}
        className="w-[260px] bg-[#060f1e] fixed inset-y-0 left-0 border-r border-white/5 z-[100] flex flex-col shadow-2xl -translate-x-full md:translate-x-0 transition-transform duration-300"
      >
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#c8921e] rounded-xl flex items-center justify-center font-black text-[#0b1f3a] text-lg italic">O</div>
          <div>
            <span className="block text-white font-bold text-base leading-none">OBRUS</span>
            <span className="text-[#e8b84b] text-[10px] uppercase tracking-widest opacity-60">Client Portal</span>
          </div>
        </div>

        <nav className="p-4 flex-1 space-y-1 mt-6">
          <SidebarLink label="Overview" ico={<Home size={17}/>} active={activeTab === 'overview'} onClick={() => switchTab('overview')}/>
          <SidebarLink label="Book a Service" ico={<Plus size={17}/>} active={activeTab === 'engage'} onClick={() => switchTab('engage')}/>
          <SidebarLink label="Invoices" ico={<CreditCard size={17}/>} active={activeTab === 'billing'} onClick={() => switchTab('billing')}/>
          <SidebarLink label="My Requests" ico={<ClipboardList size={17}/>} active={activeTab === 'activity'} onClick={() => switchTab('activity')}/>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400/50 hover:text-red-400 font-semibold text-xs transition-all uppercase tracking-widest">
            <LogOut size={15}/> Log Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="md:ml-[260px] flex-1 flex flex-col min-h-screen overflow-y-auto custom-scrollbar">

        {/* HEADER */}
        <header className="h-[64px] bg-white border-b border-[rgba(11,31,58,0.06)] flex items-center justify-between px-5 md:px-10 sticky top-0 z-[50]">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-xl border border-[rgba(11,31,58,0.08)] text-[#0b1f3a]/40 hover:text-[#c8921e] hover:border-[#c8921e] transition-all">
              <Menu size={19}/>
            </button>
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#0b1f3a] italic tracking-tight">
              {tabTitles[activeTab]}
            </h2>
          </div>
          <div className="flex gap-3 items-center">
            <div className="hidden sm:flex items-center gap-2 bg-[#f9f8f6] px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 border border-[rgba(11,31,58,0.06)]">
              <Calendar size={12}/> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#0b1f3a] flex items-center justify-center text-white hover:bg-[#c8921e] transition-all relative cursor-pointer">
              <Bell size={16}/>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </div>
          </div>
        </header>

        <div className="p-5 md:p-10 pb-24 w-full max-w-[1200px] mx-auto">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <KpiCard label="Total Requests" val={requests?.length || 0} unit="All time" />
                <KpiCard label="Outstanding Balance" val={totalUnpaid > 0 ? `₦${totalUnpaid.toLocaleString()}` : '₦0'} unit="Unpaid" />
                <KpiCard label="Account Status" val="Active" unit="Verified" />
                <KpiCard label="Staff Deployed" val="0" unit="Current" />
              </div>

              <div className="bg-[#0b1f3a] p-8 md:p-14 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#c8921e]/[0.04] rounded-bl-full pointer-events-none" />
                <ShieldCheck className="absolute bottom-8 right-8 text-[#c8921e]/[0.06]" size={140}/>
                <div className="relative z-10">
                  <h3 className="font-serif text-2xl md:text-4xl font-bold mb-4 italic">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h3>
                  <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl mb-8">
                    Your portal is active. Book HSE Training, Waste Management, Procurement, and other services directly from here.
                  </p>
                  <button onClick={() => setActiveTab('engage')} className="bg-[#c8921e] text-[#0b1f3a] px-8 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-[#e8b84b] transition-all">
                    Book a Service →
                  </button>
                </div>
              </div>

              {/* Recent requests — always shown with proper empty state */}
              <div className="bg-white rounded-2xl border border-[rgba(11,31,58,0.06)] overflow-hidden">
                <div className="p-5 border-b border-[rgba(11,31,58,0.05)] flex items-center justify-between">
                  <h3 className="font-semibold text-[#0b1f3a]">Recent Requests</h3>
                  <button onClick={() => switchTab('activity')} className="text-xs font-semibold text-[#c8921e] hover:underline">View all →</button>
                </div>
                {requests.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-slate-400 text-sm mb-4">No service requests yet.</p>
                    <button onClick={() => switchTab('engage')} className="px-6 py-2.5 bg-[#c8921e] text-[#0b1f3a] rounded-xl text-sm font-bold hover:bg-[#e8b84b] transition-all">
                      Book Your First Service
                    </button>
                  </div>
                ) : (
                  requests.slice(0, 3).map((r: any) => (
                    <div key={r._id} className="flex items-center justify-between p-4 border-b border-[rgba(11,31,58,0.04)] last:border-0 hover:bg-[#f9f8f6] transition-all">
                      <div>
                        <p className="font-semibold text-sm text-[#0b1f3a]">{r.serviceType}</p>
                        <p className="text-xs text-slate-400">{new Date(r.createdAt).toDateString()}</p>
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${r.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-[#c8921e]/10 text-[#c8921e]'}`}>{r.status}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* BOOK A SERVICE */}
          {activeTab === 'engage' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-sm text-slate-500 mb-6">Select a service to submit a request.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                {[
                  { t: 'HSE Training', d: 'Safety certifications for your team.', i: '🛡️', b: 'border-[#0b1f3a]' },
                  { t: 'Pest Control', d: 'Fumigation and pest management.', i: '🧪', b: 'border-[#c8921e]' },
                  { t: 'Waste Management', d: 'Scheduled refuse evacuation.', i: '♻️', b: 'border-green-600' },
                  { t: 'Procurement', d: 'Industrial equipment and supplies.', i: '📦', b: 'border-[#c8921e]' },
                  { t: 'Janitorial', d: 'Cleaning and facility maintenance.', i: '🧹', b: 'border-[#0b1f3a]' },
                  { t: 'Consultancy', d: 'Custom advisory and planning.', i: '💡', b: 'border-[#c8921e]' }
                ].map((svc) => (
                  <div
                    key={svc.t}
                    onClick={() => setSelectedService(svc.t)}
                    className={`bg-white p-5 md:p-8 rounded-2xl border-t-4 ${svc.b} border border-[rgba(11,31,58,0.05)] shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all group`}
                  >
                    <div className="text-3xl md:text-4xl mb-4 group-hover:scale-110 transition-transform">{svc.i}</div>
                    <h3 className="font-bold text-base md:text-lg text-[#0b1f3a] mb-1 group-hover:text-[#c8921e] transition-colors">{svc.t}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed hidden md:block">{svc.d}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* INVOICES */}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[rgba(11,31,58,0.06)]">
              <div className="p-5 md:p-8 bg-[#f9f8f6] border-b border-[rgba(11,31,58,0.05)] flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold italic text-[#0b1f3a]">Your Invoices</h3>
                <CreditCard className="text-[#c8921e]/30" size={28}/>
              </div>
              <div className="overflow-x-auto">
                <p className="text-[10px] font-semibold text-slate-400 px-5 pt-3 md:hidden">← Scroll to see more</p>
                <table className="w-full text-left min-w-[480px]">
                  <thead className="bg-[#0b1f3a] text-[#e8b84b] uppercase">
                    <tr>
                      <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Invoice #</th>
                      <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Service</th>
                      <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Amount</th>
                      <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede6]">
                    {invoices.length === 0 ? (
                      <tr><td colSpan={4} className="p-16 text-center text-slate-400 text-sm">No invoices yet.</td></tr>
                    ) : (
                      invoices.map((inv: any) => (
                        <tr key={inv._id} className="hover:bg-[#f9f8f6] transition-all">
                          {/* FIX: model uses invoiceNumber not id */}
                          <td className="p-4 md:p-6 font-mono text-sm font-bold text-[#0b1f3a]">{inv.invoiceNumber || 'INV-001'}</td>
                          {/* FIX: model uses serviceType not service */}
                          <td className="p-4 md:p-6 font-serif font-bold text-[#0b1f3a] italic">{inv.serviceType}</td>
                          <td className="p-4 md:p-6 font-bold text-[#0b1f3a]">₦{inv.amount?.toLocaleString()}</td>
                          <td className="p-4 md:p-6">
                            {/* FIX: model status is 'unpaid' not 'pending' */}
                            {inv.status === 'unpaid' ? (
                              <button onClick={() => setSelectedInvoice(inv)} className="bg-[#0b1f3a] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#c8921e] transition-all active:scale-95">
                                Pay Now
                              </button>
                            ) : (
                              <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                                inv.status === 'paid' ? 'bg-green-50 text-green-600' :
                                inv.status === 'verifying' ? 'bg-blue-50 text-blue-500' :
                                'bg-[#c8921e]/10 text-[#c8921e]'
                              }`}>
                                {inv.status}
                              </span>
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

          {/* MY REQUESTS */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[rgba(11,31,58,0.06)]">
              <div className="p-5 md:p-8 bg-[#f9f8f6] border-b border-[rgba(11,31,58,0.05)] flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold italic text-[#0b1f3a]">My Service Requests</h3>
                <button onClick={() => switchTab('engage')} className="text-xs font-semibold text-[#c8921e] hover:underline">+ New request</button>
              </div>
              <div className="overflow-x-auto">
                {requests.length > 0 && <p className="text-[10px] font-semibold text-slate-400 px-5 pt-3 md:hidden">← Scroll to see more</p>}
                <table className="w-full text-left min-w-[480px]">
                  <thead className="bg-[#0b1f3a] text-[#e8b84b] uppercase">
                    <tr>
                      <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">ID</th>
                      <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Service</th>
                      <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Date</th>
                      <th className="p-4 md:p-6 text-[10px] font-bold tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede6]">
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-16 text-center">
                          <p className="text-slate-400 text-sm mb-4">You have no service requests yet.</p>
                          <button onClick={() => switchTab('engage')} className="px-6 py-2.5 bg-[#c8921e] text-[#0b1f3a] rounded-xl text-sm font-bold hover:bg-[#0b1f3a] hover:text-white transition-all">
                            Book Your First Service
                          </button>
                        </td>
                      </tr>
                    ) : (
                      requests.map((r: any) => (
                        <tr key={r._id} className="hover:bg-[#f9f8f6] transition-colors">
                          <td className="p-4 md:p-6 font-mono text-xs text-[#0b1f3a]/50">{r._id.substring(0, 10)}</td>
                          <td className="p-4 md:p-6 font-serif font-bold text-[#0b1f3a] italic">{r.serviceType}</td>
                          <td className="p-4 md:p-6 text-xs font-semibold text-slate-400">{new Date(r.createdAt).toDateString()}</td>
                          <td className="p-4 md:p-6">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${r.status === 'completed' ? 'bg-green-500' : 'bg-[#c8921e]'}`} />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b1f3a]">{r.status}</span>
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
          <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#060f1e]/90 backdrop-blur-xl">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl p-7 md:p-10 shadow-2xl relative overflow-y-auto max-h-[92vh] custom-scrollbar"
            >
              <button onClick={() => setSelectedService(null)} className="absolute top-5 right-5 bg-[#f0ede6] p-2.5 rounded-full hover:bg-[#c8921e] hover:text-white transition-all">
                <X size={18}/>
              </button>
              <h3 className="font-serif text-2xl md:text-3xl font-bold italic text-[#0b1f3a] mb-1">New Request</h3>
              <p className="text-[#c8921e] text-xs font-bold uppercase tracking-widest mb-8 border-l-4 border-[#c8921e] pl-4">{selectedService}</p>

              <form onSubmit={handleRequestSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="field-label">Service Location *</label>
                    <input required className="field-input" placeholder="Address or area" onChange={e => setRequestForm({...requestForm, location: e.target.value})}/>
                  </div>
                  <div>
                    <label className="field-label">Priority Level</label>
                    {/* FIX: option values match model enum exactly */}
                    <select className="field-input" onChange={e => setRequestForm({...requestForm, priority: e.target.value})}>
                      <option value="Normal Ops">Normal</option>
                      <option value="High Priority">High Priority</option>
                      <option value="Urgent Dispatch">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="field-label">Preferred Date *</label>
                  <input type="date" required className="field-input" onChange={e => setRequestForm({...requestForm, targetDate: e.target.value})}/>
                </div>
                <div>
                  <label className="field-label">Details & Requirements *</label>
                  <textarea
                    className="field-input h-32 py-4 resize-none"
                    required
                    placeholder="Describe the job scope, number of staff needed, equipment, or any special requirements..."
                    onChange={e => setRequestForm({...requestForm, details: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-[#0b1f3a] text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#c8921e] hover:text-[#0b1f3a] transition-all active:scale-95">
                  Submit Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INVOICE MODAL */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#060f1e]/90 backdrop-blur-xl">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full sm:max-w-4xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[92vh]"
            >
              <div id="invoice-printable" className="flex-1 p-7 md:p-14 overflow-y-auto">
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#0b1f3a] text-[#c8921e] rounded-2xl flex items-center justify-center font-black text-2xl italic">O</div>
                    <div>
                      <h4 className="font-serif text-2xl font-bold text-[#0b1f3a] uppercase">OBRUS APEX</h4>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-[#c8921e]">Services Division</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice</p>
                    <span className="text-xl font-mono font-bold text-[#0b1f3a]">{selectedInvoice.invoiceNumber || 'INV-001'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10 text-xs font-semibold text-slate-500 mb-10 border-t pt-6 border-[rgba(11,31,58,0.05)] uppercase tracking-widest leading-loose">
                  <div>
                    <span className="text-[#c8921e] text-[10px] block mb-2 font-bold">From</span>
                    <b className="text-[#0b1f3a]">OBRUS Apex Integrated Services Ltd</b><br/>
                    Port Harcourt, Rivers State
                  </div>
                  <div>
                    <span className="text-[#c8921e] text-[10px] block mb-2 font-bold">To</span>
                    <b className="text-[#0b1f3a]">{user?.name}</b><br/>
                    {user?.email}
                  </div>
                </div>

                <div className="border-y-2 border-[#0b1f3a] py-8 mb-10 flex justify-between items-end">
                  <div>
                    <p className="text-[#c8921e] font-bold text-[10px] uppercase tracking-widest mb-2">Service</p>
                    <h5 className="font-serif text-2xl font-bold italic text-[#0b1f3a]">{selectedInvoice.serviceType}</h5>
                  </div>
                  <h5 className="text-3xl font-bold text-[#0b1f3a]">₦{selectedInvoice.amount?.toLocaleString()}</h5>
                </div>

                <div className="p-5 bg-[#f9f8f6] rounded-2xl border border-dashed border-[rgba(11,31,58,0.1)] text-center text-xs font-semibold text-slate-400 leading-loose">
                  Payment: Account 102XXXXXXXXX — Zenith Bank<br/>
                  Upload your transfer receipt in the panel to confirm payment.
                </div>
              </div>

              <div className="w-full md:w-[340px] bg-[#f0ede6] p-7 md:p-12 flex flex-col border-t md:border-t-0 md:border-l border-[rgba(11,31,58,0.05)]">
                <button onClick={() => setSelectedInvoice(null)} className="ml-auto mb-8 bg-white p-2.5 rounded-full shadow text-[#0b1f3a] hover:rotate-90 transition-all duration-500">
                  <X size={18}/>
                </button>
                <h3 className="font-serif text-xl font-bold italic text-[#0b1f3a] mb-2">Confirm Payment</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-8">Transfer the amount to the account above, then upload your receipt below.</p>

                <form onSubmit={handleReceiptUpload} className="space-y-5 flex-1">
                  <div className="relative group cursor-pointer">
                    <input type="file" required className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} />
                    <div className="w-full py-10 bg-white border-2 border-dashed rounded-2xl border-[rgba(11,31,58,0.1)] flex flex-col items-center justify-center text-center group-hover:border-[#c8921e] transition-all">
                      <Upload size={24} className="text-[#c8921e] opacity-30 mb-3 group-hover:opacity-100 transition-opacity"/>
                      <p className="text-xs font-semibold text-slate-400">{receiptFile ? receiptFile.name : 'Upload receipt / screenshot'}</p>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-[#0b1f3a] text-white rounded-2xl font-bold text-sm hover:bg-[#c8921e] hover:text-[#0b1f3a] transition-all active:scale-95">
                    Submit Payment Proof
                  </button>
                </form>

                <div className="pt-6 flex flex-col gap-3 mt-auto">
                  <button onClick={() => window.print()} className="w-full py-3 bg-white text-[#0b1f3a] rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#0b1f3a] hover:text-white transition-all shadow">
                    <Printer size={15}/> Print Invoice
                  </button>
                  <button className="w-full py-3 bg-[#c8921e] text-[#0b1f3a] rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-lg transition-all">
                    <Download size={15}/> Download PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media print {
          aside, header { display: none !important; }
          main { margin-left: 0 !important; }
          #invoice-printable { position: fixed; inset: 0; background: white; padding: 40px; z-index: 9999; }
        }
        .field-input { width: 100%; background: #f9f8f6; border: 1.5px solid rgba(11,31,58,0.06); padding: 14px 18px; border-radius: 16px; font-size: 14px; font-weight: 600; color: #0b1f3a; outline: none; transition: 0.3s; font-family: inherit; }
        .field-input:focus { border-color: #c8921e; background: white; box-shadow: 0 4px 20px rgba(200,146,30,0.08); }
        .field-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: rgba(11,31,58,0.35); margin-left: 4px; letter-spacing: 0.2em; display: block; margin-bottom: 6px; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(200,146,30,0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}

function SidebarLink({ label, ico, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${active ? 'bg-[#c8921e]/15 text-[#e8b84b] border-l-4 border-[#c8921e]' : 'text-white/25 hover:text-white hover:bg-white/5 border-l-4 border-transparent'}`}
    >
      <span className={active ? 'text-[#c8921e]' : 'opacity-30'}>{ico}</span>
      <span>{label}</span>
    </button>
  );
}

function KpiCard({ label, val, unit }: any) {
  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl border border-[rgba(11,31,58,0.06)] shadow-sm hover:shadow-md hover:border-[#c8921e]/30 transition-all">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xl md:text-3xl font-serif font-bold text-[#0b1f3a] italic truncate max-w-[70%]">{val}</h4>
        <span className="text-[9px] font-bold bg-[#c8921e]/10 text-[#c8921e] px-2 py-0.5 rounded-full tracking-tight shrink-0">{unit}</span>
      </div>
      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{label}</span>
    </div>
  );
}
