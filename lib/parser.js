var request = require('request'),
    xml2json = require('xml2js');

var parser = function() {
    var api_url = 'http://export.yandex.ru/weather-ng/forecasts/';
    var format  = 'xml' // А другого и нет к сожалению

    return function(city_id, callback) {

        // Делаем запрос к апи яндекса
        request(api_url + city_id + '.' + format, function (error, response, body) {
            // Если нет ошибок
            if (!error && response.statusCode == 200) {
                // Преобразуем xml в json
                xml2json.parseString(body, function (err, result) {
                    // Если нет ошибок
                    if(!err) {

                        // Формируем новый не перегруженный результат


                        return callback(false, result);
                    } else {
                        return callback(true, null);
                    }
                });
            } else {
                return callback(true, null);
            }
        });
    }
}();

if (typeof exports !== "undefined") {
    module.exports = parser;
}

