/**
 * Recursive Circles
 * 
 * Theory:
 * - Basic recursive pattern generation
 * - Simple geometric subdivision
 * - Demonstrates fundamental recursion concepts
 * 
 * Mathematical Concepts:
 * - Self-similarity
 * - Geometric progression
 * - Binary subdivision
 */

const recursiveCircles = (p) => {
  let maxDepth = 5;
  let minRadius = 2;
  
  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.background(255);
    
    // Add mouseMoved handler for depth control
    canvas.mouseMoved(() => {
      if (p.mouseY < p.height - 40) {
        maxDepth = p.map(p.mouseX, 0, p.width, 1, 10);
        p.redraw();
      }
    });
    p.noLoop();
  };
  
  function drawRecursiveCircles(x, y, radius, depth) {
    if (radius < minRadius || depth > maxDepth) return;
    
    // Draw current circle
    p.stroke(0);
    p.strokeWeight(0.5);
    p.noFill();
    p.ellipse(x, y, radius * 2);
    
    // Draw two child circles
    let childRadius = radius * 0.5;
    
    // Left circle
    drawRecursiveCircles(x - radius/2, y, childRadius, depth + 1);
    // Right circle
    drawRecursiveCircles(x + radius/2, y, childRadius, depth + 1);
  }
  
  p.draw = function() {
    p.background(255);
    
    // Draw recursive pattern
    p.push();
    p.translate(p.width/2, p.height/2);
    drawRecursiveCircles(0, 0, 250, 0);
    p.pop();
    
    // Draw controls info
    p.fill(255);
    p.noStroke();
    p.rect(0, p.height - 40, p.width, 40);
    p.fill(0);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
    p.text('Move mouse left/right to change recursion depth (1-10)', 20, p.height - 20);
    p.text(`Depth: ${Math.floor(maxDepth)}`, p.width - 200, p.height - 20);
  };
  
  p.keyPressed = function() {
    if (p.key === 'r' || p.key === 'R') {
      maxDepth = 5;
      p.redraw();
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = recursiveCircles;
}

if (typeof window !== 'undefined') {
  window.recursiveCircles = recursiveCircles;
} 