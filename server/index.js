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
  getPlayerIdFromSocket,
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
  socket.on("join_room", ({ roomId, playerName, playerId, socketId }) => {
    const result = joinRoom(roomId, playerId, playerName, socket.id);

    if (result.error) {
      // Send specific event for name taken
      socket.emit("name_taken", result.error);
      return;
    }

    const { room, player, isReconnect } = result;

    // Join the socket channel
    socket.join(roomId);

    // 1. Tell the user they joined successfully
    socket.emit("room_joined", {
      roomId,
      player,
      players: room.players,
      logs: room.logs,
      pot: room.pot,
    });

    // 2. Tell everyone else in the room that the list of players changed
    // (Skip if it's a reconnection to avoid spam)
    if (!isReconnect) {
      socket.to(roomId).emit("update_game", {
        players: room.players,
        logs: room.logs,
        pot: room.pot,
      });
    }

    console.log(
      `${playerName} ${isReconnect ? "reconnected to" : "joined"} room ${roomId}`,
    );
  });

  // Event: Player Bets/Raises/Calls
  socket.on("action_bet", ({ roomId, amount, playerId }) => {
    // Convert string to number just in case
    const betAmount = parseInt(amount, 10);

    // Use provided playerId or fall back to socket-based lookup
    const playerIdToUse = playerId || getPlayerIdFromSocket(socket.id);

    const result = placeBet(roomId, playerIdToUse, betAmount);

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
  socket.on("action_fold", ({ roomId, playerId }) => {
    // Use provided playerId or fall back to socket-based lookup
    const playerIdToUse = playerId || getPlayerIdFromSocket(socket.id);

    const result = foldPlayer(roomId, playerIdToUse);

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
  socket.on("action_take", ({ roomId, amount, playerId }) => {
    const takeAmount = parseInt(amount, 10);

    // Use provided playerId or fall back to socket-based lookup
    const playerIdToUse = playerId || getPlayerIdFromSocket(socket.id);

    const result = takeFromPot(roomId, playerIdToUse, takeAmount);

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

  // Event: Intentional Leave Room
  socket.on("leave_room", ({ roomId, playerId }) => {
    const result = removePlayer(socket.id, true); // true = intentional leave

    if (result && !result.deleted) {
      const { roomId, room } = result;
      // Tell remaining players someone left
      io.to(roomId).emit("update_game", {
        players: room.players,
        logs: room.logs,
        pot: room.pot,
      });
    }

    console.log(`Player intentionally left room ${roomId}`);
  });

  // Event: Disconnect
  socket.on("disconnect", () => {
    // Don't remove player on disconnect - they might reconnect
    // Only clean up the socket-to-player mapping
    const result = removePlayer(socket.id, false); // false = not intentional

    // Don't notify other players - they'll see the player is still there
    // and can continue the game

    console.log("User Disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
