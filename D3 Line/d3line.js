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

/* 
 * load data, make graph 
 */
function makeGraph(error, temp, rain) {
	// check for errors while loading the page
	if (error) throw error;
	
	var temp = temp;
	var rain = rain;

	updateData("temp")

	function updateData(dataset) {

		// set margins
		var margin = {top: 30, right: 30, bottom: 30, left: 50},
			width = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		// define x and y scale
		var x = d3.time.scale()
			.range([0, width]);

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
		var div = d3.select("#content").append("div")	
			.attr("class", "tooltip")		
			.attr("id", "tipsy")		
			.style("visibility", "hidden");

		// draw path of graph
		var line = d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.value); });
		
		if (dataset == "rain") {
			temporary = rain;
		} else if (dataset == "temp") {
			temporary = temp;
		} 	
		data = [];

		var formatDate = d3.time.format("%Y%m");

		for (var i = 0; i < temporary.length; i++) {
			if (+temporary[i].year > 1999) {
		 		date = formatDate.parse(temporary[i].year + temporary[i].month);
		 		data.push({"date": date, "value": +temporary[i].value, "country": temporary[i].country_code});
			}
		}

		// remove ols svg to redraw
		d3.select("#amazing").remove();

		// select dom element to attach svg
		var svg = d3.select("#content").append("svg")
			.attr("id", "amazing")
			.attr("width", 960)
			.attr("height", 500)
		  .append("g")
		  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// reformat data
		var countries = d3.nest() 
			.key(function(d) { return d.country; })
			.entries(data);

		x.domain(d3.extent(data, function(d) { return d.date; }));
		y.domain([
		    d3.min(countries, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
		    d3.max(countries, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
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
			.text(function(d) { 
				if (dataset == "temp") {
					return "Average Temperature/month (Celsius)";
				} else if (dataset == "rain") {
					return "Average Rainfall/month (mm)";
				}});

		var legend = svg.selectAll('.legend')
        	.data(countries);
    
	    var legendEnter = legend
	        .enter()
	        .append('g')
	        .attr('class', 'legend')
	        .attr('id', function(d){ return d.key; });

	    legendEnter.append('circle')
	        .attr('cx', width +20)
	        .attr('cy', function(d){return legendscale(d.values[d.values.length-1].value);})
	        .attr('r', 7)
	        .style('fill', function(d) { 
	        	if (d.key)
	          	return color(d.name);
        });
        	        	
	//add the legend text
    legendEnter.append('text')
        .attr('x', width+35)
        .attr('y', function(d){return legendscale(d.values[d.values.length-1].value);})
        .text(function(d){ return d.name; });

		// append a g for each country
		var country = svg.selectAll(".country")
		    .data(countries)
		  .enter().append("g")
		    .attr("class", "country");

		// add lines
		country.append("path")
		 	.attr("class", "line")
		 	.attr("id", function(d) { return d.key })
		 	.attr("d", function(d) { return line(d.values); })
		 	.on("mouseover", function(d) {
				d3.select(this)
					.style("stroke-width", "2.5px")
			})
			.on("mouseout", function(d) {
				d3.select(this)
					.style("stroke-width", "1.5px")
			});

		// Add the scatterplot
		country.selectAll("circle")
			.data(data)
		  .enter().append("circle")
			.attr("class", "circle")
		  	.attr("id", function(d) { return "c"+ d.key })
		    .attr("r", "1.5")
		    .attr("cx", function(d) { return x(d.date); })
		    .attr("cy", function(d) { return y(d.value); })
		    .style("stroke", "#999999");

		var focus = svg.append("g")
			.style("display", "none");

		focus.append('line')
	        .attr('id', 'focusLineX')
	        .attr('class', 'focusLine');
	    focus.append("circle")
	    	.attr("id", "focusCircle")
	    	.attr("r", "3.0")
	    	.attr("class", "circle focusCircle");

	    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

	    // add area to draw on
	   	svg.append('rect')
	        .attr('class', 'overlay')
	        .attr('width', width)
	        .attr('height', height)
	        .on('mouseover', function() { focus.style('display', null); })
	        .on('mouseout', function() { focus.style('display', 'none'); })
	        .on('mousemove', function() { 

	        	if (dataset == "rain") {
	            	type = "mm"
	            } else {
	            	type = "&#8451"
	            }

			    var x0 = x.invert(d3.mouse(this)[0]),
		        i = bisectDate(data, x0, 1),
		        d0 = data[i - 1].value,
		        d1 = data[i].value,
		        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

	            // highlight closest data point 
	            focus.select('#focusCircle')
	                .attr('cx', x(x0))
	                .attr('cy', y(d0));
	            focus.select('#focusCircle2')
	                .attr('cx', x(x0))
	                .attr('cy', y(d1));
	            focus.select('#focusLineX')
	                .attr('x1', x(x0))
	                .attr('y1', 0)
	                .attr('x2', x(x0))
	                .attr('y2', height);
	            div.style("visibility", "visible");
				div.html(prettydate(data[i].date) + ":<br>" + round(d0) + type)
					.style("left", (d3.event.pageX) + "px")		
                	.style("top", margin.top + 100 + "px");
			});

		d3.legend

		// force data to update when menu is changed    
		var menu = d3.select("#menu select")
    		.on("change", change);

    	var series = menu.property("value");

    	// set terms of transition that will take place
		// when a new economic indicator is chosen   
		function change() {
			console.log("change?", series);
			updateData(series);
		    // d3.transition()
		    //   .duration(1500)
		    //   .each(updateData(series));
		}
	}
}

/* 
 * Returns year and month of date.
 */
function prettydate(date) {
	var monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];

	var month = date.getMonth(); //months from 1-12
	var year = date.getUTCFullYear();

	return monthNames[month] + "<br>" + year;
}

/* 
 * Returns rounded number
 */
function round(num) {
	return num.toFixed(2);
}

