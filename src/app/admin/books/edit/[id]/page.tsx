'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { 
  Upload, FileText, ImageIcon, Save, ArrowLeft, 
  Sparkles, ShieldCheck, Loader2, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const bookSchema = z.object({
  title: z.string().min(2, 'Минимум 2 символа'),
  author: z.string().min(2, 'Минимум 2 символа'),
  description: z.string().min(10, 'Минимум 10 символов'),
  categoryId: z.string().min(1, 'Выберите категорию'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  language: z.string().min(2, 'Минимум 2 символа'),
});

type BookFormValues = z.infer<typeof bookSchema>;

export default function EditBookPage() {
  const { token, user } = useAuthStore();
  const router = useRouter();
  const { id } = useParams();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user || !['ADMIN', 'SUPERADMIN'].includes(user.role)) {
      router.push('/');
    }
  }, [user, router]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const { data: book, isLoading: isBookLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const res = await api.get(`/books/${id}`);
      return res.data;
    },
  });

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
  });

  useEffect(() => {
    if (book) {
      form.reset({
        title: book.title,
        author: book.author,
        description: book.description,
        categoryId: book.categoryId,
        difficulty: book.difficulty,
        language: book.language,
      });
    }
  }, [book, form]);

  const mutation = useMutation({
    mutationFn: async (values: BookFormValues) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, value));
      if (pdfFile) formData.append('pdf', pdfFile);
      if (coverFile) formData.append('cover', coverFile);

      await api.patch(`/books/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => router.push('/admin'), 2000);
    },
  });

  if (isBookLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FCFDFF]"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="min-h-screen bg-[#FCFDFF] pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-neutral-400 font-bold hover:text-neutral-900 transition-colors mb-10 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Назад к панели
        </Link>

        <div className="flex items-center justify-between mb-12">
           <div className="space-y-2">
             <div className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px]">
               <ShieldCheck size={14} />
               Редактор архива
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter">Изменение материала</h1>
           </div>
        </div>

        {success ? (
          <div className="bg-white p-20 rounded-[3rem] border border-emerald-100 shadow-2xl shadow-emerald-500/5 text-center space-y-6 animate-fade-in">
             <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto">
               <CheckCircle2 size={40} />
             </div>
             <h2 className="text-3xl font-black text-neutral-900">Успешно обновлено!</h2>
             <p className="text-neutral-400 font-medium">Книга успешно сохранена в архиве. Возвращаем вас в панель...</p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Title & Author */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 ml-2">Название книги</label>
                  <input {...form.register('title')} placeholder="Основы квантовой механики" className="w-full px-6 py-5 bg-white border border-neutral-100 rounded-2xl outline-none focus:border-blue-500 transition-all shadow-sm" />
                  {form.formState.errors.title && <p className="text-rose-500 text-xs font-bold px-2">{form.formState.errors.title.message}</p>}
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 ml-2">Автор публикации</label>
                  <input {...form.register('author')} placeholder="Профессор С.П. Капица" className="w-full px-6 py-5 bg-white border border-neutral-100 rounded-2xl outline-none focus:border-blue-500 transition-all shadow-sm" />
                  {form.formState.errors.author && <p className="text-rose-500 text-xs font-bold px-2">{form.formState.errors.author.message}</p>}
                </div>
              </div>

              {/* Category & Difficulty */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 ml-2">Категория знания</label>
                  <select {...form.register('categoryId')} className="w-full px-6 py-5 bg-white border border-neutral-100 rounded-2xl outline-none focus:border-blue-500 transition-all shadow-sm appearance-none">
                    <option value="">Выберите раздел...</option>
                    {categories?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {form.formState.errors.categoryId && <p className="text-rose-500 text-xs font-bold px-2">{form.formState.errors.categoryId.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 ml-2">Сложность</label>
                    <select {...form.register('difficulty')} className="w-full px-6 py-5 bg-white border border-neutral-100 rounded-2xl outline-none focus:border-blue-500 transition-all shadow-sm appearance-none">
                      <option value="Beginner">Начальный</option>
                      <option value="Intermediate">Средний</option>
                      <option value="Advanced">Сложный</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 ml-2">Язык</label>
                    <input {...form.register('language')} placeholder="RU, EN..." className="w-full px-6 py-5 bg-white border border-neutral-100 rounded-2xl outline-none focus:border-blue-500 transition-all shadow-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 ml-2">Описание материала</label>
              <textarea {...form.register('description')} rows={5} placeholder="Краткое содержание и ключевые тезисы..." className="w-full px-6 py-5 bg-white border border-neutral-100 rounded-2xl outline-none focus:border-blue-500 transition-all shadow-sm resize-none"></textarea>
              {form.formState.errors.description && <p className="text-rose-500 text-xs font-bold px-2">{form.formState.errors.description.message}</p>}
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 ml-2">Обновить PDF (опционально)</label>
                 <div className="relative group cursor-pointer">
                    <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                    <div className={cn(
                      "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl transition-all",
                      pdfFile ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-neutral-50 border-neutral-100 text-neutral-400 group-hover:bg-neutral-100"
                    )}>
                       <FileText size={32} className="mb-4" />
                       <span className="text-sm font-black tracking-tight">{pdfFile ? pdfFile.name : 'Выбрать новый PDF'}</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 ml-2">Новая обложка (опционально)</label>
                 <div className="relative group cursor-pointer">
                    <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                    <div className={cn(
                      "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl transition-all",
                      coverFile ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-neutral-50 border-neutral-100 text-neutral-400 group-hover:bg-neutral-100"
                    )}>
                       <ImageIcon size={32} className="mb-4" />
                       <span className="text-sm font-black tracking-tight">{coverFile ? coverFile.name : 'Выбрать новую обложку'}</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-neutral-100 flex items-center justify-between">
               <div className="flex items-center gap-3 text-neutral-300 font-bold text-xs uppercase tracking-widest">
                  <Sparkles size={14} />
                  Данные защищены TLS
               </div>
               <button 
                 disabled={mutation.isPending}
                 className="px-12 py-5 bg-neutral-900 text-white rounded-3xl font-black flex items-center gap-3 hover:bg-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-2xl shadow-neutral-200"
               >
                 {mutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                 Сохранить изменения
               </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
