#!/usr/bin/env node

//Bibliotecas para configuración, conexión http y base de datos
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const estudiante = require('./rutas/estudiantes');
var swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Puerto a usar
const port = process.env.serverport || 8001;
//Usar json en mi app
app.use(express.json());

//Conectarse a base de datos.
mongoose.connect('mongodb://localhost/chilebe', 
    { useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false, });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Conectados a la matrix'));

//Adicion de rutas
app.use('/estudiantes', estudiante)

//Adicionamos rutas de admin
const rutasAdmin = require('./rutas/admin');
app.use('/admin', rutasAdmin);


app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
  });



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', router);

//Escuchando peticiones en puerto definido
app.listen(port, () => console.log('Servidor iniciado en puerto '+port));


//Exportamos las rutas
module.exports = router;
