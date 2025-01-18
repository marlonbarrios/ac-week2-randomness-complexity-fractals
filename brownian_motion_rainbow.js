/**
 * Rainbow Brownian Motion
 * 
 * Theory:
 * - Combines Brownian motion with color dynamics
 * - Uses HSB color space for smooth transitions
 * - Demonstrates:
 *   * Particle dynamics
 *   * Color theory
 *   * Motion trails
 * 
 * Mathematical Properties:
 * - Angular random walk for smoother motion
 * - Speed-based dynamics
 * - Boundary interactions with energy loss
 * 
 * Implementation:
 * - HSB color mode for rainbow effect
 * - Layered particle rendering
 * - Velocity-based trail effects
 * - Smooth motion transitions
 * - Particle glow effects
 */

const colorfulBrownian = (p) => {
  let particle;

  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.colorMode(p.HSB, 360, 100, 100, 1);
    p.background(255);
    particle = new Particle(p.width/2, p.height/2);
  };

  p.draw = function() {
    p.fill(255, 15); // Subtle white fade
    p.noStroke();
    p.rect(0, 0, p.width, p.height);
    particle.move();
    particle.display();
  };

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.prevX = x;
      this.prevY = y;
      this.hue = 0;
      this.speed = 2;
    }
    
    move() {
      this.prevX = this.x;
      this.prevY = this.y;
      
      // More interesting motion with angle
      let angle = p.random(p.TWO_PI);
      this.x += p.cos(angle) * this.speed;
      this.y += p.sin(angle) * this.speed;
      
      // Bounce off edges with speed reduction
      if (this.x < 0 || this.x > p.width) {
        this.x = p.constrain(this.x, 0, p.width);
        this.speed *= 0.95;
      }
      if (this.y < 0 || this.y > p.height) {
        this.y = p.constrain(this.y, 0, p.height);
        this.speed *= 0.95;
      }
      
      // Gradually restore speed
      this.speed = p.lerp(this.speed, 2, 0.01);
      
      // Smooth color transition
      this.hue = (this.hue + 0.5) % 360;
    }
    
    display() {
      // Trail with gradient opacity
      p.stroke(this.hue, 80, 90, 0.2);
      p.strokeWeight(2);
      p.line(this.prevX, this.prevY, this.x, this.y);
      
      // Particle with subtle glow effect
      p.noStroke();
      // Outer glow
      p.fill(this.hue, 80, 90, 0.1);
      p.ellipse(this.x, this.y, 12, 12);
      // Inner glow
      p.fill(this.hue, 80, 90, 0.2);
      p.ellipse(this.x, this.y, 8, 8);
      // Core
      p.fill(this.hue, 80, 90, 0.3);
      p.ellipse(this.x, this.y, 4, 4);
    }
  }
};

if (typeof module !== 'undefined') {
  module.exports = colorfulBrownian;
}

if (typeof window !== 'undefined') {
  window.colorfulBrownian = colorfulBrownian;
} 