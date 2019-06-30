import { AdvancedGravityParticle } from "../../../utils/canvas/GravityParticle";
import VelocityParticle from "../../../utils/canvas/VelocityParticle";
import { randomPoint } from "../../../utils/math";
import { circlePulse } from "../../../utils/canvas/rendeners";
import { moveAlongMultiQuadricBaziers } from "../../../utils/canvas/interpolation";

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

export const getSuns = (planeWidth: number): AdvancedGravityParticle[] => {
  const downgradeRatio = planeWidth < 600 ? 0.2 : 1;

  const RedBaron: AdvancedGravityParticle = new AdvancedGravityParticle(
    randomPoint(10),
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
    {
      size: 8 * downgradeRatio,
      weight: -155520,
      fillColor: "rgba(10,255,100, 0.92)",
      speed: 0
    },
    circlePulse(10 * downgradeRatio)
  );

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

  return [RedBaron, HugeGreen, BlueBilbo, GreenGoblin];
};
