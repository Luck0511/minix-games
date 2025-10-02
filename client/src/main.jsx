import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './assets/index.css'
import App from './App.jsx'

//socket context provider
import {SocketProvider} from "./context/Socket.ctx.jsx";

//server url from .env
export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

createRoot(document.getElementById('root')).render(
    <StrictMode>
        {/*providing socket to all app*/}
        <SocketProvider>
            <App/>
        </SocketProvider>
    </StrictMode>,
)
