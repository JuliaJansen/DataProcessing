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
		var margin = {top: 20, right: 10, bottom: 30, left: 70};

		// width of chart and height of bars
		var width = 1000 - margin.left - margin.right, 
			height = margin.top + 500,
			barwidth = width / data.length;

		// define how to scale the bars
		var x = d3.scale.linear()
			.domain(data)
			.range([0, data.length * barwidth]);

    	// define scale of y-ax
		var y = d3.scale.linear()
			.domain([0, 0.55])
    		.range([500, 0]);

    	// x-axis
    	var xAxis = d3.svg.axis()
    		.scale(x)
   	 		.orient("top")

   	 	var yAxis = d3.svg.axis()
   	 		.scale(y)
    		.orient("left")
    		.ticks(10, "%");

    	// make tooltip
  		var div = d3.select("body").append("div")	
    		.attr("class", "tooltip")				
    		.style("visibility", "hidden");

    	// select chart
		var chart = d3.select(".chart")
			.attr("position", "center")
		    .attr("width", width + margin.left) 
		    .attr("height", height + margin.top)
		  .append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    	// add a g element for each data point
		var bar = chart.selectAll("g")
    		.data(data)
		  .enter().append("g")
    		.attr("transform", function(d, i) { return "translate(" + i * barwidth + ", 0)"; });

    	console.log("data ", data);
    	
		// add a blue bar for each data point
		bar.append("rect")
			.attr("y", function(d, i) { return y(0.01 * d.percentage) })
	  		.attr("width", barwidth - 4) // function(d) { return x(0.01 * d.percentage) })
			.attr("height", function(d) { return height - y(0.01 * d.percentage) - margin.top })
			.on("mouseover", function(d) { 

					// tooltip should appear at mouse position
					d3.select(this).style("fill",  "#e68a00");
					div.style("visibility", "visible");
					var num = 1 * d.percentage;
					country = d.country;
					div.html(d.country + ":<br>" + num.toFixed(2) + "%")
					   .style("height", function(d) { 
					   		if (country.search(" ") > 0) {
					   			return "45px";
					   		}
					   	})
					   .style("left", (d3.event.pageX) + "px")
					   .style("top", (d3.event.pageY - 28) + "px");
				})
			.on("mouseout", function(d) { d3.select(this).style("fill", "#009999") });

		// append country names
	    bar.append("text")
	    	.attr("id", "country")
	    	.attr("y", 5)
	    	.attr("x", -height + margin.top + 8)
	    	.attr("dy", ".75em")
	    	.attr("transform", "rotate(-90)")
	    	.text(function(d) { return d.country })
	    	.style("text-anchor", "start" );

		// add x axis
		chart.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + (height - margin.top) + ")")
		    .call(xAxis)
		  .append("text")
    		.attr("y", 8)
    		.attr("x", 10)
    		.attr("dy", ".71em")
    		.style("text-anchor", "start")
    		.text("http://data.worldbank.org/indicator/EN.URB.LCTY.UR.ZS");

		// add y axis
		chart.append("g")
      		.attr("class", "y axis")
      		.call(yAxis)
      	  .append("text")
    		.attr("y", -18)
    		.attr("x", -65)
    		.style("font-weight", "bold")
    		.attr("dy", ".71em")
    		.style("text-anchor", "start")
    		.text("Percentage");
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