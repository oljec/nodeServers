console.log('+++++ gameLife.js is connected +++++');

var socket = io("http://192.168.0.102:3057");

$(document).ready(function () {
    socket.emit('initField');
    
    socket.on('serverInitField', function(field) {
        $('.fullField').append(field);
    });
    socket.on('serverPointCoord', function(cord) {
        $('.fieldCell').removeClass('point');

        var cellCord = '#cell_' + cord.x + '_' + cord.y;
        $(cellCord).addClass('point');
    });
});