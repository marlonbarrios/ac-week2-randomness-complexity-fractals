/**
 * Recursive Branching Tree
 * 
 * Theory:
 * - L-System inspired growth patterns
 * - Recursive self-similar structures
 * - Natural branching patterns found in:
 *   * Trees and plants
 *   * River networks
 *   * Lightning patterns
 * 
 * Mathematical Concepts:
 * - Recursive geometry
 * - Angular relationships
 * - Scaling factors
 * - Golden ratio approximations
 * 
 * Implementation:
 * - Recursive drawing algorithm
 * - Dynamic angle control
 * - Organic movement simulation
 * - Progressive branch thinning
 */

const branchingTree = (p) => {
  let angle = p.PI / 4;
  let targetAngle = p.PI / 4;
  let lengthFactor = 0.67;
  let minLength = 4;
  let startLength = 160;  // Slightly shorter to reduce movement
  let strokeWidth = 8;    // Thinner lines
  let time = 0;          // Use time instead of offset for smoother animation
  let isAnimating = true;
  
  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.background(255);
    p.strokeCap(p.SQUARE);
    
    // Add mouseMoved handler for interactive angle control
    canvas.mouseMoved(() => {
      if (p.mouseY < p.height - 40) {
        targetAngle = p.map(p.mouseX, 0, p.width, p.PI/8, p.PI/3);
      }
    });
  };
  
  p.draw = function() {
    p.background(255);
    
    // Smooth angle transition
    angle = p.lerp(angle, targetAngle, 0.1);
    
    // Draw tree
    p.stroke(0, 60);
    p.translate(p.width/2, p.height - 50);
    branch(startLength, strokeWidth);
    
    if (isAnimating) {
      time += 0.015;  // Slower animation
    }
    
    // Draw controls info
    p.fill(255);
    p.noStroke();
    p.rect(0, -p.height + 40, p.width, 30);
    p.fill(0);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
    p.text('Move mouse left/right to change branching angle', 20, -p.height + 15);
    p.text('Space to pause animation, R to reset', p.width - 250, -p.height + 15);
  };
  
  function branch(len, weight) {
    // Draw branch
    p.strokeWeight(weight);
    p.line(0, 0, 0, -len);
    
    // Move to end of branch
    p.translate(0, -len);
    
    // Only branch if length is above minimum
    if (len > minLength) {
      // Calculate wave offsets for smoother animation
      let rightOffset = p.sin(time + len * 0.01) * 0.05;
      let leftOffset = p.sin(time + len * 0.01 + p.PI) * 0.05;
      
      // Right branch
      p.push();
      p.rotate(angle + rightOffset);
      branch(len * lengthFactor, weight * 0.7);
      p.pop();
      
      // Left branch
      p.push();
      p.rotate(-angle + leftOffset);
      branch(len * lengthFactor, weight * 0.7);
      p.pop();
      
      // Optional middle branch (less frequent, more stable)
      if (len > startLength/2 && p.noise(len, time) < 0.2) {
        p.push();
        p.rotate(p.sin(time + len * 0.02) * 0.1);
        branch(len * lengthFactor * 0.8, weight * 0.6);
        p.pop();
      }
    }
  }
  
  p.keyPressed = function() {
    if (p.key === ' ') {
      isAnimating = !isAnimating;
    } else if (p.key === 'r' || p.key === 'R') {
      time = 0;
      angle = p.PI/4;
      targetAngle = p.PI/4;
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = branchingTree;
}

if (typeof window !== 'undefined') {
  window.branchingTree = branchingTree;
} 