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

const activeSessions = { TicTacToe: {}, Battleship: {} };

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("create", (sessionId, game) => {
    if (!activeSessions[game][sessionId]) socket.emit("create", "created");
    else socket.emit("create", "");
  });
  socket.on("gameStatus", (sessionId, game) => {
    if (activeSessions[game][sessionId]) socket.emit("gameStatus", "created");
    else socket.emit("gameStatus", "not created");
  });
  socket.on("join", (sessionId, game, playerName) => {
    console.log(playerName);
    socket.join(sessionId);
    const id = socket.id;
    if (game == "TicTacToe") {
      if (!activeSessions[game][sessionId]) {
        activeSessions[game][sessionId] = {
          board: Array(9).fill(""),
          players: [id],
          currentMove: "",
          gameStatus: "created",
          playAgain: [],
        };
      } else {
        activeSessions[game][sessionId].players.push(id);
      }
      socket.emit("updateBoard", activeSessions[game][sessionId].board);
      const countPlayers = activeSessions[game][sessionId].players.length;
      io.to(sessionId).emit(
        "currentMove",
        countPlayers == 2 ? (Math.floor(Math.random() * 2) ? "X" : "O") : ""
      );
      socket.emit("player", countPlayers == 2 ? "O" : "X");
    } else if (game == "Battleship") {
      if (!activeSessions[game][sessionId]) {
        activeSessions[game][sessionId] = {
          board: Array.from({ length: 10 }, () => Array(10).fill("")),
          players: [id],
          currentMove: "",
          gameStatus: "created",
          playAgain: [],
          playersNames: [playerName],
        };
      } else {
        activeSessions[game][sessionId].players.push(id);
        activeSessions[game][sessionId].playersNames.push(playerName);
        io.to(sessionId).emit(
          "connected",
          activeSessions[game][sessionId].playersNames
        );
      }
      // console.log("Battleship");
    }
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

  socket.on("makeMove", ({ sessionId, newBoard, currentMove, game }) => {
    activeSessions[game][sessionId].board = newBoard;
    activeSessions[game][sessionId].currentMove =
      currentMove === "X" ? "O" : "X";
    io.to(sessionId).emit("updateBoard", activeSessions[game][sessionId].board);
    io.to(sessionId).emit(
      "currentMove",
      activeSessions[game][sessionId].currentMove
    );

    const result = checkGameOver(activeSessions[game][sessionId].board);
    if (result) {
      io.to(sessionId).emit("gameOver", result);
      activeSessions[game][sessionId].currentMove = "";
      activeSessions[game][sessionId].gameStatus = "finished";
      io.to(sessionId).emit(
        "currentMove",
        activeSessions[game][sessionId].currentMove
      );
    }
  });

  socket.on("playAgain", ({ sessionId, game }) => {
    const playAgain = activeSessions[game][sessionId].playAgain;
    playAgain.push("true");
    if (playAgain.length == 2) {
      activeSessions[game][sessionId] = {
        board: Array(9).fill(""),
        currentMove: "",
        gameStatus: "created",
        playAgain: [],
      };
      io.to(sessionId).emit(
        "updateBoard",
        activeSessions[game][sessionId].board
      );
      io.to(sessionId).emit(
        "currentMove",
        (activeSessions[game][sessionId].currentMove = Math.floor(
          Math.random() * 2
        )
          ? "X"
          : "O")
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
