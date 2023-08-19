import { makeObservable, observable, action } from "mobx";
import { Socket } from "socket.io-client";

class GameStore {
  socket: Socket | null = null;
  sessionId: string = "";
  board: string[] = Array(9).fill("");
  currentMove: "X" | "O" | "" = "";
  player: "X" | "O" | "" = "";
  winner: string | null = null;

  constructor() {
    makeObservable(this, {
      socket: observable,
      sessionId: observable,
      board: observable,
      currentMove: observable,
      player: observable,
      winner: observable,
      setSessionId: action,
      setBoard: action,
      setCurrentMove: action,
      setPlayer: action,
      setWinner: action,
      setSocket: action,
    });
  }

  setSocket(socket: Socket | null) {
    this.socket = socket;
  }
  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  setBoard(board: string[]) {
    this.board = board;
  }

  setCurrentMove(currentMove: "X" | "O") {
    this.currentMove = currentMove;
  }

  setPlayer(player: "X" | "O") {
    this.player = player;
  }

  setWinner(winner: string | null) {
    this.winner = winner;
  }
}

const Store = new GameStore();

export default Store;
