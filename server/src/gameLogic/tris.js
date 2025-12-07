import {Player} from "../models/Player.js";

export class TrisGame {
    constructor(player1, player2, boardSize = 3) {
        this.lobbyId = null;
        this.player1 = player1;
        this.player2 = player2;
        this.boardSize = boardSize;
        this.board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
        this.winningCondition = false;
        this.winner = null;
    }

    setWinner(winner) {
        this.winningCondition = true;
        this.winner = winner;
    }
}

export const trisInit = (player1, player2, boardSize) => {
    const game = new TrisGame(player1, player2, boardSize);
    return game;
}

export const move = (x, y, player, trisGame) => {
    switch (player) {
        // player1 assigned to 'O'
        case trisGame.player1: {
            trisGame.board[y][x] = 'O';
            console.log(`${trisGame.lobbyId}: placed 'O' in ${x}, ${y}`);
            break;
        }
        // player2 assigned to 'X'
        case trisGame.player2: {
            trisGame.board[y][x] = 'X';
            console.log(`${trisGame.lobbyId}: placed 'X' in ${x}, ${y}`);
            break;
        }
        default: {
            console.error(`${trisGame.lobbyId}: couldn't find the player who made the move!`)
            return;
        }
    }
}