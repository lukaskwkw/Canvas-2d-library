import React, { useEffect, useRef } from "react";
import styled from "styled-components";

export const Plane = styled.div`
  * {
    position: absolute;
  }
`;

// export class PlaneSingletonTest {
//   static instance;

//   constructor(width, height) {
//     if (instance) {
//       return instance;
//     }

//     this.width = width;
//     this.height = height;
//     this.instance = this;
//   }

//   foo() {
//     // ...
//   }
// }

const DefaultSize = 1000;

export const Canvas = ({
  renderer,
  width = DefaultSize,
  height = DefaultSize
}) => {
  const ref = useRef();
  let unmount = false;
  const checkUnmount = () => unmount;
  useEffect(() => {
    const { current: canvas } = ref;
    const context = canvas.getContext("2d");
    renderer(height, width)(context, checkUnmount);
    return () => (unmount = true);
  });

  return pug`
    canvas(ref=ref width=width height=height)
`;
};
