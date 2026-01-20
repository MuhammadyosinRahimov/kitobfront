'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  BookOpen, Search, GraduationCap, Atom, Laptop, 
  FlaskConical, ArrowRight, Star, TrendingUp, 
  Sparkles, MoveRight, Globe2, Shapes, Binary, Cpu
} from 'lucide-react';
import { BookCard } from '@/components/ui/BookCard';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  'Физика': Atom,
  'Биология': FlaskConical,
  'IT': Laptop,
  'Математика': GraduationCap,
  'default': BookOpen
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data: latestBooks, isLoading: isBooksLoading } = useQuery({
    queryKey: ['latest-books'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3004/books');
      return res.data.slice(0, 4);
    },
  });

  const { data: categories, isLoading: isCatsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3004/categories');
      return res.data;
    },
  });

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Master Layers (Specific for Hero) */}
      <div className="absolute top-0 left-0 w-full h-[120vh] bg-[#05070A] skew-y-[-6deg] origin-top-left -z-20 shadow-2xl overflow-hidden">
         <div className="absolute inset-0 noise-overlay opacity-10" />
         <div className="mesh-blob w-[800px] h-[800px] bg-blue-600/20 top-[-20%] right-[-10%] blur-[120px]" />
         <div className="mesh-blob w-[600px] h-[600px] bg-indigo-600/10 bottom-[20%] left-[-10%] blur-[150px]" />
      </div>

      {/* Hero Section - Master Level */}
      <section className="relative pt-40 pb-60 z-10">
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
              <div className="lg:col-span-8 space-y-12">
                 <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full animate-fade-in group hover:bg-white/10 transition-colors cursor-crosshair">
                    <Sparkles size={14} className="text-blue-400 group-hover:rotate-45 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">Intelligence Archive v2.0</span>
                 </div>

                 <h1 className="text-6xl md:text-[8.5rem] font-black text-white leading-[0.85] tracking-tighter animate-fade-in">
                    Наука Без <br /> 
                    <span className="text-blue-600 text-glow relative">
                      Границ
                      <div className="absolute -bottom-4 right-0 w-32 h-2 bg-blue-600/30 rounded-full blur-xl" />
                    </span>.
                 </h1>

                 <p className="text-xl md:text-3xl text-neutral-400 max-w-3xl leading-snug font-medium animate-fade-in" style={{ animationDelay: '0.1s' }}>
                   Децентрализованная экосистема для глубоких исследований. 
                   <span className="text-white"> 20,000+ томов </span> фундаментальных знаний в открытом доступе.
                 </p>

                 <div className="flex flex-col md:flex-row gap-6 pt-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <Link href="/books" className="px-14 py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-5 shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 group">
                       Начать исследование
                       <MoveRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <div className="relative group flex-1 max-w-lg">
                       <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-blue-400 transition-colors" size={24} />
                       <input 
                         type="text" 
                         placeholder="Мгновенный доступ к знаниям..." 
                         className="w-full pl-20 pr-10 py-8 bg-white/5 border border-white/10 rounded-[2.5rem] outline-none focus:border-blue-500 transition-all backdrop-blur-3xl text-white text-xl font-bold"
                       />
                    </div>
                 </div>
              </div>

              {/* Asymmetric Decor Block */}
              <div className="hidden lg:block lg:col-span-4 relative">
                 <div className="aspect-square bg-white/5 border border-white/10 rounded-[4rem] flex items-center justify-center rotate-[15deg] group hover:rotate-0 transition-all duration-1000 overflow-hidden shadow-2xl shadow-black/80">
                    <div className="absolute inset-0 noise-overlay" />
                    <img src="/hero.png" className="w-[120%] h-[120%] object-cover opacity-60 mix-blend-screen group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute bottom-10 left-10 p-8 glass-pro rounded-3xl border border-white/10 -rotate-[15deg] group-hover:rotate-0 transition-all duration-700">
                       <p className="text-3xl font-black text-white leading-none mb-2">ScienceHub</p>
                       <p className="text-[10px] uppercase font-black tracking-widest text-blue-400">Master Level Archive</p>
                    </div>
                 </div>
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/20 blur-[60px] animate-pulse" />
                 <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-blue-600/10 blur-[80px] animate-float" />
              </div>
           </div>
        </div>
      </section>

      {/* Counter Section - Master Layout */}
      <section className="relative z-20 -mt-20">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 px-1 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl overflow-hidden shadow-2xl">
               {[
                 { label: 'Публикаций', val: '22,481', icon: Binary },
                 { label: 'Исследователей', val: '4,892', icon: Globe2 },
                 { label: 'Скорость доступа', val: '120ms', icon: Cpu },
                 { label: 'Качество данных', val: 'Lossless', icon: Shapes },
               ].map((stat, i) => (
                 <div key={i} className="bg-white/5 flex flex-col items-center justify-center py-12 group hover:bg-blue-600 transition-all duration-700 cursor-default">
                    <stat.icon size={24} className="mb-4 text-blue-500 group-hover:text-white transition-colors" />
                    <p className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.val}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 group-hover:text-white/70">{stat.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Categories - Master Layout (Asymmetric Mixed Grid) */}
      <section className="py-60 bg-[#F6F9FF] rounded-t-[5rem] -mt-10 relative z-10 border-t border-neutral-100">
         <div className="container mx-auto px-6">
            <div className="mb-32 space-y-8 max-w-4xl">
               <div className="h-2 w-32 bg-blue-600 rounded-full" />
               <h2 className="text-6xl md:text-[7rem] font-black text-neutral-900 leading-[0.85] tracking-tighter">
                  Индустрии <br /> <span className="text-blue-600 italic">Будущего</span>.
               </h2>
               <p className="text-2xl text-neutral-500 font-medium leading-relaxed">
                  Мы классифицировали знания по векторам развития цивилизации. Выберите свою вертикаль исследования.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
               {isCatsLoading ? Array(4).fill(0).map((_, i) => <div key={i} className="md:col-span-3 h-80 bg-neutral-100 rounded-[3rem] animate-pulse" />) : 
               categories?.map((cat: any, i: number) => {
                 const Icon = iconMap[cat.name] || iconMap.default;
                 // Asymmetric sizing
                 const colSpan = i % 3 === 0 ? 'md:col-span-8' : 'md:col-span-4';
                 return (
                   <Link key={cat.id} href={`/books?category=${cat.name}`} className={cn(
                     colSpan,
                     "group relative p-12 bg-white rounded-[3.5rem] border border-neutral-100 transition-all duration-1000 hover:-translate-y-4 hover:shadow-ultra overflow-hidden"
                   )}>
                     <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                        <Icon size={120} />
                     </div>
                     <div className="relative z-10">
                        <div className="w-20 h-20 mb-12 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 group-hover:rotate-[360deg]">
                           <Icon size={40} />
                        </div>
                        <h3 className="text-4xl font-black text-neutral-900 mb-4 tracking-tighter leading-none group-hover:text-blue-600 transition-colors uppercase">{cat.name}</h3>
                        <p className="text-neutral-400 font-bold mb-8">Исследовать материалы раздела →</p>
                        <div className="flex items-center gap-1">
                           <div className="h-1px flex-1 bg-neutral-100 group-hover:bg-blue-200 transition-colors" />
                           <TrendingUp size={16} className="text-blue-200 group-hover:text-blue-500 transition-colors" />
                        </div>
                     </div>
                   </Link>
                 );
               })}
            </div>
         </div>
      </section>

      {/* Featured Works - Master Layout (Mixed List) */}
      <section className="py-40 bg-[#F6F9FF] relative overflow-hidden">
         <div className="container mx-auto px-6">
            <div className="flex items-center justify-between gap-12 mb-24">
               <h2 className="text-5xl font-black tracking-tighter flex items-center gap-6 leading-none">
                  <div className="w-4 h-20 bg-neutral-900 rounded-full" />
                  Золотой <br /> Фонд.
               </h2>
               <Link href="/books" className="hidden md:flex items-center gap-5 px-10 py-5 bg-neutral-900 text-white rounded-[2rem] font-black group hover:bg-blue-600 transition-all shadow-2xl active:scale-95">
                  Весь архив
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
               {isBooksLoading ? Array(4).fill(0).map((_, i) => <div key={i} className="aspect-[3/4.5] bg-neutral-100 rounded-[3rem] animate-pulse" />) : 
               latestBooks?.map((book: any, i: number) => (
                 <div key={book.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
                   <BookCard book={book} />
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer CTA - Master Dark */}
      <footer className="bg-[#05070A] py-60 rounded-t-[8rem] relative overflow-hidden text-center">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-900/50 to-transparent" />
         <div className="noise-overlay opacity-10" />
         <div className="mesh-blob w-[1000px] h-[1000px] bg-blue-600/5 top-[-50%] left-[-20%] blur-[180px]" />
         
         <div className="container mx-auto px-6 relative z-10 space-y-20">
            <h2 className="text-6xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter">
               Архивируй. <br /> 
               Исследуй. <br /> 
               <span className="text-blue-600 italic">Создавай</span>.
            </h2>
            <div className="flex flex-col items-center gap-8">
               <p className="text-2xl text-neutral-500 max-w-2xl font-medium">Бесплатный доступ к мировому наследию открыт для тебя прямо сейчас.</p>
               <Link href="/register" className="px-16 py-8 bg-white text-neutral-900 rounded-[2.5rem] font-black text-2xl hover:bg-blue-600 hover:text-white transition-all shadow-ultra active:scale-95 group">
                  Присоединиться к ScienceHub
               </Link>
            </div>
            <div className="pt-20 border-t border-white/5 opacity-20 flex flex-wrap justify-center gap-20">
               {['Oxford', 'Cambridge', 'NASA', 'CERN', 'MIT'].map(u => (
                 <span key={u} className="text-3xl font-black italic tracking-tighter uppercase">{u}</span>
               ))}
            </div>
         </div>
      </footer>
    </div>
  );
}
