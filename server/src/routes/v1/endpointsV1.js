//utility imports
import express from "express";
//other imports
import {getAllPlayers, getPlayerByName, registerNewPlayer} from "../../services/playerService.js";
import {generateJWT, verifyJWT, setAuthCookie} from "../../services/authService.js";

//set up a router to manage all endpoints
const router = express.Router();

//Method: GET - returns all players in DB
router.get('/allplayers', async (req, res) => {
    const allPlayers = await getAllPlayers();
    res.json({allPlayers});
})

//Method: GET - returns player info by playerName query param
router.get('/getPlayer', async (req, res) => {
    const playerName = req.query.playerName;
    if(!playerName){
        return res.status(400).json({message: 'Player name is required in query params'});
    }
    const player = await getPlayerByName(playerName);
    if(!player){
        res.status(400).json({message: 'Player name is required in query params'});
    }
    res.json({message:'Player found', playerInfo: player});
})

//Method: POST - REGISTER new player - must pass playerName and password in body
router.post('/register', async (req, res) => {
    const {playerName, password} = req.body;

    //check missing credentials in request body
    if(!playerName || !password){
        return res.status(400).json({message: 'Player name and password are required'});
    }
    //check password length
    if(password.length < 8){
        return res.status(400).json({message: 'Password must be at least 8 characters long'});
    }

    //await player creation and returns status code, if success, also returns new player object
    const {opStatus, newPlayer} = await registerNewPlayer(playerName, password);
    //status code switch
    switch(opStatus){
        case 200: {
            //generate a token to include with response and cookie
            const token = generateJWT({playerID: newPlayer.playerID, playerName: newPlayer.playerName});
            setAuthCookie(res, token); //adds cookie with token to response
            return res.status(200).json({
                message: 'Player profile created successfully',
                token: token,
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

//Method: POST - login player - must pass playerName and password in body
router.post('/login', verifyJWT ,async (req, res) => {

})

//export the router to be used in app.js
export default router;