import VelocityParticle, {
  VelocityFeatures,
  UpdateObject
} from "./VelocityParticle";
import { Point, Vector } from "../vector";
import { PlaneDimensions } from "./plane";
import Particle from "./particle";

const UPDATERS = {
  PLAIN_GRAVITY: "plain gravity"
};

const groundWeight = 600000;
const groundRadius = 6000;
const planeGravityEquation = (
  particleWeight: number,
  particleYPosition: number,
  planeHeight: number
) =>
  (particleWeight * groundWeight) /
  (planeHeight - particleYPosition + groundRadius) ** 2;

interface GravityFeatures extends VelocityFeatures {
  weight?: number;
  orbites?: Array<Particle>;
}

interface Gravity {
  gravity: Vector;
  features: GravityFeatures;
  setGravityTowards(particle: Particle): void;
  togglePlainGravitation(): void;
}

const setPlainGravity = (
  gravity: Vector,
  weight: number,
  yPosition: number,
  planeHeight: number
) => gravity.setY(planeGravityEquation(weight, yPosition, planeHeight));

class GravityParticle extends VelocityParticle implements Gravity {
  gravity: Vector;
  features: GravityFeatures;

  setGravityTowards(particle: Particle) {
    this.features.orbites.push(particle);
  }

  togglePlainGravitation() {
    const foundIndex = this.update.findIndex(
      ({ name }: UpdateObject) => name === UPDATERS.PLAIN_GRAVITY
    );

    if (foundIndex > -1) {
      this.update.splice(foundIndex, 1);
      return;
    }

    this.update.push({
      name: UPDATERS.PLAIN_GRAVITY,
      updater: () => {
        setPlainGravity(
          this.gravity,
          this.features.weight,
          this.position.getY(),
          this.planeDimensions.height
        );
        this.accelerate(this.gravity);
      }
    });
  }

  constructor(
    particlePosition: Point,
    particleFeatures: GravityFeatures,
    renderer?: Function,
    planeDimensions?: PlaneDimensions
  ) {
    super(particlePosition, particleFeatures, renderer, planeDimensions);

    const { orbites } = this.features;

    if (orbites && orbites.length > 0) {
      return;
    }

    this.gravity = new Vector(0, 0);
    this.update.push({
      name: UPDATERS.PLAIN_GRAVITY,
      updater: () => {
        setPlainGravity(
          this.gravity,
          this.features.weight,
          this.position.getY(),
          planeDimensions.height
        );
        this.accelerate(this.gravity);
      }
    });
  }
}

export default GravityParticle;
