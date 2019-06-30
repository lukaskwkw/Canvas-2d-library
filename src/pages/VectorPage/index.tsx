import * as React from "react";
import { Canvas, Plane } from "../../components/Canvas";
// import { level } from "./level";
// import { fountain } from "./setups";
import OrbitingFountain from "../Levels/OrbitingFountain";
// import { bezier } from "./bezierVisualized";

const VectorTab = () => (
  <Plane>
    <Canvas renderer={OrbitingFountain()} />
  </Plane>
);

export default VectorTab;
