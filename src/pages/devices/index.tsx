"use client";
import { 
  Cpu, 
  Radio, 
  Activity, 
  Wifi, 
  RefreshCw, 
  CircleDot, 
  Settings2 
} from "lucide-react";

export default function Devices() {
  const deviceList = [
    {
      id: "ULT-01",
      name: "Ultrasonic Sensor",
      type: "Distance Scannner",
      status: "ACTIVE",
      value: "120 cm",
      health: 98,
      ip: "192.168.1.101",
      icon: <Radio className="w-5 h-5" />,
      color: "bg-emerald-500",
    },
    {
      id: "INF-02",
      name: "Infrared Sensor",
      type: "Obstacle Detector",
      status: "DETECTED",
      value: "Object In Range",
      health: 100,
      ip: "192.168.1.102",
      icon: <Cpu className="w-5 h-5" />,
      color: "bg-amber-500",
    },
    {
      id: "SRV-01",
      name: "Servo Motor",
      type: "Gate Actuator",
      status: "MOVING",
      value: "Position: 45°",
      health: 85,
      ip: "192.168.1.105",
      icon: <Activity className="w-5 h-5" />,
      color: "bg-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-10 space-y-10">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/50 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-cyan-500/10 p-2 rounded-lg">
              <Settings2 className="text-cyan-400 w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
              Device <span className="text-cyan-400">Inventory</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium ml-1">
            Real-time peripheral health and connectivity status
          </p>
        </div>

        <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all">
          <RefreshCw className="w-4 h-4 text-cyan-400" />
          REFRESH HARDWARE
        </button>
      </header>

      {/* SUMMARY STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Nodes", count: "5", icon: <Wifi className="text-emerald-400" /> },
          { label: "Total Hardware", count: "3 Units", icon: <Cpu className="text-cyan-400" /> },
          { label: "Avg Latency", count: "12ms", icon: <Activity className="text-amber-400" /> }
        ].map((stat, i) => (
          <div key={i} className="bg-[#0a0f18] border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
              <h2 className="text-2xl font-black text-white mt-1">{stat.count}</h2>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* DEVICE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {deviceList.map((dev) => (
          <div key={dev.id} className="bg-[#0a0f18] border border-slate-800 rounded-3xl overflow-hidden group hover:border-cyan-500/30 transition-all duration-300 shadow-xl">
            {/* Top Bar */}
            <div className="p-6 border-b border-slate-800/50 flex justify-between items-start">
              <div className="flex gap-4">
                <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400 group-hover:scale-110 transition-transform`}>
                  {dev.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">{dev.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{dev.type}</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-1 rounded-md text-slate-400 font-mono">
                {dev.id}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CircleDot className={`w-3 h-3 animate-pulse ${dev.color.replace('bg-', 'text-')}`} />
                    <span className={`text-xs font-black tracking-widest ${dev.color.replace('bg-', 'text-')}`}>
                      {dev.status}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-white">{dev.value}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Health</p>
                  <p className="text-sm font-bold text-emerald-400">{dev.health}%</p>
                </div>
              </div>

              {/* Progress Bar Health */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${dev.color}`} 
                  style={{ width: `${dev.health}%` }} 
                />
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-2">
                  <Wifi className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] font-mono text-slate-500">{dev.ip}</span>
                </div>
                <button className="text-[10px] font-bold text-cyan-500 hover:text-cyan-300 transition-colors uppercase tracking-widest">
                  Configure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}