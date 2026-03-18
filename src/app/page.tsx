"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, ShieldCheck, Zap, Menu, X, Phone, Mail, 
  Briefcase, BarChart, Settings, CheckCircle, User, LogOut,
  Target, ClipboardCheck, Scale
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
    problem: 'High turnover and unqualified technical staff.',
    solution: 'We deploy rigorously vetted professionals across industrial sectors, ensuring operational continuity without the hiring overhead.', 
    i: '👥', border: 'border-[#c8921e]', href: '/recruitment' 
  },
  { 
    t: 'Environmental Services', 
    problem: 'Regulatory non-compliance and facility health risks.',
    solution: 'Certified fumigation, waste management, and sanitation services that keep your facilities 100% compliant with NESREA standards.', 
    i: '🌿', border: 'border-[#1a7a4a]', href: '/environmental' 
  },
  { 
    t: 'Equipment Procurement', 
    problem: 'Supply chain delays and substandard safety gear.',
    solution: 'Direct sourcing and supply of certified PPE and facility materials from verified global manufacturers to your site.', 
    i: '⚙️', border: 'border-[#0b1f3a]', href: '/equipment' 
  },
  { 
    t: 'HSE Consultancy', 
    problem: 'Workplace accidents and lack of safety frameworks.',
    solution: 'Comprehensive risk assessments, safety audits, and NEBOSH-accredited training to build a zero-incident workplace culture.', 
    i: '🛡️', border: 'border-[#c8921e]', href: '/hse' 
  },
  { 
    t: 'Facility Maintenance', 
    problem: 'Unexpected downtime and facility degradation.',
    solution: 'Preventative and reactive maintenance protocols to keep your buildings and equipment operating at peak efficiency.', 
    i: '🏗️', border: 'border-[#1a7a4a]', href: '/environmental' 
  },
  { 
    t: 'Corporate Consulting', 
    problem: 'Operational friction and inefficient processes.',
    solution: 'Strategic advisory services designed to streamline your operations, improve safety metrics, and scale your workforce effectively.', 
    i: '💡', border: 'border-[#0b1f3a]', href: '/hse' 
  },
];

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('user');
    if (session) setUser(JSON.parse(session));
  }, []);

  const handleLogout = () => { localStorage.clear(); setUser(null); setNavOpen(false); };

  const getPortalLink = () => {
    if (!user) return '/auth';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.userType === 'employer') return '/portal/employer';
    return '/client/portal';
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] font-sans text-[#0b1f3a] overflow-x-hidden">

      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 z-50 bg-[rgba(6,10,20,0.96)] backdrop-blur border-b border-[rgba(200,146,30,0.16)]" style={{ width: '100vw', right: 0 }}>
        <div className="px-5 h-16 flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/" className="shrink-0 flex items-center gap-3">
            <div className="bg-white rounded-xl px-2 py-1.5">
              <img src="/logo.png" alt="OBRUS Apex Services" className="h-8 w-auto" />
            </div>
            <div className="hidden sm:block">
              <span className="block text-white font-bold text-sm leading-none tracking-wide">OBRUS</span>
              <span className="text-[#e8b84b] text-[9px] uppercase tracking-widest">Apex Services</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/60 hover:text-[#e8b84b] hover:bg-[rgba(200,146,30,0.1)] transition-all">{label}</Link>
            ))}
            <div className="w-px h-5 bg-white/10 mx-2" />
            {user ? (
              <div className="flex items-center gap-2">
                <Link href={getPortalLink()} className="flex items-center gap-2 px-4 py-1.5 bg-[#c8921e]/10 border border-[#c8921e]/30 rounded-lg text-sm text-[#e8b84b] font-semibold hover:bg-[#c8921e]/20 transition-all">
                  <User size={13}/> {user.name?.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Sign out">
                  <LogOut size={15}/>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth" className="px-5 py-2 border border-white/20 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:border-white/50 transition-all">Client Login</Link>
                <Link href="/contact" className="px-5 py-2 bg-[#c8921e] rounded-lg text-sm font-bold text-[#0b1f3a] hover:bg-[#e8b84b] transition-all">Consult an Expert</Link>
              </div>
            )}
          </div>

          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden p-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all shrink-0">
            {navOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>

        {navOpen && (
          <div className="md:hidden bg-[#060f1e] border-t border-[rgba(200,146,30,0.1)] px-5 pb-5 pt-3 flex flex-col gap-1 w-full">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setNavOpen(false)} className="block w-full px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all">{label}</Link>
            ))}
            <div className="h-px bg-white/5 my-2" />
            {user ? (
              <>
                <Link href={getPortalLink()} onClick={() => setNavOpen(false)} className="block w-full px-4 py-3 bg-[#c8921e]/10 border border-[#c8921e]/20 rounded-xl text-sm font-semibold text-[#e8b84b] text-center">
                  My Portal — {user.name?.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="w-full px-4 py-3 bg-red-500/5 border border-red-500/10 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all">Sign Out</button>
              </>
            ) : (
              <div className="flex gap-2 mt-1">
                <Link href="/auth" onClick={() => setNavOpen(false)} className="flex-1 px-4 py-3 border border-white/20 rounded-xl text-sm font-medium text-white/80 text-center hover:text-white transition-all">Client Login</Link>
                <Link href="/contact" onClick={() => setNavOpen(false)} className="flex-1 px-4 py-3 bg-[#c8921e] rounded-xl text-sm font-bold text-[#0b1f3a] text-center hover:bg-[#e8b84b] transition-all">Consult Us</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* 1. POSITIONING HERO (Above the fold clarity) */}
      <section className="min-h-[90vh] flex items-center px-5 pt-32 pb-20 bg-[#060f1e] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c8921e]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1a7a4a]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 border border-[#c8921e]/30 bg-[#c8921e]/10 px-4 py-1.5 rounded-full mb-6">
            <ShieldCheck size={14} className="text-[#e8b84b]" />
            <span className="text-[#e8b84b] text-[10px] font-bold uppercase tracking-widest">ISO & NEBOSH Compliant Partner</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-white font-bold leading-[1.1] mb-6 max-w-4xl">
            Enterprise-Grade <span className="text-[#c8921e] italic font-medium">Operations, Safety & Manpower.</span>
          </h1>
          
          <p className="text-white/60 text-base md:text-xl leading-relaxed mb-10 max-w-2xl font-light">
            We help industrial and corporate leaders across West Africa eliminate operational friction. From deploying rigorously vetted technical staff to managing complete HSE compliance and facility infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="bg-[#c8921e] hover:bg-[#e8b84b] text-[#060f1e] px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-xl text-center flex justify-center items-center gap-2">
              Request Corporate Assessment <ArrowRight size={16}/>
            </Link>
            <Link href="/auth" className="border border-white/20 text-white hover:border-white hover:bg-white/5 px-8 py-4 rounded-xl font-bold text-sm transition-all text-center">
              Access Client Portal
            </Link>
          </div>

          {/* Early Authority Stacking */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-white/10">
            {[
              { n: '400+', l: 'Vetted Professionals Deployed' }, 
              { n: '150+', l: 'Enterprise Clients Supported' }, 
              { n: '48hr', l: 'Average Deployment Speed' }, 
              { n: '100%', l: 'Zero-Incident Safety Record' }
            ].map((stat) => (
              <div key={stat.l} className="border-l-2 border-[#c8921e]/30 pl-4">
                <div className="font-serif text-3xl md:text-4xl text-white font-bold mb-1">{stat.n}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-widest font-semibold leading-snug">{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. THE SYSTEM (Process Breakdown to build trust) */}
      <section className="py-24 px-5 bg-white border-b border-[rgba(11,31,58,0.06)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c8921e] text-xs font-bold tracking-widest uppercase mb-3">Our Methodology</p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0b1f3a] max-w-2xl mx-auto leading-tight">
              A structured approach to solving complex operational challenges.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#c8921e]/30 to-transparent" />

            {[
              { 
                step: '01', icon: <Target className="text-[#c8921e]" size={28}/>, 
                title: 'Diagnosis & Audit', 
                desc: 'We do not guess. We begin with a rigorous assessment of your facility, safety protocols, or manpower gaps to identify exactly where you are losing efficiency.'
              },
              { 
                step: '02', icon: <Settings className="text-[#c8921e]" size={28}/>, 
                title: 'Strategic Execution', 
                desc: 'Whether deploying a team of certified engineers, procuring compliant PPE, or executing a deep-clean fumigation, we execute based on data, not assumptions.'
              },
              { 
                step: '03', icon: <Scale className="text-[#c8921e]" size={28}/>, 
                title: 'Management & Scale', 
                desc: 'Through our secure client portal, you track invoices, request new services, and monitor compliance metrics in real-time. We manage the complexity so you can scale.'
              }
            ].map((phase, i) => (
              <div key={i} className="relative bg-[#f9f8f6] rounded-3xl p-8 border border-[rgba(11,31,58,0.04)] hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[rgba(11,31,58,0.06)] mb-6 mx-auto relative z-10">
                  {phase.icon}
                </div>
                <div className="text-center">
                  <span className="text-[#c8921e] text-[10px] font-black uppercase tracking-widest block mb-2">Phase {phase.step}</span>
                  <h3 className="font-serif text-2xl font-bold text-[#0b1f3a] mb-3">{phase.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SERVICE HIERARCHY (Problem -> Solution framing) */}
      <section className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 md:flex justify-between items-end">
            <div className="max-w-2xl">
              <p className="text-[#c8921e] text-xs font-bold tracking-widest uppercase mb-3">Core Divisions</p>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0b1f3a] leading-tight">
                Integrated solutions for modern industries.
              </h2>
            </div>
            <Link href="/contact" className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-[#c8921e] hover:text-[#0b1f3a] transition-colors pb-2">
              Discuss your specific needs <ArrowRight size={16}/>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc) => (
              <Link key={svc.t} href={svc.href} className={`bg-white p-8 rounded-3xl border-t-4 ${svc.border} border-x border-b border-[rgba(11,31,58,0.06)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group block`}>
                <div className="text-4xl mb-6 bg-[#f9f8f6] w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">{svc.i}</div>
                <h3 className="font-serif text-2xl font-bold text-[#0b1f3a] mb-4">{svc.t}</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">The Problem</span>
                    <p className="text-[#0b1f3a] text-sm font-medium leading-snug">{svc.problem}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a7a4a] block mb-1">Our Solution</span>
                    <p className="text-slate-600 text-sm leading-relaxed">{svc.solution}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-[rgba(11,31,58,0.06)] text-xs font-bold text-[#c8921e] group-hover:text-[#0b1f3a] transition-colors">
                  Explore Division <ArrowRight size={14}/>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRUST & AUTHORITY LAYER */}
      <section className="bg-[#060f1e] py-24 px-5 border-y border-white/10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#c8921e] text-xs font-bold tracking-widest uppercase mb-4">Why Industry Leaders Trust OBRUS</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-6">
              We mitigate risk so you can focus on growth.
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-10">
              Partnering with OBRUS means passing the burden of compliance, sourcing, and workforce management to a dedicated, certified team. We operate with strict adherence to national safety and corporate standards.
            </p>
            
            <div className="space-y-6">
              {[
                { i: <ClipboardCheck className="text-[#c8921e]" size={24}/>, t: 'Strict Regulatory Compliance', d: 'All services align with NESREA, DPR, and OSHA regulatory frameworks.' },
                { i: <User className="text-[#c8921e]" size={24}/>, t: 'Pre-Vetted Professional Network', d: 'Every candidate and contractor undergoes rigorous background and technical skill assessments.' },
                { i: <BarChart className="text-[#c8921e]" size={24}/>, t: 'Transparent Client Portal', d: 'Manage requests, track invoices, and review candidate profiles through your secure dashboard.' },
              ].map((pt) => (
                <div key={pt.t} className="flex gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">{pt.i}</div>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-1">{pt.t}</h4>
                    <p className="text-white/40 text-sm leading-relaxed">{pt.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#0b1f3a] to-[#060f1e] rounded-[40px] p-10 md:p-14 border border-[#c8921e]/20 shadow-2xl relative">
            <div className="absolute top-10 right-10 opacity-10">
              <ShieldCheck size={120} className="text-[#c8921e]" />
            </div>
            <h3 className="font-serif text-white text-3xl font-bold mb-6 relative z-10">Ready to streamline your operations?</h3>
            <p className="text-white/60 leading-relaxed mb-10 relative z-10">
              Whether you need to staff an upcoming project, secure facility compliance, or procure safety equipment, our team is ready to deploy.
            </p>
            
            <div className="space-y-4 relative z-10">
              <Link href="/contact" className="w-full flex justify-center items-center gap-2 py-4 bg-[#c8921e] text-[#0b1f3a] rounded-xl font-bold text-sm hover:bg-[#e8b84b] transition-all">
                Book a Strategy Call →
              </Link>
              <Link href="/auth" className="w-full flex justify-center items-center gap-2 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
                Create Employer Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#060f1e] py-16 px-5 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#c8921e] rounded-xl flex items-center justify-center font-black text-[#0b1f3a] text-xl italic">O</div>
                <div>
                  <span className="block text-white font-bold text-base">OBRUS</span>
                  <span className="text-[#e8b84b] text-[10px] uppercase tracking-widest opacity-80">Apex Services</span>
                </div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                Integrated enterprise solutions for recruitment, HSE, and facility management across West Africa.
              </p>
            </div>
            
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-6">Divisions</p>
              <div className="space-y-3">
                {[['Manpower Recruitment', '/recruitment'], ['Environmental Services', '/environmental'], ['Equipment Procurement', '/equipment'], ['HSE Consultancy', '/hse']].map(([label, href]) => (
                  <Link key={href} href={href} className="block text-white/40 text-sm hover:text-[#c8921e] transition-all">{label}</Link>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-6">Client Access</p>
              <div className="space-y-3">
                {[['Employer Portal', '/portal/employer'], ['Service Booking', '/client/portal'], ['Job Board', '/recruitment'], ['Sign In', '/auth']].map(([label, href]) => (
                  <Link key={href} href={href} className="block text-white/40 text-sm hover:text-[#c8921e] transition-all">{label}</Link>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-6">Corporate HQ</p>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-white/40 text-sm">
                  <MapPin size={16} className="text-[#c8921e] mt-0.5 shrink-0"/>
                  <span>Port Harcourt,<br/>Rivers State, Nigeria</span>
                </div>
                <div className="flex items-center gap-3 text-white/40 text-sm">
                  <Mail size={16} className="text-[#c8921e] shrink-0"/>
                  <span>info@obrusapex.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">© {new Date().getFullYear()} OBRUS Apex Integrated Services Ltd. RC: 7249112.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-white/30 text-xs hover:text-[#c8921e] transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-white/30 text-xs hover:text-[#c8921e] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
