import styles from "./analytics.module.scss";

export default function Analytics() {

  // DATA DUMMY jumlah kereta lewat per hari
  const trainData = [
    { day: "Sen", count: 7 },
    { day: "Sel", count: 12 },
    { day: "Rab", count: 5 },
    { day: "Kam", count: 9 },
    { day: "Jum", count: 15 },
    { day: "Sab", count: 3 },
    { day: "Min", count: 8 },
  ];

  // hitung max value untuk scaling chart
  const maxValue = Math.max(...trainData.map(d => d.count));

  // generate titik koordinat line chart
  const points = trainData
    .map((item, index) => {
      const x = index * 90 + 40;
      const y = 200 - (item.count / maxValue) * 160;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={styles.container}>

      <div className={styles.headerBox}>
        <h1 className={styles.title}>
          TRAIN TRAFFIC ANALYTICS
        </h1>

        <p className={styles.subtitle}>
          Grafik jumlah kereta yang melintas berdasarkan hari
        </p>
      </div>

      <div className={styles.chartWrapper}>

        <svg className={styles.chart} viewBox="0 0 700 240">

          {/* gradient fill */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>


          {/* grid horizontal */}
          {[40, 80, 120, 160, 200].map((y) => (
            <line
              key={y}
              x1="40"
              x2="660"
              y1={y}
              y2={y}
              className={styles.gridLine}
            />
          ))}


          {/* area fill */}
          <polygon
            className={styles.area}
            points={`40,200 ${points} 580,200`}
          />


          {/* line chart */}
          <polyline
            className={styles.line}
            points={points}
          />


          {/* titik */}
          {trainData.map((item, index) => {
            const x = index * 90 + 40;
            const y = 200 - (item.count / maxValue) * 160;

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="5"
                className={styles.point}
              />
            );
          })}


          {/* label hari */}
          {trainData.map((item, index) => {
            const x = index * 90 + 40;

            return (
              <text
                key={item.day}
                x={x}
                y="225"
                className={styles.axisLabel}
              >
                {item.day}
              </text>
            );
          })}

        </svg>

      </div>

    </div>
  );
}