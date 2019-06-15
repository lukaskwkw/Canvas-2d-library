// import Particle from "../../utils/canvas/particle";
import { PlaneSingleton } from "../../utils/canvas/plane";
import Vector from "../../utils/vector";
import { randomX, randomY, randomPoint } from "../../utils/math";
import SpringWithGravity from "../../utils/canvas/spring";

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
  const AttachPoint = new Vector(originPosition.x, originPosition.y);
  const AttachPoint2 = new Vector(
    randomX(screenMargins),
    randomY(screenMargins)
  );
  const AttachPoint3 = new Vector(
    randomX(screenMargins),
    randomY(screenMargins)
  );
  const AttachPoint4 = new Vector(
    randomX(screenMargins),
    randomY(screenMargins)
  );
  const weight = new SpringWithGravity(randomPoint(screenMargins), {
    size: 15,
    k: 0.2,
    weight: 1000,
    friction: 0.95,
    pointsOfAttachments: [AttachPoint, AttachPoint2, AttachPoint3, AttachPoint4]
  });

  const render = () => {
    if (checkUnmount()) {
      return;
    }
    context.clearRect(0, 0, width, height);

    weight.render();

    requestAnimationFrame(render);
  };

  render();
};
