import Home from "./pages/Home";
import FourOhFour from "./pages/FourOhFour";
import Portfolio from "./pages/Portfolio";
// import MathTab from "./pages/MathPage/";
import VectorTab from "./pages/VectorPage";

const PAGES = {
  "/": Home,
  "/404": FourOhFour,
  "/portfolio": Portfolio,
  // "/math": MathTab,
  "/vector": VectorTab
};

export const Routes = Object.keys(PAGES);

export default PAGES;
