import Vector from "../vector";
import VelocityParticle from "./VelocityParticle";
import { UpdateObject } from "./particle";

const rotateSpeedRatio = () => 0.002 + Math.random() * 0.0015;
const rotateBalancer = () => 0.99;
const defaultIgniteRatio = 0.1;
const maxIgniteValue = 10;
// const maxRotateValue = 0.02;

const RotateFix = Math.PI / 2;

const RotateEngine = {
  left: -1,
  none: 0,
  right: 1
};

export const JetEngine = {
  constructor: (
    particle: VelocityParticle,
    player: PlayerJetEngineMovements
  ) => {
    if (typeof window === "undefined") {
      return;
    }
    player.jetDrive = new Vector(0, defaultIgniteRatio);

    window.addEventListener("keydown", ({ key }: KeyboardEvent) =>
      JetEngine.defaultKeyDown(player, key)
    );
    window.addEventListener("keyup", ({ key }: KeyboardEvent) =>
      JetEngine.defaultKeyUp(player, key)
    );

    particle.update.push({
      name: "rotation",
      updater: JetEngine.playerRotationUpdater(player)
    });
    particle.update.push({
      name: "acceleration",
      updater: JetEngine.playerAccelerationUpdater(player)
    });
  },
  render: (
    particle: VelocityParticle,
    player: PlayerJetEngineMovements
  ) => () => {
    particle.update.forEach(({ updater }: UpdateObject) => {
      updater();
    });

    const { x, y } = particle.getPosition();
    const { size, fillColor } = particle.features;

    particle.renderer(
      x,
      y,
      size,
      fillColor,
      player.angleHeading,
      player.jetFireLength,
      player.rotateValue
    );
  },
  defaultKeyDown: (player: PlayerJetEngineMovements, key: string) => {
    if (key === "ArrowUp") {
      player.ignite = true;
    }
    if (key === "ArrowRight") {
      player.rotateDirection = RotateEngine.right;
    }
    if (key === "ArrowLeft") {
      player.rotateDirection = RotateEngine.left;
    }
  },
  defaultKeyUp: (player: PlayerJetEngineMovements, key: string) => {
    if (key === "ArrowUp") {
      player.jetDrive.setLength(defaultIgniteRatio);
      player.ignite = false;
    }
    if (key === "ArrowRight") {
      player.rotateDirection = RotateEngine.none;
    }
    if (key === "ArrowLeft") {
      player.rotateDirection = RotateEngine.none;
    }
  },
  playerRotationUpdater: (player: PlayerJetEngineMovements) => () => {
    player.rotateValue *= rotateBalancer();
    player.angleHeading += player.rotateValue;
    player.jetDrive.setAngle(player.angleHeading - RotateFix);
    if (player.rotateDirection !== 0) {
      player.rotateValue +=
        player.rotateDirection === 1 ? rotateSpeedRatio() : -rotateSpeedRatio();
    }
  },
  playerAccelerationUpdater: (player: PlayerJetEngineMovements) => () => {
    player.jetFireLength = 0;
    if (player.ignite) {
      player.jetFireLength = player.jetDrive.getLength();
      if (player.jetFireLength < maxIgniteValue) {
        player.jetDrive.setLength(player.jetFireLength + defaultIgniteRatio);
      }
      player.accelerate(player.jetDrive);
    }
  }
};

export interface PlayerJetEngineMovements {
  accelerate: Function;
  jetFireLength: number;
  ignite: boolean; // Checks whether keydown is pressed; true => keydown, false => keyup
  angleHeading: number;
  rotateValue: number;
  jetDrive: Vector;
  rotateDirection: number; // Checks whether keydown is pressed if 0 => keyup => no rotate engine works; -1 => left; 1 => right
}
