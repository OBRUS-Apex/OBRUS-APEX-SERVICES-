"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, PhoneCall } from "lucide-react";

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
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Careers", href: "/jobs" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-bold text-primary text-xl">
            O
          </div>
          <span className={`font-bold text-xl tracking-tighter ${scrolled ? "text-primary" : "text-white"}`}>
            OBRUS <span className="text-accent">APEX</span>
          </span>
        </Link>

        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`font-medium hover:text-accent transition-colors ${
                scrolled ? "text-primary" : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary !py-2 flex items-center gap-2">
            <PhoneCall className="w-4 h-4" /> Request Quote
          </Link>
        </div>

        
        <button className="md:hidden text-accent" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

     
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t md:hidden flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className="text-primary font-semibold text-lg border-b pb-2"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary text-center">Get Started</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;