import { BoundriesSelector } from "../math";

export interface PlaneDimensions {
  width: number;
  height: number;
}

interface PlaneFeautres {
  dimensions?: PlaneDimensions;
  plainGravity?: boolean;
  boundaries?: BoundriesSelector;
}

const DefaultPlaneSize = 500;

const PlaneDefaultDimensions = {
  width: DefaultPlaneSize,
  height: DefaultPlaneSize
};

const PlaneDefaultBoundaries = {
  checkTop: false,
  checkBottom: false,
  checkLeft: false,
  checkRight: false
};

const PlaneFeautersDefault = {
  dimensions: PlaneDefaultDimensions,
  plainGravity: false,
  boundaries: PlaneDefaultBoundaries
};

export class PlaneSingleton {
  static instance;
  features: PlaneFeautres;
  context: any;

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
      dimensions,
      plainGravity,
      boundaries
    };

    this.context = context;

    PlaneSingleton.instance = this;
  }
}
