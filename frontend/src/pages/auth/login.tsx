"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TrainFront, Mail, Lock, AlertCircle } from 'lucide-react';
import supabase from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { session, loading } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect jika sudah login
  useEffect(() => {
    if (!loading && session) router.replace('/');
  }, [session, loading]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Email atau password salah.');
    } else {
      router.replace('/');
    }
    setSubmitting(false);
  }


  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Rail<span className="text-cyan-400">Safe</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-[0.2em]">Control Center</p>
        </div>

        {/* Card */}
        <div className="bg-[#0a0f18] border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-1">Log In</h2>
          <p className="text-slate-500 text-sm mb-8">Masuk ke dashboard monitoring perlintasan</p>


          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-800" />
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-3 rounded-xl transition-all uppercase tracking-wider text-sm mt-2"
            >
              {submitting ? 'Memproses...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}