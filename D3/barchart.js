/* barchart.js
 *
 * Julia Jansen
 * Data Processing
 */

document = "barchart.html"; 

window.onload = function() {

	// load json with d3
	var json = "pop_in_largest_city_2014.json";
	d3.json(json, function(d) {

		// log json data
		console.log(d);
	});
}
