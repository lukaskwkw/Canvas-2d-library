import { Point } from "./vector";

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
