interface StatusCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  status?: 'safe' | 'warning' | 'active' | 'danger';
  desc?: string;
  variant?: 'default' | 'compact';
}

const colors = {
  safe:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  active:  'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  danger:  'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

export default function StatusCard({
  title, value, icon, status = 'active', desc, variant = 'default',
}: StatusCardProps) {
  if (variant === 'compact') {
    return (
      <div className={`p-4 rounded-xl border ${colors[status]} flex items-center gap-4`}>
        <div className="p-2 rounded-lg bg-black/20 text-current">{icon}</div>
        <div>
          <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider leading-none mb-1">{title}</p>
          <p className="text-sm font-bold text-slate-100">{value}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden p-6 rounded-2xl border ${colors[status]} transition-all hover:scale-[1.02]`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">{title}</p>
          <h3 className="text-3xl font-black text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-black/30 ${colors[status]}`}>{icon}</div>
      </div>
      {desc && <p className="text-xs text-slate-500 font-medium italic">{desc}</p>}
      <div className="absolute -bottom-4 -right-4 w-20 h-20 blur-3xl opacity-20 rounded-full bg-current" />
    </div>
  );
}