var pg = require('pg');
  
var connectionString = "pg://postgres:a@localhost/jacksparrow"

pg.connect(connectionString, function(err, client) {
	client.query('SELECT username FROM "user" WHERE id=5', function(err, result) {
	console.log(result.rows[0].username);
	console.log(err);		    
	});
});
pg.end();


