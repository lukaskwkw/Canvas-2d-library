import Particle from "./particle";
import Vector, { Point } from "../vector";
import {
  PlaneDefaultBoundaries,
  PlaneDimensions,
  PlaneSingleton
} from "./plane";
import VelocityParticle from "./VelocityParticle";

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

export const BOUNDARY_UPDATERS = {
  BOUNDARY: "boundary"
};

export interface BoundriesSelector {
  checkTop?: boolean;
  checkBottom?: boolean;
  checkLeft?: boolean;
  checkRight?: boolean;
}

export interface BoundriesAction {
  actionTop?: Function;
  actionBottom?: Function;
  actionLeft?: Function;
  actionRight?: Function;
}

const onBoundaryCrossing = (
  position: Point,
  offset: number,
  boundariesAction: Function | BoundriesAction,
  planeDimensions?: PlaneDimensions
) => {
  const oneFunctionForAll =
    typeof boundariesAction === "function" ? boundariesAction : undefined;

  const { actionTop, actionBottom, actionLeft, actionRight } =
    typeof boundariesAction !== "function" && boundariesAction;

  const { x, y } = position;
  const { width, height } =
    planeDimensions || new PlaneSingleton().features.dimensions;

  if ((oneFunctionForAll || actionTop) && topBoundryCheck(y, offset)) {
    oneFunctionForAll ? oneFunctionForAll() : actionTop();
  }

  if (
    (oneFunctionForAll || actionBottom) &&
    bottomBoundryCheck(y, height, offset)
  ) {
    oneFunctionForAll ? oneFunctionForAll() : actionBottom();
  }

  if ((oneFunctionForAll || actionLeft) && leftBoundryCheck(x, offset)) {
    oneFunctionForAll ? oneFunctionForAll() : actionLeft();
  }

  if (
    (oneFunctionForAll || actionRight) &&
    rightBoundryCheck(x, width, offset)
  ) {
    oneFunctionForAll ? oneFunctionForAll() : actionRight();
  }
};

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

  const actions = {
    actionTop: () => {
      if (checkTop) {
        position.setY(offset);
        velocity.setY(velocity.getY() * downgradeBy);
      }
    },
    actionBottom: () => {
      if (checkBottom) {
        position.setY(height - offset);
        velocity.setY(velocity.getY() * downgradeBy);
      }
    },
    actionLeft: () => {
      if (checkLeft) {
        position.setX(offset);
        velocity.setX(velocity.getX() * downgradeBy);
      }
    },
    actionRight: () => {
      if (checkRight) {
        position.setX(width - offset);
        velocity.setX(velocity.getX() * downgradeBy);
      }
    }
  };

  onBoundaryCrossing(position.getCords(), offset, actions);
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

  const actions = {
    actionTop: () => checkTop && position.setY(height - offset - TopFix),
    actionBottom: () => checkBottom && position.setY(offset),
    actionLeft: () => checkLeft && position.setX(width - offset),
    actionRight: () => checkRight && position.setX(offset)
  };

  onBoundaryCrossing(position.getCords(), offset, actions);
};

export const removeDeadParticles = (particles: Particle[], offset?: number) => {
  for (let index = 0; index < particles.length; index++) {
    const particle = particles[index];
    const position = particle.position.getCords();
    onBoundaryCrossing(position, offset || particle.features.size, () =>
      particles.splice(index, 1)
    );
  }
};

export const emmitter = (
  positionToSetAfter: Point,
  speed: number,
  angle: number,
  particle: VelocityParticle,
  offset?: number
) => {
  const { x, y } = positionToSetAfter;

  const emitParticle = () => {
    particle.position.setCords({ x, y });
    particle.velocity.setLength(speed);
    particle.velocity.setAngle(angle);
  };

  onBoundaryCrossing(
    particle.position.getCords(),
    offset || particle.features.size,
    emitParticle
  );
};
