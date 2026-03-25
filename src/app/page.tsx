"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Check, Users, Zap, Shield, TrendingUp, Briefcase } from 'lucide-react';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white text-gray-800 font-sans antialiased min-h-screen flex flex-col">
     
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
           
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                <img 
                  src="/logo.png" 
                  alt="OBRUS" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                   
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `<div class="w-11 h-11 bg-[#257242] rounded-xl flex items-center justify-center text-white shadow-md font-bold text-xl uppercase italic">O</div>`;
                  }}
                />
              </div>
              <span className="font-extrabold text-[#1a2e46] text-lg sm:text-xl leading-tight tracking-tight uppercase">
                OBRUS APEX<br />SERVICES
              </span>
            </Link>

          
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#1a2e46] hover:text-[#257242] focus:outline-none transition-colors">
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-[#1a2e46] hover:text-[#257242] font-semibold transition underline underline-offset-8 decoration-[#257242] decoration-2">Home</Link>
              <Link href="/recruitment" className="text-gray-600 hover:text-[#257242] font-medium transition">Career Hub</Link>
              <Link href="/hse" className="text-gray-600 hover:text-[#257242] font-medium transition">HSE Solutions</Link>
              <Link href="/contact" className="text-gray-600 hover:text-[#257242] font-medium transition">Get in Touch</Link>
              <Link href="/auth" className="bg-[#1a2e46] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#257242] transition shadow-md uppercase tracking-wider">
                Partner Portal
              </Link>
            </div>
          </div>
        </div>

        
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-8 shadow-xl absolute w-full animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="/" onClick={() => setMenuOpen(false)} className="text-[#1a2e46] font-bold py-2 border-b">Home</Link>
              <Link href="/recruitment" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium py-2 border-b">Careers</Link>
              <Link href="/hse" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium py-2 border-b">Health & Safety</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium py-2 border-b">Contact Us</Link>
              <Link href="/auth" onClick={() => setMenuOpen(false)} className="bg-[#257242] text-white px-4 py-4 rounded-xl font-bold text-center mt-4 shadow-lg uppercase tracking-widest">
                Portal Login
              </Link>
            </div>
          </div>
        )}
      </nav>

     
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-green-50 to-blue-50 min-h-[550px] flex items-center">
        <div className="absolute right-0 top-0 h-full w-1/2 lg:w-[55%] hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=1200&auto=format&fit=crop"
            alt="Corporate Efficiency"
            className="h-full w-full object-cover object-left shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 z-10 w-full">
          <div className="max-w-xl">
            <div className="inline-block bg-green-100 text-[#257242] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              Official Management Center
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1a2e46] leading-none mb-8 tracking-tighter italic">
              Integrated <span className="text-[#257242]">Manpower</span><br />
              Safer Industrial <span className="text-[#257242]">Operations</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 mb-10 leading-relaxed font-medium">
              We provide pre-screened talent, comprehensive facility upkeep, and international standard safety audits to keep your operations high-performance and reliable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth" className="text-center bg-[#257242] text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-green-800 transition shadow-2xl">
                Consult with Specialist
              </Link>
              <Link href="/recruitment" className="text-center bg-white text-[#1a2e46] border-2 border-[#1a2e46] px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition shadow-sm">
                View Available Roles
              </Link>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-[#1a2e46] mb-6 uppercase tracking-tighter">Strategic Services</h2>
            <div className="h-1.5 w-16 bg-[#257242] mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-gray-500 font-medium italic">
              Standardized corporate infrastructure management tailored for results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* Recruitment */}
            <div className="bg-[#fcfbf9] rounded-3xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-2xl transition-all">
              <div className="p-8 pb-4">
                 <h3 className="font-extrabold text-[#1a2e46] text-2xl uppercase italic leading-none mb-2">Manpower</h3>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#257242] opacity-40 italic">Hiring Hub</span>
              </div>
              <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop" className="h-44 w-full object-cover px-8 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Workforce" />
              <div className="p-8 pt-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3"><Check className="text-[#257242]" size={16}/> <span className="text-sm font-semibold text-gray-600">Vetted Skillful Professionals</span></li>
                  <li className="flex items-start gap-3"><Check className="text-[#257242]" size={16}/> <span className="text-sm font-semibold text-gray-600">Vast Technical Pool</span></li>
                </ul>
                <Link href="/auth" className="block text-center w-full bg-[#257242] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Start Recruitment</Link>
              </div>
            </div>

           
            <div className="bg-[#fcfbf9] rounded-3xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-2xl transition-all">
              <div className="p-8 pb-4">
                 <h3 className="font-extrabold text-[#1a2e46] text-2xl uppercase italic leading-none mb-2">Management</h3>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#257242] opacity-40 italic">Facility Node</span>
              </div>
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop" className="h-44 w-full object-cover px-8 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Building Management" />
              <div className="p-8 pt-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3"><Check className="text-[#257242]" size={16}/> <span className="text-sm font-semibold text-gray-600">Site Maintenance Logs</span></li>
                  <li className="flex items-start gap-3"><Check className="text-[#257242]" size={16}/> <span className="text-sm font-semibold text-gray-600">Industrial Janitorial Flow</span></li>
                </ul>
                <Link href="/auth" className="block text-center w-full bg-[#257242] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Analyze My Facility</Link>
              </div>
            </div>

       
            <div className="bg-[#fcfbf9] rounded-3xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-2xl transition-all">
              <div className="p-8 pb-4">
                 <h3 className="font-extrabold text-[#1a2e46] text-2xl uppercase italic leading-none mb-2">Security</h3>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#1a2e46] opacity-40 italic">HSE Division</span>
              </div>
              <img src="https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?q=80&w=600&auto=format&fit=crop" className="h-44 w-full object-cover px-8 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Consultancy" />
              <div className="p-8 pt-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3"><Check className="text-[#1a2e46]" size={16}/> <span className="text-sm font-semibold text-gray-600">ISO Regulatory Audit</span></li>
                  <li className="flex items-start gap-3"><Check className="text-[#1a2e46]" size={16}/> <span className="text-sm font-semibold text-gray-600">Emergency Protocol Review</span></li>
                </ul>
                <Link href="/auth" className="block text-center w-full bg-[#1a2e46] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Contact Auditors</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-24 bg-[#f9fafb] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
           <h2 className="text-3xl font-extrabold text-[#1a2e46] mb-4">Core Principles</h2>
           <p className="text-gray-500 font-semibold italic uppercase text-xs tracking-widest">Beyond professional delivery</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { ico: <Users size={24}/>, t: "Verified Team", d: "Experience-led experts overseeing every contract layer." },
            { ico: <Zap size={24}/>, t: "Priority Hub", d: "Prompt resolution and turnaround on all client tickets." },
            { ico: <Shield size={24}/>, t: "Compliance Key", d: "Vigorously strictly adheres to Nigerian HSE standards." },
            { ico: <TrendingUp size={24}/>, t: "Market ROI", d: "Optimized operational costs without sacrificing quality." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 text-center hover:-translate-y-3 transition-transform duration-500">
              <div className="w-16 h-16 bg-[#257242] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                {item.ico}
              </div>
              <h3 className="font-extrabold text-[#1a2e46] text-xl mb-4 italic uppercase">{item.t}</h3>
              <p className="text-gray-400 text-sm leading-loose font-medium">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

   
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#1a2e46] to-[#0d2648] p-12 md:p-20 rounded-[60px] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight italic">Initiate Full<br/>Operational Guard.</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
            <Link href="/auth" className="bg-[#257242] text-white px-10 py-5 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase shadow-3xl hover:bg-green-600 transition-all">
              Launch Portal Hub
            </Link>
            <Link href="/contact" className="border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-white/10 transition-all">
              Direct Contact Line
            </Link>
          </div>
        </div>
      </section>

      
      <footer className="bg-[#060f1e] py-14 text-white text-center mt-auto relative overflow-hidden border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
          <img src="/logo.png" className="w-16 h-auto opacity-40 mb-6 grayscale hover:grayscale-0 transition-all duration-700" alt="Footer Logo" />
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em] italic">
            &copy; 2026 OBRUS APEX SERVICES · NIGERIA DIVISION HUB
          </p>
        </div>
      </footer>
    </div>
  );
}