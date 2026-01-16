// client/src/app/about/page.js
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white selection:bg-green-500 selection:text-white">
      
      {/* --- NAVBAR (Consistent with Home) --- */}
      <nav className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-slate-900 text-lg group-hover:scale-110 transition">
            $
          </div>
          <span className="font-bold text-xl tracking-tight">PokerChips</span>
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
      <main className="flex-1 w-full max-w-4xl mx-auto p-6 flex flex-col gap-12 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <section className="text-center space-y-6 py-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Virtual Chips. <br/>
            <span className="text-green-400">Physical Games.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A minimalist tool to manage poker chips for your home games. 
            No sign-ups, no downloads, just a browser and your friends.
          </p>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-green-500/30 transition shadow-lg">
            <div className="w-12 h-12 bg-green-900/30 text-green-400 rounded-lg flex items-center justify-center text-2xl mb-4">
              📱
            </div>
            <h3 className="text-xl font-bold mb-2">No App Required</h3>
            <p className="text-slate-400 leading-relaxed">
              Forget downloading huge apps. PokerChips runs entirely in your web browser. 
              It works perfectly on iPhones, Androids, Tablets, and Laptops.
            </p>
          </div>

          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-green-500/30 transition shadow-lg">
            <div className="w-12 h-12 bg-blue-900/30 text-blue-400 rounded-lg flex items-center justify-center text-2xl mb-4">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-2">Real-Time Sync</h3>
            <p className="text-slate-400 leading-relaxed">
              Powered by WebSockets, every bet, raise, and fold happens instantly on everyone's screen.
              No refreshing required.
            </p>
          </div>

          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-green-500/30 transition shadow-lg">
            <div className="w-12 h-12 bg-purple-900/30 text-purple-400 rounded-lg flex items-center justify-center text-2xl mb-4">
              🔒
            </div>
            <h3 className="text-xl font-bold mb-2">Private & Secure</h3>
            <p className="text-slate-400 leading-relaxed">
              We don't ask for your email, phone number, or credit card. 
              Rooms are temporary and exist only in memory while you play.
            </p>
          </div>

          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-green-500/30 transition shadow-lg">
            <div className="w-12 h-12 bg-yellow-900/30 text-yellow-400 rounded-lg flex items-center justify-center text-2xl mb-4">
              💰
            </div>
            <h3 className="text-xl font-bold mb-2">Handles the Math</h3>
            <p className="text-slate-400 leading-relaxed">
              No more arguing over pot size. The app tracks every chip, calculates side pots (coming soon), 
              and ensures accurate betting.
            </p>
          </div>

        </section>

        {/* How It Works */}
        <section className="py-8 border-t border-slate-800">
          <h2 className="text-2xl font-bold mb-6 text-center">How it works</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center font-bold text-sm">1</span>
              <p className="text-slate-300 pt-1">One person clicks <strong>Create Table</strong> and gets a 4-letter Room Code.</p>
            </div>
            <div className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center font-bold text-sm">2</span>
              <p className="text-slate-300 pt-1">Friends open the site, click <strong>Join</strong>, and enter that code.</p>
            </div>
            <div className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center font-bold text-sm">3</span>
              <p className="text-slate-300 pt-1">Everyone gets 1,000 chips. Start betting!</p>
            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER (Same as Home) --- */}
      <footer className="w-full p-6 text-center border-t border-slate-800/50 mt-12">
        <p className="text-slate-500 text-xs">
            By using this you agree to our{' '}
            <Link href="/tnc" className="text-slate-400 underline hover:text-green-400 transition">
                Terms & Conditions
            </Link>
        </p>
      </footer>

    </div>
  );
}