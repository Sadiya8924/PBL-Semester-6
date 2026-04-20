import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen bg-[#05070a] text-white overflow-hidden relative flex flex-col">

      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-cyan-400/5 blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-cyan-400" />
          </div>
          <span className="font-black tracking-tight text-lg">
            Rail<span className="text-cyan-400">Safe</span>
          </span>
        </div>
        <button
          onClick={() => router.push('/auth/login')}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-all"
        >
          Log In
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20">

        {/* Badge */}
        <div className={`inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Sistem Monitoring Real-time</span>
        </div>

        {/* Heading */}
        <h1 className={`text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Perlintasan<br />
          <span className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #06b6d4, #0891b2)' }}>
            Lebih Aman
          </span>
        </h1>

        {/* Subheading */}
        <p className={`text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed mb-12 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Dashboard monitoring palang kereta berbasis IoT — pantau status real-time,
          deteksi kereta, dan kelola perangkat dari satu tempat.
        </p>

        {/* CTA */}
        <div className={`flex flex-col sm:flex-row items-center gap-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={() => router.push('/auth/login')}
            className="group flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-8 py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
          >
            Masuk ke Dashboard
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className={`flex items-center gap-8 mt-16 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {[
            { value: 'Real-time', label: 'Update sensor' },
            { value: 'MQTT', label: 'Protokol IoT' },
            { value: '24/7', label: 'Monitoring' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-slate-600 text-xs uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

      </main>

      {/* Feature cards */}
      <section className="relative z-10 px-10 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              ),
              title: 'Monitoring Real-time',
              desc: 'Status palang dan sensor terpantau langsung via MQTT tanpa delay.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                </svg>
              ),
              title: 'Multi Perlintasan',
              desc: 'Admin kelola semua perlintasan, staff fokus ke perlintasan masing-masing.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              ),
              title: 'Alert Otomatis',
              desc: 'Notifikasi blind spot, sensor timeout, dan anomali terdeteksi otomatis.',
            },
          ].map((f, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-white text-sm mb-2">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 px-10 py-6 flex items-center justify-between">
        <span className="text-slate-600 text-xs">© 2026 RailSafe — Railway Infrastructure</span>
        <span className="text-slate-700 text-xs font-mono">v2.4.0</span>
      </footer>

    </div>
  );
}