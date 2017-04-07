console.log('+++++ gameLife.js is connected +++++');

var socket = io("http://192.168.1.171:3057");

$(document).ready(function () {
    socket.emit('initField');
    
    socket.on('serverInitField', function(startField) {
        var field = '';
        for (var i=0; i<20; i++) {
            for (var j=0; j<20; j++) {
                if (startField[i][j]==1) {
                    field += '<div id="cell_' + i + '_' + j + '" class="fieldCell wall"></div>';
                }
                else {
                    field += '<div id="cell_' + i + '_' + j + '" class="fieldCell"></div>';
                }
            }
        }
        field += '<div class="cleaner"></div>';

        $('.fullField').append(field);
    });
    socket.on('serverPointCoord', function(pointArray) {
        $('.fieldCell').removeClass('point');

        for (var i=0; i<pointArray.length; i++){
            var cellCord = '#cell_' + pointArray[i]['cord']['x'] + '_' + pointArray[i]['cord']['y'];
            $(cellCord).addClass('point');
        }
    });
});