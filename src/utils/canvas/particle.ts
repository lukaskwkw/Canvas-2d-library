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

const SimpleFeatures = {
  fillColor: "#000",
  size: 5
};

const Features = {
  ...SimpleFeatures,
  speed: 10,
  direction: -Math.PI / 4,
  weight: 0,
  friction: 1,
  planeGravity: undefined,
  angle: 0,
  boundary: undefined
};

const gravityOrbiteEquation = (m1, m2, distance) =>
  (m1 * m2 * 0.08) / distance ** 2;

interface OrbitePoint extends Point {
  weight: number;
}

export interface SimpleFeatures {
  size: number;
  fillColor?: string;
}

export interface Simple {
  position: Vector;
  features: SimpleFeatures;
  renderer: Function;
}

class Particle implements Simple {
  planeDimensions: PlaneDimensions = PlaneDefaultDimensions;
  renderer: Function;
  position: Vector;
  features: ParticleFeatures;

  constructor(
    particlePosition: Point,
    particleFeatures: ParticleFeatures,
    renderer?: Function,
    planeDimensions?: PlaneDimensions
  ) {
    const plane = new PlaneSingleton();

    this.planeDimensions = planeDimensions || plane.features.dimensions;
    const { x, y } = particlePosition;

    this.features = { ...SimpleFeatures, ...particleFeatures };

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
  }

  render() {
    this.renderer(
      this.position.getCords(),
      this.features.size,
      this.features.fillColor
    );
  }
}

export default Particle;
