// controller for player related operation trough API
import {db} from '../models/index.js';
import {Player} from "../models/Player.js";
import {passwordHash} from "./authService.js";

export const getAllPlayers = async () => {
    try{
        const {Player} = db;
        return await Player.findAll();
    }catch(err){
        console.error('Error in DB query:', err)
        return null;
    }
}

export const getPlayerByName = async (username) => {
    if(!username){
        console.error('No username provided');
        return null;
    }
    try{
        const {Player} = db;
        return await Player.findOne({
            where: {
            playerName: username
        }});
    }catch (err){
        console.error('Error in player login:', err)
        return null;
    }
}

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
            console.log("hashed password", hashedPassword)
            const newPlayer = await Player.create({playerName: playerName, password: hashedPassword});
            return {opStatus: 200, newPlayer: newPlayer}
            //{message: 'Player profile created successfully', playerInfo: newPlayer});
        }
    }catch (err){
        console.error('Error in player registration:', err)
        return {opStatus: 500} //{message: 'Internal server error'};
    }
}

export const loginPlayer = async (playerName, password) => {

}