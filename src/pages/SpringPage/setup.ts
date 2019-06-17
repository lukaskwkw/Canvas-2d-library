// import Particle from "../../utils/canvas/particle";
import { PlaneSingleton } from "../../utils/canvas/plane";
import Vector from "../../utils/vector";
import { randomX, randomY, randomPoint } from "../../utils/math";
import SpringWithGravity from "../../utils/canvas/spring";
import { PlayerSpring } from "../../utils/canvas/player";
import { connectDotsAndStroke } from "../../utils/draw";

export const setup = () => (height, width) => (
  canvas: HTMLCanvasElement,
  checkUnmount
) => {
  const context = canvas.getContext("2d");

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
  const AttachPoint3 = new Vector(
    randomX(screenMargins),
    randomY(screenMargins)
  );
  const AttachPoint4 = new Vector(
    randomX(screenMargins),
    randomY(screenMargins)
  );

  const commonK = 0.05;
  const weight = new SpringWithGravity(randomPoint(screenMargins), {
    size: 5,
    k: commonK,
    weight: 10,
    friction: 0.95,
    offset: 150,
    speed: 100
  });

  const weight2 = new SpringWithGravity(randomPoint(screenMargins), {
    size: 5,
    k: commonK,
    weight: 10,
    friction: 0.95,
    offset: 150,
    speed: 100,
    pointsOfAttachments: [weight.position]
  });

  const Ship = new PlayerSpring(randomPoint(screenMargins), {
    size: 20,
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

  canvas.addEventListener("mousemove", (event: MouseEvent) => {
    console.info({ event, canvas });
    weight2.position.setX(event.clientX - canvas.offsetLeft);
    weight2.position.setY(event.clientY - canvas.offsetTop);
    weight2.update = [];
  });

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
