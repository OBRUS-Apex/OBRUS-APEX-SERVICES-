"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, ShieldCheck, Menu, X, Phone, Mail, 
  Briefcase, User, LogOut, Check, Users, Building2, HardHat
} from 'lucide-react';

const SERVICE_CARDS = [
  {
    t: 'Recruitment & Manpower',
    img: 'https://images.unsplash.com/photo-1521791136364-798a7bc0d262?q=80&w=1471&auto=format&fit=crop',
    points: ['Pre-screened and qualified candidates', 'Faster hiring turnaround', 'Reduced recruitment risks'],
    cta: 'Request Qualified Staff',
    color: 'bg-[#1a7a4a]',
    href: '/recruitment'
  },
  {
    t: 'Facility Management',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1469&auto=format&fit=crop',
    points: ['Consistent maintenance and monitoring', 'Reduced downtime and operational failures', 'Improved efficiency and productivity'],
    cta: 'Book Facility Assessment',
    color: 'bg-[#0d2648]',
    href: '/environmental'
  },
  {
    t: 'HSE Consultancy',
    img: 'https://images.unsplash.com/photo-1504307651254-35682fd93502?q=80&w=1374&auto=format&fit=crop',
    points: ['Comprehensive risk assessments', 'Safety policies and procedures', 'Regulatory compliance support'],
    cta: 'Schedule HSE Consultation',
    color: 'bg-[#1e40af]',
    href: '/hse'
  }
];

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('user');
    if (session) setUser(JSON.parse(session));
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-[#0b1f3a]">
      
   
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-6 h-20 flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="OBRUS" className="h-10 w-auto" />
            <div className="leading-none border-l pl-2 border-gray-200">
               <span className="block text-[#0b1f3a] font-bold text-lg tracking-tight uppercase leading-none">Obrus Apex</span>
               <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Services</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
            <Link href="/recruitment" className="hover:text-green-600 transition-colors">Recruitment</Link>
            <Link href="/hse" className="hover:text-green-600 transition-colors">Safety</Link>
            <Link href="/client/portal" className="hover:text-green-600 transition-colors text-green-600 border border-green-600 px-4 py-2 rounded-lg">Access Portal</Link>
          </div>

          <button onClick={() => setNavOpen(!navOpen)} className="p-2 text-[#0b1f3a]">
            {navOpen ? <X size={28}/> : <Menu size={28}/>}
          </button>
        </div>
      </nav>

     
      <section className="pt-24 pb-12 bg-white overflow-hidden relative">
        {/* Swerving Wave Background Decor */}
        <div className="absolute top-40 right-[-10%] w-[60%] h-[500px] bg-green-50/50 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] text-navy">
              Reliable <span className="text-green-600">Manpower</span>, <br />
              Safer Operations, and <br />
              <span className="text-green-600">Efficient Growth —</span> <br />
              All in One Place.
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-xl font-medium">
              Streamline your operations, reduce risks, and maintain peak performance with our expert recruitment, HSE solutions, and facility management services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/contact" className="bg-[#1a7a4a] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-navy transition-all shadow-lg text-center">
                Request a Consultation
              </Link>
              <Link href="#services" className="border-2 border-navy text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-navy hover:text-white transition-all text-center">
                Explore Our Services
              </Link>
            </div>
          </div>

          <div className="relative group animate-in zoom-in duration-1000">
             <div className="absolute -inset-2 bg-gradient-to-tr from-green-600 to-navy rounded-3xl opacity-5 blur-2xl group-hover:opacity-10 transition-opacity"></div>
             <img 
               src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1470&auto=format&fit=crop" 
               alt="Team of Industrial Experts" 
               className="rounded-3xl shadow-2xl relative w-full h-[500px] object-cover"
             />
          </div>
        </div>
      </section>

     
      <section className="py-12 border-y border-gray-100 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] mb-8">
            Trusted by businesses that value efficiency, safety, and reliable operational support.
          </p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all">
            <div className="h-10 w-24 bg-gray-400 rounded-lg"></div>
            <div className="h-10 w-24 bg-gray-400 rounded-lg"></div>
            <div className="h-10 w-24 bg-gray-400 rounded-lg"></div>
            <div className="h-10 w-24 bg-gray-400 rounded-lg"></div>
          </div>
        </div>
      </section>

     
      <section id="services" className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16 space-y-4">
           <h2 className="text-4xl md:text-5xl font-bold text-navy">Our Services</h2>
           <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
             We provide tailored solutions designed to improve efficiency, ensure safety, and support your business growth.
           </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {SERVICE_CARDS.map((svc, i) => (
             <div key={i} className="flex flex-col h-full rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl transition-transform hover:-translate-y-2 bg-white">
                <div className="h-48 overflow-hidden relative">
                   <img src={svc.img} alt={svc.t} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                   <h3 className="absolute bottom-6 left-6 text-white text-xl font-bold uppercase tracking-tight">{svc.t}</h3>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                   <ul className="space-y-4 mb-10 flex-1">
                      {svc.points.map((p, idx) => (
                         <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm font-semibold">
                            <Check className="text-green-600 mt-1 shrink-0" size={16}/>
                            {p}
                         </li>
                      ))}
                   </ul>

                   <Link 
                     href={svc.href} 
                     className={`${svc.color} text-white w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.1em] text-center shadow-lg transition-all hover:brightness-110 active:scale-95`}
                   >
                     {svc.cta}
                   </Link>
                </div>
             </div>
           ))}
        </div>
      </section>

      
      <footer className="bg-navy py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center font-bold text-white italic">O</div>
             <p className="text-white font-bold text-lg tracking-tighter">Obrus Apex Services</p>
           </div>
           <p className="text-slate-500 text-sm">© {new Date().getFullYear()} All Rights Reserved.</p>
           <div className="flex gap-6 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}