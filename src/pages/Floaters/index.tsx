import * as React from "react";
import { Canvas, Plane } from "../../components/Canvas";
import setup from "./setup";

const Floaters = () => (
  <Plane>
    <Canvas renderer={setup()} />
  </Plane>
);

export default Floaters;
