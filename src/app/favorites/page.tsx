'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Heart, BookOpen, MoveRight, ArrowLeft, Sparkles } from 'lucide-react';
import { BookCard } from '@/components/ui/BookCard';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function FavoritesPage() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await api.get('/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!token,
  });

  if (!mounted) return null;
  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-[#F6F9FF] pt-40 pb-40 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 bg-gradient-to-b from-blue-50/80 via-[#F6F9FF] to-transparent">
         <div className="noise-overlay opacity-5 h-full w-full" />
         <div className="mesh-blob w-[800px] h-[800px] bg-rose-500/5 top-[-10%] right-[-10%] blur-[120px]" />
         <div className="mesh-blob w-[600px] h-[600px] bg-blue-600/5 bottom-[10%] left-[-10%] blur-[150px]" />
      </div>

      <div className="container mx-auto px-6">
        <Link href="/books" className="group inline-flex items-center gap-4 text-neutral-400 hover:text-blue-600 transition-all mb-16 font-black text-[10px] tracking-[0.4em] uppercase">
          <ArrowLeft size={16} />
          Назад в архив
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 mb-24 animate-fade-in">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-rose-500 font-black uppercase tracking-[0.4em] text-[10px]">
               <Heart size={14} fill="currentColor" />
               Personal Collection
            </div>
            <h1 className="text-6xl md:text-[8rem] font-black text-neutral-900 leading-[0.85] tracking-tighter">
               Моё <br /> <span className="text-rose-500 italic">Избранное</span>.
            </h1>
          </div>
          <div className="p-8 bg-white rounded-[3rem] border border-neutral-100 shadow-ultra flex items-center gap-6">
             <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                <Sparkles size={32} />
             </div>
             <div>
                <p className="text-3xl font-black text-neutral-900">{favorites?.length || 0}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Сохранённых объектов</p>
             </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4.5] bg-white rounded-[3rem] animate-pulse border border-neutral-50" />
            ))}
          </div>
        ) : favorites?.length === 0 ? (
          <div className="bg-white rounded-[4rem] border border-dashed border-neutral-200 py-40 text-center animate-fade-in shadow-ultra relative overflow-hidden">
             <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none skew-x-12"><Heart size={200} /></div>
             <div className="w-32 h-32 bg-neutral-50 rounded-[2.5rem] flex items-center justify-center text-neutral-200 mx-auto mb-10 border border-neutral-100 shadow-inner">
                <Heart size={56} strokeWidth={1} />
             </div>
             <h3 className="text-5xl font-black text-neutral-900 mb-6 tracking-tighter">Здесь пока пусто</h3>
             <p className="text-xl text-neutral-400 font-medium max-w-sm mx-auto mb-12">Добавляйте понравившиеся книги в избранное, чтобы быстро возвращаться к ним позже.</p>
             <Link href="/books" className="inline-flex px-12 py-6 bg-neutral-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Перейти к исследованиям</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {favorites?.map((fav: any) => (
              <BookCard key={fav.book.id} book={fav.book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
