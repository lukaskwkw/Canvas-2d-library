import * as React from "react";
import { Canvas, Plane } from "../../components/Canvas";
import setup from "./setup";
import { Helmet } from "react-helmet";

const Floaters = () => (
  <Plane>
    <Helmet>
      <title>Floaters</title>
    </Helmet>
    <Canvas renderer={setup()} />
  </Plane>
);

export default Floaters;
