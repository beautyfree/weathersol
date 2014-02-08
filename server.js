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

app.param(['id','days','direction'], /^\d+$/);
app.get('/widget/', function(req, res){
  var city_id = req.query.id || config.cities[0];

  function render_widget(res, data) {
      res.render('widget', {
          weather: data,
          days_type: req.query.days || 1,
          direction_type: req.query.direction || 1
      });
  }

  /* Запрашиваем данные из бд */
  db.getCity(city_id, function(err, reply) {

    if(!err && reply) {

        // Отдаем пользователю
        render_widget(res, reply);
    } else {

        // Парсим если вдруг по какой то причине не нашли
        parser(city_id, function(err, json) {
            if(!err) {
                // Сохраняем в бд
                db.setCity(city_id, json);
                // Отдаем пользователю
                render_widget(res, json);
            } else {
                // Если есть ошибки нужно повторить процесс
                res.send('Не существует виджета с такими параметрами');
            }
        });

    }
  });
});

var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
    console.log("Listening on port " + port);
});


/**
 * Фоновый парсинг
 **/

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

