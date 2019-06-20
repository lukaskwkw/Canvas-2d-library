// import Particle from "../../utils/canvas/particle";
import { PlaneSingleton } from "../../utils/canvas/plane";
import SpringWithGravity from "../../utils/canvas/spring";
import { PlayerSpring } from "../../utils/canvas/player";
import { connectDotsAndStroke } from "../../utils/canvas/draw";
import { randomPoint } from "../../utils/math";
import {
  mousePointerCollisionUpdater,
  touchCollisionUpdater
} from "../../utils/canvas/collision";

export const setup = () => (height, width) => (
  canvas: HTMLCanvasElement,
  checkUnmount
) => {
  const context = canvas.getContext("2d");

  // const originPosition = {
  //   x: width * 0.5,
  //   y: height * 0.5
  // };

  new PlaneSingleton(
    {
      dimensions: { width, height },
      boundaries: { checkTop: true }
    },
    context,
    true
  );

  const screenMargins = 20;
  // const AttachPoint = new Vector(originPosition.x, originPosition.y);
  // const AttachPoint2 = new Vector(
  //   randomX(screenMargins),
  //   randomY(screenMargins)
  // );
  // const AttachPoint3 = new Vector(
  //   randomX(screenMargins),
  //   randomY(screenMargins)
  // );
  // const AttachPoint4 = new Vector(
  //   randomX(screenMargins),
  //   randomY(screenMargins)
  // );

  const downgradeRatio = width < 600 ? 0.5 : 1;

  const commonK = 0.05;
  const weight = new SpringWithGravity(randomPoint(screenMargins), {
    size: 15 * downgradeRatio,
    k: commonK,
    weight: 10,
    friction: 0.95,
    offset: 150,
    speed: 100
  });

  const weight2 = new SpringWithGravity(randomPoint(screenMargins), {
    size: 15 * downgradeRatio,
    k: commonK,
    weight: 10,
    friction: 0.95,
    offset: 150,
    speed: 100,
    pointsOfAttachments: [weight.position]
  });

  const Ship = new PlayerSpring(randomPoint(screenMargins), {
    size: 20 * downgradeRatio,
    k: commonK,
    weight: 20,
    friction: 0.95,
    offset: 150,
    speed: 100,
    pointsOfAttachments: [weight.position, weight2.position]
  });

  weight.attachTo(weight2.position);
  weight.attachTo(Ship.position);
  weight2.attachTo(weight.position);
  weight2.attachTo(Ship.position);

  // canvas.addEventListener("mousemove", (event: MouseEvent) => {
  //   weight2.position.setX(event.clientX - canvas.offsetLeft);
  //   weight2.position.setY(event.clientY - canvas.offsetTop);
  //   weight2.update = [];
  // });

  const allParticles = [weight, weight2, Ship];

  mousePointerCollisionUpdater(allParticles, canvas)();
  touchCollisionUpdater(allParticles, canvas)();

  const render = () => {
    if (checkUnmount()) {
      return;
    }

    context.clearRect(0, 0, width, height);

    Ship.render();
    weight.render();
    weight2.render();
    connectDotsAndStroke([
      weight.position.getCords(),
      weight2.position.getCords(),
      Ship.position.getCords(),
      weight.position.getCords()
    ]);

    requestAnimationFrame(render);
  };

  render();
};
