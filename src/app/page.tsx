"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, Briefcase, Lightbulb, 
  Star, Crosshair
} from 'lucide-react';

export default function LandingPage() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div className="min-h-screen bg-cream font-sans text-navy overflow-x-hidden">
      {showPopup && (
        <div className="fixed inset-0 bg-navy-deep/95 z-[9999] flex items-center justify-center backdrop-blur-md p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-12 text-center shadow-2xl">
            <h2 className="font-serif text-3xl font-bold mb-4">Welcome to OBRUS</h2>
            <p className="text-slate text-sm mb-8">Your trusted partner for Recruitment, Environmental Services, and more.</p>
            <button onClick={() => setShowPopup(false)} className="btn-primary">Enter Website →</button>
          </div>
        </div>
      )}

      <section className="relative min-h-screen flex items-center px-[5%] py-24 bg-navy-deep hero-grid">
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="font-serif text-5xl md:text-7xl text-white font-bold leading-[1.1] mb-6">
              Integrated Services. <br />
              <span className="text-gold italic font-light">Exceptional Standards.</span>
            </h1>
            <p className="text-white/60 text-lg mb-10 max-w-lg">OBRUS Apex Services delivers excellence across six professional divisions built on integrity and accountability.</p>
            <div className="flex gap-4">
               <button className="btn-primary">View Solutions</button>
            </div>
          </div>
          <div className="hidden lg:flex justify-center h-[400px]">
             <div className="relative bg-white/5 rounded-3xl p-12 border border-gold/20 backdrop-blur-sm flex items-center justify-center">
                <Crosshair className="w-32 h-32 text-gold opacity-50" />
             </div>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-gold to-gold-lt py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-navy">
          <div><div className="font-serif text-4xl font-bold">400+</div><div className="text-[10px] uppercase font-bold tracking-widest">Placements</div></div>
          <div><div className="font-serif text-4xl font-bold">250+</div><div className="text-[10px] uppercase font-bold tracking-widest">Projects</div></div>
          <div><div className="font-serif text-4xl font-bold">150+</div><div className="text-[10px] uppercase font-bold tracking-widest">Clients</div></div>
          <div><div className="font-serif text-4xl font-bold">06</div><div className="text-[10px] uppercase font-bold tracking-widest">Divisions</div></div>
        </div>
      </div>

      <section className="py-24 px-[5%] max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-gold text-[11px] font-bold tracking-[0.2em] uppercase mb-2 italic">Excellence in Service</div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy">Six Divisions of Integrated Service</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-3xl border-t-4 border-gold shadow-sm transition-all duration-300 group hover:shadow-xl">
            <div className="w-14 h-14 bg-gold/5 rounded-2xl flex items-center justify-center text-navy mb-8 transition-transform duration-500 group-hover:rotate-[360deg]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-navy">Recruitment & Manpower</h3>
            <div className="w-12 h-[1px] bg-gold/30 mb-6" />
            <p className="text-slate text-sm leading-relaxed font-medium">Connecting businesses with skilled professionals who drive productivity, efficiency, and operational success. We deliver reliable manpower solutions tailored to your industry needs.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl border-t-4 border-green shadow-sm transition-all duration-300 group hover:shadow-xl">
            <div className="w-14 h-14 bg-green/5 rounded-2xl flex items-center justify-center text-navy mb-8 transition-transform duration-500 group-hover:rotate-[360deg]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-navy">Environmental Services</h3>
            <div className="w-12 h-[1px] bg-gold/30 mb-6" />
            <p className="text-slate text-sm leading-relaxed font-medium">Helping organizations meet environmental regulations while implementing sustainable practices that protect people, operations, and the environment.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl border-t-4 border-gold shadow-sm transition-all duration-300 group hover:shadow-xl">
            <div className="w-14 h-14 bg-gold/5 rounded-2xl flex items-center justify-center text-navy mb-8 transition-transform duration-500 group-hover:rotate-[360deg]">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-navy">Equipment Procurement</h3>
            <div className="w-12 h-[1px] bg-gold/30 mb-6" />
            <p className="text-slate text-sm leading-relaxed font-medium">Sourcing and supplying high-quality equipment and materials from trusted vendors to support safe, efficient, and cost-effective operations.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl border-t-4 border-navy shadow-sm transition-all duration-300 group hover:shadow-xl">
            <div className="w-14 h-14 bg-navy/5 rounded-2xl flex items-center justify-center text-navy mb-8 transition-transform duration-500 group-hover:rotate-[360deg]">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-navy">HSE Consultancy</h3>
            <div className="w-12 h-[1px] bg-gold/30 mb-6" />
            <p className="text-slate text-sm leading-relaxed font-medium">Providing expert Health, Safety, and Environmental (HSE) advisory services to help organizations maintain safe workplaces, meet regulatory standards, and reduce operational risks.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl border-t-4 border-gold shadow-sm transition-all duration-300 group hover:shadow-xl">
            <div className="w-14 h-14 bg-gold/5 rounded-2xl flex items-center justify-center text-navy mb-8 transition-transform duration-500 group-hover:rotate-[360deg]">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-navy">Facility Maintenance</h3>
            <div className="w-12 h-[1px] bg-gold/30 mb-6" />
            <p className="text-slate text-sm leading-relaxed font-medium">Comprehensive facility maintenance solutions designed to keep buildings, equipment, and operational environments running efficiently, safely, and without disruption.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl border-t-4 border-navy shadow-sm transition-all duration-300 group hover:shadow-xl">
            <div className="w-14 h-14 bg-navy/5 rounded-2xl flex items-center justify-center text-navy mb-8 transition-transform duration-500 group-hover:rotate-[360deg]">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-navy">General Consulting</h3>
            <div className="w-12 h-[1px] bg-gold/30 mb-6" />
            <p className="text-slate text-sm leading-relaxed font-medium">Strategic consulting services that support businesses in improving operations, solving complex challenges, and achieving sustainable growth.</p>
          </div>
        </div>
      </section>

      <section className="bg-navy py-24 px-[5%] text-center">
        <h2 className="font-serif text-4xl text-white font-bold mb-8 italic">Ready to optimize your operations?</h2>
        <button className="btn-primary px-12">Start a Partnership</button>
      </section>
    </div>
  );
}