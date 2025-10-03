import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

export const app = express();
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