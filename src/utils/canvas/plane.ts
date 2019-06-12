import { BoundriesSelector } from "../math";
import Controller from "./player";

export interface PlaneDimensions {
  width: number;
  height: number;
}

interface PlaneFeautres {
  dimensions?: PlaneDimensions;
  plainGravity?: boolean;
  boundaries?: BoundriesSelector;
  controller?: Controller;
}

const DefaultPlaneSize = 500;

export const PlaneDefaultDimensions = {
  width: DefaultPlaneSize,
  height: DefaultPlaneSize
};

export const PlaneDefaultBoundaries = {
  checkTop: false,
  checkBottom: false,
  checkLeft: false,
  checkRight: false
};

const PlaneFeautersDefault = {
  dimensions: PlaneDefaultDimensions,
  plainGravity: false,
  boundaries: PlaneDefaultBoundaries,
  controller: undefined
};

export class PlaneSingleton {
  static instance;
  features: PlaneFeautres;
  context: CanvasRenderingContext2D;

  constructor(
    features: PlaneFeautres = PlaneFeautersDefault,
    context?,
    reset: boolean = false
  ) {
    if (PlaneSingleton.instance && !reset) {
      return PlaneSingleton.instance;
    }

    const {
      dimensions = PlaneDefaultDimensions,
      plainGravity = false,
      boundaries = PlaneDefaultBoundaries
    } = features;

    this.features = {
      ...features,
      dimensions,
      plainGravity,
      boundaries
    };

    this.context = context;

    PlaneSingleton.instance = this;
  }
}
