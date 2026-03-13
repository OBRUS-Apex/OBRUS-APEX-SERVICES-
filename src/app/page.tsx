"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, ShieldCheck, Briefcase, 
  Star, Lightbulb, ArrowRight, Crosshair,
  Award, Zap, CheckCircle
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
    <div className="min-h-screen bg-[#f5f0e8] font-sans text-[#0b1f3a] selection:bg-[#c8921e]/30">
      <section className="relative min-h-[95vh] flex items-center px-[5%] py-24 bg-[#060f1e] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] hero-grid pointer-events-none"></div>
        <div className="absolute w-[600px] h-[600px] bg-[#c8921e]/5 rounded-full blur-[120px] -top-20 -right-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#c8921e]/10 border border-[#c8921e]/20 px-4 py-1.5 rounded-full text-[#e8b84b] text-[10px] uppercase tracking-[0.2em] font-bold mb-8">
              <span className="w-2 h-2 rounded-full bg-[#c8921e] animate-pulse" />
              Integrated Corporate Solutions
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-white font-bold leading-[1.1] mb-8">
              Integrated Services. <br />
              <span className="text-[#c8921e] italic font-medium">Exceptional Standards.</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-xl">
              OBRUS Apex Services delivers excellence across six professional divisions built on the foundations of integrity and accountability.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link href="/auth" className="bg-[#c8921e] hover:bg-[#e8b84b] text-[#060f1e] px-10 py-4 rounded-full font-bold text-sm transition-all shadow-xl shadow-[#c8921e]/10 flex items-center gap-2">
                Access Portal <ArrowRight size={18}/>
              </Link>
              <Link href="/hse" className="border border-white/20 text-white hover:border-[#c8921e] hover:text-[#c8921e] px-10 py-4 rounded-full font-bold text-sm transition-all">
                HSE Training
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hidden lg:flex justify-center relative"
          >
            <div className="absolute inset-0 bg-[#c8921e]/10 blur-[100px] rounded-full"></div>
            <div className="relative p-20 border border-[#c8921e]/10 bg-white/5 rounded-[40px] backdrop-blur-sm shadow-2xl overflow-hidden group">
              <Crosshair className="w-48 h-48 text-[#e8b84b] opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full text-center">
                <p className="text-white/10 font-serif text-xs uppercase tracking-[0.5em]">Accuracy</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="bg-[#0b1f3a] border-y border-white/5 py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { n: "400+", l: "Professionals Placed" },
            { n: "150+", l: "Corporate Clients" },
            { n: "06", l: "Service Divisions" },
            { n: "100%", l: "Safety Record" }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="font-serif text-4xl text-[#c8921e] font-bold">{stat.n}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">{stat.l}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="py-32 px-[5%] max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="text-[#c8921e] text-[11px] font-bold tracking-[0.3em] uppercase mb-4 italic">Core Competence</div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Expert Service Divisions</h2>
          <div className="h-1 w-20 bg-[#c8921e]/30 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white p-12 rounded-[40px] border-t-[6px] ${svc.b} shadow-sm transition-all duration-300 group hover:shadow-2xl`}
            >
              <div className={`w-14 h-14 ${svc.bg} rounded-2xl flex items-center justify-center text-[#0b1f3a] mb-8 transition-transform duration-700 group-hover:rotate-[360deg]`}>
                {svc.i}
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">{svc.t}</h3>
              <div className="w-12 h-[2px] bg-[#c8921e]/20 mb-6" />
              <p className="text-[#8494aa] text-[15px] leading-relaxed font-medium">
                {svc.d}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#060f1e] py-32 px-[5%] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div>
              <h2 className="font-serif text-4xl text-white font-bold leading-tight mb-6">
                Redefining Operational Excellence <br />In West African Markets.
              </h2>
              <p className="text-white/40 text-lg leading-relaxed">
                Headquartered in Port Harcourt, we provide a unified approach to complex corporate challenges, integrating safety, talent, and facility maintenance.
              </p>
            </div>
            <div className="grid gap-10">
              {[
                { i: <Award className="text-[#c8921e]"/>, t: "Industry Standard Certification", d: "Operating strictly under national and international safety compliance benchmarks." },
                { i: <Zap className="text-[#c8921e]"/>, t: "Agile Response Strategy", d: "Fast turnaround times for recruitment and equipment procurement through verified networks." },
                { i: <CheckCircle className="text-[#c8921e]"/>, t: "End-to-End Integrity", d: "Total transparency in contracting and personnel management." }
              ].map((point, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[#c8921e]/10 transition-colors shrink-0">
                    {point.i}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg group-hover:text-[#c8921e] transition-colors">{point.t}</h4>
                    <p className="text-white/30 text-sm mt-1">{point.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group perspective-1000">
            <div className="absolute -inset-10 bg-[#c8921e]/5 rounded-full blur-[100px]"></div>
            <div className="relative border border-white/5 rounded-[60px] p-24 bg-[#0b1f3a] shadow-3xl flex flex-col items-center justify-center min-h-[450px] transition-transform duration-700 hover:rotate-2">
              <div className="w-20 h-20 bg-gradient-to-br from-[#c8921e] to-[#e8b84b] rounded-[20px] flex items-center justify-center mb-8 shadow-2xl">
                <Star className="text-[#060f1e] w-10 h-10 fill-current" />
              </div>
              <h3 className="font-serif text-white text-3xl font-bold italic mb-6">The OBRUS Apex Promise</h3>
              <p className="text-white/30 text-center font-medium leading-relaxed max-w-sm">
                "We provide not just staff and supplies, but the peace of mind required to focus on your core growth."
              </p>
              <div className="mt-12 w-1 h-20 bg-gradient-to-b from-[#c8921e] to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f0e8] py-40 px-[5%]">
        <div className="max-w-6xl mx-auto rounded-[60px] bg-gradient-to-r from-[#060f1e] to-[#0b1f3a] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-[#060f1e]/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c8921e]/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-6xl text-white font-bold mb-8 italic">Start Your Partnership.</h2>
            <p className="text-white/40 text-xl max-w-2xl mx-auto mb-12">
              Join dozens of industrial leaders who trust OBRUS for manpower and compliance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/auth" className="bg-[#c8921e] text-[#060f1e] px-14 py-5 rounded-full font-bold shadow-2xl hover:bg-[#e8b84b] transition-all transform hover:-translate-y-1">
                  Secure Portal Access
               </Link>
               <Link href="/contact" className="border border-white/20 text-white px-14 py-5 rounded-full font-bold hover:bg-white/5 transition-all">
                  Talk to a Specialist
               </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}