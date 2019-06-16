import Particle, { SimpleFeatures } from "./particle";
import Vector, { Point } from "../vector";
import { PlaneDimensions, PlaneSingleton } from "./plane";
import {
  bouncingBoundires,
  BoundriesSelector,
  BOUNDARY_UPDATERS
} from "../boundary";
import { some } from "../../utils/object";

const UPDATERS = {
  FRICTION: "friction",
  VELOCITY: "velocity"
};

export interface UpdateObject {
  name: string;
  updater(): void;
}

interface Velocity {
  velocity: Vector;
  features: VelocityFeatures;
  update: UpdateObject[];
  attachFriction(value?: number): any;
  addBoundaryFunction(func: Function, args: any[]): any;
  accelerate(vector: Vector): void;
  render: Function;
}

export interface VelocityFeatures extends SimpleFeatures {
  speed?: number;
  direction?: number;
  friction?: number; // (0-1) 1 means no friction
  boundary?: BoundriesSelector;
}

const friction = (velocity: Vector, friction: number) => () =>
  velocity.multiplyTo(friction);

const DefaultVelocityFeatures = {
  speed: 10,
  direction: -Math.PI / 4,
  friction: 1
};

class VelocityParticle extends Particle implements Velocity {
  velocity: Vector = new Vector(0, 0);
  update: UpdateObject[] = [];
  features: VelocityFeatures;

  constructor(
    particlePosition: Point,
    particleFeatures: VelocityFeatures,
    renderer?: Function,
    planeDimensions?: PlaneDimensions
  ) {
    super(particlePosition, particleFeatures, renderer, planeDimensions);

    this.features = { ...DefaultVelocityFeatures, ...particleFeatures };

    const { speed, size, direction, friction } = this.features;

    this.velocity = new Vector(0, 0);
    this.velocity.setLength(speed);
    this.velocity.setAngle(direction);
    this.update.push({
      name: UPDATERS.VELOCITY,
      updater: () => this.position.addTo(this.velocity)
    });

    if (friction > 0 && friction < 1) {
      this.attachFriction(friction);
    }

    const boundary =
      this.features.boundary || new PlaneSingleton().features.boundaries;

    if (boundary && some(boundary)(key => boundary[key] === true)) {
      this.addBoundaryFunction(bouncingBoundires, [
        this.velocity,
        this.position,
        this.planeDimensions,
        size,
        boundary
      ]);
    }
  }

  accelerate(vector: Vector) {
    this.velocity.addTo(vector);
  }

  attachFriction(value = this.features.friction) {
    this.features.friction = value;
    this.update.push({
      name: UPDATERS.FRICTION,
      updater: friction(this.velocity, this.features.friction)
    });
  }

  addBoundaryFunction(func: Function, args: any[]) {
    for (let i = 0; i < this.update.length; i++) {
      if (this.update[i].name === BOUNDARY_UPDATERS.BOUNDARY) {
        this.update.splice(i, 1);
      }
    }
    this.update.push({
      name: BOUNDARY_UPDATERS.BOUNDARY,
      updater: () => func.apply(this, args)
    });
  }

  render() {
    this.update.forEach(({ updater }: UpdateObject) => {
      updater();
    });
    this.renderer(
      this.position.getCords(),
      this.features.size,
      this.features.fillColor
    );
  }
}

export default VelocityParticle;
