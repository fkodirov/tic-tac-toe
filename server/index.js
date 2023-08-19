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
  socket.on("create", (sessionId) => {
    console.log(sessionId);
    if (!activeSessions[sessionId]) socket.emit("create", "created");
    else socket.emit("create", "");
  });
  socket.on("gameStatus", (sessionId) => {
    console.log(sessionId);
    if (activeSessions[sessionId]) socket.emit("gameStatus", "created");
    else socket.emit("gameStatus", "not created");
  });
  socket.on("join", (sessionId) => {
    socket.join(sessionId);
    const id = socket.id;
    if (!activeSessions[sessionId]) {
      activeSessions[sessionId] = {
        board: Array(9).fill(""),
        players: [id],
        currentMove: "X",
        gameStatus: "created",
        playAgain: [],
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

  const checkGameOver = (board) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every((cell) => cell !== "")) {
      return "draw";
    }

    return null;
  };

  socket.on("makeMove", ({ sessionId, newBoard, currentMove }) => {
    activeSessions[sessionId].board = newBoard;
    activeSessions[sessionId].currentMove = currentMove === "X" ? "O" : "X";
    console.log(activeSessions[sessionId].currentMove);
    io.to(sessionId).emit("updateBoard", activeSessions[sessionId].board);
    io.to(sessionId).emit("currentMove", activeSessions[sessionId].currentMove);

    const result = checkGameOver(activeSessions[sessionId].board);
    if (result) {
      io.to(sessionId).emit("gameOver", result);
      activeSessions[sessionId].currentMove = "";
      activeSessions[sessionId].gameStatus = "finished";
      io.to(sessionId).emit(
        "currentMove",
        activeSessions[sessionId].currentMove
      );
      // io.to(sessionId).emit("gameOver", activeSessions[sessionId].);
    }
  });

  socket.on("playAgain", ({ sessionId }) => {
    const playAgain = activeSessions[sessionId].playAgain;
    playAgain.push("true");
    if (playAgain.length == 2) {
      activeSessions[sessionId] = {
        board: Array(9).fill(""),
        currentMove: "X",
        gameStatus: "created",
        playAgain: [],
      };
      io.to(sessionId).emit("updateBoard", activeSessions[sessionId].board);
      io.to(sessionId).emit(
        "currentMove",
        (activeSessions[sessionId].currentMove = "X")
      );
      io.to(sessionId).emit("waiting", false);
      io.to(sessionId).emit("gameOver", "");
    } else {
      socket.emit("waiting", true);
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
