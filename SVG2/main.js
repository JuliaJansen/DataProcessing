/* main.js
 *
 * Julia Jansen
 * Data Processing
 */

document = "svg.html"; 

/* get json data from html */
var text = document.getElementById('json').textContent;
var data = JSON.parse(text);

var test = document.getElementById("ge");
// var country = test.getElementById("sd")
console.log(test);

    // //it's important to add an load event listener to the object, as it will load the svg doc asynchronously
    // test.addEventListener("load", function() {

    // 	// get the inner DOM of the svg
    //     var svgDoc = test.contentDocument; 

    //     //get the inner element by id
    //     var country = svgDoc.getElementById("fr"); 
    //     country.setAttribute("fill", "#3366ff");
    // }, true);


// for (var i = 0; i < data.points.length; i++) {
// 	if (data.points[i].urban_pop < 30) {
// 		console.log(data.points[i].code);
// 		changeColor(String(data.points[i].code), "#ffffd4");
// 	}
// 	else if (data.points[i].urban_pop < 48) {
// 		changeColor(String(data.points[i].code), "#fed98e");
// 	}
// 	else if (data.points[i].urban_pop < 65) {
// 		changeColor(String(data.points[i].code), "#fe9929");
// 	}
// 	else if (data.points[i].urban_pop < 83) {
// 		changeColor(String(data.points[i].code), "#d95f0e");
// 	}
// 	else if (data.points[i].urban_pop < 100) {
// 		changeColor(String(data.points[i].code), "#993404");
// 	}
// 	else {
// 		console.log("meeeeh");
// 	}
// }

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
	if (document.getElementById(id) != null) {
		console.log("in changeColor");
		var country = document.getElementById(id);
		country.setAttribute("fill", color);
	}	
}

