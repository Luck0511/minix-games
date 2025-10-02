// controller for player related operation trough API
import {db} from '../models/index.js';

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