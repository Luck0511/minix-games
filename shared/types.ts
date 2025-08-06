import {Socket} from "socket.io-client";

export type Player = {
    id: number;
    playerName: string;
}

export type SocketContextType = {
    socket: Socket;
    isConnected: boolean;
}