import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Sidebar from "@/components/layouts/sidebar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-[#020617] text-white min-h-screen flex">

      <Sidebar />

      <main className="flex-1">
        <Component {...pageProps} />
      </main>

    </div>
  );
}