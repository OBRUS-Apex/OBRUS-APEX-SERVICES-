import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
     
        <div className="space-y-6">
          <h3 className="text-2xl font-bold italic">OBRUS APEX</h3>
          <p className="text-gray-400 leading-relaxed">
            Leading provider of integrated facility management, manpower outsourcing, 
            and environmental solutions for corporate and industrial clients.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="p-2 bg-primary-light hover:bg-accent rounded-full transition-colors"><Facebook size={18} /></Link>
            <Link href="#" className="p-2 bg-primary-light hover:bg-accent rounded-full transition-colors"><Linkedin size={18} /></Link>
            <Link href="#" className="p-2 bg-primary-light hover:bg-accent rounded-full transition-colors"><Twitter size={18} /></Link>
          </div>
        </div>

       
        <div>
          <h4 className="text-lg font-bold mb-6 text-accent">Quick Links</h4>
          <ul className="space-y-4 text-gray-400">
            <li><Link href="/about" className="hover:text-white transition-colors">About Our Company</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">Our Solutions</Link></li>
            <li><Link href="/jobs" className="hover:text-white transition-colors">Career Opportunities</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            <li><Link href="/admin/login" className="hover:text-white transition-colors text-xs opacity-50">Admin Portal</Link></li>
          </ul>
        </div>

        
        <div>
          <h4 className="text-lg font-bold mb-6 text-accent">Core Services</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="hover:text-white transition-colors cursor-pointer">Manpower Outsourcing</li>
            <li className="hover:text-white transition-colors cursor-pointer">Waste Management</li>
            <li className="hover:text-white transition-colors cursor-pointer">HSE Training</li>
            <li className="hover:text-white transition-colors cursor-pointer">Industrial Cleaning</li>
            <li className="hover:text-white transition-colors cursor-pointer">Pest Control</li>
          </ul>
        </div>

        
        <div>
          <h4 className="text-lg font-bold mb-6 text-accent">Get In Touch</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-gray-400">
              <MapPin className="text-accent shrink-0" size={20} />
              <span>Head Office Address, City, State, Country</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <Phone className="text-accent shrink-0" size={20} />
              <span>+234 (0) 123 456 789</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <Mail className="text-accent shrink-0" size={20} />
              <span>info@obrusapex.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} OBRUS Integrated Services. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;