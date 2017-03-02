var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);

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

app.get('/training', function(req, res){
    console.log('--- Loading training page ---');
    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="content-type" content="text/html"; ' +
        'charset="UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/trainingSave" method="post">' +
        '<input type="text" name="text">' +
        '<input type="submit" value="Save training" />' +
        '</form>' +
        '</body>' +
        '</html>';

    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(body);
    res.end();
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

    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="content-type" content="text/html"; ' +
        'charset="UTF-8" />' +
        '</head>' +
        '<body>' +
        '<div>You entered ' + trainingVolume + '</div>' +
        '<div>All trainings <a href="allTrainings">here</a></div>'+
        '</body>' +
        '</html>';

    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(body);
    res.end();
});
app.get('/allTrainings', function(req,res) {
    console.log('--- Loading allTrainings page ---');

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

            results.forEach(function(item, i, arr) {
                body += 'id: '  + item['id'] + ' volume: ' + item['volume'] + '<br />';
            });

            body +=
                '</body>' +
                '</html>';

            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(body);
            res.end();
        });
    });
});

server.listen(3056, function(){
    console.log('+++++ statisticsServer was started +++++');
});

