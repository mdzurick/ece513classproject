$(document).ready(function() {
    $('select').material_select();
});

//TODO: Function that will GET data from the server
//TODO: Parse the data, and display it - maybe in a tabular format for Nov 19 due date?

ajaxGetRequest();


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
    xhr.open("GET", "http://ec2-13-59-3-196.us-east-2.compute.amazonaws.com:3000/sensordata/");
    xhr.send();
}

/* Generate Chart from data retrieved from database */
function responseReceivedHandler() {
   if (this.status === 200) {
       var JSONArray = this.response;

       chartData = []; 
      
       for (var item of JSONArray) {

	

	   chartData.push({
	       date: new Date(item.measuredTime * 1000),
		//date: new Date(item.measuredTime),
	       visits: item.UV
	   });
//var tableDate = new Date(item.measuredTime * 1000);
//document.getElementById("tablediv").innerHTML += "<tr><td>" +tableDate+ "</td><td>" + item.UV+ "</td><td>" +item.latitude+ "</td><td>" + item.longitude + "</td>";
       }

//measured time in sec convert to ms for date constructor

       //Generate chart
       generateChart(chartData);
      
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
            "balloonText": "[[value]]",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "red line",
            "valueField": "visits",
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
