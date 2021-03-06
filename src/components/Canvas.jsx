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
  let unmount = false;
  const checkUnmount = () => unmount;
  useEffect(() => {
    const { current: canvas } = ref;
    renderer(height, width)(canvas, checkUnmount);
    return () => (unmount = true);
  });

  return pug`
    canvas(ref=ref width=width height=height)
`;
};
