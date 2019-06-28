import { PlaneSingleton } from "../../utils/canvas/plane";
import { drawMultiMiddleQudricBeziers } from "../../utils/canvas/draw";
import { randomPoint } from "../../utils/math";
import {
  mousePointerCollisionUpdater,
  touchCollisionUpdater
} from "../../utils/canvas/collision";
import Particle from "../../utils/canvas/particle";
import {
  // moveAlongMultiQuadricBaziers,
  moveAlongMultiQuadricBaziersGen
} from "../../utils/canvas/interpolation";
import { Circle } from "../../utils/canvas/rendeners";

const getParticlesPositionPoints = (particles: Particle[]) =>
  particles.map((circle: Particle) => circle.position.getCords());

const setup = () => (height, width) => (
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

  const numberOfPoints = 15;

  const mulitQuadricCircles = Array.from(
    { length: numberOfPoints },
    () => new Particle(randomPoint(20), { size: 10 })
  );

  mousePointerCollisionUpdater(mulitQuadricCircles, canvas)();
  touchCollisionUpdater(mulitQuadricCircles, canvas)();

  const movingCircle = Circle()(randomPoint(40), 15, "red");

  let quadricPoints = getParticlesPositionPoints(mulitQuadricCircles);

  const interationsPerQuadric = 25;
  const getMovingPoint = moveAlongMultiQuadricBaziersGen(
    interationsPerQuadric,
    quadricPoints
  );

  // const getMovingPoint2 = moveAlongMultiQuadricBaziers(
  //   interationsPerQuadric,
  //   quadricPoints
  // );

  const render = () => {
    if (checkUnmount()) {
      return;
    }

    context.clearRect(0, 0, width, height);

    quadricPoints = getParticlesPositionPoints(mulitQuadricCircles);

    drawMultiMiddleQudricBeziers(quadricPoints);

    mulitQuadricCircles.forEach((circle: Particle) => circle.render());

    const point = getMovingPoint.next(quadricPoints);

    // movingCircle.renderer(getMovingPoint2());

    movingCircle.renderer(
      point.value || quadricPoints[quadricPoints.length - 1]
    );
    requestAnimationFrame(render);
  };

  render();
};

export default setup;
