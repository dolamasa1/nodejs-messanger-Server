const { Server } = require("socket.io");
const jwtVerify = require("../models/JwtVerify");
const message = require("../models/Message");
const group = require("../models/Group");
const users = require("./UserData");

module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3000', 
        'http://127.0.0.1:3000', 
        'http://localhost:8000',
        process.env.FRONTEND_URL
      ].filter(Boolean),
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Version", "Cookie"]
    }
  });

  io.on("connection", (socket) => {
    const socketId = socket.id;
    const user = jwtVerify.getUser(socket.handshake.headers);
    
    console.log(`🔌 Socket connection attempt from: ${socket.handshake.headers.origin}`);
    console.log(`👤 Socket user: ${user ? user.user : 'Unauthenticated'}`);
    
    if (user !== null) {
      users[user.id] = socketId;
      socket.broadcast.emit("user_status", user.id, true);
      
      socket.on("disconnect", () => {
        const user = jwtVerify.getUser(socket.handshake.headers);
        if (user !== null) {
          delete users[user.id];
          io.emit("user_status", user.id, false);
          console.log(`🔌 Socket disconnected: ${user.user}`);
        } else {
          disconnectSocket(socket);
        }
      });
      
      socket.on("message", (ms, callback) => {
        const user = jwtVerify.getUser(socket.handshake.headers);
        if (user !== null) {
          const data = {
            from_user: user.id,
            from_name: ms.from_name,
            type: ms.type,
            target: ms.target,
            message_type: ms.message_type,
            message: ms.message,
            reference_id: ms?.reference_id,
          };
          message
            .create(data)
            .then((data) => {
              callback(data.create_date);
              emitToTarget(io, socketId, data);
            })
            .catch((e) => {
              console.log('💥 Message creation error:', e);
            });
        } else {
          disconnectSocket(socket);
        }
      });
    } else {
      console.log('❌ Socket connection rejected - invalid authentication');
      disconnectSocket(socket);
    }
  });
};

function emitToTarget(io, socketId, data) {
  if (data.type === "user") {
    const toSocketId = users[data.target];
    if (toSocketId) {
      io.to(toSocketId).emit("message", data);
    }
  } else {
    group.getMemeberId(data.target).then((res) => {
      res.forEach((e) => {
        const toSocketId = users[e];
        if (toSocketId && toSocketId !== socketId) {
          io.to(toSocketId).emit("message", data);
        }
      });
    });
  }
}

function disconnectSocket(socket) {
  socket.disconnect();
}