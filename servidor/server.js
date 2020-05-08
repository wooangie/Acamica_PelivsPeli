//paquetes necesarios para el proyecto
var express = require('express');
var app = express();
var controlador = require ('./controladores/competenciasController');

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());


app.get('/competencias', controlador.traerCompetencias);
app.get('/competencias/:id/peliculas', controlador.traerOpciones);



//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = 8081,
ip = 'localhost'

app.listen(puerto, ip, function () {
  console.log( "Escuchando en ip " + ip + " y el puerto " + puerto );
});

