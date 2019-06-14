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

const groundWeight = 600000;
const groundRadius = 6000;
const gravityOrbiteEquation = (m1, m2, distance) =>
  (m1 * m2 * 0.08) / distance ** 2;
const planeGravityEquation = (particleWeight, particleYPosition, planeHeight) =>
  (particleWeight * groundWeight) /
  (planeHeight - particleYPosition + groundRadius) ** 2;

interface OrbitePoint extends Point {
  weight: number;
}

class Particle {
  planeDimensions: PlaneDimensions = PlaneDefaultDimensions;
  renderer: Function;
  position: Vector;
  velocity: Vector;
  gravity: Vector;
  orbitateTowards: Particle[] = [];
  features: ParticleFeatures = FeaturesDefault;

  constructor(
    particlePosition: Point,
    particleFeatures: ParticleFeatures,
    renderer?: Function,
    planeDimensions?: PlaneDimensions
  ) {
    const plane = new PlaneSingleton();

    this.planeDimensions = planeDimensions || plane.features.dimensions;
    const { x, y } = particlePosition;

    this.features = { ...FeaturesDefault, ...particleFeatures };

    if (renderer) {
      this.renderer = renderer;
    } else if (!renderer && plane.context) {
      this.renderer = Circle(plane.context)(
        { x, y },
        this.features.size
      ).renderer;
    } else {
      throw new Error(
        "No context can be obtained from Singleton, nor renderer is provided for Particle!"
      );
    }

    this.features.boundary =
      typeof this.features.boundary !== "undefined"
        ? this.features.boundary
        : plane.features.boundaries;

    this.features.planeGravity =
      typeof this.features.planeGravity !== "undefined"
        ? this.features.planeGravity
        : plane.features.plainGravity;

    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.gravity = new Vector(0, 0);

    this.velocity.setLength(this.features.speed);
    this.velocity.setAngle(this.features.direction);
  }

  setOrbiteTowards(particle: Particle) {
    this.orbitateTowards.push(particle);
  }

  orbitate() {
    if (this.orbitateTowards.length === 0) {
      return;
    }

    this.orbitateTowards.forEach((particle: Particle) => {
      const distanceY = particle.position.getY() - this.position.getY();
      const distanceX = particle.position.getX() - this.position.getX();
      const distance = Math.sqrt(distanceY ** 2 + distanceX ** 2);

      const gravityVector = new Vector(distanceX, distanceY);
      gravityVector.setAngle(Math.atan2(distanceY, distanceX));
      gravityVector.setLength(
        gravityOrbiteEquation(
          particle.features.weight,
          this.features.weight,
          distance
        )
      );
      this.accelerate(gravityVector);
    });
  }

  accelerate(vector: Vector) {
    this.velocity.addTo(vector);
  }

  gravityToBottomPlane() {
    if (!this.features.planeGravity) {
      return;
    }
    this.gravity.setY(
      planeGravityEquation(
        this.features.weight,
        this.position.getY(),
        this.planeDimensions.height
      )
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
      this.position.getCords(),
      this.features.size,
      this.features.fillColor
    );
  }
}

export default Particle;
