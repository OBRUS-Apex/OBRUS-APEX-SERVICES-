"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import { useRouter } from 'next/navigation';

export default function EquipmentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('ppe');

  return (
    <div className="min-h-screen bg-[#f5f0e8] font-sans overflow-x-hidden">

      {/* NAV */}
      <PublicNav active="/equipment" />

      {/* HERO */}
      <section className="pt-36 pb-20 px-6 bg-gradient-to-br from-[#060f1e] via-[#0a1520] to-[#060f1e] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(200,146,30,0.1),transparent_68%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex gap-2 text-sm text-white/40 mb-4">
            <Link href="/" className="text-[#e8b84b]">Home</Link>
            <span>›</span><span>Equipment & Procurement</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-[rgba(200,146,30,0.12)] border border-[rgba(200,146,30,0.25)] rounded-full px-4 py-1.5 text-xs text-[#e8b84b] uppercase tracking-widest mb-4">⚙️ Equipment Division</div>
          <h1 className="font-serif text-5xl font-bold text-white leading-tight mb-4">Health/Facility Equipment,<br/><span className="text-[#e8b84b]">Supply & Procurement</span></h1>
          <p className="text-white/50 text-base leading-relaxed max-w-xl mb-6">Certified supply and procurement of PPE, safety equipment, and facility materials — sourced from verified manufacturers and delivered to your site.</p>
          <div className="flex flex-wrap gap-2">
            {['🦺 PPE Supply', '🔥 Fire Safety', '🏗️ Facility Equipment', '📦 Custom Procurement'].map(s => (
              <span key={s} className="bg-[rgba(200,146,30,0.1)] border border-[rgba(200,146,30,0.2)] rounded-full px-4 py-1.5 text-sm text-white/70">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* TAB NAV */}
      <div className="bg-white border-b-2 border-[#eceae4] sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 flex overflow-x-auto">
          {[['ppe', '🦺 PPE'], ['safety', '🔥 Safety Equipment'], ['facility', '🏗️ Facility Equipment'], ['quote', '📦 Request Quote']].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-[3px] transition-all ${activeTab === id ? 'text-[#c8921e] border-[#c8921e] font-semibold' : 'text-[#8494aa] border-transparent hover:text-[#0b1f3a]'}`}>{label}</button>
          ))}
        </div>
      </div>

      {/* PPE */}
      {activeTab === 'ppe' && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-[#c8921e] uppercase mb-2">Category 01 · PPE</p>
            <h2 className="font-serif text-4xl font-bold text-[#0b1f3a] mb-4">Personal Protective Equipment</h2>
            <p className="text-[#8494aa] mb-10 leading-relaxed max-w-lg">Complete range of certified PPE supplied to oil & gas, construction, healthcare, and industrial clients — compliant with ANSI, EN, and DIN standards.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                ['Head Protection', 'Hard Hats & Helmets', '⛑️'],
                ['Eye & Face', 'Goggles, Visors & Face Shields', '🥽'],
                ['Respiratory', 'Masks & Respirators', '😷'],
                ['Hand Protection', 'Gloves (All Types)', '🧤'],
                ['Body Protection', 'Coveralls, Vests & Workwear', '🦺'],
                ['Foot Protection', 'Safety Boots & Shoes', '👢'],
                ['Hearing', 'Ear Protection', '🎧'],
                ['Fall Protection', 'Harnesses & Lanyards', '🪢'],
              ].map(([label, title, ico]) => (
                <div key={title} className="bg-white p-5 rounded-2xl border border-[rgba(11,31,58,0.08)] hover:border-[rgba(200,146,30,0.3)] hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="text-3xl mb-3">{ico}</div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#c8921e] mb-1">{label}</p>
                  <h3 className="font-serif font-bold text-[#0b1f3a] text-sm leading-snug">{title}</h3>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button onClick={() => setActiveTab('quote')} className="px-10 py-4 bg-gradient-to-r from-[#c8921e] to-[#e8b84b] text-[#0b1f3a] rounded-xl font-bold hover:shadow-lg transition-all">📦 Request PPE Quote →</button>
            </div>
          </div>
        </section>
      )}

      {/* SAFETY EQUIPMENT */}
      {activeTab === 'safety' && (
        <section className="py-20 px-6 bg-[#060f1e]">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-[#e8b84b] uppercase mb-2">Category 02 · Safety Equipment</p>
            <h2 className="font-serif text-4xl font-bold text-white mb-4">Fire & Safety Equipment</h2>
            <p className="text-white/50 mb-10 leading-relaxed max-w-lg">Certified fire safety, detection, and emergency response equipment — supplied, installed, and maintained for industrial and commercial clients.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                ['Fire Safety', 'Fire Extinguishers', '🧯'],
                ['Detection', 'Fire & Gas Detection', '🔍'],
                ['First Aid', 'First Aid Kits & Supplies', '🏥'],
                ['Emergency Response', 'AEDs & Resuscitation', '❤️'],
                ['Spill Response', 'Spill Kits & Eyewash', '💧'],
                ['Signage & Barriers', 'Safety Signs & Barriers', '⚠️'],
                ['Energy Control', 'Lockout / Tagout (LOTO)', '🔒'],
                ['Monitoring', 'Safety Monitoring Instruments', '📊'],
              ].map(([label, title, ico]) => (
                <div key={title} className="bg-white/[0.04] border border-white/[0.08] p-5 rounded-2xl hover:bg-white/[0.08] hover:-translate-y-1 transition-all">
                  <div className="text-3xl mb-3">{ico}</div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#e8b84b] mb-1">{label}</p>
                  <h3 className="font-serif font-bold text-white text-sm leading-snug">{title}</h3>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button onClick={() => setActiveTab('quote')} className="px-10 py-4 bg-gradient-to-r from-[#c8921e] to-[#e8b84b] text-[#0b1f3a] rounded-xl font-bold hover:shadow-lg transition-all">📦 Request Safety Equipment Quote →</button>
            </div>
          </div>
        </section>
      )}

      {/* FACILITY EQUIPMENT */}
      {activeTab === 'facility' && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-[#c8921e] uppercase mb-2">Category 03 · Facility</p>
            <h2 className="font-serif text-4xl font-bold text-[#0b1f3a] mb-4">Facility Equipment & Materials</h2>
            <p className="text-[#8494aa] mb-10 leading-relaxed max-w-lg">End-to-end procurement of facility management materials — from electrical to HVAC, sourced from verified suppliers and delivered on schedule.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {[
                ['Electrical', 'Electrical Equipment & Materials', '⚡'],
                ['Plumbing', 'Plumbing Materials & Fixtures', '🔧'],
                ['HVAC', 'Air Conditioning & Ventilation', '❄️'],
                ['Lighting', 'Lighting & Electrical Fixtures', '💡'],
                ['Structure', 'Building & Facility Infrastructure', '🏗️'],
                ['Janitorial', 'Cleaning & Sanitation Equipment', '🧹'],
              ].map(([label, title, ico]) => (
                <div key={title} className="bg-white p-6 rounded-2xl border border-[rgba(11,31,58,0.08)] hover:border-[rgba(200,146,30,0.3)] hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="text-3xl mb-3">{ico}</div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#c8921e] mb-1">{label}</p>
                  <h3 className="font-serif font-bold text-[#0b1f3a] leading-snug">{title}</h3>
                </div>
              ))}
            </div>

            {/* Procurement process */}
            <p className="text-xs font-semibold tracking-widest text-[#c8921e] uppercase mb-8 text-center">How Our Procurement Works</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[['1', 'Submit Request', 'Specify items, quantities, and delivery timeline via the portal'], ['2', 'Quote & Source', 'We source from verified suppliers and send a detailed quote within 48hrs'], ['3', 'Approval & Payment', 'Approve the quote and make payment — proforma invoice issued'], ['4', 'Delivery', 'Items delivered to your site with full documentation and certifications']].map(([num, title, desc]) => (
                <div key={num} className="text-center p-6 bg-white rounded-2xl border border-[rgba(11,31,58,0.08)]">
                  <div className="w-12 h-12 rounded-full bg-[#0b1f3a] border-2 border-[#c8921e] text-white flex items-center justify-center font-serif text-lg font-bold mx-auto mb-3">{num}</div>
                  <h4 className="font-semibold text-[#0b1f3a] mb-2 text-sm">{title}</h4>
                  <p className="text-xs text-[#8494aa] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button onClick={() => setActiveTab('quote')} className="px-10 py-4 bg-gradient-to-r from-[#c8921e] to-[#e8b84b] text-[#0b1f3a] rounded-xl font-bold hover:shadow-lg transition-all">📦 Request Facility Equipment Quote →</button>
            </div>
          </div>
        </section>
      )}

      {/* QUOTE FORM */}
      {activeTab === 'quote' && (
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-[#c8921e] uppercase mb-2">Procurement</p>
            <h2 className="font-serif text-4xl font-bold text-[#0b1f3a] mb-2">Request a Procurement Quote</h2>
            <p className="text-[#8494aa] mb-10">Tell us what you need — we'll source it and respond within 48 hours.</p>
            <div className="bg-white rounded-2xl p-10 border border-[rgba(11,31,58,0.08)] shadow-md space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className="bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Full Name *" />
                <input className="bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Phone *" />
              </div>
              <input className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Email *" />
              <input className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Organisation / Company" />
              <select className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]">
                <option>PPE Supply</option>
                <option>Fire & Safety Equipment</option>
                <option>Facility / Electrical Materials</option>
                <option>Mixed Procurement</option>
                <option>Other</option>
              </select>
              <textarea className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e] h-32 resize-none" placeholder="List the items, quantities, and any specs. The more detail the faster we can quote…" />
              <input className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Delivery location *" />
              <button onClick={() => router.push('/client/portal')} className="w-full py-4 bg-gradient-to-r from-[#c8921e] to-[#e8b84b] text-[#0b1f3a] rounded-xl font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all">Submit Quote Request — Continue in Portal →</button>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-[#060f1e] py-8 px-6 text-center text-white/40 text-sm">
        <p>© 2025 OBRUS APEX SERVICES · <Link href="/" className="text-[#e8b84b]">Home</Link> · <Link href="/recruitment" className="text-[#e8b84b]">Recruitment</Link> · <Link href="/environmental" className="text-[#e8b84b]">Environmental</Link> · <Link href="/hse" className="text-[#e8b84b]">HSE</Link></p>
      </footer>
    </div>
  );
}
