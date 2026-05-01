import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'INDEX', href: '#home' },
  { name: 'PROFILE', href: '#about' },
  { name: 'WORKS', href: '#works' },
  { name: 'PROCESS', href: '#process' },
  { name: 'CONTACT', href: '#contact' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 px-12 py-8 transition-all duration-500",
      isScrolled ? "bg-cream/60 backdrop-blur-md border-b border-mist/30 py-6" : "bg-transparent"
    )}>
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        <div className="text-sm tracking-[0.4em] font-medium uppercase text-dust-gray">
          Jun Studio<span className="text-tea">.</span>
        </div>
        <div className="flex space-x-12">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              className="group relative flex flex-col items-start transition-all"
            >
              <span className="text-[10px] tracking-[0.2em] font-medium uppercase opacity-40 group-hover:opacity-100 transition-all">
                {item.name}
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-dust-gray group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
        <button className="text-[10px] tracking-widest uppercase border border-dust-gray/20 px-8 py-3 rounded-full hover:bg-dust-gray hover:text-cream transition-all duration-500 font-medium">
          HAVE A CHAT
        </button>
      </div>
    </nav>
  );
};
