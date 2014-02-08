var redis   = require('redis'),
    config  = require('./../config.js'),
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