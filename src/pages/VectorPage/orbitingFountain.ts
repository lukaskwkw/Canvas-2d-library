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
import { rangeOf } from "../../utils/array";
// import { drawMultiMiddleQudricBeziers } from "../../utils/canvas/draw";

const updaterFunction = (
  particle: VelocityParticle,
  movingPointGenerator: Function,
  speedRatio: number = 0.1
) => {
  particle.setVelocity(2, 1);
  particle.setPosition(movingPointGenerator());

  //to-do maybe construct less weight updater (in terms of cpu load) where the updater
  //makes distance diff between two points (after each other) here
  return () => {
    const movingPoint = movingPointGenerator();
    const distanceY = movingPoint.y - particle.y;
    const distanceX = movingPoint.x - particle.x;
    const straightDistance = Math.sqrt(distanceY ** 2 + distanceX ** 2);
    const movingForce = straightDistance * speedRatio;

    particle.velocityX = (distanceX / straightDistance) * movingForce;
    particle.velocityY = (distanceY / straightDistance) * movingForce;
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

  // const downgradeRatio = 0.2;
  const downgradeRatio = width < 600 ? 0.2 : 1;

  const RedBaron: AdvancedGravityParticle = new AdvancedGravityParticle(
    randomPoint(10),
    // { x: width / 1.2, y: height / 4 },
    {
      size: 53 * downgradeRatio,
      weight: 1455410,
      fillColor: "rgba(200,10,10, 0.5)",
      speed: 0
    },
    circlePulse(80 * downgradeRatio)
  );

  const HugeGreen: AdvancedGravityParticle = new AdvancedGravityParticle(
    randomPoint(10),
    // { x: width / 6, y: height / 2 },
    {
      size: 33 * downgradeRatio,
      weight: -214100,
      fillColor: "rgba(100,100,10, 0.5)",
      speed: 0
    },
    circlePulse(55 * downgradeRatio)
  );

  const BlueBilbo: AdvancedGravityParticle = new AdvancedGravityParticle(
    randomPoint(10),
    // { x: width / 2, y: height / 1.1 },
    {
      size: 13 * downgradeRatio,
      weight: 455520,
      fillColor: "rgba(0,100,100, 0.2)",
      speed: 0
    },
    circlePulse(25 * downgradeRatio)
  );

  const GreenGoblin: AdvancedGravityParticle = new AdvancedGravityParticle(
    randomPoint(10),
    // { x: width / 2, y: height / 8 },
    {
      size: 8 * downgradeRatio,
      weight: -155520,
      fillColor: "rgba(10,255,100, 0.92)",
      speed: 0
    },
    circlePulse(10 * downgradeRatio)
  );

  let particles = [];
  const numbersOfParticles = 50;
  let amount = 50;
  const particleSpeedFormula = () => 0.7 + Math.random() * 5;
  const PiByTwo = Math.PI / 2;
  const particleDirectionFormula = () =>
    PiByTwo + PiByTwo * (Math.random() - 0.5);

  const circleSizeFormula = () => 4 + Math.random() * 3.5;
  for (let i = 1; i < numbersOfParticles; i++) {
    const weight = circleSizeFormula();
    const particle = new AdvancedGravityParticle(
      originPosition,
      {
        size: circleSizeFormula(),
        speed: particleSpeedFormula(),
        direction: -Math.PI / 3,
        weight
      },
      ({ x, y }, size) => {
        context.moveTo(x, y);
        context.lineTo(x + size, y + size);
      }
    );

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
  const interpolationIntervals = 700;
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
  mousePointerCollisionUpdater(sunsArray, canvas)();
  touchCollisionUpdater(sunsArray, canvas)();

  context.font = "24px Arial";

  let prevDelta = 0;
  let fpsArray = [];
  let counter = 0;
  let average = 0;
  const checkCounterEvery = 30;

  const render = timestamp => {
    let delta = timestamp - prevDelta;

    if (checkUnmount() || particles.length < 2) {
      return;
    }
    context.clearRect(0, 0, width, height);

    // drawMultiMiddleQudricBeziers(testArray);

    RedBaron.render();
    HugeGreen.render();
    BlueBilbo.render();
    GreenGoblin.render();
    // context.fillStyle = "#000";

    context.beginPath();
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      particle.render();
      emmitter(
        originPosition,
        0.21,
        particleDirectionFormula(),
        particle,
        particle.features.size
      );
    }
    context.stroke();

    if (counter >= checkCounterEvery) {
      let sum = fpsArray.reduce(function(a, b) {
        return a + b;
      });
      average = ~~(sum / fpsArray.length);

      if (average > 35) {
        const newParticles = rangeOf(amount, () => {
          const particle = new AdvancedGravityParticle(
            originPosition,
            {
              size: circleSizeFormula(),
              speed: particleSpeedFormula(),
              direction: -Math.PI / 3,
              weight: circleSizeFormula()
            },
            ({ x, y }, size) => {
              context.moveTo(x, y);
              context.lineTo(x + size, y + size);
            }
          );
          particle.setGravityTowards(RedBaron);
          particle.setGravityTowards(HugeGreen);
          particle.setGravityTowards(BlueBilbo);
          particle.setGravityTowards(GreenGoblin);
          return particle;
        });

        particles.push(...newParticles);
        amount *= average > 50 ? 1.5 : 1;
        console.info(
          `Added ${amount} more particles ! new length = ${particles.length}`
        );
      }
      counter = 0;
      fpsArray = [];
    } else {
      const currentFPS = 1000 / delta;
      fpsArray.push(currentFPS);
      counter++;
    }

    context.fillText(`${average}`, 10, 50);
    context.fillText(`Number of particles: ${particles.length}`, 10, 80);
    context.fillText(`${canvas.clientWidth}x${canvas.clientHeight}`, 10, 120);

    prevDelta = timestamp;
    requestAnimationFrame(render);
  };

  render(performance.now());
};
