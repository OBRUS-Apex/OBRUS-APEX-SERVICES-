"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, ShieldCheck, Briefcase, 
  Star, Lightbulb, ArrowRight, Crosshair 
} from 'lucide-react';

export default function LandingPage() {
  const services = [
    { 
      t: "Recruitment & Manpower", 
      d: "Connecting businesses with skilled professionals who drive productivity, efficiency, and operational success. We deliver reliable manpower solutions tailored to your industry needs.", 
      i: <Users />, b: "border-gold", bg: "bg-gold/10" 
    },
    { 
      t: "Environmental Services", 
      d: "Helping organizations meet environmental regulations while implementing sustainable practices that protect people, operations, and the environment.", 
      i: <ShieldCheck />, b: "border-green", bg: "bg-green/10" 
    },
    { 
      t: "Equipment Procurement", 
      d: "Sourcing and supplying high-quality equipment and materials from trusted vendors to support safe, efficient, and cost-effective operations.", 
      i: <Briefcase />, b: "border-gold", bg: "bg-gold/10" 
    },
    { 
      t: "HSE Consultancy", 
      d: "Providing expert Health, Safety, and Environmental (HSE) advisory services to help organizations maintain safe workplaces, meet regulatory standards, and reduce operational risks.", 
      i: <Star />, b: "border-navy", bg: "bg-navy/10" 
    },
    { 
      t: "Facility Maintenance", 
      d: "Comprehensive facility maintenance solutions designed to keep buildings, equipment, and operational environments running efficiently, safely, and without disruption.", 
      i: <Lightbulb />, b: "border-gold", bg: "bg-gold/10" 
    },
    { 
      t: "General Consulting", 
      d: "Strategic consulting services that support businesses in improving operations, solving complex challenges, and achieving sustainable growth.", 
      i: <Star />, b: "border-navy", bg: "bg-navy/10" 
    }
  ];

  return (
    <div className="min-h-screen bg-cream font-sans text-navy selection:bg-gold/30">
      
    
      <section className="relative min-h-[90vh] flex items-center px-[5%] py-24 bg-navy-deep overflow-hidden">
       
        <div className="absolute inset-0 opacity-[0.05] hero-grid pointer-events-none"></div>
        <div className="absolute w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] -top-20 -right-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 px-4 py-1.5 rounded-full text-gold-lt text-[10px] uppercase tracking-[0.2em] font-bold mb-8">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Integrated Corporate Solutions
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-white font-bold leading-[1.1] mb-8">
              Built on Integrity. <br />
              <span className="text-gold italic font-medium">Delivered with Precision.</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-xl">
              OBRUS Apex Services provides world-class manpower, environmental management, 
              and technical consultancy tailored to your corporate needs.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link href="/services" className="bg-gold hover:bg-gold-lt text-navy-deep px-10 py-4 rounded-full font-bold text-sm transition-all shadow-xl shadow-gold/10 flex items-center gap-2">
                Explore Divisions <ArrowRight size={18}/>
              </Link>
              <Link href="/contact" className="border border-white/20 text-white hover:border-gold hover:text-gold px-10 py-4 rounded-full font-bold text-sm transition-all">
                Request a Quote
              </Link>
            </div>
          </motion.div>

          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hidden lg:flex justify-center relative"
          >
            <div className="absolute inset-0 bg-gold/10 blur-[100px] rounded-full"></div>
            <div className="relative p-16 border border-gold/10 bg-white/5 rounded-[40px] backdrop-blur-sm shadow-2xl">
              <Crosshair className="w-40 h-40 text-gold-lt opacity-20" />
            </div>
          </motion.div>
        </div>
      </section>

     
      <div className="bg-navy border-y border-white/5 py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { n: "400+", l: "Professionals Placed" },
            { n: "150+", l: "Corporate Clients" },
            { n: "10+", l: "Integrated Divisions" },
            { n: "99%", l: "Client Retention" }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="font-serif text-4xl text-gold font-bold">{stat.n}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">{stat.l}</div>
            </div>
          ))}
        </div>
      </div>

      
      <section className="py-32 px-[5%] max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="text-gold text-[11px] font-bold tracking-[0.3em] uppercase mb-4 italic">Core Expertise</div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Our Six Operational Pillars</h2>
          <div className="h-1 w-20 bg-gold/30 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              className={`bg-white p-10 rounded-[32px] border-t-4 ${svc.b} shadow-sm transition-all duration-300 group`}
            >
              <div className={`w-14 h-14 ${svc.bg} rounded-2xl flex items-center justify-center text-navy mb-8 transition-transform duration-500 group-hover:rotate-[360deg]`}>
                {svc.i}
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">{svc.t}</h3>
              <div className="w-12 h-[2px] bg-gold/20 mb-6" />
              <p className="text-slate text-[15px] leading-relaxed font-medium mb-4">
                {svc.d}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

   
      <section className="bg-navy-deep py-32 px-[5%] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 relative z-10">
            <h2 className="font-serif text-4xl text-white font-bold italic leading-tight">
              Dedicated to High Performance <br />& Sustainable Operations.
            </h2>
            <div className="space-y-6">
              {[
                { t: "Integrity Driven", d: "We prioritize honest partnerships and transparent delivery above all else." },
                { t: "Compliance Focused", d: "All services align strictly with ISO and HSE national standards." }
              ].map((point, idx) => (
                <div key={idx} className="flex gap-5 border-l border-white/10 pl-6 group">
                  <div>
                    <h4 className="font-bold text-gold-lt group-hover:text-gold transition-colors">{point.t}</h4>
                    <p className="text-white/40 text-sm mt-1">{point.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gold/5 rounded-[40px] blur-2xl group-hover:bg-gold/10 transition-all"></div>
            <div className="relative bg-navy rounded-[40px] border border-white/5 p-16 h-80 flex items-center justify-center italic text-white/10 font-serif text-4xl text-center select-none">
              Strategic Partnership & Facility Solutions
            </div>
          </div>
        </div>
      </section>

    
      <section className="bg-cream py-32 px-[5%] text-center">
        <div className="max-w-4xl mx-auto p-16 rounded-[48px] bg-navy shadow-3xl shadow-navy/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32"></div>
          <h2 className="font-serif text-4xl text-white font-bold mb-8 italic">Ready to optimize your corporate workflow?</h2>
          <p className="text-white/50 mb-10 text-lg">Partner with Nigeria's most reliable integrated service provider today.</p>
          <div className="flex justify-center gap-4 flex-wrap">
             <Link href="/auth" className="bg-gold text-navy px-12 py-4 rounded-full font-bold shadow-lg hover:bg-gold-lt transition-all">
                Access Client Portal
             </Link>
             <Link href="/contact" className="border border-white/20 text-white px-12 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
                Book a Consultation
             </Link>
          </div>
        </div>
      </section>

    </div>
  );
}