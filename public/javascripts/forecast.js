getWeatherData();
/*      // Get the zip from the form
       var zip = $("#zip").val();
       var city = $("#city").val();
       var state = $("#state").val();
   
$(function() { 
$("#icon").show();
var curIcon = "r01d";
var curDescription = "Light rain";
var curTemp = 74;
var curUV = 3.2;
var curDate = "12-8-17 8:32:15";

var iconString = "<img src='https://www.weatherbit.io/static/img/icons/"+curIcon+".png'><div>"+curDescription+"</div>";
$("#icon").html(iconString);
// var dataString = "<div>"+curDescription+"</div><div>Temperature: "+curTemp+"</div><div>UV: "+curUV+"</div>";
// $("#icon").append(dataString);
$("#temp").html("Temperature: "+curTemp);
$("#uv").html("UV Index: "+curUV);

}); */


$("#zipSubmit").on("click", function(){
    zip = $("#zip").val();
    //console.log(zip);
    getWeatherData();
}); 

function getWeatherData() {
    var zip = $("#zip").val();
    var zipcode = zip;
    //console.log(zipcode);
    var country = "US";
    var units = "I";
    var apikey = "b968e552d1cf48d2b1a9176de5f33a78";
    
    $.ajax({
        url: "https://api.weatherbit.io/v2.0/forecast/3hourly",
        jsonp: "callback", 
        dataType: "jsonp",
        data: { postal_code: zipcode, country: country, units: units, key: apikey}
    }).done(function(data) {
        //$("#zip").html(zip); 
        var txt = "";
        for (var i=0; i < data.data.length; i++){
            var split = (data.data[i].datetime).split(":", 2);
            var date = split[0];
            var hours = split[1];
            //console.log(hours);
            txt += "<tr><td>" + date +" " + hours + ":00:00" + "</td><td>" + data.data[i].temp + "</td><td>" + data.data[i].uv + "</td></tr>";
        }
        $("#tempTable").find('tbody').empty();
        $("#tempTable").find('tbody').append(txt);
        //$("#temp").html("Temperature: "+ data.data[0].temp + " F");
        //$("#uv").html("UV Index: "+ data.data[0].uv);
        //console.log(data.data[0].temp);
    }).fail(function(jqXHR){
        $("#error").html("Error retrieving data.");
    })
}

/* GET the user status and list of devices 
function sendReqForForecast() {
    $.ajax({
        url: '/forecast',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("token") },
        responseType: 'json',
        success: statusResponse,
        error: function(jqXHR, status, error) {
            if (status === 401) {
                //window.localStorage.removeItem("token");
               // window.location = "login.html";
            }
            else {
                $("#error").html("Error: " + error);
                $("#error").show();
            }
        }
    });
} */