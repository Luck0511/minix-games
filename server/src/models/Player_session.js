//import sequelize instance
import {sequelize} from "../config/dbConfig.js";
//import data types
import {DataTypes, Model} from "sequelize";

//Junction table definition
export class Player_session extends Model {
}
Player_session.init(
    {
        playerID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        sessionID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'player_session',
        timestamps: false,
    }
);