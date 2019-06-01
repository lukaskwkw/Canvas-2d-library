import Home from "./pages/Home";
import FourOhFour from "./pages/FourOhFour";
import Portfolio from "./pages/Portfolio";
import MathTab from "./pages/math";

const PAGES = {
  "/": Home,
  "/404": FourOhFour,
  "/portfolio": Portfolio,
  "/math": MathTab
};

export const Routes = Object.keys(PAGES);

export default PAGES;
