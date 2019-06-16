import { PlainGravityParticle, PlainGravityFeatures } from "./GravityParticle";
import Vector, { Point } from "../vector";
import { connectDots } from "../draw";
import { PlaneDimensions } from "./plane";

const UPDATERS = {
  DRAW_ATTACHEMENTS: "drawSpringAttachements",
  SPRING_POINTS_OF_ATTACHEMENTS: "springAttachements"
};

export interface SpringFeatures extends PlainGravityFeatures {
  k: number;
  pointsOfAttachments: Vector[];
  drawAttachementsLines?: boolean;
  offset?: number;
}

interface Spring {
  features: SpringFeatures;
  attachTo(position: Vector): void;
}

const springUpdater = (spring: SpringWithGravity) => () => {
  spring.features.pointsOfAttachments.forEach((point: Vector) => {
    const distance = point.substractVector(spring.position);

    const distanceLenght = distance.getLength();

    distance.setLength(distanceLenght - spring.features.offset);

    const SpringAcceleration = distance.multiply(spring.features.k);
    spring.accelerate(SpringAcceleration);
  });
};

const drawLinesToAttachements = (spring: SpringWithGravity) => () => {
  spring.context.beginPath();
  spring.features.pointsOfAttachments.forEach((point: Vector) => {
    connectDots([spring.position.getCords(), point.getCords()]);
  });
  spring.context.stroke();
};

class SpringWithGravity extends PlainGravityParticle implements Spring {
  features: SpringFeatures;

  constructor(
    position: Point,
    features: SpringFeatures,
    renderer?: Function,
    planeDimensions?: PlaneDimensions
  ) {
    super(position, features, renderer, planeDimensions);
    this.features = {
      drawAttachementsLines: true,
      pointsOfAttachments: [],
      offset: 0,
      ...this.features,
      ...features
    };

    this.update.push({
      name: UPDATERS.SPRING_POINTS_OF_ATTACHEMENTS,
      updater: springUpdater(this)
    });
    if (this.features.drawAttachementsLines) {
      this.update.push({
        name: UPDATERS.DRAW_ATTACHEMENTS,
        updater: drawLinesToAttachements(this)
      });
    }
  }

  attachTo(position: Vector) {
    this.features.pointsOfAttachments.push(position);
  }
}

export default SpringWithGravity;
