let newIo;

function initializeSocketIO(io) {
  newIo = io;
  io.on("connection", (socket) => {
    console.log("Uma nova conexão ao socket.io");
    const socketId = socket.id;

    // Bota o data quando for mobile
    if (socket.handshake.headers.id != undefined) {
      socket.data.id = socket.handshake.headers.id;
    }

    listenForPrivateMessage(socket, io);
  });
}

function sendEmergencyResolved(kit) {
  try {
    newIo.emit("message", kit);
  } catch (error) {
    console.log(error);
  }
}

function listenForPrivateMessage(socket, io) {
  socket.on("message", async (receiverId, data) => {
    const arr = Array.from(io.sockets.sockets);
    const receiver = arr.find((element) => element[1].data.id == receiverId);
  });
}

module.exports = {
  initializeSocketIO,
  sendEmergencyResolved,
};
