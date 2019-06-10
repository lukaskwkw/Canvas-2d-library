// import React from "react";
import * as React from "react";
import { Canvas, Plane } from "../../components/Canvas";
import { level } from "./level";
// import { fountain } from "./setups";

const topOffset = 80;
const getCanvasWidth = () =>
  typeof window !== "undefined" ? window.innerWidth : 1000;
const getCanvasHeight = () =>
  typeof window !== "undefined" ? window.innerHeight - topOffset : 1000;

const VectorTab = () => (
  <Plane>
    <Canvas
      width={getCanvasWidth()}
      height={getCanvasHeight()}
      renderer={level()}
    />
  </Plane>
);

export default VectorTab;
