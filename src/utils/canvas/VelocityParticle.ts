import Particle, { SimpleFeatures, UpdateObject } from "./particle";
import Vector, { Point } from "../vector";
import { PlaneDimensions, PlaneSingleton } from "./plane";
import {
  bouncingBoundires,
  BoundriesSelector,
  BOUNDARY_UPDATERS
} from "./boundary";
import { some } from "../../utils/object";

const UPDATERS = {
  FRICTION: "friction",
  VELOCITY: "velocity"
};

interface Velocity {
  velocityX: number;
  velocityY: number;
  features: VelocityFeatures;
  attachFriction(value?: number): any;
  addBoundaryFunction(func: Function, args: any[]): any;
  accelerate(ax: number, ay: number): void;
  render: Function;
}

export interface VelocityFeatures extends SimpleFeatures {
  speed?: number;
  direction?: number;
  friction?: number; // (0-1) 1 means no friction
  boundary?: BoundriesSelector;
}

const friction = (particleV: VelocityParticle, friction: number) => () => {
  particleV.velocityX * friction;
  particleV.velocityY * friction;
};

const DefaultVelocityFeatures = {
  speed: 10,
  direction: -Math.PI / 4,
  friction: 1
};
const piDoubled = Math.PI * 2;

class VelocityParticle extends Particle implements Velocity {
  velocityX: number;
  velocityY: number;
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

    this.velocityX = Math.cos(direction) * speed;
    this.velocityY = Math.sin(direction) * speed;

    this.update.push({
      name: UPDATERS.VELOCITY,
      updater: () => {
        this.x += this.velocityX;
        this.y += this.velocityY;
      }
    });

    if (friction > 0 && friction < 1) {
      this.attachFriction(friction);
    }

    const boundary =
      this.features.boundary || new PlaneSingleton().features.boundaries;

    // if (boundary && some(boundary)(key => boundary[key] === true)) {
    //   this.addBoundaryFunction(bouncingBoundires, [
    //     this.velocity,
    //     this.position,
    //     this.planeDimensions,
    //     size,
    //     boundary
    //   ]);
    // }
  }

  setVelocity(angle: number, speed: number) {
    this.velocityX = Math.cos(angle) * speed;
    this.velocityY = Math.sin(angle) * speed;
  }

  accelerate(accelerateX, accelerateY) {
    this.velocityX += accelerateX;
    this.velocityY += accelerateY;
  }

  attachFriction(value = this.features.friction) {
    this.features.friction = value;
    this.update.push({
      name: UPDATERS.FRICTION,
      updater: friction(this, this.features.friction)
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

    const { context: ctx, x, y } = this;
    // cxt.beginPath();
    // cxt.arc(x, y, 4, 0, piDoubled, false);
    // cxt.fill();
    this.renderer(
      this.getPosition(),
      this.features.size,
      this.features.fillColor
    );
  }
}

export default VelocityParticle;
