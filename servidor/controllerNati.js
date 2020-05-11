var connection = require('../conexion-DB/conexion')


function listarCompetencias(req, res) {
    connection.query(`select * from competencias.competencia`, function(err, results, fields){
        res.send(JSON.stringify(results));
    })

}

function obtenerOpciones(req, res) {
    
    var idCompetencia = req.params.id
    connection.query(`select * from competencias.competencia where id = ${idCompetencia}`, function(error, competencias, fields){
        if(competencias.length == 0) {
            return res.status(404).send("No existe la competencia");
        } else {
            connection.query(`select * from competencias.competencia where competencia.id = ${req.params.id}`, function (error, competencia, fields) {
                var genero  = competencia[0].genero_id;
                var director = competencia[0].director_id;
                var actor = competencia[0].actor_id;
                var sql = `select * from pelicula join actor_pelicula on pelicula.id = actor_pelicula.pelicula_id`
                if (genero != null && actor != null && director != null){
                    sql += ` where pelicula.genero_id = ${genero} and actor_pelicula.actor_id = ${actor} and pelicula.director = ${director}`;
                } else if ( genero != null && actor != null) {
                    sql += ` where pelicula.genero_id = ${genero} and pelicula.actor_id = ${actor}`
                } else if (genero != null && director != null) {
                    sql += ` where pelicula.genero_id = ${genero} and pelicula.director = ${director}`
                } else if (actor != null && director != null) {
                    sql += ` where actor_pelicula.actor_id = ${actor} and pelicula.director = ${director}`
                } else if (genero != null) {
                    sql += ` where pelicula.genero_id = ${genero}`
                } else if (actor != null) {
                        sql += ` where actor_pelicula.actor_id = ${actor}`
                } else if (director != null) {
                        sql += ` where pelicula.director = ${director}`
                }
                    sql += ` order by rand() limit 0,2`
                    console.log(sql);
                    connection.query(sql, function(err,listadoPeliculas, fields){
                        var opciones = {
                            peliculas: listadoPeliculas
                        }
                        res.send(JSON.stringify(opciones));                    
                    })
                })
                
            }
            
        })
    }
    
    function votar (req, res) {
        let idpelicula = req.body.idPelicula;
        let idCompetencia = req.params.id;
        connection.query(`select * from competencias.votacion where pelicula_id = ${idpelicula} and competencia_id = ${idCompetencia}`, function(error, existevotacion, fields) {
        
        
        if (existevotacion.length == 0) {
           var sql = `insert into competencias.votacion (pelicula_id, competencia_id, votos) values (${idpelicula}, ${idCompetencia}, 1)` 
       } else {
           var sql = `update competencias.votacion SET votos = (votos +1) WHERE pelicula_id = ${idpelicula} AND competencia_id = ${idCompetencia} `
       }
       
       connection.query(sql, function(err, votado, fields){
           res.send(votado);
       })
    })  

}


function traerResultados (req, res) {
    var sql = `select * from competencias.votacion join pelicula on pelicula_id = pelicula.id where competencia_id = ${req.params.id} order by votos desc limit 0,3` ;
    connection.query(sql, function (error, masVotadas, fields){
        var response = { 
            'resultados': masVotadas
                 };
    
        res.send(JSON.stringify(response));
            
    })
}


function crearCompetencia (req, res){ 
    console.log(req.body);
    var nuevaCompetencia = req.body.nombre
    connection.query (`select * from competencias.competencia`, function(error, competencias, fields){
     competencias.forEach((categoria) => {
            if (nuevaCompetencia == categoria.nombre) {
                res.status(422).send("La competencia ya existe");
            } 
        });

        var genero = req.body.genero;
        var actor = req.body.actor;
        var director = req.body.director;
        var sql;
        

        if (genero !=0 && actor !=0 && director !=0)  {
            sql = `insert into competencias.competencia (nombre, genero_id, actor_id, director_id) values ('${nuevaCompetencia}', ${req.body.genero}, ${req.body.actor}, ${req.body.director})`;
        } else if (genero !=0 && actor !=0) {
            sql = `insert into competencias.competencia (nombre, genero_id, actor_id) values ('${nuevaCompetencia}', ${req.body.genero}, ${req.body.actor})`;
        } else if (genero !=0 && director !=0) {
            sql = `insert into competencias.competencia (nombre, genero_id, director_id) values ('${nuevaCompetencia}', ${req.body.genero}, ${req.body.director})`;
        } else if (actor !=0 && director !=0) {
            sql = `insert into competencias.competencia (nombre, actor_id, director_id) values ('${nuevaCompetencia}', ${req.body.actor}, ${req.body.director})`;
        } else if (genero !=0 ) {
            sql = `insert into competencias.competencia (nombre, genero_id) values ('${nuevaCompetencia}', ${req.body.genero})`;
        } else if (actor !=0) {
            sql = `insert into competencias.competencia (nombre, actor_id) values ('${nuevaCompetencia}', ${req.body.actor})`;
        } else if (director !=0) {
            sql = `insert into competencias.competencia (nombre, director_id) values ('${nuevaCompetencia}', ${req.body.director})`;
        }

        connection.query(sql, function(error , competenciaCreada, fields){
            res.send(JSON.stringify(competenciaCreada));

        } )
    })
}


function reiniciarCompetencia (req, res) {  
    var sql = `select * from competencias.votacion where votacion.competencia_id = ${req.params.id}`;
    connection.query (sql, function(err, votosExistentes, fields){
        if (votosExistentes.length == 0) {
            res.status(404).send("La competencia no tiene votos aun");
        } else {
            connection.query(`delete from competencias.votacion where votacion.competencia_id = ${req.params.id}`, function(error, votacionEliminada, fields){
            res.send(JSON.stringify(votacionEliminada));
            });

        }
    });
}

function traerGeneros (req, res) {
    connection.query(`select * from competencias.genero`, function (error, generos, fields){
        res.send(JSON.stringify(generos));
    })
}

function traerDirectores(req, res) {
    connection.query(`select * from competencias.director`, function (error, directores, fields){
        res.send(JSON.stringify(directores));
    })
}

function traerActores(req, res) {
    connection.query(`select * from competencias.actor`, function (error, actores, fields){
        res.send(JSON.stringify(actores));
    })
}


function eliminarCompetencia(req, res) {
    connection.query(`select * from competencias.competencia where competencia.id = ${req.params.id}`, function (error, competenciaABorrar, fields){
        if (competenciaABorrar.length == 0) {
            res.status(404).send("No existe la competencia")
        } else {
            connection.query(`delete from competencias.competencia where competencia.id = ${req.params.id}`, function(error, bajaCompetencia, fields){
             res.send(JSON.stringify(bajaCompetencia));
            })
        }
    })
    
}

function mostrarCompetencia (req, res) {
    connection.query(`select * from competencias.competencia where competencia.id = ${req.params.id}`, function(error, detallesCompetencia, fields){
        res.send(JSON.stringify(detallesCompetencia[0]));
    })
}

function editarCompetencia (req, res) {
    connection.query(`update competencias.competencia set competencia.nombre = '${req.body.nombre}' where competencia.id = ${req.params.id}`, function(error, actualizacionCompetencia, fields){
        res.send(JSON.stringify(actualizacionCompetencia));
    })
}


module.exports = {
    listarCompetencias: listarCompetencias,
    obtenerOpciones: obtenerOpciones,
    votar: votar,
    traerResultados: traerResultados,
    crearCompetencia : crearCompetencia,
    reiniciarCompetencia: reiniciarCompetencia,
    traerGeneros:traerGeneros,
    traerActores: traerActores,
    traerDirectores: traerDirectores,
    eliminarCompetencia: eliminarCompetencia,
    mostrarCompetencia: mostrarCompetencia,
    editarCompetencia: editarCompetencia
}