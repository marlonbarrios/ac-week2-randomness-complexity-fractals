/**
 * Random Walk Visualization
 * 
 * Theory:
 * - A random walk is a mathematical object that describes a path consisting of a 
 *   succession of random steps in a mathematical space.
 * - It's a fundamental example of a stochastic process, forming the basis for:
 *   * Brownian motion models
 *   * Diffusion processes in physics
 *   * Stock market fluctuations
 *   * Animal foraging patterns
 * 
 * Mathematical Properties:
 * - Each step is independent of previous steps (Markov property)
 * - In 2D, the average distance from start = sqrt(number of steps)
 * - Demonstrates both randomness and emergent patterns
 * 
 * Implementation:
 * - Discrete grid movement
 * - History tracking for path visualization
 * - Step size and opacity controls
 * - Clear visual feedback
 */

const randomWalk = (p) => {
  class Walker {
    /**
     * Walker Class
     * Implements a discrete-time random walk on a 2D grid
     * - Uses equal probability for each cardinal direction
     * - Maintains history for visualization
     * - Creates visible trails showing path evolution
     */
    constructor() {
      this.x = p.width/2;
      this.y = p.height/2;
      this.history = [];
      this.stepSize = 15;
      this.opacity = 40;
    }
    
    /**
     * Movement Algorithm:
     * 1. Store current position in history
     * 2. Generate random direction (uniform distribution)
     * 3. Update position based on chosen direction
     * 4. Constrain to canvas boundaries
     */
    move() {
      this.history.push({x: this.x, y: this.y});
      
      let choice = p.floor(p.random(4));
      
      switch(choice) {
        case 0: this.x += this.stepSize; break;
        case 1: this.x -= this.stepSize; break;
        case 2: this.y -= this.stepSize; break;
        case 3: this.y += this.stepSize; break;
      }
      
      this.x = p.constrain(this.x, 0, p.width);
      this.y = p.constrain(this.y, 0, p.height);
    }
    
    /**
     * Visualization Method:
     * - Draws complete path history
     * - Uses opacity to show direction of movement
     * - Emphasizes current position
     */
    display() {
      p.stroke(0, this.opacity);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      for (let pos of this.history) {
        p.vertex(pos.x, pos.y);
      }
      p.vertex(this.x, this.y);
      p.endShape();
      
      p.fill(0);
      p.noStroke();
      p.ellipse(this.x, this.y, 8, 8);
      
      for (let pos of this.history) {
        p.fill(0, this.opacity/2);
        p.ellipse(pos.x, pos.y, 4, 4);
      }
    }
  }

  let walker;

  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.background(255);
    walker = new Walker();
  };

  p.draw = function() {
    p.background(255);
    walker.move();
    walker.display();
  };
};

if (typeof module !== 'undefined') {
  module.exports = randomWalk;
}

if (typeof window !== 'undefined') {
  window.randomWalk = randomWalk;
} 