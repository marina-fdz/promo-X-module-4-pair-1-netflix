const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


// create and config server
const server = express();
server.use(cors());
server.use(express.json({ limit: '15mb'}));
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

// endpoint registro
server.post("/sign-up", async (req, res)=> {
// conectar con la BD
const conn = await connectToDatabase();
//recoger datos user
const { email, password } = req.body;
//comprobar que el user no exixte en la BD
const selectEmail = 'SELECT * FROM users WHERE email = ?';
const [emailResult] = await conn.query(selectEmail,[email]);
//El usuario NO existe ---> INSERT INTO 
if (emailResult.length === 0){
  const hashedPassword = await bcrypt.hash(password, 10);
const insertUser =
'INSERT INTO users (email, password) values (?, ?)';
const [newUser] = await conn.query(insertUser, [email, hashedPassword]);
res.status(201).json({ success: true, id: newUser.insertId});
}
else {
res.status(200).json({ success: false, message: 'usuario ya existe'})
}
//cerramos la conexión
conn.end();
});


//endpoint login

server.post('/login', async (req, res) => {
  //conectar con la BD
  const conn = await connectToDatabase();
  //recoger los datos del usuario por el body
  const { email, password } = req.body;
  //hacer la comprobación de que el email ya exista en la BD
  console.log('body', req.body);
  const selectUser = 'SELECT * FROM users WHERE email = ?;';
  const [resultUser] = await conn.query(selectUser, [email]);
  //si el email ya existe --> se comprueba que la contraseña encriptada coincide con la del usuario --> bcrypt
  if(resultUser.length !== 0){
    const isSamePassword = await bcrypt.compare(password, resultUser[0].password);
  
    if(isSamePassword){
      //si la contraseña coincide-->creo token
      const infoToken = { email: resultUser[0].email, id: resultUser[0].idUser };
      const token = jwt.sign(infoToken, 'secret-key', {expiresIn: '1h'});
      res.status(201).json({success: true, token: token});
    }else{
      //sino --> enviar msj de contraseña incorrecta
      res.status(400).json({ success: false, message: 'contraseña incorrecta' });
    }
  } else {
    res.status(400).json({
      success: false,
      errorMessage: "Usuaria/o no encontrada/o"
    });
    
  }

});


//endpoint getprofile

function authorize(req, res, next){
  const tokenString = req.headers.authorization;
  if(!tokenString){
    res.status(400).json({ success: false, message: 'No estás autorizado'});
  }else{
    //verificamos que la clave es correcta
    try{

    const token = tokenString.split(' ')[1];
    const verifiedToken = jwt.verify(token, 'secret-key');
    req.infoToken = verifiedToken;

    }
    catch(error){
      res.status(400).json({ success: false, message: error });
    
    }
    next();
    

  }
}

//nos trae los datos de la usuaria
server.get('/user/profile', authorize, async (req, res) => {
  res.status(200).json({ success: true, message: req.infoToken });
})


// servidores estáticos

const staticUrl= "./src/public";
server.use(express.static(staticUrl));

server.use(express.static('./src/css'));