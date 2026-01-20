import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  difficulty: string;
  language: string;
  pdfUrl: string;
  createdAt: string;
}

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
        {/* Placeholder for Cover Image */}
        <FileText size={64} className="opacity-80" />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {book.category}
            </span>
            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
              {book.difficulty}
            </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{book.author}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
           <div className="flex items-center">
             <Calendar size={14} className="mr-1" />
             {new Date(book.createdAt).toLocaleDateString()}
           </div>
           {/* In a real app, this would be a link or trigger a download action */}
           <a 
             href={`http://localhost:3001/api/books/${book.id}`} // Assuming the backend serves files or we link to details
             className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
             target="_blank" 
             rel="noreferrer"
           >
             <Download size={16} className="mr-1" />
             Details
           </a>
        </div>
      </div>
    </div>
  );
};
