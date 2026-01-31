//services import
import {
    getGameByID,
    getMaxPlayersByTypeID
} from "#services/gameService.js";

import {
    getPlayerInfo
} from "#services/playerService.js";
import {Player} from "../models/Player.js";

//active lobbies list
export const activeLobbies = new Map();

//lobby session class
export class Lobby {
    #lobbyID;
    #winningCondition = false;
    #isFull = false;

    constructor(lobbyID, lobbyName, isPrivate, hostPlayer, game, maxPlayers) {
        this.#lobbyID = lobbyID;
        this.lobbyName = lobbyName;
        this.isPrivate = isPrivate;
        this.hostPlayer = hostPlayer;
        this.game = game;
        this.players = new Map();
        this.maxPlayers = maxPlayers;
        this.roundCounter = 0;
        this.createdAt = new Date().toISOString(); //ISO date, need parsing fron-end side
    }

    /**
     * Initial lobby configuration
     * @param {string} lobbyID the lobby ID
     * @param {string} lobbyName the lobby name
     * @param {boolean} isPrivate flag for lobby visibility
     * @param {Player} hostPlayer the host player instance reference
     * @param {number} gameID the selected gameID
     * @return {Lobby} new lobby instance
     * @throws {Error} game not found
     **/
    static async lobbyInit(lobbyID, lobbyName, isPrivate, hostPlayer, gameID) {
        let game;
        let maxPlayers;
        //if a game is preselected in creation, set it here
        if(gameID || gameID !== 0){
            //get game info from DB
            game = await getGameByID(gameID)
            //if game not found throw error
            if (!game) {
                throw new Error(`gameID: ${gameID} not found!`);
            }
            //set max players based on game selected
            maxPlayers = await getMaxPlayersByTypeID(game.get('gameType'));
        }
        //new lobby instance
        const newLobby = new Lobby(
            lobbyID,
            lobbyName || `${hostPlayer.get('playerName')}'s Lobby`,
            isPrivate || false,
            hostPlayer,
            game,
            maxPlayers
        );
        //connect hostPlayer
        await newLobby.connectPlayer(hostPlayer).then();
        //start awaiting players
        newLobby.awaitPlayers().then(() => closeLobby(newLobby.#lobbyID));
        //return new lobby
        return newLobby;
    }

    setWinningCondition(condition) {
        this.#winningCondition = condition;
    }

    async connectPlayer(newPlayer) {
        if (this.players.size === this.maxPlayers) {
            this.#isFull = true;
            this.lobbyLogging(`Player ${newPlayer.get('playerName')} tried to join but lobby is full.`);
        } else if (this.players.size > this.maxPlayers) {
            this.lobbyLogging(`ERROR: Player ${newPlayer.get('playerName')} tried to join but lobby is over capacity! (${this.players.size}/${this.maxPlayers})`);
        } else {
            this.#isFull = false;
            this.players.set(newPlayer.get('playerID'), newPlayer);
            this.lobbyLogging(`Player ${newPlayer.get('playerName')} joined the lobby. (${this.players.size}/${this.maxPlayers})`);
            if (this.players.size === this.maxPlayers) {
                this.#isFull = true;
            }
        }
    }

    async disconnectPlayer(playerToRemove) {
        this.players.delete(playerToRemove.get('playerID'));
    }

    async awaitPlayers() {
        this.lobbyLogging(`Awaiting players to join... (${this.players.size}/${this.maxPlayers})`);
        while (!this.#isFull) {
            if (this.players.size === this.maxPlayers) {
                this.#isFull = true;
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        this.lobbyLogging(`Lobby is full. Starting game loop...`);
        await this.gameLoop();
    }

    async gameLoop() {
        while (!this.#winningCondition) {
            this.roundCounter += 1;
            await this.#tick(this.roundCounter);
            await new Promise(resolve => setTimeout(resolve, Math.random()*10000));
        }
    }

    async #tick(round) {
        this.lobbyLogging(`Fake Round: ${round}`);
        if (round >= 20) {
            this.setWinningCondition(true);
            this.lobbyLogging(`Winning condition met. Ending game loop.`);
        }
    }

    lobbyLogging(msg) {
        console.log(`[Lobby: ${this.#lobbyID} - ${this.lobbyName}::${Date().toString().split(' GMT')[0].replaceAll(' ', '-')}]: ${msg}`);
    }
}

/**
 * Factory Function to fully initialize a lobby
 * @param {string || number || Object || Player} hostPlayer the player creating the lobby, either its ID or full Player object
 * @param {number} gameID the ID number for the selected game
 * @param {string} lobbyName optional lobby name, if not present created automatically
 * @param {boolean} isPrivate optional flag (false by default) to set private lobby
 * @returns {{opStatus: number, result: Lobby || string}} object containing operation status and newly created Lobby
 **/
export const sessionCreation = async (hostPlayer, gameID, lobbyName, isPrivate) => {
    //generate random lobby ID
    const randomLobbyID = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    if(!randomLobbyID){
        return {opStatus: 500, result: "Server failed to generate LobbyID"}
    }
    let player = hostPlayer;
    //check if hostPlayer is just an ID number, if so fetch full Player object from DB
    if(typeof hostPlayer != "object" && typeof hostPlayer === "string" || typeof hostPlayer === "number") {
        const {opStatus, foundPlayer, message} = await getPlayerInfo(hostPlayer);
        if(!foundPlayer || opStatus!==200){
            //return if error occurs
            return {opStatus: opStatus, result: message};
        }else{
            //saves found player to scope variable
            player = foundPlayer;
        }
    }else if(typeof hostPlayer === "object" && !(hostPlayer instanceof Player)){
        //if it's an object, it contains player name
        const {opStatus, foundPlayer, message} = await getPlayerInfo(hostPlayer.playerName);
        if(!foundPlayer || opStatus!==200){
            //return if error occurs
            return {opStatus: opStatus, result: message};
        }else{
            //saves found player to scope variable
            player = foundPlayer;
        }
    }
    try{
        //create lobby instance
        const newLobby = await Lobby.lobbyInit(randomLobbyID, lobbyName, isPrivate, player, gameID);
        activeLobbies.set(randomLobbyID, newLobby);
        newLobby.lobbyLogging('Lobby created successfully')
        //add new lobby to list of active lobbies
        return {opStatus: 200, result: newLobby};
    }catch(err){
        return {opStatus: 500, result: `Server failed to generate Lobby: ${err.message}`};
    }
}

/**
 * Function to terminate lobby by its ID, removing it from the list
 * TODO: add the log to the database once game ended!!!
 * @returns {void}
 **/
export const closeLobby = (lobbyID) => {
    if (activeLobbies.has(lobbyID)) {
        activeLobbies.delete(lobbyID);
        console.log(`Lobby ${lobbyID} closed and removed from active lobbies.`);
    }
}

/**
 * Function to correctly serialize the active lobbies Map
 * @returns {Object} object with complete safe active lobbies
 **/
export const serializeLobbies = ()=>{
    //result container object
    const result = {};
    //iterate through active lobbies Map
    for (const [lobbyKey, lobby] of activeLobbies) {
        //append lobby info to lobbyKey position
        result[lobbyKey] = {
            //rest of lobby info
            ...lobby,
            //specific serialization for hostPlayer (removing password, registerData, isActive)
            hostPlayer: {
                playerID: lobby.hostPlayer.playerID,
                playerName: lobby.hostPlayer.playerName,
            },
            game: lobby.game?.dataValues || 'Game not yet selected',
            //create an object from entries
            players: Object.fromEntries(
                //create an array from the players Map and modify it to remove unsafe fields
                Array.from(lobby.players).map(([id, player]) => {
                    //specific serialization for players in Map (removing password, registerData, isActive)
                    const { password, isActive, registerDate, ...safeData } = player.dataValues;
                    //returns the id of the player and the safe data
                    return [id, safeData];
                })
            )
        };
    }
    //returns the result object
    return result;
}

/**
 * Function to correctly convert the active lobbies Map into an array of ONLY public lobbies
 * @returns {Array} Array with complete safe active public lobbies
 **/
export const publicLobbies = ()=>{
    const allLobbies = serializeLobbies();
    return Object.entries(allLobbies)
        .filter(([key, lobby]) => !lobby.isPrivate)
        .map(([key, lobby]) => ({
            lobbyKey: key,
            ...lobby
        }));
}