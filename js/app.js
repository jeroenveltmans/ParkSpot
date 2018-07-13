$(function(){
    document.addEventListener("deviceready", onDeviceReady, false);
});

function onDeviceReady() {
    ingelogd();
    navbar();
    localStorage.favorieten="[]";

    Maps.initMap();
    Realtime.init();
    Plaatsen.init();
    Plaatsen.vindFavorieten();
}
var namen = [];

$('#renew').click(function(){
    $('#realTimeGent').empty();
    navigator.vibrate(500);
    Realtime.init();
});
$("#logout").click(function() {
    console.log("SEE YOU LATER !");
    uitloggen();
})

function uitloggen() {
    $('.button-collapse').sideNav('hide');
    $('.spa').hide();
    $('#tabRealTime').show();

    $('#loginPage').show();
    $('#realTime').hide();
    localStorage.login = "false";
    localStorage.favorieten="[]";
    $('ul#nav-mobile').find("li").slice(6,8).remove();
}

function ingelogd() {
    var login = localStorage.getItem('login');
    var email = localStorage.getItem('email');
    console.log('Ingelogd: ' + login);
    console.log('Email: ' + email);

    if (login == 'true') {
        $('#realTime').show();
        $('#loginPage').hide();
        $('ul#nav-mobile').append('<li id="logout"><a href="#!" onclick="uitloggen()" data-show="tabRealTime"><i class="material-icons">input</i>Logout</a></li>' +
            '<li><div class="divider"></div></li>'
        );

    } else if (login == 'false' || login == undefined) {
        $('#loginPage').show();
        $('#realTime').hide();
    }
}

function navbar() {
    $('.side-nav a').click(function(){
        $('.spa').hide();
        $('#' + $(this).data('show')).show();
        $('.button-collapse').sideNav('hide');
        console.log('#' + $(this).data('show'));
        // Dit zorgt ervoor dat als we van tab veranderen de map erna niet als een grijs vak zal worden weergeven
        if('#' + $(this).data('show')=='#tabLocatie'){
            google.maps.event.trigger(Maps.mijnMap.map, "resize");
        }
        // Zoek de actieve class en verander deze naar diegene waar we nu op klikken
        $(".side-nav").find(".active").removeClass("active");
        $(this).addClass("active");
    });
}

$('#toonWachtwoord').click(function(){
    // Het wachtwoord tonen als er op geklikt wordt, om na te gaan dat er niets fout getypt is
    var obj = document.getElementById('loginWachtwoord');
    if($(this).attr('src') === './afbeeldingen/visible.png') {
        $(this).attr('src', './afbeeldingen/visibleGrijs.png')
        obj.type = "password";
        console.log("TOON WW NIET");
    } else {
        $(this).attr('src', './afbeeldingen/visible.png')
        obj.type = "text";
        console.log("TOON WW");   
    }
});

$('.button-collapse').sideNav();

$('.registreer a').click(function(){
    $('.spa').hide();
    $('#' + $(this).data('show')).show();
});

$('.zoekbalk img').click(function(){
    console.log("GEBRUIK HUIDIGE LOCATIE");
    Maps.initMap();
});

$('ul').on('click', '.favorieten', function(){
    var favorite = false;
    var login = localStorage.getItem('login');

    if (login == 'true') {
        if($(this).attr('src') === './afbeeldingen/unfavorite.png') {
            $(this).attr('src', './afbeeldingen/favorite.png')
            favorite = true;
            console.log("FAVORITE");
        } else {
            $(this).attr('src', './afbeeldingen/unfavorite.png')
            favorite = false;
            console.log("UNFAVORITE");
        }
        console.log('Favorieten');
        var id = $(this).data('plaats');   // id = waarde x uit data-task="x"
        //console.log(id);
        Plaatsen.addFavorieten(id,namen,favorite);
    }

});


$('#zoekLocaties').click(function(){
    // Via Google zoeken naar 'Parkings' in de buurt van de gekozen locatie, daarna bepaalde resultaten in Array plaatsen
    var open, waardeNu = "";
    console.log('Locaties zoeken');

    var lat = Maps.mijnMap.locatie.lat;
    var lng = Maps.mijnMap.locatie.lng;

    namen.length = 0;
    var vandaag = new google.maps.LatLng(lat,lng);
    var request = {
        location: vandaag,
        radius: '400',
        types: ['parking']
     };
    var service = new google.maps.places.PlacesService(Maps.mijnMap.map);
    service.nearbySearch(request, function(result, status,pagination) {
        console.log(result);

        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < result.length; i++) {
            console.log(result[i]);
            console.log(result[i].geometry.location.lat());
                if (result[i].opening_hours) {
                    open = result[i].opening_hours.open_now;
                    if (open == true) {
                        waardeNu = "Open";
                    }
                    else {
                        waardeNu = "Closed";
                    }
                }
                else {
                    waardeNu = "";
                }
                namen.push({'name' : result[i].name, 'adress': result[i].vicinity, 'lat': result[i].geometry.location.lat(), 'lng': result[i].geometry.location.lng(), 'open': waardeNu});
            }
            Plaatsen.addPlaatsen(namen);
            Maps.addMarkers(namen);
        }
    });
});

$("#registreerAccount").click(function(){
    console.log("Registreer een account!");
    var voornaam=$("#registreerVoornaam").val();
    var achternaam=$("#registreerAchternaam").val();
    var email=$("#registreerEmail").val();
    var wachtwoord=$("#registreerWachtwoord").val();
    console.log(voornaam + "," + achternaam + "," + email + "," + wachtwoord);
    var dataString="voornaam="+voornaam+"&achternaam="+achternaam+"&email="+email+"&wachtwoord="+wachtwoord+"&registreerAccount=";
    if($.trim(voornaam).length>0 & $.trim(achternaam).length>0 & $.trim(email).length>0 & $.trim(wachtwoord).length>0)
    {
        $.ajax({
            type: "POST",
            url: "http://localhost/registreer.php",
            data: dataString,
            success: function(data){
                console.log(data);
                if(data=="success")
                {
                    console.log(data);
                    Materialize.toast('Thank you for registering with us! You can login now!', 5000); // 5000 is de lengte van de toast
                    $.ajax({
                        type: "POST",
                        url: "http://localhost/registreerMail.php",
                        data: dataString,
                        success: function(data) {
                            console.log(data);
                        }
                    });
                }
                else if(data=="exist")
                {
                    console.log(data);
                    Materialize.toast('You alreay have an account! Login now!', 5000); // 5000 is de lengte van de toast
                }
                else if(data=="failed")
                {
                    console.log(data);
                    Materialize.toast('Somthing went wrong, please try again later!', 5000); // 5000 is de lengte van de toast
                }
            }
        })
    } return false ;
});

$("#login").click(function(){
    var email=$("#loginEmail").val();
    var wachtwoord=$("#loginWachtwoord").val();
    var dataString="email="+email+"&wachtwoord="+wachtwoord+"&login=";
    if($.trim(email).length>0 & $.trim(wachtwoord).length>0)
    {
        $.ajax({
            type: "POST",
            url: "http://localhost/login.php",
            data: dataString,
            beforeSend: function(){ $("#login").html('Connecting...');},
            success: function(data){
                console.log(data);
                if(data=="success")
                {
                    localStorage.login="true";
                    localStorage.email=email;
                    $("#login").html('Login');
                    // In local storage de nieuwe waarde gaan ophalen zodat er nieuwe <li> tags kunnen worden toegevoegd
                    ingelogd();
                    // Navigatiebalk terug configureren zodat de 2 nieuwe <li> tags ook iets doen als je er op klikt
                    navbar();
                }
                else if(data=="failed")
                {
                    localStorage.login="false";
                    Materialize.toast('Incorrect email / password, please try again!', 5000); // 5000 is de lengte van de toast
                    $("#login").html('Login');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
                $("#login").html('Login');
                Materialize.toast('Something went wrong, please try again later!', 5000); // 5000 is de lengte van de toast
            }
        });            
    } return false;
});
