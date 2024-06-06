const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');


// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// Conectarse a la base de datos
async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: 'sql.freedb.tech',
    user: 'freedb_adminnesflicompis',
    password: 'rXw%Axbw9N9$BJJ',
    database: 'freedb_nesflicompis'
  });
  await connection.connect();
  return connection;
}

// Escribir en la base de datos




//crear endpoint

server.get('/movies', async (req, res) => {
  
  const conn = await connectToDatabase();
  let sql = `SELECT idMovies as id, title, genre, image FROM movies; HAVING genre = ${req.query.genre};`;
  const [results] = await conn.query(sql); // en el caso de hacer un select, query nos devuelve un array con en la posicion 0 los datos de la tabla, y en la posición 1 la información de la estructura de la tabla (campos, tipo de dato)
  res.json({
    success: true,
    movies:  results
  })
  conn.end();
});


// Para abrir el front desde el back chuleta:

const staticUrl= "./src/public";
server.use(express.static(staticUrl));