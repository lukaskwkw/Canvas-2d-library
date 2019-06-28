import Particle from "./particle";
import Vector, { Point } from "../vector";

const inCircleBoundary = (
  circlePos: Point,
  radius: number,
  pointToCheck: Point
): boolean => {
  const circleXMin = circlePos.x - radius;
  const circleXMax = circlePos.x + radius;
  const circleYMin = circlePos.y - radius;
  const circleYMax = circlePos.y + radius;

  if (
    pointToCheck.x <= circleXMax &&
    pointToCheck.x >= circleXMin &&
    pointToCheck.y <= circleYMax &&
    pointToCheck.y >= circleYMin
  ) {
    return true;
  }

  return false;
};

export const mousePointerCollisionUpdater = (
  particles: Particle[],
  canvas: HTMLCanvasElement
) => {
  particles.forEach((particle: Particle) => {
    particle.features["prevColor"] = particle.features.fillColor;
    particle["prevUpdate"] = particle.update;
  });

  let leftDown = false;
  canvas.addEventListener(
    "mousedown",
    (event: MouseEvent) => (leftDown = event.which === 1 && true)
  );
  canvas.addEventListener(
    "mouseup",
    (event: MouseEvent) => (leftDown = event.which === 1 && false)
  );

  let movingParticle: Particle = null;

  return () => {
    canvas.addEventListener("mousemove", (event: MouseEvent) => {
      if (leftDown && movingParticle) {
        movingParticle.setPosition({
          x: event.clientX - canvas.offsetLeft,
          y: event.clientY - canvas.offsetTop
        });
        return;
      }

      particles.forEach((particle: Particle) => {
        if (
          inCircleBoundary(particle.getPosition(), particle.features.size, {
            x: event.clientX - canvas.offsetLeft,
            y: event.clientY - canvas.offsetTop
          })
        ) {
          if (leftDown) {
            particle.features.fillColor = "purple";
            movingParticle = particle;
            particle.update = [];
            return;
          }
          movingParticle = null;
          particle.update = particle["prevUpdate"];
          particle.features.fillColor = "red";
        } else if (!leftDown) {
          // } else if (particle.features.hasOwnProperty("prevColor")) {
          movingParticle = null;
          particle.features.fillColor = particle.features["prevColor"];
          particle.update = particle["prevUpdate"];
        }
      });
    });
  };
};

export const touchCollisionUpdater = (
  particles: Particle[],
  canvas: HTMLCanvasElement
) => {
  particles.forEach((particle: Particle) => {
    particle.features["prevColor"] = particle.features.fillColor;
    particle["prevUpdate"] = particle.update;
  });

  let pressed = false;

  let movingParticle: Particle = null;

  canvas.addEventListener("touchstart", () => (pressed = true));
  canvas.addEventListener("touchend", () => {
    movingParticle.update = movingParticle["prevUpdate"];
    movingParticle.features.fillColor = movingParticle.features["prevColor"];
    movingParticle = null;
    pressed = false;
  });

  return () => {
    canvas.addEventListener("touchmove", (event: TouchEvent) => {
      if (pressed && movingParticle) {
        movingParticle.setPosition({
          x: event.targetTouches[0].clientX - canvas.offsetLeft,
          y: event.targetTouches[0].clientY - canvas.offsetTop
        });
        return;
      }

      particles.forEach((particle: Particle) => {
        if (
          inCircleBoundary(particle.getPosition(), particle.features.size, {
            x: event.targetTouches[0].clientX - canvas.offsetLeft,
            y: event.targetTouches[0].clientY - canvas.offsetTop
          }) &&
          !movingParticle
        ) {
          particle.features.fillColor = "purple";
          movingParticle = particle;
          particle.update = [];
        }
      });
    });
  };
};
