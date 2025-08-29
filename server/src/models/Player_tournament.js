//import sequelize instance
import {sequelize} from "../config/dbConfig.js";
//import data types
import {DataTypes, Model} from "sequelize";

//Junction table definition
export class Player_tournament extends Model {
}
Player_tournament.init(
    {
        playerID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        tournamentID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'player_tournament',
        timestamps: false,
    }
);