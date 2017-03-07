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
    database        : 'nodeStatistics'
});

io.on('connection', function(socket) {
    console.log("user connected");

    socket.on('getData', function() {
        console.log('--- getData request ---');

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

function SaveTraining(trainingRes){
    var DBData = {
        pushUp: trainingRes.pushUp,
        planka: trainingRes.planka
    };
    pool.getConnection(function(err, connection) {
        connection.query('INSERT INTO training SET ?', DBData, function (error, results, fields) {
            connection.release();
            if (error) throw error;
        });
    });
}




app.post('/trainingSave', function(req, res){
    console.log('--- Loading trainingSave page ---');

    // res.setHeader('Access-Control-Allow-Origin', '*');

    var data = req.body;
    console.log(req.body);

    var training={};

    if (data.pushUp == '') {
        training['pushUp']=0;
    }
    else {
        training['pushUp'] = data.pushUp;
    }
    if (data.planka == '') {
        training['planka']=0;
    }
    else {
        training['planka'] = data.planka;
    }


    SaveTraining(training);


    res.sendFile(__dirname + '/public/trainingSave.html');
});

app.use(express.static('public'));

server.listen(3056, function(){
    console.log('+++++ statisticsServer was started +++++');
});

