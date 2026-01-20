import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004';

export const api = axios.create({
  baseURL: API_URL,
});

// Helper for image/PDF URLs
export const getAssetUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};
