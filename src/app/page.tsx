"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Leaf, Menu, X, Check, Users, Zap, Shield, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white text-gray-800 font-sans antialiased min-h-screen flex flex-col">
      {/* NAV */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#257242] rounded-full flex items-center justify-center text-white font-bold">
                <Leaf size={24} />
              </div>
              <span className="font-extrabold text-[#1a2e46] text-lg sm:text-xl leading-tight tracking-tight">
                OBRUS APEX<br />SERVICES
              </span>
            </Link>
            
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#1a2e46] hover:text-[#257242] focus:outline-none transition-colors">
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-[#1a2e46] hover:text-[#257242] font-semibold transition">Home</Link>
              <Link href="#about" className="text-gray-600 hover:text-[#257242] font-medium transition">About</Link>
              <Link href="/recruitment" className="text-gray-600 hover:text-[#257242] font-medium transition">Services</Link>
              <Link href="/contact" className="text-gray-600 hover:text-[#257242] font-medium transition">Contact</Link>
              <Link href="/auth" className="bg-[#1a2e46] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#257242] transition shadow-md">
                Portal Login
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-6 shadow-xl absolute w-full">
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="/" className="text-[#1a2e46] font-semibold">Home</Link>
              <Link href="#about" className="text-gray-600 font-medium">About</Link>
              <Link href="/recruitment" className="text-gray-600 font-medium">Services</Link>
              <Link href="/contact" className="text-gray-600 font-medium">Contact</Link>
              <Link href="/auth" className="bg-[#257242] text-white px-4 py-3 rounded-lg font-bold text-center mt-2 shadow-sm">
                Portal Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-green-50 to-blue-50 min-h-[480px]">
        {/* Background image pinned to right */}
        <div className="absolute right-0 top-0 h-full w-1/2 lg:w-[55%] hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=1200&auto=format&fit=crop"
            alt="Engineering and Operations"
            className="h-full w-full object-cover object-left"
          />
          {/* Fade left so text stays readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent"></div>
        </div>

        {/* Mobile background image overlay (since original didn't handle mobile bg well) */}
        <div className="absolute inset-0 md:hidden opacity-10">
           <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=1200&auto=format&fit=crop"
            alt="Engineering and Operations"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Text content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-24 z-10">
          <div className="max-w-lg">
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-[#1a2e46] leading-tight mb-6">
              Reliable <span className="text-[#257242]">Manpower</span>,<br />
              Safer <span className="text-[#257242]">Operations</span>, and<br />
              Efficient <span className="text-[#257242]">Growth</span> —<br />
              <span className="text-[#1a2e46]">All in One Place.</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
              Streamline your operations, reduce risks, and maintain peak performance with our expert recruitment, HSE solutions, and facility management services.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth" className="text-center bg-[#257242] text-white px-6 py-3.5 rounded-lg font-bold hover:bg-green-800 transition shadow-md text-sm sm:text-base">
                Request a Consultation
              </Link>
              <Link href="/recruitment" className="text-center bg-white text-[#1a2e46] border-2 border-[#1a2e46] px-6 py-3.5 rounded-lg font-bold hover:bg-gray-50 transition text-sm sm:text-base">
                Explore Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a2e46] mb-4">Our Services</h2>
            <p className="text-base sm:text-lg text-gray-600">
              We provide tailored solutions designed to improve efficiency, ensure safety,<br className="hidden sm:block" />
              and support your business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-white px-4 pt-5 pb-3 font-extrabold text-[#1a2e46] text-lg text-center leading-tight">
                Recruitment<br />&amp; Manpower
              </div>
              <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop" alt="Recruitment" className="h-40 w-full object-cover" />
              <div className="p-5 flex-grow flex flex-col">
                <ul className="space-y-3 text-gray-600 text-sm flex-grow mb-6">
                  <li className="flex items-start gap-2.5">
                    <Check className="text-[#257242] mt-0.5 shrink-0" size={16} />
                    <span>Pre-screened and qualified candidates</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="text-[#257242] mt-0.5 shrink-0" size={16} />
                    <span>Faster hiring turnaround</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="text-[#257242] mt-0.5 shrink-0" size={16} />
                    <span>Reduced recruitment risks</span>
                  </li>
                </ul>
                <Link href="/auth" className="text-center w-full bg-[#257242] text-white py-3 rounded-lg font-bold text-sm hover:bg-green-800 transition">
                  Request Qualified Staff
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-white px-4 pt-5 pb-3 font-extrabold text-[#1a2e46] text-lg text-center leading-tight">
                Facility<br />Management
              </div>
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop" alt="Facility Management" className="h-40 w-full object-cover" />
              <div className="p-5 flex-grow flex flex-col">
                <ul className="space-y-3 text-gray-600 text-sm flex-grow mb-6">
                  <li className="flex items-start gap-2.5">
                    <Check className="text-[#257242] mt-0.5 shrink-0" size={16} />
                    <span>Consistent maintenance and monitoring</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="text-[#257242] mt-0.5 shrink-0" size={16} />
                    <span>Reduced downtime and operational failures</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="text-[#257242] mt-0.5 shrink-0" size={16} />
                    <span>Improved efficiency and productivity</span>
                  </li>
                </ul>
                <Link href="/auth" className="text-center w-full bg-[#257242] text-white py-3 rounded-lg font-bold text-sm hover:bg-green-800 transition">
                  Book Facility Assessment
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-white px-4 pt-5 pb-3 font-extrabold text-[#1a2e46] text-lg text-center leading-tight">
                HSE<br />Consultancy
              </div>
              <img src="https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?q=80&w=600&auto=format&fit=crop" alt="HSE Consultancy" className="h-40 w-full object-cover" />
              <div className="p-5 flex-grow flex flex-col">
                <ul className="space-y-3 text-gray-600 text-sm flex-grow mb-6">
                  <li className="flex items-start gap-2.5">
                    <Check className="text-[#1a2e46] mt-0.5 shrink-0" size={16} />
                    <span>Comprehensive risk assessments</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="text-[#1a2e46] mt-0.5 shrink-0" size={16} />
                    <span>Safety policies and procedures</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="text-[#1a2e46] mt-0.5 shrink-0" size={16} />
                    <span>Regulatory compliance support</span>
                  </li>
                </ul>
                <Link href="/auth" className="text-center w-full bg-[#1a2e46] text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-900 transition">
                  Schedule HSE Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a2e46] mb-4">Why Choose Us</h2>
            <p className="text-base sm:text-lg text-gray-600">We go beyond service delivery — we become an extension of your team.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Users className="text-[#257242]" size={24} />
              </div>
              <h3 className="font-extrabold text-[#1a2e46] text-lg mb-2">Expert Team</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Seasoned professionals across recruitment, facility ops, and HSE compliance.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Zap className="text-[#257242]" size={24} />
              </div>
              <h3 className="font-extrabold text-[#1a2e46] text-lg mb-2">Rapid Deployment</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Qualified personnel and solutions delivered quickly when your business needs it most.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Shield className="text-[#257242]" size={24} />
              </div>
              <h3 className="font-extrabold text-[#1a2e46] text-lg mb-2">Safety First</h3>
              <p className="text-gray-500 text-sm leading-relaxed">HSE frameworks built for high-stakes industries — no shortcuts, no compromises.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <TrendingUp className="text-[#257242]" size={24} />
              </div>
              <h3 className="font-extrabold text-[#1a2e46] text-lg mb-2">Growth Focused</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Every solution is designed to reduce costs, cut downtime, and drive operational ROI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1a2e46]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">Ready to optimise your operations?</h2>
          <p className="text-gray-300 text-lg sm:text-xl mb-10">Talk to our team today and get a plan tailored to your business.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth" className="bg-[#257242] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-800 transition shadow-lg">
              Request a Consultation
            </Link>
            <Link href="/recruitment" className="bg-white text-[#1a2e46] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#112031] text-white py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm font-medium tracking-wide">
          &copy; {new Date().getFullYear()} OBRUS Apex Services. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
