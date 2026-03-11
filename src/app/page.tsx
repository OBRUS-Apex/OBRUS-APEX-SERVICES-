"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, ShieldCheck, Trash2, Crosshair, 
  Briefcase, Lightbulb, ArrowRight, Star 
} from 'lucide-react';

export default function LandingPage() {
  const [showPopup, setShowPopup] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cream font-sans text-navy">
      {showPopup && (
        <div className="fixed inset-0 bg-navy-deep/95 z-[9999] flex items-center justify-center backdrop-blur-md p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-12 text-center shadow-2xl animate-in zoom-in duration-500">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center text-gold font-bold text-2xl">O</div>
              <div className="text-left">
                <span className="block font-serif text-2xl font-bold leading-none">OBRUS</span>
                <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">Apex Services</span>
              </div>
            </div>
            <h2 className="font-serif text-3xl font-bold mb-4">Welcome to OBRUS</h2>
            <p className="text-slate text-sm leading-relaxed mb-8">
              Your trusted partner for Recruitment, Environmental Services, Equipment Procurement, and HSE Consultancy across Nigeria.
            </p>
            <button 
              onClick={() => setShowPopup(false)}
              className="bg-navy text-white px-10 py-3 rounded-full font-semibold hover:bg-gold hover:text-navy transition-all duration-300"
            >
              Enter Website →
            </button>
          </div>
        </div>
      )}

      <section className="relative min-h-screen flex items-center px-[5%] py-24 overflow-hidden bg-gradient-to-br from-navy-deep via-navy to-navy-mid">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c8921e_1px,transparent_1px)] [background-size:40px_40px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-4 py-1.5 rounded-full text-gold-lt text-[11px] uppercase tracking-widest font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-lt animate-pulse" />
              Port Harcourt, Nigeria · Est. 2024
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-white font-bold leading-[1.1] mb-6">
              Recruitment, Environmental <br />
              <span className="text-gold-lt italic"> & Technical Solutions You Can Trust</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
              OBRUS Apex Services is a trusted provider of recruitment, environmental management, and technical consultancy solutions. We partner with businesses to deliver skilled professionals, sustainable environmental practices, and expert advisory services that drive operational excellence.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/recruitment" className="bg-gradient-to-r from-gold to-gold-lt text-navy px-8 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-gold/20 hover:-translate-y-1 transition-all">
                🧑‍💼 Recruitment
              </Link>
              <Link href="/environmental" className="border border-white/20 text-white px-8 py-3.5 rounded-full font-medium text-sm hover:border-gold-lt hover:text-gold-lt transition-all">
                🌿 Environmental
              </Link>
            </div>
            <div className="flex gap-8">
              <div>
                <div className="font-serif text-3xl text-white font-bold">400+</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest">Placements</div>
              </div>
              <div className="border-l border-gold/30 pl-8">
                <div className="font-serif text-3xl text-white font-bold">150+</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest">Clients</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex relative justify-center items-center h-[500px]">
            <div className="absolute w-80 h-80 rounded-full border border-gold/10 animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-[450px] h-[450px] rounded-full border border-dashed border-gold/5 animate-[spin_35s_linear_infinite_reverse]" />
            <div className="relative bg-navy rounded-3xl p-12 border border-gold/20 shadow-2xl">
               <Crosshair className="w-32 h-32 text-gold-lt" />
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-gold to-gold-lt py-8 px-[5%]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { n: "400+", l: "Staff Placed" },
            { n: "250+", l: "Env. Services" },
            { n: "150+", l: "Clients Served" },
            { n: "6", l: "Divisions" },
          ].map((item, i) => (
            <div key={i}>
              <div className="font-serif text-3xl font-bold text-navy">{item.n}</div>
              <div className="text-[10px] font-bold text-navy/60 uppercase tracking-widest">{item.l}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="py-24 px-[5%] max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-gold text-[11px] font-bold tracking-[0.2em] uppercase mb-2">What We Offer</div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold">Six Divisions of Integrated Service</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Recruitment & Manpower", icon: <Users />, color: "border-gold", iconBg: "bg-gold/10" },
            { title: "Environmental Services", icon: <ShieldCheck />, color: "border-green", iconBg: "bg-green/10" },
            { title: "Equipment Procurement", icon: <Briefcase />, color: "border-gold", iconBg: "bg-gold/10" },
            { title: "HSE Consultancy", icon: <Star />, color: "border-navy", iconBg: "bg-navy/10" },
            { title: "Facility Maintenance", icon: <Lightbulb />, color: "border-gold", iconBg: "bg-gold/10" },
            { title: "General Consulting", icon: <Star />, color: "border-navy", iconBg: "bg-navy/10" },
          ].map((svc, i) => (
            <div key={i} className={`bg-white p-8 rounded-2xl border-t-4 ${svc.color} shadow-sm hover:-translate-y-2 transition-all duration-300 group`}>
              <div className={`w-12 h-12 ${svc.iconBg} rounded-xl flex items-center justify-center text-navy mb-6 group-hover:scale-110 transition-transform`}>
                {svc.icon}
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">{svc.title}</h3>
              <p className="text-slate text-sm leading-relaxed mb-6">Expert solutions tailored for operational excellence and industrial compliance.</p>
              <Link href="#" className="text-gold font-bold text-xs flex items-center gap-2 group-hover:gap-4 transition-all">
                Read More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy py-24 px-[5%]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="font-serif text-4xl text-white font-bold">Built on Trust. Delivered with Precision.</h2>
            <div className="grid gap-6">
              {[
                { n: "01", t: "Certified Professionals", d: "Every operative is verified and trained before deployment." },
                { n: "02", t: "Integrated Partnership", d: "One partner, six divisions of professional accountability." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 bg-gold text-navy flex items-center justify-center font-bold rounded-lg">{item.n}</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{item.t}</h4>
                    <p className="text-white/40 text-sm">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-80 bg-white/5 rounded-3xl border border-gold/20 backdrop-blur-sm hidden lg:block" />
        </div>
      </section>
    </div>
  );
}