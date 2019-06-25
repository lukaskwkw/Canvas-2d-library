import * as React from "react";
import { Canvas, Plane } from "../../components/Canvas";
// import { level } from "./level";
// import { fountain } from "./setups";
import { orbitingFountain } from "./orbitingFountain";
// import { bezier } from "./bezierVisualized";

const VectorTab = () => (
  <Plane>
    <Canvas renderer={orbitingFountain()} />
  </Plane>
);

export default VectorTab;
