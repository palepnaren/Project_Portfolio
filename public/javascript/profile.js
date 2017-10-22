"use strict";

var $ = jQuery.noConflict();
$(function(){

    $('video').prop('muted',true);
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
            myip = displayAddr[0];
            //            console.log(myip);
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


    var counter =0;
    var ip = "";
    var value = 0;
    var ipToCheck="";
    var view = 0;
    var navs = $('nav ul li:not(:last-child) a');
    var navHeight = $('nav').height();
    var sections = $('div#bg-video, div#aboutMe, div#skill, div#contact, div#download');
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
    
    $('#email-form').on("submit",function(e){
        e.preventDefault();
        alert("email sent successfully");
        window.location.assign("/");
    });

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


        if(ipToCheck == myip){        
            checkLike(myip,function(data){
                counter = data.like;
                if(counter==null){
                    getData(function(data){
                        counter = data;
                        $('#value').text(counter);
                        $('footer .fa').css('color','red');
                    });
                }else{
                    getData(function(data){
                        counter = data;
                        alert("You have liked the page already..");
                        $('#value').text(counter);
                        $('footer .fa').css('color','red'); 
                    });
                }
            });


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


        }else{
            confirm("We are unable to consider you like now. Try again later..!");
        }

        $(window).on('load',function(){

        });
    });




    windows.on('load',function(){

        getIp(myip,function(data){
            ipToCheck=data;

            if(ipToCheck==myip){
                ip=myip;
                setIp(ip);
            }else{
                alert("not equal");
            }

        });

        function setIp(ip){
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
        }

        checkLike(myip,function(data){
            value = data.like;
            if(value==null){
                getData(function(data){
                    value = data;
                    $('#value').text(value); 
                });
            }else{
                getData(function(data){
                    value = data;
                    $('#value').text(value);
                    $('footer .fa').css('color','red');
                });
            }

        });


        getViews(function(data){
            view = data;
            if(views!=0){
                $('#views').text(view);
            }
        });

    });

    function getIp(myip,callback){
        $.get("/ip/"+myip,function(data){

            if(data!=null){
                callback(data);
            }
        });
    }

    function checkLike(ip,callback){
        $.get("/likes/"+ip,function(data){
            if(data!=null){
                callback(data);
            }
        });
    }


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
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "saturation": 36
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 40
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    },
                    {
                        "weight": 1.2
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 29
                    },
                    {
                        "weight": 0.2
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 18
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 19
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
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


