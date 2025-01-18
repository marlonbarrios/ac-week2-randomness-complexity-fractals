/**
 * Perlin Flow Fields
 * 
 * Theory:
 * - Perlin noise generates smooth random values
 * - Flow fields map vectors to space points
 * - Combines:
 *   * Coherent noise
 *   * Vector fields
 *   * Particle systems
 * 
 * Implementation:
 * - Noise-based angle generation
 * - Particle movement in field
 * - Smooth transitions
 * - Trail rendering
 * 
 * Applications:
 * - Natural movement patterns
 * - Terrain generation
 * - Texture synthesis
 * - Generative art
 */

// Perlin Flow Field visualization
// Creates an organic flowing pattern using Perlin noise to control particle movement

const perlinFlow = (p) => {
  class FlowParticle {
    constructor() {
      this.resetPosition();
      this.stepSize = p.random(1, 2);
      this.opacity = p.random(10, 25);
    }
    
    resetPosition() {
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.prevPos = this.pos.copy();
    }
    
    update(time) {
      this.prevPos = this.pos.copy();
      
      // Classic Perlin flow field
      let noiseScale = 0.003;
      let angle = p.noise(
        this.pos.x * noiseScale, 
        this.pos.y * noiseScale, 
        time
      ) * p.TWO_PI * 2;
      
      // Simple velocity update
      this.pos.x += p.cos(angle) * this.stepSize;
      this.pos.y += p.sin(angle) * this.stepSize;
      
      // Wrap around edges
      this.pos.x = (this.pos.x + p.width) % p.width;
      this.pos.y = (this.pos.y + p.height) % p.height;
    }
    
    draw() {
      p.stroke(0, this.opacity);
      p.strokeWeight(1);
      p.line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
    }
  }

  let particles = [];
  const PARTICLE_COUNT = 2000;
  let time = 0;
  let isRunning = true;

  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.background(255);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new FlowParticle());
    }
  };

  p.draw = function() {
    p.fill(255, 5);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);
    
    if (isRunning) {
      for (let particle of particles) {
        particle.update(time);
        particle.draw();
      }
      time += 0.001;
    }
  };

  p.keyPressed = function() {
    if (p.key === ' ') {  // Space to pause/play
      isRunning = !isRunning;
    } else if (p.key === 'r' || p.key === 'R') {  // R to reset
      p.background(255);
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new FlowParticle());
      }
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = perlinFlow;
}

if (typeof window !== 'undefined') {
  window.perlinFlow = perlinFlow;
} 