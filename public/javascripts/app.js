function gen_script() {
    var city_el = document.getElementById('city_id'),
        days_el = document.getElementById('days_type'),
        direction_el = document.getElementById('direction_type'),
        script_el = document.getElementById('script_holder');

    var city_id = city_el.options[city_el.selectedIndex].value,
        days_type = days_el.options[days_el.selectedIndex].value,
        direction_type = direction_el.options[direction_el.selectedIndex].value;

    var script_text  = "<div id='weather_"+city_id+"'><script type='text/javascript'>";
    script_text += "(function(){var func=function(){WEATHER.widget("+city_id+","+days_type+","+direction_type+")};";
    script_text += "if(typeof WEATHER==='undefined'){var s=document.createElement('script');";
    script_text += "s.type='text/javascript';s.src='//localhost:3000/javascripts/widget.js?'+(Math.random()*1000|0);";
    script_text += "var i=setInterval(function(){if(typeof WEATHER!=='undefined'){func();clearInterval(i)}},100);";
    script_text += "document.getElementsByTagName('head')[0].appendChild(s)}else{func()}})()";
    script_text += "</script></div>";

    script_el.value = script_text;
}

window.onload = gen_script();