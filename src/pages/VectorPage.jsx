import React from "react";
import { Canvas, Plane } from "../components/Canvas";
import { Circle, Particle } from "../utils/canvas/figures";

const linearMotion = () => (height, width) => context => {
  const x = width * 0.5,
    y = height * 0.5;

  const circle = new Circle(context)(x, y, 5);
  const particle2 = new Particle(
    20,
    height - 20,
    2,
    -Math.PI / 6,
    circle.renderer,
    circle.clear
  );

  const particles = [];

  for (let i = 1; i < 500; i++) {
    particles.push(
      new Particle(
        x,
        y,
        i / 500,
        (i * 3.6 * 180) / Math.PI,
        circle.renderer,
        circle.clear
      )
    );
  }

  const render = () => {
    particles.forEach(particle => particle.render());
    particle2.render();

    requestAnimationFrame(render);
  };

  render();
};

const VectorTab = () => {
  return pug`
    Plane
      Canvas(renderer=linearMotion())
  `;
};

export default VectorTab;
