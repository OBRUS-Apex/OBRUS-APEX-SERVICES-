"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, ShieldCheck, Zap, Menu, X, Phone, Mail, 
  Briefcase, BarChart, Settings, CheckCircle, User, LogOut,
  Target, ClipboardCheck, Scale, MapPin, Award, Check
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
    headline: 'Qualified Professionals, Ready to Drive Your Success.',
    desc: 'Our recruitment team sources, vets, and deploys highly skilled professionals tailored to your operational needs. We ensure that your workforce is competent, reliable, and aligned with your business goals, so you can focus on growth without worrying about staffing challenges.', 
    i: '👥', border: 'border-[#c8921e]', href: '/recruitment', cta: 'Request Staffing Solutions'
  },
  { 
    t: 'Facility & Operations Management', 
    headline: 'Keeping Your Facilities Safe, Efficient, and Compliant.',
    desc: 'We provide comprehensive facility management services, ensuring your business premises are well-maintained, operationally efficient, and fully compliant with industry standards. From routine maintenance to project oversight, we keep your operations running seamlessly.', 
    i: '🏗️', border: 'border-[#1a7a4a]', href: '/environmental', cta: 'Learn More About Facility Management'
  },
  { 
    t: 'HSE & Safety Consultancy', 
    headline: 'Safety and Compliance You Can Trust.',
    desc: 'Our HSE experts offer practical, industry-aligned safety solutions that protect your staff, assets, and operations. We conduct risk assessments, develop safety protocols, and ensure your business complies with all health, safety, and environmental regulations.', 
    i: '🛡️', border: 'border-[#c8921e]', href: '/hse', cta: 'Schedule a Safety Consultation'
  },
  { 
    t: 'Equipment & Supplies Procurement', 
    headline: 'Reliable Equipment, Delivered On Time.',
    desc: 'We streamline procurement of quality equipment and materials for your projects. With a focus on cost-efficiency, quality, and timely delivery, we ensure your operations have the tools needed for success.', 
    i: '⚙️', border: 'border-[#0b1f3a]', href: '/equipment', cta: 'Request Procurement Assistance'
  }
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
                <Link href="/contact" className="px-5 py-2 bg-[#c8921e] rounded-lg text-sm font-bold text-[#0b1f3a] hover:bg-[#e8b84b] transition-all">Contact Us Today</Link>
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
                <Link href="/contact" onClick={() => setNavOpen(false)} className="flex-1 px-4 py-3 bg-[#c8921e] rounded-xl text-sm font-bold text-[#0b1f3a] text-center hover:bg-[#e8b84b] transition-all">Contact Us</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* 1. POSITIONING HERO (Client Copy) */}
      <section className="min-h-[90vh] flex items-center px-5 pt-32 pb-20 bg-[#060f1e] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c8921e]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1a7a4a]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 border border-[#c8921e]/30 bg-[#c8921e]/10 px-4 py-1.5 rounded-full mb-6">
            <ShieldCheck size={14} className="text-[#e8b84b]" />
            <span className="text-[#e8b84b] text-[10px] font-bold uppercase tracking-widest">Obrus Apex Services</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-[1.1] mb-6 max-w-4xl">
            Your Partner in <span className="text-[#c8921e] italic font-medium">Excellence, Safety, and Operational Efficiency.</span>
          </h1>
          
          <p className="text-white/80 text-lg md:text-xl font-medium mb-4 max-w-3xl">
            Trusted solutions in facility management, HSE compliance, manpower deployment, and project support — tailored for your business success.
          </p>

          <p className="text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-3xl font-light">
            At Obrus Apex Services, we combine expertise, innovation, and reliability to provide solutions that help your business thrive. From managing facilities to deploying qualified professionals, ensuring safety compliance, and procuring project equipment, we deliver services that make operations smoother, safer, and more efficient.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="bg-[#c8921e] hover:bg-[#e8b84b] text-[#060f1e] px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-xl text-center flex justify-center items-center gap-2">
              Request a Consultation <ArrowRight size={16}/>
            </Link>
            <Link href="#services" className="border border-white/20 text-white hover:border-white hover:bg-white/5 px-8 py-4 rounded-xl font-bold text-sm transition-all text-center">
              View Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION (Client Copy) */}
      <section id="services" className="py-24 px-5 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-[#c8921e] text-xs font-bold tracking-widest uppercase mb-3">What We Do</p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0b1f3a] leading-tight">
              Our Core Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((svc) => (
              <div key={svc.t} className={`bg-white p-8 md:p-10 rounded-3xl border-t-4 ${svc.border} border-x border-b border-[rgba(11,31,58,0.06)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full`}>
                <div className="text-4xl mb-6 bg-[#f9f8f6] w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform shrink-0">{svc.i}</div>
                <h3 className="font-serif text-2xl font-bold text-[#0b1f3a] mb-2">{svc.t}</h3>
                <h4 className="text-[#c8921e] text-sm font-bold mb-4">{svc.headline}</h4>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1">
                  {svc.desc}
                </p>

                <Link href={svc.href} className="inline-flex items-center gap-2 pt-5 border-t border-[rgba(11,31,58,0.06)] text-sm font-bold text-[#0b1f3a] group-hover:text-[#c8921e] transition-colors mt-auto">
                  {svc.cta} <ArrowRight size={16}/>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT / WHY CHOOSE US (Client Copy) */}
      <section className="bg-[#060f1e] py-24 px-5 border-y border-white/10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#c8921e] text-xs font-bold tracking-widest uppercase mb-4">Why Choose Us</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-10">
              Expertise. Reliability. Operational Excellence.
            </h2>
            
            <div className="space-y-6">
              {[
                { i: <Award className="text-[#c8921e]" size={24}/>, t: 'Proven Track Record', d: 'Years of experience delivering results across multiple industries.' },
                { i: <Settings className="text-[#c8921e]" size={24}/>, t: 'Tailored Solutions', d: 'Services customized specifically for your unique operational needs.' },
                { i: <Zap className="text-[#c8921e]" size={24}/>, t: 'Efficiency & Reliability', d: 'Timely execution of projects without ever compromising on quality.' },
                { i: <ShieldCheck className="text-[#c8921e]" size={24}/>, t: 'Safety & Compliance', d: 'Every solution is meticulously designed to meet strict regulatory standards.' },
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
          
          <div className="bg-[#0b1f3a] rounded-[40px] p-10 md:p-14 border border-[#c8921e]/20 shadow-2xl relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 opacity-5">
              <ShieldCheck size={250} className="text-[#c8921e]" />
            </div>
            
            <div className="relative z-10">
              <p className="text-[#c8921e] text-xs font-bold tracking-widest uppercase mb-4">Take Action</p>
              <h3 className="font-serif text-white text-3xl md:text-4xl font-bold mb-6">Let’s Elevate Your Business Together.</h3>
              <p className="text-white/60 leading-relaxed mb-10">
                Ready to streamline operations, ensure safety compliance, or deploy skilled manpower? Contact us today to speak with our experts or request a personalized consultation.
              </p>
              
              <div className="space-y-4">
                <Link href="/contact" className="w-full flex justify-center items-center gap-2 py-4 bg-[#c8921e] text-[#0b1f3a] rounded-xl font-bold text-sm hover:bg-[#e8b84b] transition-all">
                  Request a Consultation →
                </Link>
                <Link href="/contact" className="w-full flex justify-center items-center gap-2 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#060f1e] py-16 px-5">
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
                Expert facility management, HSE compliance, manpower deployment, and equipment procurement solutions.
              </p>
            </div>
            
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-6">Divisions</p>
              <div className="space-y-3">
                {[['Manpower Recruitment', '/recruitment'], ['Facility Management', '/environmental'], ['Equipment Procurement', '/equipment'], ['HSE Consultancy', '/hse']].map(([label, href]) => (
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
            <p className="text-white/30 text-xs">© {new Date().getFullYear()} Obrus Apex Services. All Rights Reserved.</p>
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
