"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import { useRouter } from 'next/navigation';

export default function HsePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('consultancy');

  return (
    <div className="min-h-screen bg-[#f5f0e8] font-sans">

      {/* NAV */}
      <PublicNav active="/environmental" />
      {/* HERO */}
      <section className="pt-36 pb-20 px-6 bg-gradient-to-br from-[#060f1e] via-[#0b1a0c] to-[#1a1000] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(200,146,30,0.12),transparent_68%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex gap-2 text-sm text-white/40 mb-4">
            <Link href="/" className="text-[#e8b84b]">Home</Link>
            <span>›</span><span>HSE Services</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-[rgba(200,146,30,0.12)] border border-[rgba(200,146,30,0.25)] rounded-full px-4 py-1.5 text-xs text-[#e8b84b] uppercase tracking-widest mb-4">🛡️ HSE Division</div>
          <h1 className="font-serif text-5xl font-bold text-white leading-tight mb-4">HSE Consultancy<br/><span className="text-[#e8b84b]">& Training</span></h1>
          <p className="text-white/50 text-base leading-relaxed max-w-xl mb-6">Expert health, safety, and environmental services — from compliance audits to NEBOSH-accredited training, delivered by certified OBRUS professionals.</p>
          <div className="flex flex-wrap gap-2">
            {['📋 HSE Compliance Audits', '⚠️ Risk Assessment', '🛡️ NEBOSH Training', '🚨 Emergency Response Planning'].map(s => (
              <span key={s} className="bg-[rgba(200,146,30,0.1)] border border-[rgba(200,146,30,0.2)] rounded-full px-4 py-1.5 text-sm text-white/70">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* TAB NAV */}
      <div className="bg-white border-b-2 border-[#eceae4] sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 flex">
          {[['consultancy', '📋 Consultancy'], ['training', '🎓 Training Programmes'], ['environmental', '🌍 Environmental Services']].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-[3px] transition-all ${activeTab === id ? 'text-[#c8921e] border-[#c8921e] font-semibold' : 'text-[#8494aa] border-transparent hover:text-[#0b1f3a]'}`}>{label}</button>
          ))}
        </div>
      </div>

      {/* CONSULTANCY */}
      {activeTab === 'consultancy' && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#c8921e] uppercase mb-2">Consultancy Services</p>
              <h2 className="font-serif text-4xl font-bold text-[#0b1f3a] mb-4">HSE Advisory & Compliance</h2>
              <p className="text-[#8494aa] mb-8 leading-relaxed">Comprehensive workplace safety and environmental compliance services tailored to industrial, construction, and commercial clients across Nigeria.</p>
              <div className="grid gap-4">
                {[
                  ['📋', 'HSE Compliance Audits', 'Comprehensive workplace safety audits against OSHA, NESREA, DPR, and international HSE standards with detailed gap analysis reports.'],
                  ['⚠️', 'Risk Assessment & HAZOP', 'Formal hazard identification, risk assessments, and HAZOP studies for industrial facilities, construction sites, and commercial premises.'],
                  ['📄', 'HSE Policy Development', 'Development and review of HSE management systems, safety policies, emergency response plans, and procedural documentation.'],
                  ['🏭', 'Site Safety Management', 'Dedicated site HSE officer provision, toolbox talks, permit-to-work systems, and ongoing safety monitoring for active sites.'],
                  ['🌍', 'Environmental Impact Assessment', 'Environmental baseline studies, EIA reporting, pollution monitoring, and environmental management plan development.'],
                  ['🚨', 'Emergency Response Planning', 'Development of site emergency response plans, evacuation procedures, muster point setup, and emergency drill facilitation.'],
                ].map(([ico, title, desc]) => (
                  <div key={title} className="flex gap-4 p-4 bg-white rounded-2xl border border-[rgba(11,31,58,0.08)] hover:border-[rgba(200,146,30,0.3)] hover:shadow-md transition-all">
                    <span className="text-2xl mt-0.5">{ico}</span>
                    <div><h4 className="font-semibold text-[#0b1f3a] mb-1">{title}</h4><p className="text-sm text-[#8494aa] leading-relaxed">{desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            {/* Enquiry Form */}
            <div className="bg-white rounded-2xl p-8 border border-[rgba(11,31,58,0.08)] shadow-md sticky top-32">
              <h3 className="font-serif text-2xl font-bold text-[#0b1f3a] mb-1">Training / Consultancy Enquiry</h3>
              <p className="text-[#8494aa] text-sm mb-6">Submit your enquiry — we'll respond within 24 hours</p>
              <div className="space-y-3 mb-4">
                <input className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Full Name *" />
                <input className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Phone *" />
                <input className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Email *" />
                <input className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Organisation" />
                <select className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]">
                  <option>HSE Compliance Audit</option>
                  <option>Risk Assessment / HAZOP</option>
                  <option>HSE Policy Development</option>
                  <option>Site Safety Management</option>
                  <option>EIA / Environmental Services</option>
                  <option>Emergency Response Planning</option>
                  <option>HSE Training</option>
                </select>
                <textarea className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e] h-24 resize-none" placeholder="Describe your requirements…" />
              </div>
              <button onClick={() => router.push('/client/portal')} className="w-full py-4 bg-gradient-to-r from-[#c8921e] to-[#e8b84b] text-[#0b1f3a] rounded-xl font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all">Submit Enquiry — Continue in Portal →</button>
            </div>
          </div>
        </section>
      )}

      {/* TRAINING */}
      {activeTab === 'training' && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#c8921e] uppercase mb-2">Training Programmes</p>
              <h2 className="font-serif text-4xl font-bold text-[#0b1f3a] mb-4">Accredited HSE Training Courses</h2>
              <p className="text-[#8494aa] mb-8 leading-relaxed">Industry-recognised HSE training programmes delivered by certified instructors — available in-house, on-site, or via open enrolment.</p>
              <div className="space-y-4">
                {[
                  ['🛡️', 'NEBOSH International General Certificate', 'Accredited', 'The globally recognised qualification covering principles of health, safety, and risk management. Ideal for safety officers and managers.', '10 weeks', 'In-house or open'],
                  ['🔥', 'Fire Safety & Prevention', 'Certified', 'Practical fire risk assessment, prevention measures, and emergency evacuation procedures for workplace safety teams.', '2 days', 'On-site'],
                  ['🤝', 'First Aid at Work', 'Certified', 'HSE-compliant first aid training covering CPR, casualty management, and workplace emergency response for designated first aiders.', '3 days', 'On-site or open'],
                  ['⛽', 'Permit to Work Systems', 'Certified', 'Comprehensive training on hot work, confined space, electrical, and height-work permit-to-work procedures for industrial environments.', '1 day', 'In-house'],
                  ['🦺', 'Manual Handling & PPE Usage', 'Certified', 'Correct use of personal protective equipment and safe manual handling techniques to reduce workplace injuries.', '1 day', 'On-site'],
                ].map(([ico, title, badge, desc, duration, mode]) => (
                  <div key={title} className="flex gap-4 p-5 bg-white rounded-2xl border border-[rgba(11,31,58,0.08)] hover:border-[rgba(200,146,30,0.3)] hover:shadow-md transition-all">
                    <span className="text-2xl mt-1">{ico}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-semibold text-[#0b1f3a]">{title}</h4>
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-[rgba(200,146,30,0.12)] text-[#c8921e] px-2 py-0.5 rounded-full">{badge}</span>
                      </div>
                      <p className="text-sm text-[#8494aa] leading-relaxed mb-2">{desc}</p>
                      <div className="flex gap-4 text-xs font-medium text-[#8494aa]">
                        <span>⏱ {duration}</span>
                        <span>📍 {mode}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-[rgba(11,31,58,0.08)] shadow-md sticky top-32">
              <h3 className="font-serif text-2xl font-bold text-[#0b1f3a] mb-1">Enrol / Book Training</h3>
              <p className="text-[#8494aa] text-sm mb-6">Tell us which course and we'll send you a full proposal</p>
              <div className="space-y-3 mb-4">
                <input className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Full Name *" />
                <input className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Phone *" />
                <input className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Email *" />
                <input className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Organisation" />
                <select className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]">
                  <option>NEBOSH International General Certificate</option>
                  <option>Fire Safety & Prevention</option>
                  <option>First Aid at Work</option>
                  <option>Permit to Work Systems</option>
                  <option>Manual Handling & PPE Usage</option>
                  <option>Other / Custom Training</option>
                </select>
                <input type="number" className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e]" placeholder="Number of Participants" />
                <textarea className="w-full bg-[#f5f0e8] border border-[rgba(11,31,58,0.1)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8921e] h-20 resize-none" placeholder="Preferred dates or additional notes…" />
              </div>
              <button onClick={() => router.push('/client/portal')} className="w-full py-4 bg-gradient-to-r from-[#c8921e] to-[#e8b84b] text-[#0b1f3a] rounded-xl font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all">Book Training — Continue in Portal →</button>
            </div>
          </div>
        </section>
      )}

      {/* ENVIRONMENTAL SERVICES */}
      {activeTab === 'environmental' && (
        <section className="py-20 px-6 bg-[#060f1e]">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-semibold tracking-widest text-[#e8b84b] uppercase mb-2">Also In This Division</p>
            <h2 className="font-serif text-4xl font-bold text-white mb-4">Environmental & Sanitation Services</h2>
            <p className="text-white/50 mb-10 leading-relaxed max-w-xl">Our HSE division works alongside our Environmental division to offer a complete health, safety, and environmental solution.</p>
            <div className="grid md:grid-cols-3 gap-5 mb-10">
              {[
                ['🌍', 'Environmental Cleaning', 'Large-scale environmental cleaning operations for communities, industrial sites, and post-disaster environments.'],
                ['🧼', 'Sanitation Exercises', 'Community and institutional sanitation drives, including drainage clearing, surface disinfection, and waste removal programmes.'],
                ['💧', 'Hygiene Management', 'Workplace and institutional hygiene assessment, programme design, and ongoing management to maintain compliant environments.'],
              ].map(([ico, title, desc]) => (
                <div key={title} className="bg-white/[0.04] border border-white/[0.08] p-6 rounded-2xl">
                  <div className="text-3xl mb-4">{ico}</div>
                  <h3 className="font-serif font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/environmental" className="inline-block px-10 py-4 bg-gradient-to-r from-[#c8921e] to-[#e8b84b] text-[#0b1f3a] rounded-xl font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all">View Full Environmental Division →</Link>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-[#060f1e] py-8 px-6 text-center text-white/40 text-sm">
        <p>© 2025 OBRUS APEX SERVICES · <Link href="/" className="text-[#e8b84b]">Home</Link> · <Link href="/recruitment" className="text-[#e8b84b]">Recruitment</Link> · <Link href="/environmental" className="text-[#e8b84b]">Environmental</Link> · <Link href="/equipment" className="text-[#e8b84b]">Equipment</Link></p>
      </footer>
    </div>
  );
}
