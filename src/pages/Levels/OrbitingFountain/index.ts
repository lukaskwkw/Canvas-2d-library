import { PlaneSingleton } from "../../../utils/canvas/plane";
import {
  mousePointerCollisionUpdater,
  touchCollisionUpdater
} from "../../../utils/canvas/collision";
import { AdvancedGravityParticle } from "../../../utils/canvas/GravityParticle";
import { fpsMeter } from "../../../utils/canvas/fps";
import { getSuns } from "./suns";
import { emmitter } from "../../../utils/canvas/boundary";
import { particlesConfig } from "./config";

const OrbitingFountain = () => (height, width) => (
  canvas: HTMLCanvasElement,
  checkUnmount
) => {
  const context = canvas.getContext("2d");
  height = canvas.height = window.innerHeight - canvas.offsetTop;
  width = canvas.width = window.innerWidth - canvas.offsetLeft;

  new PlaneSingleton(
    {
      dimensions: { width, height }
    },
    context,
    true
  );

  const sunArray = getSuns(width);
  const {
    particles,
    originPosition,
    particleDirectionFormula,
    particleSpeedFormula
  } = particlesConfig(sunArray);

  mousePointerCollisionUpdater(sunArray, canvas)();
  touchCollisionUpdater(sunArray, canvas)();
  context.font = "24px Arial";
  const fps = fpsMeter();

  const render = timestamp => {
    fps.start(timestamp);

    if (checkUnmount() || particles.length < 2) {
      return;
    }
    context.clearRect(0, 0, width, height);

    sunArray.forEach((sun: AdvancedGravityParticle) => sun.render());
    context.fillStyle = "#000";

    context.beginPath();

    for (let i = 0; i < particles.length; i++) {
      const particle: AdvancedGravityParticle = particles[i];
      particle.render();
      emmitter(
        originPosition,
        particleSpeedFormula(),
        particleDirectionFormula(),
        particle,
        particle.features.size
      );
    }
    context.fill();

    context.fillText(`${fps.getAverage()}`, 10, 50);
    context.fillText(`Number of particles: ${particles.length}`, 10, 80);
    context.fillText(`${canvas.clientWidth}x${canvas.clientHeight}`, 10, 120);

    fps.end(timestamp);
    requestAnimationFrame(render);
  };

  render(performance.now());
};

export default OrbitingFountain;
