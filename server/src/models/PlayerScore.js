//import sequelize instance
import {sequelize} from "../config/dbConfig.js";
//import data types
import {DataTypes, Model} from "sequelize";

//PlayerScore table definition
export class PlayerScore extends Model {
}
PlayerScore.init(
    {
        scoreID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        playerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sessionID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'playerscore',
        timestamps: false,
    }
);
