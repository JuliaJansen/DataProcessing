/* main.js
 *
 * Julia Jansen
 * Data Processing
 */

document = "svg2.html"; 

window.onload = function() {

	// get json data from html 
	var text = document.getElementById('json').textContent;
	var data = JSON.parse(text);

	// iterate over data and asign right color to countries
	for (var i = 0; i < data.points.length; i++) {
		if (data.points[i].urban_pop < 25) {
			changeColor(data.points[i].code, "#ffffd4");
		}
		else if (data.points[i].urban_pop < 38) {
			changeColor(data.points[i].code, "#fee391")
		}
		else if (data.points[i].urban_pop < 51) {
			changeColor(data.points[i].code, "#fec44f");
		}
		else if (data.points[i].urban_pop < 64) {
			changeColor(data.points[i].code, "#fe9929");
		}
		else if (data.points[i].urban_pop < 77) {
			changeColor(data.points[i].code, "#ec7014");
		}
		else if (data.points[i].urban_pop < 89) {
			changeColor(data.points[i].code, "#cc4c02");
			console.log(data.points[i].country);
		}
		else if (data.points[i].urban_pop < 101) {
			changeColor(data.points[i].code, "#8c2d04");
		}
	}	
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {

	// get country by id
	country = document.getElementById(id)
	if (country != null) {

		// set color
		country.style.fill = color;

		// get country's subcountries
		var countries = country.getElementsByTagName("path");
		if (countries != null) {

			// set color
			for (var i = 0; i < countries.length; i++) {
				if (countries[i] != null) {
					countries[i].style.fill = color;
				}
			}
		}
	}	
}


