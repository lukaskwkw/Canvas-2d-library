import React from "react";
import ReactDOM from "react-dom";
import { PropTypes } from "prop-types";

import "./index.scss";
import PAGES from "./routes";
import Header from "./components/Header";

const App = ({ pathname }) => {
  const Handler = PAGES[pathname] || PAGES["404"];
  return (
    <>
      <Header />
      <p>Loreme ipsum dolores</p>
      <Handler />
    </>
  );
};

App.propTypes = {
  pathname: PropTypes.oneOf(Object.keys(PAGES)).isRequired
};

if (typeof window !== "undefined") {
  ReactDOM.hydrate(
    <App pathname={location.pathname} />,
    document.getElementById("app")
  );
}

export default App;
