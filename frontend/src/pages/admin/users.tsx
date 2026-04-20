"use client";
import { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, X, Save, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { withAuth } from '../../components/ui/withAuth';
import { useAuth } from '../../lib/auth';
import supabase from '../../lib/supabase';
import type { Profile, Crossing, UserRole } from '../../lib/types';

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

function AdminUsers() {
  const { profile: currentProfile } = useAuth();
  const [profiles, setProfiles]     = useState<Profile[]>([]);
  const [crossings, setCrossings]   = useState<Crossing[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState<'add' | 'edit' | null>(null);
  const [deleting, setDeleting]     = useState<string | null>(null);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');

  // Add form
  const [addForm, setAddForm] = useState({ email: '', name: '', username: '', password: '', role: 'staff' as UserRole, cross_id: '' });
  // Edit form
  const [editForm, setEditForm] = useState<Partial<Profile>>({});

  async function fetchAll() {
    setLoading(true);
    const [p, c] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('crossings').select('*').eq('status', 'active'),
    ]);
    if (!p.error) setProfiles(p.data || []);
    if (!c.error) setCrossings(c.data || []);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  function openAdd() {
    setAddForm({ email: '', name: '', username: '', password: '', role: 'staff', cross_id: crossings[0]?.cross_id || '' });
    setError(''); setModal('add');
  }
  function openEdit(p: Profile) { setEditForm(p); setError(''); setModal('edit'); }

  async function handleAdd() {
    if (!addForm.email || !addForm.name || !addForm.username || !addForm.password) {
      setError('Semua field wajib diisi.'); return;
    }
    setSaving(true); setError('');

    // Buat user via Supabase Auth Admin API (melalui backend)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addForm),
    });
    const data = await res.json();

    if (!res.ok) { setError(data.error || 'Gagal membuat user.'); setSaving(false); return; }

    await fetchAll(); setModal(null); setSaving(false);
  }

  async function handleEdit() {
    if (!editForm.name?.trim() || !editForm.username?.trim()) {
      setError('Nama dan username wajib diisi.'); return;
    }
    setSaving(true); setError('');

    // Cek username unik
    const { data: existing } = await supabase.from('profiles').select('id').eq('username', editForm.username).neq('id', editForm.id).single();
    if (existing) { setError('Username sudah digunakan.'); setSaving(false); return; }

    const { error } = await supabase.from('profiles').update({
      name: editForm.name, username: editForm.username,
      role: editForm.role, cross_id: editForm.cross_id || null,
      updated_at: new Date().toISOString(),
    }).eq('id', editForm.id);

    if (error) { setError(error.message); setSaving(false); return; }
    await fetchAll(); setModal(null); setSaving(false);
  }

  async function handleDelete(userId: string) {
    if (userId === currentProfile?.id) { alert('Tidak bisa menghapus akun sendiri.'); return; }
    if (!confirm('Hapus user ini?')) return;
    setDeleting(userId);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${userId}`, { method: 'DELETE' });
    if (res.ok) setProfiles(prev => prev.filter(p => p.id !== userId));
    setDeleting(null);
  }

  function getCrossingName(id: string | null) {
    if (!id) return 'All Crossings';
    return crossings.find(c => c.cross_id === id)?.name || '—';
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-10 space-y-8">

      <header className="flex items-center justify-between border-b border-slate-800/50 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/10 p-2 rounded-lg"><Users className="text-cyan-400 w-5 h-5" /></div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
              Manage <span className="text-cyan-400">Users</span>
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">CRUD akun pengguna sistem</p>
          </div>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider transition-all">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </header>

      <div className="bg-[#0a0f18] border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900/50">
              {['User', 'Username', 'Role', 'Crossing', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-left border-b border-slate-800">{h}</th>
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
            ) : profiles.map(p => (
              <tr key={p.id} className={`hover:bg-slate-900/30 transition-colors ${p.id === currentProfile?.id ? 'bg-cyan-500/[0.02]' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {p.avatar_url ? (
                      <img src={p.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-bold">
                        {p.name?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-white text-sm">{p.name}</p>
                      <p className="text-[10px] text-slate-500">{p.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">@{p.username}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 text-[10px] font-black uppercase w-fit px-2 py-1 rounded-full border ${
                    p.role === 'super_admin'
                      ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                      : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                  }`}>
                    <ShieldCheck className="w-2.5 h-2.5" />
                    {p.role === 'super_admin' ? 'Super Admin' : 'Staff'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{getCrossingName(p.cross_id)}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{new Date(p.created_at).toLocaleDateString('id-ID')}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                      <Pencil className="w-4 h-4" />
                    </button>
                    {p.id !== currentProfile?.id && (
                      <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all disabled:opacity-50">
                        {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      {modal === 'add' && (
        <Modal title="Tambah User Baru" onClose={() => setModal(null)}>
          <div className="space-y-4">
            {[
              { label: 'Email *',    key: 'email',    type: 'email',    placeholder: 'nama@email.com' },
              { label: 'Nama *',     key: 'name',     type: 'text',     placeholder: 'Nama Lengkap' },
              { label: 'Username *', key: 'username', type: 'text',     placeholder: 'username_123' },
              { label: 'Password *', key: 'password', type: 'password', placeholder: 'Min 8 karakter' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{f.label}</label>
                <input type={f.type} value={(addForm as any)[f.key]} placeholder={f.placeholder}
                  onChange={e => setAddForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Role *</label>
              <select value={addForm.role} onChange={e => setAddForm(prev => ({ ...prev, role: e.target.value as UserRole }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all">
                <option value="staff">Staff Perlintasan</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            {addForm.role === 'staff' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Perlintasan</label>
                <select value={addForm.cross_id} onChange={e => setAddForm(prev => ({ ...prev, cross_id: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all">
                  <option value="">-- Tidak Ditugaskan --</option>
                  {crossings.map(c => <option key={c.cross_id} value={c.cross_id}>{c.name}</option>)}
                </select>
              </div>
            )}
            {error && <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3"><AlertCircle className="w-4 h-4 shrink-0" /> {error}</div>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold transition-all">Batal</button>
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Membuat...' : 'Buat User'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {modal === 'edit' && editForm && (
        <Modal title="Edit User" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email</label>
              <input type="text" value={editForm.email || ''} disabled className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed" />
            </div>
            {[
              { label: 'Nama *',     key: 'name' },
              { label: 'Username *', key: 'username' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{f.label}</label>
                <input type="text" value={(editForm as any)[f.key] || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Role</label>
              <select value={editForm.role || 'staff'} onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value as UserRole }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all">
                <option value="staff">Staff Perlintasan</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Perlintasan</label>
              <select value={editForm.cross_id || ''} onChange={e => setEditForm(prev => ({ ...prev, cross_id: e.target.value || null }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all">
                <option value="">-- Super Admin (Semua) --</option>
                {crossings.map(c => <option key={c.cross_id} value={c.cross_id}>{c.name}</option>)}
              </select>
            </div>
            {error && <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3"><AlertCircle className="w-4 h-4 shrink-0" /> {error}</div>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold transition-all">Batal</button>
              <button onClick={handleEdit} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2">
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

export default withAuth(AdminUsers, { requiredRole: 'super_admin' });