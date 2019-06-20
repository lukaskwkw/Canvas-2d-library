import Vector, { Point } from "../vector";
import { SpaceShip } from "./rendeners";
import {
  AdvancedGravityParticle,
  PlainGravityFeatures
} from "./GravityParticle";
import SpringWithGravity, { SpringFeatures } from "./spring";
import { PlayerJetEngineMovements, JetEngine } from "./playerMovements";

class PlayerMultiGravity extends AdvancedGravityParticle
  implements PlayerJetEngineMovements {
  angleHeading: number = 0;
  ignite: boolean;
  jetDrive: Vector;
  rotateDirection: number = 0;
  rotateValue: number = 0;
  jetFireLength: number = 0;

  constructor(
    position: Point,
    features: PlainGravityFeatures,
    renderer: Function = SpaceShip()
  ) {
    super(position, features, renderer);

    JetEngine.constructor(this, this);
    this.render = JetEngine.render(this, this);
  }
}

export class PlayerSpring extends SpringWithGravity
  implements PlayerJetEngineMovements {
  angleHeading: number = 0;
  ignite: boolean;
  jetDrive: Vector;
  rotateDirection: number = 0;
  rotateValue: number = 0;
  jetFireLength: number = 0;

  constructor(
    position: Point,
    features: SpringFeatures,
    renderer: Function = SpaceShip()
  ) {
    super(position, features, renderer);

    JetEngine.constructor(this, this);
    this.render = JetEngine.render(this, this);
  }
}

export default PlayerMultiGravity;
