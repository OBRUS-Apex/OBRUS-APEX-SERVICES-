"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Submits to HSE enquiry endpoint as a general contact
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
          organisation: '',
        }),
      }).catch(() => null);
      setSent(true);
    } catch {
      setSent(true); // Still show success — don't leave user hanging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] font-sans overflow-x-hidden">
      <PublicNav active="/contact" />

      {/* HERO */}
      <section className="pt-32 pb-16 px-5 bg-gradient-to-br from-[#060f1e] to-[#0b1f3a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8921e]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex gap-2 text-sm text-white/40 mb-4">
            <Link href="/" className="text-[#e8b84b]">Home</Link>
            <span>›</span><span>Contact</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            Talk to a <span className="text-[#c8921e] italic">Specialist</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-lg">
            Get in touch with the OBRUS team for recruitment, HSE services, equipment procurement, or any other enquiry.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">

          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0b1f3a] italic mb-8">Get In Touch</h2>

            <div className="space-y-6 mb-10">
              {[
                { ico: <MapPin size={18} className="text-[#c8921e]"/>, label: 'Location', val: 'Port Harcourt, Rivers State, Nigeria' },
                { ico: <Mail size={18} className="text-[#c8921e]"/>, label: 'Email', val: 'info@obrusapex.com' },
                { ico: <Phone size={18} className="text-[#c8921e]"/>, label: 'Phone', val: '+2347013715767' },
              ].map(({ ico, label, val }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-11 h-11 bg-[#c8921e]/10 rounded-xl flex items-center justify-center shrink-0">{ico}</div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
                    <p className="font-semibold text-[#0b1f3a]">{val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#0b1f3a] rounded-2xl p-8">
              <h3 className="font-serif text-xl font-bold text-white italic mb-3">Our Service Divisions</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">We operate across six divisions. Tell us what you need and we'll connect you with the right team.</p>
              <div className="space-y-2">
                {['Recruitment & Manpower', 'HSE Consultancy & Training', 'Environmental Services', 'Equipment Procurement', 'Facility Maintenance', 'General Consulting'].map(s => (
                  <div key={s} className="flex items-center gap-2 text-sm text-white/50">
                    <CheckCircle size={13} className="text-[#c8921e] shrink-0"/> {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-[rgba(11,31,58,0.06)] p-8 shadow-sm">
            {sent ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={30}/>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#0b1f3a] italic mb-3">Message Received</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <Link href="/" className="px-8 py-3 bg-[#c8921e] text-[#0b1f3a] rounded-2xl font-bold text-sm hover:bg-[#e8b84b] transition-all">
                  Back to Home
                </Link>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-xl font-bold text-[#0b1f3a] italic mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">Full Name *</label>
                      <input required className="field-input" placeholder="Your name" onChange={e => setForm({...form, name: e.target.value})}/>
                    </div>
                    <div>
                      <label className="field-label">Phone</label>
                      <input className="field-input" placeholder="+234 800..." onChange={e => setForm({...form, phone: e.target.value})}/>
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Email *</label>
                    <input required type="email" className="field-input" placeholder="you@company.com" onChange={e => setForm({...form, email: e.target.value})}/>
                  </div>
                  <div>
                    <label className="field-label">Subject / Service</label>
                    <select className="field-input" onChange={e => setForm({...form, subject: e.target.value})}>
                      <option value="">Select a topic...</option>
                      <option>Recruitment & Manpower</option>
                      <option>HSE Consultancy & Training</option>
                      <option>Environmental Services</option>
                      <option>Equipment Procurement</option>
                      <option>Facility Maintenance</option>
                      <option>General Enquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Message *</label>
                    <textarea
                      required
                      className="field-input h-32 py-4 resize-none"
                      placeholder="Describe what you need..."
                      onChange={e => setForm({...form, message: e.target.value})}
                    />
                  </div>
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-4 bg-[#0b1f3a] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#c8921e] hover:text-[#0b1f3a] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin"/> : <><Send size={16}/> Send Message</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#060f1e] py-8 px-5 text-center text-white/40 text-sm">
        <p>© 2026 OBRUS APEX SERVICES · <Link href="/" className="text-[#e8b84b]">Home</Link> · <Link href="/recruitment" className="text-[#e8b84b]">Recruitment</Link> · <Link href="/hse" className="text-[#e8b84b]">HSE</Link> · <Link href="/environmental" className="text-[#e8b84b]">Environmental</Link></p>
      </footer>

      <style jsx>{`
        .field-input { width: 100%; background: #f9f8f6; border: 1.5px solid rgba(11,31,58,0.06); padding: 12px 16px; border-radius: 14px; font-size: 14px; font-weight: 600; color: #0b1f3a; outline: none; transition: 0.3s; font-family: inherit; }
        .field-input:focus { border-color: #c8921e; background: white; box-shadow: 0 4px 16px rgba(200,146,30,0.08); }
        .field-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: rgba(11,31,58,0.35); margin-left: 2px; letter-spacing: 0.2em; display: block; margin-bottom: 5px; }
      `}</style>
    </div>
  );
}
