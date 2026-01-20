'use client';

import Link from 'next/link';
import { Download, Heart, BookOpen, MoveRight, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';

interface Book {
  id: string;
  title: string;
  author: string;
  category?: { id: string, name: string } | null;
  difficulty: string;
  coverImageUrl?: string | null;
  downloadCount: number;
}

export function BookCard({ book }: { book: Book }) {
  const { user, token } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Войдите, чтобы добавлять в избранное');
      return;
    }
    
    setIsLiking(true);
    try {
      await axios.post('http://localhost:3004/favorites/toggle', { bookId: book.id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Favorite toggle failed');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="group relative bg-[#FFFFFF] rounded-[2.5rem] p-3 shadow-depth card-tilt animate-fade-in shiny-border group-hover:bg-[#F8FAFF]">
      {/* Visual Level - More Compact Aspect Ratio */}
      <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-[#F6F9FF] border border-neutral-100/50">
        <div className="absolute inset-0 noise-overlay opacity-5 z-20 pointer-events-none" />
        
        {/* Cover with Multi-stage Zoom */}
        {book.coverImageUrl ? (
          <img 
            src={`http://localhost:3004${book.coverImageUrl}`} 
            alt={book.title} 
            className="w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-125 group-hover:rotate-2"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-200">
             <div className="w-16 h-16 rounded-[1.8rem] bg-white shadow-2xl flex items-center justify-center text-neutral-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-1000 group-hover:rotate-[360deg]">
                <BookOpen size={28} strokeWidth={1} />
             </div>
          </div>
        )}

        {/* Global Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
        
        {/* Top Badges - Smaller */}
        <div className="absolute top-4 left-4 z-30 flex flex-col gap-1.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
           <div className="glass-pill px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-2xl bg-white/10">
             {book.category?.name || 'Science'}
           </div>
        </div>

        {/* Favorite Interaction - Compact */}
        <button 
          onClick={toggleFavorite}
          disabled={isLiking}
          className={cn(
            "absolute top-4 right-4 z-30 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-700 backdrop-blur-3xl border shadow-2xl translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
            isFavorite 
              ? "bg-rose-500 border-rose-400 text-white scale-110" 
              : "bg-white/10 border-white/20 text-white/50 hover:text-rose-400 hover:bg-white/20 hover:scale-110"
          )}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} className={cn("transition-transform duration-700", isLiking && "animate-pulse")} />
        </button>

        {/* Action Button - Reveal on Hover */}
        <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-6 group-hover:translate-y-0">
           <Link href={`/books/${book.id}`} className="px-7 py-3.5 bg-white text-neutral-900 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-ultra hover:bg-neutral-900 hover:text-white transition-all transform hover:scale-110 active:scale-95">
             Исследовать
             <MoveRight size={16} strokeWidth={3} />
           </Link>
        </div>
      </div>

      {/* Meta Content - Refined spacing */}
      <div className="px-4 py-6 space-y-6">
        <Link href={`/books/${book.id}`} className="block">
          <h3 className="text-lg font-black text-neutral-900 leading-[1.2] tracking-tighter line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors uppercase">
            {book.title}
          </h3>
          <div className="flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-blue-600" />
             <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.3em]">{book.author}</p>
          </div>
        </Link>

        {/* Divider with interaction */}
        <div className="h-px w-full bg-neutral-100 relative overflow-hidden group-hover:bg-blue-100 transition-colors">
           <div className="absolute inset-0 bg-blue-600 w-0 group-hover:w-full transition-all duration-1000 ease-in-out" />
        </div>

        <div className="flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-neutral-300 uppercase tracking-widest leading-none mb-1">Downloads</span>
                 <div className="flex items-center gap-1.5 text-neutral-900 font-black text-xs">
                    <Download size={12} className="text-blue-600" strokeWidth={3} />
                    {book.downloadCount}
                 </div>
              </div>
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-neutral-300 uppercase tracking-widest leading-none mb-1">Level</span>
                 <div className={cn(
                    "text-[9px] font-black uppercase tracking-tight",
                    book.difficulty === 'Beginner' ? 'text-emerald-500' : 
                    book.difficulty === 'Intermediate' ? 'text-blue-500' : 'text-rose-500'
                 )}>
                    {book.difficulty}
                 </div>
              </div>
           </div>

           <Link href={`/books/${book.id}`} className="w-11 h-11 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-900 hover:bg-blue-600 hover:text-white transition-all duration-700 hover:rotate-12 group-hover:shadow-lg">
             <Star size={18} />
           </Link>
        </div>
      </div>
    </div>
  );
}
