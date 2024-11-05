// Importer nos modèles
import { Visit } from "./Visit.js";
import { Role } from "./Role.js";
import { Trip } from "./Trip.js";
import { User } from "./User.js";
import { Place } from "./Place.js";
import { VisitPhoto } from "./VisitPhoto.js";
import { sequelize } from "./sequelizeClient.js";

// Trip <--> Visit (One-to-Many)
Trip.hasMany(Visit, {
  foreignKey: "trip_id",
  as: "visits",
  onDelete: "CASCADE",
});

Visit.belongsTo(Trip, {
  as: "trip",
  foreignKey: "trip_id",
  onDelete: "CASCADE",
});

// User <--> Trip (One-to-Many)
User.hasMany(Trip, {
  as: "trips",
  foreignKey: {
    name: "user_id",
    onDelete: "CASCADE",
  },
});
Trip.belongsTo(User, {
  as: "user",
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

// User <--> Role (One-to-Many)
Role.hasMany(User, {
  as: "users", // Alias pour l'association
  foreignKey: "role_id",
  onDelete: "CASCADE",
}),
  User.belongsTo(Role, {
    as: "userRole", // Changement d'alias pour éviter la collision
    foreignKey: "role_id",
    allowNull: false,
    onDelete: "CASCADE",
  });

// Visit <--> Place (One-to-One)
Place.hasOne(Visit, {
  foreignKey: "place_id",
  as: "visit",
  onDelete: "CASCADE",
}),
  Visit.belongsTo(Place, {
    foreignKey: "place_id",
    as: "place",
    onDelete: "CASCADE",
  });

// Visit <--> VisitPhotos (One-to-Many)
Visit.hasMany(VisitPhoto, {
  foreignKey: "visit_id",
  as: "photos",
  onDelete: "CASCADE",
}),
  VisitPhoto.belongsTo(Visit, {
    foreignKey: "visit_id",
    as: "visit",
    onDelete: "CASCADE",
  });

// User <--> User (Many-to-Many) via user_has_follower
User.belongsToMany(User, {
  through: "user_has_follower",
  as: "followers",
  foreignKey: "user_id",
  otherKey: "follower_id",
});
User.belongsToMany(User, {
  through: "user_has_follower",
  as: "following",
  foreignKey: "follower_id",
  otherKey: "user_id",
});

// Exporter nos modèles
export { Visit, Place, Role, Trip, User, VisitPhoto, sequelize };
