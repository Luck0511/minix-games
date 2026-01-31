//utility imports
import express from "express";

//services imports
import {publicLobbies, sessionCreation} from "#gameLogic/sessionsManager.js";

//set up a authRouter to manage all endpoints
const lobbiesRouter = express.Router();

/*=====================LOBBY API=====================*/

//Method: GET - returns all public active lobbies
lobbiesRouter.get('/activeLobbies',(req, res) => {
    res.status(200).json({
        message: 'Active lobbies',
        activeLobbies: publicLobbies(),
    });
})

//Method POST - creates a new lobby
lobbiesRouter.post('/createLobby', async (req, res) => {
    const {gameID, lobbyName, isPrivate} = req.body;
    const player = req.user;
    const {opStatus, result} = await sessionCreation(player, gameID, lobbyName, isPrivate);

    if(opStatus === 200){
        //if opStatus === 200 then lobby creation succeeded
        res.status(opStatus).json({
            message: 'Lobby created',
            lobby: result,
        });
    }else{
        res.status(opStatus).json({
            message: result
        });
    }
})

//export the router to be used in app.js
export default lobbiesRouter;