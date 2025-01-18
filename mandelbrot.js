/**
 * Mandelbrot Set Visualization
 * 
 * Theory:
 * - Discovered by Benoit Mandelbrot in 1980
 * - Set of complex numbers c for which the function f(z) = z² + c
 *   remains bounded when iterated from z = 0
 * 
 * Mathematical Properties:
 * - Self-similar (fractal) structure
 * - Connected but with infinitely complex boundary
 * - Fractal dimension of 2
 * - Cardioid main bulb represents period-1 behavior
 * - Period bulbs represent stable orbital periods
 * 
 * Implementation:
 * - Escape-time algorithm
 * - Smooth coloring using log scaling
 * - Interactive zoom with increased iteration depth
 */

const mandelbrot = (p) => {
  let minX = -2;
  let maxX = 1;
  let minY = -1.5;
  let maxY = 1.5;
  let maxIterations = 100;
  
  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.pixelDensity(1);
    p.loadPixels();
    drawMandelbrot();
  };
  
  function drawMandelbrot() {
    for (let x = 0; x < p.width; x++) {
      for (let y = 0; y < p.height; y++) {
        let a = p.map(x, 0, p.width, minX, maxX);
        let b = p.map(y, 0, p.height, minY, maxY);
        
        let ca = a;
        let cb = b;
        
        let n = 0;
        
        while (n < maxIterations) {
          let aa = a * a - b * b;
          let bb = 2 * a * b;
          
          a = aa + ca;
          b = bb + cb;
          
          if (a * a + b * b > 16) {
            break;
          }
          
          n++;
        }
        
        // Convert to black and white
        let brightness = p.map(n, 0, maxIterations, 1, 0);
        brightness = p.map(p.sqrt(brightness), 0, 1, 0, 255);
        
        let pix = (x + y * p.width) * 4;
        p.pixels[pix + 0] = brightness;
        p.pixels[pix + 1] = brightness;
        p.pixels[pix + 2] = brightness;
        p.pixels[pix + 3] = 255;
      }
    }
    p.updatePixels();
  }
  
  p.mousePressed = function() {
    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
      // Zoom in at mouse position
      let newX = p.map(p.mouseX, 0, p.width, minX, maxX);
      let newY = p.map(p.mouseY, 0, p.height, minY, maxY);
      
      let newWidth = (maxX - minX) * 0.5;
      let newHeight = (maxY - minY) * 0.5;
      
      minX = newX - newWidth * 0.5;
      maxX = newX + newWidth * 0.5;
      minY = newY - newHeight * 0.5;
      maxY = newY + newHeight * 0.5;
      
      maxIterations += 20;  // Increase detail as we zoom
      drawMandelbrot();
    }
  };
  
  p.keyPressed = function() {
    if (p.key === 'r' || p.key === 'R') {
      // Reset view
      minX = -2;
      maxX = 1;
      minY = -1.5;
      maxY = 1.5;
      maxIterations = 100;
      drawMandelbrot();
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = mandelbrot;
}

if (typeof window !== 'undefined') {
  window.mandelbrot = mandelbrot;
} 