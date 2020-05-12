var con = require ('../lib/conexionbd');

//función que trae todas las películas de la guía 1
function traerCompetencias(req, res){
    let sql = 'SELECT * FROM competencia'
    
    con.query(sql, function(error, resultado, fields){
        if (error) return res.status (500).json (error)
        res.json(resultado)
    });
};

function mostrarCompetencia(req, res) {
    let id = req.params.id;
    let sql = 'SELECT * FROM competencias.competencia WHERE competencia.id = ' + id;
    
    con.query(sql, function (error, detallesCompetencia, fields){
        if (error) return res.status (500).json (error)
        res.send(JSON.stringify(detallesCompetencia[0]));
        })
};




function traerOpciones(req, res){
    console.log ('entró a traerOpciones')
    let idCompetencia = req.params.id;
    con.query('SELECT * FROM competencia WHERE id = ' + idCompetencia, function(error, resultado, fields){
        console.log(resultado);
        if(resultado.length == 0){
            return res.status(404).json('No existe la competencia');
        }
        let nombre = resultado[0].nombre;
        let genero = resultado[0].genero_id;
        let director = resultado[0].director_id;
        let actor = resultado[0].actor_id;
        let sql = 'SELECT pelicula.id, pelicula.titulo, pelicula.poster, competencia.nombre FROM ';

        if(genero && director && actor) {
            sql += 'competencia JOIN pelicula ON pelicula.genero_id = competencia.genero_id JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id WHERE competencia.id = '+ idCompetencia + ' and director_pelicula.director_id = '+ director +' and actor_pelicula.actor_id =' + actor;
        }
        else if(genero && actor){
            sql += 'competencia JOIN pelicula on pelicula.genero_id = competencia.genero_id join actor_pelicula on pelicula.id = actor_pelicula.pelicula_id WHERE pelicula.genero_id = '+ genero +' and actor_pelicula.actor_id = ' + actor + ' and competencia.id = '+ idCompetencia;
        }
        else if(genero && director){
            sql += 'competencia JOIN pelicula on pelicula.genero_id = competencia.genero_id join director_pelicula on pelicula.id = director_pelicula.pelicula_id WHERE competencia.genero_id = '+ genero +' and director_pelicula.director_id = ' + director;
        }
        else if(actor && director){
            sql += 'pelicula JOIN actor_pelicula on pelicula.id = actor_pelicula.pelicula_id join director_pelicula on pelicula.id = director_pelicula.pelicula_id join competencia on competencia.actor_id = actor_pelicula.actor_id where actor_pelicula.actor_id = '+ actor +' and director_pelicula.director_id = ' + director;
        }
        else if(genero){
            sql += 'competencia JOIN pelicula on pelicula.genero_id = competencia.genero_id WHERE competencia.genero_id = ' + genero;
        }
        else if(director){
           sql += 'pelicula join director_pelicula on pelicula.id = director_pelicula.pelicula_id join competencia on director_pelicula.director_id = competencia.director_id where director_pelicula.director_id = ' + director;
        }
        else if(actor){
            sql += 'pelicula join actor_pelicula on pelicula.id = actor_pelicula.pelicula_id join competencia on competencia.actor_id = actor_pelicula.actor_id  where actor_pelicula.actor_id = ' + actor;
        }
        else {
            sql = 'SELECT pelicula.id, pelicula.titulo, pelicula.poster FROM pelicula';
        }

        sql += ' ORDER BY RAND() LIMIT 0,2;'
        console.log (sql)
        con.query(sql, function(err, result, field){
            console.log (result);
            let nombreCompetencia = result[0].nombre
            let response = {
                'peliculas': result,
                'competencia': nombre
            };
            res.json(response)
        })
    })
}



function votar (req, res) {
    console.log ('entró a votar');
    console.log (req.body);
    let idCompetencia = req.params.idCompetencia;
    let idPelicula = req.body.idPelicula;

    sqlGet = 'SELECT * FROM competencias.votacion WHERE pelicula_id =' + idPelicula + ' AND competencia_id = ' +idCompetencia;
    console.log (sqlGet);
    con.query (sqlGet, function(error, resultado, fields){
        if (resultado.length == 0){
            var sqlVotacion = 'INSERT INTO competencias.votacion (pelicula_id, competencia_id, votos) VALUES (' + idPelicula + ', ' + idCompetencia + ', 1)';
        }
        else {
            var sqlVotacion = 'UPDATE competencias.votacion SET votos = (votos + 1) WHERE pelicula_id = ' + idPelicula + ' AND competencia_id = ' + idCompetencia;
        };
        console.log (sqlVotacion);
        con.query(sqlVotacion, function (error, resultado, fields){
            console.log(resultado);
            if (error) return res.status (500).json (error)
            res.send (JSON.stringify(resultado));
        })
    })
};

function traerResultados(req, res){
    console.log ('entró a traerResultados');
    let id = req.params.id;
    let sqlResultados = 'select * from competencias.votacion JOIN pelicula ON pelicula_id = pelicula.id WHERE competencia_id = ' + id + ' ORDER BY votos DESC LIMIT 0,3';
    console.log (sqlResultados);
    con.query (sqlResultados, function(error, resultado, fields){
        console.log (resultado);
        var response = {
            'resultados': resultado,
        };
        if (error) return res.status (500).json (error)
        res.send (JSON.stringify(response));
    })
};

function crearCompetencia (req, res){
    console.log ('entró a crearCompetencia');
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
        let sqlCheck = 'SELECT DISTINCT pelicula.id from pelicula JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id'
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
                else{
                    sql = 'INSERT INTO competencias.competencia (nombre) VALUES ("' + nombre +'")';
                }

                console.log ('la query para crear una competencia es la siguiente: ' + sql);
                con.query(sql, function (error, resultado, fields){
                    if (error) return res.status (500).json (error)
                    res.send (JSON.stringify(resultado));
                });        
            }
        })
    })
};

function reiniciarCompetencia(req, res){
    console.log ('entró a reiniciarCompetencia');
    let idCompetencia = req.params.idCompetencia;
    con.query('SELECT * FROM competencias.votacion WHERE competencia_id = ' + idCompetencia, function (error, resultado, fields){
        if (resultado.length == 0){
                res.status(404).send('La competencia no tiene votos');
            }
        else {
            console.log("Entra a hacer la query para reiniciar")
            con.query('DELETE FROM votacion WHERE competencia_id = ' + idCompetencia, function (error, resultado, fields){
                if (error) return res.status (500).json (error)
                res.send(JSON.stringify(resultado));
            })
        };
    });
};

function traerGeneros(req, res){
    con.query('SELECT * FROM genero', function (error, resultado, fields){
        if (error) return res.status (500).json (error)
        res.send (JSON.stringify(resultado));
    })
};

function traerDirectores(req, res){
    con.query('SELECT * FROM director', function (error, resultado, fields){
        if (error) return res.status (500).json (error)
        res.send (JSON.stringify(resultado));
    })
};

function traerActores(req, res){
    con.query('SELECT * FROM actor', function (error, resultado, fields){
        if (error) return res.status (500).json (error)
        res.send (JSON.stringify(resultado));
    })
};


function eliminarCompetencia(req, res){
    console.log ('entró a eliminarCompetencia');
    let idCompetencia = req.params.idCompetencia;
    let queryTablaVoto = 'DELETE from votacion where competencia_id = ' + idCompetencia;
    let queryTablaCompetencia = 'DELETE from competencia where id = ' + idCompetencia;

    con.query(queryTablaVoto, function(error, resultado, fields){
        con.query(queryTablaCompetencia, function(err, result, field){
            if (err) return res.status (500).json (err)
            res.json(result);
        })
    })
}





function editarCompetencia (req, res) {
    console.log ('entró a editarCompetencia');
    let nombre = req.body.nombre;
    let idCompetencia = req.params.idCompetencia
    let sqlEditar = 'UPDATE competencias.competencia SET competencia.nombre = "' + nombre + '" WHERE competencia.id = ' + idCompetencia;
    con.query(sqlEditar, function(error, actualizacionCompetencia, fields){
        if (error) return res.status (500).json (error)
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
};