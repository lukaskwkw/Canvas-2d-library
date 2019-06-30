import { AdvancedGravityParticle } from "../../../utils/canvas/GravityParticle";
import { PlaneSingleton } from "../../../utils/canvas/plane";
// import { ShapeInCircle } from "../../../utils/canvas/rendeners";

let particles = [];
const numbersOfParticles = 20000;
const PiByTwo = Math.PI / 2;
const particleSpeedFormula = () => 0.7 + Math.random() * 5;
const particleDirectionFormula = () =>
  PiByTwo + PiByTwo * (Math.random() - 0.5);
const circleSizeFormula = () => 1 + Math.random() * 2.5;

export const particlesConfig = (
  sunArray: AdvancedGravityParticle[],
  planeWidth?: number,
  context?: CanvasRenderingContext2D
) => {
  const plane = new PlaneSingleton();
  const ctx = context || plane.context;
  const width = planeWidth || plane.features.dimensions.width;

  const originPosition = {
    x: width * 0.9,
    y: 50
  };

  // const particleRenderer = size => ShapeInCircle(size, 0, 6);
  // const particleRenderer = size => ({ x, y }) => {
  //   ctx.beginPath();
  //   ctx.arc(x, y, size, 0, Math.PI * 2);
  //   ctx.fill();
  // };
  const particleRenderer = size => ({ x, y }) => ctx.rect(x, y, size, size);
  // const particleRenderer = size => ({ x, y }) => {
  //   ctx.moveTo(x, y);
  //   ctx.lineTo(x + size, y + size);
  //   //remember to add stroke after loop
  // };

  for (let i = 0; i < numbersOfParticles; i++) {
    const weight = circleSizeFormula();
    const particle = new AdvancedGravityParticle(
      originPosition,
      {
        size: circleSizeFormula(),
        speed: particleSpeedFormula(),
        direction: -Math.PI / 3,
        weight
      },
      particleRenderer(circleSizeFormula())
    );

    sunArray.forEach((sun: AdvancedGravityParticle) =>
      particle.setGravityTowards(sun)
    );
    particles.push(particle);
  }

  return {
    originPosition,
    particles,
    particleSpeedFormula,
    particleDirectionFormula,
    circleSizeFormula
  };
};
