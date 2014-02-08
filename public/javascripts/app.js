function gen_script() {
    var city_id = $('#city_id').val(),
        days_type = $('#days_type').val(),
        direction_type = $('#direction_type').val();

    var script_text  = "<div id='weather_widget'><script type='text/javascript'>";
    script_text += "(function(){var func=function(){WEATHER.widget("+city_id+","+days_type+","+direction_type+")};";
    script_text += "if(typeof WEATHER==='undefined'){var s=document.createElement('script');";
    script_text += "s.type='text/javascript';s.src='http://"+window.host+"/javascripts/script.js?'+(Math.random()*1000|0);";
    script_text += "var i=setInterval(function(){if(typeof WEATHER!=='undefined'){func();clearInterval(i)}},100);";
    script_text += "document.getElementsByTagName('head')[0].appendChild(s)}else{func()}})()";
    script_text += "</script></div>";

    $('#script_holder').val(script_text);

    WEATHER.widget(city_id,days_type,direction_type);
}

$(function(){
    gen_script();
});