/**
 * Emergence and Complex Systems
 * 
 * Theory:
 * - Emergence: Complex patterns from simple rules
 * - Self-organization in natural systems
 * - Collective behavior without central control
 * 
 * Key Concepts:
 * - Local interactions create global patterns
 * - Bottom-up organization
 * - Phase transitions and pattern formation
 * - Feedback loops and system dynamics
 * 
 * Applications:
 * - Biological systems
 * - Social dynamics
 * - Pattern formation in nature
 * - Artificial life simulations
 */

const emergence = (p) => {
  class Agent {
    constructor() {
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.vel = p5.Vector.random2D();
      this.acc = p.createVector();
      this.maxSpeed = 3;
      this.maxForce = 0.2;
      this.alignRange = 50;
      this.cohesionRange = 100;
      this.separationRange = 25;
      this.history = [];
      this.maxHistory = 20;
    }

    update() {
      // Update history
      this.history.push(this.pos.copy());
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }

      // Update motion
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);

      // Wrap around edges
      this.pos.x = (this.pos.x + p.width) % p.width;
      this.pos.y = (this.pos.y + p.height) % p.height;
    }

    applyForce(force) {
      this.acc.add(force);
    }

    flock(agents) {
      let alignment = this.align(agents);
      let cohesion = this.cohesion(agents);
      let separation = this.separation(agents);

      alignment.mult(1.0);
      cohesion.mult(0.8);
      separation.mult(1.5);

      this.applyForce(alignment);
      this.applyForce(cohesion);
      this.applyForce(separation);
    }

    align(agents) {
      let sum = p.createVector();
      let count = 0;
      
      for (let other of agents) {
        let d = p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d > 0 && d < this.alignRange) {
          sum.add(other.vel);
          count++;
        }
      }

      if (count > 0) {
        sum.div(count);
        sum.setMag(this.maxSpeed);
        let steer = p5.Vector.sub(sum, this.vel);
        steer.limit(this.maxForce);
        return steer;
      }
      return p.createVector();
    }

    cohesion(agents) {
      let sum = p.createVector();
      let count = 0;
      
      for (let other of agents) {
        let d = p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d > 0 && d < this.cohesionRange) {
          sum.add(other.pos);
          count++;
        }
      }

      if (count > 0) {
        sum.div(count);
        return this.seek(sum);
      }
      return p.createVector();
    }

    separation(agents) {
      let sum = p.createVector();
      let count = 0;
      
      for (let other of agents) {
        let d = p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d > 0 && d < this.separationRange) {
          let diff = p5.Vector.sub(this.pos, other.pos);
          diff.normalize();
          diff.div(d);
          sum.add(diff);
          count++;
        }
      }

      if (count > 0) {
        sum.div(count);
        sum.setMag(this.maxSpeed);
        let steer = p5.Vector.sub(sum, this.vel);
        steer.limit(this.maxForce);
        return steer;
      }
      return p.createVector();
    }

    seek(target) {
      let desired = p5.Vector.sub(target, this.pos);
      desired.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }

    display() {
      // Draw trail
      p.noFill();
      p.beginShape();
      for (let i = 0; i < this.history.length; i++) {
        let alpha = p.map(i, 0, this.history.length, 0, 50);
        p.stroke(0, alpha);
        p.vertex(this.history[i].x, this.history[i].y);
      }
      p.endShape();

      // Draw agent
      p.push();
      p.translate(this.pos.x, this.pos.y);
      p.rotate(this.vel.heading());
      p.fill(0, 60);
      p.noStroke();
      p.triangle(-6, -3, -6, 3, 6, 0);
      p.pop();
    }
  }

  let agents = [];
  const AGENT_COUNT = 100;
  let isRunning = true;

  p.setup = function() {
    let canvas = p.createCanvas(800, 600);
    p.background(255);
    
    for (let i = 0; i < AGENT_COUNT; i++) {
      agents.push(new Agent());
    }
  };

  p.draw = function() {
    p.fill(255, 10);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);

    if (isRunning) {
      for (let agent of agents) {
        agent.flock(agents);
        agent.update();
        agent.display();
      }
    }
  };

  p.keyPressed = function() {
    if (p.key === ' ') {
      isRunning = !isRunning;
    } else if (p.key === 'r' || p.key === 'R') {
      p.background(255);
      agents = [];
      for (let i = 0; i < AGENT_COUNT; i++) {
        agents.push(new Agent());
      }
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = emergence;
}

if (typeof window !== 'undefined') {
  window.emergence = emergence;
} 