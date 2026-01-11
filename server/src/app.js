//utility imports
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';

//router imports
import authRouter from '#routers/authAPI.js';
import lobbiesRouter from '#routers/lobbiesAPI.js';
import playersRouter from '#routers/playersAPI.js';

import {disconnectClientSocket, initializeClientSocket} from "#socketHandlers/clientHandler.js";

export const app = express();
export const server = createServer(app);

//shared cors options between express and socket.io
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], // allow Vite dev servers
    credentials: true //allows cookies to be sent within CORS requests
}

//socket.io server setup
const io = new Server(server, {cors: corsOptions});

// middleware setup --> all request-responses pass here before
app.use(cors(corsOptions)); //allow cross-origin request, mainly for localhost testing
app.use(cookieParser()) //parse cookies from requests-response
app.use(express.json()); //parse JSON from requests-response

//routers mounting allowing access to API endpoints
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/lobbies', lobbiesRouter);
app.use('/api/v1/players', playersRouter);

// APIS --> ENDPOINTS MANAGEMENT
app.get('/', (req, res) => {
    res.json({
        message : "MinixGames server is running and responsive!",
    });
});

// Socket.io connection handling --> SOCKET MANAGEMENT
io.on('connection', (clientSocket) => {

    //socket initialization process on connection
    initializeClientSocket(io, clientSocket);

    // Handle disconnection
    clientSocket.on('disconnect', () => {
        console.log('User disconnected:', clientSocket.id);
        disconnectClientSocket(clientSocket);
    });
});