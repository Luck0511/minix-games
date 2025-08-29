//import sequelize instance
import {sequelize} from "../config/dbConfig.js";
//import data types
import {DataTypes, Model} from "sequelize";

//Junction table definition
export class CustomList_minigame extends Model {
}
CustomList_minigame.init(
    {
        listID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        gameID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'customlist_minigame',
        timestamps: false,
    }
);