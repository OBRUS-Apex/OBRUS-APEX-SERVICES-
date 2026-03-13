"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <footer className="bg-navy-deep text-white">
      {isHomePage && (
        <div className="max-w-7xl mx-auto px-[5%] pt-20 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl border border-gold/20 p-1">
            <img 
              src="/logo.png" 
              alt="OBRUS Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/1063/1063251.png";
              }}
            />
          </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-white text-xl leading-none">OBRUS</span>
                <span className="text-gold-lt text-[10px] uppercase tracking-widest">Apex Services</span>
              </div>
            </div>
            <p className="text-slate text-sm leading-relaxed">
              Nigeria's leading provider of integrated facility management, manpower outsourcing, 
              and environmental solutions for corporate and industrial clients.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-gold hover:text-gold rounded-lg transition-all"><Facebook size={18} /></Link>
              <Link href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-gold hover:text-gold rounded-lg transition-all"><Linkedin size={18} /></Link>
              <Link href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-gold hover:text-gold rounded-lg transition-all"><Twitter size={18} /></Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-gold uppercase tracking-[0.2em]">Quick Links</h4>
            <ul className="space-y-4 text-slate text-sm">
              <li><Link href="/about" className="hover:text-gold-lt transition-colors">About Company</Link></li>
              <li><Link href="/services" className="hover:text-gold-lt transition-colors">Our Solutions</Link></li>
              <li><Link href="/recruitment" className="hover:text-gold-lt transition-colors">Career Opportunities</Link></li>
              <li><Link href="/contact" className="hover:text-gold-lt transition-colors">Contact Support</Link></li>
              <li><Link href="/login" className="hover:text-gold-lt transition-colors opacity-50 text-xs">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-gold uppercase tracking-[0.2em]">Core Divisions</h4>
            <ul className="space-y-4 text-slate text-sm font-medium">
              <li className="hover:text-white transition-colors cursor-pointer">Manpower Outsourcing</li>
              <li className="hover:text-white transition-colors cursor-pointer">Waste Management</li>
              <li className="hover:text-white transition-colors cursor-pointer">HSE Consultancy</li>
              <li className="hover:text-white transition-colors cursor-pointer">Equipment Supply</li>
              <li className="hover:text-white transition-colors cursor-pointer">Industrial Cleaning</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-gold uppercase tracking-[0.2em]">Office</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-slate">
                <MapPin className="text-gold shrink-0" size={18} />
                <span>Port Harcourt, Rivers State, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-slate">
                <Phone className="text-gold shrink-0" size={18} />
                <span>+234 800 OBRUS APEX</span>
              </li>
              <li className="flex items-center gap-3 text-slate">
                <Mail className="text-gold shrink-0" size={18} />
                <span>info@obrusapex.com</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-6 py-8 text-center text-slate text-xs ${isHomePage ? "border-t border-white/5" : ""}`}>
        <p>&copy; 2026 OBRUS APEX SERVICES. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;