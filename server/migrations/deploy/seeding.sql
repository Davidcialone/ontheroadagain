BEGIN;

-- Insertion des rôles 'member' et 'moderator'
INSERT INTO "role" ("name") VALUES ('member'), ('moderator');

-- Insertion de données dans la table "user"
INSERT INTO "user" ("email", "lastname", "firstname", "pseudo", "password", "role_id") VALUES
('alice@example.com', 'Liddell', 'Alice', 'alice', 'wonderland123', 1),
('bob@example.com', 'Builder', 'Bob', 'bob', 'buildit123', 2),
('carol@example.com', 'Singer', 'Carol', 'carol', 'songbird123', 1),
('dave@example.com', 'Smith', 'Dave', 'dave', 'hammer123', 2),
('eve@example.com', 'White', 'Eve', 'eve', 'apple123', 1),
('frank@example.com', 'Wright', 'Frank', 'frank', 'design123', 2),
('grace@example.com', 'Hopper', 'Grace', 'grace', 'code123', 1),
('henry@example.com', 'Ford', 'Henry', 'henry', 'drive123', 2),
('isabel@example.com', 'Queen', 'Isabel', 'isabel', 'crown123', 1),
('jack@example.com', 'Sparrow', 'Jack', 'jack', 'pirate123', 1);

-- Insertion de données dans la table "place"
INSERT INTO "place" ("city", "cityLatitude", "cityLongitude", "country", "countryLatitude", "countryLongitude", "continent") VALUES
('Paris', 48.8566, 2.3522, 'France', 46.2276, 2.2137, 'Europe'),
('Lyon', 45.7640, 4.8357, 'France', 46.2276, 2.2137, 'Europe'),
('Nice', 43.7102, 7.2620, 'France', 46.2276, 2.2137, 'Europe'),
('Marseille', 43.2965, 5.3698, 'France', 46.2276, 2.2137, 'Europe'),
('Bordeaux', 44.8378, -0.5792, 'France', 46.2276, 2.2137, 'Europe'),
('Nantes', 47.2184, -1.5536, 'France', 46.2276, 2.2137, 'Europe'),
('Strasbourg', 48.5734, 7.7521, 'France', 46.2276, 2.2137, 'Europe'),
('Toulouse', 43.6045, 1.4442, 'France', 46.2276, 2.2137, 'Europe'),
('Lille', 50.6292, 3.0573, 'France', 46.2276, 2.2137, 'Europe'),
('Rennes', 48.1173, -1.6778, 'France', 46.2276, 2.2137, 'Europe');

-- Insertion de données dans la table "trip"
INSERT INTO "trip" ("dateStart", "dateEnd", "photo", "title", "description", "note", "user_id") VALUES
('2020-05-20', '2024-05-27', '../app/data/photo1.jpg', 'Voyage à Paris', 'Découverte de la ville lumière', 4, 1),
('2020-06-10', '2024-06-17', '../app/data/photo2.jpg', 'Voyage à Lyon', 'Découverte de la ville des lumières', 5, 1),
('2020-07-15', '2024-07-22',' ../app/data/photo3.jpg', 'Voyage à Nice', 'Découverte de la ville de la promenade des anglais', 3, 1),
('2023-08-20', '2024-08-27', '../app/data/photo4.jpg', 'Voyage à Marseille', 'Découverte de la ville du vieux port', 4, 4),
('2023-09-10', '2024-09-17', '../app/data/photo5.jpg', 'Voyage à Bordeaux', 'Découverte de la ville du vin', 5, 1),
('2022-10-15', '2024-10-22', '../app/data/photo6.jpg', 'Voyage à Nantes', 'Découverte de la ville des machines', 3, 3),
('2022-12-05', '2024-12-12', '../app/data/photo8.jpg', 'Escapade à Toulouse', 'Exploration de la ville rose', 5, 1),
('2021-01-20', '2025-01-27', '../app/data/photo9.jpg', 'Aventure à Lille', 'Immersion dans la capitale des Flandres', 4, 2),
('2021-02-15', '2025-02-22', '../app/data/photo10.jpg', 'Détente à Rennes', 'Découverte de la ville bretonne', 3, 2);

-- Insertion de données dans la table "visit"
INSERT INTO "visit" ("title","dateStart","dateEnd","comment","photo", "note","geo","place_id","trip_id") VALUES
('Paris','2022-05-20', '2024-05-27', 'Visite de la tour Eiffel', '../app/data/photo1.jpg',4,'x', 1, 1),
('Paris','2023-06-18','2023-06-25','Visite du musée du Louvre', '../app/data/photo2.jpg', 5,'x', 1, 1),
('Paris','2020-07-08','2020-07-15','Promenade sur les Champs-Elysées', '../app/data/photo3.jpg', 3,'x', 1, 1),
('Lyon','2021-06-10', '2024-06-17', 'Visite du vieux Lyon', '../app/data/photo4.jpg', 5,'x', 2, 2),
('Nice','2022-07-15', '2024-07-22', 'Promenade sur la promenade des anglais', '../app/data/photo5.jpg', 3,'x', 3, 3),
('Marseille','2022-08-20', '2024-08-27', 'Découverte du vieux port', '../app/data/photo6.jpg', 4,'x', 4, 4),
('Bordeaux','2021-09-10', '2024-09-17', 'Visite des vignobles bordelais', '../app/data/photo7.jpg', 5,'x', 5, 5),
('Lille','2022-01-20', '2025-01-27', 'Balade dans le vieux Lille', '../app/data/photo8.jpg', 4,'x', 9, 3),
('Rennes','2022-02-15', '2025-02-22', 'Découverte du parc du Thabor', '../app/data/photo9.jpg', 3,'x', 10, 1);

INSERT INTO "visit_photos" ("visit_id", "photo") VALUES
(1, '../app/data/photo11.jpg'),
(1, '../app/data/photo12.jpg'),
(1, '../app/data/photo13.jpg'),
(1, '../app/data/photo14.jpg'),
(2, '../app/data/photo15.jpg'),
(2, '../app/data/photo16.jpg'),
(2, '../app/data/photo17.jpg'),
(2, '../app/data/photo18.jpg'),
(3, '../app/data/photo19.jpg'),
(3, '../app/data/photo20.jpg'),
(3, '../app/data/photo21.jpg'),
(4, '../app/data/photo22.jpg'),
(4, '../app/data/photo23.jpg'),
(4, '../app/data/photo24.jpg'),
(4, '../app/data/photo25.jpg'),
(5, '../app/data/photo26.jpg'),
(5, '../app/data/photo27.jpg'),
(5, '../app/data/photo28.jpg'),
(6, '../app/data/photo29.jpg'),
(6, '../app/data/photo30.jpg');


COMMIT;