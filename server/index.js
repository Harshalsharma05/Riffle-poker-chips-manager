// server/index.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Import our new game logic
const {
  createRoom,
  joinRoom,
  removePlayer,
  placeBet,
  foldPlayer,
  takeFromPot,
  endRound,
} = require("./gameStore");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Event: Create a Room
  socket.on("create_room", ({ playerName }) => {
    const { roomId, player } = createRoom(socket.id, playerName);

    // Join the socket to a specific "channel" named after the room ID
    socket.join(roomId);

    // Send the details back to the creator
    socket.emit("room_joined", { roomId, player, players: [player], logs: [] });
    console.log(`${playerName} created room ${roomId}`);
  });

  // Event: Join a Room
  socket.on("join_room", ({ roomId, playerName }) => {
    const result = joinRoom(roomId, socket.id, playerName);

    if (result.error) {
      socket.emit("error", result.error);
      return;
    }

    const { room, player } = result;

    // Join the socket channel
    socket.join(roomId);

    // 1. Tell the user they joined successfully
    socket.emit("room_joined", {
      roomId,
      player,
      players: room.players,
      logs: room.logs,
    });

    // 2. Tell everyone else in the room that the list of players changed
    socket
      .to(roomId)
      .emit("update_game", { players: room.players, logs: room.logs });

    console.log(`${playerName} joined room ${roomId}`);
  });

  // Event: Player Bets/Raises/Calls
  socket.on("action_bet", ({ roomId, amount }) => {
    // Convert string to number just in case
    const betAmount = parseInt(amount, 10);

    const result = placeBet(roomId, socket.id, betAmount);

    if (result.error) {
      socket.emit("error", result.error);
    } else {
      // Broadcast new state to everyone in the room
      io.to(roomId).emit("update_game", {
        players: result.room.players,
        logs: result.room.logs,
        pot: result.room.pot,
      });
    }
  });

  // Event: Player Folds
  socket.on("action_fold", ({ roomId }) => {
    const result = foldPlayer(roomId, socket.id);

    if (result.error) {
      socket.emit("error", result.error);
    } else {
      io.to(roomId).emit("update_game", {
        players: result.room.players,
        logs: result.room.logs,
      });
    }
  });

  // Event: Player Takes Back Chips from Pot
  socket.on("action_take", ({ roomId, amount }) => {
    const takeAmount = parseInt(amount, 10);

    const result = takeFromPot(roomId, socket.id, takeAmount);

    if (result.error) {
      socket.emit("error", result.error);
    } else {
      io.to(roomId).emit("update_game", {
        players: result.room.players,
        logs: result.room.logs,
        pot: result.room.pot,
      });
    }
  });

  // Event: End Round (Select Winner)
  socket.on("action_win", ({ roomId, winnerId }) => {
    const result = endRound(roomId, winnerId);

    if (result.error) {
      socket.emit("error", result.error);
    } else {
      io.to(roomId).emit("update_game", {
        players: result.room.players,
        logs: result.room.logs,
        pot: result.room.pot,
      });
    }
  });

  // Event: Disconnect
  socket.on("disconnect", () => {
    const result = removePlayer(socket.id);

    if (result && !result.deleted) {
      const { roomId, room } = result;
      // Tell remaining players someone left
      io.to(roomId).emit("update_game", {
        players: room.players,
        logs: room.logs,
      });
    }

    console.log("User Disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
