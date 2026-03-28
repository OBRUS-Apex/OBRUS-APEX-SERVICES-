"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, ArrowLeft, Globe, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const contactToast = toast.loading("Transmitting message...");
    
    try {
      const res = await fetch('/api/admin/hse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.subject || 'General Enquiry',
          details: form.message,
          organisation: 'General Contact',
        }),
      });
      
      if (res.ok) {
        toast.success("Message received. We will contact you shortly.", { id: contactToast });
        setSent(true);
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Communication error. Please try again.", { id: contactToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden flex flex-col">
      
     
      <section className="relative pt-32 pb-20 px-6 bg-[#1a2e46] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#257242 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8921e]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#c8921e] text-[10px] font-black uppercase tracking-[0.3em] mb-8 transition-all group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Home
          </Link>
          <h1 className="font-serif text-4xl md:text-7xl font-black text-white leading-none tracking-tighter uppercase italic mb-6">
            Contact <span className="text-[#257242]">Our</span> <br /> <span className="text-[#c8921e]">Specialists.</span>
          </h1>
          <p className="text-white/40 text-lg md:text-xl max-w-xl font-medium leading-relaxed italic">
            Connect with the OBRUS team for recruitment, safety audits, or facility management solutions.
          </p>
        </div>
      </section>

    
      <section className="py-20 px-6 bg-gradient-to-b from-white to-green-50/30 flex-grow">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black text-[#1a2e46] uppercase italic tracking-tighter mb-4">Get In Touch</h2>
              <div className="h-1.5 w-16 bg-[#257242] rounded-full"></div>
            </div>

            <div className="grid gap-8">
              {[
                { ico: <MapPin size={22} />, label: 'Headquarters', val: 'Port Harcourt, Rivers State, Nigeria' },
                { ico: <Mail size={22} />, label: 'Official Email', val: 'info@obrusapex.com' },
                { ico: <Phone size={22} />, label: 'Direct Line', val: '+234 701 371 5767' },
              ].map(({ ico, label, val }) => (
                <div key={label} className="flex gap-6 group">
                  <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-[#257242] group-hover:bg-[#257242] group-hover:text-white transition-all duration-500">
                    {ico}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-1">{label}</p>
                    <p className="text-lg font-bold text-[#1a2e46] tracking-tight">{val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#1a2e46] rounded-[40px] p-10 md:p-12 text-white shadow-2xl relative overflow-hidden group">
              <Shield className="absolute bottom-[-20px] right-[-20px] text-white/5 group-hover:scale-110 transition-transform duration-1000" size={180} />
              <h3 className="font-serif text-2xl font-bold italic mb-4 text-[#c8921e]">Operational Support</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 font-medium">Our helpdesk is active Monday through Friday, 8:00 AM to 5:00 PM (WAT). Emergency facility requests are prioritized.</p>
              <div className="space-y-3">
                {['Recruitment Hub', 'HSE Audit Team', 'Facility Maintenance'].map(s => (
                  <div key={s} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/60">
                    <CheckCircle size={14} className="text-[#257242]"/> {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          
          <div className="bg-white rounded-[50px] border border-gray-100 p-10 md:p-16 shadow-3xl relative">
            {sent ? (
              <div className="py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-50 text-[#257242] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <CheckCircle size={40}/>
                </div>
                <h3 className="font-serif text-4xl font-bold text-[#1a2e46] italic mb-4">Message Logged</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-10">Thank you for reaching out. A division specialist will review your inquiry and respond within 24 hours.</p>
                <button onClick={() => setSent(false)} className="px-10 py-4 bg-[#1a2e46] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#257242] transition-all shadow-xl">
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <h3 className="text-3xl font-black text-[#1a2e46] uppercase italic tracking-tighter mb-2">Send a Message</h3>
                  <p className="text-gray-400 text-sm font-medium">Fill the form below to initiate communication.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="field-label">Full Name</label>
                      <input required className="field-input" placeholder="e.g. John Doe" onChange={e => setForm({...form, name: e.target.value})}/>
                    </div>
                    <div className="space-y-2">
                      <label className="field-label">Phone Number</label>
                      <input className="field-input" placeholder="+234..." onChange={e => setForm({...form, phone: e.target.value})}/>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="field-label">Email Address</label>
                    <input required type="email" className="field-input" placeholder="name@company.com" onChange={e => setForm({...form, email: e.target.value})}/>
                  </div>

                  <div className="space-y-2">
                    <label className="field-label">Inquiry Category</label>
                    <select className="field-input cursor-pointer" onChange={e => setForm({...form, subject: e.target.value})}>
                      <option value="">Select a service...</option>
                      <option>Recruitment & Manpower</option>
                      <option>HSE Consultancy</option>
                      <option>Environmental Services</option>
                      <option>Equipment Procurement</option>
                      <option>Facility Maintenance</option>
                      <option>General Support</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="field-label">Detailed Message</label>
                    <textarea
                      required
                      className="field-input h-32 py-5 resize-none leading-relaxed"
                      placeholder="How can OBRUS assist your operations?"
                      onChange={e => setForm({...form, message: e.target.value})}
                    />
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-5 bg-[#257242] text-white rounded-[22px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-[#1a2e46] transition-all transform active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin"/> : <><Send size={18}/> Transmit Message</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      
      <footer className="bg-[#060f1e] py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <img src="/logo.png" className="h-8 w-auto opacity-30 grayscale" alt="OBRUS" />
          <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.5em] italic">
            &copy; 2026 OBRUS APEX SERVICES · NIGERIA OPERATIONS HUB
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-white/20 hover:text-[#c8921e] transition-colors"><Globe size={18}/></Link>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .field-input { 
          width: 100%; background: #fcfbf9; border: 1.5px solid #efefef; border-radius: 18px; padding: 16px 20px; 
          font-size: 14px; font-weight: 700; color: #1a2e46; outline: none; transition: 0.3s; 
        }
        .field-input:focus { border-color: #257242; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
        .field-label { 
          font-size: 10px; font-weight: 900; text-transform: uppercase; color: rgba(26, 46, 70, 0.2); 
          margin-left: 8px; letter-spacing: 0.2em; display: block; margin-bottom: 6px; 
        }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.08); }
      `}</style>
    </div>
  );
}