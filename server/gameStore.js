// server/gameStore.js
const rooms = {};

const joinRoom = (roomId, playerId, playerName) => {
  // 1. If room doesn't exist, create it on the fly
  if (!rooms[roomId]) {
    rooms[roomId] = {
      id: roomId,
      players: [],
      pot: 0,
      logs: [],
    };
    console.log(`New Room Created: ${roomId}`);
  }

  const room = rooms[roomId];

  // 2. Check if player already exists (reconnection logic)
  const existingPlayer = room.players.find((p) => p.id === playerId);
  if (existingPlayer) {
    return { room, player: existingPlayer };
  }

  // 3. Add new player
  const newPlayer = {
    id: playerId,
    name: playerName,
    chips: 1000,
    currentBet: 0,
    isFolded: false,
  };

  room.players.push(newPlayer);
  room.logs.push(`${playerName} joined the table.`);

  return { room, player: newPlayer };
};

const getRoom = (roomId) => rooms[roomId];

const removePlayer = (playerId) => {
  for (const roomId in rooms) {
    const room = rooms[roomId];
    const index = room.players.findIndex((p) => p.id === playerId);

    if (index !== -1) {
      const removedPlayer = room.players[index];
      room.players.splice(index, 1);

      // If room is empty, delete it
      if (room.players.length === 0) {
        delete rooms[roomId];
        return { roomId, deleted: true };
      }

      room.logs.push(`${removedPlayer.name} left.`);
      return { roomId, room };
    }
  }
  return null;
};

// Handle a player betting chips
const placeBet = (roomId, playerId, amount) => {
  const room = rooms[roomId];
  if (!room) return { error: "Room not found" };

  const player = room.players.find((p) => p.id === playerId);
  if (!player) return { error: "Player not found" };

  // 1. Validation: Can't bet more than you have
  if (amount > player.chips) {
    return { error: "Not enough chips" };
  }

  // 2. Validation: Can't bet negative numbers
  if (amount < 0) {
    return { error: "Invalid amount" };
  }

  // 3. Move chips
  player.chips -= amount;
  player.currentBet += amount; // Track how much they put in this round
  room.pot += amount;

  // 4. Log the action
  // Determine action name based on context (simple logic for MVP)
  let action = "bet";
  if (amount === 0) action = "checked";
  else if (player.chips === 0) action = "went ALL IN";
  else action = `bet ${amount}`;

  room.logs.push(`${player.name} ${action}.`);

  return { room };
};

// Handle Folding
const foldPlayer = (roomId, playerId) => {
  const room = rooms[roomId];
  if (!room) return { error: "Room not found" };

  const player = room.players.find((p) => p.id === playerId);
  if (!player) return { error: "Player not found" };

  player.isFolded = true;
  room.logs.push(`${player.name} FOLDED.`);

  return { room };
};

// Handle taking chips back from pot (for correcting mistakes)
const takeFromPot = (roomId, playerId, amount) => {
  const room = rooms[roomId];
  if (!room) return { error: "Room not found" };

  const player = room.players.find((p) => p.id === playerId);
  if (!player) return { error: "Player not found" };

  // 1. Validation: Can't take more than what's in the pot
  if (amount > room.pot) {
    return { error: "Cannot take more than pot amount" };
  }

  // 2. Validation: Can't take negative numbers
  if (amount < 0) {
    return { error: "Invalid amount" };
  }

  // 3. Move chips back from pot to player
  room.pot -= amount;
  player.chips += amount;

  // Also reduce their currentBet if they had one
  if (player.currentBet > 0) {
    const takeBack = Math.min(amount, player.currentBet);
    player.currentBet -= takeBack;
  }

  // 4. Log the action
  room.logs.push(`${player.name} took back ${amount} chips from the pot.`);

  return { room };
};

// End the round and distribute pot to a winner
const endRound = (roomId, winnerId) => {
  const room = rooms[roomId];
  if (!room) return { error: "Room not found" };

  const winner = room.players.find((p) => p.id === winnerId);
  if (!winner) return { error: "Winner not found" };

  // 1. Give chips to winner
  const potAmount = room.pot;
  winner.chips += potAmount;

  // 2. Log it
  room.logs.push(`🏆 ${winner.name} won the pot of ${potAmount}!`);

  // 3. Reset Game State for next round
  room.pot = 0;
  room.players.forEach((p) => {
    p.currentBet = 0;
    p.isFolded = false;
  });

  return { room };
};

module.exports = {
  joinRoom,
  getRoom,
  removePlayer,
  placeBet,
  foldPlayer,
  takeFromPot,
  endRound,
};
