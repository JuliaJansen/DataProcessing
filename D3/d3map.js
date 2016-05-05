/* d3map.js
 *
 * Julia Jansen
 * Data Processing
 */

document = "d3map.html"; 

window.onload = function() {

	// load json with d3
	var json = "pop_in_largest_city_2014.json";

	d3.json(json, function (data) {

		// save data in temporary array
		var temp = data.points;
		var data = {};

		// reformat data into list with objects
		temp.forEach(function(d) {
			d.code = d.code;
			d.percentage = +d.percentage;
			var num = d.percentage;
			d.percentage = num.toFixed(2);
			d.country = d.country;

			// use country code as index
			data[d.code] = {
				fillKey : value(d.percentage),
				percentage : d.percentage,
				country : d.country
			}
    	});

		// define properties of map
	    var map = new Datamap({
			element: document.getElementById('container1'),
			fills: {
				"> 90%": '#005a32', 
	            "90 - 68%": '#238443',
	            "67 - 45%": '#78c679',
	            "44 - 21%": '#d9f0a3',
	            "20 - 0%": '#f7fcb9',
	            UNKNOWN: '#e6e6e6',
	            defaultFill: '#e6e6e6'
	        },
	        data: data,
	        geographyConfig: {

	        	// show info at mouseover event in tooltip
            	popupTemplate: function(geo, data) { 
            		if (data.percentage > 0) {
		            	return ['<div class="hoverinfo"><strong>' + data.percentage,
		                    '% of ' + geo.properties.name,
		                    ' lives in de biggest city',
		                    '</strong></div>'].join('');
		            } else {
		            	return ['<div class="hoverinfo"><strong>', 'no data of ' +
		            		geo.properties.name,
		            		'</strong></div>'].join('');
		            }
            	},

            	// change fillcolors of countries to highlight on mouseover
		        popupOnHover: true, 
		        highlightOnHover: true,
		        highlightFillColor: '#fdae6b', 
		        highlightOpacity: 0.4,
		        highlightBorderColor: '#fd8d3c',
		        highlightBorderWidth: 2.8,
		        highlightBorderOpacity: 0.5
	    	}        
		});

		// Draw a legend for this map
		map.legend();
	});
}

// function returns value category as string
function value(percentage)
{ 
	if (percentage > 90) {
		return "> 90%";
	} else if (percentage > 70) {
		return "90 - 68%";
	} else if (percentage > 40) {
		return "67 - 45%";
	} else if (percentage > 20) {
		return "44 - 21%";
	} else if (percentage > 0) {
		return "20 - 0%";
	} else {
		return "UNKNOWN";
	}
}