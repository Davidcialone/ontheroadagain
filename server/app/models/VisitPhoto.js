import { Model, DataTypes } from "sequelize";
import {sequelize} from "./sequelizeClient.js";

export class VisitPhoto extends Model {}

VisitPhoto.init({
photo: {
  type: DataTypes.STRING,
  allowNull: false,
  },
  visit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'visit',
      key: 'id',
  }
},

}, {
  sequelize, // instance de connexion
  tableName: "visit_photos"
});









