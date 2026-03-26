"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Check, Users, Zap, Shield, TrendingUp, Briefcase, Building, ChevronRight } from 'lucide-react';

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
                  alt="OBRUS Logo" 
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
                Portal Login
              </Link>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-8 shadow-xl absolute w-full animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="/" onClick={() => setMenuOpen(false)} className="text-[#1a2e46] font-bold">Home</Link>
              <Link href="/recruitment" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium">Careers</Link>
              <Link href="/hse" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium">Safety Solutions</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium">Contact Us</Link>
              <Link href="/auth" onClick={() => setMenuOpen(false)} className="bg-[#257242] text-white px-4 py-4 rounded-xl font-bold text-center shadow-lg uppercase tracking-widest">
                Portal Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-green-50 to-blue-50 py-16 lg:py-28 flex items-center">
        <div className="absolute right-0 top-0 h-full w-1/2 lg:w-[55%] hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e01a?q=80&w=1200&auto=format&fit=crop"
            alt="Operational Excellence"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a2e46] leading-tight mb-8 tracking-tighter">
              Manpower, HSE, Environmental & <span className="text-[#257242]">Facility Management</span> Solutions — All in One Place
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed font-medium italic border-l-4 border-[#257242] pl-6">
              We help businesses hire the right workforce, maintain safe and compliant operations, and manage facilities efficiently without stress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth" className="text-center bg-[#257242] text-white px-10 py-4.5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-green-800 transition shadow-2xl">
                Consult With Us
              </Link>
              <Link href="/recruitment" className="text-center bg-white text-[#1a2e46] border-2 border-[#1a2e46] px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition shadow-sm">
                Apply for Roles
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="max-w-4xl mx-auto text-xl sm:text-2xl text-gray-500 font-medium leading-relaxed italic">
            "From <span className="text-[#1a2e46] font-bold">recruitment</span> and <span className="text-[#1a2e46] font-bold">HSE consultancy</span> to environmental services like <span className="text-[#257242] font-bold">fumigation, pest control, and sanitation</span>, we deliver practical solutions that keep your operations running smoothly."
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              ico={<Users size={30} />} 
              title="Workforce Strategy"
              list={["Expert Manpower Outsourcing", "Industrial Technical Talent", "Pre-screened Placements"]}
            />
            <ServiceCard 
              ico={<Shield size={30} />} 
              title="HSE Consultancy"
              list={["Safety Audits & Compliance", "HSE Staff Training", "Regulatory Documentation"]}
            />
            <ServiceCard 
              ico={<Briefcase size={30} />} 
              title="Facility Operations"
              list={["Full Facility Management", "Sanitation & Evacuation", "Pest & Rodent Control"]}
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-[#1a2e46] text-white text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-10 tracking-tight italic uppercase decoration-[#257242] underline underline-offset-[14px]">Experience full compliance</h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">Sourcing equipment and supplying high-quality materials from trusted vendors to support cost-effective operations.</p>
          <Link href="/auth" className="inline-block bg-[#257242] text-white px-14 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-3xl hover:bg-green-600 transition-all hover:-translate-y-1 active:scale-95">
            Initialize Access Now
          </Link>
        </div>
      </section>

      <footer className="bg-[#060f1e] py-14 border-t border-white/10 flex flex-col items-center justify-center">
        <img src="/logo.png" className="h-10 w-auto opacity-40 mb-6 grayscale hover:grayscale-0 transition-all duration-700" alt="Footer Logo" />
        <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.5em] italic">
          &copy; 2026 OBRUS APEX SERVICES · ALL MISSION CONTROLS PROTECTED
        </p>
      </footer>
    </div>
  );
}

function ServiceCard({ ico, title, list }: { ico: any, title: string, list: string[] }) {
  return (
    <div className="p-10 rounded-[40px] border border-gray-100 bg-[#fdfdfd] hover:shadow-2xl hover:border-[#257242] transition-all duration-500 group flex flex-col">
      <div className="w-16 h-16 bg-[#1a2e46] text-white rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:bg-[#257242] transition-colors duration-500">
        {ico}
      </div>
      <h3 className="text-2xl font-black text-[#1a2e46] uppercase italic tracking-tighter mb-6">{title}</h3>
      <ul className="space-y-4 flex-1">
        {list.map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-sm font-semibold text-gray-500 italic">
            <Check size={14} className="text-[#257242]" /> {item}
          </li>
        ))}
      </ul>
      <div className="mt-10 h-1.5 w-10 bg-gray-100 rounded-full group-hover:w-full group-hover:bg-[#257242] transition-all duration-500"></div>
    </div>
  );
}