import "@/styles/globals.css";
// import Sidebar from "@/components/sidebar";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-[#020617] text-white min-h-screen">

      <main className="ml-[260px] min-h-screen">
        <Component {...pageProps} />
         
      </main>

    </div>
  );
}