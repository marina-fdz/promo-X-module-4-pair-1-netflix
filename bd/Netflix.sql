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