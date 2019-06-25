import * as React from "react";
import { Canvas, Plane } from "../../components/Canvas";
import { setup } from "./setup";
import { Helmet } from "react-helmet";

const VectorTab = () => (
  <Plane>
    <Helmet>
      <title>Spring page</title>
    </Helmet>
    <Canvas renderer={setup()} />
  </Plane>
);

export default VectorTab;
