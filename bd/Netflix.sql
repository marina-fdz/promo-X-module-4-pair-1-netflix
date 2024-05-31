CREATE DATABASE Netflix;
USE Netflix;
CREATE TABLE movies (
idMovies int auto_increment primary key,
title varchar(45) not null,
genre varchar(45) not null,
image varchar(1000) not null,
cathegory varchar(45) not null,
movieYear int 
);
ALTER TABLE movies modify image text;
ALTER TABLE movies modify image text not null;

CREATE TABLE users (
idUser int auto_increment primary key,
user varchar (45) not null,
password varchar (45) not null,
name varchar (45) not null,
email varchar (45) not null,
plan_details varchar (45) not null
);

CREATE TABLE actors (
idActor int auto_increment primary key,
name varchar (45) not null,
lastname varchar (45) not null,
country varchar (45) not null,
birthday date  
);

INSERT INTO movies (title, genre, image, cathegory, movieYear) VALUES
("Pulp Fiction", "Crimen", "https://pics.filmaffinity.com/pulp_fiction-210382116-large.jpg", "Top 10", 1994 ),
("La vita è bella", "Comedia", "https://pics.filmaffinity.com/la_vita_e_bella-646167341-mmed.jpg", "Top 10", 1996),
("Forrest Gump", "Comedia", "https://pics.filmaffinity.com/forrest_gump-212765827-mmed.jpg", "Top 10", 1994 );

INSERT INTO users (user, password,name, email, plan_details) VALUES
("laura_dev","laura","Laura","laura@gmail.com","Standard"),
("maria_dev","maria","Maria","maria@gmail.com","Standard"),
("ester_dev","ester","Ester","ester@gmail.com","Standard");

INSERT INTO actors (name,lastname,country,birthday) VALUES
("Tom","Hanks","Estados Unidos","1956-07-09"),
("Roberto","Benigni","Italia","1952-10-27"),
("John","Travolta","Estados Unidos","1954-02-18");


SELECT * FROM movies,actors,users;

SELECT movies.title, movies.genre
FROM movies
WHERE movies.movieYear > 1990;

SELECT *
FROM movies
WHERE movies.cathegory LIKE "%Top 10%";

UPDATE movies SET movieYear = 1997 WHERE movies.idMovies = 2;

SELECT * FROM movies;

SELECT * 
FROM actors
WHERE actors.birthday >= "1952-01-01" AND actors.birthday <= "1954-12-31";

SELECT actors.name, actors.lastname
FROM actors
WHERE actors.country = 'Estados Unidos';

SELECT *
FROM users
WHERE users.plan_details LIKE '%standard%';

SELECT * FROM users;

DELETE FROM users WHERE name LIKE 'M%';

ALTER TABLE actors ADD image TEXT;

SELECT * FROM actors;

CREATE TABLE movies_has_users (
fkMovies int NOT NULL,
fkUsers int NOT NULL,
idMoviesUsers int NOT NULL PRIMARY KEY auto_increment
);
-- Relacionar dos tablas que parten de una relación anterior entre otras -- 
ALTER TABLE movies_has_users ADD foreign key (fkMovies)
REFERENCES movies (idMovies);
ALTER TABLE movies_has_users ADD foreign key (fkUsers)
REFERENCES users (idUser);


CREATE TABLE actors_has_movies ( 
fkActors int NOT NULL,
fkMovies int NOT NULL,
idActorsMovies int NOT NULL PRIMARY KEY auto_increment
);

ALTER TABLE actors_has_movies ADD foreign key (fkActors)
REFERENCES actors (idActor);
ALTER TABLE actors_has_movies ADD foreign key (fkMovies)
REFERENCES movies (idMovies);




