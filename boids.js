/**
 * Boids Simulation
 * 
 * Theory:
 * - Created by Craig Reynolds in 1986
 * - Models coordinated animal motion like bird flocks and fish schools
 * - Based on three simple steering behaviors:
 *   1. Separation: avoid crowding neighbors (short range repulsion)
 *   2. Alignment: steer towards average heading of neighbors
 *   3. Cohesion: steer towards average position of neighbors
 * 
 * Mathematical Model:
 * - Each boid has position, velocity, and acceleration vectors
 * - Forces are calculated based on local neighborhood
 * - Movement emerges from weighted combination of rules
 * 
 * Applications:
 * - Artificial life simulation
 * - Crowd behavior modeling
 * - Computer animation and games
 * - Distributed behavioral models
 */

const boids = (p) => {
  class Boid {
    constructor() {
      this.position = p.createVector(p.random(p.width), p.random(p.height));
      this.velocity = p5.Vector.random2D().mult(3);
      this.acceleration = p.createVector();
      this.size = 12;  // Larger size for visibility
      this.maxSpeed = 4;
      this.maxForce = 0.2;
      this.visionRadius = 80;  // Larger vision radius
    }

    update() {
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.position.add(this.velocity);
      this.acceleration.mult(0);

      // Wrap around screen
      if (this.position.x > p.width) this.position.x = 0;
      if (this.position.x < 0) this.position.x = p.width;
      if (this.position.y > p.height) this.position.y = 0;
      if (this.position.y < 0) this.position.y = p.height;
    }

    flock(boids) {
      let separation = this.separate(boids).mult(2.0);  // Stronger separation
      let alignment = this.align(boids).mult(1.0);
      let cohesion = this.cohere(boids).mult(1.0);

      this.acceleration.add(separation);
      this.acceleration.add(alignment);
      this.acceleration.add(cohesion);
    }

    separate(boids) {
      let desiredSeparation = this.size * 2;
      let steer = p.createVector();
      let count = 0;

      for (let other of boids) {
        let d = p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (d > 0 && d < desiredSeparation) {
          let diff = p5.Vector.sub(this.position, other.position);
          diff.normalize();
          diff.div(d);
          steer.add(diff);
          count++;
        }
      }

      if (count > 0) {
        steer.div(count);
        steer.setMag(this.maxSpeed);
        steer.sub(this.velocity);
        steer.limit(this.maxForce);
      }
      return steer;
    }

    align(boids) {
      let sum = p.createVector();
      let count = 0;

      for (let other of boids) {
        let d = p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (d > 0 && d < this.visionRadius) {
          sum.add(other.velocity);
          count++;
        }
      }

      if (count > 0) {
        sum.div(count);
        sum.setMag(this.maxSpeed);
        let steer = p5.Vector.sub(sum, this.velocity);
        steer.limit(this.maxForce);
        return steer;
      }
      return p.createVector();
    }

    cohere(boids) {
      let sum = p.createVector();
      let count = 0;

      for (let other of boids) {
        let d = p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (d > 0 && d < this.visionRadius) {
          sum.add(other.position);
          count++;
        }
      }

      if (count > 0) {
        sum.div(count);
        let desired = p5.Vector.sub(sum, this.position);
        desired.setMag(this.maxSpeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
      }
      return p.createVector();
    }

    display() {
      // Draw vision radius when mouse is near
      let mouseDistance = p.dist(p.mouseX, p.mouseY, this.position.x, this.position.y);
      if (mouseDistance < 50) {
        p.noFill();
        p.stroke(0, 20);
        p.ellipse(this.position.x, this.position.y, this.visionRadius * 2);
      }

      // Draw boid
      let theta = this.velocity.heading() + p.PI/2;
      p.push();
      p.translate(this.position.x, this.position.y);
      p.rotate(theta);
      p.fill(0, 80);
      p.noStroke();
      p.beginShape();
      p.vertex(0, -this.size);
      p.vertex(-this.size/2, this.size);
      p.vertex(this.size/2, this.size);
      p.endShape(p.CLOSE);
      p.pop();
    }
  }

  let boids = [];
  const BOID_COUNT = 50;  // Fewer boids for clarity
  let isRunning = true;

  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.background(255);
    
    for (let i = 0; i < BOID_COUNT; i++) {
      boids.push(new Boid());
    }
  };

  p.draw = function() {
    p.background(255);

    if (isRunning) {
      for (let boid of boids) {
        boid.flock(boids);
        boid.update();
        boid.display();
      }
    }
  };

  p.keyPressed = function() {
    if (p.key === ' ') {
      isRunning = !isRunning;
    } else if (p.key === 'r' || p.key === 'R') {
      boids = [];
      for (let i = 0; i < BOID_COUNT; i++) {
        boids.push(new Boid());
      }
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = boids;
}

if (typeof window !== 'undefined') {
  window.boids = boids;
} 