import Particle, { ParticleFeatures, Simple, SimpleFeatures } from "./particle";
import Vector, { Point } from "../vector";
import { PlaneDimensions } from "./plane";
import { bouncingBoundires } from "../math";

const UPDATERS = {
  FRICTION: "friction",
  BOUNDARY: "boundary",
  VOLCITY: "volcity"
};

export interface UpdateObject {
  name: string;
  updater(): void;
}

interface Velocity {
  velocity: Vector;
  features: VelocityFeatures;
  update: Array<UpdateObject>;
  attachFriction: Function;
  addBoundaryFunction: Function;
  accelerate: Function;
  render: Function;
}

export interface VelocityFeatures extends SimpleFeatures {
  speed?: number;
  direction?: number;
  friction?: number; // (0-1) 1 means no friction
}

//TODO: Check this pointer
const friction = (velocity: Vector, friction: number) => () =>
  velocity.multiplyTo(friction);

// const addVelocity = (position: Vector, velocity: Vector) => () =>
//   position.addTo(velocity);

class VelocityParticle extends Particle implements Velocity {
  velocity: Vector;
  update: Array<UpdateObject>;
  features: VelocityFeatures;

  accelerate(vector: Vector) {
    this.velocity.addTo(vector);
  }

  attachFriction(value) {
    this.update.push({
      name: UPDATERS.FRICTION,
      updater: friction(this.velocity, value)
    });
  }

  addBoundaryFunction(func: Function, args: Array<any>) {
    this.update.push({
      name: UPDATERS.BOUNDARY,
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

  constructor(
    particlePosition: Point,
    particleFeatures: VelocityFeatures,
    renderer?: Function,
    planeDimensions?: PlaneDimensions
  ) {
    super(particlePosition, particleFeatures, renderer, planeDimensions);

    this.velocity = new Vector(0, 0);
    // if (this.features.speed > 0) {
    this.velocity.setLength(this.features.speed);
    this.velocity.setAngle(this.features.direction);
    this.update.push({
      name: UPDATERS.VOLCITY,
      updater: () => this.position.addTo(this.velocity)
    });
    // this.update.add(addVelocity(this.position, this.velocity));
    // }

    if (this.features.friction > 0 && this.features.friction < 1) {
      this.attachFriction(this.features.friction);
    }

    //todo: make condintional
    this.addBoundaryFunction(bouncingBoundires, [
      this.velocity,
      this.position,
      this.planeDimensions,
      this.features.size,
      { checkBottom: true }
    ]);
  }
}

export default VelocityParticle;
