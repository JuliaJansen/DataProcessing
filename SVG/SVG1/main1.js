/* main.js
 *
 * Julia Jansen
 * Data Processing
 */

document = "svg1.html"; 

/* use this to test out your function */
window.onload = function() {
 	changeColor("swe", "#ace600");
 	changeColor("gb", "#00cc66");
 	changeColor("at", "#00664d");
 	changeColor("esp", "#86b300")
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {	
	var country = document.getElementById(id);
	country.setAttribute("fill", color);
	console.log(country);
}