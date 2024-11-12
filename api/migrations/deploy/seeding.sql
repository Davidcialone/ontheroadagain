BEGIN;

-- Insertion des rôles 'member' et 'moderator'
INSERT INTO "role" ("name") VALUES ('member'), ('moderator');


COMMIT;