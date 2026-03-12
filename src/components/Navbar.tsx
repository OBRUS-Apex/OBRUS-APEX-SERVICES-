"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, PhoneCall } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Recruitment", href: "/recruitment" },
    { name: "Environmental", href: "/environmental" },
    { name: "HSE", href: "/hse" },
    { name: "Equipment", href: "/equipment" },
  ];

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 border-b ${
      scrolled 
        ? "bg-navy-deep/95 backdrop-blur-lg py-3 border-gold/20" 
        : "bg-transparent py-5 border-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-[5%] flex justify-between items-center">
        
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="OBRUS Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="w-12 h-12 bg-gold rounded flex items-center justify-center font-bold text-navy text-xl">O</div>';
              }}
            />
          </div>

          <div className="flex flex-col">
            <span className="font-serif font-bold text-white text-2xl leading-none tracking-tight">
              OBRUS
            </span>
            <span className="text-gold-lt text-[10px] uppercase tracking-[0.2em] font-medium">
              Apex Services
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-white/70 hover:text-gold-lt hover:bg-gold/10 px-4 py-2 rounded-md text-[13px] font-medium transition-all"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-6 w-[1px] bg-white/20 mx-4" />

          <Link 
            href="/auth" 
            className="text-white/80 hover:text-white px-4 py-2 text-[13px] font-medium transition-all"
          >
            Login
          </Link>
          
          <Link href="/contact" className="bg-gradient-to-r from-gold to-gold-lt text-navy px-6 py-2 rounded-full font-bold text-[13px] flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg shadow-gold/20">
            <PhoneCall className="w-3.5 h-3.5" /> Request Quote
          </Link>
        </div>

        <button className="lg:hidden text-gold" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div className={`absolute top-full left-0 w-full bg-navy-deep border-t-2 border-gold shadow-2xl lg:hidden flex flex-col p-6 gap-2 transition-all duration-300 origin-top ${
        isOpen ? "scale-y-100 opacity-100 visible" : "scale-y-0 opacity-0 invisible"
      }`}>
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            onClick={() => setIsOpen(false)}
            className="text-white/80 font-medium text-base p-3 hover:bg-gold/10 rounded-lg hover:text-gold-lt"
          >
            {link.name}
          </Link>
        ))}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
          <Link href="/auth" onClick={() => setIsOpen(false)} className="text-white border border-white/20 text-center py-3 rounded-lg font-bold">
            Login
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="bg-gold text-navy text-center py-3 rounded-lg font-bold">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;