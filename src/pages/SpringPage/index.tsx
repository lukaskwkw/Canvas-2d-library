import * as React from "react";
import { Canvas, Plane } from "../../components/Canvas";
import { setup } from "./setup";

const VectorTab = () => (
  <Plane>
    <Canvas renderer={setup()} />
  </Plane>
);

export default VectorTab;
