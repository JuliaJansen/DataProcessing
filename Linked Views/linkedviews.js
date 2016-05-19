/* linkedviews.js
 *
 * Julia Jansen
 * Data Processing
 */

window.onload = function() {
	// load two datasets asynchronously
	d3_queue.queue()
		.defer(d3.json, 'footprint.json')
		.defer(d3.json, 'opinions.json')
		.await(prepareData);
}

/* 
 * load data, make map 
 */
function prepareData(error, footprint, opinions) {
	// check for errors while loading the page
	if (error) throw error;

	// prepare for data objects
	var footprint = footprint.points;
	var opinions = opinions.points;
	var footcapita = {};
	var footcountry = {};
	var countryopin = [];

	// reformat footprint data into two lists with objects
	for (var i = 0; i < footprint.length; i++) {
		var forestproduct = +footprint[i].ForestProduct;
		var country = footprint[i].Country;
		var fish = +footprint[i].Fish;
		var cropland = +footprint[i].Cropland;
		var footprintcap = +footprint[i].Footprintcapita;
		var buildup = +footprint[i].Buildupland;
		var carbon = +footprint[i].carbon;
		var grazing = +footprint[i].Grazing;
		var population = +footprint[i].Population;
		var num = +footprint[i].Footprintcountry
		var footprintcountry = num.toFixed(3);

		var code = ""
		countries.forEach(function(c) {
			if (c[2] == country) {
				code = c[1];
			} 
		})

		// use country code as index
		footcapita[code] = {
			fillKey : capitavalue(footprintcap),
			footprint : footprintcap,
			forestproduct : forestproduct,
			fish : fish,
			cropland : cropland,
			buildup : buildup,
			carbon : carbon, 
			grazing : grazing,
			population : population,
			country : country
		}

		footcountry[code] = {
			fillKey : countryvalue(footprintcountry),
			footprint : footprintcountry,
			forestproduct : forestproduct,
			fish : fish,
			cropland : cropland,
			buildup : buildup,
			carbon : carbon, 
			grazing : grazing,
			population : population,
			country : country
		}
	}

	// reformat opinions data to make line graph
	opinions.forEach(function(d) {
		var code = "";
		countries.forEach(function(c) {
			if (c[2] == d.Country) {
				code = c[1];
			}
		});

		// fill countryopin array
		countryopin.push({
			"country": d.Country, 
			"value": +d.Pollution, 
			"expvalue": +d.Exp_pollution, 
			"date": +d.Year, 
			"code": code
		});
	});

	// reformat datam use landcode as key
	var countryopinions = d3.nest() 
		.key(function(d) { return d.code; })
		.entries(countryopin);

	var data = footcountry;

	colorMap(data);
	drawGraph(countryopinions, "NLD");

	function colorMap(data) {
		// define properties of map
		var map = new Datamap({
			element: document.getElementById('container1'),
			fills: {
				"8 - 12 gh": '#b30000',
		        "4.5 - 8 gh": '#e34a33',
		        "3.4 - 4.5 gh": '#fc8d59',
		        "1.7 - 3.3 gh": '#fdcc8a',
		        "0- 1.6 gh": '#fef0d9',
		        ">801 M gh": '#a63603',
		        "301 - 800 M gh": '#e6550d',
		        "106 - 300 M gh": '#fd8d3c',
		        "40 - 105 M gh": '#fdbe85',
		        "0 - 39 M gh": '#feedde',
		        UNKNOWN: '#e6e6e6',
		        defaultFill: '#e6e6e6'
		    },
		    data: data,
		    geographyConfig: {

		    	// show info at mouseover event in tooltip
		    	popupTemplate: function(geo, data) { 
		    		if (data.footprint > 0) {
		    			if (data == footcapita) {
		    				return ['<div class="hoverinfo"><strong>' + geo.properties.name,
			                    ':<br>' + data.footprint,
			                    'gh/capita',
			                    '</strong></div>'].join('');
		    			} else {
		    				return ['<div class="hoverinfo"><strong>' + geo.properties.name,
			                    ':<br>' + data.footprint,
			                    'M gh',
			                    '</strong></div>'].join('');
		 				}
		            } else {
		            	return ['<div class="hoverinfo"><strong>', 'no data of ' +
		            		geo.properties.name,
		            		'</strong></div>'].join('');
		            }
		    	},

		    	// change fillcolors of countries to highlight on mouseover
		        popupOnHover: true, 
		        highlightOnHover: true,
		        highlightFillColor: '#004d4d', 
		        highlightOpacity: 0.8,
		        highlightBorderColor: '#f0f9e8',
		        highlightBorderWidth: 2.8,
		        highlightBorderOpacity: 0.5
			}        
		});

		// Draw a legend for this map
		map.legend();

		// force data to update when menu is changed    
		var capita = d3.selectAll("#capita")
			.on("click", function() {
				var data = footcapita;
				recolorMap(map, data);
			});

		var countrybutton = d3.selectAll("#country")
			.on("click", function() {
				var data = footcountry;
				recolorMap(map, data);
			});
	

		function recolorMap(map, data) {
			d3.select(map).remove();
			colorMap(data);
		}
	}

	function drawGraph(data, code) {
		data.forEach(function(d) {
			if (d.key == code) { 
				var c = d.values;
				c.forEach(function(b) {
					console.log(b.date);
				})
			}
		})

		// console.log(data);
		// console.log(data[code]);
		// console.log("data.date", data.date);
		// console.log("data.key", data.key);
		// console.log("data.date", data.date);
		// console.log("data.date", data.date);

		// set margins
		var margin = {top: 30, right: 30, bottom: 30, left: 50},
			width = 400,
			height = 300;

		// define x and y scale
		var x = d3.scale.linear()
			.range([0, width - margin.right]);

		var y = d3.scale.linear()
			.range([height, 0]);

		// define axes
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		// remove old tooltip
		d3.select("#tipsy").remove();

		// make tooltip
		var div = d3.select("#container1").append("div")	
			.attr("class", "tooltip")		
			.attr("id", "tipsy")		
			.style("visibility", "hidden");

		// remove old svg to redraw
		d3.select("#opinions").remove();

		// select dom element to attach svg
		var svg = d3.select("#container1").append("svg")
			.attr("id", "opinions")
			.attr("width", 400)
			.attr("height", 300)
		  .append("g")
		  	.attr("transform", "translate(" + margin.left + "," + margin.right + ")");

		x.domain(d3.extent(data, function(d) { return 2015; }));
		y.domain([
		    d3.min(data, function(d) { return d3.min(d.values, function(c) { return c.value; }); }),
		    d3.max(data, function(d) { return d3.max(d.values, function(c) { return c.value; }); })
		]);

		// add X axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		// add y axis
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		  .append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -40)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Pollution Index");

		// legend = svg.selectAll('.legend')
  //       	.data(country);
    
	 //    var legendEnter = legend
	 //        .enter()
	 //        .append('g')
	 //        .attr('class', 'legend')
	 //        .attr('id', function(d){ return code; });

		// //add the legend text
	 //    legendEnter.append('text')
	 //        .attr('cx', width - 20)
	 //        .attr('cy', height - 50)
	 //        .text(function(d){ return "Pollution Index is based on the opinions of the population"; });

		// append a g for the country
		var country = svg.selectAll(".country")
		    .data(data)
		  .enter().append("g")
		    .attr("class", "country");

		// Add the scatterplot
		country.selectAll("circle")
			.data(data)
		  .enter().append("circle")
			.attr("class", "circle")
		  	.attr("id", function(d) { return "c"+ d.key })
		    .attr("r", "1.5")
		    .attr("cx", function(d) { if (d.key == code) { return x(d.date); }}) //console.log("yes", x(d.date)); 
		    .attr("cy", function(d) { if (d.key == code) { return y(d.value); }})
		    .style("stroke", "#999999");

		// draw legend
		d3.legend;
	}


}


/* 
 * Function returns value category as string.
 */
function capitavalue(footprint)
{ 
	if (footprint > 7.9) {
		return "8 - 12 gh";
	} else if (footprint > 4.4) {
		return "4.5 - 8 gh";
	} else if (footprint > 3.3) {
		return "3.4 - 4.5 gh";
	} else if (footprint > 1.6) {
		return "1.7 - 3.3 gh";
	} else if (footprint > 0) {
		return "0- 1.6 gh";
	} else {
		return "UNKNOWN";
	}
}

/* 
 * Function returns value category as string.
 */
function countryvalue(footprint)
{ 
	if (footprint > 800) {
		return ">801 M gh";
	} else if (footprint > 300) {
		return "301 - 800 M gh";
	} else if (footprint > 105) {
		return "106 - 300 M gh";
	} else if (footprint > 39) {
		return "40 - 105 M gh";
	} else if (footprint > 0) {
		return "0 - 39 M gh";
	} else {
		return "UNKNOWN";
	}
}