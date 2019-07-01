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
  const attachmentOffset = 150;
  const friction = 0.95;

  const commonK = 0.05;
  const weight = new SpringWithGravity(randomPoint(screenMargins), {
    size: 15 * downgradeRatio,
    k: commonK,
    weight: 20,
    friction: friction,
    offset: attachmentOffset,
    speed: 1
  });

  const weight2 = new SpringWithGravity(randomPoint(screenMargins), {
    size: 15 * downgradeRatio,
    k: commonK,
    weight: 20,
    friction: friction,
    offset: attachmentOffset,
    speed: 1
  });

  const Ship = new PlayerSpring(randomPoint(screenMargins), {
    size: 20 * downgradeRatio,
    k: commonK,
    weight: 20,
    friction: 0.98,
    offset: attachmentOffset,
    speed: 1,
    pointsOfAttachments: [weight, weight2]
  });

  weight.attachTo(weight2);
  weight.attachTo(Ship);
  weight2.attachTo(weight);
  weight2.attachTo(Ship);

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
      weight.getPosition(),
      weight2.getPosition(),
      Ship.getPosition(),
      weight.getPosition()
    ]);

    requestAnimationFrame(render);
  };

  render();
};
