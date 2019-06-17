import { PlaneSingleton } from "../../utils/canvas/plane";
import { Circle } from "../../utils/canvas/rendeners";
import { randomPoint } from "../../utils/math";
import { connectDots } from "../../utils/draw";
import { lineInterpolation } from "../../utils/interpolation";

export const bezier = () => (height, width) => (
  canvas: HTMLCanvasElement,
  checkUnmount
) => {
  const context = canvas.getContext("2d");

  new PlaneSingleton(
    { dimensions: { width, height }, boundaries: { checkBottom: true } },
    context,
    true
  );

  const size = 5;
  const point1 = randomPoint(20);
  const point2 = randomPoint(20);
  const point3 = randomPoint(20);
  const point4 = randomPoint(20);

  const circle1 = Circle()(point1, size),
    circle2 = Circle()(point2, size),
    circle3 = Circle()(point3, size),
    circle4 = Circle()(point4, size),
    circle5 = Circle(),
    circle6 = Circle(),
    circle7 = Circle(),
    circle8 = Circle(),
    circleGreenYellow = Circle(),
    circleBlueBlue = Circle();

  const interpolationSpeed = 0.005;

  let t = interpolationSpeed;

  const render = () => {
    if (checkUnmount()) {
      return;
    }

    context.clearRect(0, 0, width, height);

    circle1.renderer();

    context.beginPath();
    connectDots([point1, point2, point3, point4]);
    context.stroke();

    circle2.renderer();
    circle3.renderer();
    circle4.renderer();

    if (t >= 1) {
      t = interpolationSpeed;
    }

    const interpolatedPointP1P2 = lineInterpolation(t, point1, point2);
    const interpolatedPointP2P3 = lineInterpolation(t, point2, point3);
    const interpolatedPointP3P4 = lineInterpolation(t, point3, point4);

    const interpolatedRedGreen = lineInterpolation(
      t,
      interpolatedPointP1P2,
      interpolatedPointP2P3
    );

    const interpolatedPointOfGreenYellow = lineInterpolation(
      t,
      interpolatedPointP2P3,
      interpolatedPointP3P4
    );

    const interpolatedBlueBlue = lineInterpolation(
      t,
      interpolatedRedGreen,
      interpolatedPointOfGreenYellow
    );

    context.beginPath();
    connectDots([interpolatedPointP1P2, interpolatedPointP2P3]);
    connectDots([interpolatedPointP2P3, interpolatedPointP3P4]);
    connectDots([interpolatedRedGreen, interpolatedPointOfGreenYellow]);
    context.stroke();

    circle5(interpolatedPointP1P2, 8, "red").renderer();
    circle6(interpolatedPointP2P3, 8, "green").renderer();
    circle8(interpolatedPointP3P4, 8, "yellow").renderer();
    circle7(interpolatedRedGreen, 8, "blue").renderer();
    circleGreenYellow(interpolatedPointOfGreenYellow, 8, "blue").renderer();
    circleBlueBlue(interpolatedBlueBlue, 12, "#ff9999").renderer();

    t += interpolationSpeed;

    requestAnimationFrame(render);
  };

  render();
};
