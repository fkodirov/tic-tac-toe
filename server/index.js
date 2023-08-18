const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const activeSessions = {};

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("join", (sessionId) => {
    socket.join(sessionId);
    const id = socket.id;
    if (!activeSessions[sessionId]) {
      activeSessions[sessionId] = {
        board: Array(9).fill(""),
        players: [id],
        currentMove: "X",
      };
    } else {
      activeSessions[sessionId].players.push(id);
    }
    console.log(activeSessions);
    socket.emit("updateBoard", activeSessions[sessionId].board);
    socket.emit("currentMove", (activeSessions[sessionId].currentMove = "X"));
    socket.emit(
      "player",
      activeSessions[sessionId].players.length == 2 ? "O" : "X"
    );
  });

  socket.on("makeMove", ({ sessionId, newBoard, currentMove }) => {
    activeSessions[sessionId].board = newBoard;
    activeSessions[sessionId].currentMove = currentMove === "X" ? "O" : "X";
    console.log(activeSessions[sessionId].currentMove);
    io.to(sessionId).emit("updateBoard", activeSessions[sessionId].board);
    io.to(sessionId).emit("currentMove", activeSessions[sessionId].currentMove);

    const result = checkGameOver(activeSessions[sessionId].board);
    if (result) {
      io.to(sessionId).emit("gameOver", result);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
