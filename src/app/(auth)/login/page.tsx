'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { Layout, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post('http://localhost:3004/auth/login', data);
      setAuth(res.data.user, res.data.access_token);
      router.push('/');
    } catch (error) {
      alert('Ошибка входа. Проверьте данные.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 shadow-2xl shadow-neutral-200/50 p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-200">
            <Layout size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">С возвращением</h1>
          <p className="text-neutral-500 mt-2">Войдите в свой аккаунт ScienceHub</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                {...register('email')}
                className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-neutral-200 border focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all shadow-sm"
                placeholder="example@mail.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{(errors.email as any).message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700 ml-1">Пароль</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                {...register('password')}
                type="password"
                className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-neutral-200 border focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{(errors.password as any).message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-xl shadow-neutral-200"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : (
              <>
                Войти в систему
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-neutral-100 text-center text-sm text-neutral-500">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}
