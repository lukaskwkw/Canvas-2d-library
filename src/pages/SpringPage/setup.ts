// import Particle from "../../utils/canvas/particle";
import { PlaneSingleton } from "../../utils/canvas/plane";
import Vector from "../../utils/vector";
import { randomX, randomY, randomPoint } from "../../utils/math";
import SpringWithGravity from "../../utils/canvas/spring";
import { PlayerSpring } from "../../utils/canvas/player";

export const setup = () => (height, width) => (context, checkUnmount) => {
  const originPosition = {
    x: width * 0.5,
    y: height * 0.5
  };

  new PlaneSingleton(
    {
      dimensions: { width, height },
      boundaries: { checkTop: true }
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
  // const AttachPoint3 = new Vector(
  //   randomX(screenMargins),
  //   randomY(screenMargins)
  // );
  // const AttachPoint4 = new Vector(
  //   randomX(screenMargins),
  //   randomY(screenMargins)
  // );
  const weight = new SpringWithGravity(randomPoint(screenMargins), {
    size: 15,
    k: 0.2,
    weight: 100,
    friction: 0.95,
    offset: 50,
    speed: 100,
    pointsOfAttachments: [AttachPoint]
  });

  const Ship = new PlayerSpring(randomPoint(screenMargins), {
    size: 20,
    weight: 2,
    direction: -Math.PI / 2,
    speed: 1,
    offset: 50,
    friction: 0.95,
    k: 0.2,
    pointsOfAttachments: [AttachPoint2]
  });

  // Ship.addBoundaryFunction(moveToOtherSide, [
  //   Ship.position,
  //   Ship.features.size,
  //   { checkTop: true }
  // ]);

  // Ship.attachTo(weight.position);
  weight.attachTo(Ship.position);

  window.addEventListener("mousemove", event => {
    AttachPoint.setX(event.clientX - 10);
    AttachPoint.setY(event.clientY - 55);
  });

  const render = () => {
    if (checkUnmount()) {
      return;
    }
    context.clearRect(0, 0, width, height);

    // AttachPoint.setCords(Ship.position.getCords());

    Ship.render();
    weight.render();

    requestAnimationFrame(render);
  };

  render();
};
