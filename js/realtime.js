var Realtime = function () {
    var init = function () {
        realTime()
    }
    var realTime = function () {
        $('#realTimeGent').append(
            '<span style="font-size: 90%"><b>Beschikbaarheid: <span style="color: #e53935">minder dan 10%</span> , ' +
            '<span style="color: #fb8c00">minder dan 25%</span></b></span>'
        );
        $.getJSON('https://datatank.stad.gent/4/mobiliteit/bezettingparkingsrealtime.json' , function(data){
            console.log(data);
            $.each(data, function(){
                var available = this.parkingStatus.availableCapacity;
                var total = this.parkingStatus.totalCapacity;
                var verschil = total - available;
                var percentage = (verschil / total) * 100;
                console.log(percentage);
                if (percentage > 90 )
                {
                    background = "red darken-1";
                }
                else if (percentage > 75)
                {
                    background = "orange darken-1";
                }
                else {
                    background = "green darken-1";
                }
                $('#realTimeGent').append(
                    '<div class="card ' + background + '">' +
                    '<div class="card-content">' +
                    '<span class="card-title" style="color: white">' + this.description + '</span>' +
                    '<p>' + this.address +  '</p>' +
                    '<p><b>Beschikbaar : ' + available + " / " + total +  '</b></p>' +
                    '</div>' +
                    '</div>'
                );
            });
        })
    };
    return {
        init: init,
        realTime: realTime
    };
}()