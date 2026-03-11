"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, ShieldCheck, Briefcase, 
  Star, Lightbulb, PhoneCall, CheckCircle2 
} from 'lucide-react';

export default function LandingPage() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div className="min-h-screen bg-cream font-sans text-navy">
      {showPopup && (
        <div className="fixed inset-0 bg-navy-deep/95 z-[9999] flex items-center justify-center backdrop-blur-md p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-12 text-center shadow-2xl scale-in-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-navy rounded flex items-center justify-center font-serif text-white font-bold text-2xl">O</div>
              <div className="text-left">
                <span className="block font-serif text-2xl font-bold leading-none">OBRUS</span>
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Apex Services</span>
              </div>
            </div>
            <h2 className="font-serif text-3xl font-bold mb-4 text-navy">Welcome to OBRUS</h2>
            <p className="text-slate text-sm leading-relaxed mb-8">
              Your trusted partner for Recruitment & Manpower, Environmental Services, Health & Facility Equipment Procurement, HSE Consultancy, and Facility Management across Nigeria.
            </p>
            <button 
              onClick={() => setShowPopup(false)}
              className="bg-navy text-white px-10 py-3 rounded-full font-bold hover:bg-gold hover:text-navy transition-all duration-300"
            >
              Enter Website →
            </button>
          </div>
        </div>
      )}

      <section className="relative min-h-screen flex items-center px-[5%] py-24 bg-gradient-to-br from-navy-deep via-navy to-navy-mid overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] hero-grid"></div>
        <div className="absolute w-[580px] h-[580px] bg-gold/10 rounded-full blur-[120px] -top-32 -right-20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-4 py-1.5 rounded-full text-gold-lt text-[11px] uppercase tracking-widest font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-lt animate-pulse" />
              Port Harcourt, Nigeria · Est. 2024
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-white font-bold leading-[1.1] mb-6">
              Integrated Services. <br />
              <span className="text-gold-lt italic font-medium">Exceptional Standards.</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
              OBRUS Apex Services delivers recruitment, environmental management, and technical consultancy built on integrity and accountability.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/recruitment" className="bg-gradient-to-r from-gold to-gold-lt text-navy px-8 py-3.5 rounded-full font-bold text-sm hover:-translate-y-1 transition-all shadow-lg shadow-gold/20">
                🧑‍💼 Recruitment
              </Link>
              <Link href="/environmental" className="border border-white/20 text-white px-8 py-3.5 rounded-full font-medium text-sm hover:border-gold-lt hover:text-gold-lt transition-all">
                🌿 Environmental
              </Link>
            </div>
            <div className="flex gap-8 border-l-2 border-gold/30 pl-8">
              <div>
                <div className="font-serif text-3xl text-white font-bold">400+</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest">Placements</div>
              </div>
              <div className="ml-8">
                <div className="font-serif text-3xl text-white font-bold">150+</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest">Clients</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex relative justify-center items-center h-[500px]">
             <div className="absolute w-80 h-80 rounded-full border border-gold/10 animate-spin-slow"></div>
             <div className="absolute w-[450px] h-[450px] rounded-full border border-dashed border-gold/5 animate-spin-reverse"></div>
             <div className="relative bg-navy p-12 rounded-3xl border border-gold/20 shadow-2xl">
                <div className="w-32 h-32 text-gold-lt opacity-80">
                  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="100,8 186,54 186,146 100,192 14,146 14,54" fill="currentColor" stroke="#c8921e" strokeWidth="2"/>
                  </svg>
                </div>
             </div>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-gold to-gold-lt py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-navy font-bold">
          <div><div className="font-serif text-4xl">400+</div><div className="text-[10px] uppercase tracking-widest opacity-60">Staff Placed</div></div>
          <div><div className="font-serif text-4xl">250+</div><div className="text-[10px] uppercase tracking-widest opacity-60">Env. Services</div></div>
          <div><div className="font-serif text-4xl">150+</div><div className="text-[10px] uppercase tracking-widest opacity-60">Clients Served</div></div>
          <div><div className="font-serif text-4xl">06</div><div className="text-[10px] uppercase tracking-widest opacity-60">Service Divisions</div></div>
        </div>
      </div>

      <section className="py-24 px-[5%] max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-gold text-[11px] font-bold tracking-[0.2em] uppercase mb-2">Excellence in Service</div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold">Six Divisions of Integrated Service</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              t: "Recruitment & Manpower", 
              d: "Connecting businesses with skilled professionals who drive productivity, efficiency, and operational success. We deliver reliable manpower solutions tailored to your industry needs.", 
              i: "🧑‍💼", b: "border-gold", bg: "bg-gold/10" 
            },
            { 
              t: "Environmental Services", 
              d: "Helping organizations meet environmental regulations while implementing sustainable practices that protect people, operations, and the environment.", 
              i: "🌿", b: "border-green", bg: "bg-green/10" 
            },
            { 
              t: "Equipment Procurement", 
              d: "Sourcing and supplying high-quality equipment and materials from trusted vendors to support safe, efficient, and cost-effective operations.", 
              i: "🏥", b: "border-gold", bg: "bg-gold/10" 
            },
            { 
              t: "HSE Consultancy", 
              d: "Providing expert Health, Safety, and Environmental (HSE) advisory services to help organizations maintain safe workplaces, meet regulatory standards, and reduce operational risks.", 
              i: "🛡️", b: "border-navy", bg: "bg-navy/10" 
            },
            { 
              t: "Facility Maintenance", 
              d: "Comprehensive facility maintenance solutions designed to keep buildings, equipment, and operational environments running efficiently, safely, and without disruption.", 
              i: "🔧", b: "border-gold", bg: "bg-gold/10" 
            },
            { 
              t: "General Consulting", 
              d: "Strategic consulting services that support businesses in improving operations, solving complex challenges, and achieving sustainable growth.", 
              i: "💡", b: "border-navy", bg: "bg-navy/10" 
            }
          ].map((svc, i) => (
            <div key={i} className={`bg-white p-10 rounded-2xl border-t-4 ${svc.b} shadow-sm transition-all duration-300 hover:shadow-xl group`}>
              <div className={`w-14 h-14 ${svc.bg} rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>{svc.i}</div>
              <h3 className="font-serif text-2xl font-bold mb-3">{svc.t}</h3>
              <p className="text-slate text-[14px] leading-relaxed mb-6 font-medium">{svc.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy-deep py-24 px-[5%] text-white relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="text-gold text-[11px] font-bold tracking-[0.2em] uppercase mb-4">Why OBRUS</div>
            <h2 className="font-serif text-4xl text-white font-bold mb-8">Built on Trust. Delivered with Precision.</h2>
            <div className="space-y-6">
              {[
                { n: "01", t: "Certified Professionals", d: "Every operative is verified, certified, and trained before deployment." },
                { n: "02", t: "One Partner, Six Divisions", d: "Manage your workforce and facility needs through one accountable partner." },
                { n: "03", t: "24-48hr Response", d: "Emergency and priority services handled within one to two business days." }
              ].map((point, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="w-10 h-10 shrink-0 bg-gold text-navy font-bold rounded flex items-center justify-center">{point.n}</div>
                  <div>
                    <h4 className="font-bold mb-1 text-[15px]">{point.t}</h4>
                    <p className="text-white/40 text-[13px]">{point.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block h-96 bg-white/5 border border-gold/10 rounded-3xl backdrop-blur-sm p-12">
              <div className="h-full border border-dashed border-gold/20 flex items-center justify-center text-gold/20 italic font-serif text-2xl">Excellence and Integrity</div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-24 px-[5%] text-center">
        <h2 className="font-serif text-4xl text-white font-bold mb-10 italic">Ready to experience integrated excellence?</h2>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/recruitment" className="bg-gold text-navy px-10 py-4 rounded-full font-bold text-sm hover:bg-gold-lt transition-colors">Request Staffing</Link>
          <Link href="/contact" className="border border-white/30 text-white px-10 py-4 rounded-full font-bold text-sm hover:border-gold transition-colors">Book a Service</Link>
        </div>
      </section>
    </div>
  );
}