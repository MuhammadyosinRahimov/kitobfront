'use client';

import { useState, Suspense, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, BookOpen, Filter, X, Zap, Sparkles, TrendingUp, History } from 'lucide-react';
import { BookCard } from '@/components/ui/BookCard';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data: books, isLoading: isBooksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await api.get('/books');
      return res.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const filteredBooks = books?.filter((book: any) => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                          book.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || book.category?.name === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || book.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen pt-40 pb-40">
      {/* Search Header - Master Layout */}
      <div className="container mx-auto px-6 mb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 animate-fade-in">
          <div className="max-w-3xl space-y-8">
            <div className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-[0.4em] text-[10px]">
               <Zap size={14} fill="currentColor" />
               Global Science Archive
            </div>
            <h1 className="text-6xl md:text-[8rem] font-black text-neutral-900 leading-[0.85] tracking-tighter">
               Архив <br /> <span className="text-blue-600 italic">Знаний</span>.
            </h1>
            <p className="text-2xl text-neutral-400 font-medium max-w-xl leading-snug">
              Доступ к <span className="text-neutral-900">{filteredBooks?.length || 0}</span> фундаментальным исследованиям со всего мира.
            </p>
          </div>
          
          <div className="relative group w-full lg:max-w-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] opacity-0 group-focus-within:opacity-20 blur-xl transition-opacity animate-pulse" />
            <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-600 transition-colors" size={28} />
            <input 
              type="text" 
              placeholder="Поиск по архиву..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-24 pr-10 py-10 bg-white border border-neutral-100 rounded-[3rem] outline-none focus:border-blue-500 transition-all shadow-2xl shadow-blue-500/5 text-2xl font-bold placeholder:text-neutral-200"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden flex items-center justify-between gap-6 px-10 py-8 bg-neutral-900 text-white rounded-[2rem] font-black shadow-2xl"
          >
            <div className="flex items-center gap-4">
               <SlidersHorizontal size={24} />
               <span>Параметры поиска</span>
            </div>
            <X size={24} className="opacity-40" />
          </button>

          {/* Sidebar - Master Level */}
          <aside className={cn(
            "fixed inset-0 z-[10001] lg:relative lg:z-0 lg:block lg:w-96 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}>
            <div className="h-full lg:h-auto bg-white lg:bg-transparent p-8 lg:p-0 overflow-y-auto">
              <div className="flex items-center justify-between lg:hidden mb-12">
                <span className="text-4xl font-black tracking-tighter">Фильтры</span>
                <button onClick={() => setIsSidebarOpen(false)} className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center"><X size={24} /></button>
              </div>

              <div className="bg-white rounded-[4rem] border border-neutral-100 p-12 sticky top-32 shadow-ultra space-y-16">
                <div>
                   <div className="flex items-center gap-4 text-neutral-900 font-black mb-8 px-2">
                     <div className="w-3 h-3 bg-blue-600 rounded-full" />
                     <span className="uppercase tracking-[0.2em] text-xs">Категории</span>
                   </div>
                   <div className="flex flex-wrap gap-3">
                     {categories?.map((cat: any) => (
                       <button
                         key={cat.id}
                         onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                         className={cn(
                           "px-6 py-3 rounded-2xl text-xs font-black transition-all border",
                           selectedCategory === cat.name 
                             ? "bg-neutral-900 text-white border-neutral-900 shadow-xl scale-105" 
                             : "bg-white text-neutral-400 border-neutral-100 hover:border-blue-200 hover:text-blue-600"
                         )}
                       >
                         {cat.name}
                       </button>
                     ))}
                   </div>
                </div>

                <div>
                   <div className="flex items-center gap-4 text-neutral-900 font-black mb-8 px-2">
                     <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                     <span className="uppercase tracking-[0.2em] text-xs">Сложность</span>
                   </div>
                   <div className="space-y-3">
                     {DIFFICULTIES.map((diff) => (
                       <button
                         key={diff}
                         onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
                         className={cn(
                           "w-full flex items-center justify-between px-8 py-5 rounded-2xl text-xs font-black transition-all border group",
                           selectedDifficulty === diff 
                             ? "bg-blue-600 text-white border-blue-600 shadow-xl translate-x-3" 
                             : "bg-white text-neutral-400 border-neutral-100 hover:border-blue-200 hover:text-blue-600 hover:translate-x-2"
                         )}
                       >
                         {diff}
                         <Zap size={14} className={cn("transition-transform group-hover:rotate-12", selectedDifficulty === diff ? "text-white" : "text-neutral-100")} />
                       </button>
                     ))}
                   </div>
                </div>

                <div className="pt-8 border-t border-neutral-50">
                   <div className="p-8 bg-neutral-50 rounded-[2rem] space-y-4">
                      <div className="flex items-center gap-3">
                         <Sparkles size={16} className="text-blue-600" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Trend Analysis</span>
                      </div>
                      <p className="text-xs font-bold text-neutral-400 leading-relaxed">Популярность темы "Физика" выросла на 12% за неделю.</p>
                   </div>
                </div>

                {(selectedCategory || selectedDifficulty || search) && (
                  <button 
                    onClick={() => { setSearch(''); setSelectedCategory(null); setSelectedDifficulty(null); }}
                    className="w-full py-6 text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 hover:bg-rose-50 rounded-[2rem] transition-all flex items-center justify-center gap-3"
                  >
                    <History size={14} />
                    Сбросить всё
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Grid - Master Asymmetric */}
          <main className="flex-1">
            {isBooksLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[3/4.5] bg-neutral-100 rounded-[3rem] animate-pulse"></div>
                ))}
              </div>
            ) : filteredBooks?.length === 0 ? (
              <div className="bg-white rounded-[4rem] border border-dashed border-neutral-100 py-40 text-center animate-fade-in shadow-ultra relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none skew-x-12"><BookOpen size={200} /></div>
                <div className="w-32 h-32 bg-neutral-50 rounded-[2.5rem] flex items-center justify-center text-neutral-200 mx-auto mb-10 border border-neutral-100 shadow-inner">
                  <BookOpen size={56} strokeWidth={1} />
                </div>
                <h3 className="text-5xl font-black text-neutral-900 mb-6 tracking-tighter">Пустота...</h3>
                <p className="text-xl text-neutral-400 font-medium max-w-sm mx-auto leading-relaxed">Мы не нашли материалов по вашему запросу. Попробуйте расширить радиус поиска.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {filteredBooks?.map((book: any, index: number) => {
                  // Asymmetric stagger effect
                  const isLarge = index % 3 === 0;
                  return (
                    <div key={book.id} className={cn("animate-fade-in", isLarge ? "md:mt-0" : "md:mt-24")} style={{ animationDelay: `${0.1 * index}s` }}>
                      <BookCard book={book} />
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
