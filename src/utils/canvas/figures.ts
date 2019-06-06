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
  width: number;
  height: number;
  context: object;
  constructor(planeWidth?, planeHeight = planeWidth, context?, reset = false) {
    if (PlaneSingleton.instance && !reset) {
      return PlaneSingleton.instance;
    }

    this.width = planeWidth;
    this.height = planeHeight;
    this.context = context;

    PlaneSingleton.instance = this;
  }
}

interface PlaneDimensions {
  width: number;
  height: number;
}

interface ParticleFeatures {
  size: number;
  speed?: number;
  direction?: number;
  weight?: number;
  friction?: number; // (0-1) 1 means no friction
  otherForce?: Point;
}

const DefaultPlaneSize = 1000;

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

  constructor(
    particlePosition: Point,
    particleFeatures: ParticleFeatures,
    renderer?: Function
  );
  constructor(
    planeDimensions: PlaneDimensions,
    particlePosition: Point,
    particleFeatures: ParticleFeatures,
    renderer?: Function
  );
  constructor(
    positionOrDimensions?: Point | PlaneDimensions,
    particlePositionOrFeatures?: ParticleFeatures | Point,
    particleFeaturesOrRenderer?: ParticleFeatures | Function,
    renderer?: Function
  ) {
    const { x, y } =
      ("x" in positionOrDimensions && positionOrDimensions) ||
      ("x" in particlePositionOrFeatures && particlePositionOrFeatures);

    const { width, height } =
      ("width" in positionOrDimensions && positionOrDimensions) ||
      new PlaneSingleton(DefaultPlaneSize);

    const {
      size = 5,
      speed = 10,
      direction = -Math.PI / 4,
      weight = size,
      friction = 0.99,
      otherForce = { x: 0, y: 0 }
    } =
      ("size" in particlePositionOrFeatures && particlePositionOrFeatures) ||
      ("size" in particleFeaturesOrRenderer && particleFeaturesOrRenderer);

    const { renderer: circleRenderer } =
      (typeof particleFeaturesOrRenderer === "function" && {
        renderer: particleFeaturesOrRenderer
      }) ||
      ((renderer && { renderer }) || { renderer: undefined });

    this.renderer = circleRenderer;

    if (!circleRenderer) {
      const { context } = new PlaneSingleton(DefaultPlaneSize);
      if (!context) {
        throw new Error(
          "No context can be obtained from Singleton, nor renderer is provided for Particle!"
        );
      }

      this.renderer = Circle(context)(x, y, size).renderer;
    }

    this.planeWidth = width;
    this.planeHeight = height;
    this.size = size;
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
