import Particle from "./canvas/particle";
import Vector from "./vector";
import {
  PlaneDefaultBoundaries,
  PlaneDimensions,
  PlaneSingleton
} from "./canvas/plane";

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const topBoundryCheck = (y, offset = 0) => y - offset < 0;
export const bottomBoundryCheck = (y, height, offset = 0) =>
  y + offset >= height;
export const leftBoundryCheck = (x, offset = 0) => x - offset < 0;
export const rightBoundryCheck = (x, width, offset = 0) => x + offset > width;
export const checkBoundaries = ({ x, y }, width, height, offset = 0) =>
  topBoundryCheck(y, offset) ||
  bottomBoundryCheck(y, height, offset) ||
  leftBoundryCheck(x, offset) ||
  rightBoundryCheck(x, width, offset);

export interface BoundriesSelector {
  checkTop?: boolean;
  checkBottom?: boolean;
  checkLeft?: boolean;
  checkRight?: boolean;
}

export const bouncingBoundires = (
  velocity: Vector,
  position: Vector,
  planeDimensions: PlaneDimensions,
  offset: number = 0,
  selector: BoundriesSelector
) => {
  const {
    checkTop = true,
    checkBottom = true,
    checkLeft = true,
    checkRight = true
  } = selector;
  const downgradeBy = -0.9 + Math.random() * 0.3;
  const { height, width } = planeDimensions;

  if (checkTop && topBoundryCheck(position.getY(), offset)) {
    position.setY(offset);
    velocity.setY(velocity.getY() * downgradeBy);
  }

  if (checkBottom && bottomBoundryCheck(position.getY(), height, offset)) {
    position.setY(height - offset);
    velocity.setY(velocity.getY() * downgradeBy);
  }

  if (checkLeft && leftBoundryCheck(position.getX(), offset)) {
    position.setX(offset);
    velocity.setX(velocity.getX() * downgradeBy);
  }

  if (checkRight && rightBoundryCheck(position.getX(), width, offset)) {
    position.setX(width - offset);
    velocity.setX(velocity.getX() * downgradeBy);
  }
};

//Fix for top boundary check as without it goes into loop - draw bottom, draw top
const TopFix = 1;

export const moveToOtherSide = (
  position: Vector,
  offset: number = 0,
  selector: BoundriesSelector = PlaneDefaultBoundaries,
  planeDimensions?: PlaneDimensions
) => {
  const {
    checkTop = true,
    checkBottom = true,
    checkLeft = true,
    checkRight = true
  } = selector;
  const { height, width } =
    planeDimensions || new PlaneSingleton().features.dimensions;

  if (checkTop && topBoundryCheck(position.getY(), offset)) {
    position.setY(height - offset - TopFix);
  }

  if (checkBottom && bottomBoundryCheck(position.getY(), height, offset)) {
    position.setY(offset);
  }

  if (checkLeft && leftBoundryCheck(position.getX(), offset)) {
    position.setX(width - offset);
  }

  if (checkRight && rightBoundryCheck(position.getX(), width, offset)) {
    position.setX(offset);
  }
};

export const removeDeadParticles = (
  particles: Particle[],
  width: number,
  height: number
) => {
  for (let index = 0; index < particles.length; index++) {
    const particle = particles[index];
    const topBoundryCheck = particle.position.getY() < 0;
    const bottomBoundryCheck = particle.position.getY() > height;
    const leftBoundryCheck = particle.position.getX() < 0;
    const rightBoundryCheck = particle.position.getX() > width;
    if (
      topBoundryCheck ||
      bottomBoundryCheck ||
      leftBoundryCheck ||
      rightBoundryCheck
    ) {
      particles.splice(index, 1);
    }
  }
};

export const bottomEmitter = (
  particle: Particle,
  originX: number,
  originY: number,
  speed: number,
  angle: number,
  planeHeight: number
) => {
  if (bottomBoundryCheck(particle.position.getY(), planeHeight)) {
    particle.position.setCords({ x: originX, y: originY });
    particle.velocity.setLength(speed);
    particle.velocity.setAngle(angle);
  }
};
