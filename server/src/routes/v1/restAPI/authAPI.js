//utility imports
import express from "express";

//services imports
import {
    basePlayerValidation,
    loginPlayer,
    registerNewPlayer
} from "#services/playerService.js";

import {
    generateJWT,
    setAuthCookie
} from "#services/authService.js";

//set up a authRouter to manage all endpoints
const authRouter = express.Router();

/*=====================AUTH API=====================*/

//Method: POST - REGISTER new player - must pass playerName and password in body
authRouter.post('/register', async (req, res) => {
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
authRouter.post('/login',async (req, res) => {
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

export default authRouter;
