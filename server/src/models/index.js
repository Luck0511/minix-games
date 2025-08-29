//import sequelize instance to include in object
import {sequelize} from "../config/dbConfig.js";
//import association function
import {defineAssociations} from "../associations/index.js";

//import models in one place for easier export and cleaner code
import {Player} from "./Player.js";
import {Player_session} from "./Player_session.js";
import {Session} from "./Session.js";
import {PlayerScore} from "./PlayerScore.js";
import {MiniGame} from "./MiniGame.js";
import {GameType} from "./GameType.js";
import {CustomGameList} from "./CustomGameList.js";
import {CustomList_minigame} from "./CustomList_minigame.js";
import {Player_tournament} from "./Player_tournament.js";
import {PlayerActivity} from "./PlayerActivity.js";
import {Session_tournament} from "./Session_tournament.js";
import {Tournament} from "./Tournament.js";

export const initializeModels = ()=> {
    //objet with all models and sequelize
    const db = {
        sequelize,
        CustomGameList,
        CustomList_minigame,
        GameType,
        MiniGame,
        Player,
        Player_session,
        Player_tournament,
        PlayerActivity,
        PlayerScore,
        Session,
        Session_tournament,
        Tournament,
    }
    //define associations
    defineAssociations(db);

    return db;
}