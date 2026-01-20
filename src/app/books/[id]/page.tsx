'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { 
  Download, BookOpen, Clock, FileText, 
  Share2, Heart, ArrowLeft, Star, 
  Shield, Globe, Zap, Sparkles, Layers, Info,
  Bookmark, GraduationCap, Award
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isLiking, setIsLiking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3004/books/${id}`);
      return res.data;
    },
  });

  const toggleFavorite = async () => {
    if (!user) {
      alert('Войдите, чтобы добавлять в избранное');
      return;
    }
    setIsLiking(true);
    try {
      await axios.post('http://localhost:3004/favorites/toggle', { bookId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error('Favorite toggle failed');
    } finally {
      setIsLiking(false);
    }
  };

  if (!mounted) return null;

  if (isLoading) return (
    <div className="min-h-screen bg-[#F6F9FF] pt-40 pb-20">
      <div className="container mx-auto px-6 animate-pulse space-y-20">
        <div className="h-8 w-32 bg-neutral-100 rounded-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-5 h-[700px] bg-neutral-100 rounded-[4rem]"></div>
          <div className="lg:col-span-7 space-y-12">
            <div className="h-24 w-full bg-neutral-100 rounded-3xl"></div>
            <div className="h-12 w-1/2 bg-neutral-100 rounded-2xl"></div>
            <div className="h-60 w-full bg-neutral-100 rounded-[3rem]"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!book) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F9FF]">
       <div className="text-center space-y-12 animate-fade-in relative">
          <div className="mesh-blob w-96 h-96 bg-rose-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
          <BookOpen size={120} className="mx-auto text-neutral-200" strokeWidth={1} />
          <h1 className="text-6xl font-black tracking-tighter uppercase">Издание не <br /> <span className="text-blue-600 italic">найдено</span>.</h1>
          <Link href="/books" className="inline-flex px-12 py-6 bg-neutral-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 transition-all">Вернуться в архив</Link>
       </div>
    </div>
  );

  const handleDownload = () => {
    window.open(`http://localhost:3004${book.pdfUrl}`, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-[#F6F9FF] pt-40 pb-60 overflow-hidden">
      {/* Background Decor - Master Aesthetic */}
      <div className="absolute top-0 left-0 w-full h-[1200px] pointer-events-none -z-10 bg-gradient-to-b from-blue-50/80 via-[#F6F9FF] to-transparent">
         <div className="noise-overlay opacity-5 h-full w-full" />
         <div className="mesh-blob w-[900px] h-[900px] bg-blue-600/10 top-[-10%] right-[-15%] blur-[120px]" />
         <div className="mesh-blob w-[700px] h-[700px] bg-indigo-600/10 bottom-[20%] left-[-10%] blur-[150px]" />
      </div>

      <div className="container mx-auto px-6">
        {/* Breadcrumbs / Back Link */}
        <Link href="/books" className="group inline-flex items-center gap-4 text-neutral-400 hover:text-blue-600 transition-all mb-16 font-black text-[10px] tracking-[0.4em] uppercase animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          К каталогу знаний
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-32 items-stretch">
          
          {/* Left Side: Presentation Card */}
          <div className="lg:col-span-5 xl:col-span-5 relative group">
            <div className="sticky top-40 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="absolute -inset-10 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-colors duration-1000" />
              
              <div className="relative bg-white p-8 md:p-12 rounded-[4.5rem] border border-neutral-100 shadow-ultra group-hover:-translate-y-4 transition-all duration-1000 overflow-hidden">
                <div className="absolute inset-0 noise-overlay opacity-5 pointer-events-none" />
                
                {/* Book Cover Container */}
                <div className="aspect-[3/4.2] bg-[#F8FAFF] rounded-[3rem] overflow-hidden mb-12 relative shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-1000 border border-neutral-100/50">
                  {book.coverImageUrl ? (
                    <img 
                      src={`http://localhost:3004${book.coverImageUrl}`} 
                      alt={book.title} 
                      className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-110 group-hover:rotate-1" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-100 gap-10 bg-gradient-to-br from-[#F8FAFF] to-blue-50/30">
                      <div className="w-40 h-40 bg-white rounded-[4rem] shadow-xl flex items-center justify-center text-blue-600/20 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-12">
                        <BookOpen size={80} strokeWidth={1} />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.5em] font-black opacity-30">Цифровой архив</span>
                    </div>
                  )}
                  
                  {/* Glass ID Tag */}
                  <div className="absolute bottom-10 left-10 right-10 p-6 glass-pro rounded-3xl border border-white/30 backdrop-blur-3xl z-30 shadow-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Идентификатор объекта</p>
                     <p className="text-white font-mono text-sm tracking-tighter">ID: SH-{book.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                
                {/* Master Action Grid */}
                <div className="space-y-6">
                  <button 
                    onClick={handleDownload}
                    className="w-full py-8 bg-neutral-900 text-white rounded-[2.5rem] font-black text-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-6 shadow-2xl active:scale-95 group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center gap-4">
                      <Download size={24} strokeWidth={3} className="group-hover:translate-y-1 transition-transform" />
                      Скачать издание
                    </span>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={toggleFavorite}
                      disabled={isLiking}
                      className={cn(
                        "py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all border active:scale-95 shadow-sm",
                        isFavorite 
                          ? "bg-rose-500 border-rose-400 text-white shadow-rose-200" 
                          : "bg-white border-neutral-100 text-neutral-400 hover:bg-neutral-50 hover:text-rose-500 hover:border-rose-100"
                      )}
                    >
                      <Heart size={18} fill={isFavorite ? "currentColor" : "none"} className={isLiking ? "animate-pulse" : ""} />
                      {isFavorite ? 'В избранном' : 'Избранное'}
                    </button>
                    
                    <button className="py-6 bg-white border border-neutral-100 text-neutral-400 rounded-[2rem] flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all group shadow-sm active:scale-95">
                      <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
                      Поделиться
                    </button>
                  </div>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="mt-10 p-10 bg-white/60 backdrop-blur-3xl rounded-[3.5rem] border border-white shadow-sm animate-fade-in group-hover:-translate-y-2 transition-transform duration-1000" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                    <Award size={28} />
                  </div>
                  <div>
                    <p className="font-black text-neutral-900 uppercase tracking-widest text-[10px] mb-1">Статус верификации</p>
                    <p className="text-xl font-black text-blue-600 tracking-tighter uppercase italic">Подтверждено</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-400 font-medium leading-[1.6]">Этот материал прошел полный цикл проверки качества ScienceHub и допущен к публикации в глобальном архиве.</p>
              </div>
            </div>
          </div>

          {/* Right Side: Typography & Metadata */}
          <div className="lg:col-span-7 xl:col-span-7 py-10 space-y-24">
            
            {/* Header Content */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-wrap items-center gap-4 mb-14">
                <div className="px-7 py-2.5 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl">
                  {book.category?.name || 'Архив'}
                </div>
                <div className={cn(
                  "px-7 py-2.5 text-[10px] font-black uppercase tracking-[0.4em] rounded-full border bg-white shadow-sm",
                  book.difficulty === 'Beginner' ? 'text-emerald-500 border-emerald-100' : 
                  book.difficulty === 'Intermediate' ? 'text-blue-500 border-blue-100' : 
                  'text-rose-500 border-rose-100'
                )}>
                  Уровень: {
                    book.difficulty === 'Beginner' ? 'Базовый' : 
                    book.difficulty === 'Intermediate' ? 'Средний' : 'Продвинутый'
                  }
                </div>
              </div>

              <h1 className="text-6xl md:text-[8rem] font-black text-neutral-900 leading-[0.85] tracking-tighter mb-16 uppercase">
                {book.title}
              </h1>
              
              <div className="flex items-center gap-10 group cursor-default p-8 bg-white/40 border border-white/60 rounded-[3rem] backdrop-blur-3xl inline-flex shadow-sm hover:shadow-blue-500/5 transition-all duration-700">
                <div className="relative w-24 h-24">
                   <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                   <div className="absolute inset-0 bg-white rounded-[2.5rem] flex items-center justify-center text-blue-600 z-10 shadow-xl">
                     <GraduationCap size={40} />
                   </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.4em] mb-2 font-mono">Ведущий исследователь</p>
                  <p className="text-4xl font-black text-neutral-900 tracking-tighter uppercase italic">{book.author}</p>
                </div>
              </div>
            </div>

            {/* Spec Cards - Master Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 xl:gap-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
               {[
                 { icon: FileText, label: 'Тип объекта', value: 'Архив' },
                 { icon: Zap, label: 'Вес данных', value: `${(book.fileSize / 1024 / 1024).toFixed(1)} Мб` },
                 { icon: Layers, label: 'Объем', value: `${book.pageCount || '240'} стр.` },
                 { icon: Globe, label: 'Язык', value: book.language.toUpperCase() }
               ].map((stat, i) => (
                 <div key={i} className="group relative">
                    <div className="bg-white p-10 rounded-[3rem] border border-neutral-100 transition-all duration-700 relative z-10 hover:border-blue-200 hover:-translate-y-4 hover:shadow-ultra">
                       <div className="w-12 h-12 mb-8 rounded-2xl bg-[#F6F9FF] flex items-center justify-center text-neutral-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 group-hover:rotate-12">
                         <stat.icon size={22} />
                       </div>
                       <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-300 mb-2">{stat.label}</p>
                       <p className="text-2xl font-black text-neutral-900 tracking-tighter uppercase">{stat.value}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Content Section - Pure Art Direction */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none rotate-12"><Bookmark size={200} /></div>
                
                <div className="bg-white rounded-[4rem] border border-neutral-100 p-12 md:p-20 shadow-ultra relative overflow-hidden group">
                  <div className="absolute inset-0 noise-overlay opacity-5 pointer-events-none" />
                  
                  <div className="inline-flex items-center gap-6 mb-12">
                    <div className="w-12 h-2 bg-blue-600 rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 tracking-tighter uppercase">Аннотация</h2>
                    <div className="w-12 h-2 bg-blue-600 rounded-full" />
                  </div>

                  <p className="text-2xl text-neutral-500 leading-relaxed font-medium mb-20 italic">
                    "{book.description || 'Для данного издания аннотация не была предоставлена автором. Однако, вы можете ознакомиться с содержанием, скачав полную версию документа. Знания должны быть свободными для всех исследователей будущего.'}"
                  </p>
                  
                  {/* Timeline / Footer Info */}
                  <div className="flex flex-wrap items-center gap-12 pt-12 border-t border-neutral-50">
                     <div className="flex items-center gap-4 text-neutral-300 font-black text-[10px] uppercase tracking-[0.3em] font-mono">
                        <Clock size={16} className="text-blue-400" />
                        Дата Релиза: {new Date(book.createdAt).toLocaleDateString()}
                     </div>
                     <div className="flex items-center gap-4 text-neutral-300 font-black text-[10px] uppercase tracking-[0.3em] font-mono">
                        <Globe size={16} className="text-blue-400" />
                        Доступ: Глобальный
                     </div>
                     <div className="flex items-center gap-4 text-neutral-300 font-black text-[10px] uppercase tracking-[0.3em] font-mono ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles size={16} className="text-amber-400 animate-pulse" />
                        ScienceHub Master Edition
                     </div>
                  </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
