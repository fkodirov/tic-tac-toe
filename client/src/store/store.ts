import { makeObservable, observable, action } from "mobx";
import { Socket } from "socket.io-client";

class GameStore {
  playerName: string = "";
  game: string = "";
  waiting: boolean = false;
  gameStatus: string = "";
  socket: Socket | null = null;
  sessionId: string = "";
  board: string[] = Array(9).fill("");
  currentMove: "X" | "O" | "" = "";
  player: "X" | "O" | "" = "";
  winner: string | null = null;

  constructor() {
    makeObservable(this, {
      playerName: observable,
      game: observable,
      waiting: observable,
      gameStatus: observable,
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
      setGameStatus: action,
      setWaiting: action,
      setPlayerName: action,
    });
  }

  setPlayerName(playerName: string) {
    this.playerName = playerName;
  }
  setGame(game: string) {
    this.game = game;
  }
  setWaiting(waiting: boolean) {
    this.waiting = waiting;
  }
  setGameStatus(gameStatus: string) {
    this.gameStatus = gameStatus;
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
