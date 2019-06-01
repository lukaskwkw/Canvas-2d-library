import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import {
  circlePulse,
  // drawRandomLines,
  sinus,
  // circleUpAndDown,
  circleAlpha,
  orbit,
  // circleUpAndDownAndPulse,
  lissajousCurves
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
    // let { width: canvasWidth, height: canvasHeight } = canvas;
    // canvasWidth = 1000;
    // canvasHeight = 1000;
    renderer(height, width)(context);
  });

  return pug`
    canvas(ref=ref width=width height=height)
`;
};

const sinusRendererOrbit = (x, y) => (height, width) => context => {
  setTimeout(
    () => orbit(50, 15, 15, 0.05, x, y)(height, width)(context),
    x * Math.random() * 5
  );
};

const sinusRendererlissajousCurves = (x, y) => (height, width) => context => {
  setTimeout(
    () =>
      lissajousCurves(
        150 * Math.random() * 5,
        85 * Math.random() * 5,
        2,
        0.15,
        0.11,
        x,
        y
      )(height, width)(context),
    x * Math.random() * 5
  );
};

// const sinusRendererUpAndDownAndPulse = (x, y) => (height, width) => context => {
//   setTimeout(
//     () =>
//       circleUpAndDownAndPulse(x, y, 15, 0, Math.random() * 3)(height, width)(
//         context
//       ),
//     x * Math.random() * 5
//   );
// };

// const sinusRenderer = (x, y) => (height, width) => context => {
//   setTimeout(
//     () => circleUpAndDown(25, x, y, 20, 0.2)(height, width)(context),
//     x
//   );
// };

const MathTab = () => pug`
  Plane
    Canvas(renderer = sinus(true, 0.5, sinusRendererOrbit))

    Canvas(renderer = sinus(true, 0.005, sinusRendererlissajousCurves))

    Canvas(renderer = sinus(true, 0.01))
    
    // Canvas(renderer = drawRandomLines(1000))
    
    Canvas(renderer = circlePulse(null, null, 30))

    // Canvas(renderer = orbit(150, 20, 0.1 200,400))
    
    Canvas(renderer = circleAlpha(200))
    
    Canvas(renderer = orbit(200, 60, 20, 0.01))

    // for bee in new Array(10).fill()
    //   Canvas(renderer = lissajousCurves(
    //     150 * Math.random() * 5,
    //     85 * Math.random() * 5,
    //     5,
    //     0.12,
    //     0.11
    //   ))

    // for bee in new Array(10).fill() {
    //   Canvas(renderer = circleUpAndDownAndPulse())
    // }
    
    // Canvas(renderer = circleUpAndDown())
`;

export default MathTab;
