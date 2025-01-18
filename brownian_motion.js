/**
 * Brownian Motion Simulation
 * 
 * Theory:
 * - Named after botanist Robert Brown (1827)
 * - Describes random motion of particles suspended in a fluid
 * - Results from collisions with fast-moving molecules
 * 
 * Physical Properties:
 * - Mean squared displacement proportional to time
 * - Continuous but nowhere differentiable path
 * - Fractal dimension of 2 in plane
 * - Fundamental to:
 *   * Diffusion processes
 *   * Heat transfer
 *   * Financial mathematics (e.g., Black-Scholes model)
 * 
 * Implementation:
 * - Particle class with position tracking
 * - Random step generation
 * - Trail visualization
 * - Boundary constraints
 */

const brownianMotion = (p) => {
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.prevX = x;
      this.prevY = y;
    }
    
    move() {
      this.prevX = this.x;
      this.prevY = this.y;
      this.x += p.random(-1, 1);
      this.y += p.random(-1, 1);
      this.x = p.constrain(this.x, 0, p.width);
      this.y = p.constrain(this.y, 0, p.height);
    }
    
    display() {
      p.stroke(0, 20);  // Very subtle black
      p.strokeWeight(1);
      p.line(this.prevX, this.prevY, this.x, this.y);
    }
  }

  let particle;

  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.background(255);
    particle = new Particle(p.width/2, p.height/2);
  };

  p.draw = function() {
    particle.move();
    particle.display();
  };
};

if (typeof module !== 'undefined') {
  module.exports = brownianMotion;
}

if (typeof window !== 'undefined') {
  window.brownianMotion = brownianMotion;
} 