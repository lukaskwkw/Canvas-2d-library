// import { clearArc, CircleCleanFix } from "./trygonometry";
import Vector from "../vector";
import { bouncingBoundires } from "../math";
import { Point } from "../vector";

export const Circle = context => (originX, originY, originSize = 20) => {
  return {
    renderer: (x = originX, y = originY, size = originSize) => {
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2, false);
      context.fill();
    }
  };
};

export class PlaneSingleton {
  static instance;
  planeWidth: number;
  planeHeight: number;
  context: object;
  constructor(planeWidth?, planeHeight?, context?) {
    if (PlaneSingleton.instance) {
      return PlaneSingleton.instance;
    }

    this.planeWidth = planeWidth;
    this.planeHeight = planeHeight;
    this.context = context;

    PlaneSingleton.instance = this;
  }
}

export class Particle {
  planeWidth: number;
  planeHeight: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
  renderer: Function;
  weight: number;
  friction: number;
  otherForce: Point;
  groundWeight: number;
  position: Vector;
  velocity: Vector;
  gravity: Vector;
  force: Vector;

  // constructor(
  //   x: number,
  //   y: number,
  //   size: number,
  //   speed: number,
  //   direction: number,
  //   renderer: number,
  //   weight: number,
  //   friction: number, // (0-1) 1 means no friction
  //   otherForce: Point
  // );
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
      x: 0,
      y: 0
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
      this.velocity,
      this.position,
      this.planeWidth,
      this.planeHeight,
      this.size,
      { checkBottom: false }
    );
    this.renderer(this.position.getX(), this.position.getY(), this.size);
  }
}
