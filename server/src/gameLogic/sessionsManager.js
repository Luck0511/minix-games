import {getGameByID, getMaxPlayersByTypeID} from "../services/gameService.js";

//active lobbies list
export const activeLobbies= new Map();

//lobby session class
class Lobby {
    #lobbyID;
    #winningCondition = false;
    #maxPlayers;
    #isFull = false;

    constructor(lobbyID, lobbyName, hostPlayer, game, maxPlayers) {
        this.#lobbyID = lobbyID;
        this.lobbyName = lobbyName;
        this.hostPlayer = hostPlayer;
        this.game = game;
        this.players = new Map();
        this.#maxPlayers = maxPlayers;

        this.connectPlayer(hostPlayer);
        console.log("Lobby created successfully");
    }

    static async lobbyInit(lobbyID, lobbyName, hostPlayer, gameID) {
        const game = await getGameByID(gameID);
        const maxPlayers = await getMaxPlayersByTypeID(game.get('gameType'));
        console.log('maxPlayers for gameID', gameID, ':', maxPlayers);
        return new Lobby(
            lobbyID,
            lobbyName || `${hostPlayer.get('playerName')}'s Lobby`,
            hostPlayer,
            game,
            maxPlayers
        );
    }

    setWinningCondition(condition) {
        this.#winningCondition = condition;
    }

    connectPlayer(newPlayer) {
        if(this.players.size == this.#maxPlayers) {
            this.#isFull = true;
            this.lobbyLogging(`Player ${newPlayer.get('playerName')} tried to join but lobby is full.`);
            return;
        } else if(this.players.size > this.#maxPlayers) {
            this.lobbyLogging(`ERROR: Player ${newPlayer.get('playerName')} tried to join but lobby is over capacity! (${this.players.size}/${this.#maxPlayers})`);
            return;
        } else {
            this.#isFull = false;
            this.players.set(newPlayer.get('playerID'), newPlayer);
            this.lobbyLogging(`Player ${newPlayer.get('playerName')} joined the lobby. (${this.players.size}/${this.#maxPlayers})`);
            if(this.players.size == this.#maxPlayers) {
                this.#isFull = true;
            }
            return;
        }
    }

    disconnectPlayer(playerToRemove) {
        this.players.delete(playerToRemove.get('playerID'));
    }

    async gameLoop() {
        let counter = 0
        while(!this.#winningCondition) {
            counter += 1;
            this.#tick(counter);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    #tick(round) {
        console.log('Fake Round:', round, 'in Lobby:', this.#lobbyID);
        if(round>=5){
            this.setWinningCondition(true);
            this.lobbyLogging(`Winning condition met. Ending game loop.`);
        }
    }

    lobbyLogging(msg) {
        console.log(`[Lobby ${this.#lobbyID}::${Date.now()}]: ${msg}`);
    }
}

export const sessionCreation = async (hostPlayer, gameID, lobbyName ) => {
    try{
        //generate random lobby ID
        const randomLobbyID = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
        //lobby instance
        const newLobby = await Lobby.lobbyInit(randomLobbyID, lobbyName, hostPlayer, gameID);
        //add new lobby to active lobbies
        activeLobbies.set(randomLobbyID, newLobby);
        //get game info from DB
        const game = await getGameByID(gameID)
        //if game not found throw error
        if(!game){
            throw new Error(`gameID: ${gameID} not found!`);
        }
        newLobby.lobbyLogging(`Lobby created`);

        await newLobby.gameLoop()
    }catch(err) {
        console.error("Error creating session:", err);
    }
}