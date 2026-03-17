"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/recruitment', label: 'Recruitment' },
  { href: '/environmental', label: 'Environmental' },
  { href: '/equipment', label: 'Equipment' },
  { href: '/hse', label: 'HSE' },
];

export default function PublicNav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 z-50 bg-[rgba(6,10,20,0.96)] backdrop-blur border-b border-[rgba(200,146,30,0.16)]"
      style={{ width: '100vw', right: 0 }}
    >
      {/* Top bar */}
      <div className="px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 shrink-0 min-w-0">
          <div className="w-8 h-8 bg-[#c8921e] rounded-lg flex items-center justify-center font-black text-[#0b1f3a] text-base italic shrink-0">O</div>
          <div className="min-w-0">
            <span className="block text-white font-bold text-sm leading-none">OBRUS</span>
            <span className="text-[#e8b84b] text-[9px] uppercase tracking-widest">Apex Services</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${href === active ? 'bg-[rgba(200,146,30,0.15)] text-[#e8b84b]' : 'text-white/60 hover:text-[#e8b84b] hover:bg-[rgba(200,146,30,0.1)]'}`}
            >
              {label}
            </Link>
          ))}
          <Link href="/auth" className="ml-2 px-4 py-1.5 border border-white/20 rounded-lg text-sm text-white/70 hover:text-white hover:border-white/50 transition-all">
            Sign In
          </Link>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all shrink-0"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu — anchored to nav, no overflow */}
      {open && (
        <div className="md:hidden bg-[#060f1e] border-t border-[rgba(200,146,30,0.1)] px-5 pb-5 pt-3 flex flex-col gap-1" style={{ width: '100%' }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${href === active ? 'bg-[rgba(200,146,30,0.15)] text-[#e8b84b]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/auth"
            onClick={() => setOpen(false)}
            className="block w-full mt-2 px-4 py-3 border border-white/20 rounded-xl text-sm text-white/70 hover:text-white hover:border-white/50 transition-all text-center"
          >
            Sign In to Portal
          </Link>
        </div>
      )}
    </nav>
  );
}
