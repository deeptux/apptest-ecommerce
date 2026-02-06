"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you'd call an API route to set an HttpOnly cookie.
    // For a simple demo, we set it via document.cookie.
    if (password === "d1073741824@L") { // Match the middleware password
      document.cookie = `app_session=${password}; path=/; max-age=86400; SameSite=Strict`;
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-black p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white italic">PROJECT CODENAME:</h1>
          <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-2">RAMEN HEAVEN</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-rose-500 focus:outline-none transition-all"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
          />
          {error && <p className="text-[10px] text-red-500 font-bold text-center">ACCESS DENIED. INCORRECT PASSWORD.</p>}
          <button className="w-full rounded-xl bg-rose-600 py-3 font-bold text-white hover:bg-rose-700 transition-all">
            Unlock E-Commerce/POS System
          </button>
        </form>
      </div>
    </div>
  );
}