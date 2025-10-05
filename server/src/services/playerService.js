// controller for player related operation trough API
import {db} from '../models/index.js';
import {Player} from "../models/Player.js";
import {passwordHash, verifyPassword} from "./authService.js";

/**
 * Register a new player by creating a new row in DB
 * @param {{playerName: String, password: String}} userData object containing basic player inputs
 * @param res response reference
 * @returns sets response status code
 **/
export const basePlayerValidation = (userData, res) => {
    const {playerName, password} = userData;

export const getAllPlayers = async () => {
    try{
        const {Player} = db;
        return await Player.findAll();
    }catch(err){
        console.error('Error in DB query:', err)
        return null;
    }
}

/**
 * Execute a query searching for a player by its registered playerName
 * @param {String} playerName registered player name
 * @returns Player object promise or null for player not found
 **/
export const getPlayerByName = async (playerName) => {
    if(!playerName){
        console.error('No username provided');
        return null;
    }
    try{
        const {Player} = db;
        return await Player.findOne({
            where: {
            playerName: playerName
        }});
    }catch (err){
        console.error('Error in player login:', err)
        return null;
    }
}

/**
* Register a new player by creating a new row in DB
* @param {String} playerName registered player name
* @param {String} password registered password
* @returns {{opStatus: int, newPlayer:?Player}} object with final status and nullable Player object
**/
export const registerNewPlayer = async (playerName, password) => {
    if(!playerName || !password){
        return {opStatus: 400}; //{message: 'Player name and password are required'}
    }
    try{
        //check if playerName is already taken
        const existingPlayer = await getPlayerByName(playerName);
        if(existingPlayer){
            console.log("A player with this name already exists: ", existingPlayer);
            return {opStatus: 409} //{message: 'A Player with this name already exists'};
        }else {
            const hashedPassword = await passwordHash(password)
            const newPlayer = await Player.create({playerName: playerName, password: hashedPassword});
            return {opStatus: 200, newPlayer: newPlayer}
            //{message: 'Player profile created successfully', playerInfo: newPlayer});
        }
    }catch (err){
        console.error('Error in player registration:', err)
        return {opStatus: 500} //{message: 'Internal server error'};
    }
}

/**
 * Login logic for system, searches existing match in DB and verify password
 * @param {String} playerName registered player name
 * @param {String} password registered password
 * @returns {{opStatus: int, loggedPlayer:?Player}} object with final status and nullable Player object
 **/
export const loginPlayer = async (playerName, password) => {

}