/* barchart.js
 *
 * Julia Jansen
 * Data Processing
 */

document = "barchart.html"; 

window.onload = function() {

	// load EU country codes
	var eu = "countrycodesEU.json";
	var eu_codes = [];

	d3.json(eu, function (datum) {

		var codes = datum.points;

		// make array of country codes EU
		for (var i = 0; i < codes.length; i++) {
			eu_codes.push(codes[i].code);
			console.log(eu_codes[i]);
		}
	})

	// load json with d3
	var json = "pop_in_largest_city_2014.json";
	d3.json(json, function (data) {

		var temp = data.points;
		var data = [];

		// use only data points for European countries with information
		for (var i = 0; i < temp.length; i++) {
			if (temp[i].percentage > 0 && in_eu(temp[i].code, eu_codes)) {
				data.push(temp[i]);
			}
		}

		data.sort(function(a, b) {
    		return parseFloat(b.percentage) - parseFloat(a.percentage);
		});

		// margins 
		var margin = {top: 20, right: 30, bottom: 30, left: 30};

		// width of chart and height of bars
		var width = 800 - margin.left - margin.right, 
			height = margin.top + 20 * 159,
			barheight = 20;

		// define how to scale the bars
		var x = d3.scale.linear()
    		.range([0, width - margin.right]);

    	// define scale of y-ax
		var y = d3.scale.linear()
    		.range([height, 0]);

    	// x-axis
    	var xAxis = d3.svg.axis()
    		.scale(x)
   	 		.orient("top")
   	 		.ticks(10, "%");

   	 	var yAxis = d3.svg.axis()
   	 		.scale(y)
    		.orient("left")
    		.ticks(NaN);

    	// make tooltip
  		var div = d3.select("body").append("div")	
    		.attr("class", "tooltip")				
    		.style("visibility", "hidden");

    	// select chart
		var chart = d3.select(".chart")
		    .attr("width", width + margin.left) 
		    .attr("height", height + margin.top)
		  .append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    	// add a g element for each data point
		var bar = chart.selectAll("g")
    		.data(data)
		  .enter().append("g")
    		.attr("transform", function(d, i) { return "translate(0," + i * barheight + ")"; });

		// add a blue bar for each data point
		bar.append("rect")
			.attr("y", function(d, i) { return i })
	  		.attr("width", function(d) { return x(0.01 * d.percentage) })
			.attr("height", barheight - 1)
			.on("mouseover", function(d) { 
					d3.select(this).style("fill",  "#e68a00");
					div.style("visibility", "visible");
					var num = 1 * d.percentage;
					div.html(num.toFixed(2) + "%")
					   .style("left", (d3.event.pageX) + "px")
					   .style("top", (d3.event.pageY - 28) + "px");
				})
			.on("mouseout", function(d) { d3.select(this).style("fill", "#009999") });

		// append country names
	    bar.append("text")
	    	.attr("id", "country")
	    	.attr("x", function(d) { 
	    		if (d.percentage < 15) {
	    			x = 8 * d.percentage;
	    			return x.toFixed(2);
	    		}
	    		else { 
	    			return 6;
	    		}})
	    	.attr("y", function(d, i) { return i + 5; })
	    	.attr("dy", ".75em")
	    	.text(function(d) { return d.country })
	    	.style("fill", function(d) { 
	    		if (d.percentage < 15) {
	    			return "#009999";
	    		}})
	    	.style("text-anchor", "start" );

		// add x axis
		chart.append("g")
		    .attr("class", "x axis")
		    .attr("transform", function(d, i) { return "translate(0," + i * barheight + ")"})
		    .call(xAxis);

		// add y axis
		chart.append("g")
      		.attr("class", "y axis")
      		.call(yAxis)
      	  .append("text")
    		.attr("transform", "rotate(-90)")
    		.attr("y", -15)
    		.attr("x", -40)
    		.attr("dy", ".71em")
    		.style("text-anchor", "start")
    		.text("Country");

	});
};

/* 
 * Function returns true is country is part of the EU,
 * else false. 
 */
function in_eu(value, array) {
	
	for (var i = 0; i < array.length; i++) {
		
		// if code in eu_code list, return true
		if (value == array[i]) {
			return true;
		} 
	}

	// if code not in eu_code list, return false
	return false;
}