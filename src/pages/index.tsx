"use client";
import StatusCard from "../components/layouts/status/statuscard";
import { Train, ShieldCheck, Activity, Cpu, Radio, Zap } from "lucide-react";

export default function Home() {
  return (
    // Berikan padding-left [280px] agar tidak tertutup sidebar yang fixed
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-10 space-y-10">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col gap-1 border-b border-slate-800/50 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <h1 className="text-3xl font-black tracking-tight text-white italic">
            SYSTEM <span className="text-cyan-400">DASHBOARD</span>
          </h1>
        </div>
        <p className="text-slate-500 font-medium flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-500" />
          Live Monitoring: <span className="text-slate-300">Smart Railway Gate Control Unit v2.0</span>
        </p>
      </header>

      {/* GRID 1: CRITICAL STATUS (Besar) */}
      <section>
        <h2 className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Critical Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusCard 
            title="Train Presence" 
            value="NO TRAIN" 
            icon={<Train />}
            status="safe" // Prop baru untuk warna
            desc="No detected units in 5km radius"
          />
          <StatusCard 
            title="Gate Position" 
            value="OPEN" 
            icon={<ShieldCheck />}
            status="warning"
            desc="Standard operational protocol"
          />
          <StatusCard 
            title="System Pulse" 
            value="ONLINE" 
            icon={<Zap />}
            status="active"
            desc="All modules responding at 12ms"
          />
        </div>
      </section>

      {/* GRID 2: SENSOR & HARDWARE (Lebih Padat) */}
      <section>
        <h2 className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Hardware Telemetry</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <StatusCard 
            variant="compact"
            title="Ultrasonic S1" 
            value="14.2 m" 
            icon={<Radio className="w-4 h-4" />}
            status="active"
          />
          <StatusCard 
            variant="compact"
            title="Infrared S2" 
            value="CLEAR" 
            icon={<Cpu className="w-4 h-4" />}
            status="active"
          />
          <StatusCard 
            variant="compact"
            title="Servo Motor" 
            value="IDLE (0°)" 
            icon={<Activity className="w-4 h-4" />}
            status="warning"
          />
          {/* <StatusCard 
            variant="compact"
            title="CPU Temp" 
            value="42°C" 
            icon={<Cpu className="w-4 h-4" />}
            status="active"
          /> */}
        </div>
      </section>

    </div>
  );
}