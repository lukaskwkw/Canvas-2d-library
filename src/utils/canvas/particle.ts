// import { clearArc, CircleCleanFix } from "./trygonometry";
import Vector from "../vector";
import { bouncingBoundires, BoundriesSelector } from "../math";
import { Point } from "../vector";
import {
  PlaneDimensions,
  PlaneSingleton,
  PlaneDefaultDimensions
} from "./plane";
import { Circle } from "./rendeners";

export interface ParticleFeatures {
  size: number;
  speed?: number;
  direction?: number;
  weight?: number; //0 for no gravity force
  friction?: number; // (0-1) 1 means no friction
  fillColor?: string;
  planeGravity?: boolean;
  boundary?: BoundriesSelector;
}

const FeaturesDefault = {
  size: 5,
  speed: 10,
  direction: -Math.PI / 4,
  weight: 0,
  friction: 1,
  fillColor: "#000",
  planeGravity: undefined,
  angle: 0,
  boundary: undefined
};

class Particle {
  planeDimensions: PlaneDimensions = PlaneDefaultDimensions;
  renderer: Function;
  groundWeight: number;
  position: Vector;
  velocity: Vector;
  gravity: Vector;
  orbitateTo: Particle;
  features: ParticleFeatures = FeaturesDefault;

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

    const features =
      ("size" in particlePositionOrFeatures && particlePositionOrFeatures) ||
      ("size" in particleFeaturesOrRenderer && particleFeaturesOrRenderer);

    this.features = {
      ...this.features,
      ...features
    };

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

      this.renderer = Circle(plane.context)(x, y, this.features.size).renderer;
    }

    this.features.boundary =
      typeof this.features.boundary !== "undefined"
        ? this.features.boundary
        : plane.features.boundaries;

    this.features.planeGravity =
      typeof this.features.planeGravity !== "undefined"
        ? this.features.planeGravity
        : plane.features.plainGravity;

    this.planeDimensions.width = width;
    this.planeDimensions.height = height;
    this.groundWeight = 600000;

    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.gravity = new Vector(0, 0);

    this.velocity.setLength(this.features.speed);
    this.velocity.setAngle(this.features.direction);
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
    gravityVector.setLength(
      (particle.features.weight * this.features.weight) / distance ** 2
    );
    // this.features.angle = Math.atan2(distanceY, distanceX) + Math.PI / 2;
    this.accelerate(gravityVector);
  }

  accelerate(vector: Vector) {
    this.velocity.addTo(vector);
  }

  gravityToBottomPlane() {
    if (!this.features.planeGravity) {
      return;
    }
    this.gravity.setY(
      (this.features.weight * this.groundWeight) /
        (this.planeDimensions.height - this.position.getY() + 6000) ** 2
    );
    this.accelerate(this.gravity);
  }

  update() {
    this.gravityToBottomPlane();
    this.orbitate();
    this.velocity.multiplyTo(this.features.friction);
    this.position.addTo(this.velocity);
  }

  render() {
    this.update();
    bouncingBoundires(
      this.velocity,
      this.position,
      this.planeDimensions,
      this.features.size,
      this.features.boundary
    );

    this.renderer(
      this.position.getX(),
      this.position.getY(),
      this.features.size,
      this.features.fillColor
    );
  }
}

export default Particle;
