//utility imports
import {useEffect, useState} from 'react';
//components & hooks
import {useSocket} from "./context/Socket.ctx.jsx";
import {LoginFormCmp} from "./components/LoginForm.cmp.jsx";

//other imports
import {SERVER_URL} from "./context/Socket.ctx.jsx";
import {RegisterFormCmp} from "./components/RegisterForm.cmp.jsx"; //server url from .env

function App() {
    //config
    const {socket, isConnected} = useSocket();
    //states
    const [serverMessage, setServerMessage] = useState('');
    const [inputMessage, setInputMessage] = useState('');

    const [formToggle, setFormToggle] = useState(false);

    // Send message to server
    const sendTestMessage = () => {
        console.log(socket, isConnected);
        if (inputMessage.trim()) {
            socket.emit('test-message', {
                message: inputMessage,
                timestamp: new Date().toISOString()
            });
            setInputMessage('');
        }
    };

    useEffect(() => {
        socket.on('test-response', (data) => {
            setServerMessage(data.message);
        })
        return ()=>{
            socket.off('test-response');
        }
    })

    return (
        <div>
            <h1>🎮 Multiplayer Game Client</h1>

            {/* Connection Status */}
            <div>
                Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>

            <LoginFormCmp />

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
                    disabled={(isConnected && !inputMessage)}>
                    Send Test Message
                </button>
            </div>
            <div>
                <div>
                    <LoginFormCmp />
                </div>
                <div>
                    <RegisterFormCmp />
                </div>
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