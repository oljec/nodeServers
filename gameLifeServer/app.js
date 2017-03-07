var http = require('http'),
    express = require('express'),
    io = require('socket.io');


//to mode in separate module
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var cord = {
    x: getRandomInt(0,10),
    y: getRandomInt(0,10)
};
console.log(cord.x + ' ' + cord.y);
//---------


var app = express();
var server = http.createServer(app);
io = io.listen(server);

io.on('connection', function(socket) {
    console.log("user connected");

    socket.on("initField", function(){
        console.log('--- initField request ---');
        
        var field = '';
        for (var i=0; i<10; i++) {
            for (var j=0; j<10; j++) {
                field += '<div id="cell_' + i + '_' + j + '" class="fieldCell"></div>';
            }
        }
        field += '<div class="cleaner"></div>';

        io.sockets.emit('serverInitField', field);

        //to mode in separate module
        io.sockets.emit('serverPointCoord', cord);
        //-----------
    });
});

server.listen(3057, function(){
    console.log('+++++ gameLifeServer was started +++++');
});


//to mode in separate module
setInterval(function(){
    var moveInit=0;

    do {
        var direction = getRandomInt(0,4);
        switch (direction) {
            case 0:
                if (cord.x>0) {
                    cord.x--;
                    moveInit=1;
                }
                break;
            case 1:
                if (cord.y<9) {
                    cord.y++;
                    moveInit=1;
                }
                break;
            case 2:
                if (cord.x<9) {
                    cord.x++;
                    moveInit=1;
                }
                break;
            case 3:
                if (cord.y>0) {
                    cord.y--;
                    moveInit=1;
                }
                break;
        }
    } while (moveInit==0);

    console.log('point moved to ' + cord.x + ' ' + cord.y);

    io.sockets.emit('serverPointCoord', cord);
}, 1000);
//-------------