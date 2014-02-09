/***
 *
 * Фоновый парсинг.
 *
 **/
var cron    = require('cron').CronJob,
    db      = require('./lib/db_wrapper.js'),
    config  = require('./config.js');

function do_parse() {
    for(var k in config.cities) {
        parser(config.cities[k], function(err, json, city_id) {
            if(!err) {
                // Сохраняем в бд
                db.setCity(city_id, json);

                // console.log('Спарсил данные для города: ' + city_id);
            } else {
                // Если есть ошибки нужно повторить процесс
            }
        });
    }
}

/* Парсим каждые 4 часа что бы были более менее свежие данные */
new cron({
    cronTime: config.cron,
    onTick: do_parse(),
    start: true // При запуске стартуем и выполняем
});