var http = require('http'),
    express = require('express'),
    io = require('socket.io');


//to mode in separate module
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
//---------------


var app = express();
var server = http.createServer(app);
io = io.listen(server);


var gameConfig = require('nconf');

gameConfig.argv()
    .env()
    .file({ file: __dirname + '/config/startField.json' });
var startField = gameConfig.get('startField');



var point = require('./modules/point');
var pointArray = [];

//will move to array
var cord;
for (var i=0; i<3; i++) {
    point.init({"startField": startField}, function (pointCord) {
        pointArray.push({'cord' : pointCord});
        cord = pointCord;
        startField[cord.x][cord.y] = 10;
        console.log(cord.x + ' ' + cord.y);
    });
}
//---------


io.on('connection', function(socket) {
    console.log("user connected");

    socket.on("initField", function(){
        console.log('--- initField request ---');
        
        io.sockets.emit('serverInitField', startField);

        //to move in separate module
        io.sockets.emit('serverPointCoord', cord);
        //-----------
    });
});

server.listen(3057, function(){
    console.log('+++++ gameLifeServer was started +++++');
});


//to move in separate module
setInterval(function(){
    var moveInit=0;

    for (var i=0; i<pointArray.length; i++) {
        do {
            var direction = getRandomInt(0, 4);
            switch (direction) {
                case 0:
                    if (pointArray[i]['cord']['x'] > 0 && startField[pointArray[i]['cord']['x']-1][pointArray[i]['cord']['y']] == 0) {
                        pointArray[i]['cord']['x']--;
                        moveInit = 1;
                    }
                    break;
                case 1:
                    if (pointArray[i]['cord']['y'] < 19 && startField[pointArray[i]['cord']['x']][pointArray[i]['cord']['y']+1] == 0) {
                        pointArray[i]['cord']['y']++;
                        moveInit = 1;
                    }
                    break;
                case 2:
                    if (pointArray[i]['cord']['x'] < 19 && startField[pointArray[i]['cord']['x'] + 1][pointArray[i]['cord']['y']] == 0) {
                        pointArray[i]['cord']['x']++;
                        moveInit = 1;
                    }
                    break;
                case 3:
                    if (pointArray[i]['cord']['y'] > 0 && startField[pointArray[i]['cord']['x']][pointArray[i]['cord']['y'] - 1] == 0) {
                        pointArray[i]['cord']['y']--;
                        moveInit = 1;
                    }
                    break;
            }
        } while (moveInit == 0);

        console.log('point moved to ' + pointArray[i]['cord']['x'] + ' ' + pointArray[i]['cord']['y']);
    }
    io.sockets.emit('serverPointCoord', pointArray);
}, 1000);
//-------------