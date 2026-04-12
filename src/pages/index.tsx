//import RealtimeClock from "@/components/RealtimeClock";
import StatusCard from "../components/layouts/status/statuscard";


export default function Home() {
  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="text-2xl text-cyan-400 font-bold tracking-widest">
          SMART RAILWAY GATE CONTROL PANEL
        </h1>

        <p className="text-gray-500">
          Real-time monitoring system dashboard
        </p>

      </div>


      {/* GRID INFO PANEL */}

      <div className="grid grid-cols-4 gap-6">

        <StatusCard
          title="TRAIN STATUS"
          value="NO TRAIN"
          color="text-green-400"
        />

        <StatusCard
          title="GATE POSITION"
          value="OPEN"
          color="text-yellow-400"
        />

        <StatusCard
          title="SYSTEM STATUS"
          value="ONLINE"
          color="text-green-400"
        />

        {/* <RealtimeClock /> */}

      </div>


      {/* GRID SENSOR PANEL */}

      <div className="grid grid-cols-3 gap-6">

        <StatusCard
          title="ULTRASONIC SENSOR"
          value="ACTIVE"
          color="text-green-400"
        />

        <StatusCard
          title="INFRARED SENSOR"
          value="ACTIVE"
          color="text-green-400"
        />

        <StatusCard
          title="SERVO MOTOR"
          value="STANDBY"
          color="text-yellow-400"
        />

      </div>

    </div>
  );
}