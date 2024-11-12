import { Model, DataTypes } from "sequelize";
import {sequelize} from "./sequelizeClient.js";

export class Place extends Model {}

Place.init({

city : {
    type: DataTypes.STRING,
    allowNull: false 
    },
cityLatitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false 
    },
cityLongitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false 
        },
country: {
    type: DataTypes.STRING,
    allowNull: false 
    },
countryLatitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false 
    },
countryLongitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false 
    },
continent: {
    type: DataTypes.STRING,
    allowNull: false 
    },
  
  }, {
    sequelize, // instance de connexion
    tableName: "place"
  });