import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

import Header from "./components/Header";

const App = () => (
  <>
    <Header />
    <p>Lorem ipsum dolor</p>
  </>
);

ReactDOM.render(<App />, document.getElementById("app"));
