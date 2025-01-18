/**
 * Noise Comparison
 * 
 * Theory:
 * - Compares random noise vs. Perlin noise
 * - Random: Independent values, no spatial correlation
 * - Perlin: Smooth gradients with controlled frequency
 * 
 * Properties:
 * - Random Noise:
 *   * True statistical independence
 *   * High frequency content
 *   * White noise characteristics
 * 
 * - Perlin Noise:
 *   * Spatial coherence
 *   * Controllable frequency content
 *   * Natural-looking variations
 * 
 * Implementation:
 * - Side-by-side visualization
 * - Real-time animation
 * - Direct value comparison
 * - Interactive controls
 */

const noiseComparison = (p) => {
  class NoiseVisualizer {
    constructor(x, y, w, h, isPerlin) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.isPerlin = isPerlin;
      
      this.xoff = 0;
      this.increment = 0.02;
      this.values = new Array(w).fill(0);
    }
    
    update() {
      // Shift values left
      for (let i = 0; i < this.w - 1; i++) {
        this.values[i] = this.values[i + 1];
      }
      
      if (this.isPerlin) {
        this.values[this.w - 1] = p.map(p.noise(this.xoff), 0, 1, 0, this.h);
        this.xoff += this.increment;
      } else {
        this.values[this.w - 1] = p.random(0, this.h);
      }
    }
    
    display() {
      p.push();
      p.translate(this.x, this.y);
      
      // Background
      p.fill(250);
      p.stroke(220);
      p.rect(0, 0, this.w, this.h);
      
      // Grid lines
      p.stroke(240);
      for (let i = 0; i < 10; i++) {
        let y = (this.h / 10) * i;
        p.line(0, y, this.w, y);
      }
      for (let i = 0; i < 10; i++) {
        let x = (this.w / 10) * i;
        p.line(x, 0, x, this.h);
      }
      
      // Title
      p.fill(255);
      p.noStroke();
      p.textAlign(p.CENTER);
      p.textSize(16);
      p.text(this.isPerlin ? "Perlin Noise" : "Random Noise", this.w/2, -20);
      
      // Draw line
      p.stroke(0, 100);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      for (let i = 0; i < this.w; i++) {
        p.vertex(i, this.values[i]);
      }
      p.endShape();
      
      p.pop();
    }
  }

  let randomNoiseViz;
  let perlinNoiseViz;
  let isRunning = true;

  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    randomNoiseViz = new NoiseVisualizer(50, 100, 300, 300, false);
    perlinNoiseViz = new NoiseVisualizer(450, 100, 300, 300, true);
  };

  p.draw = function() {
    p.background(255);
    
    if (isRunning) {
      randomNoiseViz.update();
      perlinNoiseViz.update();
    }
    
    // Background for graphs
    p.fill(250);
    p.stroke(200);
    p.rect(50, 100, 300, 300);
    p.rect(450, 100, 300, 300);
    
    randomNoiseViz.display();
    perlinNoiseViz.display();
    
    // Explanations with dark text
    p.fill(50);
    p.noStroke();
    p.textSize(14);
    p.textAlign(p.LEFT);
    
    // Random noise explanation
    p.fill('#FF4081');
    p.text("Random Noise", 70, 470);
    p.fill(200);
    p.textSize(12);
    p.text("• Each value is completely independent", 90, 490);
    p.text("• No correlation between consecutive points", 90, 510);
    p.text("• Results in sharp, jumpy transitions", 90, 530);
    
    // Perlin noise explanation
    p.fill('#4CAF50');
    p.text("Perlin Noise", 470, 470);
    p.fill(200);
    p.text("• Values are connected and continuous", 490, 490);
    p.text("• Natural-looking, smooth randomness", 490, 510);
    p.text("• Used for organic motion and terrain", 490, 530);
    
    // Play/Pause button
    p.fill(isRunning ? '#4CAF50' : '#666');
    p.rect(370, 540, 60, 25);
    p.fill(255);
    p.textAlign(p.CENTER);
    p.text(isRunning ? 'Pause' : 'Play', 400, 557);
  };

  p.mousePressed = function() {
    // Play/Pause button
    if (p.mouseX > 370 && p.mouseX < 430 && 
        p.mouseY > 540 && p.mouseY < 565) {
      isRunning = !isRunning;
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = noiseComparison;
}

if (typeof window !== 'undefined') {
  window.noiseComparison = noiseComparison;
} 