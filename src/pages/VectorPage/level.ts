import { circlePulse } from "../../utils/canvas/rendeners";
import PlayerMultiGravity from "../../utils/canvas/player";
import { randomPoint } from "../../utils/math";

import { AdvancedGravityParticle } from "../../utils/canvas/GravityParticle";
import { moveAlongMultiQuadricBaziers } from "../../utils/canvas/interpolation";
import { drawMultiMiddleQudricBeziers } from "../../utils/canvas/draw";

export const level = () => (height, width) => (
  canvas: HTMLCanvasElement,
  checkUnmount
) => {
  const context = canvas.getContext("2d");
  height = canvas.height = window.innerHeight - canvas.offsetTop;
  width = canvas.width = window.innerWidth - canvas.offsetLeft;

  const Sun = new AdvancedGravityParticle(
    { x: width / 2, y: height / 2 },
    {
      size: 15,
      weight: 1310,
      fillColor: "rgba(200,10,10, 0.5)",
      speed: 0
    },
    circlePulse(30)
  );

  const Satelite = new AdvancedGravityParticle(
    { x: width / 1.35, y: height / 2 },
    { size: 5, weight: 500, direction: -Math.PI / 2, speed: 5 }
  );

  const Ship = new PlayerMultiGravity(
    { x: width / 1.1, y: height / 2 },
    { size: 20, weight: 100, direction: -Math.PI / 2, speed: 1 }
  );

  Satelite.setGravityTowards(Sun);
  Satelite.setGravityTowards(Ship);
  Ship.setGravityTowards(Sun);
  Ship.setGravityTowards(Satelite);

  const numberOfPointsForIteration = 50;

  const testArray = Array.from({ length: numberOfPointsForIteration }, () =>
    randomPoint(20)
  );

  //less = faster
  const interpolationIntervals = 150;
  const mulitQuadricMovePoint = moveAlongMultiQuadricBaziers(
    interpolationIntervals,
    testArray
  );

  const minPulsarSize = 10;
  const maxPulsarSize = 20;
  const MovingPulsar = circlePulse(maxPulsarSize);
  const render = () => {
    if (checkUnmount()) {
      return;
    }

    context.clearRect(0, 0, width, height);

    const pulsarPosition = mulitQuadricMovePoint();
    MovingPulsar(pulsarPosition, minPulsarSize, "red");

    drawMultiMiddleQudricBeziers(testArray);

    // Sun.position.setCords(pulsarPosition);
    Ship.render();
    Satelite.render();
    Sun.render();

    requestAnimationFrame(render);
  };

  render();
};
