import VelocityParticle, { VelocityFeatures } from "./VelocityParticle";
import { Point, Vector } from "../vector";
import { PlaneDimensions } from "./plane";
import Particle, { UpdateObject } from "./particle";

const UPDATERS = {
  PLAIN_GRAVITY: "plain gravity",
  ORBITING: "orbiting"
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

const DefaultGravityFeatures = { orbites: [], weight: 0, size: 5 };

export interface PlainGravityFeatures extends VelocityFeatures {
  weight?: number;
}

interface PlainGravity {
  gravity: Vector;
  features: PlainGravityFeatures;
  togglePlainGravitation(): void;
}

const setPlainGravity = (
  gravity: Vector,
  weight: number,
  yPosition: number,
  planeHeight: number
) => gravity.setY(planeGravityEquation(weight, yPosition, planeHeight));

const plainGravityUpdater = (particleToUpdate: PlainGravityParticle) => {
  setPlainGravity(
    particleToUpdate.gravity,
    particleToUpdate.features.weight,
    particleToUpdate.position.getY(),
    particleToUpdate.planeDimensions.height
  );
  particleToUpdate.accelerate(particleToUpdate.gravity);
};

export class PlainGravityParticle extends VelocityParticle
  implements PlainGravity {
  gravity: Vector = new Vector(0, 0);
  features: PlainGravityFeatures;

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
      updater: () => plainGravityUpdater(this)
    });
  }

  constructor(
    particlePosition: Point,
    particleFeatures: PlainGravityFeatures,
    renderer?: Function,
    planeDimensions?: PlaneDimensions
  ) {
    super(particlePosition, particleFeatures, renderer, planeDimensions);

    this.features = { ...DefaultGravityFeatures, ...particleFeatures };

    this.update.push({
      name: UPDATERS.PLAIN_GRAVITY,
      updater: () => plainGravityUpdater(this)
    });
  }
}

interface AdvancedGravity {
  setGravityTowards(particle: Particle): void;
  orbites: AdvancedGravityParticle[];
}

const GravityConst = 0.008;

const gravityOrbiteEquation = (m1, m2, distance) =>
  (m1 * m2 * GravityConst) / distance ** 2;

const checkHit = (
  particleToUpdate: AdvancedGravityParticle,
  graviter: AdvancedGravityParticle,
  distance: number
) => {
  if (distance <= graviter.features.size) {
    //Set particle out of plane => emit it again / remove it
    particleToUpdate.position.setCords({
      x: -10000,
      y: -10000
    });
  }
};

const orbiteUpdater = (particleToUpdate: AdvancedGravityParticle) => {
  particleToUpdate.orbites.forEach((graviter: AdvancedGravityParticle) => {
    const distanceY =
      graviter.position.getY() - particleToUpdate.position.getY();
    const distanceX =
      graviter.position.getX() - particleToUpdate.position.getX();
    const distance = Math.sqrt(distanceY ** 2 + distanceX ** 2);

    checkHit(particleToUpdate, graviter, distance);
    const gravityVector = new Vector(distanceX, distanceY);
    gravityVector.setAngle(Math.atan2(distanceY, distanceX));
    gravityVector.setLength(
      gravityOrbiteEquation(
        graviter.features.weight,
        particleToUpdate.features.weight,
        distance
      )
    );
    particleToUpdate.accelerate(gravityVector);
  });
};

export class AdvancedGravityParticle extends VelocityParticle
  implements AdvancedGravity {
  features: PlainGravityFeatures;
  orbites: AdvancedGravityParticle[] = [];

  constructor(
    particlePosition: Point,
    particleFeatures: PlainGravityFeatures,
    renderer?: Function,
    planeDimensions?: PlaneDimensions
  ) {
    super(particlePosition, particleFeatures, renderer, planeDimensions);

    this.features = { ...DefaultGravityFeatures, ...particleFeatures };
    const { orbites } = this;

    if (orbites && orbites.length > 0) {
      this.update.push({
        name: UPDATERS.ORBITING,
        updater: () => orbiteUpdater(this)
      });
    }
  }

  setGravityTowards(particle: AdvancedGravityParticle) {
    this.orbites.push(particle);

    const foundIndex = this.update.findIndex(
      ({ name }: UpdateObject) => name === UPDATERS.ORBITING
    );

    if (foundIndex === -1) {
      this.update.push({
        name: UPDATERS.ORBITING,
        updater: () => orbiteUpdater(this)
      });
      return;
    }
  }
}
