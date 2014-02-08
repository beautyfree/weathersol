(function(w,undefined){

    function WEATHER(){
        var t = this;
        // Иницилируем процесс создания виджета
        t.widget = function(ci_id, da_type, di_type){
            if(ci_id == undefined) return;
            da_type = da_type || 1;
            di_type = di_type || 1;

            t.load_iframe(ci_id, da_type, di_type);
        }
    };

    WEATHER.prototype = {
        /**
         * Микро фреймворк позаимствованный у граттиса и переписанный в менее минифицированный вид ;0
         */
        ge: function(id) {
            return document.getElementById(id);
        },
        c: function(tag_name, attrs) {
            var el = document.createElement(tag_name);
            if(attrs != undefined)
                // Загрязняем память, но не воровать же один в один и не портить читабильность
                for(var attr in attrs) this.attr(el,attr,attrs[attr]);
            return el;
        },
        attr: function(el,attr,val) {
            if(typeof val == 'object') {
                for(var a in val)
                    el[attr][a] = val[a];
            } else {
                el.setAttribute(attr,val);
            }
            return el;
        },
        replace:function(old_el, new_el) {
            old_el.parentNode.insertBefore(new_el, old_el.nextSibling);
            old_el.parentNode.removeChild(old_el);
        },

        load_iframe: function(ci_id, da_type, di_type) {
            var placeholder = this.ge('weather_widget');
            if(placeholder === undefined) return;

            var widget = this.c('iframe', {
                id: 'weather_widget',
                class: 'weather_direction_'+di_type,
                width: '100%',
                frameBorder: 0,
                scrolling: 'no',
                style:{
                    padding: 0
                }
            });

            this.transport(widget, ci_id, da_type, di_type);

            this.replace(placeholder, widget);
        },
        transport: function(widget, ci_id, da_type, di_type) {
            var host = window.location.host != 'localhost:3000' ?
                'weathersol.herokuapp.com/' :
                'localhost:3000';

            widget.src = 'http://'+host+'/widget/?id='+ci_id+'&days='+da_type+'&direction='+di_type;
            return widget;
        }
    }

    if(w.WEATHER === undefined) {
        w.WEATHER = new WEATHER;
    }
})(window);