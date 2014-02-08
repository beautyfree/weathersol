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
                        // Нам нужно пробежать по дням и взять только короткое описание температуры - днем и ночью
                        var days = result.forecast.day;
                        var days_new = [];
                        for(var k in days) {
                            var date = days[k]['$'].date;

                            var day_short = days[k].day_part[4]; // Описание дня
                            day_short = {
                                image: day_short['image-v3'][0]['_'],
                                temperature: day_short.temperature[0],
                                weather_type: day_short.weather_type[0]
                            };

                            var night_short = days[k].day_part[5]; // Описание ночи
                            night_short = {
                                image: night_short['image-v3'][0]['_'],
                                temperature: night_short.temperature[0],
                                weather_type: night_short.weather_type[0]
                            };

                            days_new.push({date: date, day: day_short, night: night_short});
                        }

                        return callback(false, days_new, city_id);
                    } else {
                        return callback(true, null, city_id);
                    }
                });
            } else {
                return callback(true, null, city_id);
            }
        });
    }
}();

if (typeof exports !== "undefined") {
    module.exports = parser;
}

