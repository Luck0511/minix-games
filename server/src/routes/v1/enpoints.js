//utility imports
import {app} from "server/src/app.js";

//other imports
import {getAllPlayers, getPlayerByName, registerNewPlayer} from "server/src/services/playerService.js";
import {generateJWT, verifyJWT} from "server/src/services/authService.js";

//Method: GET - returns all players in DB
app.get('/allplayers', async (req, res) => {
    const allPlayers = await getAllPlayers();
    res.json({allPlayers});
})

//Method: GET - returns player info by playerName query param
app.get('/getPlayer', async (req, res) => {
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

//Method: POST - register new player - must pass playerName and password in body
app.post('/register', async (req, res) => {
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
            const token = generateJWT({playerID: newPlayer.playerID, playerName: newPlayer.playerName});
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
        case 500:
        default: {
            return res.status(500).json({message: 'Internal server error'});
        }
    }
})

//Method: POST - login player - must pass playerName and password in body
app.post('/login', verifyJWT ,async (req, res) => {

})


/*//!!! TEST SEEDING
app.get('/sampleseeding', (req, res) => {
    const {Player} = db;
    Player.create({playerName: 'sampleUser1', password: 'hashedpassword123'}).then(()=>{
        console.log('Created sample Player')
    })
    res.json("executed sample seeding");
})*/
