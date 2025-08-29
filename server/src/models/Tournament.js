//import sequelize instance
import {sequelize} from "../config/dbConfig.js";
//import data types
import {DataTypes, Model} from "sequelize";


//Tournament table definition
export class Tournament extends Model {
}
Tournament.init(
    {
        tournamentID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        tournamentName: {
            type: DataTypes.STRING(32),
        },
        winnerID: {
            type: DataTypes.INTEGER,
        },
        rounds: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        tableName: 'tournament',
        timestamps: false,
    }
);
