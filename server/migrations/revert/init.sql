-- Deploy oroad:init to pg

BEGIN; 

-- ... code existant ...

-- Revert des tables créées
DROP TABLE IF EXISTS "user_has_follower" CASCADE;
DROP TABLE IF EXISTS "visit_photos" CASCADE;
DROP TABLE IF EXISTS "visit" CASCADE;
DROP TABLE IF EXISTS "trip" CASCADE;
DROP TABLE IF EXISTS "place" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "role" CASCADE;

COMMIT;