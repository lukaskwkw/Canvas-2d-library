import { BoundriesSelector } from "./boundary";
import Vector, { Point } from "../vector";
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

export const DefaultFeatures = {
  ...SimpleFeatures,
  speed: 10,
  direction: -Math.PI / 4,
  weight: 0,
  friction: 1,
  planeGravity: undefined,
  angle: 0,
  boundary: undefined
};

export interface UpdateObject {
  name: string;
  updater(): void;
}

export interface SimpleFeatures {
  size: number;
  fillColor?: string;
}

export interface Simple {
  x: number;
  y: number;
  features: SimpleFeatures;
  renderer: Function;
  update: UpdateObject[];
}

class Particle implements Simple {
  planeDimensions: PlaneDimensions = PlaneDefaultDimensions;
  renderer: Function;
  x: number = 0;
  y: number = 0;
  features: ParticleFeatures;
  context?: CanvasRenderingContext2D;
  update: UpdateObject[] = [];

  constructor(
    particlePosition: Point,
    particleFeatures: ParticleFeatures,
    renderer?: Function,
    planeDimensions?: PlaneDimensions,
    context?: CanvasRenderingContext2D
  ) {
    const plane = new PlaneSingleton();

    this.planeDimensions = planeDimensions || plane.features.dimensions;
    this.context = context || plane.context;
    const { x, y } = particlePosition;

    this.x = x;
    this.y = y;
    this.features = { ...SimpleFeatures, ...particleFeatures };

    if (renderer) {
      this.renderer = renderer;
    } else if (!renderer && this.context) {
      this.renderer = Circle(this.context)(
        { x, y },
        this.features.size
      ).renderer;
    } else {
      throw new Error(
        "No context can be obtained from Singleton, nor renderer is provided for Particle!"
      );
    }
  }

  getPosition(): Point {
    return {
      x: this.x,
      y: this.y
    };
  }

  setPosition(point: Point): void {
    this.x = point.x;
    this.y = point.y;
  }

  render() {
    this.renderer(
      { x: this.x, y: this.y },
      this.features.size,
      this.features.fillColor
    );
  }
}

export default Particle;
