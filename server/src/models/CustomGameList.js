//import sequelize instance
import {sequelize} from "../config/dbConfig.js";
//import data types
import {DataTypes, Model} from "sequelize";


//CustomGameList table definition
export class CustomGameList extends Model {
}
CustomGameList.init(
    {
        listID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        listName: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        playerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
        },
        creationDate: {
            type: DataTypes.DATE,
        },
        description: {
            type: DataTypes.STRING(100),
        }
    },
    {
        sequelize,
        tableName: 'customgamelist',
        createdAt: 'creationDate', //createdAt will save creation date to 'creationDate' column
        updatedAt: false
    }
);
