# Riffle- Poker Chips Manager 🎲

A minimalist, real-time web application for tracking poker chips during physical home games. 

**Note:** This app **does not deal cards**. It replaces the physical chip set, handling the math, pot calculation, and betting rounds automatically.

## 🚀 Features

*   **Instant Setup:** No login or sign-up required. Just enter a name and join.
*   **Real-Time Sync:** Powered by Socket.io, every bet updates instantly on all devices.
*   **Betting Logic:** Handle Bets, Raises, Calls, Checks, Folds, and All-ins with validation.
*   **Pot Management:** Automatically calculates the pot and "Call" amounts.
*   **Win Distribution:** Select a winner to instantly award the pot and reset the round.
*   **Game Logs:** A persistent chat-like history of every action.
*   **Mobile First:** Designed with sticky controls for easy use on phones.

## 🛠 Tech Stack

*   **Frontend:** Next.js (App Router), Tailwind CSS
*   **Backend:** Node.js, Express, Socket.io
*   **Storage:** In-memory (RAM) - *Rooms reset if server restarts.*