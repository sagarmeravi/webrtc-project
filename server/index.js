const { Server, Socket } = require("socket.io");

const io = new Server(8000, { cors: true });

const emailToSocketIdMap = new Map();
const socketidTomailMap = new Map();

io.on("connection", (Socket) => {
  console.log(`Socket connected`, Socket.id);
  Socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, Socket.id);
    socketidTomailMap.set(Socket.id, email);
    io.to(room).emit("user:joined", { email, id: Socket.id });
    Socket.join(room);
    io.to(Socket.id).emit("room:join", data);
  });

  Socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incoming:call", { from: Socket.id, offer });
  });
  Socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: Socket.id, ans });
  });
});
