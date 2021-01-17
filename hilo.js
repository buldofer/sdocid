const fs = require('fs'), path = require('path');

module.exports = function(hola,peo) {

    var currentDirPath = './public/imagenes/';

    fs.readdirSync(currentDirPath).forEach(function (name) {

        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            peo(filePath, stat);
        } else if (stat.isDirectory()) {
            peo(filePath, callback);
        }

        //return filePath, stat);
    })
};
    