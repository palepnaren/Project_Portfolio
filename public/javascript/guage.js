$('svg').each(function(i,elm){
    
    var config = liquidFillGaugeDefaultSettings();
    config.waveAnimate=true;
    config.waveAnimateTime=1000;
    config.waveHeight=0.2;
    config.circleColor="#222";
    var guage = loadLiquidFillGauge($(elm).attr('id'), $(elm).data('percentage'),config); 

});

