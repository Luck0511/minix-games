//import sequelize instance
import {sequelize} from "../config/dbConfig.js";
//import data types
import {DataTypes, Model} from "sequelize";

//Junction table definition
export class Session_tournament extends Model {
}
Session_tournament.init(
    {
        sessionID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        tournamentID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        roundNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'session_tournament',
        timestamps: false,
    }
);