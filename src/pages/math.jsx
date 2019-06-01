import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import {
  circlePulse,
  drawRandomLines,
  sinus,
  orbit,
  lissajousCurves,
  circleUpAndDownAndPulse,
  circleUpAndDown
} from "../utils/canvas";

const Plane = styled.div`
  * {
    position: absolute;
  }
`;

const DefaultSize = 1000;

const Canvas = ({ renderer, width = DefaultSize, height = DefaultSize }) => {
  const ref = useRef();
  useEffect(() => {
    const { current: canvas } = ref;
    const context = canvas.getContext("2d");
    renderer(height, width)(context);
  });

  return pug`
    canvas(ref=ref width=width height=height)
`;
};

const sinusRendererOrbit = (x, y) => (height, width) => context => {
  setTimeout(
    () => orbit(150, 105, 15, 0.05, x, y)(height, width)(context),
    x * Math.random() * 5
  );
};

const sinusRendererlissajousCurves = (x, y) => (height, width) => context => {
  setTimeout(
    () =>
      lissajousCurves(
        150 * Math.random() * 5,
        150 * Math.random() * 5,
        2,
        0.075 * Math.random(),
        0.071 * Math.random(),
        x,
        y
      )(height, width)(context),
    x * Math.random() * 15000
  );
};

const sinusRendererUpAndDownAndPulse = (x, y) => (height, width) => context => {
  setTimeout(
    () =>
      circleUpAndDownAndPulse(x, y, 15, 0, Math.random() * 3)(height, width)(
        context
      ),
    x * Math.random() * 5
  );
};

const sinusRendererUpAndDown = (x, y) => (height, width) => context => {
  setTimeout(
    () => circleUpAndDown(5, x, y, null, 0.02)(height, width)(context),
    x
  );
};

const MathTab = () => pug`
  Plane
    Canvas(renderer = sinus(true, 0.5, sinusRendererOrbit))

    Canvas(renderer = sinus(true, 0.3, sinusRendererUpAndDown))

    Canvas(renderer = sinus(true, 0.3, sinusRendererUpAndDownAndPulse))

    Canvas(renderer = sinus(true, 0.001, sinusRendererlissajousCurves))

    Canvas(renderer = sinus(true, 0.01))
    
    Canvas(renderer = drawRandomLines(10))
    
    Canvas(renderer = circlePulse(null, null, 30))

    Canvas(renderer = orbit(150, 150, 0.1, 200,400))
        
    Canvas(renderer = orbit(200, 200, 20, 0.01))
`;

export default MathTab;
