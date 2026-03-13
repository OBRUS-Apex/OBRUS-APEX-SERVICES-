"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, PhoneCall, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
   
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Signed out successfully");
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Recruitment", href: "/recruitment" },
    { name: "Environmental", href: "/environmental" },
    { name: "HSE", href: "/hse" },
    { name: "Equipment", href: "/equipment" },
  ];

 
  const isTransparentPage = pathname === "/";
  const navBg = scrolled || !isTransparentPage ? "bg-navy-deep/95 backdrop-blur-lg border-gold/20 shadow-xl" : "bg-transparent border-transparent";

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 border-b ${navBg} py-3`}>
      <div className="max-w-7xl mx-auto px-[5%] flex justify-between items-center">
        
       
        <Link href="/" className="flex items-center gap-3 group">
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
            <span className="font-serif font-bold text-white text-xl leading-none tracking-tight">OBRUS</span>
            <span className="text-gold-lt text-[10px] uppercase tracking-[0.2em] font-bold">Apex Services</span>
          </div>
        </Link>

        
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${
                pathname === link.href ? "text-gold bg-gold/5" : "text-white/70 hover:text-gold-lt hover:bg-gold/10"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="h-6 w-[1px] bg-white/20 mx-4" />

         
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="flex items-center gap-2 text-gold-lt text-[13px] font-bold hover:text-white transition-colors">
                    <ShieldCheck size={16} /> Admin Panel
                  </Link>
                )}
                
                <div className="h-8 w-[1px] bg-white/10" />
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-white/60 hover:text-red-400 text-[13px] font-medium transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link 
                href="/auth" 
                className="text-white/80 hover:text-white px-4 py-2 text-[13px] font-medium transition-all border border-white/10 rounded-full hover:border-gold"
              >
                Sign In
              </Link>
            )}

            <Link href="/contact" className="bg-gradient-to-r from-gold to-gold-lt text-navy px-6 py-2.5 rounded-full font-bold text-[13px] flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg shadow-gold/20">
              <PhoneCall className="w-3.5 h-3.5" /> Request Quote
            </Link>
          </div>
        </div>

        
        <button className="lg:hidden text-gold p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      
      <div className={`absolute top-full left-0 w-full bg-navy-deep border-t border-gold/30 shadow-2xl lg:hidden flex flex-col p-6 gap-2 transition-all duration-300 origin-top ${
        isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
      }`}>
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            onClick={() => setIsOpen(false)}
            className="text-white/80 font-medium text-base p-4 hover:bg-gold/10 rounded-xl"
          >
            {link.name}
          </Link>
        ))}

        <div className="h-[1px] bg-white/10 my-4" />

        <div className="space-y-4">
          {user && user.role === 'admin' && (
            <Link 
              href="/admin/dashboard" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-gold-lt font-bold p-4 bg-gold/5 rounded-xl"
            >
              <LayoutDashboard size={20} /> Admin Dashboard
            </Link>
          )}

          {user ? (
            <button 
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="w-full text-left flex items-center gap-3 text-red-400 font-bold p-4 bg-red-500/5 rounded-xl"
            >
              <LogOut size={20} /> Sign Out
            </button>
          ) : (
            <Link 
              href="/auth" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-center border border-gold text-gold font-bold p-4 rounded-xl"
            >
              Sign In to Portal
            </Link>
          )}

          <Link 
            href="/contact" 
            onClick={() => setIsOpen(false)}
            className="block w-full text-center bg-gold text-navy font-bold p-4 rounded-xl"
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;