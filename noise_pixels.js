/**
 * Pixel-based Noise Comparison
 * 
 * Theory:
 * - Direct pixel manipulation to visualize noise patterns
 * - Compares pure random vs. coherent Perlin noise
 * - Demonstrates fundamental differences in noise types:
 *   * Random: Independent values (white noise)
 *   * Perlin: Spatially correlated values (gradient noise)
 * 
 * Visual Properties:
 * - Random noise: High frequency, sharp transitions
 * - Perlin noise: Smooth gradients, natural patterns
 * - Grayscale values show intensity distribution
 * 
 * Implementation:
 * - Direct pixel array manipulation
 * - Split screen comparison
 * - Animated Perlin noise
 * - Performance optimizations
 */

const noisePixels = (p) => {
  let noiseScale = 0.02;
  let time = 0;
  let isRunning = true;
  
  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.pixelDensity(1);
    p.noSmooth();
  };
  
  p.draw = function() {
    p.loadPixels();
    
    // Draw random noise on left half
    for (let x = 0; x < p.width/2; x++) {
      for (let y = 0; y < p.height; y++) {
        let index = (x + y * p.width) * 4;
        let randomValue = p.random(255);
        p.pixels[index + 0] = randomValue;
        p.pixels[index + 1] = randomValue;
        p.pixels[index + 2] = randomValue;
        p.pixels[index + 3] = 255;
      }
    }
    
    // Draw Perlin noise on right half
    for (let x = p.width/2; x < p.width; x++) {
      for (let y = 0; y < p.height; y++) {
        let index = (x + y * p.width) * 4;
        let noiseValue = p.noise(
          x * noiseScale, 
          y * noiseScale, 
          time
        );
        let brightness = noiseValue * 255;
        p.pixels[index + 0] = brightness;
        p.pixels[index + 1] = brightness;
        p.pixels[index + 2] = brightness;
        p.pixels[index + 3] = 255;
      }
    }
    
    p.updatePixels();
    
    if (isRunning) {
      time += 0.01;
    }
    
    // Draw dividing line
    p.stroke(100);
    p.strokeWeight(1);
    p.line(p.width/2, 0, p.width/2, p.height);
    
    // Draw labels
    p.noStroke();
    p.fill(0);
    p.textSize(14);
    p.textAlign(p.CENTER);
    p.text("Random Noise", p.width * 0.25, 30);
    p.text("Perlin Noise", p.width * 0.75, 30);
  };
  
  p.keyPressed = function() {
    if (p.key === ' ') {
      isRunning = !isRunning;
    } else if (p.key === 'r' || p.key === 'R') {
      time = 0;
      p.redraw();
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = noisePixels;
}

if (typeof window !== 'undefined') {
  window.noisePixels = noisePixels;
} 