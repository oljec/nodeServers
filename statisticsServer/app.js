var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    io = require('socket.io');

var app = express();
var server = http.createServer(app);
io = io.listen(server);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


var mysql = require('mysql');
var pool  = mysql.createPool({
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'statisticsServer'
});

io.on('connection', function(socket) {
    console.log("user connected");

    socket.on('getData', function() {
        console.log('getData request');

        pool.getConnection(function(err, connection) {
            var temp;
            connection.query('SELECT * FROM training', function (error, results, fields) {
                connection.release();
                if (error) throw error;

                var body =
                    '<html>' +
                    '<head>' +
                    '<meta http-equiv="content-type" content="text/html"; ' +
                    'charset="UTF-8" />' +
                    '</head>' +
                    '<body>' +
                    '<div>All trainings:</div>';

                io.sockets.emit('serverAllTrainings', results);
            });
        });
    })
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


app.post('/trainingSave', function(req, res){
    console.log('--- Loading trainingSave page ---');

    // res.setHeader('Access-Control-Allow-Origin', '*');

    var data = req.body;
    var trainingVolume = parseInt(data.text, 10);

    pool.getConnection(function(err, connection) {
        connection.query('INSERT INTO training SET volume = ?', [trainingVolume], function (error, results, fields) {
            connection.release();
            if (error) throw error;
        });
    });

    res.sendFile(__dirname + '/public/trainingSave.html');
});

app.use(express.static('public'));

server.listen(3056, function(){
    console.log('+++++ statisticsServer was started +++++');
});

