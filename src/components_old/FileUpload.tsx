'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadFormData {
  title: string;
  author: string;
  difficulty: string;
  category: string;
  language: string;
  file: FileList;
}

export const FileUpload: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UploadFormData>();
  const queryClient = useQueryClient();
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const mutation = useMutation({
    mutationFn: async (data: UploadFormData) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('author', data.author);
      formData.append('difficulty', data.difficulty);
      formData.append('category', data.category);
      formData.append('language', data.language);
      formData.append('createdById', 'demo-user-id'); // Hardcoded for MVP
      formData.append('file', data.file[0]);

      const response = await axios.post('http://localhost:3001/api/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setUploadStatus('success');
      reset();
      setTimeout(() => setUploadStatus('idle'), 3000);
    },
    onError: () => {
      setUploadStatus('error');
    }
  });

  const onSubmit = (data: UploadFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Upload className="mr-2" size={24} />
        Upload New Book
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              {...register('title', { required: true })} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Book Title"
            />
            {errors.title && <span className="text-red-500 text-xs">Required</span>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input 
              {...register('author', { required: true })} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Author Name"
            />
             {errors.author && <span className="text-red-500 text-xs">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              {...register('category', { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Physics">Physics</option>
              <option value="Math">Math</option>
              <option value="IT">IT</option>
              <option value="Biology">Biology</option>
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
             <select 
               {...register('difficulty', { required: true })}
               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
             >
               <option value="Beginner">Beginner</option>
               <option value="Intermediate">Intermediate</option>
               <option value="Advanced">Advanced</option>
             </select>
          </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
             <select 
               {...register('language', { required: true })}
               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
             >
               <option value="en">English</option>
               <option value="ru">Russian</option>
             </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
          <input 
            type="file" 
            accept="application/pdf"
            {...register('file', { required: true })}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
           {errors.file && <span className="text-red-500 text-xs">File is required</span>}
        </div>

        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center disabled:opacity-70"
        >
          {mutation.isPending ? (
            <><Loader2 className="animate-spin mr-2" /> Uploading...</>
          ) : (
            'Upload Book'
          )}
        </button>

        {uploadStatus === 'success' && (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="mr-2" size={20} /> Book uploaded successfully!
          </div>
        )}
        {uploadStatus === 'error' && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="mr-2" size={20} /> Error uploading book.
          </div>
        )}
      </form>
    </div>
  );
};
