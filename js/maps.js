var Maps = function () {
    var lat, lng, cityCircle, plaatsenMarker, locatiemarker;
    var markers = [];

    var mijnMap = { map: null, locatie: null, marker: null}
    function initMap() {
            // Eerst nakijken of GPS op GSM op staat 
            CheckGPS.check(function win(){
                // Als de GPS aan staat de huidige locatie tonen 
                console.log("GPS AAN");
                navigator.geolocation.getCurrentPosition(function(position) {
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;
                    mijnMap.locatie = {lat: lat, lng: lng};
                    console.log("GEO: " + JSON.stringify(mijnMap.locatie, null, 2));
                    var geocoder = new google.maps.Geocoder;
                    geocodeLatLng(geocoder, lat, lng);

                    mijnMap.map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 15,
                        center: mijnMap.locatie
                    });
                    mijnMap.marker = new google.maps.Marker({
                        position: mijnMap.locatie,
                        map: mijnMap.map
                    });
                    autocomplete();
                })
            },
            function fail(){
                // Als de GPS niet aan staat, een melding geven en een standaard locatie tonen!
                console.log("GPS UIT!");
                document.getElementById("mapSearch").value = "";
                Materialize.toast('Locations not enabled!', 4000); // 4000 is de lengte van de toast
                mijnMap.locatie = {lat: 51.042408, lng: 4.662004};
                mijnMap.map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: mijnMap.locatie
                });
                mijnMap.marker = new google.maps.Marker({
                    position: mijnMap.locatie,
                    map: mijnMap.map
                });
                autocomplete();
            });
    }
    function autocomplete() {
        var input = document.getElementById('mapSearch');

        autocomplete = new google.maps.places.Autocomplete(input, {types: ['address']} );

        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();

            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;

            // Als er een geometry te vinden is, toon deze dan op de map
            if (place.geometry.viewport) {
                mijnMap.map.fitBounds(place.geometry.viewport);
            } else {
                mijnMap.map.setCenter(place.geometry.location);
            }
            console.log('%c' + place.geometry.location, 'color:red')
            mijnMap.map.setZoom(15);
            mijnMap.locatie = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
            mijnMap.marker.setPosition(place.geometry.location);
            console.log(mijnMap.locatie);
            console.log("AUTOCOMPLETE: "+ JSON.stringify(mijnMap.locatie,null,2));
        });
    }
    function addMarkers(namen) {
        console.log(namen);
        console.log(mijnMap.map);
        // Indien er een cirkel aanwezig is, deze eerst verwijderen voor we de nieuwe tekenen
        // Hetzelfde voor de markers van de Parkings!
        if(cityCircle!=null){
            cityCircle.setMap(null);
            DeleteMarkers();
        }

        console.log(markers);
        var icon = {
            url: "./afbeeldingen/parkingicon.png",
            scaledSize: new google.maps.Size(25, 25)
        };

        cityCircle = new google.maps.Circle({
            strokeColor: '#336799',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#66cdcc',
            fillOpacity: 0.20,
            map: mijnMap.map,
            center: mijnMap.locatie,
            radius: 500
        });

        var infowindow = new google.maps.InfoWindow();

        for (var i = 0; i < namen.length; i++) {
            console.log(namen[i].lat);
            var latLng = new google.maps.LatLng(namen[i].lat,namen[i].lng);
            plaatsenMarker = new google.maps.Marker({
                position: latLng,
                animation: google.maps.Animation.DROP,
                map: mijnMap.map,
                icon: icon,
            })

            google.maps.event.addListener(plaatsenMarker, 'click', (function (plaatsenMarker, i) {
                return function () {
                    var html='<strong>'+namen[i].name+'</strong><br/>'+namen[i].adress;
                    infowindow.setContent(html);
                    infowindow.open(mijnMap.map, plaatsenMarker);
                }
            })(plaatsenMarker, i));
            markers.push(plaatsenMarker);
        }
    }
    
    function DeleteMarkers() {
        // Loop door alle markers en verwijder deze
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    };

    function geocodeLatLng(geocoder,lat,lng) {
        var latlng = {lat: lat, lng: lng};
        geocoder.geocode({'location': latlng}, function(results, status) {
            console.log(status)
            console.log(results)
            if (status === 'OK') {
                if (results[0]) {
                    locatiemarker = new google.maps.Marker({
                        position: latlng,
                        map: mijnMap.map
                    });
                    document.getElementById("mapSearch").value = results[0].formatted_address;
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }
    return {
        mijnMap: mijnMap,
        initMap: initMap,
        addMarkers: addMarkers,
        geocodeLatLng: geocodeLatLng
    };
}()