//utility imports
import express from "express";

//services imports
import {publicLobbies} from "#gameLogic/sessionsManager.js";

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
lobbiesRouter.post('/createLobby', (req, res) => {

})

//export the router to be used in app.js
export default lobbiesRouter;