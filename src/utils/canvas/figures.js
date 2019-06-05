// import { clearArc, CircleCleanFix } from "./trygonometry";
import Vector from "../vector";
import { bouncingBoundires } from "../math";

export const Circle = context => (originX, originY, originSize = 20) => {
  return {
    renderer: (x = originX, y = originY, size = originSize) => {
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2, false);
      context.fill();
    }
  };
};

export class Particle {
  constructor(
    planeWidth,
    planeHeight,
    x,
    y,
    size = 5,
    speed,
    direction,
    renderer,
    weight = 1,
    friction = 1, // (0-1) 1 means no friction
    otherForce = {
      x: Math.random() * 0.01 - 0.005,
      y: Math.random() * 0.001 - 0.0005
    }
  ) {
    this.planeWidth = planeWidth;
    this.planeHeight = planeHeight;
    this.size = size;
    this.renderer = renderer;
    this.weight = weight;
    this.friction = friction;
    this.otherForce = otherForce;
    this.groundWeight = 600000;

    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.gravity = new Vector(0, 0);
    this.force = new Vector(otherForce.x, otherForce.y);

    this.velocity.setLength(speed);
    this.velocity.setAngle(direction);
  }

  accelerate(vector) {
    this.velocity.addTo(vector);
  }

  update() {
    this.gravity.setY(
      (this.weight * this.groundWeight) /
        (this.planeHeight - this.position.getY() + 6000) ** 2
    );
    this.accelerate(this.gravity);
    // accelerate(force);
    this.velocity.multiplyTo(this.friction);
    this.position.addTo(this.velocity);
  }

  render() {
    this.update();
    bouncingBoundires(
      { velocity: this.velocity, position: this.position },
      this.planeWidth,
      this.planeHeight,
      this.size,
      true,
      false
    );
    this.renderer(this.position.getX(), this.position.getY(), this.size);
  }
}

export const ParticleOld = (
  x,
  y,
  size = 5,
  speed,
  direction,
  renderer,
  weight = 1,
  friction = 1 // (0-1) 1 means no friction
  // otherForce = {
  //   x: Math.random() * 0.01 - 0.005,
  //   y: Math.random() * 0.001 - 0.0005
  // }
) => (width, height) => {
  const position = new Vector(x, y);
  const velocity = new Vector(0, 0);
  const gravity = new Vector(0, 0);
  // const force = new Vector(otherForce.x, otherForce.y);
  const groundWeight = 600000;

  velocity.setLength(speed);
  velocity.setAngle(direction);

  const accelerate = vector => {
    velocity.addTo(vector);
  };

  const update = () => {
    gravity.setY(
      (weight * groundWeight) / (height - position.getY() + 6000) ** 2
    );
    accelerate(gravity);
    // accelerate(force);
    velocity.multiplyTo(friction);
    position.addTo(velocity);
  };

  const render = () => {
    update();
    bouncingBoundires({ velocity, position }, width, height, size);
    renderer(position.getX(), position.getY(), size);
  };

  return {
    render,
    position,
    velocity,
    update,
    size
  };
};
