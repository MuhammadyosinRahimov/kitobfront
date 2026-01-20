'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Plus, Book as BookIcon, Users, Download, 
  TrendingUp, Settings, Trash2, Edit, ExternalLink,
  Search, Info, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { api, getAssetUrl } from '@/lib/api';

export default function AdminDashboard() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || !['ADMIN', 'SUPERADMIN'].includes(user.role)) {
      router.push('/');
    }
  }, [user, router]);

  const { data: books, isLoading } = useQuery({
    queryKey: ['admin-books'],
    queryFn: async () => {
      const res = await api.get('/books');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      alert('Книга удалена');
    },
    onError: () => {
      alert('Ошибка при удалении книги');
    }
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Вы уверены, что хотите удалить книгу "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const filteredBooks = books?.filter((b: any) => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Всего книг', value: books?.length || 0, icon: BookIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Авторов', value: Array.from(new Set(books?.map((b: any) => b.author))).length || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Скачиваний', value: books?.reduce((acc: number, b: any) => acc + (b.downloadCount || 0), 0) || 0, icon: Download, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Топ месяц', value: '+12%', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F6F9FF] pt-24 md:pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-widest text-[10px] mb-4">
              <Settings size={14} className="animate-spin-slow" />
              Панель управления
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">Админка</h1>
          </div>
          <Link 
            href="/admin/books/add" 
            className="flex items-center justify-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-[2rem] font-black hover:bg-black transition-all hover:scale-105 shadow-2xl shadow-neutral-200 active:scale-95"
          >
            <Plus size={20} />
            Добавить книгу
          </Link>
        </div>

        {/* Stats Grid - Horizontal scroll on mobile */}
        <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-4 gap-6 mb-12 no-scrollbar">
          {stats.map((stat, i) => (
            <div key={stat.label} className="min-w-[240px] md:min-w-0 bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-blue-500/5 animate-fade-in flex flex-col justify-between" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", stat.bg, stat.color)}>
                <stat.icon size={26} />
              </div>
              <div>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-neutral-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Table Container */}
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-2xl shadow-blue-500/5 overflow-hidden animate-slide-up">
          <div className="p-8 md:p-10 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-neutral-50/50">
            <h2 className="text-2xl font-black text-neutral-900">Список материалов</h2>
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Поиск по архиву..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Table for Desktop, Cards for Mobile */}
          <div className="hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">Публикация</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">Категория</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">Скачиваний</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Управление</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {isLoading ? (
                  <tr><td colSpan={4} className="px-10 py-20 text-center text-neutral-400 font-bold">Синхронизация...</td></tr>
                ) : filteredBooks?.map((book: any) => (
                  <tr key={book.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-neutral-100 rounded-xl overflow-hidden shadow-inner shrink-0 relative">
                          {book.coverImageUrl ? (
                            <img src={getAssetUrl(book.coverImageUrl) || ''} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300"><BookIcon size={20} /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-neutral-900 line-clamp-1">{book.title}</p>
                          <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] uppercase font-black tracking-widest border border-blue-100">
                        {book.category?.name || 'Архив'}
                      </span>
                    </td>
                    <td className="px-10 py-8 font-black text-neutral-900">{book.downloadCount}</td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                        <Link 
                          href={`/admin/books/edit/${book.id}`}
                          className="p-3 bg-white border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-all hover:text-blue-600" 
                          title="Редактировать"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(book.id, book.title)}
                          className="p-3 bg-white border border-neutral-100 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all" title="Удалить">
                          <Trash2 size={18} />
                        </button>
                        <Link href={`/books/${book.id}`} className="p-3 bg-neutral-900 text-white rounded-xl hover:scale-110 transition-all shadow-lg" title="Открыть">
                          <ExternalLink size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View Cards */}
          <div className="md:hidden divide-y divide-neutral-50">
            {filteredBooks?.map((book: any) => (
              <div key={book.id} className="p-6 space-y-4">
                <div className="flex gap-4">
                   <div className="w-20 h-24 bg-neutral-100 rounded-2xl overflow-hidden shrink-0">
                      {book.coverImageUrl && <img src={getAssetUrl(book.coverImageUrl) || ''} className="w-full h-full object-cover" />}
                   </div>
                   <div className="flex-1">
                      <h3 className="font-black text-neutral-900 line-clamp-2 leading-tight">{book.title}</h3>
                      <p className="text-xs text-neutral-400 font-bold mt-1">{book.author}</p>
                      <div className="mt-3">
                         <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{book.category?.name || 'Архив'}</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                   <div className="flex items-center gap-2 text-neutral-900 font-black text-sm">
                      <Download size={14} className="text-blue-600" />
                      {book.downloadCount}
                   </div>
                   <div className="flex gap-2">
                      <Link href={`/admin/books/edit/${book.id}`} className="p-3 bg-neutral-50 rounded-xl text-neutral-600"><Edit size={18} /></Link>
                      <button onClick={() => handleDelete(book.id, book.title)} className="p-3 bg-neutral-50 rounded-xl text-rose-500"><Trash2 size={18} /></button>
                      <Link href={`/books/${book.id}`} className="p-3 bg-neutral-900 text-white rounded-xl"><ExternalLink size={18} /></Link>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {(!isLoading && filteredBooks?.length === 0) && (
            <div className="p-20 text-center space-y-4">
               <AlertTriangle size={48} className="mx-auto text-amber-400" />
               <p className="text-neutral-400 font-bold">Ничего не найдено</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
