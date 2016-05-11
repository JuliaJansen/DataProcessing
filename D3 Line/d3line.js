/* d3line.js
 *
 * Julia Jansen
 * Data Processing
 */

window.onload = function() {
	// load two datasets asynchronously
	d3_queue.queue()
		.defer(d3.json, 'temp.json')
		.defer(d3.json, 'rain.json')
		.await(makeGraph);
}

function makeGraph(error, temp, rain) {
	// check for errors while loading the page
	if (error) throw error;

 	// save temperature data in array
 	tempdata = temp.points;

	console.log(tempdata);
		

	// 	// round raindata
	// 	var num = +d.temperature;
	// 	d.temp = num.toFixed(2);

	// 	// use country as index
	// 	tempdata.push({
	// 			country: d.country,
	// 			month : d.month,
	// 			temp : d.temp,
	// 			year : d.year
	// 		})
	// })

	// // save rainfall data in array
	// var raintemporary = rain.points;
	// var raindata = {};

	// raintemporary.forEach(function(d) {
	// 	if (d.country_code == 'NLD') {
	// 		d.country = "Netherlands"
	// 	}
	// 	var num = +d.rainfall;
	// 	d.rain = num.toFixed(2);

	// 	// use country as index
	// 	raindata[d.country] = {
	// 			month : d.month,
	// 			rain : d.rain,
	// 			year : d.year
	// 		}
	// })

	var margin = {top: 30, right: 30, bottom: 30, left: 30},
    	width = 960 - margin.left - margin.right,
    	height = 500 - margin.top - margin.bottom;

	var formatDate = d3.time.format("%d-%b-%y");

	var x = d3.time.scale()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var line = d3.svg.line()
	    .x(function(d) { return x(+d.month); })
	    .y(function(d) { return y(+d.temperature); });

	var svg = d3.select("#content").append("svg")
		.attr("width", 960)
		.attr("height", 500)
	  .append("g")
	  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	x.domain(d3.extent(tempdata, function(d) { return d.month; }));
  	y.domain(d3.extent(tempdata, function(d) { return d.temp; }));

  	svg.append("g")
    	.attr("class", "y axis")
    	.call(yAxis)
      .append("text")
    	.attr("transform", "rotate(-90)")
		.attr("y", -15)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Average Temperature (\&\#8451)");

    svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	var year = svg.selectAll(".year")
      	.data(tempdata)
      .enter().append("g")
      	.attr("class", "year");

  	year.append("path")
        .attr("class", "line")
        .attr("d", function(d) { if (d.country_code == "IRN" && d.year == 2010) { console.log(d.country_code); return line; }});

	// year.append("text")
	// 	.datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
	// 	.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
	// 	.attr("x", 3)
	// 	.attr("dy", ".35em")
	// 	.text(function(d) { return d.name; });

}

