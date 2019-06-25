import { moveAlongMultiQuadricBaziers } from "../../utils/canvas/interpolation";
import { PlaneSingleton } from "../../utils/canvas/plane";
import { circlePulse } from "../../utils/canvas/rendeners";
import { AdvancedGravityParticle } from "../../utils/canvas/GravityParticle";
import { randomPoint } from "../../utils/math";
import { emmitter } from "../../utils/canvas/boundary";
import {
  mousePointerCollisionUpdater,
  touchCollisionUpdater
} from "../../utils/canvas/collision";
import VelocityParticle from "../../utils/canvas/VelocityParticle";
// import { drawMultiMiddleQudricBeziers } from "../../utils/canvas/draw";

const updaterFunction = (
  particle: VelocityParticle,
  movingPointGenerator: Function,
  speedRatio: number = 0.1
) => {
  particle.velocity.setLength(1);
  particle.position.setCords(movingPointGenerator());

  //to-do maybe construct less weight updater (in terms of cpu load) where the updater
  //makes distance diff between two points (after each other) here
  return () => {
    const movingPoint = movingPointGenerator();
    const distanceY = movingPoint.y - particle.position._y;
    const distancex = movingPoint.x - particle.position._x;
    const straightDistance = Math.sqrt(distanceY ** 2 + distancex ** 2);
    particle.velocity.setLength(straightDistance * speedRatio);
    particle.velocity.setAngle(Math.atan2(distanceY, distancex));
  };
};

export const orbitingFountain = () => (height, width) => (
  canvas: HTMLCanvasElement,
  checkUnmount
) => {
  const context = canvas.getContext("2d");
  height = canvas.height = window.innerHeight - canvas.offsetTop;
  width = canvas.width = window.innerWidth - canvas.offsetLeft;

  const originPosition = {
    x: width * 0.9,
    y: 50
  };

  new PlaneSingleton(
    {
      dimensions: { width, height }
    },
    context,
    true
  );

  const downgradeRatio = width < 600 ? 0.2 : 1;

  const RedBaron: AdvancedGravityParticle = new AdvancedGravityParticle(
    randomPoint(10),
    // { x: width / 1.2, y: height / 4 },
    {
      size: 75 * downgradeRatio,
      weight: 1455410,
      fillColor: "rgba(200,10,10, 0.5)",
      speed: 0
    },
    circlePulse(100 * downgradeRatio)
  );

  const HugeGreen: AdvancedGravityParticle = new AdvancedGravityParticle(
    randomPoint(10),
    // { x: width / 6, y: height / 2 },
    {
      size: 55 * downgradeRatio,
      weight: -314100,
      fillColor: "rgba(100,100,10, 0.5)",
      speed: 0
    },
    circlePulse(75 * downgradeRatio)
  );

  const BlueBilbo: AdvancedGravityParticle = new AdvancedGravityParticle(
    randomPoint(10),
    // { x: width / 2, y: height / 1.1 },
    {
      size: 35 * downgradeRatio,
      weight: 455520,
      fillColor: "rgba(0,100,100, 0.2)",
      speed: 0
    },
    circlePulse(45 * downgradeRatio)
  );

  const GreenGoblin: AdvancedGravityParticle = new AdvancedGravityParticle(
    randomPoint(10),
    // { x: width / 2, y: height / 8 },
    {
      size: 22 * downgradeRatio,
      weight: -255520,
      fillColor: "rgba(10,255,100, 0.92)",
      speed: 0
    },
    circlePulse(30 * downgradeRatio)
  );

  let particles = [];
  const numbersOfParticles = 2100;
  const particleSpeedFormula = () => 0.7 + Math.random() * 2;
  const particleDirectionFormula = () =>
    Math.PI / 2 + (Math.PI / 2) * (Math.random() - 0.5);

  for (let i = 1; i < numbersOfParticles; i++) {
    const circleSize = 1.2 + Math.random() * 3.5;
    const weight = circleSize;
    const particle = new AdvancedGravityParticle(originPosition, {
      size: circleSize * downgradeRatio,
      speed: particleSpeedFormula(),
      direction: -Math.PI / 3,
      weight
    });

    particle.setGravityTowards(RedBaron);
    particle.setGravityTowards(HugeGreen);
    particle.setGravityTowards(BlueBilbo);
    particle.setGravityTowards(GreenGoblin);
    particles.push(particle);
  }

  const numberOfPointsForIteration = 1009;

  const testArray = Array.from(
    { length: numberOfPointsForIteration - 950 },
    () => randomPoint(20)
  );

  const hugeGreen = Array.from({ length: numberOfPointsForIteration }, () =>
    randomPoint(20)
  );

  const redBaron = Array.from({ length: numberOfPointsForIteration }, () =>
    randomPoint(20)
  );

  const blueBilbo = Array.from({ length: numberOfPointsForIteration }, () =>
    randomPoint(20)
  );

  //less = faster
  const interpolationIntervals = 1200;
  const mulitQuadricMovePoint = moveAlongMultiQuadricBaziers(
    interpolationIntervals,
    testArray
  );
  const mulitQuadricRedBaron = moveAlongMultiQuadricBaziers(
    interpolationIntervals,
    redBaron
  );
  const mulitQuadricBlueBilbo = moveAlongMultiQuadricBaziers(
    interpolationIntervals,
    blueBilbo
  );
  const mulitQuadricHugeGreen = moveAlongMultiQuadricBaziers(
    interpolationIntervals,
    hugeGreen
  );

  GreenGoblin.update.push({
    name: "multiQuadricInterpolation",
    updater: updaterFunction(GreenGoblin, mulitQuadricMovePoint)
  });

  BlueBilbo.update.push({
    name: "multiQuadricInterpolation",
    updater: updaterFunction(BlueBilbo, mulitQuadricBlueBilbo)
  });

  RedBaron.update.push({
    name: "multiQuadricInterpolation",
    updater: updaterFunction(RedBaron, mulitQuadricRedBaron)
  });

  HugeGreen.update.push({
    name: "multiQuadricInterpolation",
    updater: updaterFunction(HugeGreen, mulitQuadricHugeGreen)
  });

  const sunsArray = [RedBaron, HugeGreen, BlueBilbo, GreenGoblin];
  mousePointerCollisionUpdater([...particles, ...sunsArray], canvas)();
  touchCollisionUpdater([...sunsArray, ...particles], canvas)();

  const render = () => {
    if (checkUnmount() || particles.length < 2) {
      return;
    }
    context.clearRect(0, 0, width, height);

    // drawMultiMiddleQudricBeziers(testArray);

    RedBaron.render();
    HugeGreen.render();
    BlueBilbo.render();
    GreenGoblin.render();

    particles.forEach((particle: AdvancedGravityParticle) => {
      particle.render();
      emmitter(
        originPosition,
        particleSpeedFormula(),
        particleDirectionFormula(),
        particle,
        particle.features.size
      );
    });

    requestAnimationFrame(render);
  };

  render();
};
