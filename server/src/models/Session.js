//import sequelize instance
import {sequelize} from "../config/dbConfig.js";
//import data types
import {DataTypes, Model} from "sequelize";

//Session table definition
export class Session extends Model {
}
Session.init(
    {
        sessionID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        gameID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        winnerID: {
            type: DataTypes.INTEGER,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'session',
        createdAt: 'startTime', //createdAt will save creation date to 'startTime' column
        updatedAt: false,
    }
);