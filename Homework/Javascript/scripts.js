/**
 * scripts.js
 *
 * Data Processing
 * 
 * Julia Jansen
 *
 * Global JavaScript.
 */

document = "temperature.html";

// get plaintext of element
var get_data = document.getElementById("rawdata").textContent;
    
// split text into seperate lines
var data = get_data.split("\n");
var dates = [];
var temps = [];

// loop over data array
for (var i = 0; i < data.length; i++) {
    var datapoint = data[i].split(",");
    var parts = datapoint[0].split('/');
    
    // save dates in one array and temps in another
    dates[i] = new Date(parts[0], parts[1], parts[2]);
    temps[i] = Number(datapoint[1]); 
}

// calculate days since 1992, Jan, 01
// day = hours*minutes*seconds*milliseconds
var oneDay = 24 * 60 * 60 * 1000; 
var firstDate = new Date(1992,01,01);

// save values for days in array
var days = [];
for (i = 0; i < data.length - 1; i++) {
    days[i] = Math.round(Math.abs((dates[i].getTime() - 
    firstDate.getTime())/oneDay));
}


/**
 * Create function to transform data into x and y values.
 */
function createTransform(range, domain) {
    var alpha;
    var beta;
    // range[0] = alpha * domain[0] + beta;
    // range[1] = alpha * domain[1] + beta;

 	// Implement your solution here:
	alpha = (range[1] - range[0]) / (domain[1] - domain[0]);
    beta = range[0] - domain[0]*alpha;

    return function(x){
	    return alpha * x + beta;
    };
}

// returns coordinates for temp or day
transform_y = createTransform([50, 450], [300, -200]);
transform_x = createTransform([50, 750], [0, 366]);

// get day or temp from coordinate
transform_reverse_x = createTransform([0, 366], [50, 750]);
transform_reverse_y = createTransform([300, -200], [50, 450]);

/**
 * Draw the graph on the canvas
 */
function draw() {
    
    // get canvas element
    var canvas = document.getElementById('graph');
    
    // months for pretty printing
    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
    
        ctx.beginPath();
        
        // draw y-ax
        ctx.moveTo(50, 50);
        ctx.lineTo(50, 450);
        for (var i = 0; i < 11; i++) {
            ctx.moveTo(50, 50 + i * 40);
            ctx.lineTo(45, 50 + i * 40);
        }
        
        // draw x-ax
        ctx.moveTo(50, 450);
        ctx.lineTo(750, 450);
        for (i = 0; i < 12; i++) {
            var x = 50 + i * 63.6364;
            ctx.moveTo(x, 450);
            ctx.lineTo(x, 455);
        }
        
        top.strokeStyle = "#737373";
        ctx.stroke();
        
        // draw y-ax title
        ctx.font = "11px verdana";
        ctx.save();
        ctx.translate(15, 230);
        ctx.rotate((Math.PI/180) * -90);
        ctx.translate(-15, -230);
        ctx.fillStyle = "#000000";
        ctx.fillText("Temperature in degrees Celsius", 15, 230);
        ctx.restore();
    
        // draw numbers y-ax
        ctx.font = "9px helvetica";
        for (i = 0; i < 11; i++) {
            var tp = 30 - i * 5;
            var temp = tp.toString();
            ctx.fillStyle = "#000000";
            ctx.fillText(temp, 29, 52 + i * 40);
        }
        
        // draw months x-ax
        ctx.font = "10px helvetica";
        for (i = 0; i < 12; i++) {
            var month = months[i];
            x = 30 + i * 63.6364;
            
            ctx.save();
            ctx.translate(x, 490);
            ctx.rotate((Math.PI/180) * -45);
            ctx.translate(-x, -490);
            ctx.fillStyle = "#000000";
            ctx.fillText(month, x, 490);
            ctx.restore();
        }
        
        // color below 0 degrees light blue
        ctx.beginPath();
        ctx.rect(50, 290, 700, 160);
        ctx.fillStyle = '#f7f7ff';
        ctx.fill();
        
        // color above 0 light red
        ctx.beginPath();
        ctx.rect(50, 50, 700, 240);
        ctx.fillStyle = '#fff9f9';
        ctx.fill();
        
        // draw title
        ctx.font = "22px verdana";
        ctx.fillStyle = "#404040";
        ctx.fillText("Temperatures in de Bilt, 1992", 420, 35);
        
        // draw reading lines
        ctx.beginPath();
        for (i = 0; i < 10; i++){
            ctx.lineWidth = 0.2;
            ctx.moveTo(50, 50 +i * 40);
            ctx.lineTo(750, 50 +i * 40);
        }
        ctx.strokeStyle = '#cccccc';
        ctx.stroke();
        
        // draw line between data points
        ctx.beginPath();
        ctx.lineWidth = 0.8;
        for (i = 0; i < data.length - 1; i++) {
            var y = transform_y(temps[i]);
            x = transform_x(i);
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    
        // non canvas supported message    
    } else {
        alert("Nothing for you here.");
    }
    
    // make canvas for interactive motion        
    var second_canvas = document.getElementById('top');

    // on mouseover, draw cros-hair
    second_canvas.addEventListener("mousemove", function(event) {

        // return clientX, clientY
        var rect = second_canvas.getBoundingClientRect();
        var x_mouse = event.clientX - rect.left;
        cros_hair(x_mouse);
        tooltip(x_mouse);
    });
    
}
  
/**
 * Cros-hair function
 */
function cros_hair(x) {
    
    // make context to draw and clear
    second_canvas = document.getElementById('top');
    var top = second_canvas.getContext('2d');
    
    // remove old cros-hair
    top.clearRect(0, 0, second_canvas.width, second_canvas.height);
    
    // calculate coordinates cros-hair
    var day = Math.floor(transform_reverse_x(x));
    var y = transform_y(temps[day]);
    temp = transform_reverse_y(y);
    
    // draw cros hair op x
    if (x > 50 && x < 600) {
        top.beginPath();
        top.lineWidth = 0.8;
        top.moveTo(x, 50);
        top.lineTo(x, 450);
        top.moveTo(50, y);
        top.lineTo(750, y);
        top.strokeStyle = "#4d4d4d";
        top.stroke();
        
        // draw circle around cros-hair centre
        top.beginPath();
        top.moveTo(x, y);
        top.arc(x, y, 10, 0, 2 * Math.PI, false);
        top.strokeStyle = 2.0;
        top.strokeStyle = "#990000";
        top.stroke();
    }
}

/**
 * Tooltip function
 */
function tooltip(x) {
    var tooltip =  document.getElementById('tooltip');
}
