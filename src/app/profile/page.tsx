'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  User, 
  Mail, 
  Calendar, 
  Download, 
  BookOpen, 
  ShieldCheck,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { BookCard } from '@/components/ui/BookCard';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!token,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Header Profile */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-200">
                {user.fullName.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#F8F9FB]">
                <ShieldCheck className="text-blue-600" size={20} />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-2">{user.fullName}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-neutral-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-blue-500" />
                      {user.email}
                    </div>
                   
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { logout(); router.push('/'); }}
                    className="px-6 py-3 bg-white border border-neutral-200 text-neutral-600 rounded-xl font-bold hover:bg-neutral-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <LogOut size={18} />
                    Выйти
                  </button>
                  {user.role === 'ADMIN' && (
                    <button 
                      onClick={() => router.push('/admin')}
                      className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-lg shadow-neutral-200"
                    >
                      Админ-панель
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Stats */}
          <aside className="lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
              <h3 className="text-lg font-black text-neutral-900 mb-6 uppercase tracking-widest text-[11px]">Статистика аккаунта</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Download size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-neutral-900">{profile?.downloads?.length || 0}</p>
                    <p className="text-sm font-bold text-neutral-400">Скачано книг</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-neutral-900">0</p>
                    <p className="text-sm font-bold text-neutral-400">В избранном</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
              <h4 className="text-xl font-bold mb-4">ScienceHub Premium</h4>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Получите безлимитный доступ ко всем научным материалам и эксклюзивным лекциям.
              </p>
              <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all">
                Узнать больше
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight">История скачиваний</h2>
              <div className="h-px flex-1 bg-neutral-100 mx-8 hidden md:block"></div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-3xl border border-neutral-100 aspect-[3/4] animate-pulse"></div>
                ))}
              </div>
            ) : profile?.downloads?.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-neutral-200 py-20 text-center">
                <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Download className="text-neutral-300" size={40} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Вы еще ничего не скачали</h3>
                <p className="text-neutral-500 max-w-xs mx-auto mb-8">
                  Начните исследовать наш каталог, чтобы найти полезные материалы для учебы.
                </p>
                <button 
                  onClick={() => router.push('/books')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  Перейти в каталог
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {profile?.downloads?.map((download: any) => (
                  <BookCard key={download.id} book={download.book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
