import Particle from "../../utils/canvas/particle";
import { PlaneSingleton } from "../../utils/canvas/plane";
import { circlePulse } from "../../utils/canvas/rendeners";
import Player from "../../utils/canvas/player";
import {
  randomPoint,
  drawMultiMiddleQudricBeziers,
  moveAlongMultiQuadricBaziers
} from "../../utils/math";

export const level = () => (height, width) => (
  context: CanvasRenderingContext2D,
  checkUnmount
) => {
  new PlaneSingleton(
    { dimensions: { width, height }, boundaries: { checkBottom: true } },
    context,
    true
  );

  const Sun = new Particle(
    { x: width / 2, y: height / 2 },
    {
      size: 15,
      weight: 510,
      fillColor: "rgba(200,10,10, 0.5)",
      speed: 0
    },
    circlePulse(30)
  );

  const Satelite = new Particle(
    { x: width / 1.35, y: height / 2 },
    { size: 5, weight: 50, direction: -Math.PI / 2, speed: 5 }
  );

  const Ship = new Player(
    { x: width / 1.1, y: height / 2 },
    { size: 20, weight: 100, direction: -Math.PI / 2, speed: 1 }
  );

  Satelite.setOrbiteTowards(Sun);
  // Satelite.setOrbiteTowards(Ship);
  Ship.setOrbiteTowards(Sun);
  Ship.setOrbiteTowards(Satelite);

  const testArray = Array.from({ length: 24 }, () => randomPoint(20));

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
