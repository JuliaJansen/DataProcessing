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
			"date": +d.Year, 
			"code": code
		});
	});

	// reformat datam use landcode as key
	var countryopinions = d3.nest() 
		.key(function(d) { return d.code; })
		.entries(countryopin);

	// drawGraph(countryopinions, "Netherlands");
	// barGraph(footcapita, "NLD");


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
		    data: footcountry,
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
			},
			done: function(datamap) {
		        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
		        		d3.selectAll('#barchart').style("visibility", "visible");
		        		d3.selectAll('#scatterplot').style("visibility", "visible");
		            	drawGraph(countryopinions, geography.id);
		            	barGraph(footcapita, geography.id);
		       	});  
		    },     
		});
	
	// Draw a legend for this map
	map.legend();

	function drawGraph(alldata, code) {

		// reformat data for particular graph
		graphdata = [];

		alldata.forEach(function(d) {
			if (d.key == code) { 
				var e = d.values;
				e.forEach(function(b) {
					graphdata.push({"date": b.date, "value": b.value, "country": b.country});
				})
			}
		});

		// set margins
		var margin = {top: 15, right: 25, bottom: 35, left: 40},
			width = 335,
			height = 250;

		// define x and y scale
		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], 1);

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
		var div = d3.select("#scatterplot").append("div")	
			.attr("class", "tooltip")		
			.attr("id", "tipsy")		
			.style("visibility", "hidden");

		// remove old svg to redraw
		d3.select("#opinions").remove();

		// select dom element to attach svg
		var svg = d3.select("#scatterplot").append("svg")
			.attr("id", "opinions")
			.attr("width", 400)
			.attr("height", 300)
		  .append("g")
		  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// define domain
		x.domain([2012, 2013, 2014, 2015, 2016])
		y.domain([
		    d3.min(alldata, function(d) { return d3.min(d.values, function(c) { return c.value }); }),
		    d3.max(alldata, function(d) { return d3.max(d.values, function(c) { return c.value }); })
		]);

		// add X axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
		  .append("text")
			.attr("x", 300)
			.attr("y", 20)
			.attr("dy", ".71em")
			.style("text-anchor", "start")
			.text("Year");

		// add y axis
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		  .append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -35)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Pollution Index");

		legend = svg.selectAll('.graphtitle')
	      	.data(graphdata);

	    var legendEnter = legend
	        .enter()
	        .append('g')
	        .attr('class', 'legend')
	        .attr('id', function(d){ return code; });

		//add the legend text
	    legendEnter.append('text')
	        .attr('x', width - 110)
	        .attr('y', height - 230)
	        .text(function(d){ name = d.country; return name.toUpperCase(); });

		// append a g for the country
		var country = svg.selectAll(".country")
		    .data(graphdata)
		  .enter().append("g")
		    .attr("class", "country");

		// Add the scatterplot
		country.selectAll("circle")
			.data(graphdata)
		  .enter().append("circle")
			.attr("class", "circle")
		  	.attr("id", function(d) { return "c" + d.key })
		    .attr("r", "4.5")
		    .attr("cx", function(d) { return x(d.date); }) //console.log("yes", x(d.date)); 
		    .attr("cy", function(d) { return y(d.value); })
		    .style("stroke", function(d) { return circlecolor(d.value); })
		    .on("mouseover", function(d) {
		    	d3.select(this).style("r", "5.5")
		    		.style("fill", function(d) { return circlecolor(d.value) })
		    	div.style("visibility", "visible");
				div.html(d.value)
					.style("left", (d3.event.pageX) + "px")		
                	.style("top", d3.event.pageY - 40 + "px");
		    })
		    .on("mouseout", function(d) {
		    	d3.select(this).style("r", "4.5")
		    		.style("fill", "#f2f2f2");
		    });

		// draw legend
		// d3.legend;
	}

	function barGraph(footdata, code) {
		
		console.log("code = ", code);

		// reformat data for particular graph
		var bardata = [
			{"forest": givevalue(footdata[code].forestproduct)}, 
			{"fish": givevalue(footdata[code].fish)}, 
			{"cropland": givevalue(footdata[code].cropland)}, 
			{"buildup": givevalue(footdata[code].buildup)},
			{"carbon": givevalue(footdata[code].carbon)},
			{"grazing": givevalue(footdata[code].grazing)}
		];

		console.log("bardata = ", bardata);

		// set margins, width and height
		var margin = {top: 15, right: 25, bottom: 35, left: 40},
			width = 335,
			height = 250,
			barwidth = 50;

		// define how to scale the bars
		var x = d3.scale.linear()
			.domain(bardata)
			.range([0, bardata.length * barwidth]); //RoundBands([0, width],1);

		// define scale of y-ax
		var y = d3.scale.linear()
			.domain(bardata)
			.range([height, 0]);

		// x-axis
		var xAxis = d3.svg.axis()
			.scale(x)
		 	.orient("top")

		// Y-axis
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(0.2, "gh");

		// make tooltip
		var div = d3.select("#barchart").append("div")	
			.attr("class", "tooltip")				
			.style("visibility", "hidden");

		// select chart
		var chart = d3.select("#barchart")
			.attr("class", "chart")
			.attr("position", "center")
		    .attr("width", width + margin.left) 
		    .attr("height", height + margin.top)
		  .append("g")
		  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// add x axis
		chart.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + (height - margin.top) + ")")
		    .call(xAxis)
		  .append("text")
			.attr("y", 8)
			.attr("x", 10)
			.attr("dy", ".71em")
			.style("text-anchor", "start");

		// add y axis
		chart.append("g")
	  		.attr("class", "y axis")
	  		.call(yAxis)
	  	  .append("text")
			.attr("y", -10)
			.attr("x", -55)
			.style("font-weight", "bold")
			.attr("dy", ".71em")
			.style("text-anchor", "start")
			.text("Global Hectares per Capita");

		// add a g element for each data point
		var bar = chart.selectAll("g")
			.data(bardata)
		  .enter().append("g")
		  	.attr("transform", function(d, i) {
		  		return "translate(" + (i * barwidth) + ",0)"
		  	});

		bar.append('rect')
			.attr("y", function(d) { return y(d.value) })
			.attr("x", function(d) { return i * barwidth; })
			.attr("width", barwidth - 10)
			.attr("height", function(d) { return height - y(d.value); });

		// append label of ecological footprint specified
	    bar.append("text")
	    	.attr("id", "specified")
	    	.attr("y", 5)
	    	.attr("x", -height + 8)
	    	.attr("dy", ".75em")
	    	.attr("transform", "rotate(-90)")
	    	.text(function(d) { return d.key })
	    	.style("text-anchor", "start" );
	}

	// change color button on mouseover and update data  
	var capbutton = d3.select("#capita")
		.on("click", function() {
			console.log("capita");
			map.updateChoropleth(footcapita);
		})
		.on("mouseover", function() { 
			// tooltip should appear at mouse position
			d3.select(this).style("background",  "#cccccc")
				.style("color", "white");
		})
		.on("mouseout", function() {
			d3.select(this).style("background",  "#f2f2f2")
				.style("color", "black");
		});

	// change color button on mouseover and update data    
	var counbutton = d3.select("#country")
		.on("click", function() {
			console.log("countrycapita");
			map.updateChoropleth(footcountry);
		})
		.on("mouseover", function() { 
			// tooltip should appear at mouse position
			d3.select(this).style("background",  "#cccccc")
				.style("color", "white");
		})
		.on("mouseout", function() {
			d3.select(this).style("background",  "#f2f2f2")
				.style("color", "black");
		});
}

/* 
 * Returns color for pollution index value.
 */
function circlecolor(value) {
	if (value < 25) {
		return "#26D900";
	} else if (value < 50) {
		return "#669900";
	} else if (value < 75) {
		return "#8C7300";
	} else if (value > 74) {
		return "#B24C00;"
	} else if (value > 100) {
		return "#F20D00";
	} else {
		return "#F2FAF2";
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

function givevalue(value) {
	if (isNaN(value)) {
		console.log("in NaN value", value);
		return 0;
	} else {
		return value;
	}
}