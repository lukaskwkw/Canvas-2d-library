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
  gravityX: number;
  gravityY: number;
  features: PlainGravityFeatures;
  togglePlainGravitation(): void;
}

const setPlainGravity = (
  particePG: PlainGravityParticle,
  planeHeight: number
) =>
  (particePG.gravityY = planeGravityEquation(
    particePG.features.weight,
    particePG.y,
    planeHeight
  ));

const plainGravityUpdater = (particleToUpdate: PlainGravityParticle) => {
  const {
    gravityY,
    planeDimensions: { height }
  } = particleToUpdate;
  setPlainGravity(particleToUpdate, height);
  particleToUpdate.accelerate(0, gravityY);
};

export class PlainGravityParticle extends VelocityParticle
  implements PlainGravity {
  gravityX: number = 0;
  gravityY: number = 0;
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
    particleToUpdate.x = -10000;
    particleToUpdate.y = -10000;
  }
};

const orbiteUpdater = (particleToUpdate: AdvancedGravityParticle) => {
  particleToUpdate.orbites.forEach((graviter: AdvancedGravityParticle) => {
    const distanceX = graviter.x - particleToUpdate.x;
    const distanceY = graviter.y - particleToUpdate.y;
    const distance = Math.sqrt(distanceY ** 2 + distanceX ** 2);
    const gravityForce = gravityOrbiteEquation(
      graviter.features.weight,
      particleToUpdate.features.weight,
      distance
    );

    const orbitingForceX = (distanceX / distance) * gravityForce;
    const orbitingForceY = (distanceY / distance) * gravityForce;

    checkHit(particleToUpdate, graviter, distance);

    particleToUpdate.accelerate(orbitingForceX, orbitingForceY);
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
