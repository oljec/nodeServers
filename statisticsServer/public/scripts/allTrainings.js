console.log('test');

var socket = io("http://localhost:3056");

$(document).ready(function (){
    socket.emit('getData');

    socket.on('serverAllTrainings', function(data){
        console.log(data);
        var body='';
        data.forEach(function(item, i, arr) {
            body += 'id: ' + item['id'] + ' volume: ' + item['volume'] + '<br />';
        });
        $('.test_outer').append(body);
    });
});