/**
 * Julia Set Visualization
 * 
 * Theory:
 * - Named after Gaston Julia (1918)
 * - Related to Mandelbrot set but with different iteration process
 * - Studies behavior of complex function f(z) = z² + c
 *   for fixed c and varying initial z
 * 
 * Mathematical Properties:
 * - Each c value generates different fractal
 * - Connected or disconnected depending on c
 * - Relationship to Mandelbrot set:
 *   * Points in Mandelbrot set give connected Julia sets
 *   * Points outside give disconnected Julia sets
 * 
 * Implementation:
 * - Real-time parameter exploration
 * - Smooth shading for detail
 * - Interactive c value selection
 */

const juliaSet = (p) => {
  let minX = -2;
  let maxX = 2;
  let minY = -2;
  let maxY = 2;
  let maxIterations = 100;
  let juliaC = { x: 0.285, y: 0.01 };  // Initial complex constant
  let isDragging = false;
  
  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.pixelDensity(1);
    p.loadPixels();
    drawJulia();
    
    // Add mouse drag functionality to change Julia constant
    canvas.mousePressed(() => {
      if (p.mouseY < p.height - 40) {  // Avoid control area
        isDragging = true;
      }
    });
    
    canvas.mouseReleased(() => {
      isDragging = false;
    });
  };
  
  function drawJulia() {
    for (let x = 0; x < p.width; x++) {
      for (let y = 0; y < p.height; y++) {
        let a = p.map(x, 0, p.width, minX, maxX);
        let b = p.map(y, 0, p.height, minY, maxY);
        
        let n = 0;
        
        while (n < maxIterations) {
          // z = z^2 + c for Julia set
          let aa = a * a - b * b;
          let bb = 2 * a * b;
          
          a = aa + juliaC.x;
          b = bb + juliaC.y;
          
          if (a * a + b * b > 16) {
            break;
          }
          
          n++;
        }
        
        // Convert to black and white with smooth shading
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
    
    // Draw current Julia constant value
    p.fill(255);
    p.noStroke();
    p.rect(0, p.height - 40, p.width, 40);
    p.fill(0);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
    p.text(`Julia Set c = ${juliaC.x.toFixed(3)} + ${juliaC.y.toFixed(3)}i`, 20, p.height - 20);
    p.text('Drag mouse to change c value, R to reset', p.width - 250, p.height - 20);
  }
  
  p.mouseDragged = function() {
    if (isDragging && p.mouseY < p.height - 40) {
      // Map mouse position to complex plane for c value
      juliaC.x = p.map(p.mouseX, 0, p.width, -1, 1);
      juliaC.y = p.map(p.mouseY, 0, p.height - 40, -1, 1);
      drawJulia();
    }
  };
  
  p.keyPressed = function() {
    if (p.key === 'r' || p.key === 'R') {
      // Reset to initial values
      juliaC = { x: 0.285, y: 0.01 };
      minX = -2;
      maxX = 2;
      minY = -2;
      maxY = 2;
      maxIterations = 100;
      drawJulia();
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = juliaSet;
}

if (typeof window !== 'undefined') {
  window.juliaSet = juliaSet;
} 