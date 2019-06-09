import Particle, { ParticleFeatures } from "./particle";
import Vector, { Point } from "../vector";
import { PlaneSingleton } from "./plane";
import { SpaceShip } from "./rendeners";

const rotateSpeed = () => 0.01 + Math.random() * 0.015;
// const rotateSpeed = () => 0.4;
// const rotateBalancer = () => 0.5 + Math.random() * 0.44;
const rotateBalancer = () => 0.99;
const defaultIgniteValue = 0.005;
const maxIgniteValue = 0.1;
const maxRotateValue = 0.2;

const RotateFix = Math.PI / 2;

class Player extends Particle {
  context: any;
  angle: number = 0;
  ignite: boolean;
  jetDrive: Vector = new Vector(0, defaultIgniteValue);
  rotateValue: number = 0;

  setIgnite(ignite) {
    this.ignite = ignite;
  }

  setRotateValue(value) {
    this.rotateValue = value;
  }

  defaultKeyDown(key: string) {
    if (key === "ArrowUp") {
      this.setIgnite(true);
    }
    if (key === "ArrowRight") {
      // this.setRotateValue(rotateSpeed());
      if (this.rotateValue < maxRotateValue) {
        this.rotateValue += rotateSpeed();
        // console.info(this.rotateValue);
      }
    }
    if (key === "ArrowLeft") {
      // this.setRotateValue(-rotateSpeed());
      if (this.rotateValue > -maxRotateValue) {
        this.rotateValue -= rotateSpeed();
      }
    }
  }

  defaultKeyUp(key: string) {
    if (key === "ArrowUp") {
      this.jetDrive.setLength(defaultIgniteValue);
      this.setIgnite(false);
    }
  }

  constructor(position: Point, features: ParticleFeatures) {
    super(position, features);
    const { context } = new PlaneSingleton();
    this.context = context;

    this.renderer = SpaceShip();

    if (typeof window === "undefined") {
      return;
    }
    window.addEventListener("keydown", ({ key }: KeyboardEvent) =>
      this.defaultKeyDown(key)
    );
    window.addEventListener("keyup", ({ key }: KeyboardEvent) =>
      this.defaultKeyUp(key)
    );
  }

  render() {
    this.update();
    const { x, y } = this.position.getCords();
    const { size, fillColor } = this.features;
    this.rotateValue *= rotateBalancer();
    this.angle += this.rotateValue;
    this.jetDrive.setAngle(this.angle - RotateFix);
    let jetFireLength;
    if (this.ignite) {
      jetFireLength = this.jetDrive.getLength();
      // console.info({ drive: jetFireLength });
      // console.info({ angle: jetDrive.getAngle() });
      if (jetFireLength < maxIgniteValue) {
        this.jetDrive.setLength(jetFireLength + defaultIgniteValue);
      }
      this.accelerate(this.jetDrive);
    }
    this.renderer(
      x,
      y,
      size,
      fillColor,
      this.angle,
      jetFireLength,
      this.rotateValue
    );
  }
}

export default Player;

// const defaultKeyDown = (particle: Particle) => {
//   const jetDrive = new Vector(0, 1);
//   const rotateEngineLeft = new Vector(0, 1);
//   particle.features.angle = Math.PI;
//   // rotateEngineLeft.setAngle()

//   jetDrive.setAngle(particle.features.angle - Math.PI / 2);
//   console.info({ jAngle: (jetDrive.getAngle() * 180) / Math.PI });
//   return (key: string) => {
//     console.info({ key });
//     if (key === "ArrowUp") {
//       console.info({ angle: jetDrive.getAngle() });
//       jetDrive.setLength(1);
//       particle.accelerate(jetDrive);
//     }
//     if (key === "ArrowDown") {
//       jetDrive.setAngle(particle.features.angle - (Math.PI / 2) * -1);
//       jetDrive.setLength(0.2);
//       particle.accelerate(jetDrive);
//     }
//     if (key === "ArrowRight") {
//       jetDrive.setAngle(particle.features.angle - Math.PI / 2 + RotateSpeed);
//       particle.setAngle(particle.features.angle + RotateSpeed);
//       console.info({
//         angle: jetDrive.getAngle(),
//         pAngle: particle.features.angle
//       });
//       // particle.accelerate(jetDrive);
//     }
//     if (key === "ArrowLeft") {
//       console.info({
//         angle: jetDrive.getAngle(),
//         pAngle: particle.features.angle
//       });

//       jetDrive.setAngle(particle.features.angle - Math.PI / 2 - RotateSpeed);
//       particle.setAngle(particle.features.angle - RotateSpeed);
//       // particle.accelerate(jetDrive);
//     }
//   };
// };

// const defaultKeyUp = (particle: Particle) => {
//   const jetDrive = new Vector(0, 0);
//   jetDrive.setAngle(particle.features.angle);
//   return (key: string) => {
//     // if (key === "ArrowUp") {
//     //   jetDrive.setLength(0);
//     //   particle.accelerate(jetDrive);
//     // }
//     // if (key === "ArrowDown") {
//     //   jetDrive.setLength(-1);
//     //   particle.accelerate(jetDrive);
//     // }
//   };
// };

// class Controller {
//   keydown: any;
//   keyup: any;
//   constructor(
//     particle,
//     onKeyDown = defaultKeyDown(particle),
//     onKeyUp = defaultKeyUp(particle)
//   ) {
//     if (typeof window === "undefined") {
//       return;
//     }

//     window.addEventListener("keydown", ({ key }: KeyboardEvent) =>
//       onKeyDown(key)
//     );
//     window.addEventListener("keyup", ({ key }: KeyboardEvent) => onKeyUp(key));
//   }
// }

// export default Controller;
