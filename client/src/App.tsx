import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// Connect to server
const SERVER_URL = 'http://localhost:3001';
const socket: Socket = io(SERVER_URL);

function App() {
    const [isConnected, setIsConnected] = useState(false);
    const [serverMessage, setServerMessage] = useState('');
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        // Connection event handlers
        socket.on('connect', () => {
            console.log('✅ Connected to server!');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
            setIsConnected(false);
        });

        // Listen for server responses
        socket.on('test-response', (data) => {
            console.log('Received from server:', data);
            setServerMessage(data.message);
        });

        // Cleanup on component unmount
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('test-response');
        };
    }, []);

    // Send message to server
    const sendTestMessage = () => {
        if (inputMessage.trim()) {
            socket.emit('test-message', {
                message: inputMessage,
                timestamp: new Date().toISOString()
            });
            setInputMessage('');
        }
    };

    return (
        <div>
            <h1>🎮 Multiplayer Game Client</h1>

            {/* Connection Status */}
            <div>
                Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>

            {/* Test Communication */}
            <div>
                <h3>Test Server Communication</h3>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a test message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
                />
                <button
                    onClick={sendTestMessage}
                    disabled={!isConnected}>
                    Send Test Message
                </button>
            </div>

            {/* Server Response */}
            {serverMessage && (
                <div>
                    <strong>Server Response:</strong> {serverMessage}
                </div>
            )}

            {/* Socket ID Info */}
            {isConnected && (
                <div>
                    Your Socket ID: {socket.id}
                </div>
            )}
        </div>
    );
}

export default App;