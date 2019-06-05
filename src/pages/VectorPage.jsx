import React from "react";
import { Canvas, Plane } from "../components/Canvas";
import { Circle, Particle } from "../utils/canvas/figures";
import {
  // removeDeadParticles,
  // checkBoundaries,
  // bouncingBoundires,
  bottomEmitter
  // bottomEmitter
} from "../utils/math";

const topOffset = 80;

const linearMotion = () => (height, width) => (context, checkUnmount) => {
  const x = width * 0.5,
    y = height * 1;

  // const planeS = new PlaneSingletonTest(
  //   window.innerWidth,
  //   window.innerHeight - topOffset
  // );

  // console.info({ planeS });

  let particles = [];
  const numbersOfParticles = 1500;
  const particleSpeedFormula = () => 2 + Math.random() * 30;
  const particleDirectionFormula = () =>
    -Math.PI / 2 + (Math.PI / 2) * (Math.random() - 0.5);

  for (let i = 1; i < numbersOfParticles; i++) {
    const particleSpeed = particleSpeedFormula();
    const particleDirection = particleDirectionFormula();

    const friction = 0.99 - Math.random() * 0.02;
    const circleSize = 1 + Math.random() * 3;
    const circle = new Circle(context)(x, y, circleSize);
    const weight = circleSize * 5;
    particles.push(
      new Particle(
        width,
        height - topOffset,
        x,
        y,
        circleSize,
        particleSpeed,
        particleDirection,
        circle.renderer,
        weight,
        friction
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

const VectorTab = () => {
  return pug`
    Plane
      Canvas(width=window.innerWidth height=(window.innerHeight-topOffset) renderer=linearMotion())
  `;
};

export default VectorTab;
