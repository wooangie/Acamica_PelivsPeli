var con = require ('../lib/conexionbd');

//función que trae todas las películas de la guía 1
function traerCompetencias(req, res){
    let sql = 'SELECT * FROM competencia'
    
    con.query(sql, function(error, resultado, fields){
        res.json(resultado)
    });
};

function mostrarCompetencia(req, res) {
    let id = req.params.id;
    let sql = 'SELECT * FROM competencias.competencia WHERE competencia.id = ' + id;
    
    con.query(sql, function (error, detallesCompetencia, fields){
        res.send(JSON.stringify(detallesCompetencia[0]));
        })
};

function traerOpciones(req, res){
    let id = req.params.id
    let sqlId = 'SELECT * FROM competencia WHERE id = ' + id;
    
    con.query(sqlId, function (error, competencia, fields){
        if(competencia.length == 0) {
            console.log ('competencia.id no existe', error);
            return res.status(404).send ('Competencia no válida');
        }
        else{
            let genero = competencia[0].genero_id;
            let director = competencia[0].director_id;
            let actor = competencia[0].actor_id;
            console.log (genero, director, actor);
            //Genero una query dependiendo de cómo fue configurada la competencia
            let sql = 'select * from pelicula join actor_pelicula on pelicula.id = actor_pelicula.pelicula_id'
            if (genero != null && actor != null && director != null){
                sql += ' where pelicula.genero_id = ' + genero + ' and actor_pelicula.actor_id = '+ actor + ' and pelicula.director = ' + director;
            } 
            else if ( genero != null && actor != null) {
                sql += ' where pelicula.genero_id = ' + genero + ' and actor_pelicula.actor_id = '+ actor;
            }
            else if (genero != null && director != null) {
                sql += ' where pelicula.genero_id = ' + genero + ' and pelicula.director = '+ director;
            }
            else if (actor != null && director != null) {
                sql += ' where pelicula.actor_id = ' + actor + ' and pelicula.director = '+ director;
            }
            else if (genero != null) {
                sql += ' where pelicula.genero_id = '+ director;
            }
            else if (actor != null) {
                sql += ' where actor_pelicula.actor_id = '+ actor;
            }
            else if (director != null) {
                sql += ' where pelicula.director = '+ director;
            }
            sql += ' order by rand() limit 0,2';
            console.log(sql);

            con.query(sql, function (error, competencia, fields){
                var resultado = {
                    'peliculas': competencia
                }
                res.send (JSON.stringify(resultado));
            })
        };
    });
};

function votar (req, res) {
    let idCompetencia = req.params.idCompetencia;
    let idPelicula = req.body.idPelicula;

    sqlGet = 'SELECT * FROM competencias.votacion WHERE pelicula_id =' + idPelicula + ' AND competencia_id = ' +idCompetencia;
    
    con.query (sqlGet, function(error, resultado, fields){
        if (resultado.length == 0){
            var sqlVotacion = 'INSERT INTO competencias.votacion (pelicula_id, competencia_id, votos) VALUES (' + idPelicula + ', ' + idCompetencia + ', 1)';
        }
        else {
            var sqlVotacion = 'UPDATE competencias.votacion SET votos = (votos + 1) WHERE pelicula_id = ' + idPelicula + 'AND competencia_id = ' + idCompetencia;
        };

        con.query(sqlVotacion, function (error, resultado, fields){
            res.send (JSON.stringify(resultado));
        })
    })
};

function traerResultados(req, res){
    let id = req.params.id;
    let sqlResultados = 'select * from competencias.votacion JOIN pelicula ON pelicula_id = pelicula.id WHERE competencia_id = ' + id + ' ORDER BY votos DESC LIMIT 0,3';
    con.query (sqlResultados, function(error, resultado, fields){
        var response = {
            'resultados': resultado,
        };
        res.send (JSON.stringify(response));
    })


        if (genero !=0 && actor !=0 && director !=0)  {
            console.log("entró a g a d")
            sql = 'insert into competencias.competencia (nombre, genero_id, actor_id, director_id) values ("'+ nombre + '", "' + genero + '", ' + actor + '", "'+ director + '")';
        } else if (genero !=0 && actor !=0) {
             console.log("entró a g a")
             sql = 'insert into competencias.competencia (nombre, genero_id, actor_id) values ("'+ nombre + '", "' + genero + '", ' + actor + '")';
        } else if (genero !=0 && director !=0) {
            console.log("entró a g d")
            sql = 'insert into competencias.competencia (nombre, genero_id, director_id) values ("'+ nombre + '", "' + genero + '", ' + director + '")';
        } else if (actor !=0 && director !=0) {
            console.log("entró a a d")
            sql = 'insert into competencias.competencia (nombre, actor_id, director_id) values ("'+ nombre + '", "' + actor + '", ' + director + '")';
        } else if (genero !=0 ) {
            console.log("entro a g")
            sql = 'insert into competencias.competencia (nombre, genero_id) values ("'+ nombre + '", "' + genero + '")';
        } else if (actor !=0) {
            console.log("entró a a")
            sql = 'insert into competencias.competencia (nombre, actor_id) values ("'+ nombre + '", "' + actor + '")';
        } else if (director !=0) {
            console.log("entró a d")
            sql = 'insert into competencias.competencia (nombre, director_id) values ("'+ nombre + '", "' + director + '")';
        }

        console.log(sql);

        connection.query(sql, function(error , competenciaCreada, fields){
            res.send(JSON.stringify(competenciaCreada));

        })
};

function crearCompetencia (req, res){
    //Dentro del body llega información sobre la competencia que se desea crear.
    let nombre = req.body.nombre;
    let genero = req.body.genero;
    let director = req.body.director;
    let actor = req.body.actor;
    //Traigo la tabla competencia
    con.query('SELECT * FROM competencias.competencia', function (error, resultado, fields){
        //Validación: Chequeo si la competencia ya está creada. Si es así, envío error 422.
        resultado.forEach((competenciaExistente)=>{
            if (nombre == competenciaExistente.nombre){
                res.status(422).send('La competencia ya existe')
            }
        });
        
        //Creo la query para verificar que hay más de 2 películas que cumplan con los filtros elegidos
        let sqlCheck = 'SELECT * from pelicula JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id'
        if (genero!=0 && actor !=0 && director != 0){
            sqlCheck += ' WHERE genero_id = ' + genero + ' AND actor_id = ' + actor + ' AND director_id = ' + director;
        }
        else if (genero!=0 && actor !=0){
            sqlCheck += ' WHERE genero_id = ' + genero + ' AND actor_id = ' + actor;
        }
        else if (genero!=0 && director !=0){
            sqlCheck += ' WHERE genero_id = ' + genero + ' AND director_id = ' + director;
        }
        else if (actor!=0 && director !=0){
            sqlCheck += ' WHERE actor_id = ' + actor + ' AND director_id = ' + director;
        }
        else if (genero!=0){
            sqlCheck += ' WHERE genero_id = ' + genero;
        }
        else if (actor!=0){
            sqlCheck += ' WHERE actor_id = ' + actor;
        }
        else if (director!=0){
            sqlCheck += ' WHERE director_id = ' + director;
        }
        console.log ('la query para chequear que hayan más de dos peliculas en una competencia es la siguiente: ' + sqlCheck);

        con.query(sqlCheck, function (error, chequeo, fields){
            //Validación: Si no consigo 2 pelis con los filtros, mando 422
            console.log (chequeo);
            if (chequeo.length <2){
                res.status(422).send('La competencia no tiene suficientes películas que cumplan la condición');
            }
            //Si hay suficientes pelis, creo la nueva query para insertar la nueva competencia.
            else{
                var sql
                if (genero!=0 && actor!=0 && director!=0){
                    sql = 'INSERT INTO competencias.competencia (nombre, genero_id, actor_id, director_id) VALUES ("' + nombre +'", ' + genero +', ' + actor + ', ' + director +')';
                }
                else if (genero!=0 && actor!=0){
                    sql = 'INSERT INTO competencias.competencia (nombre, genero_id, actor_id) VALUES ("' + nombre +'", ' + genero +', ' + actor +')';
                }
                else if (genero!=0 && director!=0){
                    sql = 'INSERT INTO competencias.competencia (nombre, genero_id, director_id) VALUES ("' + nombre +'", ' + genero +', ' + director +')';
                }
                else if (actor!=0 && director!=0){
                    sql = 'INSERT INTO competencias.competencia (nombre, actor_id, director_id) VALUES ("' + nombre +'", ' + actor +', ' + director +')';
                }
                else if (genero!=0){
                    sql = 'INSERT INTO competencias.competencia (nombre, genero_id) VALUES ("' + nombre +'", ' + genero +')';
                }
                else if (actor!=0){
                    sql = 'INSERT INTO competencias.competencia (nombre, actor_id) VALUES ("' + nombre +'", ' + actor +')';
                }
                else if (director!=0){
                    sql = 'INSERT INTO competencias.competencia (nombre, director_id) VALUES ("' + nombre +'", ' + director +')';
                }

                console.log ('la query para crear una competencia es la siguiente: ' + sql);
                con.query(sql, function (error, resultado, fields){
                    console.log ('el resultado de la query de creación de competencia es ');
                    console.log (resultado);
                    res.send (JSON.stringify(resultado));
                });        
            }
        })
    })
};

function reiniciarCompetencia(req, res){
    let idCompetencia = req.params.idCompetencia;
    con.query('SELECT * FROM competencias.votacion WHERE competencia_id = ' + idCompetencia, function (error, resultado, fields){
        if (resultado.length == 0){
                res.status(404).send('La competencia no tiene votos');
            }
        else {
            console.log("Entra a hacer la query para borrar")
            con.query('DELETE from competencias.votacion WHERE competencia_id = ' + idCompetencia, function (error, resultado, fields){
            res.send(JSON.stringify(resultado));
            })
        };
    });
};

function traerGeneros(req, res){
    con.query('SELECT * FROM genero', function (error, resultado, fields){
        res.send (JSON.stringify(resultado));
    })
};

function traerDirectores(req, res){
    con.query('SELECT * FROM director', function (error, resultado, fields){
        res.send (JSON.stringify(resultado));
    })
};

function traerActores(req, res){
    con.query('SELECT * FROM actor', function (error, resultado, fields){
        res.send (JSON.stringify(resultado));
    })
};

function eliminarCompetencia(req, res){
    let idCompetencia = req.params.idCompetencia;
    let sql = 'DELETE from competencia where id = ' + idCompetencia;
    console.log (idCompetencia);
    console.log (sql);
    con.query(sql, function (error, resultado, fields){
        //Validación: Si la query no trae resultados, mando 404
        console.log (resultado);
        if (resultado.length == 0){
            console.log ('competencia.id no existe', error);
            return res.status(404).send ('No se pudo eliminar la competencia por id inválido');
        }
        else{
        res.send (JSON.stringify(resultado));
        };
    })
};

function editarCompetencia (req, res) {
    let nombre = req.body.nombre;
    let idCompetencia = req.params.idCompetencia
    let sqlEditar = 'UPDATE competencias.competencia SET competencia.nombre = "' + nombre + '" WHERE competencia.id = ' + idCompetencia;
    con.query(sqlEditar, function(error, actualizacionCompetencia, fields){
        res.send(JSON.stringify(actualizacionCompetencia));
    })
};


module.exports = {
    traerCompetencias: traerCompetencias,
    mostrarCompetencia: mostrarCompetencia,
    traerOpciones: traerOpciones, 
    votar: votar,
    traerResultados: traerResultados, 
    crearCompetencia: crearCompetencia, 
    reiniciarCompetencia: reiniciarCompetencia,
    traerGeneros: traerGeneros,
    traerDirectores: traerDirectores,
    traerActores: traerActores,
    eliminarCompetencia: eliminarCompetencia,
    editarCompetencia:editarCompetencia
}