import Particle from "../../utils/canvas/particle";
import {
  emmitter,
  randomPoint,
  moveAlongMultiQuadricBaziers
} from "../../utils/math";
import { PlaneSingleton } from "../../utils/canvas/plane";
import { circlePulse } from "../../utils/canvas/rendeners";

export const orbitingFountain = () => (height, width) => (
  context,
  checkUnmount
) => {
  const originPosition = {
    x: width * 0.1,
    y: 0
  };

  new PlaneSingleton(
    {
      dimensions: { width, height },
      plainGravity: false
    },
    context,
    true
  );

  const Sun = new Particle(
    { x: width / 1.2, y: height / 4 },
    {
      size: 75,
      weight: 1455410,
      fillColor: "rgba(200,10,10, 0.5)",
      speed: 0,
      planeGravity: false
    },
    circlePulse(100)
  );

  const Sun2 = new Particle(
    { x: width / 6, y: height / 2 },
    {
      size: 55,
      weight: -314100,
      fillColor: "rgba(100,100,10, 0.5)",
      speed: 0,
      planeGravity: false
    },
    circlePulse(75)
  );

  const Sun3 = new Particle(
    { x: width / 2, y: height / 1.1 },
    {
      size: 35,
      weight: 455520,
      fillColor: "rgba(0,100,100, 0.2)",
      speed: 0,
      planeGravity: false
    },
    circlePulse(45)
  );

  const Sun4 = new Particle(
    { x: width / 2, y: height / 8 },
    {
      size: 22,
      weight: -255520,
      fillColor: "rgba(10,255,100, 0.92)",
      speed: 0,
      planeGravity: false
    },
    circlePulse(30)
  );

  let particles = [];
  const numbersOfParticles = 2500;
  const particleSpeedFormula = () => 2 + Math.random() * 5;
  const particleDirectionFormula = () =>
    Math.PI / 2 + (Math.PI / 2) * (Math.random() - 0.5);

  for (let i = 1; i < numbersOfParticles; i++) {
    const circleSize = 1 + Math.random() * 3;
    const weight = circleSize;
    const particle = new Particle(originPosition, {
      size: circleSize,
      speed: particleSpeedFormula(),
      direction: -Math.PI / 3,
      weight
    });

    particle.setOrbiteTowards(Sun);
    particle.setOrbiteTowards(Sun2);
    particle.setOrbiteTowards(Sun3);
    particle.setOrbiteTowards(Sun4);
    particles.push(particle);
  }

  const numberOfPointsForIteration = 1009;

  const testArray = Array.from({ length: numberOfPointsForIteration }, () =>
    randomPoint(20)
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
  const interpolationIntervals = 450;
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

  const render = () => {
    if (checkUnmount() || particles.length < 2) {
      return;
    }

    context.clearRect(0, 0, width, height);

    Sun.render();
    Sun2.render();
    Sun3.render();

    const pulsarPosition = mulitQuadricMovePoint();
    const redBaronPosition = mulitQuadricRedBaron();
    const blueBilboPosition = mulitQuadricBlueBilbo();
    const hugeGreenPosition = mulitQuadricHugeGreen();
    Sun4.position.setCords(pulsarPosition);
    Sun3.position.setCords(blueBilboPosition);
    Sun.position.setCords(redBaronPosition);
    Sun2.position.setCords(hugeGreenPosition);
    Sun4.render();

    particles.forEach((particle: Particle) => {
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
