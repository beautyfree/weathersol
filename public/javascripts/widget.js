(function(w){
    function WEATHER(){};

    WEATHER.prototype = {
        widget: function(ci_id, da_type, di_type){
            alert(1);
        }
    }

    w.WEATHER = new WEATHER;
})(window);