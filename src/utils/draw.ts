import { Point } from "./vector";
import { PlaneSingleton } from "./canvas/plane";
import { cubicBezierIteration } from "./interpolation";

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
  strokeColor: string = "#000",
  context: CanvasRenderingContext2D = new PlaneSingleton().context
) => {
  context.beginPath();
  context.strokeStyle = strokeColor;
  connectDots(points);
  context.stroke();
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
