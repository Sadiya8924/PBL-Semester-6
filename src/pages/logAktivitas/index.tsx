export default function LogAktivitas() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Log Aktivitas
      </h1>
        <p className="text-gray-400 mb-6">
            Riwayat aktivitas sistem dan sensor
        </p>

      <div className="bg-[#0b1117] border border-cyan-500/10 rounded-xl p-6">
        <table className="w-full text-left">
            <thead>
                <tr>
                    <th className="pb-2 border-b border-cyan-500/10">Waktu</th>
                    <th className="pb-2 border-b border-cyan-500/10">Aktivitas</th>
                    <th className="pb-2 border-b border-cyan-500/10">Status</th>
                </tr>   
            </thead>
            <tbody>
                <tr>
                    <td className="py-2 border-b border-cyan-500/10">2024-06-01 14:30:00</td>
                    <td className="py-2 border-b border-cyan-500/10">Sensor Ultrasonik Aktif</td>
                    <td className="py-2 border-b border-cyan-500/10 text-green-400">Sukses</td>
                </tr>
                <tr>
                    <td className="py-2 border-b border-cyan-500/10">2024-06-01 14:35:00</td>
                    <td className="py-2 border-b border-cyan-500/10">Sensor Inframerah Aktif</td>
                    <td className="py-2 border-b border-cyan-500/10 text-green-400">Sukses</td>
                </tr>
                <tr>
                    <td className="py-2 border-b border-cyan-500/10">2024-06-01 14:40:00</td>
                    <td className="py-2 border-b border-cyan-500/10">Servo Motor Aktif</td>
                    <td className="py-2 border-b border-cyan-500/10 text-green-400">Sukses</td>
                </tr>
                <tr>
                    <td className="py-2 border-b border-cyan-500/10">2024-06-01 14:45:00</td>
                    <td className="py-2 border-b border-cyan-500/10">Kereta Terdeteksi</td>
                    <td className="py-2 border-b border-cyan-500/10 text-red-400">Peringatan</td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
    );
}
