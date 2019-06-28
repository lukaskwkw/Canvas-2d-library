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
  height = canvas.height = window.innerHeight - canvas.offsetTop;
  width = canvas.width = window.innerWidth - canvas.offsetLeft;

  new PlaneSingleton(
    {
      dimensions: { width, height },
      boundaries: { checkTop: true }
    },
    context,
    true
  );

  const screenMargins = 20;
  const downgradeRatio = width < 600 ? 0.5 : 1;

  const commonK = 0.01;
  const weight = new SpringWithGravity(randomPoint(screenMargins), {
    size: 15 * downgradeRatio,
    k: commonK,
    weight: 20,
    friction: 0.95,
    offset: 150,
    speed: 10
  });

  const weight2 = new SpringWithGravity(randomPoint(screenMargins), {
    size: 15 * downgradeRatio,
    k: commonK,
    weight: 10,
    friction: 0.95,
    offset: 150,
    speed: 10
    // pointsOfAttachments: [weight.getPosition()]
  });

  // const Ship = new PlayerSpring(randomPoint(screenMargins), {
  //   size: 20 * downgradeRatio,
  //   k: commonK,
  //   weight: 20,
  //   friction: 0.95,
  //   offset: 150,
  //   speed: 10,
  //   pointsOfAttachments: [weight.getPosition(), weight2.getPosition()]
  // });

  weight.attachTo(weight2.getPosition());
  // weight.attachTo(Ship.getPosition());
  weight2.attachTo(weight.getPosition());
  // weight2.attachTo(Ship.getPosition());

  const allParticles = [weight, weight2 /* Ship */];

  mousePointerCollisionUpdater(allParticles, canvas)();
  touchCollisionUpdater(allParticles, canvas)();

  const render = () => {
    if (checkUnmount()) {
      return;
    }

    context.clearRect(0, 0, width, height);

    // Ship.render();
    weight.render();
    weight2.render();
    connectDotsAndStroke([
      weight.getPosition(),
      weight2.getPosition(),
      // Ship.getPosition(),
      weight.getPosition()
    ]);

    requestAnimationFrame(render);
  };

  render();
};
