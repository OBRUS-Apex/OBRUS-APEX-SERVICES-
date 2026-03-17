"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users, ShieldCheck, Briefcase, Star, Lightbulb,
  ArrowRight, Award, Zap, CheckCircle, Menu, X, Phone, Mail
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/recruitment', label: 'Recruitment' },
  { href: '/environmental', label: 'Environmental' },
  { href: '/equipment', label: 'Equipment' },
  { href: '/hse', label: 'HSE' },
];

const SERVICES = [
  {
    t: 'Recruitment & Manpower',
    d: 'Connecting businesses with skilled professionals across all industrial sectors. Reliable manpower solutions tailored to your operational needs.',
    i: '👥', border: 'border-[#c8921e]',
    href: '/recruitment',
  },
  {
    t: 'Environmental Services',
    d: 'Fumigation, waste management, septic tank dislodgement, and janitorial services — fully certified and compliant.',
    i: '🌿', border: 'border-green',
    href: '/environmental',
  },
  {
    t: 'Equipment Procurement',
    d: 'Sourcing and supplying PPE, safety equipment, and facility materials from verified manufacturers and vendors.',
    i: '⚙️', border: 'border-[#0b1f3a]',
    href: '/equipment',
  },
  {
    t: 'HSE Consultancy',
    d: 'Expert Health, Safety, and Environmental advisory — compliance audits, risk assessments, NEBOSH-accredited training.',
    i: '🛡️', border: 'border-[#c8921e]',
    href: '/hse',
  },
  {
    t: 'Facility Maintenance',
    d: 'Comprehensive maintenance solutions keeping buildings, equipment, and operational environments running safely.',
    i: '🏗️', border: 'border-green',
    href: '/environmental',
  },
  {
    t: 'General Consulting',
    d: 'Strategic consulting services supporting businesses in improving operations and solving complex challenges.',
    i: '💡', border: 'border-[#0b1f3a]',
    href: '/hse',
  },
];

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f0e8] font-sans text-[#0b1f3a]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 z-50 bg-[rgba(6,10,20,0.96)] backdrop-blur border-b border-[rgba(200,146,30,0.16)]" style={{ width: '100vw', right: 0 }}>
        <div className="px-5 h-16 flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-[#c8921e] rounded-lg flex items-center justify-center font-black text-[#0b1f3a] text-base italic">O</div>
            <div>
              <span className="block text-white font-bold text-sm leading-none">OBRUS</span>
              <span className="text-[#e8b84b] text-[9px] uppercase tracking-widest">Apex Services</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-[#e8b84b] hover:bg-[rgba(200,146,30,0.1)] transition-all">
                {label}
              </Link>
            ))}
            <Link href="/auth" className="ml-2 px-4 py-1.5 border border-white/20 rounded-lg text-sm text-white/70 hover:text-white hover:border-white/50 transition-all">
              Sign In
            </Link>
            <Link href="/client/portal" className="ml-1 px-4 py-1.5 bg-[#c8921e] rounded-lg text-sm font-bold text-[#0b1f3a] hover:bg-[#e8b84b] transition-all">
              Client Portal
            </Link>
          </div>

          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden p-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all shrink-0">
            {navOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>

        {navOpen && (
          <div className="md:hidden bg-[#060f1e] border-t border-[rgba(200,146,30,0.1)] px-5 pb-5 pt-3 flex flex-col gap-1" style={{ width: '100%' }}>
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setNavOpen(false)} className="block w-full px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all">
                {label}
              </Link>
            ))}
            <div className="flex gap-2 mt-2">
              <Link href="/auth" onClick={() => setNavOpen(false)} className="flex-1 px-4 py-3 border border-white/20 rounded-xl text-sm text-white/70 text-center hover:text-white transition-all">
                Sign In
              </Link>
              <Link href="/client/portal" onClick={() => setNavOpen(false)} className="flex-1 px-4 py-3 bg-[#c8921e] rounded-xl text-sm font-bold text-[#0b1f3a] text-center hover:bg-[#e8b84b] transition-all">
                Client Portal
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center px-5 py-24 bg-[#060f1e] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8921e]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1a7a4a]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 bg-[rgba(200,146,30,0.12)] border border-[rgba(200,146,30,0.25)] rounded-full px-4 py-1.5 text-xs text-[#e8b84b] uppercase tracking-widest mb-6">
            🏆 Port Harcourt, Rivers State
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-white font-bold leading-[1.1] mb-6">
            Apex Services.<br/>
            <span className="text-[#c8921e] italic font-medium">Exceptional Standards.</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
            OBRUS Apex Services delivers excellence across six professional divisions — Recruitment, Environmental, Equipment, HSE, Facility Maintenance, and Consulting.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/auth" className="bg-[#c8921e] hover:bg-[#e8b84b] text-[#060f1e] px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl flex items-center gap-2">
              Access Portal <ArrowRight size={16}/>
            </Link>
            <Link href="/hse" className="border border-white/20 text-white hover:border-[#c8921e] hover:text-[#c8921e] px-8 py-4 rounded-2xl font-bold text-sm transition-all">
              HSE Training
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-16 border-t border-white/5">
            {[
              { n: '400+', l: 'Professionals Placed' },
              { n: '150+', l: 'Corporate Clients' },
              { n: '6', l: 'Service Divisions' },
              { n: '100%', l: 'Safety Record' },
            ].map((stat) => (
              <div key={stat.l} className="text-center">
                <div className="font-serif text-3xl md:text-4xl text-[#c8921e] font-bold mb-1">{stat.n}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 md:py-32 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c8921e] text-xs font-bold tracking-widest uppercase mb-3">What We Do</p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0b1f3a]">Our Service Divisions</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((svc) => (
              <Link
                key={svc.t}
                href={svc.href}
                className={`bg-white p-7 md:p-10 rounded-2xl border-t-4 ${svc.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group block`}
              >
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform">{svc.i}</div>
                <h3 className="font-serif text-xl font-bold text-[#0b1f3a] mb-3 group-hover:text-[#c8921e] transition-colors">{svc.t}</h3>
                <p className="text-[#8494aa] text-sm leading-relaxed">{svc.d}</p>
                <div className="flex items-center gap-2 mt-5 text-xs font-bold text-[#c8921e] opacity-0 group-hover:opacity-100 transition-all">
                  Learn more <ArrowRight size={13}/>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY OBRUS */}
      <section className="bg-[#060f1e] py-20 md:py-32 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-[#c8921e] text-xs font-bold tracking-widest uppercase mb-4">Why Choose Us</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-6">
              Redefining Operational Excellence in West Africa.
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-10">
              Headquartered in Port Harcourt, we provide a unified approach to complex corporate challenges — integrating safety, talent, and facility management.
            </p>
            <div className="space-y-6">
              {[
                { i: <Award className="text-[#c8921e]" size={20}/>, t: 'Industry Certified', d: 'Operating under national and international safety compliance standards.' },
                { i: <Zap className="text-[#c8921e]" size={20}/>, t: 'Fast Turnaround', d: 'Quick deployment for recruitment and equipment procurement via verified networks.' },
                { i: <CheckCircle className="text-[#c8921e]" size={20}/>, t: 'Full Transparency', d: 'Total transparency in contracting, personnel management, and service delivery.' },
              ].map((pt) => (
                <div key={pt.t} className="flex gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">{pt.i}</div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{pt.t}</h4>
                    <p className="text-white/30 text-sm">{pt.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0b1f3a] rounded-3xl p-10 md:p-14 border border-white/5 shadow-2xl">
            <div className="w-14 h-14 bg-gradient-to-br from-[#c8921e] to-[#e8b84b] rounded-2xl flex items-center justify-center mb-8 shadow-xl">
              <Star className="text-[#060f1e] fill-current" size={28}/>
            </div>
            <h3 className="font-serif text-white text-2xl md:text-3xl font-bold italic mb-4">The OBRUS Promise</h3>
            <p className="text-white/30 leading-relaxed mb-8">
              "We provide not just staff and supplies, but the peace of mind required to focus on your core growth."
            </p>
            <div className="space-y-3">
              {['HSE Training & Certification', 'Vetted Candidate Matching', 'Environmental Compliance', 'Equipment Supply Chain'].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/50">
                  <CheckCircle size={14} className="text-[#c8921e] shrink-0"/>
                  {item}
                </div>
              ))}
            </div>
            <Link href="/auth" className="mt-10 w-full block text-center py-4 bg-[#c8921e] text-[#0b1f3a] rounded-2xl font-bold text-sm hover:bg-[#e8b84b] transition-all">
              Get Started Today →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 px-5 bg-[#f5f0e8]">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#060f1e] to-[#0b1f3a] rounded-3xl p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c8921e]/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="font-serif text-3xl md:text-5xl text-white font-bold italic mb-6 relative z-10">
            Start Your Partnership.
          </h2>
          <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto mb-10 relative z-10">
            Join dozens of industrial leaders who trust OBRUS for manpower, compliance, and environmental services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link href="/auth" className="bg-[#c8921e] text-[#060f1e] px-10 py-4 rounded-2xl font-bold hover:bg-[#e8b84b] transition-all">
              Access Client Portal
            </Link>
            <Link href="/hse" className="border border-white/20 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/5 transition-all">
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#060f1e] py-12 px-5 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-[#c8921e] rounded-xl flex items-center justify-center font-black text-[#0b1f3a] text-lg italic">O</div>
                <div>
                  <span className="block text-white font-bold text-sm">OBRUS</span>
                  <span className="text-[#e8b84b] text-[9px] uppercase tracking-widest opacity-60">Apex Services</span>
                </div>
              </div>
              <p className="text-white/30 text-xs leading-relaxed">Delivering excellence across six industrial service divisions from Port Harcourt, Nigeria.</p>
            </div>

            <div>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-4">Services</p>
              <div className="space-y-2">
                {[['Recruitment', '/recruitment'], ['Environmental', '/environmental'], ['Equipment', '/equipment'], ['HSE', '/hse']].map(([label, href]) => (
                  <Link key={href} href={href} className="block text-white/30 text-sm hover:text-[#c8921e] transition-all">{label}</Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-4">Portal</p>
              <div className="space-y-2">
                {[['Client Portal', '/client/portal'], ['Employer Portal', '/portal/employer'], ['Sign In', '/auth'], ['Recruitment', '/recruitment']].map(([label, href]) => (
                  <Link key={href} href={href} className="block text-white/30 text-sm hover:text-[#c8921e] transition-all">{label}</Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-4">Contact</p>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-white/30 text-sm">
                  <Phone size={13} className="text-[#c8921e] mt-0.5 shrink-0"/>
                  <span>Port Harcourt, Rivers State</span>
                </div>
                <div className="flex items-start gap-2 text-white/30 text-sm">
                  <Mail size={13} className="text-[#c8921e] mt-0.5 shrink-0"/>
                  <span>info@obrusapex.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/20 text-xs">© 2025 OBRUS Apex Integrated Services Ltd. All rights reserved.</p>
            <div className="flex gap-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="text-white/20 text-xs hover:text-[#c8921e] transition-all">{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
