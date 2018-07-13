var Plaatsen = function () {
    var init = function(){
        console.log('app start  op...');

    }

    function addPlaatsen(namen) {
        var url, badgeClass, waarde;
        console.log(namen);
        $('ul.collapsible').empty();
        favoriet = [];   // Maak array leeg
        var favorieten = localStorage.getItem('favorieten');
        favoriet = JSON.parse(favorieten);
        //console.log(favoriet.length)
        console.log(namen.length);
        url = "./afbeeldingen/unfavorite.png";
        for(var i = 0; i < namen.length; i++) {
           for (var j=0; j < favoriet.length; j++) {

                if (favoriet[j].adres == namen[i].adress ) {
                    console.log("A : " + favoriet[j].adres);
                    console.log("B : " + namen[i].adress);
                    url = "./afbeeldingen/favorite.png";
                    // Verlaat meteen de for-lus!
                    j = favoriet.length;
                }
                else {
                    console.log("A : " + favoriet[j].adres);
                    console.log("B : " + namen[i].adress);
                    url = "./afbeeldingen/unfavorite.png";
                }
            }
            waarde = namen[i].open;
            if (waarde == "Closed") {
                badgeClass = "new badge red";
            } else if (waarde == "Open") {
                badgeClass = "new badge";
            } else {
                badgeClass = "badge"
            }

            var item = '<li><div class="collapsible-header" data-plaats="' + i + '"><span class="' + badgeClass + '" data-badge-caption="' + namen[i].open + '">' +'</span>' +
                    '<i class="material-icons">info_outline</i>' + namen[i].name + '</div>' +
                    '<div class="collapsible-body">' +
                        '<p class="kleur" style="color: white">' +
                            '<img data-plaats="' + i + '" class="favorieten" height="25px" width="25px" src="'+ url +'"/> ' + namen[i].adress +
                        '</p>' +
                    '</div>' +
                '</li>';
            $('ul.collapsible').append(item);
        }
    }

// Onderstaande gedeelte niet volledig !!
// Via PHP bestand de lijst met favorieten doorsturen naar database & afhalen van database (in Localstorage zetten)
    function addFavorieten(id,namen,favorite) {
        console.log("ADD FAVORIETEN : " + id);
        console.log(namen[id].name);
        var email = localStorage.getItem('email');
        var naam = namen[id].name;
        var adres = namen[id].adress;
        var dataString="email="+email+"&naam="+naam+"&adres="+adres+"&favorite="+favorite+"&voegToe";
        console.log(dataString)
        $.ajax({
            type: "POST",
            url: "http://localhost/addFavorieten.php",
            data: dataString,
            success: function(data){
                console.log(data);
                // Pas de favorieten aan in de localStorage
                vindFavorieten();
            }
        });
    }
    function vindFavorieten() {
        var plaatsen = [];
        var email = localStorage.getItem('email');
        var dataString="email="+email+"&vind";
        console.log(dataString)
        $.ajax({
            type: "POST",
            url: "http://localhost/addFavorieten.php",
            data: dataString,
            dataType: 'json',
            success: function(data){
                data.forEach(function (plaats) {
                    plaatsen.push({naam: plaats.naam, adres: plaats.adres});
                })
                console.log(plaatsen)
                localStorage.favorieten=JSON.stringify(plaatsen,null,2);
            }
        });
        return plaatsen;
    }
    return {
        init: init,
        addFavorieten: addFavorieten,
        vindFavorieten: vindFavorieten,
        addPlaatsen: addPlaatsen
    };
}()