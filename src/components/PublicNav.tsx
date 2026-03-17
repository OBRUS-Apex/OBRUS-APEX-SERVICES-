"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, User } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/recruitment', label: 'Recruitment' },
  { href: '/environmental', label: 'Environmental' },
  { href: '/equipment', label: 'Equipment' },
  { href: '/hse', label: 'HSE' },
];

export default function PublicNav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('user');
    if (session) setUser(JSON.parse(session));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setOpen(false);
    router.push('/');
  };

  const getPortalLink = () => {
    if (!user) return '/auth';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.userType === 'employer') return '/portal/employer';
    return '/client/portal';
  };

  return (
    <nav
      className="fixed top-0 left-0 z-50 bg-[rgba(6,10,20,0.96)] backdrop-blur border-b border-[rgba(200,146,30,0.16)]"
      style={{ width: '100vw', right: 0 }}
    >
      {/* Top bar */}
      <div className="px-5 h-16 flex items-center justify-between max-w-7xl mx-auto">
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

          <div className="w-px h-5 bg-white/10 mx-2" />

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={getPortalLink()}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#c8921e]/10 border border-[#c8921e]/30 rounded-lg text-sm text-[#e8b84b] font-semibold hover:bg-[#c8921e]/20 transition-all"
              >
                <User size={13}/>
                {user.name?.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                title="Sign out"
              >
                <LogOut size={15}/>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth" className="px-4 py-1.5 border border-white/20 rounded-lg text-sm text-white/70 hover:text-white hover:border-white/50 transition-all">
                Sign In
              </Link>
              <Link href="/auth" className="px-4 py-1.5 bg-[#c8921e] rounded-lg text-sm font-bold text-[#0b1f3a] hover:bg-[#e8b84b] transition-all">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all shrink-0"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
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

          <div className="h-px bg-white/5 my-2" />

          {user ? (
            <>
              <Link
                href={getPortalLink()}
                onClick={() => setOpen(false)}
                className="block w-full px-4 py-3 bg-[#c8921e]/10 border border-[#c8921e]/20 rounded-xl text-sm font-semibold text-[#e8b84b] text-center"
              >
                My Portal — {user.name?.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-3 bg-red-500/5 border border-red-500/10 rounded-xl text-sm font-semibold text-red-400 text-center hover:bg-red-500/10 transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 mt-1">
              <Link href="/auth" onClick={() => setOpen(false)} className="flex-1 px-4 py-3 border border-white/20 rounded-xl text-sm text-white/70 text-center hover:text-white transition-all">
                Sign In
              </Link>
              <Link href="/auth" onClick={() => setOpen(false)} className="flex-1 px-4 py-3 bg-[#c8921e] rounded-xl text-sm font-bold text-[#0b1f3a] text-center hover:bg-[#e8b84b] transition-all">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
