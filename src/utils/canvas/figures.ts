// import { clearArc, CircleCleanFix } from "./trygonometry";
import Vector from "../vector";
import { bouncingBoundires, BoundriesSelector } from "../math";
import { Point } from "../vector";

export const Circle = context => (originX, originY, originSize = 20) => {
  return {
    renderer: (x = originX, y = originY, size = originSize, color = "#000") => {
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2, false);
      context.fill();
    }
  };
};

interface PlaneFeautres {
  dimensions?: PlaneDimensions;
  plainGravity?: boolean;
  boundaries?: BoundriesSelector;
}

const DefaultPlaneSize = 500;

const PlaneDefaultDimensions = {
  width: DefaultPlaneSize,
  height: DefaultPlaneSize
};

const PlaneDefaultBoundaries = {
  checkTop: false,
  checkBottom: false,
  checkLeft: false,
  checkRight: false
};

const PlaneFeautersDefault = {
  dimensions: PlaneDefaultDimensions,
  plainGravity: false,
  boundaries: PlaneDefaultBoundaries
};

export class PlaneSingleton {
  static instance;
  features: PlaneFeautres;
  context: any;

  constructor(
    features: PlaneFeautres = PlaneFeautersDefault,
    context?,
    reset: boolean = false
  ) {
    if (PlaneSingleton.instance && !reset) {
      return PlaneSingleton.instance;
    }

    const {
      dimensions = PlaneDefaultDimensions,
      plainGravity = false,
      boundaries = PlaneDefaultBoundaries
    } = features;

    this.features = {
      dimensions,
      plainGravity,
      boundaries
    };

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
  weight?: number; //0 for no gravity force
  friction?: number; // (0-1) 1 means no friction
  otherForce?: Point;
  fillColor?: string;
  planeGravity?: boolean;
  boundary?: BoundriesSelector;
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
  orbitateTo: Particle;
  fillColor: string;
  planeGravity: boolean;
  boundary: BoundriesSelector;

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
    const plane = new PlaneSingleton();

    const { x, y } =
      ("x" in positionOrDimensions && positionOrDimensions) ||
      ("x" in particlePositionOrFeatures && particlePositionOrFeatures);

    const { width, height } =
      ("width" in positionOrDimensions && positionOrDimensions) ||
      plane.features.dimensions;

    const {
      size = 5,
      speed = 10,
      direction = -Math.PI / 4,
      weight = 0,
      friction = 1,
      otherForce = { x: 0, y: 0 },
      fillColor = "#000",
      planeGravity = undefined,
      //todo: maybe set everything by Singleton?
      boundary = undefined
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
      if (!plane.context) {
        throw new Error(
          "No context can be obtained from Singleton, nor renderer is provided for Particle!"
        );
      }

      this.renderer = Circle(plane.context)(x, y, size).renderer;
    }

    this.boundary =
      typeof boundary !== "undefined" ? boundary : plane.features.boundaries;
    this.planeGravity =
      typeof planeGravity !== "undefined"
        ? planeGravity
        : plane.features.plainGravity;
    this.fillColor = fillColor;
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

  setOrbiteTo(particle: Particle) {
    this.orbitateTo = particle;
  }

  orbitate() {
    const particle = this.orbitateTo;
    if (!particle) {
      return;
    }

    const distanceY = particle.position.getY() - this.position.getY();
    const distanceX = particle.position.getX() - this.position.getX();
    const distance = Math.sqrt(distanceY ** 2 + distanceX ** 2);

    const gravityVector = new Vector(distanceX, distanceY);
    gravityVector.setAngle(Math.atan2(distanceY, distanceX));
    gravityVector.setLength(particle.weight / distance ** 2);
    this.accelerate(gravityVector);
  }

  accelerate(vector: Vector) {
    this.velocity.addTo(vector);
  }

  gravityToBottomPlane() {
    if (!this.planeGravity) {
      return;
    }
    this.gravity.setY(
      (this.weight * this.groundWeight) /
        (this.planeHeight - this.position.getY() + 6000) ** 2
    );
    this.accelerate(this.gravity);
  }

  update() {
    this.gravityToBottomPlane();
    // accelerate(force);
    this.orbitate();
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
      this.boundary
    );
    this.renderer(
      this.position.getX(),
      this.position.getY(),
      this.size,
      this.fillColor
    );
  }
}
