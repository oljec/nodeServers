function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


var init = function(data, callback) {
    var cord = {};

    do {
        cord = {
            x: getRandomInt(0,20),
            y: getRandomInt(0,20)
        };
    } while (data.startField[cord.x][cord.y]!=0);

    if (callback)
        callback(cord);
};

module.exports.init = init;