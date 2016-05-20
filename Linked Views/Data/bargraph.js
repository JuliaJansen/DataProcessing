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