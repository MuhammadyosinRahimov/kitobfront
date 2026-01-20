import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <FileQuestion size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-black text-neutral-900 mb-4 tracking-tight">Страница не найдена</h1>
        <p className="text-neutral-600 text-lg mb-10 leading-relaxed">
          К сожалению, запрашиваемая вами страница не существует или была перемещена.
        </p>
        <Link 
          href="/" 
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
