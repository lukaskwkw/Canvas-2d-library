import Particle from "./canvas/particle";
import Vector, { Point } from "./vector";
import {
  PlaneDefaultBoundaries,
  PlaneDimensions,
  PlaneSingleton
} from "./canvas/plane";

export const randomX = (
  offset: number = 0,
  planeDimensions: PlaneDimensions = new PlaneSingleton().features.dimensions
) => offset + Math.random() * (planeDimensions.width - offset - offset);

export const randomY = (
  offset: number = 0,
  planeDimensions: PlaneDimensions = new PlaneSingleton().features.dimensions
) => offset + Math.random() * (planeDimensions.height - offset - offset);

export const randomPoint = (
  offset: number = 0,
  planeDimensions?: PlaneDimensions
): Point => {
  const { width, height } =
    planeDimensions || new PlaneSingleton().features.dimensions;
  return {
    x: offset + Math.random() * (width - offset - offset),
    y: offset + Math.random() * (height - offset - offset)
  };
};

export const connectDots = (
  points: Point[],
  context: CanvasRenderingContext2D = new PlaneSingleton().context
) => {
  for (let index = 0; index < points.length - 1; index++) {
    const point = points[index];
    const nextPoint = points[index + 1];
    context.moveTo(point.x, point.y);
    context.lineTo(nextPoint.x, nextPoint.y);
  }
};

export const connectDotsAndStroke = (
  points: Point[],
  context: CanvasRenderingContext2D = new PlaneSingleton().context
) => {
  context.beginPath();
  connectDots(points);
  context.stroke();
};

export const lineInterpolation = (t: number, p1: Point, p2: Point): Point => {
  return { x: (1 - t) * p1.x + t * p2.x, y: (1 - t) * p1.y + t * p2.y };
};

export const quadricBezierIteration = (
  t: number,
  startPoint: Point,
  controlPoint: Point,
  endPoint: Point,
  pFinal
) => {
  pFinal = pFinal || {};
  pFinal.x =
    Math.pow(1 - t, 2) * startPoint.x +
    (1 - t) * 2 * t * controlPoint.x +
    t * t * endPoint.x;
  pFinal.y =
    Math.pow(1 - t, 2) * startPoint.y +
    (1 - t) * 2 * t * controlPoint.y +
    t * t * endPoint.y;
  return pFinal;
};

export const cubicBezierIteration = (
  t: number,
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  pFinal
) => {
  pFinal = pFinal || {};
  pFinal.x =
    Math.pow(1 - t, 3) * p0.x +
    Math.pow(1 - t, 2) * 3 * t * p1.x +
    (1 - t) * 3 * t * t * p2.x +
    t * t * t * p3.x;
  pFinal.y =
    Math.pow(1 - t, 3) * p0.y +
    Math.pow(1 - t, 2) * 3 * t * p1.y +
    (1 - t) * 3 * t * t * p2.y +
    t * t * t * p3.y;
  return pFinal;
};

export const moveAlongMultiQuadricBaziers = (
  intervals: number,
  points: Point[]
) => {
  const pointsLength = points.length;

  let t = 1 / intervals;
  const [firstStartPoint, firstControlPoint, firstEndPoint] = points;

  //Must be at least 4 points todo: make compatibile with min 3 points
  if (pointsLength < 4) {
    return () => firstStartPoint;
  }

  const firstMiddleEnd = {
    x: (firstControlPoint.x + firstEndPoint.x) / 2,
    y: (firstControlPoint.y + firstEndPoint.y) / 2
  };

  const penultimatePoint = points[pointsLength - 2];
  const lastPoint = points[pointsLength - 1];
  let index = 1;

  return (): Point => {
    if (t > 1) {
      t = 1 / intervals;
      index++;
    }
    if (index + 2 > pointsLength) {
      return points[pointsLength - 1];
    }
    t += 1 / intervals;

    if (index < 2) {
      return quadricBezierIteration(
        t,
        firstStartPoint,
        firstControlPoint,
        firstMiddleEnd,
        false
      );
    }

    const startPoint = points[index - 1];
    const controlPoint = points[index];
    const startPointMiddle = {
      x: (startPoint.x + controlPoint.x) / 2,
      y: (startPoint.y + controlPoint.y) / 2
    };

    if (index + 3 > pointsLength) {
      return quadricBezierIteration(
        t,
        startPointMiddle,
        penultimatePoint,
        lastPoint,
        false
      );
    }

    const endPoint = points[index + 1];
    const endPointMiddle = {
      x: (controlPoint.x + endPoint.x) / 2,
      y: (controlPoint.y + endPoint.y) / 2
    };

    return quadricBezierIteration(
      t,
      startPointMiddle,
      controlPoint,
      endPointMiddle,
      false
    );
  };
};

export const drawMultiMiddleQudricBeziers = (
  points: Point[],
  context: CanvasRenderingContext2D = new PlaneSingleton().context
): void => {
  const lengthOfPoints = points.length;
  if (lengthOfPoints < 3) {
    return;
  }
  const [firstPoint] = points;
  context.beginPath();
  context.moveTo(firstPoint.x, firstPoint.y);
  let index = 1;
  for (index; index < points.length - 2; index++) {
    const controlPoint = points[index];
    const endPoint = points[index + 1];
    context.quadraticCurveTo(
      controlPoint.x,
      controlPoint.y,
      (controlPoint.x + endPoint.x) / 2,
      (controlPoint.y + endPoint.y) / 2
    );
  }

  const penultimatePoint = points[index];
  const lastPoint = points[index + 1];
  context.quadraticCurveTo(
    penultimatePoint.x,
    penultimatePoint.y,
    lastPoint.x,
    lastPoint.y
  );
  context.stroke();
};

export const drawCubicBezier = (
  intervals: number,
  pointA: Point,
  pointB: Point,
  pointC: Point,
  pointD: Point,
  context: CanvasRenderingContext2D = new PlaneSingleton().context
) => {
  context.beginPath();
  for (let t = 1; t <= intervals - 1; t++) {
    const point = cubicBezierIteration(
      t / intervals,
      pointA,
      pointB,
      pointC,
      pointD,
      false
    );
    const nextPoint = cubicBezierIteration(
      (t + 1) / intervals,
      pointA,
      pointB,
      pointC,
      pointD,
      false
    );
    connectDots([point, nextPoint]);
  }
  context.stroke();
};

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
  particle: Particle,
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
