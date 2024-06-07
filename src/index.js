const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');


// create and config server
const server = express();
server.use(cors());
server.use(express.json());
require('dotenv').config();
server.set('view engine', 'ejs');

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// Conectarse a la base de datos
async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
  await connection.connect();
  return connection;
}

// Escribir en la base de datos




//crear endpoint

server.get('/movies', async (req, res) => {
  
  const conn = await connectToDatabase();
  
  if (req.query.genre === ''){
    let sql = 'SELECT * FROM movies ORDER BY title DESC;';
  const [results] = await conn.query(sql); // en el caso de hacer un select, query nos devuelve un array con en la posicion 0 los datos de la tabla, y en la posición 1 la información de la estructura de la tabla (campos, tipo de dato)
  res.json({
    success: true,
    movies:  results
  })} else {
  let sql = `SELECT * FROM movies WHERE genre = ? ORDER BY title;`;
  const [results] = await conn.query(sql , req.query.genre); 
  res.json({
    success: true,
    movies:  results
  })}
  conn.end();
});

//endpoint detail

server.get('/movies/:idMovies', async (req, res) => {
  const conn = await connectToDatabase();
  const { idMovies } = req.params;
  let sql = 'SELECT * FROM movies WHERE idMovies = ?;';
  const [results] = await conn.query(sql, [idMovies]);
  res.render('movie', { movie: results[0] });
  console.log('params', idMovies);
  conn.end();
});


// Para abrir el front desde el back chuleta:

const staticUrl= "./src/public";
server.use(express.static(staticUrl));