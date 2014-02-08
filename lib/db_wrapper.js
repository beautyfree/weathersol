var config  = require('./../config.js');


if(process.env.REDISTOGO_URL)
    var db      = require('redis-url').connect(process.env.REDISTOGO_URL);
else
    var redis   = require('redis'),
        db      = redis.createClient();

var db_wrapper = function() {
    city_key = 'city:';

    return {
        setCity: function(city_id, data) {
            db.set(city_key+city_id, JSON.stringify(data));
            db.expire(city_key+city_id, config.expire);
        },

        getCity: function(city_id, callback) {
            db.get(city_key+city_id, callback)
        }
    };
}();

if (typeof exports !== "undefined") {
    module.exports = db_wrapper;
}