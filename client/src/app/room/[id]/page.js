// client/src/app/room/[id]/page.js
"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import io from "socket.io-client";

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = params.id;
  const playerName = searchParams.get("name");

  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({
    players: [],
    logs: [],
    pot: 0,
  });
  const [myId, setMyId] = useState("");

  // New State for Tabs and Slider
  const [activeTab, setActiveTab] = useState("leaderboard"); // 'leaderboard' or 'logs'
  const [raiseAmount, setRaiseAmount] = useState(5);
  const [actionMode, setActionMode] = useState("raise"); // 'raise' or 'take'

  const logsEndRef = useRef(null);
  const mainContainerRef = useRef(null);

  // Improved Scroll Logic
  const scrollToBottom = () => {
    if (activeTab === "logs" && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  // Scroll when logs update
  useEffect(() => {
    if (activeTab === "logs") {
      // Small timeout allows DOM to paint before scrolling
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [gameState.logs, activeTab]);

  useEffect(() => {
    if (!playerName) {
      router.push("/");
      return;
    }

    const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setMyId(newSocket.id);
      newSocket.emit("join_room", { roomId, playerName });
    });

    newSocket.on("update_game", (data) => {
      setGameState((prev) => ({ ...prev, ...data }));
    });

    newSocket.on("room_joined", (data) => {
      setGameState((prev) => ({ ...prev, ...data }));
    });

    newSocket.on("error", (msg) => {
      alert(msg);
    });

    return () => newSocket.disconnect();
  }, [roomId, playerName, router]);

  const me = gameState.players.find((p) => p.id === myId);

  // Calculate Call Amount
  const highestBet =
    gameState.players.length > 0
      ? Math.max(...gameState.players.map((p) => p.currentBet || 0))
      : 0;
  const callAmount = me ? highestBet - (me.currentBet || 0) : 0;

  // --- ACTIONS ---

  const handleFold = () => {
    if (!socket) return;
    socket.emit("action_fold", { roomId });
  };

  const handleBet = (amount) => {
    if (!socket) return;
    if (amount > me.chips) return alert("Not enough chips!");
    socket.emit("action_bet", { roomId, amount });
    setRaiseAmount(5); 
  };

  const handleTake = (amount) => {
    if (!socket) return;
    if (amount > gameState.pot)
      return alert("Cannot take more than pot amount!");
    // Ensure your backend supports 'action_take'
    socket.emit("action_take", { roomId, amount });
    setRaiseAmount(5); 
  };

  const handleAllIn = () => {
    if (!socket) return;
    if (window.confirm("Are you sure you want to go ALL IN?")) {
      handleBet(me.chips);
    }
  };

  const handleWin = (winnerId, winnerName) => {
    if (!socket) return;
    if (confirm(`Award the pot of ${gameState.pot} chips to ${winnerName}?`)) {
      socket.emit("action_win", { roomId, winnerId });
    }
  };

  const handleLeaveRoom = () => {
    if (window.confirm("Are you sure you want to leave this room?")) {
      localStorage.removeItem(`room_${roomId}`);
      localStorage.removeItem("lastRoom");
      if (socket) socket.disconnect();
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden">
      {/* HEADER */}
      <header className="bg-slate-800 p-3 shadow-md flex justify-between items-center z-10 shrink-0">
        <div>
          <span className="text-slate-400 text-[10px] uppercase tracking-wider">
            Room
          </span>
          <h1 className="text-xl font-mono font-bold text-green-400 tracking-widest leading-none">
            {roomId}
          </h1>
        </div>
        <div className="text-right flex flex-col items-end">
          <button
            onClick={handleLeaveRoom}
            className="text-[10px] bg-red-900/30 hover:bg-red-900/50 text-red-200 px-2 py-0.5 rounded border border-red-900/50 mb-1 transition"
          >
            LEAVE
          </button>
          <div className="flex items-baseline gap-2">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider">
                Pot
            </span>
            <span className="text-xl font-bold text-yellow-400 leading-none">
                {gameState.pot}
            </span>
          </div>
        </div>
      </header>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-slate-700 bg-slate-800/50 z-10 shrink-0">
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`flex-1 py-3 text-xs font-bold tracking-wide transition ${
            activeTab === "leaderboard"
              ? "text-green-400 border-b-2 border-green-400 bg-slate-800"
              : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          LEADERBOARD
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex-1 py-3 text-xs font-bold tracking-wide transition flex items-center justify-center gap-2 ${
            activeTab === "logs"
              ? "text-green-400 border-b-2 border-green-400 bg-slate-800"
              : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          LOGS
          <span className="text-[10px] bg-slate-700 px-1.5 rounded-full text-slate-300">
            {gameState.logs.length}
          </span>
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      {/* Added pb-80 to ensure content clears the footer */}
      <main 
        ref={mainContainerRef}
        className="flex-1 overflow-y-auto p-4 pb-80 bg-slate-900 min-h-0"
      >
        {/* VIEW: LEADERBOARD */}
        {activeTab === "leaderboard" && (
          <div className="space-y-2 animate-in fade-in duration-300">
            {gameState.players
              .sort((a, b) => b.chips - a.chips)
              .map((player) => (
                <div
                  key={player.id}
                  className={`flex justify-between items-center p-3 rounded-lg border relative overflow-hidden transition-all ${
                    player.id === myId
                      ? "bg-slate-800 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                      : "bg-slate-800 border-slate-700"
                  } ${player.isFolded ? "opacity-50 grayscale" : ""}`}
                >
                  {gameState.pot > 0 && (
                    <button
                      onClick={() => handleWin(player.id, player.name)}
                      className="absolute right-14 top-1/2 -translate-y-1/2 bg-yellow-600 hover:bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow z-20"
                    >
                      WIN POT
                    </button>
                  )}

                  <div>
                    <div className="font-bold flex items-center gap-2 text-sm">
                      {player.name}
                      {player.id === myId && (
                        <span className="text-[9px] bg-green-600 text-white px-1 py-0.5 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Bet:{" "}
                      <span className="text-yellow-400 font-mono">
                        {player.currentBet}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-mono text-white font-bold tracking-tight">
                    {player.chips}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* VIEW: LOGS */}
        {activeTab === "logs" && (
          <div className="space-y-1 font-mono text-xs animate-in fade-in duration-300">
            {gameState.logs.length === 0 && (
              <p className="text-slate-600 italic text-center mt-10">
                Game started. Waiting for bets...
              </p>
            )}
            {gameState.logs.map((log, i) => (
              <div
                key={i}
                className="text-slate-300 p-2 border-b border-slate-800/50 last:border-0 bg-slate-800/30 rounded"
              >
                {log}
              </div>
            ))}
            {/* The scroll anchor */}
            <div ref={logsEndRef} className="h-4" />
          </div>
        )}
      </main>

      {/* CONTROLS (Sticky Footer) */}
      {me && !me.isFolded && (
        <footer className="fixed bottom-0 w-full bg-slate-800 border-t border-slate-700 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
          <div className="max-w-md mx-auto p-2 space-y-2">
            
            {/* 1. COMPACT BETTING CONTROLS */}
            <div className="flex flex-col gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-700">
              
              {/* Row 1: Mode Switch & Value Display */}
              <div className="flex items-center justify-between gap-2">
                {/* Mode Toggle */}
                <div className="flex bg-slate-800 rounded p-0.5 flex-1 max-w-[140px]">
                    <button
                    onClick={() => setActionMode("raise")}
                    className={`flex-1 py-1 text-[10px] font-bold rounded transition ${
                        actionMode === "raise"
                        ? "bg-green-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                    >
                    RAISE
                    </button>
                    <button
                    onClick={() => setActionMode("take")}
                    className={`flex-1 py-1 text-[10px] font-bold rounded transition ${
                        actionMode === "take"
                        ? "bg-orange-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                    >
                    TAKE
                    </button>
                </div>
                
                {/* Value Display */}
                <div className={`text-xl font-mono font-bold leading-none ${
                    actionMode === "raise" ? "text-green-400" : "text-orange-400"
                }`}>
                    {raiseAmount}
                </div>
              </div>

              {/* Row 2: Slider & Steppers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRaiseAmount(Math.max(5, raiseAmount - 5))}
                  className="bg-slate-700 hover:bg-slate-600 text-white w-8 h-8 rounded flex items-center justify-center font-bold text-lg transition"
                >
                  −
                </button>
                <input
                  type="range"
                  min="5"
                  max={actionMode === "raise" ? me.chips : gameState.pot}
                  step="5"
                  value={Math.min(
                    raiseAmount,
                    actionMode === "raise" ? me.chips : gameState.pot
                  )}
                  onChange={(e) => setRaiseAmount(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <button
                  onClick={() =>
                    setRaiseAmount(
                      Math.min(
                        actionMode === "raise" ? me.chips : gameState.pot,
                        raiseAmount + 5
                      )
                    )
                  }
                  className="bg-slate-700 hover:bg-slate-600 text-white w-8 h-8 rounded flex items-center justify-center font-bold text-lg transition"
                >
                  +
                </button>
              </div>

              {/* Row 3: Quick Add & Action Button */}
              <div className="flex gap-2">
                  <div className="flex gap-1 flex-1">
                    {[10, 50, 100].map((amount) => (
                    <button
                        key={amount}
                        onClick={() =>
                        setRaiseAmount(
                            Math.min(
                            actionMode === "raise" ? me.chips : gameState.pot,
                            raiseAmount + amount
                            )
                        )
                        }
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white py-1 rounded text-[10px] font-bold border border-slate-700 transition"
                    >
                        +{amount}
                    </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() =>
                    actionMode === "raise"
                        ? handleBet(parseInt(raiseAmount))
                        : handleTake(parseInt(raiseAmount))
                    }
                    disabled={
                    raiseAmount < 5 ||
                    (actionMode === "take" && gameState.pot === 0)
                    }
                    className={`disabled:bg-slate-700 disabled:text-slate-500 text-white px-3 py-1 rounded font-bold text-xs min-w-[80px] transition shadow ${
                    actionMode === "raise"
                        ? "bg-green-600 hover:bg-green-500"
                        : "bg-orange-600 hover:bg-orange-500"
                    }`}
                >
                    {actionMode === "raise" ? "BET" : "TAKE"}
                </button>
              </div>
            </div>

            {/* 2. MAIN ACTIONS GRID */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleFold}
                className="bg-red-900/40 text-red-200 py-3 rounded font-bold text-xs border border-red-900/50 hover:bg-red-900/60 transition"
              >
                FOLD
              </button>

              <button
                disabled={callAmount > 0}
                onClick={() => handleBet(0)}
                className={`py-3 rounded font-bold text-xs border transition ${
                  callAmount > 0
                    ? "bg-slate-700/50 text-slate-600 border-transparent cursor-not-allowed"
                    : "bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
                }`}
              >
                CHECK
              </button>

              <button
                disabled={callAmount === 0}
                onClick={() => handleBet(callAmount)}
                className={`py-3 rounded font-bold text-xs border flex flex-col items-center justify-center leading-none transition ${
                  callAmount === 0
                    ? "bg-slate-700/50 text-slate-600 border-transparent cursor-not-allowed"
                    : "bg-blue-600 text-white border-blue-500 hover:bg-blue-500"
                }`}
              >
                <span>CALL</span>
                {callAmount > 0 && (
                  <span className="text-[9px] opacity-80 mt-0.5">
                    {callAmount}
                  </span>
                )}
              </button>

              <button
                onClick={handleAllIn}
                className="bg-yellow-600 text-white py-3 rounded font-bold text-xs border border-yellow-500 hover:bg-yellow-500 transition"
              >
                ALL IN
              </button>
            </div>
          </div>
        </footer>
      )}

      {me && me.isFolded && (
        <footer className="fixed bottom-0 w-full bg-slate-900/95 backdrop-blur p-6 text-center text-red-500 font-bold border-t border-red-900 z-20">
          YOU HAVE FOLDED
        </footer>
      )}
    </div>
  );
}