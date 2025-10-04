//utility imports
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
//other imports
import router from './routes/v1/endpointsV1.js';

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
app.use('/api/v1', router); //router mounting allowing access to API endpoints

// APIS --> ENDPOINTS MANAGEMENT
app.get('/', (req, res) => {
    res.json({
        message : "Multiplayer game server is running and responsive!",
    });
});

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