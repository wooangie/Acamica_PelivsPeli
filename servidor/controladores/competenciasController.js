var con = require ('../lib/conexionbd');

//función que trae todas las películas de la guía 1
function traerCompetencias(req, res){
    let sql = 'SELECT * FROM competencia'
    con.query(sql, function (error, resultado, fields){
        if(error) {
            console.log ('Hubo un error en la consulta', error.message);
            return res.status(404).send ('Hubo un error en la consulta');
        }

        console.log ('Se enviaron todas las competencias');
        res.JSON(resultado);
    });
};

function traerOpciones(req, res){
    let id = req.params.id
    //En caso de que el id sea para las pelis:
    //let sql = 'SELECT * FROM pelicula WHERE id =' + id;

    //En caso de que el id sea el de la competencia:
    let sql = 'SELECT * FROM pelicula ORDER BY RAND() LIMIT 0,2;'
    con.query(sql, function (error, resultado, fields){
        if(error) {
            console.log ('Hubo un error en la consulta', error.message);
            return res.status(404).send ('Hubo un error en la consulta');
        }
        
        console.log ('Se enviaron 2 películas random para que compitan');
        res.JSON(resultado);
    });
};




module.exports = {
    traerCompetencias: traerCompetencias,
    traerOpciones: traerOpciones,
};