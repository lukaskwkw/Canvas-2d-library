
import VelocityParticle, { VelocityFeatures } from "./VelocityParticle";
import { Point, Vector } from "../vector";
import { PlaneDimensions } from "./plane";

interface OrbiteFeatures extends VelocityFeatures {
  weight?: number;
}

interface Orbite {
  gravity: Vector;
  features: GravityFeatures;
}

const setGravity = (
  gravity: Vector,
  weight: number,
  yPosition: number,
  planeHeight: number
) => gravity.setY(planeGravityEquation(weight, yPosition, planeHeight));

class OrbiteParticle extends VelocityParticle implements Gravity {
  gravity: Vector;
  features: GravityFeatures;

  setOrbiteTowards(particle: Particle) {
    this.orbitateTowards.push(particle);
  }

  constructor(
    particlePosition: Point,
    particleFeatures: VelocityFeatures,
    renderer?: Function,
    planeDimensions?: PlaneDimensions
  ) {
    super(particlePosition, particleFeatures, renderer, planeDimensions);
    this.gravity = new Vector(0, 0);

    this.update.add(() => {
      setGravity(
        this.gravity,
        this.features.weight,
        this.position.getY(),
        planeDimensions.height
      );
      this.accelerate(this.gravity);
    });
  }
}

export default OrbiteParticle;




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