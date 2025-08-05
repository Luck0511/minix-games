// @ts-ignore
import {Player} from "@shared/types";

type Cell = 'X' | 'O' | null;
type Board = Cell[];

interface GameState {
    board: Board;
    currentTurn: Player | null;
    winner: Player | null;
    isDraw: boolean;
    gameOver: boolean;
}

import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (question: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

const getCell = async (): Promise<number> => {
    const cell = await askQuestion('Insert cell number (0-8): ');
    return Number(cell);
}

// Make this async and await the input
async function playerTurn(turn: 'X' | 'O', board: Board): Promise<Board> {
    let validMove = false;

    while (!validMove) {
        const cell = await getCell(); // Wait for input

        if (cell < 0 || cell > 8) {
            console.log('Invalid cell number! Use 0-8');
            continue;
        }

        if (!board[cell]) {
            board[cell] = turn;
            validMove = true;
        } else {
            console.log('Cell already occupied! Try again');
        }
    }

    return board;
}

// Make the game function async
async function exampleGame() {
    const player1: Player = {id: 1, playerName: "Luc"}
    const player2: Player = {id: 2, playerName: "Someone"}

    let gameOver: boolean = false;
    let isDraw: boolean = false;
    const board: Board = [null, null, null, null, null, null, null, null, null];

    const currentGame: GameState = {
        board: board,
        currentTurn: null,
        winner: null,
        isDraw: isDraw,
        gameOver: gameOver,
    }

    let roundCounter: number = 0;

    while (!gameOver) {
        roundCounter++;
        console.log(`\nRound ${roundCounter} starts!`);
        console.log(board);

        if (roundCounter % 2 === 1) { // odd rounds = player 1
            console.log(`Player ${player1.playerName} turn!`);
            currentGame.board = await playerTurn('X', board);
        } else { //even numbers = player 2
            console.log(`Player ${player2.playerName} turn!`);
            currentGame.board = await playerTurn('O', board);
        }

        if (roundCounter === 9) gameOver = true;
    }

    rl.close(); // Close readline when game ends
}

exampleGame().catch(console.error);