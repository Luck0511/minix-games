import {Player} from "../models/Player.js";

class trisGame {
    player1: Player;
    player2: Player;
    boardSize: number;
    board:(null | string)[][];
    winner: Player | null;

    constructor(player1, player2, boardSize=3){
        this.player1 = player1;
        this.player2 = player2;
        this.boardSize = boardSize;
        this.board = Array(boardSize).fill(null).map(()=>Array(boardSize).fill(null));
        this.winner = null;
    }
}

export const gameInit = ()=>{

}

