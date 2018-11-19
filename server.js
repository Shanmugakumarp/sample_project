const express=require('express');
const app=express();
const path = require('path')
//use created angular project here
var bodyParser = require('body-parser')
app.use(express.static(path.join(__dirname,'/seller-partnership/dist/seller-partnership')));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/html' }));
app.get('/',(req,res)=>res.sendFile(path.join(__dirname, '/seller-partnership/src/index.html')));

var pg = require("pg");

const server = require('http').createServer(app);

const io = require('socket.io').listen(server);
io.set('transports', ['websocket']);

io.on('connection',(socket) => {
    console.log('socket connection established');
});

var config = {
  user: 'postgres',
  database: 'SAMPLE_PROJECT', 
  password: '1q2w3e4r5t', 
  port: 5432, 
  max: 10, // max number of connection can be open to database
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var pool = new pg.Pool(config);

app.post('/checklogin', function(req, res, next) {
	pool.connect(function(err,client,done)  {
		client.query('SELECT * FROM user_data', function(err,result) {
			var isAuthenticated = false;
			if(result.rows && result.rows.length) {
				for (var i = 0; i < result.rows.length; i++) {
					if (result.rows[i].name == req.body.name && result.rows[i].password == req.body.pwd) {
						isAuthenticated = true;
					}
				}

				if(isAuthenticated){
					io.emit('user', req.body.name);
				}
			}
			res.send({ status: isAuthenticated });	
		});
	})
});

app.post('/saveData', function(req, res, next) {
	console.log(req.body);
	pool.connect(function(err,client,done)  {
		client.query('update annotation_model set canvas_data = $1 where id = 1 ',[req.body], function(err,result) {
			console.log(err,result)
			res.send({ status: 'success' });
		});
	})
});

app.get('/getData', function(req, res, next) {
	pool.connect(function(err,client,done)  {
		client.query('SELECT * FROM annotation_model', function(err,result) {
			res.send(result.rows[0]);
		});
	})
});

server.listen(4200,()=>console.log("Listening on Port 4200"));