"use client";
import { 
  History, 
  Search, 
  Download, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Info 
} from "lucide-react";

export default function LogAktivitas() {
  const logs = [
    { id: 1, time: "14:30:00", date: "2026-04-14", activity: "Sensor Ultrasonik S1", desc: "Distance calibration completed", status: "success" },
    { id: 2, time: "14:35:12", date: "2026-04-14", activity: "Infrared Sensor S2", desc: "Clear track confirmed", status: "success" },
    { id: 3, time: "14:40:05", date: "2026-04-14", activity: "Servo Motor Unit", desc: "Gate repositioned to 90°", status: "info" },
    { id: 4, time: "14:45:22", date: "2026-04-14", activity: "Train Presence", desc: "Unit detected at 2km radius", status: "warning" },
    { id: 5, time: "14:50:00", date: "2026-04-14", activity: "System Override", desc: "Manual emergency stop triggered", status: "danger" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Success
        </span>;
      case "warning":
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
          <AlertCircle className="w-3 h-3" /> Warning
        </span>;
      case "danger":
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
          <AlertCircle className="w-3 h-3" /> Danger
        </span>;
      default:
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wider border border-cyan-500/20">
          <Info className="w-3 h-3" /> Info
        </span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-10 space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/50 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-cyan-500/10 p-2 rounded-lg">
              <History className="text-cyan-400 w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
              Activity <span className="text-cyan-400">Logs</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium ml-1">
            System forensic and real-time event monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <Download className="w-5 h-5" />
          </button>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 w-[240px] transition-all"
            />
          </div>
        </div>
      </header>

      {/* DATA TABLE AREA */}
      <div className="bg-[#0a0f18] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800">Event Component</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800">Description</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800">Severity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-cyan-500/[0.02] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      <div>
                        <p className="text-sm font-bold text-slate-200">{log.time}</p>
                        <p className="text-[10px] text-slate-600 font-mono">{log.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-cyan-400/80 uppercase tracking-tight">{log.activity}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-400 font-medium">{log.desc}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(log.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/20 flex items-center justify-between">
          <p className="text-xs text-slate-600 font-medium px-2">Showing 5 of 1,240 events</p>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 text-[10px] font-bold bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all">PREV</button>
            <button className="px-4 py-1.5 text-[10px] font-bold bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all">NEXT</button>
          </div>
        </div>
      </div>
    </div>
  );
}