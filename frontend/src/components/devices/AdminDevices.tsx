"use client";
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { Cpu, Radio, Activity, Wifi, RefreshCw, Settings2, Plus, Pencil, Trash2, CircleDot, Filter } from 'lucide-react';
import type { Device, Crossing } from '@/lib/types';

function getDeviceVisuals(type: string) {
  switch (type) {
    case 'HC_SR05': return { icon: <Radio className="w-5 h-5" />,    color: 'bg-emerald-500', text: 'text-emerald-400', label: 'Distance Scanner' };
    case 'IR_FC51': return { icon: <Cpu className="w-5 h-5" />,      color: 'bg-amber-500',   text: 'text-amber-400',  label: 'Obstacle Detector' };
    case 'ESP32':   return { icon: <Activity className="w-5 h-5" />, color: 'bg-cyan-500',    text: 'text-cyan-400',   label: 'Main Controller' };
    default:        return { icon: <Cpu className="w-5 h-5" />,      color: 'bg-slate-500',   text: 'text-slate-400',  label: type };
  }
}

function getHealth(lastSeenAt: string | null): number {
  if (!lastSeenAt) return 0;
  const diffMin = (Date.now() - new Date(lastSeenAt).getTime()) / 60000;
  if (diffMin < 1)  return 100;
  if (diffMin < 5)  return 90;
  if (diffMin < 30) return 70;
  if (diffMin < 60) return 40;
  return 10;
}

interface DeviceWithCrossing extends Device { crossings?: { name: string } }

export default function AdminDevices() {
  const [devices, setDevices]         = useState<DeviceWithCrossing[]>([]);
  const [crossings, setCrossings]     = useState<Crossing[]>([]);
  const [filterCross, setFilterCross] = useState<string>('all');
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState<Device | null>(null);
  const [form, setForm]               = useState({ type: 'ESP32', model: '', mqtt_client_id: '', cross_id: '', firmware_version: '' });
  const [saving, setSaving]           = useState(false);

  async function fetchData() {
    setLoading(true);
    const [{ data: devs }, { data: cross }] = await Promise.all([
      supabase.from('devices').select('*, crossings(name)').order('registered_at', { ascending: false }),
      supabase.from('crossings').select('*').eq('status', 'active').order('name'),
    ]);
    setDevices(devs || []);
    setCrossings(cross || []);
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  const filtered = filterCross === 'all'
    ? devices
    : devices.filter(d => d.cross_id === filterCross);

  const onlineCount = devices.filter(d => d.status === 'online').length;

  function openAdd() {
    setEditing(null);
    setForm({ type: 'ESP32', model: '', mqtt_client_id: '', cross_id: crossings[0]?.cross_id || '', firmware_version: '' });
    setShowModal(true);
  }

  function openEdit(dev: Device) {
    setEditing(dev);
    setForm({ type: dev.type, model: dev.model || '', mqtt_client_id: dev.mqtt_client_id || '', cross_id: dev.cross_id, firmware_version: dev.firmware_version || '' });
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editing) {
      await supabase.from('devices').update(form).eq('device_id', editing.device_id);
    } else {
      await supabase.from('devices').insert({ ...form, status: 'offline' });
    }
    setSaving(false);
    setShowModal(false);
    fetchData();
  }

  async function handleDelete(deviceId: string) {
    if (!confirm('Hapus device ini?')) return;
    await supabase.from('devices').delete().eq('device_id', deviceId);
    fetchData();
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-10 space-y-8">

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/50 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-cyan-500/10 p-2 rounded-lg">
              <Settings2 className="text-cyan-400 w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
              Device <span className="text-cyan-400">Management</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm ml-1">Semua perangkat di seluruh perlintasan</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all">
            <Plus className="w-4 h-4" /> Tambah Device
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Device',  value: devices.length },
          { label: 'Online',        value: onlineCount },
          { label: 'Offline',       value: devices.length - onlineCount },
          { label: 'Perlintasan',   value: crossings.length },
        ].map((s, i) => (
          <div key={i} className="bg-[#0a0f18] border border-slate-800 p-4 rounded-2xl">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{s.label}</p>
            <h2 className="text-2xl font-black text-white mt-1">{s.value}</h2>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-slate-500" />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterCross('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterCross === 'all' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
          >
            Semua
          </button>
          {crossings.map(c => (
            <button
              key={c.cross_id}
              onClick={() => setFilterCross(c.cross_id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterCross === c.cross_id ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="bg-[#0a0f18] border border-slate-800 rounded-3xl h-64 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {filtered.map(dev => {
            const { icon, color, text, label } = getDeviceVisuals(dev.type);
            const health = getHealth(dev.last_seen_at);
            return (
              <div key={dev.device_id} className="bg-[#0a0f18] border border-slate-800 rounded-3xl overflow-hidden group hover:border-cyan-500/30 transition-all shadow-xl">
                <div className="p-5 border-b border-slate-800/50 flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400">{icon}</div>
                    <div>
                      <h3 className="font-bold text-white leading-tight">{dev.type}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{label}</p>
                      <p className="text-[10px] text-cyan-400/60 mt-0.5">{(dev as any).crossings?.name || '—'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(dev)} className="p-1.5 rounded-lg text-slate-600 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(dev.device_id)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CircleDot className={`w-3 h-3 animate-pulse ${text}`} />
                        <span className={`text-xs font-black tracking-widest ${text}`}>{dev.status.toUpperCase()}</span>
                      </div>
                      <p className="text-xl font-black text-white">{dev.model || dev.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Health</p>
                      <p className={`text-sm font-bold ${health > 70 ? 'text-emerald-400' : health > 40 ? 'text-amber-400' : 'text-red-400'}`}>{health}%</p>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${color}`} style={{ width: `${health}%` }} />
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-800/50">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] font-mono text-slate-500">
                        {dev.last_seen_at ? new Date(dev.last_seen_at).toLocaleTimeString('id-ID') : 'Never'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600">{dev.firmware_version || 'v1.0.0'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0f18] border border-slate-700 rounded-3xl p-8 w-full max-w-md space-y-5">
            <h2 className="text-white font-black text-xl">{editing ? 'Edit Device' : 'Tambah Device'}</h2>
            {[
              { label: 'Tipe', key: 'type', type: 'select', options: ['ESP32', 'HC_SR05', 'IR_FC51'] },
              { label: 'Model', key: 'model', type: 'text', placeholder: 'HC-SR05' },
              { label: 'MQTT Client ID', key: 'mqtt_client_id', type: 'text', placeholder: 'esp32-cross001' },
              { label: 'Firmware Version', key: 'firmware_version', type: 'text', placeholder: 'v1.0.0' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    value={(form as any)[field.key]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    {field.options!.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={(form as any)[field.key]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                  />
                )}
              </div>
            ))}
            <div>
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">Perlintasan</label>
              <select
                value={form.cross_id}
                onChange={e => setForm(prev => ({ ...prev, cross_id: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              >
                {crossings.map(c => <option key={c.cross_id} value={c.cross_id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-bold hover:bg-slate-900 transition-all">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold transition-all disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
