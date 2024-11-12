import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelizeClient.js";

export class Visit extends Model {}

Visit.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateStart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateEnd: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    },
    geo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    place_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "place",
        key: "id",
      },
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "trip",
        key: "id",
      },
    },
  },
  {
    sequelize, // instance de connexion
    tableName: "visit",
  }
);
