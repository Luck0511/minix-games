import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import {getAllPlayers, getPlayerByName} from "./controllers/playerController.js";
import {db} from "./models/index.js";

const app = express();
export const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], // Vite dev servers
    }
});

// middleware setup --> all req pass here before
app.use(cors()); //allow cross-origin request, mainly for localhost testing
app.use(express.json()); //parse JSON from requests-response

// APIS --> ENDPOINTS MANAGEMENT
app.get('/', (req, res) => {
    res.json({
        message : "Multiplayer game server is running and responsive!",
    });
});

app.get('/allplayers', async (req, res) => {
    const allPlayers = await getAllPlayers();
    res.json({allPlayers});
})

app.get('/sampleseeding', (req, res) => {
    const {Player} = db;
    Player.create({playerName: 'sampleUser1', password: 'hashedpassword123'}).then(()=>{
        console.log('Created sample Player')
    })
    res.json("executed sample seeding");
})

//!!! Testing get player by name
app.get('/getPlayer', async (req, res) => {
    const playerName = req.query.playerName;
    if(!playerName){
        return res.status(400).json({message: 'Player name is required'});
    }
    const player = await getPlayerByName(playerName);
    res.json({message:'Player found', playerInfo: player});
})

//!!! Testing player registration
app.post('/registerPlayer', async (req, res) => {
    const {Player} = db;
    console.log(req.body);
    const {playerName, password} = req.body;
    if(!playerName || !password){
        return res.status(400).json({message: 'Player name and password are required'});
    }
    try{
        const existingPlayer = await Player.findOne({
            where: {
                playerName
            }
        });
        if(existingPlayer){
            return res.status(409).json({message: 'A Player with this name already exists'});
        }else {
            const newPlayer = await Player.create({playerName, password});
            return res.status(200).json({message: 'Player profile created successfully', playerInfo: newPlayer});
        }
    }catch (err){
        console.error('Error in player registration:', err)
        return res.status(500).json({message: 'Internal server error'});
    }
})

// Socket.io connection handling --> SOCKET MANAGEMENT
io.on('connection', (clientSocket) => {
    console.log('A user connected:', clientSocket.id);

    // Handle disconnection
    clientSocket.on('disconnect', () => {
        console.log('User disconnected:', clientSocket.id);
    });

/*=== LISTENERS FOR CUSTOM EVENTS ===*/
    //Handle a test message
    clientSocket.on('test-message', (data) => {
        console.log('Received test message:', data);
        clientSocket.emit('test-response', { message: 'Hello from server!' });
    });
    //Handle user-info received
    clientSocket.on('user-info', (userData)=>{
        console.table(userData)
    })
});