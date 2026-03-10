import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  Trash2, 
  Briefcase, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  Award,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent z-10" />
          <img 
            src="" 
            alt="Corporate Office"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Trusted by Industry Leaders
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1]">
              Integrated <br />
              <span className="text-accent">Solutions</span> for Modern Enterprise.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
              OBRUS APEX SERVICES delivers excellence in manpower outsourcing, environmental management, 
              and technical consultancy. We ensure your operations remain seamless and compliant.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/services" className="btn-primary flex items-center gap-2 group">
                Explore Services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="px-8 py-3 rounded-md font-semibold text-white border border-gray-500 hover:bg-white hover:text-primary transition-all">
                Request a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Services Offered", value: "10+" },
              { label: "Client Satisfaction", value: "99%" },
              { label: "Operational Safety", value: "100%" },
              { label: "Response Time", value: "< 24h" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img 
            src="" 
            alt="Professional Consultation"
            className="rounded-2xl shadow-2xl"
          />
          <div className="absolute -bottom-6 -right-6 bg-accent p-8 rounded-2xl hidden md:block">
            <Award className="w-12 h-12 text-primary" />
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-accent font-bold tracking-[0.2em] uppercase text-sm">About OBRUS APEX</h4>
          <h2 className="text-4xl font-bold text-primary leading-tight">
            Commitment to Quality, <br />Driven by Integrity.
          </h2>
          <p className="text-gray-600 text-lg">
            With years of expertise, OBRUS APEX SERVICES has grown into a multi-disciplinary service provider. 
            We don't just provide services; we build strategic partnerships that allow our clients to focus on their core business.
          </p>
          <ul className="space-y-4">
            {[
              "Adherence to International HSE Standards",
              "Highly Skilled and Vetted Personnel",
              "Cutting-edge Equipment and Technology",
              "Transparent and Competitive Pricing"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 font-medium text-primary">
                <CheckCircle2 className="text-accent w-5 h-5" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bg-slate-50 section-padding">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h4 className="text-accent font-bold tracking-[0.2em] uppercase text-sm mb-2">Expertise</h4>
            <h2 className="text-4xl font-bold text-primary">Our Operational Pillars</h2>
          </div>
          <Link href="/services" className="text-primary font-bold flex items-center gap-2 hover:text-accent transition-colors">
            View All Services <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              title: "Recruitment & Outsourcing", 
              desc: "Connecting top-tier talent with organizations through rigorous vetting.",
              icon: <Users className="w-10 h-10" /> 
            },
            { 
              title: "Waste Management", 
              desc: "Comprehensive refuse evacuation and environmental sanitation services.",
              icon: <Trash2 className="w-10 h-10" /> 
            },
            { 
              title: "HSE Consultancy", 
              desc: "Professional safety training and industrial compliance advisory.",
              icon: <ShieldCheck className="w-10 h-10" /> 
            },
            { 
              title: "Facility Maintenance", 
              desc: "End-to-end general maintenance and structural management.",
              icon: <Briefcase className="w-10 h-10" /> 
            },
            { 
              title: "Cleaning & Fumigation", 
              desc: "Industrial grade janitorial services and pest control solutions.",
              icon: <CheckCircle2 className="w-10 h-10" /> 
            },
            { 
              title: "Procurement & Supply", 
              desc: "Provision of high-quality safety equipment and industrial PPE.",
              icon: <BarChart3 className="w-10 h-10" /> 
            },
          ].map((s, i) => (
            <div key={i} className="bg-white p-10 rounded-xl border border-gray-100 hover:shadow-2xl transition-all group">
              <div className="text-accent mb-6 group-hover:scale-110 transition-transform duration-300 italic">
                {s.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">{s.title}</h3>
              <p className="text-gray-500 leading-relaxed mb-6">{s.desc}</p>
              <Link href="/services" className="inline-flex items-center text-sm font-bold text-primary group-hover:text-accent">
                Read More <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ))}
        </div>
      </section>

     
      <section className="bg-primary py-24 px-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-accent/10 skew-x-12 translate-x-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Build Your Career With Us</h2>
          <p className="text-gray-300 text-lg mb-10">
            We are always looking for dedicated professionals to join our growing team. 
            Check our latest job openings and take the next step in your career.
          </p>
          <Link href="/jobs" className="bg-accent text-primary px-10 py-4 rounded-md font-bold text-lg hover:bg-white transition-colors inline-block">
            Browse Job Vacancies
          </Link>
        </div>
      </section>

    </div>
  );
}