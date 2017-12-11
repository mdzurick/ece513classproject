$(document).ready(function() {
    $('select').material_select();
    console.log("localStorage"+window.localStorage.getItem('token'));

    $("#cardTitle2").html(window.localStorage.getItem('token'));
        $("#dtBox").DateTimePicker();
        
});

ajaxGetRequest();
// ajaxGetRequest2();


/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

/* Make an AJAX GET call to server to get all sensor readings */
function ajaxGetRequest() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", responseReceivedHandler);
    xhr.responseType = "json";        
//xhr.open("GET", "http://ec2-13-59-3-196.us-east-2.compute.amazonaws.com:3000/sensordata/");
    
   xhr.open("GET", "/sensordata/");
   xhr.setRequestHeader("X-Auth", window.localStorage.getItem('token'));
   xhr.send();
}

/* Make an AJAX GET call to server to get all sunscreen info*/
function ajaxGetRequest2() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", responseReceivedHandler2);
    xhr.responseType = "json"; 
    xhr.open("GET", "/spfvalues/");
    xhr.setRequestHeader("X-Auth", window.localStorage.getItem('token'));
    xhr.send();
}

/* Generate Chart from sensor data retrieved from database */
function responseReceivedHandler() {
   if (this.status === 200) {
       var JSONArray = this.response;

       var chartData = []; 
      
       for (var item of JSONArray) {

	

	   chartData.push({
	       date: new Date(item.measuredTime * 1000),
		//date: new Date(item.measuredTime),
	       UV: item.UV,
		 lat: item.latitude,
		 lon: item.longitude
	   });
     }

       //Generate chart
       generateChart(chartData);
      
   } else {
      console.log("No data available.")
   }
}

/* Generate Chart from spf values retrieved from database */
function responseReceivedHandler2() {
   if (this.status === 200) {
       var JSONArray2 = this.response;

       for (var item of JSONArray2) {

	var chartData2 = [];

	   chartData2.push({
	       spf: item.strength,
	       date: item.firstApplied
	   });
//var tableDate = new Date(item.measuredTime * 1000);
//document.getElementById("tablediv").innerHTML += "<tr><td>" //tableDate+ "</td><td>" + item.UV+ "</td><td>" +item.latitude+ //"</td><td>" + item.longitude + "</td>";
       }

       //Generate chart
       generateChart(chartData2);
      
   } else {
      console.log("No data available.")
   }
}


function generateChart(chartData) {
    var chart = AmCharts.makeChart("chartdiv", {
	"type": "serial",
	"theme": "light",
	"marginRight": 80,
	"autoMarginOffset": 20,
	"marginTop": 7,
	"dataProvider": chartData,
	"valueAxes": [{
            "axisAlpha": 0.2,
            "dashLength": 1,
            "position": "left"
	}],
	"mouseWheelZoomEnabled": true,
	"graphs": [{
            "id": "g1",
            "balloonText": "UV:[[UV]]<br/>Lat:[[lat]]<br/> Lon:[[lon]]",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColorField": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "red line",
            "valueField": "UV",
            "useLineColorForBulletBorder": true,
            "balloon":{
		"drop":true
            }
	}],
	"chartScrollbar": {
            "autoGridCount": true,
            "graph": "g1",
            "scrollbarHeight": 40
	},
	"chartCursor": {
	    "limitToGraph":"g1"
	},
	"categoryField": "date",
	"categoryAxis": {
            "parseDates": true,
		 "minPeriod": "ss",
            "axisColor": "#DADADA",
            "dashLength": 1,
            "minorGridEnabled": true
	},
	"export": {
            "enabled": true
	}
    });

    chart.addListener("rendered", zoomChart(chart));
    zoomChart(chart);
}

function generateChart2(chartData2) {
 
    var chart = AmCharts.makeChart("chartdiv2", {
	"type": "serial",
	"theme": "light",
	"marginRight": 80,
	"autoMarginOffset": 20,
	"marginTop": 7,
	"dataProvider": chartData2,
	"valueAxes": [{
            "axisAlpha": 0.2,
            "dashLength": 1,
            "position": "left"
	}],
	"mouseWheelZoomEnabled": true,
	"graphs": [{
            "id": "g1",
            "balloonText": "UV:",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColorField": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "red line",
            "valueField": "UV",
            "useLineColorForBulletBorder": true,
            "balloon":{
		"drop":true
            }
	}],
	"chartScrollbar": {
            "autoGridCount": true,
            "graph": "g1",
            "scrollbarHeight": 40
	},
	"chartCursor": {
	    "limitToGraph":"g1"
	},
	"categoryField": "date",
	"categoryAxis": {
            "parseDates": true,
		 "minPeriod": "ss",
            "axisColor": "#DADADA",
            "dashLength": 1,
            "minorGridEnabled": true
	},
	"export": {
            "enabled": true
	}
    });

    chart.addListener("rendered", zoomChart(chart));
    zoomChart(chart);
}

// this method is called when chart is first initialized as we listen for "rendered" event
function zoomChart(chart) {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
}

//posts sunscreen data
    // $("#submit").click(function(){
    //   var strength = $("#strength").val();
    //   var firstApplied = $("#firstApplied").val();
    //   var token = window.localStorage.getItem("token");
   
    // $.post("http://ec2-13-59-3-196.us-east-2.compute.amazonaws.com:3000/sunscreen/",
    // {
    //     strength: strength,
    //     firstApplied: firstApplied
    // },
    //     function(data, status){
    //     alert("Data: " + data + "\nStatus: " + status);
    //     if (status === "201"){
    //         location.href = 'home.html';
    //     }
    //     });
    // });

/* Make an AJAX Post call to submit sunscreen info*/
$("#submit").click(function(){
            var strength = $(".strength").val();
            var firstApplied = $("#firstApplied").val();
    		var xhr = new XMLHttpRequest();
    		xhr.addEventListener("load", function() {
    		    if (this.status == 201) {
    		    } 
    		    else {
    			    $("#error").html(this.response.error).show();
    		    }
    		    
    			});
    		xhr.responseType = "json";
    		xhr.open("POST", "/spfvalues");
    		xhr.setRequestHeader("Content-type", "application/json");
    		xhr.setRequestHeader("X-Auth", window.localStorage.getItem("token"));
            
   			xhr.send(JSON.stringify({ strength: strength, firstApplied: firstApplied}));
});


