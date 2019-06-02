import {
  orbit,
  lissajousCurves,
  circleUpAndDownAndPulse,
  circleUpAndDown
} from "../../utils/canvas/trygonometry";

export const sinusRendererOrbit = (x, y) => (height, width) => context => {
  setTimeout(
    () => orbit(150, 105, 15, 0.05, x, y)(height, width)(context),
    x * Math.random() * 5
  );
};

export const sinusRendererLissajousCurves = (x, y) => (
  height,
  width
) => context => {
  setTimeout(
    () =>
      lissajousCurves(
        150 * Math.random() * 5,
        150 * Math.random() * 5,
        1,
        0.015 * Math.random(),
        0.011 * Math.random(),
        x,
        y
      )(height, width)(context),
    x * Math.random() * 15000
  );
};

export const sinusRendererUpAndDownAndPulse = (x, y) => (
  height,
  width
) => context => {
  setTimeout(
    () =>
      circleUpAndDownAndPulse(x, y, 15, 0, Math.random() * 3)(height, width)(
        context
      ),
    x * Math.random() * 5
  );
};

export const sinusRendererUpAndDown = (x, y) => (height, width) => context => {
  setTimeout(
    () => circleUpAndDown(15, x, y, null, 0.02)(height, width)(context),
    x
  );
};
