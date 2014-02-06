var express = require('express'),
    params  = require('express-params'),
    parser  = require('./lib/parser.js'),
    db      = require('./lib/db_wrapper.js'),
    cron    = require('cron').CronJob,
    config  = require('./config.js');

var app = express();
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.errorHandler());
params.extend(app); // Расширяем возможности валидации параметров

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

/**
 * Взаимодействие с клиентом
 */

app.get('/', function(req, res) {
    res.render('main');
});

/* Формируем ответ исходя из параметров запроса виджета*/
app.param(['id','days','direction'], /^\d+$/);
app.get('/city/:id/:days.js', function(req, res){

  /* Запрашиваем данные из бд и парсим если данных по городу еще нет */
  db.getCity(req.params.id, function(err, reply) {

    if(!err && reply) {

        // Отдаем пользователю
        res.send(JSON.parse(reply));

    } else {

        // Парсим если вдруг по какой то причине не нашли
        parser(req.params.id, function(err, json) {
            if(!err) {
                // Сохраняем в бд
                db.setCity(req.params.id, JSON.stringify(json));
                // Отдаем пользователю
                res.send(JSON.stringify(json));
            } else {
                // Если есть ошибки нужно повторить процесс
            }
        });

    }
  });
});

app.listen(3000);
console.log('Listening on port 3000');


/**
 * Фоновый парсинг
 **/

function do_parse() {
    for(var k in config.cities) {
        var cityId = config.cities[k];
        parser(city_id, function(err, json) {
            if(!err) {
                // Сохраняем в бд
                db.setCity(city_id, JSON.stringify(json));
            } else {
                // Если есть ошибки нужно повторить процесс
            }
        });
    }
}

/* Парсим каждые 4 часа что бы были более менее свежие данные */
new cron({
    cronTime: config.cron,
    onTick: function() {
        do_parse();
    },
    start: true
});

/* Ручной парсинг при запуске сервера что бы иметь свежую бд */
do_parse();
