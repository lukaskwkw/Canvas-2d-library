import Particle, { ParticleFeatures } from "./particle";
import Vector, { Point } from "../vector";
import { PlaneSingleton } from "./plane";
import { SpaceShip } from "./rendeners";
import { moveToOtherSide } from "../math";

const rotateSpeedRatio = () => 0.02 + Math.random() * 0.015;
const rotateBalancer = () => 0.99;
const defaultIgniteRatio = 0.005;
const maxIgniteValue = 0.1;
const maxRotateValue = 0.2;

const RotateFix = Math.PI / 2;

class Player extends Particle {
  context: any;
  angle: number = 0;
  ignite: boolean;
  jetDrive: Vector = new Vector(0, defaultIgniteRatio);
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
    if (key === "ArrowRight" && this.rotateValue < maxRotateValue) {
      this.rotateValue += rotateSpeedRatio();
    }
    if (key === "ArrowLeft" && this.rotateValue > -maxRotateValue) {
      this.rotateValue -= rotateSpeedRatio();
    }
  }

  defaultKeyUp(key: string) {
    if (key === "ArrowUp") {
      this.jetDrive.setLength(defaultIgniteRatio);
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

  checkBoundaries(position, size) {
    moveToOtherSide(position, size, { checkBottom: true });
  }

  render() {
    this.update();
    const { x, y } = this.position.getCords();
    const { size, fillColor } = this.features;
    this.rotateValue *= rotateBalancer();
    this.angle += this.rotateValue;
    this.jetDrive.setAngle(this.angle - RotateFix);
    let jetFireLength;
    this.checkBoundaries(this.position, size);

    if (this.ignite) {
      jetFireLength = this.jetDrive.getLength();
      if (jetFireLength < maxIgniteValue) {
        this.jetDrive.setLength(jetFireLength + defaultIgniteRatio);
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
