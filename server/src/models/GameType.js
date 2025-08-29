//import sequelize instance
import {sequelize} from "../config/dbConfig.js";
//import data types
import {DataTypes, Model} from "sequelize";

//gameType table definition
export class GameType extends Model {
}
GameType.init(
    {
        typeID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        typeName: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        minPlayers: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        maxPlayers: {
            type: DataTypes.INTEGER,
        }
    },
    {
        sequelize,
        tableName: 'gametype',
        timestamps: false,
    }
);