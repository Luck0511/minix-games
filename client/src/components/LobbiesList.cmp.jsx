import {useEffect, useState} from "react";
import {useSocket} from "../context/Socket.ctx.jsx";
import {fetchPublicLobbies} from "../services/httpRest.js";

export const LobbiesListCmp = () => {
    const [lobbiesList, setLobbiesList] = useState();
    const [counter, setCounter] = useState(0);
    const {socket, isConnected} = useSocket();

    const updateLobbiesList = async () => {
        try{
            setLobbiesList(await fetchPublicLobbies())
        }catch(error){
            console.error('Failed to fetch public lobbies:', error);
            //TODO: display error to user in UI
        }
    }

    useEffect(() => {
        if(isConnected){
            updateLobbiesList().then(()=>{
                //TODO: maybe show a notification to user that list was updated?
            });
        }

        const updateInterval = setInterval(async () => {
            setCounter(count => count + 1);
            await updateLobbiesList();
        }, 5000);

        return ()=>{
            clearInterval(updateInterval);
        }
    }, [socket, isConnected]);

    return (
        <>
            <button onClick={updateLobbiesList} disabled={!isConnected}>Update Lobbies List</button>
            <h3>Public Lobbies: refreshes: {counter}</h3>
            {!lobbiesList ? 'Lobby list empty, update' : lobbiesList?.map((lobby) => (
                <div key={lobby.lobbyKey}>
                    <pre>
                        <code>{JSON.stringify(lobby)}</code>
                    </pre>
                </div>
            ))}
        </>
    )
}