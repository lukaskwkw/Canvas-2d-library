import Particle from "./particle";
import { Point } from "../vector";
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
  particle: VelocityParticle,
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
        particle.y = offset;
        particle.velocityY = particle.velocityY * downgradeBy;
      }
    },
    actionBottom: () => {
      if (checkBottom) {
        particle.y = height - offset;
        particle.velocityY = particle.velocityY * downgradeBy;
      }
    },
    actionLeft: () => {
      if (checkLeft) {
        particle.x = offset;
        particle.velocityX = particle.velocityX * downgradeBy;
      }
    },
    actionRight: () => {
      if (checkRight) {
        particle.x = width - offset;
        particle.velocityX = particle.velocityX * downgradeBy;
      }
    }
  };

  onBoundaryCrossing(particle, offset, actions);
};

//Fix for top boundary check as without it goes into loop - draw bottom, draw top
const TopFix = 1;

export const moveToOtherSide = (
  position: Point,
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
    actionTop: () => {
      if (checkTop) {
        position.y = height - offset - TopFix;
      }
    },
    actionBottom: () => {
      if (checkBottom) {
        position.y = offset;
      }
    },
    actionLeft: () => {
      if (checkLeft) {
        position.x = width - offset;
      }
    },
    actionRight: () => {
      if (checkRight) {
        position.x = offset;
      }
    }
  };

  onBoundaryCrossing(position, offset, actions);
};

export const removeDeadParticles = (particles: Particle[], offset?: number) => {
  for (let index = 0; index < particles.length; index++) {
    const particle = particles[index];
    const position = particle.getPosition();
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
    particle.setPosition({ x, y });
    particle.setVelocity(angle, speed);
  };

  onBoundaryCrossing(
    particle.getPosition(),
    offset || particle.features.size,
    emitParticle
  );
};
