import { db } from "../models/index.js";

/**
 * Find and return gameType from DB if present
 * @returns {Promise<GameType>} operation status
 **/
export const getGameTypeByName = async (typeName) => {
    if(!typeName){
        console.error('No game type name provided');
        return null;
    }
    try{
        const {GameType} = db;
        return await GameType.findOne({where: {typeName: typeName}});
    }catch (err){
        console.error('Error in game type query:', err)
        return null;
    }
}

/**
 * Find and return game from DB if present
 * @returns {Promise<MiniGame>} operation status
 **/
export const getGameByName = async (gameName) => {
    if(!gameName){
        console.error('No game name name provided');
        return null;
    }
    try{
        const {MiniGame} = db;
        return await MiniGame.findOne({where: {typeName: gameName}});
    }catch (err){
        console.error('Error in game type query:', err)
        return null;
    }
}

/**
 * Initialize default game types in DB if not present
 * @returns {Promise<boolean>} operation status
**/
export const initGameTypes = async () => {
    const {GameType} = db;
    try {
        await GameType.findOrCreate({where: {typeName: 'solo'}, defaults: {minPlayers: 1, maxPlayers: 1}});
        await GameType.findOrCreate({where: {typeName: 'duo'}, defaults: {minPlayers: 2, maxPlayers: 2}});
        await GameType.findOrCreate({where: {typeName: 'trio'}, defaults: {minPlayers: 3, maxPlayers: 3}});
        await GameType.findOrCreate({where: {typeName: 'squad'}, defaults: {minPlayers: 2, maxPlayers: 4}});
        await GameType.findOrCreate({where: {typeName: 'multi'}, defaults: {minPlayers: 1, maxPlayers: null}});
        console.log("Game types initialized successfully.");
        return true;
    }catch(err) {
        console.error("Error initializing game types:", err);
        return false;
    }
}
/**
 * Register a new game type by creating a new row in DB !!allows for future additions without server shutdown!!
 * @param {String} typeName game type name
 * @param {int} minPlayers minimum players for this game type
 * @param {int} maxPlayers maximum players for this game type
 * @returns {Promise<{opStatus: int, newGameType:GameType?}>} object with final status and nullable GameType object
**/
export const registerGameType = async (typeName, minPlayers, maxPlayers?) => {
    if(!typeName || !minPlayers){
        return {opStatus: 400}; //{message: 'typeName and minPlayers are required'}
    }
    try {
        //check if gameType already exist
        const existingType = await getGameTypeByName(typeName);
        if(existingType){
            console.log("A player with this name already exists: ", existingType);
            return {opStatus: 409} //{message: 'this gameType with already exists'};
        }else {
            const {GameType} = db;
            const newType = await GameType.create({typeName: typeName, minPlayers: minPlayers , maxPlayers: maxPlayers});
            return {opStatus: 200, newType: newType}
            //{message: 'gameType registered successfully', newType: newType});
        }
    }catch (err) {
        console.error('Error in gameType registration:', err)
        return {opStatus: 500} //{message: 'Internal server error'};
    }
}

/**
 * Register a new player by creating a new row in DB !!allows for future additions without server shutdown!!
 * @param {String} gameName game registered name
 * @param {String} gameType game registered type
 * @param {String} description game description
 * @returns {Promise<{opStatus: int, newGame:MiniGame?}>} object with final status and nullable MiniGame object
 **/
export const registerGame = async (gameName, gameType, description) => {
    if(!gameName || !gameType){
        return {opStatus: 400}; //{message: 'gameName and gameType are required'}
    }
    try{
        //check if playerName is already taken
        const existingGame = await getGameByName(gameName);
        if(existingGame){
            console.log("A player with this name already exists: ", existingGame);
            return {opStatus: 409} //{message: 'A Game with this name already exists'};
        }else {
            const {MiniGame} = db;
            //extract typeID from gameType for reference in DB
            const typeID = (await getGameTypeByName(gameType)).dataValues.typeID;
            const newGame = await MiniGame.create({gameName: gameName, gameType: typeID , description: description});
            return {opStatus: 200, newGame: newGame}
            //{message: 'Game Registered successfully', gameInfo: newGame});
        }
    }catch (err){
        console.error('Error in game registration:', err)
        return {opStatus: 500} //{message: 'Internal server error'};
    }
}

/**
 * Initialize basic games in DB if not present
 * @return {Promise<boolean>}
 */
export const initializeBaseGames = async () => {
    try {
        await registerGame('tris', 'duo', 'Classic Tic-Tac-Toe game');
        //initialize other basic games here
        console.log("Basic games initialized successfully.");
        return true;
    }catch(err){
        console.error("Error initializing basic games:", err);
        return false;
    }
}