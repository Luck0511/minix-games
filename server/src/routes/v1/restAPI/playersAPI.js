//utility imports
import express from "express";

//services imports
import {
    getAllPlayers,
    getPlayerByName,
    playerSafeData
} from "#services/playerService.js";

//set up a authRouter to manage all endpoints
const playersRouter = express.Router();

/*=====================PLAYER API=====================*/

//Method: GET - returns all players in DB filtering unsafe data
playersRouter.get('/allPlayers', async (req, res) => {
    const allPlayers = await getAllPlayers();
    //mapping the array of players to filter out unsafe data
    const allSafePlayers = allPlayers.map((player) => playerSafeData(player))
    res.status(200).json({allSafePlayers});
})

//Method: GET - returns player info by playerName query param filtering unsafe data
playersRouter.get('/getPlayer', async (req, res) => {
    const playerName = req.query.playerName;
    if(!playerName){
        return res.status(400).json({message: 'Player name is required in query params'});
    }
    const player = await getPlayerByName(playerName);
    if(!player){
        res.status(404).json({message: 'Player not found'});
    }
    res.status(200).json({message:'Player found', playerInfo: playerSafeData(player)});
})

export default playersRouter;