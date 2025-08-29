//import sequelize instance
import {sequelize} from "../config/dbConfig.js";
//import data types
import {DataTypes, Model} from "sequelize";

//miniGame table definition
export class MiniGame extends Model {
}
MiniGame.init(
    {
        gameID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        gameName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        gameType: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(300),
        }
    },
    {
        sequelize,
        tableName: 'minigame'
    }
);