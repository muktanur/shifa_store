export const rooms = new Map();

export function joinRoom(roomId, socket) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(socket);
}

export function leaveAllRooms(socket) {
  for (const sockets of rooms.values()) {
    sockets.delete(socket);
  }
}

export function emitToRoom(roomId, message) {
  const sockets = rooms.get(roomId);
  if (!sockets) return;

  for (const socket of sockets) {
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(message));
    }
  }
}
