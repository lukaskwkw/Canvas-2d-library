import { Point } from "../vector";
// import { rangeOf } from "../array";

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

function* iterateOver(intervals, func) {
  const iterationSpeed = 1 / intervals;
  const maxIterationValue = 1 - iterationSpeed;
  let t = 0;

  while (t <= maxIterationValue) {
    t += iterationSpeed;
    yield func(t);
  }
}

const getMiddleOfTwoPoints = (A: Point, B: Point) => ({
  x: (A.x + B.x) / 2,
  y: (A.y + B.y) / 2
});

export function* moveAlongMultiQuadricBaziersGen(
  intervals: number,
  originPoints: Point[]
) {
  const pointsLength = originPoints.length;
  //Must be at least 4 points todo: make compatibile with min 3 points
  if (pointsLength < 4) {
    return;
  }

  let [firstStartPoint, firstControlPoint, firstEndPoint] = originPoints;

  let firstMiddleEnd = getMiddleOfTwoPoints(firstControlPoint, firstEndPoint);

  for (const iterator of iterateOver(intervals, step =>
    quadricBezierIteration(
      step,
      firstStartPoint,
      firstControlPoint,
      firstMiddleEnd,
      false
    )
  )) {
    yield iterator;
  }

  let endPointMiddle = {
    x: 0,
    y: 0
  };

  for (let index = 2; index + 2 < pointsLength; index++) {
    const [startPoint, controlPoint, endPoint] = originPoints.slice(
      index - 1,
      index + 2
    );
    const startPointMiddle = getMiddleOfTwoPoints(startPoint, controlPoint);

    endPointMiddle = getMiddleOfTwoPoints(controlPoint, endPoint);

    for (const iterator of iterateOver(intervals, step =>
      quadricBezierIteration(
        step,
        startPointMiddle,
        controlPoint,
        endPointMiddle,
        false
      )
    )) {
      yield iterator;
    }
  }

  let [penultimatePoint, lastPoint] = originPoints.slice(
    pointsLength - 2,
    pointsLength
  );

  for (const iterator of iterateOver(intervals, step =>
    quadricBezierIteration(
      step,
      endPointMiddle,
      penultimatePoint,
      lastPoint,
      false
    )
  )) {
    yield iterator;
  }
}

//TODO: implement compatible with interaction version of that^ function

/* export function* moveAlongMultiQuadricBaziersGen(
  intervals: number,
  originPoints: Point[]
) {
  const pointsLength = originPoints.length;
  //Must be at least 4 points todo: make compatibile with min 3 points
  if (pointsLength < 4) {
    return;
  }

  let [firstStartPoint, firstControlPoint, firstEndPoint] = originPoints;

  let firstMiddleEnd = getMiddleOfTwoPoints(firstControlPoint, firstEndPoint);

  for (const iterator of iterateOver(intervals, step =>
    quadricBezierIteration(
      step,
      firstStartPoint,
      firstControlPoint,
      firstMiddleEnd,
      false
    )
  )) {
    yield iterator;
  }

  const getBodyPoints = (points, index) => {
    const [startPoint, controlPoint, endPoint] = points.slice(
      index - 1,
      index + 2
    );
    const startPointMiddle = getMiddleOfTwoPoints(startPoint, controlPoint);

    const endPointMiddle = getMiddleOfTwoPoints(controlPoint, endPoint);

    return [startPointMiddle, controlPoint, endPointMiddle];
  };

  let [startPointMiddle, controlPoint, endPointMiddle] = rangeOf(3, () => ({
    x: 0,
    y: 0
  }));

  for (let index = 2; index + 2 < pointsLength; index++) {
    const iterationSpeed = 1 / intervals;
    const maxIterationValue = 1 - iterationSpeed;
    let t = 0;

    [startPointMiddle, controlPoint, endPointMiddle] = getBodyPoints(
      originPoints,
      index
    );

    while (t <= maxIterationValue) {
      const newPoints: Array<Point> = yield quadricBezierIteration(
        t,
        startPointMiddle,
        controlPoint,
        endPointMiddle,
        false
      );
      if (newPoints) {
        originPoints = newPoints;
        [startPointMiddle, controlPoint, endPointMiddle] = getBodyPoints(
          originPoints,
          index
        );
      }

      t += iterationSpeed;
    }
  }

  let [penultimatePoint, lastPoint] = originPoints.slice(
    pointsLength - 2,
    pointsLength
  );

  for (const iterator of iterateOver(intervals, step =>
    quadricBezierIteration(
      step,
      endPointMiddle,
      penultimatePoint,
      lastPoint,
      false
    )
  )) {
    yield iterator;
  }
} */

export const moveAlongMultiQuadricBaziers = (
  intervals: number,
  originPoints: Point[]
) => {
  const pointsLength = originPoints.length;

  let t = 1 / intervals;
  let [firstStartPoint, firstControlPoint, firstEndPoint] = originPoints;

  //Must be at least 4 points todo: make compatibile with min 3 points
  if (pointsLength < 4) {
    return () => firstStartPoint;
  }

  let firstMiddleEnd = {
    x: (firstControlPoint.x + firstEndPoint.x) / 2,
    y: (firstControlPoint.y + firstEndPoint.y) / 2
  };

  let penultimatePoint = originPoints[pointsLength - 2];
  let lastPoint = originPoints[pointsLength - 1];
  let index = 1;

  return (points: Point[] = originPoints, recheckEndPoints = false) => {
    if (recheckEndPoints) {
      [firstStartPoint, firstControlPoint, firstEndPoint] = points;

      firstMiddleEnd = {
        x: (firstControlPoint.x + firstEndPoint.x) / 2,
        y: (firstControlPoint.y + firstEndPoint.y) / 2
      };

      penultimatePoint = points[pointsLength - 2];
      lastPoint = points[pointsLength - 1];
    }

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
