var mysql = require('mysql');

var connection = mysql.createConnection({
  host: '0.0.0.0',
  port: '3306',
  user: 'root',
  password : 'Strat124',
  database : 'competencias',
});

module.exports = connection;

