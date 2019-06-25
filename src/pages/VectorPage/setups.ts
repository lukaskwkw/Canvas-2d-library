import { PlaneSingleton } from "../../utils/canvas/plane";
import { PlainGravityParticle } from "../../utils/canvas/GravityParticle";
import { emmitter } from "../../utils/canvas/boundary";

export const fountain = () => (height, width) => (
  canvas: HTMLCanvasElement,
  checkUnmount
) => {
  const context = canvas.getContext("2d");
  height = canvas.height = window.innerHeight - canvas.offsetTop;
  width = canvas.width = window.innerWidth - canvas.offsetLeft;

  const originPosition = {
    x: width * 0.5,
    y: height * 1
  };

  new PlaneSingleton(
    {
      dimensions: { width, height },
      boundaries: {
        checkBottom: false,
        checkRight: false
      },
      plainGravity: true
    },
    context,
    true
  );

  let particles = [];
  const numbersOfParticles = 1500;
  const particleSpeedFormula = () => 2 + Math.random() * 30;
  const particleDirectionFormula = () =>
    -Math.PI / 2 + (Math.PI / 2) * (Math.random() - 0.5);

  for (let i = 1; i < numbersOfParticles; i++) {
    const friction = 0.99 - Math.random() * 0.02;
    const circleSize = 1 + Math.random() * 3;
    const weight = circleSize * 5;

    particles.push(
      new PlainGravityParticle(originPosition, {
        size: circleSize,
        speed: particleSpeedFormula(),
        direction: -Math.PI / 3,
        weight,
        friction
      })
    );
  }
  const render = () => {
    if (checkUnmount() || particles.length < 2) {
      return;
    }

    context.clearRect(0, 0, width, height);

    particles.forEach((particle: PlainGravityParticle) => {
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
