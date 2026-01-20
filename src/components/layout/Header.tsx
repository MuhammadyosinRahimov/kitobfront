'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LogOut, User as UserIcon, Settings, Heart, 
  Menu, X, BookOpen, Sparkles, ChevronDown 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/books', label: 'Каталог' },
  ];

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[10000] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
        isScrolled 
          ? "py-4 bg-[#F6F9FF]/80 backdrop-blur-2xl border-b border-neutral-100 shadow-xl shadow-blue-500/5 translate-y-0" 
          : "py-8 bg-transparent"
      )}>
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between">
            {/* Logo Section */}
            <Link href="/" className="group flex items-center gap-4 relative z-50">
              <div className="relative w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-2xl">
                 <BookOpen size={24} strokeWidth={2.5} />
                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-neutral-900 leading-none">Science<span className="text-blue-600 italic">Hub</span></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mt-1">Digital Archive</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 px-2 py-2 glass-pro rounded-full border border-neutral-100/50">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={cn(
                    "px-8 py-2.5 rounded-full text-sm font-black transition-all relative overflow-hidden group",
                    pathname === link.href ? "text-white" : "text-neutral-500 hover:text-neutral-900"
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  {pathname === link.href && (
                    <div className="absolute inset-0 bg-neutral-900 rounded-full z-0 animate-scale-in" />
                  )}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-1/2" />
                </Link>
              ))}
            </div>

            {/* Action Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 p-1.5 pr-4 glass-pro rounded-2xl border border-neutral-100/50 hover:bg-white transition-all shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                      <UserIcon size={20} />
                    </div>
                    <div className="hidden sm:block text-left">
                       <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Researcher</p>
                       <p className="text-xs font-black text-neutral-900">{user.fullName}</p>
                    </div>
                    <ChevronDown size={14} className={cn("text-neutral-400 transition-transform duration-500", isProfileOpen && "rotate-180")} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-[2.5rem] border border-neutral-100 shadow-2xl shadow-blue-500/10 p-4 animate-fade-in z-50 overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                          <Sparkles size={80} className="text-blue-600" />
                       </div>
                       
                       <div className="space-y-2 relative z-10">
                          {['ADMIN', 'SUPERADMIN'].includes(user.role) && (
                            <Link href="/admin" className="flex items-center gap-4 p-4 hover:bg-blue-50 rounded-2xl transition-all group">
                               <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Settings size={20} />
                               </div>
                               <span className="text-sm font-black text-neutral-900">Админ-панель</span>
                            </Link>
                          )}
                          <Link href="/favorites" className="flex items-center gap-4 p-4 hover:bg-rose-50 rounded-2xl transition-all group">
                             <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Heart size={20} />
                             </div>
                             <span className="text-sm font-black text-neutral-900">Избранное</span>
                          </Link>
                          <hr className="my-2 border-neutral-50" />
                          <button 
                            onClick={logout}
                            className="w-full flex items-center gap-4 p-4 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all group"
                          >
                             <div className="w-10 h-10 bg-neutral-50 group-hover:bg-rose-100 rounded-xl flex items-center justify-center transition-all">
                                <LogOut size={20} />
                             </div>
                             <span className="text-sm font-black uppercase tracking-widest">Выйти</span>
                          </button>
                       </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="px-6 py-3 text-sm font-black text-neutral-500 hover:text-neutral-900 transition-all">Вход</Link>
                  <Link href="/register" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95">Регистрация</Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-12 h-12 glass-pro rounded-xl flex items-center justify-center text-neutral-900 border border-neutral-100 shadow-sm"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[88px] bg-[#F6F9FF] z-40 animate-fade-in p-6">
             <div className="space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block p-8 rounded-3xl text-3xl font-black transition-all",
                      pathname === link.href ? "bg-neutral-900 text-white" : "bg-white border border-neutral-100 text-neutral-900"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
             </div>
          </div>
        )}
      </header>
    </>
  );
}
