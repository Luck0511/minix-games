//initialization of games both in server and DB
import {initGameTypes, initializeBaseGames} from "../services/gameService.js";

export const initializeGames = async () => {
    try {
        if(await initGameTypes()){
            await initializeBaseGames();
            console.log("Game initialization completed.");
            return true;
        }
    }catch(err) {
        console.error("Error initializing game types or game:", err);
        return false;
    }
}