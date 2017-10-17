"use strict";

var $ = jQuery.noConflict();
$(function(){
    //localStorage.removeItem('likes');
    var myip="";

    var Track ={};

    var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    if(RTCPeerConnection)(function(){// this code credit goes to http://net.ipcalf.com/
        var rtc = new RTCPeerConnection({iceservers:[]});
        if(1 || window.mozRTCPeerConnection){
            rtc.createDataChannel('',{reliable:false});
        }

        rtc.onicecandidate = function(evt){

            if(evt.candidate){
                SDP('a='+evt.candidate.candidate);
            }
        }

        rtc.createOffer(function(offerDesc){
            SDP(offerDesc.sdp);
            rtc.setLocalDescription(offerDesc);
        },function(error){ console.warn("offer failed "+e);});

        var addrs = Object.create(null);
        addrs["0.0.0.0"] = false;
        function updateDisplay(newAddr){
            if(newAddr in addrs)return;
            else addrs[newAddr] = true;
            var displayAddr = Object.keys(addrs).filter(function(k){return addrs[k];});
            myip = displayAddr;
            console.log(myip);
            //            if(displayAddr.length>1){
            //                myip = displayAddr[0];
            //            }else{
            //                myip = displayAddr;
            //            }
            //console.log("addrs "+myip);
        }

        function SDP(sdp){
            var hosts = [];
            sdp.split('\r\n').forEach(function(line){
                //console.log("SDP "+line);

                if(~line.indexOf("a=candidate")){
                    var parts = line.split(' ');
                    var addr = parts[4];
                    var type = parts[7];
                    if(type=="host") updateDisplay(addr);
                }else if(~line.indexOf('c=')){
                    var parts = line.split(' ');
                    var addr = parts[2];
                    updateDisplay(addr);
                }
            });
        }
    })();


    //localStorage.removeItem('counter');
    var counter =0;
    var ip = "";
    var value = 0;
    var ipToCheck=[];
    var view = 0;
    var navs = $('nav ul li:not(:last-child) a');
    var navHeight = $('nav').height();
    var sections = $('div#bg-video, div#aboutMe, div#contact, div#download');
    var doc = $(document);
    var windows = $(window);


    windows.on('scroll resize',function(e){
        var currentPos = windows.scrollTop();


        if(windows.width() <= 740){
            if(currentPos == 0){
                $('nav.fixed-navbar').css('background','rgba(0,2,0,0.9)');
                $('nav.fixed-navbar').removeClass('effects');
                $('#profile-img').show();
            }
        }else if(currentPos == 0){
            $('nav.fixed-navbar').css('background','none');
            $('nav.fixed-navbar').removeClass('effects');
            $('#profile-img').show();
        }else{
            $('nav.fixed-navbar').css('background','none');
        }

        if(windows.scrollTop() > 50){
            $('nav.fixed-navbar').css('background','rgba(0,2,0,0.9)');
            $('nav.fixed-navbar').addClass('effects');
            $('#profile-img').hide();
        }

    });

    doc.on('scroll', function(){

        var currentScrollPos = doc.scrollTop();

        sections.each(function(){

            var currentSection = $(this);

            if(currentSection.offset().top < (currentScrollPos + navHeight) && (currentScrollPos + navHeight)< (currentSection.offset().top + currentSection.outerHeight())){
                var targetId = '.'+currentSection.attr('id');
                navs.removeClass('active');
                $(targetId).addClass('active'); 
            }

        });
    });


    $('video').prop('muted',true);

    $("#collapse-navbar").on('click',function(){


        if($('nav.fixed-navbar').hasClass('effects')){
            $('nav.fixed-navbar').removeClass('effects');
        }
        var navbar = $("#navbar-custom");
        windows.on('scroll', function(){
            $('nav.fixed-navbar').removeClass('effects');
            $('#profile-img').show();
        });
        if(navbar.hasClass('responsive-navbar')){
            navbar.removeClass('responsive-navbar');
            windows.on('scroll', function(){
                var currentPos = windows.scrollTop();
                if($('nav.fixed-navbar').hasClass('effects')){
                    $('nav.fixed-navbar').removeClass('effects');
                }else{
                    $('nav.fixed-navbar').addClass('effects');
                }
                $('#profile-img').hide();
                if(currentPos == 0){
                    $('nav.fixed-navbar').removeClass('effects');
                    $('#profile-img').show();
                }
            });
        }else{
            navbar.addClass('responsive-navbar');
            //$('nav.fixed-navbar').removeClass('effects');
        }

    });


    $('ul.left li a[href*="#"]:not([href="#"])').on('click',function(){

        if(location.pathname.replace('/^\//','')==this.pathname.replace('/^\//','') && location.hostname == this.hostname){

            var target = $(this.hash);
            //target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if(target.length==1){
                $('html,body').animate({
                    scrollTop:(target.offset().top-60)
                },2000,"easeInOutExpo");
                return false;
            }
        }


    });


    $('footer .fa').on('click', function(){

        //console.log("my ip address:"+myip);
        //console.log(ipToCheck);
        for(var j=0;j<ipToCheck.length;j++){
            for(var i=0;i<myip.length;i++){
                //console.log(ipToCheck[j].address);
                if(ipToCheck[j].address == myip[i]){
                    Track.like = 1;
                    var json = JSON.stringify(Track);
                    $.ajax({
                        type:"POST",
                        url:"/save",
                        data:json,
                        contentType: "application/json; charset=utf-8",
                        dataType:"json"

                    }).done(function(data){

                    });
                    
                    getData(function(data){
                        counter = data;
                        if(counter==null){
                        $('#value').text(counter);
                        $('footer .fa').css('color','red');
                    }else{
                        alert("You have liked the page already..");
                        $('#value').text(counter);
                        $('footer .fa').css('color','red');
                        //$(this).off('click'); 
                    }
                    });

                    
                }else{

                }
            }
        }
    });

    if(ipToCheck.length==0){
        $.getJSON("/ip",function(data){

            if(data!=null){
                $.each(data,function(i,item){
                    ipToCheck[i] = item;
                });
            }
        });
    }else{

    }


    windows.on('load',function(){

        for(var a=0;a<ipToCheck.length;a++){
            for(var b=0;b<myip.length;b++){
                if(ipToCheck[a].address==myip[b]){
                    ip=myip[b];
                }
            }
        }

        Track.ipaddress = ip;
        Track.views = 1;
        var json = JSON.stringify(Track);
        $.ajax({
            type:"POST",
            url:"/save",
            data:json,
            contentType: "application/json; charset=utf-8",
            dataType:"json"
        }).done(function(data){
            console.log(data);
            views=data.views;
            counter = data.like;
            console.log(counter);

        });

        $('#trigger').on('click',function(){
            $('#dialog').dialog({
                height:650,
                width:450
            }); 
        });

        getData(function(data){
            value= data;
            if(value != null){
                $('#value').text(value);
                $('footer .fa').css('color','red');
            }
        });

        getViews(function(data){
            view = data;
            if(views!=0){
                $('#views').text(view);
            }
        });



        //console.log(localStorage.getItem('likes'));
    });


    function getData(callback){
        $.getJSON('/getlikes',function(data){

            callback(data);
        });
    }

    function getViews(callback){
        $.getJSON('/getVews',function(data){

            callback(data);
        });
    }

    function setCookie(cookie_name,cookie_value,expires){

        var date = new Date();
        date.setTime(date.getTime()+(expires * 24 * 60 * 60 *1000));
        var expiresDays = "expires in="+date.toUTCString();
        console.log(expiresDays);
        document.cookie = cookie_name+"="+cookie_value+";"+expiresDays+";path=/";
    }

    function getCookie(cookie_name){
        var name = cookie_name+"=";
        var c = document.cookie.split(';');

        for(var i =0; i<c.length;i++){
            var ca = c[i];
            while(ca.charAt(0)==' '){
                ca = ca.substring(1);
            }
            if (ca.indexOf(name) == 0) {
                return ca.substring(name.length, ca.length);
            }
        }
        return "";
    }

    google.maps.event.addDomListener(window, 'load', init);
    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(new google.maps.LatLng(33.0198,-96.6989));
    });

});



var map = null;
// When the window has finished loading create our google map below



function init() {

    var mapOptions = {

        zoom: 10,
        center: new google.maps.LatLng(33.0198,-96.6989), // Plano
        // Disables the default Google Maps UI components
        disableDefaultUI: true,
        scrollwheel: false,
        draggable: false,

        // How you would like to style the map.
        // This is where you would paste any style found on Snazzy Maps.
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "weight": "2.00"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#9c9c9c"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#eeeeee"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#7b7b7b"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#46bcec"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#c8d7d4"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#070707"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            }
        ]
    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using out element and options defined above
    map = new google.maps.Map(mapElement, mapOptions);

    // Custom Map Marker Icon - Customize the map-marker.png file to customize your icon
    var image = 'img/map-marker.svg';
    var myLatLng = new google.maps.LatLng(33.0198,-96.6989);
    var beachMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
    });
}


