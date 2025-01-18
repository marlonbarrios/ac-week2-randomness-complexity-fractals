/**
 * Sierpinski Triangle
 * 
 * Theory:
 * - Named after Wacław Sierpiński (1915)
 * - Self-similar fractal with triangular pattern
 * - Can be generated through multiple methods:
 *   1. Recursive subdivision (deterministic)
 *   2. Chaos game (random)
 *   3. Pascal's triangle modulo 2
 * 
 * Mathematical Properties:
 * - Fractal dimension = log(3)/log(2) ≈ 1.585
 * - Perfect self-similarity
 * - Demonstrates how simple rules create complex patterns
 * 
 * Implementation Methods:
 * - Chaos game: Random midpoint selection
 * - Recursive: Systematic triangle subdivision
 * - Interactive mode switching to compare approaches
 */

const sierpinski = (p) => {
  let points = [];
  let currentPoint;
  let vertices = [];
  let mode = 'chaos';  // 'chaos' or 'recursive'
  let depth = 8;       // Recursion depth
  let isRunning = true;
  
  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.background(255);
    
    // Define triangle vertices
    let h = (p.height - 100) * 0.866; // Height of equilateral triangle
    vertices = [
      p.createVector(p.width/2, 50),                    // Top
      p.createVector(p.width/2 - h/0.866, p.height-50), // Bottom left
      p.createVector(p.width/2 + h/0.866, p.height-50)  // Bottom right
    ];
    
    // Start chaos game with random point
    currentPoint = p.createVector(p.random(p.width), p.random(p.height));
    
    drawTriangle();
  };
  
  function drawTriangle() {
    p.background(255);
    
    if (mode === 'chaos') {
      // Draw main triangle
      p.stroke(0, 50);
      p.noFill();
      p.beginShape();
      for (let v of vertices) {
        p.vertex(v.x, v.y);
      }
      p.endShape(p.CLOSE);
      
      // Draw accumulated points
      p.stroke(0, 40);
      p.strokeWeight(1);
      for (let pt of points) {
        p.point(pt.x, pt.y);
      }
    } else {
      // Draw recursive Sierpinski
      p.stroke(0, 60);
      p.noFill();
      drawSierpinskiRecursive(vertices[0], vertices[1], vertices[2], depth);
    }
    
    // Draw mode and controls
    p.fill(255);
    p.noStroke();
    p.rect(0, 0, p.width, 30);
    p.fill(0);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
    p.text(`Mode: ${mode} (Press M to switch)`, 20, 15);
    p.text('Space to pause, R to reset', p.width - 200, 15);
  }
  
  function drawSierpinskiRecursive(a, b, c, level) {
    if (level === 0) {
      p.triangle(a.x, a.y, b.x, b.y, c.x, c.y);
      return;
    }
    
    // Calculate midpoints
    let ab = p5.Vector.lerp(a, b, 0.5);
    let bc = p5.Vector.lerp(b, c, 0.5);
    let ca = p5.Vector.lerp(c, a, 0.5);
    
    // Recursive calls for three smaller triangles
    drawSierpinskiRecursive(a, ab, ca, level - 1);
    drawSierpinskiRecursive(ab, b, bc, level - 1);
    drawSierpinskiRecursive(ca, bc, c, level - 1);
  }
  
  p.draw = function() {
    if (!isRunning || mode === 'recursive') return;
    
    // Chaos game method
    for (let i = 0; i < 100; i++) {
      let randomVertex = vertices[p.floor(p.random(3))];
      currentPoint.x = p.lerp(currentPoint.x, randomVertex.x, 0.5);
      currentPoint.y = p.lerp(currentPoint.y, randomVertex.y, 0.5);
      points.push(currentPoint.copy());
      
      // Draw new point
      p.stroke(0, 40);
      p.point(currentPoint.x, currentPoint.y);
    }
  };
  
  p.keyPressed = function() {
    if (p.key === ' ') {
      isRunning = !isRunning;
    } else if (p.key === 'r' || p.key === 'R') {
      points = [];
      currentPoint = p.createVector(p.random(p.width), p.random(p.height));
      drawTriangle();
    } else if (p.key === 'm' || p.key === 'M') {
      mode = mode === 'chaos' ? 'recursive' : 'chaos';
      points = [];
      currentPoint = p.createVector(p.random(p.width), p.random(p.height));
      drawTriangle();
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = sierpinski;
}

if (typeof window !== 'undefined') {
  window.sierpinski = sierpinski;
} 