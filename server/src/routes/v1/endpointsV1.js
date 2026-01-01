//utility imports
import express from "express";
//other imports
import {
    getAllPlayers,
    getPlayerByName,
    registerNewPlayer,
    basePlayerValidation,
    loginPlayer, playerSafeData
} from "../../services/playerService.js";
import {generateJWT, setAuthCookie} from "../../services/authService.js";
import {publicLobbies} from "../../gameLogic/sessionsManager.js";

//set up a router to manage all endpoints
const router = express.Router();

/*=====================AUTH API=====================*/

//Method: POST - REGISTER new player - must pass playerName and password in body
router.post('/register', async (req, res) => {
    const {playerName, password} = req.body;

    //execute base validation on name and password
    basePlayerValidation({playerName, password}, res);

    //player creation and returns status code, if success, also returns new player object
    const {opStatus, newPlayer} = await registerNewPlayer(playerName, password);

    //status code switch
    switch(opStatus){
        case 200: {
            //generate a token to include with response and cookie
            const token = generateJWT({playerID: newPlayer.playerID, playerName: newPlayer.playerName});
            setAuthCookie(res, token); //adds cookie with token to response
            return res.status(200).json({
                message: 'Player profile created successfully',
                playerInfo: {
                    id: newPlayer.playerID,
                    playerName: newPlayer.playerName,
                }
            });
        }
        case 400: {
            return res.status(400).json({message: 'Player name and password are required'});
        }
        case 409: {
            return res.status(409).json({message: 'A Player with this name already exists'});
        }
        case 500: {
            return res.status(500).json({message: 'There has been an internal server error'});
        }
        default: {
            return res.status(520).json({message: 'Generic unknown error'});
        }
    }
})

// //Method: POST - login player - must pass playerName and password in body
router.post('/login',async (req, res) => {
    const {playerName, password} = req.body;

    //execute base validation on name and password
    basePlayerValidation({playerName, password}, res);

    //player search and returns status code, if success, also returns logged player object
    const {opStatus, loggedPlayer} = await loginPlayer(playerName, password);

    //status code switch
    switch(opStatus){
        case 200: {
            //generate a token to include with response and cookie
            const token = generateJWT({playerID: loggedPlayer.playerID, playerName: loggedPlayer.playerName});
            setAuthCookie(res, token); //adds cookie with token to response
            return res.status(200).json({
                message: 'Player logged in successfully',
                playerInfo: {
                    id: loggedPlayer.playerID,
                    playerName: loggedPlayer.playerName,
                }
            });
        }
        case 400: {
            return res.status(400).json({message: 'Player name and password are required'});
        }
        case 401: {
            return res.status(401).json({message: 'Wrong password'});
        }
        case 404: {
            return res.status(404).json({message: 'Player not found'});
        }
        case 500: {
            return res.status(500).json({message: 'There has been an internal server error'});
        }
        default: {
            return res.status(520).json({message: 'Generic unknown error'});
        }
    }
})


/*=====================PLAYER API=====================*/

//Method: GET - returns all players in DB filtering unsafe data
router.get('/allPlayers', async (req, res) => {
    const allPlayers = await getAllPlayers();
    //mapping the array of players to filter out unsafe data
    const allSafePlayers = allPlayers.map((player) => playerSafeData(player))
    res.status(200).json({allSafePlayers});
})

//Method: GET - returns player info by playerName query param filtering unsafe data
router.get('/getPlayer', async (req, res) => {
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

/*=====================LOBBY API=====================*/

//Method: GET - returns all  public active lobbies
router.get('/activeLobbies',(req, res) => {
    res.status(200).json({
        message: 'Active lobbies',
        lobbies: publicLobbies(),
    });
})

//export the router to be used in app.js
export default router;