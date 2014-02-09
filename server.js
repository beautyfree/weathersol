var express = require('express'),
    params  = require('express-params'),
    parser  = require('./lib/parser.js'),
    db      = require('./lib/db_wrapper.js'),
    config  = require('./config.js');

var app = express();
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.errorHandler());
params.extend(app); // Расширяем возможности валидации параметров

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Получаем данные для виджета
function getWeather(req, res, next){
    var city_id = req.query.id || config.cities[0];

    /* Запрашиваем данные из бд */
    db.getCity(city_id, function(err, reply) {

        // Отдаем пользователю если получили данные
        if(!err && reply) {
            res.locals({ weather: reply });
            next();
            return;
        }

        // Парсим если вдруг по какой то причине не нашли
        parser(city_id, function(err, json) {
            if(!err) {
                // Сохраняем в бд
                db.setCity(city_id, json);
                // Отдаем пользователю
                res.locals({ weather: json });
                next();
                return;
            }
            // Если есть ошибки нужно повторить процесс
            res.send('Не существует виджета с такими параметрами');
        });
    });
}

/**
 * Взаимодействие с клиентом
 */
app.param(['id','days','direction'], /^\d+$/);

app.get('/', function(req, res) {
    res.render('main');
});

app.get('/widget/', getWeather, function(req, res){
  res.locals({
      days_type: req.query.days || 1,
      direction_type: req.query.direction || 1
  });
  res.render("widget");
});

var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
    console.log("Listening on port " + port);
});

