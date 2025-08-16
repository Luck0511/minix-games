import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
//server setup
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"], // Vite dev servers
        methods: ["GET", "POST"]
    }
});

// middleware setup --> all req pass here before
app.use(cors()); //allow cross-origin request, mainly for localhost testing
app.use(express.json()); //parse JSON from requests-response

// APIS --> ENDPOINTS MANAGEMENT
app.get('/', (req, res) => {
    res.json({
        message : "Multiplayer game server is running!",
        value: "someValue",
        array: ["one","six","seven"]
    });
});

app.get('/test', (req, res) => {
    res.json({ message: 'you made it here! means you understood how it works',
    secondMessage: 'This is a test message!'
    });
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

// Server port, either railway port or default 3001
const PORT = process.env.PORT || 3001;
// Sever starts listening to port
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io ready for connections`);
});