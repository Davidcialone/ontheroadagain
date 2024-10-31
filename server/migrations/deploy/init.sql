BEGIN;

CREATE TABLE "role" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "lastname" TEXT NOT NULL,
  "firstname" TEXT NOT NULL,
  "pseudo" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role_id" INT NOT NULL REFERENCES "role"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "place" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "city" TEXT NOT NULL,
  "cityLatitude" NUMERIC(9,6) NOT NULL,
  "cityLongitude" NUMERIC(9,6) NOT NULL,
  "country" TEXT NOT NULL,
  "countryLatitude" NUMERIC(9,6) NOT NULL,
  "countryLongitude" NUMERIC(9,6) NOT NULL,
  "continent" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "trip" (
   "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   "dateStart" DATE NOT NULL,
   "dateEnd" DATE NOT NULL,
   "photo" TEXT,
   "title" TEXT NOT NULL,
   "description" TEXT,
   "rating" DECIMAL(2, 1),
   "user_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
   "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
   "updated_at" TIMESTAMPTZ
);

CREATE TABLE "visit" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "title" TEXT NOT NULL,
  "photo" TEXT,
  "dateStart" DATE NOT NULL,
  "dateEnd" DATE NOT NULL,
  "comment" TEXT,
  "rating" DECIMAL(2, 1),
  "geo" TEXT,
  "place_id" INT REFERENCES "place"("id") ON DELETE CASCADE,
  "trip_id" INT NOT NULL REFERENCES "trip"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "visit_photos" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "photo" TEXT NOT NULL,
  "visit_id" INT NOT NULL REFERENCES "visit"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user_has_follower" (
  "user_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "follower_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  PRIMARY KEY ("user_id", "follower_id")
);

COMMIT;
