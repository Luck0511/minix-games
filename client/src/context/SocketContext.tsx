//socket context component to provide the socket to whole app

//utility import
import React, {createContext, useContext, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
//type import
import type {SocketContextType} from "@shared/types.ts";

// Server connection
const SERVER_URL = 'http://localhost:3001';
const socket: Socket = io(SERVER_URL);

const SocketContext = createContext<SocketContextType|undefined>(undefined)

//context provider
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // handle connection
        socket.on('connect', () => {
            console.log('✅ Connected to server!');
            setIsConnected(true);
        });
        //handle disconnection
        socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
            setIsConnected(false);
        });
        // cleanup on component unmount
        return () => {
            Disconnect(); // call global disconnect function
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket:socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
//returns the current socketContext (instead of calling useContext again)
export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (!context) {
        //throws error if used inappropriately
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

//general disconnect function, usable in all app (exporting)
export const Disconnect = () => {
    //remove event listeners
    socket.off('connect');
    socket.off('disconnect');
    //disconnect socket from server
    socket.disconnect();
}