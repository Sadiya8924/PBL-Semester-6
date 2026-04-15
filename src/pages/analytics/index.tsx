"use client";
import { useState, useMemo } from "react";
import { Calendar, TrendingUp, Train, ArrowUpRight } from "lucide-react";

export default function Analytics() {
  const [filter, setFilter] = useState("Daily");

  // Mock Data berdasarkan filter
  const dataMap: Record<string, { label: string; count: number }[]> = {
    Daily: [
      { label: "Sen", count: 7 }, { label: "Sel", count: 12 }, { label: "Rab", count: 5 },
      { label: "Kam", count: 9 }, { label: "Jum", count: 15 }, { label: "Sab", count: 3 }, { label: "Min", count: 8 },
    ],
    Monthly: [
      { label: "Jan", count: 120 }, { label: "Feb", count: 150 }, { label: "Mar", count: 90 },
      { label: "Apr", count: 200 }, { label: "Mei", count: 180 }, { label: "Jun", count: 210 },
    ],
    Yearly: [
      { label: "2023", count: 1200 }, { label: "2024", count: 1550 }, { label: "2025", count: 1800 },
      { label: "2026", count: 450 },
    ],
  };

  const trainData = dataMap[filter] || dataMap.Daily;
  const maxValue = Math.max(...trainData.map((d) => d.count));
  const totalTrains = trainData.reduce((acc, curr) => acc + curr.count, 0);

  // Kalkulasi titik SVG secara dinamis berdasarkan jumlah data
  const points = useMemo(() => {
    const width = 600;
    const spacing = width / (trainData.length - 1);
    return trainData
      .map((item, index) => {
        const x = index * spacing + 50;
        const y = 200 - (item.count / maxValue) * 160;
        return `${x},${y}`;
      })
      .join(" ");
  }, [trainData, maxValue]);

  return (
    // Gunakan p-10 agar sama persis dengan Home
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-10 space-y-10">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/50 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-cyan-500/10 p-2 rounded-lg">
              <TrendingUp className="text-cyan-400 w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
              Traffic <span className="text-cyan-400">Analytics</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium ml-1">
            Historical data processing for <span className="text-slate-300">Smart Railway Logic</span>
          </p>
        </div>

        {/* FILTER TAB - Pill Style */}
        <div className="flex bg-slate-900/50 border border-slate-800 p-1 rounded-xl w-fit">
          {["Daily", "Monthly", "Yearly"].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-6 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                filter === opt 
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20" 
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* MAIN CHART CARD */}
        <div className="lg:col-span-3 bg-[#0a0f18] border border-slate-800 rounded-3xl p-8 shadow-2xl relative group">
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-1">Data Visualization</p>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Flow Throughput <ArrowUpRight className="w-4 h-4 text-cyan-500" />
              </h3>
            </div>
            <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 text-right">
              <span className="text-cyan-400 font-black text-2xl tracking-tighter">
                {totalTrains.toLocaleString()}
              </span>
              <p className="text-slate-500 text-[9px] uppercase font-bold tracking-tighter">Total Detection</p>
            </div>
          </div>

          <div className="relative h-[280px] w-full">
            <svg className="w-full h-full" viewBox="0 0 700 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                   <feGaussianBlur stdDeviation="3" result="blur" />
                   <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* X-Grid Lines */}
              {[40, 80, 120, 160, 200].map((y) => (
                <line key={y} x1="50" x2="650" y1={y} y2={y} className="stroke-slate-800/50 stroke-[1]" strokeDasharray="6,6" />
              ))}

              {/* Area */}
              <polygon points={`50,200 ${points} 650,200`} fill="url(#areaGradient)" className="transition-all duration-700" />

              {/* Path Line */}
              <polyline
                points={points}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                className="transition-all duration-700"
              />

              {/* Points */}
              {trainData.map((item, index) => {
                const spacing = 600 / (trainData.length - 1);
                const x = index * spacing + 50;
                const y = 200 - (item.count / maxValue) * 160;
                return (
                  <g key={index} className="group/point cursor-crosshair">
                    <circle cx={x} cy={y} r="5" className="fill-slate-950 stroke-cyan-400 stroke-[3] group-hover/point:r-7 transition-all" />
                    <rect x={x - 15} y={y - 35} width="30" height="20" rx="4" className="fill-cyan-500 opacity-0 group-hover/point:opacity-100 transition-opacity" />
                    <text x={x} y={y - 21} textAnchor="middle" className="fill-slate-950 text-[10px] font-black opacity-0 group-hover/point:opacity-100 transition-opacity">
                      {item.count}
                    </text>
                  </g>
                );
              })}

              {/* Labels */}
              {trainData.map((item, index) => {
                const spacing = 600 / (trainData.length - 1);
                return (
                  <text key={item.label} x={index * spacing + 50} y="235" textAnchor="middle" className="fill-slate-600 text-[10px] font-bold uppercase tracking-tighter">
                    {item.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* STATS CARDS SIDE */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-slate-900/30 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
            <div className="bg-emerald-500/10 w-fit p-3 rounded-2xl mb-4">
              <Train className="text-emerald-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Peak Day</p>
              <h4 className="text-2xl font-black text-white italic">
                {trainData.reduce((prev, curr) => (prev.count > curr.count ? prev : curr)).label}
              </h4>
            </div>
          </div>

          <div className="flex-1 bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/10 p-6 rounded-3xl flex flex-col justify-between">
            <div className="bg-cyan-500/10 w-fit p-3 rounded-2xl mb-4">
              <Calendar className="text-cyan-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Avg Rate</p>
              <h4 className="text-2xl font-black text-white italic">
                {(totalTrains / trainData.length).toFixed(1)}
              </h4>
              <p className="text-cyan-400/60 text-[10px] font-bold italic mt-1 uppercase">Units / Period</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}