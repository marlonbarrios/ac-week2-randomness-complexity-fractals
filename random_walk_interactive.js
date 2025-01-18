/**
 * Interactive Random Walk
 * 
 * Theory:
 * - Combines random walks with force fields
 * - Demonstrates collective behavior through:
 *   * Local interactions
 *   * Mouse influence
 *   * Inter-walker repulsion
 * 
 * Physical Model:
 * - Force-based movement
 * - Distance-dependent interactions
 * - Multiple influence zones:
 *   * Mouse attraction/repulsion
 *   * Walker-walker repulsion
 *   * Random motion component
 * 
 * Implementation:
 * - Vector-based physics
 * - Particle history tracking
 * - Force field visualization
 * - Interactive controls
 * - Visual feedback for interactions
 */

const randomWalkInteractive = (p) => {
  class InteractiveWalker {
    constructor(x, y, id) {
      this.pos = p.createVector(x, y);
      this.id = id;
      this.history = [];
      this.maxHistory = 50;
      this.stepSize = p.random(3, 6);
      this.mouseInfluenceRange = 150;  // Mouse influence radius
      this.repulsionRange = 80;       // Walker repulsion radius
    }
    
    move(others) {
      // Store history
      this.history.push(this.pos.copy());
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }
      
      let moveDir = p.createVector(0, 0);
      
      // Mouse attraction/repulsion (stronger effect)
      if (p.mouseX !== 0 || p.mouseY !== 0) {
        let mousePos = p.createVector(p.mouseX, p.mouseY);
        let mouseDir = p.createVector(mousePos.x - this.pos.x, mousePos.y - this.pos.y);
        let mouseDist = mouseDir.mag();
        
        if (mouseDist < this.mouseInfluenceRange) {
          mouseDir.normalize();
          let mouseStrength = p.map(mouseDist, 0, this.mouseInfluenceRange, 1, 0);
          mouseDir.mult(mouseStrength * 2);  // Doubled mouse influence
          moveDir.add(mouseDir);
          
          // Draw attraction line to mouse
          p.stroke(0, mouseStrength * 50);
          p.line(this.pos.x, this.pos.y, p.mouseX, p.mouseY);
        }
      }
      
      // Repulsion from other walkers
      for (let other of others) {
        if (other.id !== this.id) {
          let dir = p.createVector(this.pos.x - other.pos.x, this.pos.y - other.pos.y);
          let d = dir.mag();
          
          if (d < this.repulsionRange && d > 0) {
            dir.normalize();
            let strength = p.map(d, 0, this.repulsionRange, 0.5, 0);
            moveDir.add(dir.mult(strength));
          }
        }
      }
      
      // Add random movement
      moveDir.add(p.createVector(p.random(-1, 1), p.random(-1, 1)));
      moveDir.normalize();
      moveDir.mult(this.stepSize);
      
      // Update position
      this.pos.add(moveDir);
      
      // Keep within bounds
      this.pos.x = p.constrain(this.pos.x, 0, p.width);
      this.pos.y = p.constrain(this.pos.y, 0, p.height);
    }
    
    display() {
      // Draw trail
      p.noFill();
      p.beginShape();
      for (let i = 0; i < this.history.length; i++) {
        let alpha = p.map(i, 0, this.history.length, 0, 50);
        p.stroke(0, alpha);
        p.strokeWeight(1);
        p.vertex(this.history[i].x, this.history[i].y);
      }
      p.endShape();
      
      // Draw current position
      p.fill(0, 100);
      p.noStroke();
      p.ellipse(this.pos.x, this.pos.y, 6, 6);
    }
  }

  let walkers = [];
  const WALKER_COUNT = 15;
  let isRunning = true;

  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.background(255);
    
    // Create walkers in a circle
    for (let i = 0; i < WALKER_COUNT; i++) {
      let angle = (i / WALKER_COUNT) * p.TWO_PI;
      let radius = p.min(p.width, p.height) / 4;
      let x = p.width/2 + p.cos(angle) * radius;
      let y = p.height/2 + p.sin(angle) * radius;
      walkers.push(new InteractiveWalker(x, y, i));
    }
  };

  p.draw = function() {
    p.fill(255, 15);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);
    
    // Draw mouse influence area
    if (isRunning) {
      p.noFill();
      p.stroke(0, 20);
      p.ellipse(p.mouseX, p.mouseY, 300, 300);  // Show influence range
      
      for (let walker of walkers) {
        walker.move(walkers);
        walker.display();
      }
    }
  };

  p.keyPressed = function() {
    if (p.key === ' ') {
      isRunning = !isRunning;
    } else if (p.key === 'r' || p.key === 'R') {
      p.background(255);
      walkers = [];
      for (let i = 0; i < WALKER_COUNT; i++) {
        let angle = (i / WALKER_COUNT) * p.TWO_PI;
        let radius = p.min(p.width, p.height) / 4;
        let x = p.width/2 + p.cos(angle) * radius;
        let y = p.height/2 + p.sin(angle) * radius;
        walkers.push(new InteractiveWalker(x, y, i));
      }
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = randomWalkInteractive;
}

if (typeof window !== 'undefined') {
  window.randomWalkInteractive = randomWalkInteractive;
} 