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
 	var tempdata_irn_2011 = [];
 	var tempdata_irn_2012 = [];

 	// make array with temperature data in Iran in 2010
 	for (var i = 0; i < temporary.length; i++) {
 		if (temporary[i].country_code == "IRN") {
 			if (temporary[i].year == "2010") {
 				temporary[i].month = +temporary[i].month;
 				temporary[i].temperature = +temporary[i].temperature;
 				tempdata_irn_2010.push(temporary[i]);
 			}
 		}
 	}

 	// make array with temperature data in Iran in 2011
 	for (var i = 0; i < temporary.length; i++) {
 		if (temporary[i].country_code == "IRN") {
 			if (temporary[i].year == "2011") {
 				temporary[i].month = +temporary[i].month;
 				temporary[i].temperature = +temporary[i].temperature;
 				tempdata_irn_2011.push(temporary[i]);
 			}
 		}
 	}

 	// make array with temperature data in Iran in 2011
 	for (var i = 0; i < temporary.length; i++) {
 		if (temporary[i].country_code == "IRN") {
 			if (temporary[i].year == "2012") {
 				temporary[i].month = +temporary[i].month;
 				temporary[i].temperature = +temporary[i].temperature;
 				tempdata_irn_2012.push(temporary[i]);
 			}
 		}
 	}

	var margin = {top: 30, right: 30, bottom: 30, left: 50},
    	width = 960 - margin.left - margin.right,
    	height = 500 - margin.top - margin.bottom;

	// var formatDate = d3.time.format("%d-%b-%y");

	var x = d3.scale.linear()
		.domain([1, 12])
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	// make tooltip
  	var div = d3.select("body").append("div")	
    	.attr("class", "tooltip")				
    	.style("visibility", "hidden");

    // draw path of graph
	var line = d3.svg.line()
	    .x(function(d) { return x(d.month); })
	    .y(function(d) { return y(d.temperature); });

	// select dom element to attach svg
	var svg = d3.select("#content").append("svg")
		.attr("width", 960)
		.attr("height", 500)
	  .append("g")
	  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	  	
	x.domain(d3.extent(temporary, function(d) { return d.month; }));
  	y.domain(d3.extent(temporary, function(d) { return d.temperature; }));

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

    // Add line 2010
  	svg.append("path")
  		.datum(tempdata_irn_2010)
        .attr("class", "line")
        .attr("d", line)
        .on("mouseover", function(d) {
			d3.select(this).style("stroke-width", "3.5px")
				.style("stroke", "#0f5741")
	    })
	    .on("mouseout", function(d) {
	    	d3.select(this).style("stroke-width", "1.5px")
	    		.style("stroke", "#1b9e77")
	    });


    // Add the scatterplot 2010
    svg.selectAll("circle")
        .data(tempdata_irn_2010)
      .enter().append("circle")
      	.attr("class", "circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.month); })
        .attr("cy", function(d) { return y(d.temperature); });
    
    // Add line 2011
  	svg.append("path")
  		.datum(tempdata_irn_2011)
        .attr("class", "line")
        .style("stroke", "#d95f02")
        .attr("d", line);

    // Add the scatterplot 2011
    svg.selectAll("circle1")
        .data(tempdata_irn_2011)
      .enter().append("circle")
      	.attr("class", "circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.month); })
        .attr("cy", function(d) { return y(d.temperature); })
        .style("fill", "#d95f02");

    // Add line 2012
  	svg.append("path")
  		.datum(tempdata_irn_2012)
        .attr("class", "line")
        .style("stroke", "#7570b3")
        .attr("d", line);

    // Add the scatterplot 2012
    svg.selectAll("circle2")
        .data(tempdata_irn_2012)
      .enter().append("circle")
      	.attr("class", "circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.month); })
        .attr("cy", function(d) { return y(d.temperature); })
        .style("fill", "#7570b3");

    var focus = svg.append("g")
    	.style("display", "none");

   	var bisectMonth = d3.bisector(function(d) { return d.month; }).left;

	focus.append('line')
        .attr('id', 'focusLineX')
        .attr('class', 'focusLine');
    focus.append("circle")
    	.attr("id", "focusCircle")
    	.attr("r", "4.5")
    	.attr("class", "circle focusCircle");

    // add area to draw on
   	svg.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', function() { focus.style('display', null); })
        .on('mouseout', function() { focus.style('display', 'none'); })
        .on('mousemove', function() { 
        	Xmouse = d3.event.pageX - margin.left;
         	Xvalue = x.invert(d3.event.pageX - margin.left);
            console.log("Xmouse", Xmouse);

            var decimals = Xvalue % 1;
            console.log("decimals = ", decimals);

            // round mouse position to whole number (month)
            if (decimals < 0.5) {
            	var x_focus = Math.floor(Xvalue);
            } else {
            	var x_focus = Math.floor(Xvalue + 1);
            }

            var i = bisectMonth(tempdata_irn_2010, x_focus); // returns the index to the current data item
            var Ydata = tempdata_irn_2010[i].temperature;
            console.log("Ydata = ", Ydata);

            // highlight closest data point 
            focus.select('#focusCircle')
                .attr('cx', x(x_focus))
                .attr('cy', y(Ydata));
            focus.select('#focusLineX')
                .attr('x1', Xmouse)
                .attr('y1', 0)
                .attr('x2', Xmouse)
                .attr('y2', height);
            div.style("visibility", "visible");
				div.html(month(x_focus) + ":<br>" + round(tempdata_irn_2010[i].temperature) + "%")
				   .style("left", x(x_focus) + "px")
				   .style("top", y(Ydata) + "10");
        });

}

/* 
 * Returns month as string for number value 
 */
function month(month) {
	switch(month) {
		case 1:
			return "January"
		case 2:
			return "February"
		case 3:
			return "March"
		case 4: 
			return "April"
		case 5: 
			return "May"
		case 6:
			return "June"
		case 7: 
			return "July"
		case 8:
			return "August"
		case 9:
			return "September"
		case 10: 
			return "October"
		case 11: 
			return "November"
		case 12: 
			return "December"
	}
}

/* 
 * Rounds float to two decimal number
 */
function round(temp) {
	return temp.toFixed(2);
}


/* 
 * Makes data array
 */
function makeDataArray(year, country, temp, array) {
	// make array with temperature data in Iran in 2010
 	for (var i = 0; i < temp.length; i++) {
 		if (temp[i].country_code == country) {
 			if (temp[i].year == "2010") {
 				temp[i].month = +temp[i].month;
 				temp[i].temperature = +temp[i].temperature;
 				array.push(temp[i]);
 			}
 		}
 	}	
	return array;
}

       