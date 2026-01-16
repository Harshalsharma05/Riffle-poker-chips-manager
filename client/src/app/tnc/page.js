// client/src/app/tnc/page.js
import Link from "next/link";
import { TNC_POINTS, LAST_UPDATED } from "@/constants/tncContent";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white selection:bg-green-500 selection:text-white">
      {/* --- NAVBAR --- */}
      <nav className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-slate-900 text-lg group-hover:scale-110 transition">
            $
          </div>
          <span className="font-bold text-xl tracking-tight">Riffle</span>
        </Link>
        <div>
          <Link
            href="/"
            className="text-sm font-bold text-slate-400 hover:text-white transition bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full"
          >
            BACK HOME
          </Link>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-6 animate-in fade-in duration-700 pb-20">
        {/* Page Header */}
        <header className="mb-12 border-b border-slate-800 pb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-green-400">
            Terms & Conditions
          </h1>
          <p className="text-slate-400">
            Please read these terms carefully before using the Riffle
            application.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Last Updated: {LAST_UPDATED}
          </p>
        </header>

        {/* Terms List */}
        <section className="space-y-8">
          {TNC_POINTS.map((item, index) => (
            <div key={index} className="space-y-2">
              <h2 className="text-xl font-bold text-white flex items-start gap-3">
                <span className="text-green-600 text-sm mt-1.5 opacity-70">
                  0{index + 1}.
                </span>
                {item.title}
              </h2>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base pl-8 border-l-2 border-slate-800 hover:border-slate-600 transition-colors">
                {item.content}
              </p>
            </div>
          ))}
        </section>

        {/* Closing Statement */}
        <div className="mt-16 p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
          <p className="text-slate-300">
            If you do not agree with any part of these terms, please discontinue
            use of the application immediately.
          </p>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full p-6 text-center border-t border-slate-800/50">
        <p className="text-slate-500 text-xs">
          © {new Date().getFullYear()} Riffle. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
