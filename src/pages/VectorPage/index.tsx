// import React from "react";
import * as React from "react";
import { Canvas, Plane } from "../../components/Canvas";
import { fountain } from "./functions";

const topOffset = 80;
const getCanvasWidth = () => window.innerWidth;
const getCanvasHeight = () => window.innerHeight - topOffset;

const VectorTab = () => (
  <Plane>
    <Canvas
      width={getCanvasWidth()}
      height={getCanvasHeight()}
      renderer={fountain()}
    />
  </Plane>
);

export default VectorTab;
