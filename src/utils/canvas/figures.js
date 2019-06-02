import { clearArc, CircleCleanFix } from "./trygonometry";
import Vector from "../vector";

export const Circle = context => (originX, originY, size = 20) => {
  return {
    clear: (x = originX, y = originY) =>
      clearArc(context)(x, y, size + CircleCleanFix, 0, Math.PI * 2, false),
    renderer: (x = originX, y = originY) => {
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2, false);
      context.fill();
    }
  };
};

export const Particle = (x, y, speed, direction, renderer, clearFunc) => {
  let position = new Vector(x, y);
  let velocity = new Vector(0, 0);
  velocity.setLength(speed);
  velocity.setAngle(direction);

  const update = () => position.addTo(velocity);

  const render = () => {
    clearFunc(position.getX(), position.getY());
    update();
    renderer(position.getX(), position.getY());
  };

  return {
    render,
    position,
    velocity,
    update
  };
};
