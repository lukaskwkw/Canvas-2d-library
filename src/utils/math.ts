import { Point } from "./vector";
import { PlaneDimensions, PlaneSingleton } from "./canvas/plane";

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

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
