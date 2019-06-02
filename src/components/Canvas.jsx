import React, { useEffect, useRef } from "react";
import styled from "styled-components";

export const Plane = styled.div`
  * {
    position: absolute;
  }
`;

const DefaultSize = 1000;

export const Canvas = ({
  renderer,
  width = DefaultSize,
  height = DefaultSize
}) => {
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
