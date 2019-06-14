// import Particle from "../../utils/canvas/particle";
import { PlaneSingleton } from "../../utils/canvas/plane";
import Vector from "../../utils/vector";
import { Circle } from "../../utils/canvas/rendeners";
import { randomX, randomY, connectDotsAndStroke } from "../../utils/math";

export const setup = () => (height, width) => (context, checkUnmount) => {
  const originPosition = {
    x: width * 0.5,
    y: height * 0.5
  };

  new PlaneSingleton(
    {
      dimensions: { width, height }
    },
    context,
    true
  );

  const screenMargins = 20;
  const weight = new Vector(randomX(screenMargins), randomY(screenMargins));
  const AttachPoint = new Vector(originPosition.x, originPosition.y);
  const velocity = new Vector(0, 0);
  const k = 0.1;

  const friction = 0.95;
  const weightSize = 15;
  const SpringCircle = Circle()(weight.getCords(), weightSize, "green");

  const render = () => {
    if (checkUnmount()) {
      return;
    }
    context.clearRect(0, 0, width, height);

    const distance = AttachPoint.substractVector(weight);

    const SpringAcceleration = distance.multiply(k);
    velocity.addTo(SpringAcceleration);
    velocity.multiplyTo(friction);

    weight.addTo(velocity);
    connectDotsAndStroke([weight.getCords(), AttachPoint.getCords()]);
    SpringCircle.renderer(weight.getCords());

    requestAnimationFrame(render);
  };

  render();
};
