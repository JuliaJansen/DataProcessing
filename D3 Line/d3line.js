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

 	var temporary = temp;
 	var tempdata_irn_2010 = [];

 	for (var i = 0; i < temporary.length; i++) {
 		if (temporary[i].country_code == "IRN") {
 			if (temporary[i].year == "2010") {
 				temporary[i].month = +temporary[i].month;
 				temporary[i].temperature = +temporary[i].temperature;
 				tempdata_irn_2010.push(temporary[i]);
 				// console.log(temporary[i]);
 			}
 		}
 	}

 	console.log(tempdata_irn_2010);

	var margin = {top: 30, right: 30, bottom: 30, left: 50},
    	width = 960 - margin.left - margin.right,
    	height = 500 - margin.top - margin.bottom;

	// var formatDate = d3.time.format("%d-%b-%y");

	var x = d3.scale.linear()
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
	    .x(function(d) { return x(d.month); })
	    .y(function(d) { return y(d.temperature); });

	var svg = d3.select("#content").append("svg")
		.attr("width", 960)
		.attr("height", 500)
	  .append("g")
	  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	x.domain(d3.extent(tempdata_irn_2010, function(d) { return d.month; }));
  	y.domain(d3.extent(tempdata_irn_2010, function(d) { return d.temperature; }));

  	// add X axis
    svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	// Add y axis
  	svg.append("g")
    	.attr("class", "y axis")
    	.call(yAxis)
      .append("text")
    	.attr("transform", "rotate(-90)")
		.attr("y", -40)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Average Temperature (Celsius)");

    // Add line
  	svg.append("path")
  		.datum(tempdata_irn_2010)
        .attr("class", "line")
        .attr("d", line);

    // Add the scatterplot
    svg.selectAll("dot")
        .data(tempdata_irn_2010)
      .enter().append("circle")
      	.attr("class", "circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.month); })
        .attr("cy", function(d) { return y(d.temperature); });


}

