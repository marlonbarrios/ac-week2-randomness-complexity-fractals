/**
 * Vector Field Patterns
 * 
 * Theory:
 * - Vector fields in physics and mathematics
 * - Flow visualization techniques
 * - Combines:
 *   * Field dynamics
 *   * Particle systems
 *   * Noise-based flow
 * 
 * Mathematical Concepts:
 * - Vector field mathematics
 * - Streamline visualization
 * - Flow dynamics
 * - Multi-scale interactions
 * 
 * Applications:
 * - Fluid dynamics visualization
 * - Magnetic field representation
 * - Wind and weather patterns
 * - Abstract art generation
 */

const fieldPatterns = (p) => {
  class FieldParticle {
    constructor() {
      this.resetPosition();
      this.stepSize = p.random(2, 5);
      this.opacity = p.random(20, 40);
      this.age = 0;
      this.lifespan = p.random(100, 200);
      this.lineMode = p.random() > 0.5;  // true for straight lines, false for curves
      this.history = [];
      this.maxHistory = this.lineMode ? 2 : 4;  // Straight lines use 2 points, curves use 4
    }
    
    resetPosition() {
      let margin = 50;
      this.pos = p.createVector(
        p.random(margin, p.width - margin),
        p.random(margin, p.height - margin)
      );
      this.history = [this.pos.copy()];
      this.vel = p.createVector(0, 0);
      this.age = 0;
    }
    
    update(time) {
      if (this.age > this.lifespan) {
        this.resetPosition();
        this.lineMode = p.random() > 0.5;  // Randomize mode on reset
        this.maxHistory = this.lineMode ? 2 : 4;
        return;
      }
      
      // Store position history
      this.history.push(this.pos.copy());
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }
      
      // Create field pattern
      let dx = this.pos.x - p.width/2;
      let dy = this.pos.y - p.height/2;
      let distance = p.sqrt(dx * dx + dy * dy);
      
      let baseAngle = p.atan2(dy, dx);
      let spiral = distance * 0.01;
      
      // Add Perlin noise influence
      let noiseValue = p.noise(
        this.pos.x * 0.005,
        this.pos.y * 0.005,
        time * 0.5
      );
      
      // Different angle calculation based on line mode
      let angle;
      if (this.lineMode) {
        // Snap to cardinal directions for straight lines
        angle = p.floor(noiseValue * 4) * p.HALF_PI;
      } else {
        // Smooth curves
        angle = baseAngle + spiral + noiseValue * p.TWO_PI;
      }
      
      // Update velocity with different smoothing for each mode
      let targetVel = p.createVector(
        p.cos(angle) * this.stepSize,
        p.sin(angle) * this.stepSize
      );
      
      this.vel.lerp(targetVel, this.lineMode ? 0.5 : 0.2);
      this.pos.add(this.vel);
      
      // Age particle
      this.age++;
      
      // Fade out as particle ages
      this.currentOpacity = this.opacity * (1 - this.age/this.lifespan);
    }
    
    draw() {
      let speed = this.vel.mag();
      let weight = p.map(speed, 0, this.stepSize, 0.5, 2);
      
      p.stroke(0, this.currentOpacity);
      p.strokeWeight(weight);
      
      if (this.lineMode) {
        // Draw straight line
        if (this.history.length > 1) {
          p.line(
            this.history[0].x, this.history[0].y,
            this.history[this.history.length-1].x,
            this.history[this.history.length-1].y
          );
        }
      } else {
        // Draw curve
        if (this.history.length > 2) {
          p.noFill();
          p.beginShape();
          for (let pos of this.history) {
            p.curveVertex(pos.x, pos.y);
          }
          p.curveVertex(this.history[this.history.length-1].x,
                       this.history[this.history.length-1].y);
          p.endShape();
        }
      }
    }
  }

  let particles = [];
  const PARTICLE_COUNT = 1500;
  let time = 0;
  let isRunning = true;

  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.background(255);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new FieldParticle());
    }
  };

  p.draw = function() {
    p.fill(255, 8);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);
    
    if (isRunning) {
      for (let particle of particles) {
        particle.update(time);
        particle.draw();
      }
      time += 0.002;
    }
  };

  p.keyPressed = function() {
    if (p.key === ' ') {
      isRunning = !isRunning;
    } else if (p.key === 'r' || p.key === 'R') {
      p.background(255);
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new FieldParticle());
      }
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = fieldPatterns;
}

if (typeof window !== 'undefined') {
  window.fieldPatterns = fieldPatterns;
} 