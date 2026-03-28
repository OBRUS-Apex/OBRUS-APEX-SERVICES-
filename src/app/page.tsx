"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Menu, X, Check, Users, Zap, Shield, 
  Briefcase, ChevronRight, Globe, ArrowUpRight, 
  Target, Award, BarChart3 
} from 'lucide-react';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-[#fcfbf9] text-[#1a2e46] font-sans antialiased min-h-screen flex flex-col selection:bg-[#257242] selection:text-white">
      
    
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative w-14 h-14 flex items-center justify-center bg-[#1a2e46] rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-xl">
                <img src="/logo.png" alt="O" className="w-10 h-10 object-contain -rotate-3 group-hover:rotate-0 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-[#1a2e46] text-2xl leading-none tracking-tighter uppercase italic">OBRUS APEX</span>
                <span className="text-[#257242] text-[10px] font-black uppercase tracking-[0.3em]">Integrated Solutions</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-10">
              {['About', 'Recruitment', 'HSE', 'Contact'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#257242] transition-colors">
                  {item}
                </Link>
              ))}
              <Link href="/auth" className="bg-[#1a2e46] text-[#c8921e] px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#257242] hover:text-white transition-all shadow-2xl shadow-navy/20">
                Portal Access
              </Link>
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-[#1a2e46] p-2">
              {menuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </nav>

      
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#1a2e46]">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#257242 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#257242]/20 to-transparent hidden lg:block" />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 bg-[#257242] rounded-full animate-pulse" />
              <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Operational Excellence v2.0</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic mb-8">
              The <span className="text-[#257242]">Apex</span> of <br />
              <span className="text-[#c8921e]">Industrial</span> <br />
              Management.
            </h1>
            <p className="text-xl text-white/40 max-w-lg mb-10 font-medium leading-relaxed">
              Manpower, HSE, and Facility Management solutions engineered for high-stakes corporate environments.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/auth" className="bg-[#257242] text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-[#1a2e46] transition-all shadow-3xl">
                Initiate Consultation
              </Link>
              <Link href="/recruitment" className="flex items-center gap-3 text-white font-black uppercase text-xs tracking-widest group">
                Explore Careers <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-[#c8921e]" />
              </Link>
            </div>
          </motion.div>

          <div className="hidden lg:block relative">
            <div className="absolute -inset-10 bg-[#257242]/20 blur-[120px] rounded-full animate-pulse" />
            <div className="relative bg-white/5 border border-white/10 p-4 rounded-[60px] backdrop-blur-sm">
               <img 
                 src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop" 
                 className="rounded-[50px] grayscale hover:grayscale-0 transition-all duration-1000" 
                 alt="Apex Solutions" 
               />
            </div>
          </div>
        </div>
      </section>

      {/* APEX STATS HUB */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          <StatItem val="400+" label="Vetted Personnel" />
          <StatItem val="100%" label="Safety Compliance" />
          <StatItem val="24/7" label="Support Node" />
          <StatItem val="A1" label="Industrial Rating" />
        </div>
      </div>

     
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-[#257242] text-[11px] font-black uppercase tracking-[0.4em] mb-4 block italic">Service Matrix</span>
            <h2 className="text-5xl lg:text-6xl font-black text-[#1a2e46] uppercase tracking-tighter leading-none">Integrated <br />Operational Guard.</h2>
          </div>
          <p className="text-gray-400 font-medium max-w-sm italic">Practical solutions that keep your operations running smoothly, safely, and in full compliance.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <SolutionCard 
            ico={<Target />} 
            title="Recruitment" 
            desc="Sourcing the right workforce through rigorous pre-screening and technical vetting."
            tags={["Manpower", "Outsourcing"]}
          />
          <SolutionCard 
            ico={<Shield />} 
            title="HSE Audit" 
            desc="Comprehensive risk assessments and safety policies built for high-stakes industries."
            tags={["Compliance", "Safety"]}
          />
          <SolutionCard 
            ico={<BarChart3 />} 
            title="Facility Ops" 
            desc="Streamlined sanitation, fumigation, and maintenance logs for efficient growth."
            tags={["Sanitation", "Maintenance"]}
          />
        </div>
      </section>

    
      <section className="bg-[#f9fafb] py-32 border-y border-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h3 className="text-4xl font-black text-[#1a2e46] uppercase italic leading-tight">
              Why Leaders Choose <br /> <span className="text-[#257242]">OBRUS APEX</span>
            </h3>
            <div className="grid gap-8">
               <TrustPoint title="Precision Sourcing" desc="We don't just hire; we engineer teams that fit your corporate culture." />
               <TrustPoint title="Regulatory Shield" desc="Vigorously strictly adheres to Nigerian and International HSE standards." />
               <TrustPoint title="Operational ROI" desc="Optimized costs through efficient facility and waste management." />
            </div>
          </div>
          <div className="bg-[#1a2e46] p-16 rounded-[80px] shadow-3xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-40 h-40 bg-[#c8921e] rounded-bl-full opacity-10 group-hover:scale-150 transition-transform duration-1000" />
             <Award className="text-[#c8921e] mb-8" size={60} />
             <p className="text-white text-3xl font-serif italic leading-relaxed">
               "We go beyond service delivery — we become a strategic extension of your operational team."
             </p>
             <div className="mt-10 flex items-center gap-4">
                <div className="w-12 h-0.5 bg-[#257242]" />
                <span className="text-[#257242] font-black uppercase text-[10px] tracking-widest">The Apex Promise</span>
             </div>
          </div>
        </div>
      </section>

    
      <footer className="bg-[#060f1e] pt-32 pb-12 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-20 mb-20">
            <div>
               <h4 className="font-serif font-black text-3xl italic mb-6">OBRUS APEX</h4>
               <p className="text-white/30 leading-loose mb-8">Nigeria's premier integrated solutions hub for manpower, safety, and facility management.</p>
               <div className="flex gap-4">
                  
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#257242] transition-colors cursor-pointer"><Globe size={18}/></div>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-10 lg:col-span-2">
               <FooterLinks title="Solutions" links={['Recruitment', 'HSE Audit', 'Facility Ops', 'Procurement']} />
               <FooterLinks title="Company" links={['About Us', 'Careers', 'Contact', 'Portal']} />
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center">
             <p className="text-white/10 text-[10px] font-black uppercase tracking-[0.5em]">
               &copy; 2026 OBRUS APEX SERVICES · ALL RIGHTS RESERVED
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


function StatItem({ val, label }: { val: string, label: string }) {
  return (
    <div className="text-center group">
      <div className="text-4xl font-black text-[#1a2e46] tracking-tighter mb-1 group-hover:text-[#257242] transition-colors">{val}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 italic">{label}</div>
    </div>
  );
}

function SolutionCard({ ico, title, desc, tags }: any) {
  return (
    <div className="bg-white p-12 rounded-[60px] border border-gray-100 shadow-xl hover:shadow-3xl hover:border-[#257242] transition-all duration-700 group">
      <div className="w-16 h-16 bg-[#fcfbf9] text-[#1a2e46] rounded-2xl flex items-center justify-center mb-10 group-hover:bg-[#257242] group-hover:text-white transition-all duration-500 shadow-inner">
        {ico}
      </div>
      <h3 className="text-3xl font-black text-[#1a2e46] uppercase italic tracking-tighter mb-4">{title}</h3>
      <p className="text-gray-400 font-medium leading-relaxed mb-8">{desc}</p>
      <div className="flex gap-2">
        {tags.map((tag: string) => (
          <span key={tag} className="text-[9px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full text-gray-400">{tag}</span>
        ))}
      </div>
    </div>
  );
}

function TrustPoint({ title, desc }: any) {
  return (
    <div className="flex gap-6 items-start group">
      <div className="w-10 h-10 rounded-full bg-[#257242]/10 flex items-center justify-center shrink-0 group-hover:bg-[#257242] transition-colors duration-500">
        <Check size={20} className="text-[#257242] group-hover:text-white" />
      </div>
      <div>
        <h4 className="text-lg font-black uppercase italic text-[#1a2e46] mb-1">{title}</h4>
        <p className="text-gray-400 text-sm font-medium">{desc}</p>
      </div>
    </div>
  );
}

function FooterLinks({ title, links }: any) {
  return (
    <div>
      <h5 className="text-[#257242] font-black uppercase text-[10px] tracking-[0.3em] mb-8">{title}</h5>
      <ul className="space-y-4">
        {links.map((link: string) => (
          <li key={link}><Link href="#" className="text-white/40 hover:text-white transition-colors text-sm font-bold">{link}</Link></li>
        ))}
      </ul>
    </div>
  );
}