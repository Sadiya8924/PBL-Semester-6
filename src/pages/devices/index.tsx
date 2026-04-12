import styles from "./devices.module.scss";

export default function Devices() {
  return (
    <div className={styles.container}>

      {/* HEADER PANEL */}

      <div className={styles.headerBox}>
        <h1 className={styles.title}>
          DEVICE STATUS
        </h1>

        <p className={styles.subtitle}>
          Status Sensor Palang Pintu Kereta Api Berbasis IoT
        </p>
      </div>


      {/* SUMMARY SENSOR COUNT */}

      <div className={styles.statsWrapper}>

        <div className={styles.statCard}>
          <p className={styles.statTitle}>
            ULTRASONIC SENSOR
          </p>

          <h2 className={styles.statValue}>
            1 UNIT
          </h2>
        </div>


        <div className={styles.statCard}>
          <p className={styles.statTitle}>
            INFRARED SENSOR
          </p>

          <h2 className={styles.statValue}>
            2 UNIT
          </h2>
        </div>


        <div className={styles.statCard}>
          <p className={styles.statTitle}>
            SERVO MOTOR
          </p>

          <h2 className={styles.statValue}>
            2 UNIT
          </h2>
        </div>

      </div>


      {/* GRID DEVICE STATUS */}

      <div className={styles.gridWrapper}>

        <div className={styles.card}>
          <p className={styles.cardTitle}>
            ULTRASONIC SENSOR
          </p>

          <h2 className={`${styles.status} ${styles.active}`}>
            ACTIVE
          </h2>

          <p className={styles.description}>
            Distance: 120 cm
          </p>
        </div>


        <div className={styles.card}>
          <p className={styles.cardTitle}>
            INFRARED SENSOR
          </p>

          <h2 className={`${styles.status} ${styles.warning}`}>
            DETECTED
          </h2>

          <p className={styles.description}>
            Object detected on track
          </p>
        </div>


        <div className={styles.card}>
          <p className={styles.cardTitle}>
            SERVO MOTOR
          </p>

          <h2 className={`${styles.status} ${styles.moving}`}>
            MOVING
          </h2>

          <p className={styles.description}>
            Gate closing
          </p>
        </div>

      </div>

    </div>
  );
}