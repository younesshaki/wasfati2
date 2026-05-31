INSERT INTO recette (titre, description, img_link, temps_minute) VALUES
('Tajine de Poulet aux Olives', 'Un tajine savoureux et parfumé aux épices marocaines avec des olives marinées et du citron confit.', 'http://localhost:8080/images/tajine-poulet-olives.png', 90),
('Couscous Royal', 'Le couscous royal marocain avec sept légumes, viande d''agneau et merguez grillées.', 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&q=80', 120),
('Harira', 'La soupe traditionnelle marocaine à base de tomates, lentilles, pois chiches et coriandre fraîche.', 'http://localhost:8080/images/harira.png', 60),
('Pastilla au Poulet', 'Feuilletés dorés fourrés de poulet, amandes et épices, saupoudrés de sucre glace et cannelle.', 'http://localhost:8080/images/pastilla.png', 150),
('Briouates aux Crevettes', 'Triangles croustillants de pâte filo fourrés aux crevettes, fromage et persil frais.', 'http://localhost:8080/images/briouates.png', 45),
('Cornes de Gazelle', 'Pâtisseries en forme de croissant fourrées d''amandes parfumées à l''eau de rose et fleur d''oranger.', 'http://localhost:8080/images/cornes-gazelle.png', 80),
('Zaalouk d''Aubergines', 'Salade cuite d''aubergines et tomates aux épices, servie tiède avec du pain marocain.', 'http://localhost:8080/images/zaalouk.png', 40),
('Méchoui d''Agneau', 'Agneau entier rôti lentement au four avec cumin, coriandre et beurre smen, fondant à souhait.', 'http://localhost:8080/images/mechoui.png', 240);

-- Ingredients for each recipe
INSERT INTO ingredient (nom, quantite, recette_id) VALUES
('Poulet entier', '1 pièce', 1), ('Olives vertes', '200g', 1), ('Citron confit', '2 pièces', 1), ('Oignon', '2 pièces', 1), ('Ail', '4 gousses', 1), ('Curcuma', '1 c.à.c', 1), ('Gingembre', '1 c.à.c', 1),
('Semoule fine', '500g', 2), ('Agneau', '400g', 2), ('Merguez', '4 pièces', 2), ('Courgettes', '2 pièces', 2), ('Carottes', '3 pièces', 2), ('Navets', '2 pièces', 2), ('Pois chiches', '200g', 2),
('Tomates', '400g', 3), ('Lentilles', '100g', 3), ('Pois chiches', '100g', 3), ('Coriandre fraîche', '1 bouquet', 3), ('Céleri', '2 branches', 3), ('Farine', '2 c.à.s', 3), ('Citron', '1 pièce', 3),
('Poulet', '1 entier', 4), ('Amandes effilées', '200g', 4), ('Oeufs', '4 pièces', 4), ('Pâte filo', '500g', 4), ('Cannelle', '2 c.à.c', 4), ('Sucre glace', '50g', 4), ('Coriandre', '1 bouquet', 4),
('Crevettes décortiquées', '300g', 5), ('Pâte filo', '12 feuilles', 5), ('Fromage fondu', '200g', 5), ('Persil frais', '1 bouquet', 5), ('Oeuf', '1 pièce', 5), ('Huile de friture', 'QS', 5),
('Amandes en poudre', '300g', 6), ('Sucre', '100g', 6), ('Eau de rose', '2 c.à.s', 6), ('Fleur d''oranger', '1 c.à.s', 6), ('Farine', '300g', 6), ('Beurre', '100g', 6),
('Aubergines', '3 pièces', 7), ('Tomates', '4 pièces', 7), ('Ail', '4 gousses', 7), ('Cumin', '1 c.à.c', 7), ('Paprika', '1 c.à.c', 7), ('Huile d''olive', '4 c.à.s', 7), ('Coriandre', '1 bouquet', 7),
('Gigot d''agneau', '2kg', 8), ('Beurre smen', '100g', 8), ('Cumin', '2 c.à.c', 8), ('Coriandre moulue', '2 c.à.c', 8), ('Ail', '6 gousses', 8), ('Sel', 'QS', 8), ('Poivre', 'QS', 8);
