//paquetes necesarios para el proyecto
var express = require('express');
var cors = require('cors');
var app = express();
var controlador = require ('./controladores/competenciasController');

app.use(cors());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

//GET
app.get('/competencias', controlador.traerCompetencias);
app.get('/competencias/:id', controlador.mostrarCompetencia);
app.get('/competencias/:id/peliculas', controlador.traerOpciones);
app.get('/competencias/:id/resultados', controlador.traerResultados);
  //Guía 3, paso 3
app.get('/generos', controlador.traerGeneros);
  //Guía 3, paso 4
app.get('/directores', controlador.traerDirectores);
  //Guía 3, paso 5
app.get('/actores', controlador.traerActores);

//POST
  //Guía 3, paso 1  
app.post('/competencias', controlador.crearCompetencia);
app.post('/competencias/:idCompetencia/voto', controlador.votar);

//DEPETE
  //Guía 3, paso 6
app.delete('/competencias/:idCompetencia', controlador.eliminarCompetencia);
  //Guía 3, paso 2
app.delete('/competencias/:idCompetencia/votos', controlador.reiniciarCompetencia);

//PUT
  //Guía 3, paso 7
app.put('/competencias/:idCompetencia', controlador.editarCompetencia);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080'


app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

