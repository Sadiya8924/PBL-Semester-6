import styles from "./monitoring.module.scss";

export default function Monitoring() {
  return (
    <div className={styles.container}>

      {/* HEADER PANEL */}

      <div className={styles.headerBox}>
        <h1 className={styles.title}>
          MONITORING PALANG PINTU KAI
        </h1>

        <p className={styles.subtitle}>
          Status realtime sistem palang otomatis berbasis IoT
        </p>
      </div>


      {/* STATUS GRID */}

      <div className={styles.gridWrapper}>

        <div className={styles.card}>
          <span className={styles.cardTitle}>
            STATUS KERETA
          </span>

          <span className={styles.cardValue}>
            TIDAK ADA KERETA
          </span>
        </div>


        <div className={styles.card}>
          <span className={styles.cardTitle}>
            STATUS PALANG
          </span>

          <span className={styles.cardValue}>
            TERBUKA
          </span>
        </div>


        <div className={styles.card}>
          <span className={styles.cardTitle}>
            SENSOR ULTRASONIK
          </span>

          <span className={styles.cardValue}>
            AKTIF
          </span>
        </div>


        <div className={styles.card}>
          <span className={styles.cardTitle}>
            SENSOR INFRARED
          </span>

          <span className={styles.cardValue}>
            AKTIF
          </span>
        </div>

      </div>

    </div>
  );
}