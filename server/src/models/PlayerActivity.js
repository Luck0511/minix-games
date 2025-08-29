//import sequelize instance
import {sequelize} from "../config/dbConfig.js";
//import data types
import {DataTypes, Model} from "sequelize";


//Tournament table definition
export class PlayerActivity extends Model {
}
PlayerActivity.init(
    {
        logID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        playerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sessionID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isTournament: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        tournamentID: {
            type: DataTypes.INTEGER,
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'playeractivity',
        createdAt: 'time',
        updatedAt: false,
    }
);
