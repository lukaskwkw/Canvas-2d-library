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

  //cool effect fot angle (i * 360000 * 180) / Math.PI, (i * 0.000036 * 180) / Math.PI
  for (let i = 1; i < 50500; i++) {
    particles.push(
      new Particle(
        x,
        y,
        i / 250 /* * 50 * Math.random() */,
        (i * 36000 * 180) / Math.PI /* * Math.random() */,
        circle.renderer,
        circle.clear
      )
    );
  }

  const render = () => {
    context.clearRect(0, 0, width, height);

    particles.forEach(particle => particle.render());
    particle2.render();

    requestAnimationFrame(render);
  };

  render();
};

const VectorTab = () => {
  return pug`
    Plane
      Canvas(width=window.innerWidth height=window.innerHeight renderer=linearMotion())
  `;
};

export default VectorTab;
