import Particle from "../../utils/canvas/particle";
import { bottomEmitter } from "../../utils/math";
import { PlaneSingleton } from "../../utils/canvas/plane";
import { circlePulse } from "../../utils/canvas/rendeners";
import Player from "../../utils/canvas/player";

export const orbites = () => (height, width) => (context, checkUnmount) => {
  new PlaneSingleton(
    { dimensions: { width, height }, boundaries: { checkBottom: true } },
    context,
    true
  );

  const Sun = new Particle(
    { x: width / 2, y: height / 2 },
    {
      size: 15,
      weight: 210,
      fillColor: "rgba(200,10,10, 0.5)",
      speed: 0
    },
    circlePulse(30)
  );

  //todo maybe set different x or/and sun weight according to screen width/height
  const Satelite = new Particle(
    { x: width / 1.35, y: height / 2 },
    { size: 5, weight: 50, direction: -Math.PI / 2, speed: 5 }
  );

  const Ship = new Player(
    { x: width / 1.35, y: height / 2 },
    { size: 20, weight: 1, direction: -Math.PI / 2, speed: 2 }
  );

  Satelite.setOrbiteTo(Sun);
  Ship.setOrbiteTo(Sun);
  // Sun.setOrbiteTo(Satelite);

  const render = () => {
    if (checkUnmount()) {
      return;
    }

    context.clearRect(0, 0, width, height);
    Ship.render();
    Satelite.render();
    Sun.render();
    // removeDeadParticles(particles, width, height);

    requestAnimationFrame(render);
  };

  render();
};

export const fountain = () => (height, width) => (context, checkUnmount) => {
  const x = width * 0.5,
    y = height * 1;

  new PlaneSingleton(
    {
      dimensions: { width, height },
      boundaries: { checkBottom: false },
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
      new Particle(
        { x, y },
        {
          size: circleSize,
          speed: particleSpeedFormula(),
          direction: -Math.PI / 3,
          weight,
          friction
        }
      )
    );
  }
  const render = () => {
    if (checkUnmount() || particles.length < 2) {
      return;
    }

    context.clearRect(0, 0, width, height);

    particles.forEach(particle => {
      particle.render();
      bottomEmitter(
        particle,
        x,
        y,
        particleSpeedFormula(),
        particleDirectionFormula(),
        height
      );
    });

    // removeDeadParticles(particles, width, height);

    requestAnimationFrame(render);
  };

  render();
};
