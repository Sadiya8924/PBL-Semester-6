"use client";
import { useState, useEffect } from 'react';
import { Cpu, Plus, Pencil, Trash2, X, Save, Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { withAuth } from '../../components/ui/withAuth';
import supabase from '../../lib/supabase';
import type { Device, Crossing } from '../../lib/types';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0f18] border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const EMPTY: Partial<Device> = {
  type: '', model: '', firmware_version: '', mac_address: '', mqtt_client_id: '', status: 'offline', cross_id: '',
};

function AdminDevices() {
  const [devices, setDevices]     = useState<Device[]>([]);
  const [crossings, setCrossings] = useState<Crossing[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState<'add' | 'edit' | null>(null);
  const [form, setForm]           = useState<Partial<Device>>(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [error, setError]         = useState('');

  async function fetchAll() {
    setLoading(true);
    const [d, c] = await Promise.all([
      supabase.from('devices').select('*').order('registered_at', { ascending: false }),
      supabase.from('crossings').select('*').eq('status', 'active'),
    ]);
    if (!d.error) setDevices(d.data || []);
    if (!c.error) setCrossings(c.data || []);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  function openAdd() { setForm({ ...EMPTY, cross_id: crossings[0]?.cross_id || '' }); setError(''); setModal('add'); }
  function openEdit(d: Device) { setForm(d); setError(''); setModal('edit'); }

  async function handleSave() {
    if (!form.type?.trim())         { setError('Tipe device wajib diisi.'); return; }
    if (!form.mqtt_client_id?.trim()){ setError('MQTT Client ID wajib diisi.'); return; }
    if (!form.cross_id)              { setError('Perlintasan wajib dipilih.'); return; }
    setSaving(true); setError('');

    if (modal === 'add') {
      const { error } = await supabase.from('devices').insert([{
        type: form.type, model: form.model, firmware_version: form.firmware_version,
        mac_address: form.mac_address, mqtt_client_id: form.mqtt_client_id,
        status: form.status, cross_id: form.cross_id,
      }]);
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('devices').update({
        type: form.type, model: form.model, firmware_version: form.firmware_version,
        mac_address: form.mac_address, mqtt_client_id: form.mqtt_client_id,
        status: form.status, cross_id: form.cross_id,
      }).eq('device_id', form.device_id);
      if (error) { setError(error.message); setSaving(false); return; }
    }
    await fetchAll(); setModal(null); setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus device ini?')) return;
    setDeleting(id);
    await supabase.from('devices').delete().eq('device_id', id);
    setDevices(prev => prev.filter(d => d.device_id !== id));
    setDeleting(null);
  }

  function getCrossingName(id: string) {
    return crossings.find(c => c.cross_id === id)?.name || id.slice(0, 8) + '...';
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-10 space-y-8">

      <header className="flex items-center justify-between border-b border-slate-800/50 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/10 p-2 rounded-lg"><Cpu className="text-cyan-400 w-5 h-5" /></div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
              Manage <span className="text-cyan-400">Devices</span>
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">CRUD data perangkat sensor dan aktuator</p>
          </div>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider transition-all">
          <Plus className="w-4 h-4" /> Add Device
        </button>
      </header>

      <div className="bg-[#0a0f18] border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/50">
                {['Type / Model', 'MQTT Client ID', 'MAC Address', 'Crossing', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-left border-b border-slate-800 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>{[...Array(6)].map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-800 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : devices.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-600">Belum ada device terdaftar</td></tr>
              ) : devices.map(dev => (
                <tr key={dev.device_id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-sm">{dev.type}</p>
                    <p className="text-[10px] text-slate-500">{dev.model || '—'}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-mono">{dev.mqtt_client_id}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">{dev.mac_address || '—'}</td>
                  <td className="px-6 py-4 text-sm text-cyan-400/80">{getCrossingName(dev.cross_id)}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase w-fit px-2 py-1 rounded-full border ${
                      dev.status === 'online'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                    }`}>
                      {dev.status === 'online' ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
                      {dev.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(dev)} className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(dev.device_id)} disabled={deleting === dev.device_id} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all disabled:opacity-50">
                        {deleting === dev.device_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Tambah Device' : 'Edit Device'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {[
              { label: 'Tipe Device *',    key: 'type',             placeholder: 'IR_FC51 / HC_SR05 / ESP32' },
              { label: 'Model',            key: 'model',            placeholder: 'FC-51 / HC-SR04' },
              { label: 'Firmware Version', key: 'firmware_version', placeholder: '1.0.0' },
              { label: 'MAC Address',      key: 'mac_address',      placeholder: 'AA:BB:CC:DD:EE:FF' },
              { label: 'MQTT Client ID *', key: 'mqtt_client_id',   placeholder: 'esp32-crossing-01' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{f.label}</label>
                <input
                  type="text"
                  value={(form as any)[f.key] || ''}
                  placeholder={f.placeholder}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Perlintasan *</label>
              <select value={form.cross_id || ''} onChange={e => setForm(prev => ({ ...prev, cross_id: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all">
                <option value="">-- Pilih Perlintasan --</option>
                {crossings.map(c => <option key={c.cross_id} value={c.cross_id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Status</label>
              <select value={form.status || 'offline'} onChange={e => setForm(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all">
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold transition-all">Batal</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default withAuth(AdminDevices, { requiredRole: 'super_admin' });