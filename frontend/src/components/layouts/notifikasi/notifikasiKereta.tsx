export default function notifikasiKereta() {

  const trainDetected = true;

  return (
    <div
      className={`p-6 rounded-xl text-white text-lg font-semibold
      ${trainDetected ? "bg-red-500" : "bg-green-500"}`}
    >
      {trainDetected
        ? "Kereta sedang lewat"
        : "Tidak ada kereta lewat"}
    </div>
  );
}