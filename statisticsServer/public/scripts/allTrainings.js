console.log('test');

var socket = io("http://192.168.0.103:3056");

$(document).ready(function (){
    socket.emit('getData');

    socket.on('serverAllTrainings', function(data){
        console.log(data);
        var body='';
        data.forEach(function(item, i, arr) {
            body +=
                'id: ' + item['id'] +
                ' pushUp: ' + item['pushUp'] +
                ' planka: ' + item['planka'] +
                '<br />';
        });
        $('.test_outer').html(body);
    });
});