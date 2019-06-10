import Particle from "../../utils/canvas/particle";
import { PlaneSingleton } from "../../utils/canvas/plane";
import { circlePulse } from "../../utils/canvas/rendeners";
import Player from "../../utils/canvas/player";

export const level = () => (height, width) => (context, checkUnmount) => {
  new PlaneSingleton(
    { dimensions: { width, height }, boundaries: { checkBottom: true } },
    context,
    true
  );

  const Sun = new Particle(
    { x: width / 2, y: height / 2 },
    {
      size: 15,
      weight: 210,
      fillColor: "rgba(200,10,10, 0.5)",
      speed: 0
    },
    circlePulse(30)
  );

  const Satelite = new Particle(
    { x: width / 1.35, y: height / 2 },
    { size: 5, weight: 50, direction: -Math.PI / 2, speed: 5 }
  );

  const Ship = new Player(
    { x: width / 1.1, y: height / 2 },
    { size: 20, weight: 1, direction: -Math.PI / 2, speed: 8 }
  );

  Satelite.setOrbiteTowards(Sun);
  Satelite.setOrbiteTowards(Ship);
  Ship.setOrbiteTowards(Sun);
  Ship.setOrbiteTowards(Satelite);

  const render = () => {
    if (checkUnmount()) {
      return;
    }

    context.clearRect(0, 0, width, height);
    Ship.render();
    Satelite.render();
    Sun.render();

    requestAnimationFrame(render);
  };

  render();
};
