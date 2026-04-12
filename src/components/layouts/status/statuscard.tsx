type Props = {
  title: string;
  value: string;
  color: string;
};

export default function StatusCard({ title, value, color }: Props) {
  return (
    <div className="bg-[#0b1117] border border-cyan-500/10 rounded-xl p-6">

      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <h2 className={`text-2xl font-bold ${color}`}>
        {value}
      </h2>

    </div>
  );
}