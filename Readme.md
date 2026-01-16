# **Riffle — Poker Chips Manager 🎲**

A real-time web app for managing poker chips during live, in-person games.

Riffle replaces the physical chip set and manual calculations. It tracks bets, manages the pot, and syncs every action instantly across all players’ devices.

**Live Demo:** [https://riffle-poker-chips-manager.vercel.app/](https://riffle-poker-chips-manager.vercel.app/)

> **Note:** Riffle does not deal cards. It focuses purely on chip management, betting logic, and round flow.

---

## **Key Features**

* **Zero Friction Setup**
  Join a table instantly. No accounts, no authentication.

* **Real-Time Sync**
  Every bet, raise, and fold updates live for all players using WebSockets.

* **Complete Betting Logic**
  Supports Bet, Raise, Call, Check, Fold, and All-in with proper validation.

* **Automatic Pot Tracking**
  Calculates pot size and required call amounts automatically.

* **Winner Distribution**
  Select a winner to award the pot and reset the round in one action.

* **Action Log**
  A persistent, chat-style history of every move at the table.

* **Mobile-First Design**
  Sticky controls and touch-friendly layout for phone-based play.

---

## **Tech Stack**

* **Frontend:** Next.js (App Router), Tailwind CSS
* **Backend:** Node.js, Express, Socket.io
* **State Management:** In-memory (RAM)
  *Game rooms reset on server restart*
