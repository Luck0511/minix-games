import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './assets/index.css'
import App from './App.tsx'

//socket context provider
import {SocketProvider} from "./context/Socket.ctx.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/*providing socket to all app*/}
        <SocketProvider>
            <App/>
        </SocketProvider>
    </StrictMode>,
)
