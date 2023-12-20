var origin;
var circ;
var circ2;
var Epsilon = 0.001;
var dir;
var max_iterations = 50;
var Gravity = 0.001;
var bend = true;
var show_circles = false;

function setup() {
  createCanvas(1000, 1000);
  circ = new Point(900, 500);
  circ2 = new Point(200, 500);
  origin = new Point(500, 500);
}

function draw() {
  background(0);
  dir = new p5.Vector(mouseX - origin.x, mouseY -  origin.y).normalize();
  const constDir = dir;
  currentPoint = origin;
  var circles_to_draw = []
  var t = sdf_multiple(origin, [{circ: circ, radius: 50}]);
  for (var i = 0; i < max_iterations; i++) {
    circles_to_draw.push({currentPoint, t});
    if (t < Epsilon) {
      stroke(255, 0, 0)
      line(origin.x, origin.y, currentPoint.x, currentPoint.y);
      break;
    }
    if (t > 500) break;
    circles_to_draw.push({currentPoint, t});
    if (bend)
      dir = new p5.Vector(dir.x + (Gravity/t*t) * (circ.x - currentPoint.x), dir.y + (Gravity / t*t) * (circ.y - currentPoint.y)).normalize();
    else 
      dir = constDir;

    currentPoint = new Point(currentPoint.x + t * dir.x, currentPoint.y + t * dir.y);
    t = sdf_multiple(currentPoint, [{circ: circ, radius: 50}]);
  }
  for (var j = 0; j < circles_to_draw.length; j++) {
    fill(0); 
    if (show_circles)
      circle(circles_to_draw[j].currentPoint.x, circles_to_draw[j].currentPoint.y, circles_to_draw[j].t * 2);
    if (j < circles_to_draw.length - 1)
    line(circles_to_draw[j].currentPoint.x, circles_to_draw[j].currentPoint.y, circles_to_draw[j + 1].currentPoint.x, circles_to_draw[j + 1].currentPoint.y);
  }
  fill(255)
  circle(circ.x, circ.y, 100);
  circle(origin.x, origin.y, 5);
  stroke(0, 0, 255);
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  distance(p) {
    var x_c = p.x - this.x;
    var y_c = p.y - this.y;
    return sqrt(x_c * x_c + y_c * y_c);
  }
}

function keyPressed(){
  if (key == ' '){ //this means space bar, since it is a space inside of the single quotes 
    bend = !bend;
  } 
  if (key == "g") {
    show_circles = !show_circles;
  }
  else if (key == "w"){
    Gravity *= 1.001;
  }
  else if (key == "s"){
    Gravity /= 1.001;
  }
  else if (key == "a"){
    max_iterations -= 1;
  }
  else if (key == "d"){
    max_iterations += 1;
  }
}

function sdf_multiple(origin, objects) {
  return Math.min(...objects.map((x) => sdf_circle(origin, x.circ, x.radius)))
}

function sdf_circle(p1, p2, radius) {
  return p1.distance(p2) - radius;
}
