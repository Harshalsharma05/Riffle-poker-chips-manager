// client/src/app/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // For the navigation links

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(true); // Toggle between Join and Create view

  const handleJoin = (e) => {
    e.preventDefault();
    if (!name || !roomCode) return alert("Please enter name and room code");
    router.push(`/room/${roomCode}?name=${name}`);
  };

  const handleCreate = () => {
    if (!name) return alert("Please enter your name first");

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const newCode = Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    router.push(`/room/${newCode}?name=${name}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white selection:bg-green-500 selection:text-white">
      {/* --- NAVBAR --- */}
      <nav className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          {/* Simple Icon/Logo */}
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-slate-900 text-lg">
            <img src="/icon.svg" alt="Riffle Logo" className="w-8 h-8" />
          </div>
          <span className="font-bold text-2xl tracking-tight">Riffle</span>
        </div>
        <div>
          <Link
            href="/about"
            className="text-sm font-semibold text-slate-400 hover:text-white transition"
          >
            ABOUT
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        {/* LEFT COLUMN: The "Main Card" (Form) */}
        <div className="w-full max-w-md flex flex-col gap-6 lg:gap-8 animate-in slide-in-from-left duration-700">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Virtual Chips.
              <br />
              <span className="text-green-400">Real Drama.</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg">
              No physical chips? No problem. Manage your home poker games simply
              and efficiently.
            </p>
          </div>

          {/* The Form Card */}
          <div className="bg-slate-800 p-5 sm:p-6 lg:p-8 rounded-2xl shadow-2xl border border-slate-700">
            {/* Toggle Tabs */}
            <div className="flex bg-slate-900/50 p-1 rounded-lg mb-6">
              <button
                onClick={() => setIsJoining(true)}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition cursor-pointer ${
                  isJoining
                    ? "bg-slate-700 text-white shadow"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                JOIN TABLE
              </button>
              <button
                onClick={() => setIsJoining(false)}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition cursor-pointer ${
                  !isJoining
                    ? "bg-green-600 text-white shadow"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                CREATE TABLE
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-slate-900 rounded-xl border border-slate-700 focus:outline-none focus:border-green-500 transition font-medium"
                  placeholder="e.g. Maverick"
                />
              </div>

              {isJoining ? (
                <form onSubmit={handleJoin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">
                      Room Code
                    </label>
                    <input
                      type="text"
                      value={roomCode}
                      onChange={(e) =>
                        setRoomCode(e.target.value.toUpperCase())
                      }
                      className="w-full p-4 bg-slate-900 rounded-xl border border-slate-700 focus:outline-none focus:border-green-500 uppercase tracking-widest font-mono"
                      placeholder="ABCD"
                      maxLength={4}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-slate-100 text-slate-900 hover:bg-white rounded-xl font-bold text-lg transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                  >
                    Enter Room
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-900/20 border border-green-900/50 rounded-xl text-sm text-green-200">
                    You are about to create a new table. You will be the first
                    player.
                  </div>
                  <button
                    onClick={handleCreate}
                    className="w-full py-4 bg-green-500 text-slate-900 hover:bg-green-400 rounded-xl font-bold text-lg transition shadow-lg shadow-green-900/20 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Start New Game
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Mobile Mockup */}
        <div className="flex w-full max-w-xs sm:max-w-sm justify-center animate-in slide-in-from-right duration-700 delay-100">
          {/* CSS Phone Frame */}
          <div className="relative border-4 sm:border-8 border-slate-800 rounded-[2rem] sm:rounded-[3rem] h-[500px] sm:h-[600px] w-[250px] sm:w-[300px] shadow-2xl bg-slate-900 overflow-hidden ring-1 ring-slate-700">
            {/* Dynamic Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 sm:h-6 w-24 sm:w-32 bg-slate-800 rounded-b-xl z-20"></div>

            {/* Screen Image */}
            <div className="w-full h-full bg-slate-800 relative">
              {/* 
                        IMPORTANT: Ensure you have a file named 'demo.png' in your public folder.
                        If you don't, this will just show a dark grey box.
                     */}
              <img
                src="/demo.png"
                alt="App Screenshot"
                className="w-full h-full object-cover opacity-90"
              />

              {/* Gradient Overlay to make it blend */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-40 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full p-6 text-center">
        <p className="text-slate-500 text-xs">
          By using this you agree to our{" "}
          <Link
            href="/tnc"
            className="text-slate-400 underline hover:text-green-400 transition"
          >
            Terms & Conditions
          </Link>
        </p>
      </footer>
    </div>
  );
}
