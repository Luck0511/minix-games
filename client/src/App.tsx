import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// Connect to your server
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
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>🎮 Multiplayer Game Client</h1>

            {/* Connection Status */}
            <div style={{
                padding: '10px',
                marginBottom: '20px',
                backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
                color: isConnected ? '#155724' : '#721c24',
                borderRadius: '5px'
            }}>
                Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>

            {/* Test Communication */}
            <div style={{ marginBottom: '20px' }}>
                <h3>Test Server Communication</h3>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a test message..."
                    style={{ padding: '8px', marginRight: '10px', width: '200px' }}
                    onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
                />
                <button
                    onClick={sendTestMessage}
                    disabled={!isConnected}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: isConnected ? '#007bff' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isConnected ? 'pointer' : 'not-allowed'
                    }}
                >
                    Send Test Message
                </button>
            </div>

            {/* Server Response */}
            {serverMessage && (
                <div style={{
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '5px'
                }}>
                    <strong>Server Response:</strong> {serverMessage}
                </div>
            )}

            {/* Socket ID Info */}
            {isConnected && (
                <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                    Your Socket ID: {socket.id}
                </div>
            )}
        </div>
    );
}

export default App;