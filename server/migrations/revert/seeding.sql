-- Revert oroad:seeding from pg

BEGIN;

-- Vidage de la table "user_has_follower"
DELETE FROM "user_has_follower";

DELETE FROM "visit_photos";

-- Vidage de la table "visit"
DELETE FROM "visit";

-- Vidage de la table "trip"
DELETE FROM "trip";

-- Vidage de la table "place"
DELETE FROM "place";

-- Vidage de la table "user"
DELETE FROM "user";

-- Vidage de la table "role"
DELETE FROM "role";

COMMIT;
