// import Link from "next/link";
// import { useRouter } from "next/router";
// import styles from "@/components/sidebar.module.scss";

// export default function Sidebar() {
//   const router = useRouter();

//   const isActive = (path: string) => {
//     return router.pathname === path ? styles.active : "";
//   };

//   return (
//     <aside className={styles.sidebar}>

//       {/* LOGO */}

//       <div>
//         <h1 className={styles.logo}>
//           Sistem Monitoring KAI
//         </h1>

//         <p className={styles.version}>
//           Dibuat oleh Kelompok 4
//         </p>
//       </div>


//       {/* MENU */}

//       <div className={styles.menuWrapper}>

//         <div className={`${styles.menuItem} ${isActive("/")}`}>
//           <Link href="/">
//             Monitoring
//           </Link>
//         </div>

//         <div className={`${styles.menuItem} ${isActive("/analytics")}`}>
//           <Link href="/analytics">
//             Analytics
//           </Link>
//         </div>

//         <div className={`${styles.menuItem} ${isActive("/devices")}`}>
//           <Link href="/devices">
//             Devices
//           </Link>
//         </div>

//         <div className={`${styles.menuItem} ${isActive("/logs")}`}>
//           <Link href="/logs">
//             Logs
//           </Link>
//         </div>

//       </div>


//       {/* EMERGENCY BUTTON */}



//     </aside>
//   );
// }