import VelocityParticle, {
  VelocityFeatures,
  UpdateObject
} from "./VelocityParticle";
import { Point, Vector } from "../vector";
import { PlaneDimensions } from "./plane";
import Particle from "./particle";

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

const gravityOrbiteEquation = (m1, m2, distance) =>
  (m1 * m2 * 0.08) / distance ** 2;

const orbiteUpdater = (particleToUpdate: AdvancedGravityParticle) => {
  particleToUpdate.orbites.forEach((particle: AdvancedGravityParticle) => {
    const distanceY =
      particle.position.getY() - particleToUpdate.position.getY();
    const distanceX =
      particle.position.getX() - particleToUpdate.position.getX();
    const distance = Math.sqrt(distanceY ** 2 + distanceX ** 2);

    const gravityVector = new Vector(distanceX, distanceY);
    gravityVector.setAngle(Math.atan2(distanceY, distanceX));
    gravityVector.setLength(
      gravityOrbiteEquation(
        particle.features.weight,
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
