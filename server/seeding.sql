-- Seeding data pour la base de données

BEGIN;

-- Insérer des rôles
INSERT INTO "role" ("name") VALUES
('Administrateur'),
('Utilisateur');

-- Insérer des utilisateurs (Admin et Utilisateur)
INSERT INTO "user" ("email", "lastname", "firstname", "pseudo", "password", "role_id") VALUES
('admin@example.com', 'Dupont', 'Jean', 'jeandupont', 'password123', 1),
('user1@example.com', 'Martin', 'Sophie', 'sophiemartin', 'password123', 2);

-- Insérer des lieux
INSERT INTO "place" ("city", "cityLatitude", "cityLongitude", "country", "countryLatitude", "countryLongitude", "continent") VALUES
('Paris', 48.8566, 2.3522, 'France', 46.6034, 1.8883, 'Europe'),
('Lyon', 45.7640, 4.8357, 'France', 46.6034, 1.8883, 'Europe'),
('Marseille', 43.2965, 5.3698, 'France', 46.6034, 1.8883, 'Europe'),
('Toulouse', 43.6047, 1.4442, 'France', 46.6034, 1.8883, 'Europe'),
('Nice', 43.7102, 7.2620, 'France', 46.6034, 1.8883, 'Europe'),
('Bordeaux', 44.8378, -0.5792, 'France', 46.6034, 1.8883, 'Europe'),
('Strasbourg', 48.5734, 7.7521, 'France', 46.6034, 1.8883, 'Europe'),
('Nantes', 47.2184, -1.5536, 'France', 46.6034, 1.8883, 'Europe'),
('Montpellier', 43.6110, 3.8767, 'France', 46.6034, 1.8883, 'Europe'),
('Lille', 50.6292, 3.0573, 'France', 46.6034, 1.8883, 'Europe');

-- Insérer des voyages
INSERT INTO "trip" ("dateStart", "dateEnd", "photo", "title", "description", "note", "user_id") VALUES
('2023-06-01', '2023-06-10', 'voyage_paris.jpg', 'Voyage à Paris', 'Un voyage merveilleux dans la ville lumière.', 5, 1),
('2023-07-15', '2023-07-20', 'voyage_lyon.jpg', 'Aventure à Lyon', 'Découverte de la gastronomie lyonnaise.', 4, 2),
('2023-08-05', '2023-08-12', 'voyage_marseille.jpg', 'Séjour à Marseille', 'Profiter du soleil et de la mer.', 5, 1),
('2023-09-10', '2023-09-15', 'voyage_toulouse.jpg', 'Escapade à Toulouse', 'Visite de la ville rose.', 4, 2),
('2023-10-01', '2023-10-05', 'voyage_nice.jpg', 'Vacances à Nice', "Détente sur la Côte d'Azur.", 5, 1),
('2023-11-01', '2023-11-05', 'voyage_bordeaux.jpg', 'Dégustation à Bordeaux', 'Visite des vignobles.', 4, 2),
('2023-12-01', '2023-12-05', 'voyage_strasbourg.jpg', 'Noël à Strasbourg', 'Marchés de Noël et illuminations.', 5, 1),
('2024-01-10', '2024-01-15', 'voyage_nantes.jpg', 'Séjour à Nantes', "Visite des Machines de l'île.", 4, 2),
('2024-02-01', '2024-02-05', 'voyage_montpellier.jpg', 'Escapade à Montpellier', 'Découverte de la ville et de ses plages.', 5, 1),
('2024-03-01', '2024-03-05', 'voyage_lille.jpg', 'Voyage à Lille', 'Culture et gastronomie dans le Nord.', 4, 2);

-- Insérer des visites
INSERT INTO "visit" ("title", "dateStart", "dateEnd", "comment", "photo", "note", "geo", "trip_id") VALUES
('Tour Eiffel', '2023-06-02', '2023-06-02', 'Vue incroyable du sommet !', 'tour_eiffel.jpg', 5, '48.8584, 2.2941', 1),
('Vieux Lyon', '2023-07-16', '2023-07-16', 'Quartier historique charmant.', 'vieux_lyon.jpg', 4, '45.7597, 4.8272', 2),
('Calanques de Marseille', '2023-08-07', '2023-08-07', 'Randonnée magnifique.', 'calanques.jpg', 5, '43.2151, 5.4395', 3),
('Place du Capitole', '2023-09-11', '2023-09-11', 'Centre de Toulouse.', 'capitole.jpg', 4, '43.6108, 1.4442', 4),
('Promenade des Anglais', '2023-10-02', '2023-10-02', 'Balade au bord de la mer.', 'promenade_nice.jpg', 5, '43.6954, 7.2652', 5),
('Cité du Vin', '2023-11-02', '2023-11-02', 'Découverte du vin à Bordeaux.', 'cite_du_vin.jpg', 4, '44.8651, -0.5582', 6),
('Strasbourg Petite France', '2023-12-02', '2023-12-02', 'Charmant quartier de Strasbourg.', 'petite_france.jpg', 5, '48.5839, 7.7455', 7),
("Les Machines de l'île", '2024-01-12', '2024-01-12', 'Attraction unique à Nantes.', 'machines_ile.jpg', 4, '47.2085, -1.5536', 8),
('Place de la Comédie', '2024-02-02', '2024-02-02', 'Centre de Montpellier.', 'place_comedie.jpg', 5, '43.6110, 3.8767', 9),
('Vieille Bourse', '2024-03-02', '2024-03-02', 'Visite de la Bourse à Lille.', 'vieille_bourse.jpg', 4, '50.6382, 3.0635', 10);

-- Insérer des photos de visites
INSERT INTO "visit_photos" ("photo", "visit_id") VALUES
('vue_tour_eiffel.jpg', 1),
('nuit_tour_eiffel.jpg', 1),
('vieux_lyon_1.jpg', 2),
('vieux_lyon_2.jpg', 2),
('calanques_1.jpg', 3),
('calanques_2.jpg', 3),
('capitole_1.jpg', 4),
('capitole_2.jpg', 4),
('promenade_1.jpg', 5),
('promenade_2.jpg', 5),
('cite_vin_1.jpg', 6),
('cite_vin_2.jpg', 6),
('petite_france_1.jpg', 7),
('petite_france_2.jpg', 7),
('machines_ile_1.jpg', 8),
('machines_ile_2.jpg', 8),
('place_comedie_1.jpg', 9),
('place_comedie_2.jpg', 9),
('vieille_bourse_1.jpg', 10),
('vieille_bourse_2.jpg', 10);

-- Insérer des relations de suivi
INSERT INTO "user_has_follower" ("user_id", "follower_id") VALUES
(2, 1),  -- Utilisateur suit Administrateur
(1, 2);  -- Administrateur suit Utilisateur

COMMIT;