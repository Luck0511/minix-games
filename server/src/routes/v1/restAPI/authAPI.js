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
    const {opStatus, newPlayer, message} = await registerNewPlayer(playerName, password);

    if(opStatus === 200){
        //generate a token to include with response and cookie
        const token = generateJWT({playerID: newPlayer.playerID, playerName: newPlayer.playerName});
        setAuthCookie(res, token); //adds cookie with token to response
        return res.status(opStatus).json({
            message: message,
            playerInfo: {
                id: newPlayer.playerID,
                playerName: newPlayer.playerName,
            }
        });
    }else{
        return res.status(opStatus).json({message: message});
    }
})

// //Method: POST - login player - must pass playerName and password in body
authRouter.post('/login',async (req, res) => {
    const {playerName, password} = req.body;

    //execute base validation on name and password
    basePlayerValidation({playerName, password}, res);

    //player search and returns status code, if success, also returns logged player object
    const {opStatus, loggedPlayer, message} = await loginPlayer(playerName, password);

    if(opStatus === 200){
        //generate a token to include with response and cookie
        const token = generateJWT({playerID: loggedPlayer.playerID, playerName: loggedPlayer.playerName});
        setAuthCookie(res, token); //adds cookie with token to response
        return res.status(200).json({
            message: message,
            playerInfo: {
                playerName: loggedPlayer.playerName,
            }
        });
    }else{
        return res.status(opStatus).json({message: message});
    }
})

export default authRouter;
