import Home from "./pages/Home";
import FourOhFour from "./pages/FourOhFour";
import Portfolio from "./pages/Portfolio";
// import MathTab from "./pages/MathPage/";
import VectorTab from "./pages/VectorPage";
import SpingPage from "./pages/SpringPage";

const PAGES = {
  "/": Home,
  "/404": FourOhFour,
  "/portfolio": Portfolio,
  // "/math": MathTab,
  "/vector": VectorTab,
  "/spring": SpingPage
};

export const Routes = Object.keys(PAGES);

export default PAGES;
