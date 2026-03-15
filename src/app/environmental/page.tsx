"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EnvironmentalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('fumigation');

  const tabs = [
    { id: 'fumigation', label: '🧪 Fumigation' },
    { id: 'waste', label: '♻️ Waste Management' },
    { id: 'septic', label: '🚿 Septic Tank' },
    { id: 'cleaning', label: '🧹 Cleaning & Janitorial' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f0e8] font-sans">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(6,10,20,0.96)] backdrop-blur border-b border-[rgba(200,146,30,0.16)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c8921e] rounded flex items-center justify-center font-black text-[#0b1f3a] text-lg italic">O</div>
            <div>
              <span className="block text-white font-bold text-sm leading-none">OBRUS</span>
              <span className="text-[#e8b84b] text-[9px] uppercase tracking-widest">Apex Services</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {[['/', 'Home'], ['/recruitment', 'Recruitment'], ['/environmental', 'Environmental'], ['/equipment', 'Equipment'], ['/hse', 'HSE']].map(([href, label]) => (
              <Link key={href} href={href} className={`px-3 py-1.5 rounded text-sm transition-all ${href === '/environmental' ? 'bg-[rgba(200,146,30,0.15)] text-[#e8b84b]' : 'text-white/60 hover:text-[#e8b84b] hover:bg-[rgba(200,146,30,0.1)]'}`}>{label}</Link>
            ))}
            <Link href="/auth" className="ml-2 px-4 py-1.5 border border-white/20 rounded text-sm text-white/70 hover:text-white transition-all">Login</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-20 px-6 bg-gradient-to-br from-[#060f1e] via-[#071a0c] to-[#0b2014] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(26,122,74,0.18),transparent_68%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex gap-2 text-sm text-white/40 mb-4">
            <Link href="/" className="text-[#e8b84b]">Home</Link>
            <span>›</span><span>Environmental Services</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-[rgba(26,122,74,0.14)] border border-[rgba(26,122,74,0.28)] rounded-full px-4 py-1.5 text-xs text-green-400 uppercase tracking-widest mb-4">🌿 Environmental Division</div>
          <h1 className="font-serif text-5xl font-bold text-white leading-tight mb-4">Environmental &<br /><span className="text-green-400">Sanitation Services</span></h1>
          <p className="text-white/50 text-base leading-relaxed max-w-xl mb-6">Four integrated environmental management services — professionally delivered by certified OBRUS teams with full documentation and compliance standards.</p>
          <div className="flex flex-wrap gap-2">
            {['🧪 Fumigation & Pest Control', '♻️ Waste Management', '🚿 Septic Tank Dislodgement', '🧹 Cleaning & Janitorial'].map(s => (
              <span key={s} className="bg-[rgba(26,122,74,0.1)] border border-[rgba(26,122,74,0.24)] rounded-full px-4 py-1.5 text-sm text-white/70">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* TAB NAV */}
      <div className="bg-white border-b-2 border-[#eceae4] sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 flex overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-[3px] transition-all ${activeTab === tab.id ? 'text-[#1a7a4a] border-[#1a7a4a] font-semibold' : 'text-[#8494aa] border-transparent hover:text-[#0b1f3a]'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* FUMIGATION */}
      {activeTab === 'fumigation' && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#1a7a4a] uppercase mb-2">Service 01 · Fumigation</p>
              <h2 className="font-serif text-4xl font-bold text-[#0b1f3a] mb-4">Fumigation, Pest &<br/>Rodent Control</h2>
              <p className="text-[#8494aa] mb-8 leading-relaxed">Professional pest management for insects, rodents, and environmental pests — deployed by EPA-certified OBRUS teams using approved, safe formulations.</p>
              <div className="space-y-3">
                {[
                  ['🏢', 'Office & Commercial Spaces', 'Comprehensive fumigation of offices, boardrooms, server rooms, and commercial premises. Cockroach, mosquito, ant, and rodent elimination.'],
                  ['🏠', 'Residential Compounds', 'Perimeter barrier treatment, indoor fumigation, drainage sanitation, and compound pest elimination for homes and estates.'],
                  ['🏭', 'Warehouses & Industrial Sites', 'Industrial-scale pest eradication for storage facilities and production lines — compliant with food-safety and industry protocols.'],
                  ['🏥', 'Health Facilities & Clinics', 'Clinical-grade fumigation and disinfection for hospitals, pharmacies, labs, and health centres — infection-control compliant.'],
                  ['🎓', 'Schools & Institutions', 'Child-safe, non-toxic approved formulations for classrooms, dormitories, and canteens. Safe re-entry within hours.'],
                ].map(([ico, title, desc]) => (
                  <div key={title} className="flex gap-4 p-4 bg-white rounded-2xl border border-[rgba(11,31,58,0.08)] hover:border-[rgba(26,122,74,0.28)] hover:shadow-md transition-all">
                    <span className="text-2xl mt-0.5">{ico}</span>
                    <div><h4 className="font-semibold text-[#0b1f3a] mb-1">{title}</h4><p className="text-sm text-[#8494aa] leading-relaxed">{desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <ServiceCard title="Book Fumigation Service" sub="Submit your request — our team confirms within 24 hours" router={router} />
          </div>
        </section>
      )}

      {/* WASTE MANAGEMENT */}
      {activeTab === 'waste' && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-[#1a7a4a] uppercase mb-2">Service 02 · Waste</p>
            <h2 className="font-serif text-4xl font-bold text-[#0b1f3a] mb-4">Waste Management &<br/>Refuse Evacuation</h2>
            <p className="text-[#8494aa] mb-10 leading-relaxed max-w-lg">Systematic collection, evacuation, and proper disposal of domestic, commercial, and industrial waste — fully compliant with environmental regulations.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {[
                ['🏘️', 'Domestic Waste Collection', 'Regular household refuse collection for residential estates, compounds, and communities. Scheduled or on-demand service.'],
                ['🏬', 'Commercial Refuse Evacuation', 'Bulk waste removal for offices, markets, shopping complexes, and commercial properties with disposal documentation.'],
                ['🏭', 'Industrial Waste Disposal', 'Safe handling and disposal of industrial solid waste and non-hazardous production waste per NESREA standards.'],
                ['🔨', 'Post-Construction Cleanup', 'Complete post-construction waste evacuation including rubble, offcuts, and debris cleared swiftly and safely.'],
                ['🚛', 'Scheduled Waste Contracts', 'Monthly or weekly waste management contracts for organisations and estates requiring consistent reliable service.'],
                ['♻️', 'Recycling & Segregation Advisory', 'Waste segregation and recycling advisory to reduce environmental footprint and meet sustainability targets.'],
              ].map(([ico, title, desc]) => (
                <div key={title} className="bg-white p-6 rounded-2xl border border-[rgba(11,31,58,0.08)] hover:border-[rgba(26,122,74,0.22)] hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="text-3xl mb-4">{ico}</div>
                  <h3 className="font-serif font-bold text-[#0b1f3a] mb-2">{title}</h3>
                  <p className="text-sm text-[#8494aa] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button onClick={() => router.push('/client/portal')} className="px-12 py-4 bg-gradient-to-r from-[#1a7a4a] to-[#28a866] text-white rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all">📞 Request Waste Management Quote →</button>
            </div>
          </div>
        </section>
      )}

      {/* SEPTIC TANK */}
      {activeTab === 'septic' && (
        <section className="py-20 px-6 bg-[#060f1e]">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-[#e8b84b] uppercase mb-2">Service 03 · Septic & Sewage</p>
            <h2 className="font-serif text-4xl font-bold text-white mb-4">Septic Tank Dislodgement<br/>& Sewage Management</h2>
            <p className="text-white/50 mb-10 leading-relaxed max-w-lg">Professional evacuation, dislodgement, and emergency sewage response — rapid deployment, certified equipment, zero contamination guarantee.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
              {[
                ['🚿', 'Septic Tank Evacuation', 'Full pump-out and evacuation of domestic and commercial septic tanks. Licensed disposal at approved treatment facilities.'],
                ['⚠️', 'Emergency Sewage Response', '24-hour emergency dispatch for sewage overflows, blocked drains, and burst septic systems. Rapid containment and clean-up.'],
                ['🏗️', 'Industrial Sewage Management', 'Managed sewage disposal for factories, hospitals, estates, and large facilities with scheduled service agreements.'],
                ['🔍', 'Drainage Inspection & Clearing', 'CCTV inspection, blocked drain clearing, and preventive maintenance to avoid sewage emergencies and structural damage.'],
              ].map(([ico, title, desc]) => (
                <div key={title} className="bg-white/[0.04] border border-white/[0.08] p-6 rounded-2xl">
                  <div className="text-3xl mb-4">{ico}</div>
                  <h3 className="font-serif font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold tracking-widest text-[#e8b84b] uppercase mb-8">Response Process</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-10">
              {[['1', 'Book', 'Request online or call'], ['2', 'Dispatch', 'Team deployed 2–4 hrs'], ['3', 'Assessment', 'Site survey & briefing'], ['4', 'Evacuation', 'Full dislodgement done'], ['5', 'Disposal', 'Certified facility disposal'], ['6', 'Certificate', 'Service cert issued']].map(([num, title, desc]) => (
                <div key={num} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#0b1f3a] border-2 border-[#1a7a4a] text-white flex items-center justify-center font-serif text-xl font-bold mx-auto mb-3">{num}</div>
                  <p className="font-semibold text-white text-sm mb-1">{title}</p>
                  <p className="text-xs text-white/40 leading-snug">{desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button onClick={() => router.push('/client/portal')} className="px-12 py-4 bg-gradient-to-r from-[#1a7a4a] to-[#28a866] text-white rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all">📞 Book Septic Service →</button>
            </div>
          </div>
        </section>
      )}

      {/* CLEANING */}
      {activeTab === 'cleaning' && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-[#1a7a4a] uppercase mb-2">Service 04 · Cleaning</p>
            <h2 className="font-serif text-4xl font-bold text-[#0b1f3a] mb-4">Cleaning & Janitorial Services</h2>
            <p className="text-[#8494aa] mb-10 leading-relaxed max-w-lg">Professional cleaning across offices, residences, industrial sites, and post-construction environments — trained staff, premium equipment, consistent quality.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {[
                ['🏢', 'Office Cleaning', 'Daily, weekly, or contract office cleaning including deep sanitisation of workstations, common areas, and restrooms.'],
                ['🏠', 'Residential Cleaning', 'Comprehensive home cleaning, move-in/move-out deep cleans, and post-event cleaning for homes and apartments.'],
                ['🏭', 'Industrial Cleaning', 'Specialist cleaning of factories, warehouses, and machine floors — compliant with health and safety standards.'],
                ['🔨', 'Post-Construction Cleaning', 'Complete post-build clean-up: dust removal, window cleaning, floor polishing, and final handover preparation.'],
                ['🌊', 'Deep Cleaning', 'Intensive deep cleaning of neglected, contaminated, or post-flood spaces using industrial-grade equipment.'],
                ['📋', 'Cleaning Contracts', 'Managed monthly cleaning contracts for organisations and estates requiring a dedicated on-site cleaning team.'],
              ].map(([ico, title, desc]) => (
                <div key={title} className="bg-white p-6 rounded-2xl border border-[rgba(11,31,58,0.08)] hover:border-[rgba(26,122,74,0.22)] hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="text-3xl mb-4">{ico}</div>
                  <h3 className="font-serif font-bold text-[#0b1f3a] mb-2">{title}</h3>
                  <p className="text-sm text-[#8494aa] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button onClick={() => router.push('/client/portal')} className="px-12 py-4 bg-gradient-to-r from-[#1a7a4a] to-[#28a866] text-white rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all">🧹 Request Cleaning Quote →</button>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-[#060f1e] py-8 px-6 text-center text-white/40 text-sm">
        <p>© 2025 OBRUS APEX SERVICES · <Link href="/" className="text-[#e8b84b]">Home</Link> · <Link href="/recruitment" className="text-[#e8b84b]">Recruitment</Link> · <Link href="/hse" className="text-[#e8b84b]">HSE</Link> · <Link href="/equipment" className="text-[#e8b84b]">Equipment</Link></p>
      </footer>
    </div>
  );
}

function ServiceCard({ title, sub, router }: { title: string; sub: string; router: any }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-[rgba(11,31,58,0.08)] shadow-md">
      <h3 className="font-serif text-2xl font-bold text-[#0b1f3a] mb-1">{title}</h3>
      <p className="text-[#8494aa] text-sm mb-6">{sub}</p>
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <input className="bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a7a4a]" placeholder="Full Name *" />
          <input className="bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a7a4a]" placeholder="Phone *" />
        </div>
        <input className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a7a4a]" placeholder="Email" />
        <input className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a7a4a]" placeholder="Address *" />
        <input type="date" className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a7a4a]" />
        <textarea className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a7a4a] h-24 resize-none" placeholder="Notes or specific requirements…" />
      </div>
      <button onClick={() => router.push('/client/portal')} className="w-full py-4 bg-gradient-to-r from-[#1a7a4a] to-[#28a866] text-white rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all">📅 Book Service — Continue in Portal →</button>
    </div>
  );
}
