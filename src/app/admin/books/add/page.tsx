'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowLeft, Upload, Loader2, CheckCircle2, FileText, Image as ImageIcon, Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const bookSchema = z.object({
  title: z.string().min(2, 'Минимум 2 символа'),
  author: z.string().min(2, 'Минимум 2 символа'),
  categoryId: z.string().min(2, 'Выберите категорию'),
  difficulty: z.string().min(2, 'Выберите сложность'),
  language: z.string().min(2, 'Выберите язык'),
  description: z.string().optional(),
});

export default function AddBookPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    if (!user || !['ADMIN', 'SUPERADMIN'].includes(user.role)) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3004/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(bookSchema),
  });

  const onSubmit = async (data: any) => {
    if (!pdfFile) {
      alert('Пожалуйста, выберите PDF файл');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    if (coverFile) {
      formData.append('cover', coverFile);
    }
    
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    try {
      await axios.post('http://localhost:3004/books', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      alert('Книга успешно добавлена!');
      router.push('/admin');
    } catch (error) {
      alert('Ошибка при добавлении книги.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FCFDFF] pt-32 pb-40">
      <div className="container mx-auto px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-neutral-400 hover:text-blue-600 transition-all mb-12 font-bold text-sm tracking-widest uppercase animate-fade-in">
          <ArrowLeft size={16} />
          Назад в управление
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] border border-neutral-100 shadow-2xl shadow-blue-500/5 overflow-hidden animate-fade-in">
            <div className="p-12 border-b bg-neutral-900 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-10 text-white">
                 <Sparkles size={120} />
               </div>
               <div className="relative z-10">
                <h1 className="text-4xl font-black text-white tracking-tight">Новая публикация</h1>
                <p className="text-neutral-400 mt-3 font-medium text-lg">Добавьте новую книгу в мировой архив знаний ScienceHub</p>
               </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-12 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Название книги</label>
                  <input {...register('title')} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium" placeholder="Напр: Основы Квантовой Физики" />
                  {errors.title && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-1">{(errors.title as any).message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Автор</label>
                  <input {...register('author')} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium" placeholder="Имя Автора" />
                  {errors.author && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-1">{(errors.author as any).message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Категория</label>
                  <div className="flex gap-2">
                    <select {...register('categoryId')} className="flex-1 px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-neutral-700 appearance-none">
                      <option value="">Выбор...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <button 
                      type="button"
                      onClick={async () => {
                        const name = prompt('Название категории:');
                        if (name) {
                          try {
                            const res = await axios.post('http://localhost:3004/categories', { name }, {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            setCategories([...categories, res.data]);
                          } catch (e) { alert('Ошибка'); }
                        }
                      }}
                      className="w-14 h-14 bg-neutral-900 text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all shadow-lg"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Сложность</label>
                  <select {...register('difficulty')} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-neutral-700">
                    <option value="">Выбор...</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Язык</label>
                  <select {...register('language')} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-neutral-700">
                    <option value="ru">Русский (ru)</option>
                    <option value="en">Английский (en)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Краткое описание</label>
                <textarea {...register('description')} rows={4} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium" placeholder="О чем эта книга?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400 block">Файл PDF</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className={cn(
                      "border-2 border-dashed border-neutral-100 group-hover:border-blue-500 group-hover:bg-blue-50/10 p-10 rounded-[2rem] transition-all text-center",
                      pdfFile ? "bg-blue-50/20 border-blue-200" : ""
                    )}>
                      {pdfFile ? (
                        <div className="flex flex-col items-center gap-3 text-blue-600">
                          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center"><FileText size={32} /></div>
                          <span className="font-black text-sm truncate max-w-[200px]">{pdfFile.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-neutral-300">
                          <Upload size={32} />
                          <p className="text-sm font-bold text-neutral-900">Выбрать PDF</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400 block">Обложка</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className={cn(
                      "border-2 border-dashed border-neutral-100 group-hover:border-indigo-500 group-hover:bg-indigo-50/10 p-10 rounded-[2rem] transition-all text-center",
                      coverFile ? "bg-indigo-50/20 border-indigo-200" : ""
                    )}>
                      {coverFile ? (
                        <div className="flex flex-col items-center gap-3 text-indigo-600">
                          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center"><ImageIcon size={32} /></div>
                          <span className="font-black text-sm truncate max-w-[200px]">{coverFile.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-neutral-300">
                          <ImageIcon size={32} />
                          <p className="text-sm font-bold text-neutral-900">Выбрать картинку</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-neutral-50">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (
                    <>
                      <Sparkles size={24} />
                      Опубликовать в архиве
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
